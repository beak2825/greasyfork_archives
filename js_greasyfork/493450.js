// ==UserScript==
// @name         pinterest_appeal_script
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  少林功夫好啊!真滴好！
// @author       You
// @match        https://www.pinterest.com/reports-and-violations/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/455606/1142126/layxjs.js
// @resource  layxcss https://greasyfork.org/scripts/455605-layx/code/layx.user.css
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493450/pinterest_appeal_script.user.js
// @updateURL https://update.greasyfork.org/scripts/493450/pinterest_appeal_script.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 等待页面加载完成
    let cancel = false;
    window.onload = function () {
        GM_addStyle(GM_getResourceText("layxcss"));
        // 创建悬浮窗口
        const titleHtml = '<div style="color: white; font-size: 12px;">pinterest自动化上诉程序</div>';
        const infoHtml = '本插件仅供Orca内部使用，盗用必究 (ง •̀_•́)ง' +
            `<div id="outputs" style="olor: black;font-size: 12px;border-radius: 5px;padding: 10px;margin: 10px;box-shadow: 0 0 5px #ccc;height:81%;overflow-y: auto;">
            请点击'执行脚本'按钮...
            </div>` +
            '执行<input type="number" id="page" name="quantity" min="1" max="30" value="1" style="width:20px;height:12px">页</div>'
            ;
        layx.html('resize-rc', titleHtml, infoHtml, {
            width: 300,
            height: 470,
            statusBar: true,
            storeStatus: false,
            // 浏览器宽度
            skin: 'river',
            position: ['rc', window.innerWidth - 330],
            buttons: [
                {
                    label: '上诉文案',
                    callback: function (id, button, event) {
                        //取消回车键绑定
                        if(event.keyCode === 13){
                            return false;
                        }
                        const infoHtml = `<textarea id="PromptText" style="olor: black;font-size: 12px;border-radius: 5px;padding: 10px;margin: 
                        10px;box-shadow: 0 0 5px #ccc;width:94%;height:77%;overflow-y: auto;">`+loadData('appealTextArea').join("\n")+`</textarea>`

                        layx.html('promptId', '<div style="color: white; font-size: 12px;">上诉文案</div>', '每行一条,产品上诉时会从中随机取一条<br>'+infoHtml, {
                            skin: 'river',
                            width: 700,
                            height: 350,
                            statusBar: true,
                            storeStatus: false,
                            buttons: [
                                {
                                    label: '确定',
                                    callback: function (id, button, event) {
                                        //取消回车键绑定
                                        if(event.keyCode === 13){
                                            return false;
                                        }
                                        
                                        var text = document.getElementById('PromptText').value;
                                        var text_list = [];
                                        var texts = text.split("\n");
                                        for (var i = 0; i < texts.length; i++) {
                                            if (texts[i].trim() === '') {
                                                continue;
                                            }
                                            text_list.push(texts[i]);
                                        }
                                        saveData('appealTextArea', text_list);
                                        layx.destroy(id);
                                    }

                                    
                                },
                                {
                                    label: '取消',
                                    callback: function (id, button, event) {
                                        layx.destroy(id);
                                    },
                                    classes: 'custom-button'
                                }
                            ]
                        });
                    },
                    classes: 'custom-button'
                },
                {
                    label: '执行脚本',
                    callback: function (id, button, event) {
                        //layx.destroy(id);
                        cancel = false;
                        get_script();
                    },
                    classes: 'custom-button'
                }
            ]
        });
        
        // 获取脚本
        async function get_script() {

            var outputs = document.getElementById('outputs');
            // 检查是否需要滚动到底部的函数
            function scrollOutputsToBottom() {
                outputs.scrollTop = outputs.scrollHeight;
            }
            outputs.addEventListener("DOMSubtreeModified", scrollOutputsToBottom);
            //清空输出框
            outputs.innerHTML = '';

            var page = document.getElementById('page').value;
            for (var p = 0; p < page; p++) {
                if (cancel) {
                    return;
                }
                //加载一个整个页面无法点击的蒙层
                layx.load('loadId', `<a class="layx-button-item" style="background-color: #3498db;color: #fff;height:20px;
                border: 1px solid #3498db; position: fixed;bottom: 5px; right: 10px;" title="取消" id="cancelscript">取消</a>
                <br>正在执行` + (p + 1) + '页，请不要点击页面', 0);
                var cancelscript = document.getElementById('cancelscript');
                
                cancelscript.addEventListener('click', function () {
                    //取消get_script脚本
                    layx.destroy('loadId');
                    outputs.innerHTML += '已取消<br>';
                    cancel = true;

                  });
                outputs.innerHTML += '正在执行第' + (p + 1) + '页<br>';
                if (p > 0) {
                    document.querySelector("button[aria-label='Navigate to next page']").click();
                    await new Promise(resolve => setTimeout(resolve, 2000));

                }
                var actions_menu;
                function actions(){
                    actions_menu = xpath('//button[@aria-label="Open content actions menu"]');
                    if (actions_menu.snapshotLength == 0) {
                        actions()
                    }
                }
                actions()
                var appeal_reviewed = xpath('//div[@data-test-id="rvc-desktop-table-status-cell"]/div');
                // 遍历结果并将每个元素添加到数组中
                var Failures = 0;
                for (var i = 0; i < actions_menu.snapshotLength; i++) {
                    if (cancel) {
                        return;
                    }
                    outputs.innerHTML += '========================<br>';
                    outputs.innerHTML += '正在执行第' + (i + 1) + '个操作<br>';
                    var t = appeal_reviewed.snapshotItem(i).textContent.trim()
                    if (t.includes("Appeal reviewed") || t.includes("Appeal in progress")) {
                        outputs.innerHTML += '第' + (i + 1) + '个操作已经上诉过了<br>';
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }

                    actions_menu.snapshotItem(i).click();

                    await new Promise(resolve => setTimeout(resolve, 1000));
                    try {
                        document.getElementById('content-actions-menu-item-0').click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        document.getElementById("appealTextArea").value = appealTextArea();
                        if (cancel) {
                            return;
                        }
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        document.querySelector("button[aria-label='Submit an appeal for the action Pinterest took on this piece of content']").click();
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        document.querySelector("button[aria-label='Close the appeal submit success notice']").click();
                        outputs.innerHTML += '第' + (i + 1) + '个操作成功<br>';
                        await new Promise(resolve => setTimeout(resolve, 1000));

                    }
                    catch (err) {
                        outputs.innerHTML += '第' + (i + 1) + '个操作失败，重试<br>';
                        i--;
                        Failures++;
                        if (Failures > 10) {
                            outputs.innerHTML += '失败次数过多，停止执行，请联系江澄清<br>';
                            break;
                        }
                        continue;
                    }
                }
                outputs.innerHTML += '完成';
                layx.destroy('loadId');
            }
        }
        function xpath(query) {
            return document.evaluate(query, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }
        // 保存数据到 localStorage
        function saveData(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        // 从 localStorage 读取数据
        function loadData(key) {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }

        function appealTextArea() {

            var text_list = loadData('appealTextArea');
            return text_list[Math.floor(Math.random() * text_list.length)];
        }


        if (localStorage.getItem("appealTextArea") == null) {
            var text_list = [
                "Dear officer, this is a normal women's apparel item product image. Please approve.",
            ];
            saveData('appealTextArea', text_list);

        }

        

        
    }
})();
