// ==UserScript==
// @name         阿里云盘-批量修改文件名-剧集刮削
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  用于阿里云盘批量修改文件名，主要为剧集刮削准备
// @author       psbc
// @match        https://www.aliyundrive.com/drive/folder/*
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459908/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%90%8D-%E5%89%A7%E9%9B%86%E5%88%AE%E5%89%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/459908/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%90%8D-%E5%89%A7%E9%9B%86%E5%88%AE%E5%89%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;

    var obj = {
        files: [],
        randomFillParam: -1,
        url: location.href
    };

    obj.reset = function () {
        obj.files = [];
        obj.randomFillParam = -1;
        obj.url = location.href;
    };

    obj.initBatchButton = function () {
        if ($(".button--batch").length) {
            return;
        }
        if ($("#root header").length) {
            var html = '';
            html += '<div style="margin:0px 8px;"></div><button class="button--2Aa4u primary--3AJe5 small---B8mi button--batch">批量修改</button>';
            $("#root header:eq(0)").append(html);
            $(".button--batch").on("click", obj.showModifyPage);
        }else {
            setTimeout(obj.initBatchButton, 1000);
        }
    };

    obj.init = function () {
        var send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(data) {
            this.addEventListener("load", function(event) {
                if(this.readyState == 4 && this.status == 200) {
                    var response = this.response, responseURL = this.responseURL;
                    try { response = JSON.parse(response) } catch (error) { };
                    if (responseURL.endsWith("/file/get_path")) {
                        obj.initBatchButton();
                        //设置路径名
                        if (response instanceof Object && response.items) {
                            obj.path = "/";
                            var items = response.items;
                            for(var i=items.length-1; i>=0; i--) {
                                obj.path += items[i].name+"/";
                            }
                        }
                    }else if (responseURL.indexOf("/file/list") > 0) {
                        //if (document.querySelector(".ant-modal-mask")) {
                            //排除【保存 移动 等行为触发】
                            //return;
                        //}
                        if (response && response.items) {
                            if(obj.url && obj.url == location.href) {
                                obj.files = obj.files.concat(response.items);
                            }else {
                                obj.reset();
                                obj.files = response.items;
                            }
                        }
                    }
                }
            }, false);
            send.apply(this, arguments);
        };
    };

    obj.showModifyPage = function() {
        //滚动到底，自动获取所有文件
        obj.pageScroll();

        var html = `
            <div class="ant-modal-root ant-modal-batch-modify">
                <div class="ant-modal-mask"></div>
                <div tabindex="-1" class="ant-modal-wrap" role="dialog">
                    <div role="document" class="ant-modal modal-wrapper--2yJKO" style="width: 666px;">
                        <div class="ant-modal-content">
                            <div class="ant-modal-header">
                                <div class="ant-modal-title" id="rcDialogTitle1">扩展：批量重命名剧集</div>
                            </div>
                            <div class="ant-modal-body">
                                <div class="icon-wrapper--3dbbo">
                                    <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--33bP0 icon--d-ejA ">
                                        <svg viewBox="0 0 1024 1024">
                                            <use xlink:href="#PDSClose"></use>
                                        </svg>
                                    </span>
                                </div>
                                <div class="content-wrapper--1_WJv" style="color:rgba(var(--context), 0.9); font-weight:bolder">
                                    <!-- <div class="cover--2pw-Z">
                                        <div class="file-cover--37ssA" data-size="XL">
                                            <img alt="others" class="fileicon--2Klqk fileicon--vNn4M " draggable="false" src="https://img.alicdn.com/imgextra/i1/O1CN01NVSzRz25VFRGlsewQ_!!6000000007531-2-tps-140-140.png">
                                        </div>
                                    </div> -->

                                    <span style:"color:white">当前路径地址：</span>
                                    <input class="ant-input ant-input-borderless input--3oFR6 batch-path" type="text" value=""  disabled>
                                    <br/><br/>


                                    <div class="group--20rOb" style="width:100%; text-align:center; padding:10px 5px;">
                                    修改前名字模板：
                                    <input style="margin-bottom:8px" class="ant-input ant-input-borderless input--3oFR6 batch-before" type="text" value="" placeholder="使用$$标记集数，例如: show-name_xxx_E$02$_xxx">
                                    <button class="button--2Aa4u primary--3AJe5 small---B8mi batch-randomFill">随机填充</button>
                                    </div>
                                    <br/><br/>


                                    <div class="group--20rOb" style="width:100%; text-align:center; padding:10px 5px;">
                                    修改后名字模板：
                                    <input class="ant-input ant-input-borderless input--3oFR6 batch-after" type="text" value="" placeholder="前缀，按照格式[剧名.第x集.S01Exx], 例如: 剧名.第"><br/>
                                    <br/>
                                    <input class="ant-input ant-input-borderless input--3oFR6 batch-mid" type="text" value="" placeholder="中间，按照格式[剧名.第x集.S01Exx], 例如: 集.S01E"><br/>
                                    <br/>
                                    <input class="ant-input ant-input-borderless input--3oFR6 batch-after-suff" type="text" value="" placeholder="后缀，选填，影片参数信息，例如: 1080p_AAC">
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div class="ant-modal-footer">
                                <div class="footer--3Q0je" style="display:flex; justify-content:center;">
                                    <button style="float:left" class="button--2Aa4u primary--3AJe5 small---B8mi batch-clear">清空</button>
                                    &nbsp&nbsp&nbsp&nbsp&nbsp
                                    <button class="button--2Aa4u warn--3AJe5 small---B8mi batch-modify">修改</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;

        $("body").append(html);
        $(".ant-modal-batch-modify .icon-wrapper--3dbbo").one("click", function () {
            $(".ant-modal-batch-modify").remove();
        });
        $(".ant-modal-batch-modify .ant-modal-wrap").on("click", function (event) {
            if ($(event.target).closest(".ant-modal-content").length == 0) {
                $(".ant-modal-batch-modify").remove();
            }
        });
        $(".batch-path").val(obj.path);
        $(".batch-clear").on("click", obj.clear);
        $(".batch-modify").on("click", obj.batchModify);
        $(".batch-randomFill").on("click", obj.randomFill);
        $(".batch-origin-suff").on("click", obj.changeOriSuff);
        $(".batch-before").on("blur", obj.checkBefore);
    };

    obj.loading = function() {
        var html = `
            <div class="ant-modal-root ant-modal-loading">
                <div class="ant-modal-mask"></div>
                <div tabindex="-1" class="ant-modal-wrap" role="dialog">
                    <div role="document" class="ant-modal modal-wrapper--2yJKO" style="width: 666px;">
                        <div class="ant-modal-content">
                            <div class="ant-modal-header">
                                <div class="ant-modal-title" id="rcDialogTitle1"></div>
                            </div>
                            <div class="ant-modal-body">
                                <div class="content-wrapper--1_WJv" style="color:rgba(var(--context), 0.9); font-weight:bolder">
                                    批量处理中。。。<br/>
                                    如果文件过多，请耐心等待弹框提示处理结果！
                                    <!-- 已完成处理&nbsp&nbsp&nbsp<div class="batch-modify-loading-num">0</div>&nbsp&nbsp&nbsp个文件 -->
                                </div>
                            </div>
                            <br/>
                            <div class="ant-modal-footer">
                                <div class="footer--3Q0je" style="display:flex; justify-content:center;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("body").append(html);
    }

    obj.refreshLoading = function(num) {
        var loading = $(".batch-modify-loading-num");
        if(loading) loading.html(num);
        loading.get(0).innerHTML = loading.get(0).innerHTML;
    }

    obj.checkBefore = function() {
        var batchBefore = $(".batch-before").val();
        var pat = /\$[0-9]{1,4}\$/;
        if(isBlank(batchBefore) || !pat.test(batchBefore)) {
            $(".batch-origin-suff").prop("checked", false);
            $(".batch-after-suff").removeAttr("disabled");
            $(".batch-after-suff").val("");
            alert("请先正确标记集数！");
            return false;
        }

        return true;
    }

    obj.changeOriSuff = function() {
        var checked = false;
        if(checked) {
            if(!obj.checkBefore()) return;
            var batchBefore = $(".batch-before").val();
            $(".batch-after-suff").attr("disabled", "disabled");
            $(".batch-after-suff").val(batchBefore.substring(batchBefore.lastIndexOf("$")+1, batchBefore.length));
        }else {
            $(".batch-after-suff").removeAttr("disabled");
            $(".batch-after-suff").val("");
        }

    }

    obj.clear = function() {
        $(".batch-before").val("");
        $(".batch-after").val("");
        $(".batch-mid").val("");
        $(".batch-after-suff").val("");
    };

    obj.disableButton = function() {
        $(".batch-randomFill").attr('disabled',true);
        $(".batch-clear").attr('disabled',true);
        $(".batch-modify").attr('disabled',true);
    };

    obj.enableButton = function() {
        $(".batch-randomFill").attr('disabled',false);
        $(".batch-clear").attr('disabled',false);
        $(".batch-modify").attr('disabled',false);
    };

    obj.batchModify = function() {
        obj.disableButton();

        var nameBefore = $(".batch-before").val();
        var nameAfter = $(".batch-after").val();
        var nameMid = $(".batch-mid").val();
        var suff = $(".batch-after-suff").val();

        if(isBlank(nameBefore) || isBlank(nameAfter)) {
            alert("修改名字不能为空！");
            obj.enableButton();
            return;
        }

        if(nameBefore === nameAfter) {
            alert("修改前后名字不能一样！");
            obj.enableButton();
            return;
        }

        if(!obj.files) {
            alert("当前路径文件为空！");
            obj.enableButton();
            return;
        }

        //检查集数标记
        if(!obj.checkBefore()){
            obj.enableButton();
            return;
        }
        var pos = [];
        var cnt = 0;
        for(var i=0; i<nameBefore.length; i++) {
            if(nameBefore[i] == '$') {
                pos[cnt++] = i;
            }
        }
        if(cnt != 2) {
            alert("集数标记有误！");
            obj.enableButton();
            return;
        }

        //解析token
        var token = JSON.parse(localStorage.getItem("token"));
        if(!token) {
            alert("请先登录！");
            obj.enableButton();
            return;
        }
        var tokenStr = token.token_type + " " + token.access_token;
        var checked = false;

        $(".ant-modal-batch-modify").remove();
        obj.loading();
        setTimeout(function() {
            var count = 0;
            for(var f of obj.files) {
                //检查文件是否应该修改
                if(f.category != "video") continue;
                if(f.name.length < nameBefore.length-2) continue;
                if(count > 200) break;

                //拼接新名字
                var episode = f.name.substring(pos[0], pos[1]-1);
                if(!$.isNumeric(episode)) continue;
                var newName = nameAfter+episode;
                if(!isBlank(nameMid)) newName += nameMid + episode;
                if(checked) {
                    if(pos[1]-1 < f.name.length) newName += f.name.substring(pos[1]-1, f.name.length);
                }else {
                    if(!isBlank(suff)) newName += suff;
                    if(!isBlank(f.file_extension)) newName += "."+f.file_extension;
                }

                //console.log(f.name + " -> " + newName);
                obj.ajaxModify(f, newName, tokenStr);
                count++;
            }

            //$(".ant-modal-batch-modify").remove();
            $(".ant-modal-loading").remove();
            alert("完成修改【"+count+"】个文件");

            setTimeout(function() {window.location.reload()}, 100);
        }, 0);


    }

    obj.ajaxModify = function(file, newName, token) {
        $.ajax({
            type: "post",
            url: "https://api.aliyundrive.com/v3/file/update",
            data: JSON.stringify({
                "drive_id": file.drive_id,
                "file_id": file.file_id,
                "name": newName,
                "check_name_mode": "refuse"
            }),
            headers: {
                "authority": "api.aliyundrive.com",
                "authorization": token,
                "content-type": "application/json;charset=UTF-8"
            },
            async: false, //批量修改文件多时，无法预估请求时间，关闭异步保证所有文件修改成功
            success: function (response) {
                file.name = newName;
            },
            error: function (error) {
                console.error("modify error", error);
            }
        });
    }

    function isBlank(str) {
        if(str == null || str === '') return true;
        else if(str.trim() === '') return true;
        else return false;
    }

    obj.randomFill = function() {
        if(!obj.files) {
            alert("当前路径文件为空！");
            return;
        }

        var flag = true;
        for(var i=0; i<obj.files.length&&flag; i++) {
            obj.randomFillParam = (obj.randomFillParam+1) % obj.files.length;
            if(obj.files[obj.randomFillParam].category == "video") {
                flag = false;
            }
        }

        if(flag) {
            alert("没有vedio格式的文件！");
            return;
        }

        $(".batch-before").val(obj.files[obj.randomFillParam].name);
    }

    obj.pageScroll = function () {
        var parent = $(".grid-scroll--3o7hp");
        var son = $(".grid-scroll--3o7hp div:first");
        var changeHeight = 0;

        function loopScroll() {
            if(changeHeight < son.height()) {
                changeHeight = son.height();
                parent.get(0).scrollTop = changeHeight;
                //parent.animate({ scrollTop: changeHeight }, 20);
                console.log(parent.get(0).scrollTop);
            }else {
                clearInterval(intervalId);
                console.log('已经到底部了');
            }
        }

        var intervalId = setInterval(loopScroll, 600);
    }

    obj.init();
    setTimeout(obj.initBatchButton, 1000);

})();