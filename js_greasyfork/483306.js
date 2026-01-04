// ==UserScript==
// @name         阿里云盘-批量修改文件名
// @namespace    http://tampermonkey.net/
// @version      2.04.01
// @description  用于阿里云盘批量修改文件名，主要为剧集刮削准备
// @author       wdwy
// @modify_user   alone
// @match        https://www.aliyundrive.com/drive/folder/*
// @match        https://www.aliyundrive.com/drive/*
// @match        https://www.aliyundrive.com/drive/legacy/folder/*
// @match        https://www.aliyundrive.com/drive/legacy/
// @match        https://www.aliyundrive.com/drive/file/backup/*
// @match        https://www.aliyundrive.com/drive/file/backup/
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/483306/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/483306/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98-%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;

    var obj = {
        files: [],
        randomFillParam: -1,
        url: location.href,
        panel: 1
    };
    var base = {
      dom : {
        grid: "[class^=\"node-list-grid-view--\"]",
        list: "[class^=\"node-list-table-view--\"]",
        switch: "[class^=\"switch-wrapper--\"]"
      },
      getSelectedList() {
       try {
         let selectedList = [];
         let reactDom = document.querySelector(base.dom.list);
         let reactObj = base.findReact(reactDom, 1);
         let props = reactObj.pendingProps;
         if (props) {
           let fileList = props.dataSource || [];
           let selectedKeys = props.selectedKeys.split(',');
           fileList.forEach((val) => {
             if (selectedKeys.includes(val.fileId)) {
               selectedList.push(val);
             }
           });
         }
         return selectedList;
       } catch (e) {
         console.error('查找选中文件失败');
         return [];
       }
      },
      isOnlyFolder(selectList) {
          for (let i = 0; i < selectList.length; i++) {
              if (selectList[i].type === 'file') return false;
          }
          return true;
      },
      findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
      },
    };
    var op1 = `
        <div class="title--FVkIN">剧集重命名</div>
        <div class="wrap--MfXl2" >
            <div class="container--30UDJ">
                <div class="content--nfnm6" style="padding-left: 15px;padding-right: 15px;">

                    <span style:"color:white">当前路径地址：</span>
                    <input class="ant-input ant-input-borderless input--TWZaN batch-path" type="text" value="" disabled>
                    <br/><br/>

                    <div class="group--20rOb" style="width:100%; text-align:center; padding:10px 5px;">
                    修改前名字模板：
                    <input style="margin-bottom:8px" class="ant-input ant-input-borderless input--TWZaN batch-before" type="text" value="" placeholder="使用$$标记集数，例如: show-name_xxx_E$02$_xxx">
                    <button class="button--WC7or primary--NVxfK small--e7LRt batch-randomFill">随机填充</button>
                    </div>
                    <br/><br/>

                    <div class="group--20rOb" style="width:100%; text-align:center; padding:10px 5px;">
                    修改后名字模板：
                    <input class="ant-input ant-input-borderless input--TWZaN batch-after" type="text" value="" placeholder="前缀，按照格式[剧名_S季], 例如: show-name_S01"><br/>
                    <br/>
                    <div style="display:flex; justify-content:center;">
                        <div style="color:rgba(var(--context), 0.72); font-weight:normal">使用原始后缀</div>
                        <input style="margin-left:3px" class="input--1mW1D batch-origin-suff" type="checkbox" readonly="" value="">
                    </div>
                    <input class="ant-input ant-input-borderless input--TWZaN batch-after-suff" type="text" value="" placeholder="后缀，选填，影片参数信息，例如: 1080p_AAC">
                    </div>
                    <br/><br/>
                </div>
                <div class="footer--1GqVx" style="display:flex; justify-content:center;">
                    <button style="float:left" class="button--WC7or secondary--vRtFJ small--e7LRt batch-clear">清空</button>
                    &nbsp&nbsp&nbsp&nbsp&nbsp
                    <button class="button--WC7or primary--NVxfK small--e7LRt batch-modify">修改</button>
                </div>
            </div> <!-- container -->
        </div> <!-- wrap -->
    `;

    var op2 = `
        <div class="title--FVkIN">查找替换</div>
        <div class="wrap--MfXl2" >
            <div class="container--30UDJ">
                <div class="content--nfnm6" style="padding-left: 15px;padding-right: 15px;">

                    <span style:"color:white">当前路径地址：</span>
                    <input class="ant-input ant-input-borderless input--TWZaN batch-path" type="text" value="" disabled>
                    <br/><br/>

                    <div class="group--20rOb" style="width:100%; text-align:center; padding:10px 5px;">
                    查找
                    <input style="margin-bottom:8px" class="ant-input ant-input-borderless input--TWZaN batch-find" type="text" value="" placeholder="">
                    <br/>
                    替换为
                    <input style="margin-bottom:8px" class="ant-input ant-input-borderless input--TWZaN batch-replace" type="text" value="" placeholder="">
                    </div>
                    <br/><br/>

                </div>
                <div class="footer--1GqVx" style="display:flex; justify-content:center;">
                    <button style="float:left" class="button--WC7or secondary--vRtFJ small--e7LRt batch-clear-2">清空</button>
                    &nbsp&nbsp&nbsp&nbsp&nbsp
                    <button class="button--WC7or primary--NVxfK small--e7LRt batch-modify-2">执行</button>
                </div>
            </div> <!-- container -->
        </div> <!-- wrap -->
    `;

    var op3 = `
        <div class="title--FVkIN">列表批量替换</div>
        <div class="wrap--MfXl2" >
            <div class="container--30UDJ">
                <div class="content--nfnm6" style="padding-left: 15px;padding-right: 15px;">

                    <span style:"color:white" class="choose-title">选中列表：</span>
                    <textarea style="height:150px" class="ant-input ant-input-borderless input--TWZaN batch-file-old-name" type="text" value="" disabled></textarea>
                    <br/><br/>
                    <span style:"color:white">新名称列表：</span>
                    <textarea style="height:150px" class="ant-input ant-input-borderless input--TWZaN batch-file-new-name" type="text" value=""></textarea>
                    <br/><br/>
                </div>
                <div class="footer--1GqVx" style="display:flex; justify-content:center;">
                    <button class="button--WC7or primary--NVxfK small--e7LRt batch-modify-3">执行</button>
                </div>
            </div> <!-- container -->
        </div> <!-- wrap -->
    `;

    obj.reset = function () {
        obj.files = [];
        obj.randomFillParam = -1;
        obj.url = location.href;
    };
    obj.getFileExtension = function (filename) {
      // 使用正则表达式匹配最后一个点（.）后面的字符作为后缀名
      var regex = /(?:\.([^.]+))?$/;
      var extension = regex.exec(filename)[1];
      return extension;
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
      console.log('init');
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
            <div class="ant-modal-mask" style="z-index: 999999;"></div>
            <div tabindex="-1" class="ant-modal-wrap" role="dialog" style="z-index: 999999;">
                <div role="document" class="ant-modal modal-wrapper--5SA7y" style="width: 800px; transform-origin: -119px 90px;">
                    <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div>
                    <div class="ant-modal-content" style="height: 600px;">
                        <div class="ant-modal-body" style="padding: 0px;">
                            <div class="icon-wrapper--TbIdu">
                                <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--KF5OX icon--D3kMk ">
                                    <svg viewBox="0 0 1024 1024">
                                        <use xlink:href="#PDSClose"></use>
                                    </svg>
                                </span>
                            </div>

                            <div class="container--m7mUs" style="height: 600px;">
                                <div class="sider--Sg550" style="width: 20%;padding-left: 10px;padding-right: 10px;">
                                    <div class="title--FVkIN">扩展：批量重命名</div>

                                    <div class="menu-item--PWRBc active--U3zVh" id="option1" style="width: auto">
                                        <div class="menu-item__label--Iq8GQ">
                                         <span class="menu-item__text--d7S-v">剧集重命名</span>
                                        </div>
                                        <span data-role="icon" data-render-as="svg" data-icon-type="PDSChevronRight" class="icon--WkQHx icon--D3kMk ">
                                         <svg viewbox="0 0 1024 1024">
                                          <use xlink:href="#PDSChevronRight"></use>
                                         </svg></span>
                                    </div>
                                    <div class="menu-item--PWRBc" style="width: auto" id="option2">
                                        <div class="menu-item__label--Iq8GQ">
                                         <span class="menu-item__text--d7S-v">查找替换</span>
                                        </div>
                                        <span data-role="icon" data-render-as="svg" data-icon-type="PDSChevronRight" class="icon--WkQHx icon--D3kMk ">
                                         <svg viewbox="0 0 1024 1024">
                                          <use xlink:href="#PDSChevronRight"></use>
                                         </svg></span>
                                    </div>
                                    <div class="menu-item--PWRBc" style="width: auto" id="option3">
                                        <div class="menu-item__label--Iq8GQ">
                                         <span class="menu-item__text--d7S-v">列表批量替换</span>
                                        </div>
                                        <span data-role="icon" data-render-as="svg" data-icon-type="PDSChevronRight" class="icon--WkQHx icon--D3kMk ">
                                         <svg viewbox="0 0 1024 1024">
                                          <use xlink:href="#PDSChevronRight"></use>
                                         </svg></span>
                                    </div>
                                </div> <!-- sider -->

                                <div class="content--mUZVS batch-content-op" style="width: 80%; color:rgba(var(--context), 0.9); font-weight:bolder">
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
        $("#option1").on("click", 1, obj.switchPanel);
        $("#option2").on("click", 2, obj.switchPanel);
        $("#option3").on("click", 3, obj.switchPanel);
        obj.prepareOp1();
        obj.panel = 1;
    };

    obj.prepareOp1 = function() {
        $(".batch-path").val(obj.path);
        $(".batch-clear").on("click", obj.clear);
        $(".batch-modify").on("click", obj.batchModify);
        $(".batch-randomFill").on("click", obj.randomFill);
        $(".batch-origin-suff").on("click", obj.changeOriSuff);
        $(".batch-before").on("blur", obj.checkBefore);
    }

    obj.prepareOp2 = function() {
        $(".batch-path").val(obj.path);
        $(".batch-clear-2").on("click", obj.clear2);
        $(".batch-modify-2").on("click", obj.replace);
    }

    obj.prepareOp3 = function() {
        var selectList = base.getSelectedList();
        obj.files = selectList.map(v=>({name:v.name,drive_id:v.driveId,file_id:v.fileId}));
        $(".choose-title").innerText = `选中列表(${obj.files.length})：`;
        $(".batch-file-old-name").val(obj.files.map(v=>v.name).join('\n'));
        $(".batch-modify-3").on("click", obj.batchFileNameCover);
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
        var checked = $(".batch-origin-suff").prop("checked");
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
        $(".batch-after-suff").val("");
    };

    obj.clear2 = function() {
        $(".batch-find").val("");
        $(".batch-replace").val("");
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
        var token = JSON.parse(getToken());
        if(!token) {
            alert("请先登录！");
            obj.enableButton();
            return;
        }
        var tokenStr = token.token_type + " " + token.access_token;
        var checked = $(".batch-origin-suff").prop("checked");

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
                var newName = nameAfter+"E"+episode;

                if(checked) {
                    if(pos[1]-1 < f.name.length) newName += f.name.substring(pos[1]-1, f.name.length);
                }else {
                    if(!isBlank(suff)) newName += "_"+suff;
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

    obj.replace = function() {
        let findTxt = $(".batch-find").val();
        let replaceTxt = $(".batch-replace").val();
        if(isBlank(findTxt)) {
            alert("查找文本不能为空!");
            return;
        }

        if(!isBlank(replaceTxt) && replaceTxt === findTxt) {
            alert("查找和替换文本不能相同!");
            return;
        }

        //解析token
        let token = JSON.parse(getToken());
        if(!token) {
            alert("请先登录！");
            obj.enableButton();
            return;
        }
        let tokenStr = token.token_type + " " + token.access_token;

        $(".ant-modal-batch-modify").remove();
        obj.loading();
        setTimeout(function() {
            let count = 0;
            for(let f of obj.files) {
                //检查文件是否应该修改
                if(count > 200) break;

                let newName = f.name.replace(findTxt, replaceTxt);
                if(isBlank(newName)) continue;
                if(f.name === newName) continue;

                console.log(f.name + " -> " + newName);
                obj.ajaxModify(f, newName, tokenStr);
                count++;
            }

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
            alert("没有video格式的文件！");
            return;
        }

        $(".batch-before").val(obj.files[obj.randomFillParam].name);
    }

    obj.batchFileNameCover = function() {
        var batchFileNewNames = $(".batch-file-new-name").val().replaceAll('\r','\n').split('\n');
        if(isBlank($(".batch-file-new-name").val())) {
            alert("名称列表不能为空!");
            return;
        }
        if(obj.files.length > 200 ) {
            alert("不建议所选文件数超过200!");
            return;
        }
        if(batchFileNewNames.length != obj.files.length) {
            alert(`名称列表数量(${batchFileNewNames.length})和所选文件数(${obj.files.length})不一致!`);
            return;
        }

        //解析token
        let token = JSON.parse(getToken());
        if(!token) {
            alert("请先登录！");
            obj.enableButton();
            return;
        }
        let tokenStr = token.token_type + " " + token.access_token;

       // $(".ant-modal-batch-modify").remove();
        obj.loading();
        setTimeout(function() {
            let count = 0;
            for(let f of obj.files) {

                let newName = batchFileNewNames[obj.files.indexOf(f)] + '.' + obj.getFileExtension(f.name);
                if(isBlank(newName)) continue;
                if(f.name === newName) continue;

                console.log(f.name + " -> " + newName);
                obj.ajaxModify(f, newName, tokenStr);
                count++;
            }

            $(".ant-modal-loading").remove();
            alert("完成修改【"+count+"】个文件");

            setTimeout(function() {window.location.reload()}, 100);
        }, 0);
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

    obj.switchPanel = function(event) {
        var val = event.data;
        if(obj.panel == val) return;

        var content = $(".batch-content-op");
        if(val == 1) {
            $("#option1").attr("class", "menu-item--PWRBc active--U3zVh");
            content.html(op1);
            obj.prepareOp1();
        }else if(val == 2){
            $("#option2").attr("class", "menu-item--PWRBc active--U3zVh");
            content.html(op2);
            obj.prepareOp2();
        }else if(val == 3){
            var selectList = base.getSelectedList();
            if (selectList.length === 0) {
                // return message.error('提示：请先勾选要下载的文件！');
                alert("提示：请先勾选要下载的文件！");
                return;
            }
            if (base.isOnlyFolder(selectList)) {
                // return message.error('提示：请打开文件夹后勾选文件！');
                alert("提示：请打开文件夹后勾选文件！");
                return;
            }

            $("#option3").attr("class", "menu-item--PWRBc active--U3zVh");
            content.html(op3);
            obj.prepareOp3();
        }

        if(obj.panel == 1) $("#option1").attr("class", "menu-item--PWRBc");
        else if(obj.panel == 2) $("#option2").attr("class", "menu-item--PWRBc");
        else if(obj.panel == 3) $("#option3").attr("class", "menu-item--PWRBc");
        obj.panel = val;
    }

    obj.init();
    setTimeout(obj.initBatchButton, 1000);

})();
