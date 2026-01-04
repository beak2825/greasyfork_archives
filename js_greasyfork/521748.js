// ==UserScript==
// @license MIT
// @name         腾讯 Doc 大纲增强
// @namespace    http://tampermonkey.net/
// @version      2024-12-17
// @description  腾讯 Doc 大纲操作增强，支持展开、折叠操作
// @author       胡均
// @include      https://docs.qq.com/doc/*
// @grant        unsafeWindow
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/521748/%E8%85%BE%E8%AE%AF%20Doc%20%E5%A4%A7%E7%BA%B2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521748/%E8%85%BE%E8%AE%AF%20Doc%20%E5%A4%A7%E7%BA%B2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var expandLevel = function(level) {
        var margrinLeft = (level * 12) + 'px';
        //alert(margrinLeft);
        // 遍历控件
        var selElements = document.getElementsByClassName('headline-triangle');
        for (var i = 0; i < selElements.length; i++) {
            var nextSibling = selElements[i].nextElementSibling;
            if (nextSibling) {
                // 获取元素的计算样式，用于获取实际生效的样式值（包括继承等情况得到的最终值）
                var computedStyle = window.getComputedStyle(nextSibling);
                // 获取margin-left的样式值，返回的是带单位的字符串，例如 "20px"
                var marginLeftValue = computedStyle.getPropertyValue('margin-left');
                // 展开箭头的下一个控件是标题，每一级标题会左外边距+12px
                if(marginLeftValue == margrinLeft) {
                    // 模拟点击每个元素
                    selElements[i].click();
                }
            }
        }
    };

    // 展开所有目录
    var expandAll = function() {
        // 遍历控件
        var selElements = document.getElementsByClassName('headline-triangle');
        var oldSelElementsCnt = document.getElementsByClassName('headline-triangle').length;
        for (var i = 0; i < selElements.length; i++) {
            // 模拟点击每个元素
            selElements[i].click();
            // 点击后的目录节点总数
            var newSelElementsCnt = document.getElementsByClassName('headline-triangle').length;
            if(newSelElementsCnt < oldSelElementsCnt) {
                // 新的少于原来的，则代表有被折叠的，就把当前的重新点击一次展开
                selElements[i].click();
            } else {
                // 变多或不变，则代表展开目录或者没有下级目录
                console.log('展开或没有下级目录');
            }
        }
    };

    // 折叠所有目录
    var collapseAll = function() {
        // 遍历控件
        var selElements = document.getElementsByClassName('headline-triangle');
        let selElementsCnt = selElements.length;
        var oldSelElementsCnt = document.getElementsByClassName('headline-triangle').length;
        for (var i = selElementsCnt-1; i >= 0; i--) {
            // 模拟点击每个元素
            selElements[i].click();
            // 点击后的目录节点总数
            var newSelElementsCnt = document.getElementsByClassName('headline-triangle').length;
            if(newSelElementsCnt > oldSelElementsCnt) {
                // 新的少于原来的，则代表有被折叠的，就把当前的重新点击一次展开
                selElements[i].click();
            } else {
                // 变多或不变，则代表展开目录或者没有下级目录
                console.log('展开或没有下级目录');
            }
        }
    };

    // 展开按钮
    var btn_expand = document.createElement('button');
    btn_expand.textContent = '展开';
    btn_expand.style.padding = '3px 3px';
    btn_expand.style.backgroundColor = '#767676';
    btn_expand.style.color = 'white';
    btn_expand.style.border = 'none';
    btn_expand.style.borderRadius = '2px';
    btn_expand.addEventListener('click', function () {
        for(var i=0; i<=10; i++){
            expandAll();
        }
    });

    // 折叠按钮
    var btn_collapse = document.createElement('button');
    btn_collapse.textContent = '折叠';
    btn_collapse.style.padding = '3px 3px';
    btn_collapse.style.backgroundColor = '#767676';
    btn_collapse.style.color = 'white';
    btn_collapse.style.border = 'none';
    btn_collapse.style.borderRadius = '2px';
    btn_collapse.addEventListener('click', function () {
        for(var i=0; i<=10; i++){
            collapseAll();
        }
    });

    // 指定层级
    var inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = '输入整数';
    inputElement.id = 'my_Input_Level';
    inputElement.style.width = '60px';
    inputElement.value = 3;

    // 展开到 N 级按钮
    var btn_expandLevel = document.createElement('button');
    btn_expandLevel.textContent = '展开到→级';
    btn_expandLevel.style.padding = '3px 3px';
    btn_expandLevel.style.backgroundColor = '#767676';
    btn_expandLevel.style.color = 'white';
    btn_expandLevel.style.border = 'none';
    btn_expandLevel.style.borderRadius = '2px';
    btn_expandLevel.addEventListener('click', function () {
        for(var i=0; i<=10; i++){
            // 全部展开才能实现折叠
            expandAll();
        }
        let inputVal = document.getElementById('my_Input_Level').value;
        let convertedValue = parseInt(inputVal);
        if (!isNaN(convertedValue)) {
            if(convertedValue <=0 || convertedValue >= 10) {
                inputElement.value = 1;
                expandLevel(1);
            } else {
                expandLevel(convertedValue);
            }
        } else {
            inputElement.value = 1;
            expandLevel(1);
        }
    });

    setTimeout(function(){
        // 设置大纲宽度
        var workbench_drawer_left = document.getElementById('workbench-drawer-left');
        if(workbench_drawer_left) {
            // 设置最小宽度，这里设置为 400px，你可以根据实际需求修改具体数值和单位
            workbench_drawer_left.style.minWidth = '400px';
            // 设置最大宽度，这里设置为 500px，同样可按需更改
            workbench_drawer_left.style.maxWidth = '400px';
        }

         // 添加大纲操作按钮
         // 1. 获取类名为 outline-title 的 div 元素，页面上显示为“大纲”两个字
         var targetDiv = document.getElementsByClassName('outline-title')[0];
         if (targetDiv) {
             // 2. 获取目标 div 元素的父节点
             var parentNode = targetDiv.parentNode;
             // 3. 使用 insertBefore 方法将按钮插入到目标 div 的下一个兄弟节点位置，
             // 如果目标 div 是父节点的最后一个子节点，那么按钮就会添加到最后成为新的最后一个子节点
             parentNode.insertBefore(inputElement, targetDiv.nextSibling);
             parentNode.insertBefore(btn_expandLevel, targetDiv.nextSibling);
             parentNode.insertBefore(btn_collapse, targetDiv.nextSibling);
             parentNode.insertBefore(btn_expand, targetDiv.nextSibling);
         }

        // 设置默认目录层级为 3 级
        expandLevel(3);
    }, 5000);
})();