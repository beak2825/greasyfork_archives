// ==UserScript==
// @name         过滤MT下载数小于指定数的条目
// @namespace    http://tampermonkey.net/
// @version      0.4.5
// @description  过滤m-team下载数小于指定数的条目
// @author       Kaers
// @match        https://kp.m-team.cc/*
// @grant        none
// @license      GPL-3.0
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/524598/%E8%BF%87%E6%BB%A4MT%E4%B8%8B%E8%BD%BD%E6%95%B0%E5%B0%8F%E4%BA%8E%E6%8C%87%E5%AE%9A%E6%95%B0%E7%9A%84%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/524598/%E8%BF%87%E6%BB%A4MT%E4%B8%8B%E8%BD%BD%E6%95%B0%E5%B0%8F%E4%BA%8E%E6%8C%87%E5%AE%9A%E6%95%B0%E7%9A%84%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isInputMode = false;
    var inputValue = localStorage.getItem("filterInputValue") || ""; // 从本地存储中获取输入值
    if(inputValue == ""){
        inputValue = 200;
        localStorage.setItem("filterInputValue", inputValue);
    }


    // 创建一个 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver((mutationsList, observer) => {
        // 当 DOM 发生变化时，检查页面路径
        if (window.location.pathname.startsWith('/browse')) {
            // 将按钮元素重新显示
            filterButton.style.display = "block";
            resetFilterButton.style.display = "block";
        }else{
            filterButton.style.display = "none";
            resetFilterButton.style.display = "none";
        }
    });

    // 配置 MutationObserver 监听哪些变化
    const config = { childList: true, subtree: true };

    // 启动观察者，监听整个文档的变化
    observer.observe(document.body, config);


    // 创建一个按钮元素
    var resetFilterButton = document.createElement("button");
    resetFilterButton.innerHTML = "重置"; // 如果有保存的值，则显示保存的值
    resetFilterButton.style.position = "fixed";
    resetFilterButton.style.bottom = "10px";
    resetFilterButton.style.right = "85px";
    resetFilterButton.style.zIndex = "9999";

    // 添加按钮点击事件
    resetFilterButton.addEventListener("click", function() {
        if (!isInputMode) {
            filterFunction(true);
        }
    });

    // 创建一个按钮元素
    var filterButton = document.createElement("button");
    filterButton.innerHTML = "x>"+inputValue; // 如果有保存的值，则显示保存的值
    filterButton.style.position = "fixed";
    filterButton.style.bottom = "10px";
    filterButton.style.right = "20px";
    filterButton.style.zIndex = "9999";

    // 添加按钮点击事件
    filterButton.addEventListener("click", function() {
        if (!isInputMode) {
            filterFunction(false);
        }
    });

    // 将按钮添加到页面中
    document.body.appendChild(filterButton);
    document.body.appendChild(resetFilterButton);


    // 添加按钮双击事件
    filterButton.addEventListener("dblclick", function() {
        if (!isInputMode) {
            var inputField = document.createElement("input");
            inputField.type = "text";
            inputField.style.position = "fixed";
            inputField.style.bottom = "10px";
            inputField.style.right = "20px";
            inputField.style.zIndex = "9999";
            inputField.style.padding = "5px";
            inputField.style.border = "1px solid #ccc";
            inputField.style.backgroundColor = "#fff";
            inputField.style.width = "60px"; // 设置输入框的宽度
            document.body.appendChild(inputField);

            // 焦点定位到输入框
            inputField.focus();

            // 移除按钮元素
            filterButton.style.display = "none";

            isInputMode = true;

            // 添加输入框失去焦点事件
            inputField.addEventListener("blur", function() {
                handleInputBlur(inputField);
            });

            // 添加输入框回车键事件
            inputField.addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    handleInputBlur(inputField);
                }
            });
        }
    });



    // 在这里定义你提供的JavaScript函数
    function filterFunction(clearFilter) {
        // 获取表格中的所有行
        var rows = document.querySelectorAll('table tr');

        // 循环遍历每一行，跳过表头
        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];

            if(clearFilter){
                row.style.display = '';
                continue;
            }

            var uploads = parseInt(row.cells[4].innerText.trim(), 10);
            var downloads = parseInt(row.cells[5].innerText.trim(), 10);
            console.log('上传量:', uploads, '下载量:', downloads);

            // 如果上传数量小于inputValue，则隐藏该行
            if (uploads < inputValue) {
                row.style.display = 'none';
            }else{
                row.style.display = '';
            }
        }
    }

    // 输入框失去焦点时的处理函数
    function handleInputBlur(inputField) {
        // 延迟移除输入框，以确保它不会在失去焦点时立即移除
        setTimeout(function() {
            if(inputField.value !== ""){
                // 在这里获取输入框的值
                inputValue = inputField.value;
                // 将输入值保存到本地存储
                localStorage.setItem("filterInputValue", inputValue);
                // 更新按钮文本为输入值
                filterButton.innerHTML = "x>"+inputValue;
            }
            // 移除输入框元素
            inputField.remove();

            // 将按钮元素重新显示
            filterButton.style.display = "block";

            isInputMode = false;
        }, 100);
    }

})();