// ==UserScript==
// @name        ****** 移除神经病策未来网校的复制限制和弹窗******
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  允许在ceweilai.cn网站上复制内容，并防止“禁止复制”弹窗
// @author       高
// @match        http://www.ceweilai.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509066/%2A%2A%2A%2A%2A%2A%20%E7%A7%BB%E9%99%A4%E7%A5%9E%E7%BB%8F%E7%97%85%E7%AD%96%E6%9C%AA%E6%9D%A5%E7%BD%91%E6%A0%A1%E7%9A%84%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%92%8C%E5%BC%B9%E7%AA%97%2A%2A%2A%2A%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/509066/%2A%2A%2A%2A%2A%2A%20%E7%A7%BB%E9%99%A4%E7%A5%9E%E7%BB%8F%E7%97%85%E7%AD%96%E6%9C%AA%E6%9D%A5%E7%BD%91%E6%A0%A1%E7%9A%84%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%92%8C%E5%BC%B9%E7%AA%97%2A%2A%2A%2A%2A%2A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 禁用 window.alert 和 window.confirm，以防止弹出“禁止复制”的提示
    window.alert = function(){};
    window.confirm = function(){return true;};

    // 函数：阻止事件传播
    function stopEvent(e) {
        e.stopImmediatePropagation();
        // e.preventDefault(); // 如果需要也可以取消注释这行，阻止默认行为
    }

    // 添加捕获阶段的事件监听器，阻止事件传播到网站的脚本
    ['copy', 'cut', 'paste', 'contextmenu', 'selectstart', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseup', 'mousemove', 'select'].forEach(function(event) {
        document.addEventListener(event, stopEvent, true);
    });

    // 允许文本选择
    function allowTextSelection() {
        if (document.body) {
            document.body.style.userSelect = 'text';
            document.body.style.webkitUserSelect = 'text';
            document.body.style.msUserSelect = 'text';
            document.body.style.mozUserSelect = 'text';
        }
    }

    // 移除阻止复制的事件监听器
    function removeCopyRestrictions() {
        var elems = [document, document.body];
        elems.forEach(function(el) {
            if (el) {
                el.oncopy = null;
                el.oncut = null;
                el.onpaste = null;
                el.oncontextmenu = null;
                el.onselectstart = null;
                el.onkeydown = null;
                el.onkeypress = null;
                el.onkeyup = null;
                el.onmousedown = null;
                el.onmouseup = null;
                el.onmousemove = null;
                el.onselect = null;
            }
        });
    }

    // 初始调用
    removeCopyRestrictions();
    allowTextSelection();

    // 使用 MutationObserver 监控 DOM 变化，动态移除复制限制
    var observer = new MutationObserver(function(mutations) {
        removeCopyRestrictions();
        allowTextSelection();
    });

    observer.observe(document, {subtree: true, childList: true, attributes: true});

    // 定期移除复制限制，以防止网站重新添加
    setInterval(function() {
        removeCopyRestrictions();
        allowTextSelection();
    }, 1000);

    // 在页面加载完成后再执行一次，以确保所有元素都已加载
    window.addEventListener('load', function() {
        removeCopyRestrictions();
        allowTextSelection();
    });

})();
