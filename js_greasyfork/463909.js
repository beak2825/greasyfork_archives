// ==UserScript==
// @name         aura配置表对比
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  用于对比两个aura配置表
// @author       You
// @match        *aura.jd.com/module/moduleIntegration*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/463909/aura%E9%85%8D%E7%BD%AE%E8%A1%A8%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/463909/aura%E9%85%8D%E7%BD%AE%E8%A1%A8%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 创建MutationObserver实例
    let myMap = new Map();
    let added = true;
    let configName = "";
    let addButton = function (curConfigName) {
        var existingElement;

        var elements = document.getElementsByClassName(
            "el-button el-button--primary el-button--small"
        );

        // 遍历类数组对象
        for (var j = 0; j < elements.length; j++) {
            var element = elements[j];
            if (element.innerText == "添加模块") {
                existingElement = element;
            }
        }

        // 创建新按钮
        var newButton = document.getElementById('newButton')
        if(newButton == null){
            newButton = document.createElement("button");
            newButton.setAttribute("id", "newButton");

            // 在已有元素旁添加新按钮
            existingElement.parentNode.insertBefore(
                newButton,
                existingElement.nextSibling
            );
            // 为新按钮添加点击事件
            newButton.addEventListener("click", function () {
                var compare = myMap.size == 0;
                var root = document.querySelector(
                    "#app > div > div.main-container > section > div > div > div.el-tabs__content > div.app-container.container-padding-0 > div:nth-child(5) > div > div.el-dialog__body > div > div.el-table.loading-area-module.el-table--fit.el-table--border.el-table--enable-row-transition > div.el-table__fixed > div.el-table__fixed-body-wrapper > table > tbody"
                );
                if (added) {
                    // 配置观察选项
                    var config = {
                        attributes: true,
                        childList: true,
                        subtree: true,
                        characterData: true,
                    };
                    added = false;
                    observer.observe(root, config);
                }
                var table = root.getElementsByClassName("el-table__row");
                var mapStr = "";
                var i = 0;
                for (var index = 0; index < table.length; index++) {
                    var element = table[index];
                    var name = element.children[1].innerText;
                    var version = element.children[2].innerText;
                    if (compare) {
                        configName = this.config;
                        myMap.set(name, version);
                    } else {
                        var baseVersion = myMap.get(name);
                        if (baseVersion != version) {
                            mapStr += `${i}.${name},${configName}配置表：${baseVersion} , ${this.config}配置表：${version}\n`
                            i++;
                        }
                    }
                }
                if(compare){
                    alert(`添加完成,共有${myMap.size}个组件`);
                }else{
                    console.log(mapStr);
                    // 复制文本内容到剪切板
                    GM_setClipboard(mapStr);
                    name = "";
                    myMap = new Map();
                    alert(`对比完成，存在以下差异，已复制到剪贴板，也可在控制台查看:\n${mapStr}`)
                }
            });
        }
        var compare = myMap.size == 0;
        newButton.config = curConfigName;
        newButton.innerHTML = compare ? "选择基础版本" : "进行对比";



    };
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查是否有新的节点被添加
            //console.log(mutation);
            if (mutation.addedNodes.length > 0) {
                // 遍历所有添加的节点
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var newNode = mutation.addedNodes[i];
                    //                    console.log(newNode);

                    // 检查新节点是否为我们想要的元素
                    if (newNode.className == "el-icon more btn-quicknext el-icon-more") {
                        // 在此处执行您的脚本
                        //console.log("Element found!");
                        // 停止观察
                        observer.disconnect();
                        //addButton();


                        var target = document.getElementsByClassName(
                            "el-button el-button--text el-button--normal"
                        );
                        // 遍历类数组对象
                        for (var j = 0; j < target.length; j++) {
                            var element = target[j];
                            if (element.innerText.indexOf(" (") > 0) {
                                var str = element.parentElement.parentElement.parentElement.childNodes[1].innerText
                                element.addEventListener("click", function () {
                                    // 在此处理点击事件
                                    addButton(this.parentElement.parentElement.parentElement.childNodes[1].innerText);

                                });
                            }
                        }
                        // 获取已有元素
                    }
                }
            }
        });
    });

    // 配置观察选项
    var config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
    };

    // 开始观察body元素
    observer.observe(document.body, config);
    // Your code here...
})();