// ==UserScript==
// @name         Text Autocomplete with Custom Dropdown
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Autocomplete user's text with a custom positioned and styled dropdown
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/477554/Text%20Autocomplete%20with%20Custom%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/477554/Text%20Autocomplete%20with%20Custom%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dropdown = null;

    let flag = false

    function createDropdown(inputElement, matches, inputElementTes) {
        if (dropdown) {
            dropdown.remove();
        }
        dropdown = document.createElement("div");
        dropdown.className = "autocomplete-dropdown";
        dropdown.style.position = "absolute";
        dropdown.style.left = inputElement.getBoundingClientRect().left + "px";
        dropdown.style.top = (inputElement.getBoundingClientRect().bottom + window.scrollY) + "px";

        // 添加样式
        dropdown.style.backgroundColor = "#fff"; // 设置背景颜色
        dropdown.style.border = "1px solid #ccc"; // 设置边框
        dropdown.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"; // 添加阴影效果
        dropdown.style.maxHeight = "200px"; // 设置最大高度
        dropdown.style.overflowY = "auto"; // 如果内容溢出，添加垂直滚动条

        matches.forEach(match => {
            const listItem = document.createElement("div");
            listItem.textContent = match;
            listItem.className = "dropdown-item";

            // 添加项的样式
            listItem.style.padding = "8px 12px"; // 设置内边距
            listItem.style.cursor = "pointer"; // 鼠标悬停时显示手型光标

            listItem.addEventListener("click", () => {
                inputElementTes.value = inputElementTes.value.substring(0,inputElementTes.value.lastIndexOf('//')+2) + match
                flag = false

                dropdown.remove();
                document.execCommand("selectAll");
                document.execCommand("cut");
                document.execCommand("undo");
            });
            dropdown.appendChild(listItem);
        });
        document.body.appendChild(dropdown);
    }
    function handleKeyUp(event) {
        const elements = event.composedPath()
        var targetElement = elements[2]
        var inputElement = targetElement.querySelector('#mirror')
        var inputElementTes = targetElement.querySelector('#textarea')
        var index = inputElementTes.value.lastIndexOf('//');
        if((index !== -1 && index == inputElementTes.value.length - 2) || flag){
            flag = true
            if (inputElementTes.tagName === "INPUT" || inputElementTes.tagName === "TEXTAREA") {
                // var url = "http://localhost:8080/plugin/auto-complete/mate?data="+inputElementTes.value.substring(inputElementTes.value.lastIndexOf('//'),inputElementTes.value.length);
                var url = "http://dcagent-backend-dev.nioint.com/plugin/auto-complete/mate?data="+inputElementTes.value.substring(inputElementTes.value.lastIndexOf('//'),inputElementTes.value.length);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            var data = JSON.parse(response.responseText);
                            if(!data){
                                console.log("No data")
                                handleBlur()
                            }else{
                                createDropdown(inputElement,data,inputElementTes);
                                console.log(data)
                            }
                        } else {
                            // 请求失败时的处理代码
                            console.error("GET request failed with status:", response.status);
                        }
                    },
                    onerror: function(error) {
                        // 请求错误时的处理代码
                        console.error("GET request error:", error);
                    }
                });
            }
        }

    }
    function handleBlur() {
        if (dropdown) {
            dropdown.remove();
        }
    }
    function handleTabKey(event) {
        if (dropdown) {
            const items = dropdown.querySelectorAll('.dropdown-item');
            if (items.length > 0) {
                const elements = event.composedPath()
                var targetElement = elements[2]
                var inputElement = targetElement.querySelector('#mirror')
                var inputElementTes = targetElement.querySelector('#textarea')
                const selectedItem = items[0]; // 获取第一个匹配项
                inputElementTes.value = inputElementTes.value.substring(0,inputElementTes.value.lastIndexOf('//')+2) + selectedItem.textContent
                document.execCommand("selectAll");
                document.execCommand("cut");
                document.execCommand("undo");
                flag = false;

                dropdown.remove();
            }
        }
    }
    document.body.addEventListener('keyup', handleKeyUp);
    document.body.addEventListener('blur', handleBlur);
    document.body.addEventListener('click', handleBlur);

    document.body.addEventListener('keydown', function(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            handleTabKey(event);
        }
    });

})();