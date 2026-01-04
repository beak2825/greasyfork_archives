// ==UserScript==
// @name         Apollo JSON 校验
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ApolloJSON校验内容
// @author       You
// @match        https://rdfa-cfg-portal.dev.ennew.com/config.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ennew.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/477661/Apollo%20JSON%20%E6%A0%A1%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/477661/Apollo%20JSON%20%E6%A0%A1%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createCustomElement(mountContainer){
        // 创建一个文档碎片
        const fragment = document.createDocumentFragment();
        // 创建一个新的div元素
        const divElement = document.createElement("div");
        divElement.style.position = "absolute";
        divElement.style.top = "10px"; // 设置固定位置的垂直位置
        divElement.style.left = "10px"; // 设置固定位置的水平位置
        divElement.style.background = "#ffffff"; // 背景颜色
        divElement.style.padding = "10px"; // 内边距
        divElement.style.gap = "10px";
        divElement.style.height = "50px";
        divElement.style.display="none"

        // 创建第一个按钮（检查JSON）
        const checkJSONButton = document.createElement("button");
        checkJSONButton.classList.add('el-button', 'el-button--primary')
        checkJSONButton.textContent = "检查JSON";
        checkJSONButton.addEventListener("click", function (event) {
            event.preventDefault();
            const valueEditorContext = document.querySelector("#itemModal .modal-dialog #valueEditor")
            try {
                JSON.parse(valueEditorContext.value);
                showText.classList = [];
                showText.classList.add('el-button','el-button--success','is-text')
                showText.textContent = 'JSON合法'
            } catch (error) {
                debugger
                showText.classList = [];
                showText.classList.add('el-button','el-button--danger','is-text')
                showText.textContent = 'JSON不合法，请打开控制台查看！'
                console.log(error)
                console.error(error)
            }
        });

        // 创建第二个按钮（美化JSON）
        const prettifyJSONButton = document.createElement("button");
        prettifyJSONButton.textContent = "美化JSON";
        prettifyJSONButton.classList.add('el-button','el-button--secondary')
        prettifyJSONButton.addEventListener("click", function (event) {
            // 添加你的JSON美化逻辑
            event.preventDefault();
            const valueEditorContext = document.querySelector("#itemModal .modal-dialog #valueEditor")
            const jsonObject = JSON.parse(valueEditorContext.value);
            const prettyJSON = JSON.stringify(jsonObject, null, 2);
            valueEditorContext.value = prettyJSON;
            showText.textContent = "已美化~";
            showText.classList = [];
            showText.classList.add('el-button','el-button--success','is-text')
        });
        //
        var showText = document.createElement("span");
        showText.textContent = "";

        // 将按钮添加到div元素中
        divElement.appendChild(checkJSONButton);
        divElement.appendChild(prettifyJSONButton);
        divElement.appendChild(showText);
        // 将div元素添加到文档碎片
        fragment.appendChild(divElement);
        // 将文档碎片的内容一次性添加到
        mountContainer.appendChild(fragment);
        return divElement
    }

    function loadEncyCss(){
        // 创建一个<link>元素
        var link = document.createElement("link");
        // 设置<link>元素的属性
        link.rel = "stylesheet";
        link.href = "https://oss-statics.icomecloud.com/statics/@enn/ency-design/dist/1.8.19/index.css";
        // 将<link>元素添加到文档的<head>部分，这会触发CSS文件的加载
        document.head.appendChild(link);
    }
    loadEncyCss()
    window.onload=function(){
        var dialogFooter = document.querySelector("#itemModal .modal-dialog .modal-footer")
        dialogFooter.style.position = 'relative'
        var divElement = createCustomElement(dialogFooter)
        var itemModal = document.querySelector("#itemModal .modal-dialog");
        // 创建 IntersectionObserver 的回调函数
        var callback = function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // 在这里执行元素可见时的操作
                    divElement.style.display="flex"
                } else {
                    // 在这里执行隐藏后的操作
                    divElement.style.display="none"
                }
            });
        };
        var observer = new IntersectionObserver(callback);
        observer.observe(itemModal);
    };
})();