// ==UserScript==
// @name         阿里云盘-电视剧批量重命名工具-剧集刮削
// @namespace    http://tampermonkey.net/
// @version      2.05
// @description  用于阿里云盘批量修改文件名，主要为 Filmly 适配阿里云盘上的不规则电视剧命名刮削准备，代码抄袭自 wdwy 发布的另外一个脚本
// @author       wdwy
// @match        https://www.aliyundrive.com/drive/folder/*
// @match        https://www.aliyundrive.com/drive/*
// @match        https://www.aliyundrive.com/drive/legacy/folder/*
// @match        https://www.aliyundrive.com/drive/legacy/
// @match        https://www.aliyundrive.com/drive/file/backup/*
// @match        https://www.aliyundrive.com/drive/file/backup/
// @match        https://www.aliyundrive.com/drive/file/*
// @match        https://www.alipan.com/drive/folder/*
// @match        https://www.alipan.com/drive/*
// @match        https://www.alipan.com/drive/legacy/folder/*
// @match        https://www.alipan.com/drive/legacy/
// @match        https://www.alipan.com/drive/file/backup/*
// @match        https://www.alipan.com/drive/file/backup/
// @match        https://www.alipan.com/drive/file/*
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-body
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503840/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E7%94%B5%E8%A7%86%E5%89%A7%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E5%B7%A5%E5%85%B7-%E5%89%A7%E9%9B%86%E5%88%AE%E5%89%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503840/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E7%94%B5%E8%A7%86%E5%89%A7%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D%E5%B7%A5%E5%85%B7-%E5%89%A7%E9%9B%86%E5%88%AE%E5%89%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;

    var obj = {
        files: [],
        url: location.href,
    };

    var op1 = `
        <div class="wrap--MfXl2" >
            <div class="container--30UDJ" style="line-height: 40px;">
                <div class="content--nfnm6" style="padding: 32px;">
                    <div style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                        <text style="width:20%;">文件夹：</text>
                        <text class="batch-path"/>
                    </div>

                    <table style="width:100%;border:1px solid black;">
                      <tr style="border:1px solid black;">
                        <th style="border:1px solid black;">原文件</th>
                        <th style="border:1px solid black;">42.mp4</th>
                        <th style="border:1px solid black;">回家的诱惑-第60集-720P(avc1F).mp4</th>
                      </tr>
                      <tr style="border:1px solid black;">
                        <td style="border:1px solid black;">模板</td>
                        <td style="border:1px solid black;"><text style="color:yellow;background-color:gray">$$.mp4</text></td>
                        <td style="border:1px solid black;">
                        <text>回家的诱惑-第</text>
                        <text style="color:yellow;background-color:gray">$$</text>
                        <text>集-720P(avc1F).mp4</text>
                        </td>
                      </tr>
                      <tr style="border:1px solid black;">
                        <td style="border:1px solid black;">结果</td>
                        <td style="border:1px solid black;">回家的诱惑.S01E01.mp4</td>
                        <td style="border:1px solid black;">回家的诱惑.S01E01.mp4</td>
                      </tr>
                    </table>


                    <div style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                        <text style="width:20%; ">模板：</text>
                        <input style="width:400px;" class="batch-before" type="text" value="$$" />
                    </div>

                    <div style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                        <text style="width:20%;">年份：</text>
                        <input style="width:400px;" class="input-years" type="text" value="" placeholder="选填" />
                    </div>

                    <div style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                        <text style="width:20%;">剧名：</text>
                        <input style="width:400px;" class="batch-after" type="text" value="" >
                    </div>
                    <div style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                        <text style="width:20%; ">季数：</text>
                        <select id="select-season" style="width: 120px;text-align: center; " name="choice">
                           <option value="1" selected>1</option>
                           <option value="2">2</option>
                           <option value="3">3</option>
                           <option value="4">4</option>
                           <option value="5">5</option>
                           <option value="6">6</option>
                           <option value="7">7</option>
                           <option value="8">8</option>
                           <option value="9">9</option>
                        </select>
                    </div>

                    <div class="group--20rOb" style="display:flex; width:100%; text-align:center; padding:10px 5px;">
                         <text style="width:20%;">预览：</text>
                         <text id="preview-text"></text>
                    </div>

                </div>
                <div style="display:flex; justify-content:center">
                    <button class="button--WC7or primary--NVxfK small--e7LRt batch-modify" style="height: 48px;min-width: 96px;">修改</button>
                </div>
            </div> <!-- container -->
        </div> <!-- wrap -->
    `;


    obj.reset = function () {
        obj.files = [];
        obj.url = location.href;
    };

    obj.initBatchButton = function () {
        if ($(".button--batch").length) {
            return;
        }
        if ($("#root header").length) {
            var html = '';
            html += '<div style="margin:0px 8px;"></div><button class="button--WC7or primary--NVxfK small--e7LRt button--batch">批量修改</button>';
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
                    let { response, responseURL } = this;
                    try { response = JSON.parse(response) } catch (error) { };
                    if (responseURL.endsWith("/file/get_path")) {
                        obj.initBatchButton();

                        // 设置路径名
                        if (response?.items) {
                            obj.path = response.items.reverse().reduce((path, item) => path + item.name + "/", "/");
                        }

                        if(response?.items){
                            obj.TVname = response.items[response.items.length-1].name
                        }
                    }else if (responseURL.indexOf("/file/list") > 0) {
                        // 将 video 添加到 obj.files
                        if (response && response.items) {
                            if(obj.url && obj.url == location.href) {
                                obj.files = obj.files.concat(response.items.filter(item=> item.category ==='video' ));
                            }else {
                                obj.reset();
                                obj.files = response.items.filter(item=> item.category ==='video')
                            }
                        }
                        // 确定 file_extension
                        obj.fileExtensions = [...new Set(obj.files.filter(item=> item.category ==='video').map(file => file.file_extension))];
                    }
                }
            }, false);
            send.apply(this, arguments);
        };
    };

    obj.showModifyPage = function() {
        //滚动到底，自动获取所有文件
        const draggableElement = document.querySelector('.scroller---esn7');
        draggableElement.scrollTop = draggableElement.scrollHeight;

        var html = `
        <div class="ant-modal-root ant-modal-batch-modify">
            <div class="ant-modal-mask" style="z-index: 999999;"></div>
            <div tabindex="-1" class="ant-modal-wrap" role="dialog" style="z-index: 999999;">
                <div role="document" class="ant-modal modal-wrapper--5SA7y" style="width: 600px;  ">
                    <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>
                    <div class="ant-modal-content" style="height: auto;">
                        <div class="ant-modal-body" style="padding: 0px;">
                            <div class="icon-wrapper--TbIdu">
                                <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--KF5OX icon--D3kMk ">
                                    <svg viewBox="0 0 1024 1024">
                                        <use xlink:href="#PDSClose"></use>
                                    </svg>
                                </span>
                            </div>

                            <div  style="width:600px; height: auto;">
                                <div class="content--mUZVS batch-content-op" style="color:rgba(var(--context), 0.9); font-weight:bolder">
                                `+op1+`
                                </div> <!-- content -->
                            </div> <!-- container -->
                        </div>
                        <br/>
                    </div>
                    <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>
                </div>
            </div>
        </div>
            `;

        $("body").append(html);
        $(".ant-modal-batch-modify .icon-wrapper--TbIdu").on("click", function () {
            $(".ant-modal-batch-modify").remove();
        });
        $(".ant-modal-batch-modify .ant-modal-wrap").on("click", function (event) {
            if ($(event.target).closest(".ant-modal-content").length == 0) {
                $(".ant-modal-batch-modify").remove();
            }
        });


        $(".input-years").on("input",function(){
            obj.updatePreview()
        })

        $("#select-season").on("change",function(){
            obj.updatePreview()
        })
        $(".batch-after").on("input",function(){
            obj.updatePreview()
        })
        $(".batch-before").on("input",function(){
            const bef = $(this).val()

            const hasDoubleDoller = bef.indexOf("$$") === -1
            const modifyButton = $(".batch-modify")
            if(hasDoubleDoller){
                modifyButton.attr('disabled',true)
                modifyButton.css('background-color', 'gray');
                modifyButton.text("模板错误(需要包含 $$ 字符)");
            }else{
                modifyButton.attr('disabled',false)
                modifyButton.css('background-color', 'darkorange');
                modifyButton.text("修改");
            }
        })
        $(".batch-path").text(obj.path);
        $(".batch-modify").on("click", obj.batchModify);
        $(".batch-after").val(obj.TVname)

        obj.updateTemplate()
        obj.updatePreview()
    };

    obj.updateTemplate = function(){
        if(obj.files && obj.files.length > 0){
            const tvName = obj.files[0].name
            if(!$.isNumeric(tvName)){ // 不是简单的数字例如 40.mp4
                $(".batch-before").val(tvName)
                $(".batch-modify").attr('disabled',true);
                $(".batch-modify").css('background-color', 'gray');
                $(".batch-modify").text("模板错误(需要包含 $$ 字符)");
            }
        }else{
            console.log('empty file')
        }
    }

    obj.updatePreview = function() {
        const name = $(".batch-after").val()
        const years = $(".input-years").val()
        const season = $("#select-season").val()
        let text = ''
        for (const extension of obj.fileExtensions) {
            text += `${name}.S0${season}E01`;
            if(years){
                text += `.${years}`;
            }
            text += `.${extension}
            `
        }
        $("#preview-text").text(text);
    }


    obj.loading = function() {
        var html = `
            <div class="ant-modal-root ant-modal-loading">
                <div class="ant-modal-mask"></div>
            <div tabindex="-1" class="ant-modal-wrap" role="dialog">
                <div role="document" class="ant-modal modal-wrapper--5SA7y" style="width: 666px;">
                    <div class="ant-modal-content">
                        <div class="ant-modal-header">
                            <div class="ant-modal-title" id="rcDialogTitle1"></div>
            </div>
            <div class="ant-modal-body">
                <div class="content--nfnm6" style="color:rgba(var(--context), 0.9); font-weight:bolder">
                    批量处理中。。。<br/>
                    如果文件过多，请耐心等待弹框提示处理结果！
            <!-- 已完成处理&nbsp&nbsp&nbsp<div class="batch-modify-loading-num">0</div>&nbsp&nbsp&nbsp个文件 -->
            </div>
            </div>
            <br/>
                    <div class="ant-modal-footer">
                        <div class="footer--1GqVx" style="display:flex; justify-content:center;">
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


    obj.enableButton = function() {
        $(".batch-modify").attr('disabled',false);
    };

    obj.batchModify = function() {
        $(".batch-modify").attr('disabled',true);

        const years = $(".input-years").val()
        const season = $("#select-season").val()


        var nameBefore = $(".batch-before").val().split("$$");
        var nameAfter = $(".batch-after").val();
        var suff = $(".batch-after-suff").val();

        if(!obj.files) {
            alert("未从阿里云盘 /file/list 接口获取到 files ！");
            obj.enableButton();
            return;
        }

        if(nameBefore.length !== 2){
            alert("$$ 模版有误 ");
            obj.enableButton();
            return;
        }

        const left = nameBefore[0]
        const right = nameBefore[1]


        //解析token
        const token = JSON.parse(getToken());
        if(!token) {
            alert("请先登录！");
            obj.enableButton();
            return;
        }
        var tokenStr = token.token_type + " " + token.access_token;

        $(".ant-modal-batch-modify").remove();

        obj.loading();
        setTimeout(function() {
            let count = 0;
            for(let file of obj.files) {
                if(file.name.length < left.length + right.length ) continue;
                if(count > 200) break;

                const startIndex = file.name.indexOf(left) + left.length;
                const endIndex = file.name.lastIndexOf(right);


                // 提取出集数
                let episode = file.name.substring(startIndex, endIndex);
                if(!$.isNumeric(episode)) {
                    console.log('error: 集数不是 number , [',episode, ']   name:', file.name)
                    continue
                };

                if(episode.length < 2){
                    episode =`0${episode}`
                }

                let newName = `${nameAfter}.S0${season}E${episode}`;
                if(years){
                    newName += `.${years}`;
                }
                newName += `.${file.file_extension}`

                if(newName === file.name){
                    console.log('相同的文件名, 无需修改, 跳过')
                    continue
                }



                obj.ajaxModify(file, newName, tokenStr);
                count++;
            }

            //$(".ant-modal-batch-modify").remove();
            $(".ant-modal-loading").remove();
            alert("完成修改【"+count+"】个文件");

            setTimeout(function() {window.location.reload()}, 100);
        }, 0);
    }

    function getToken() {
        let token = localStorage.getItem("token");
        if(isBlank(token)) {
            token = sessionStorage.getItem("token");
            if(isBlank(token)) {
                token = getCookie("token");
            }
        }
        return token;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
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


    obj.init();
    setTimeout(obj.initBatchButton, 1000);

})();
