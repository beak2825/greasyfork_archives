// ==UserScript==
// @name         feifei clippy 文档小帮手
// @namespace    http://tampermonkey.net/
// @version      2024-04-01 2
// @description  给你的在线文档添加一个智能伙伴
// @author       haru
// @match        https://bytedance.larkoffice.com/*
// @match        https://*/docx/*
// @match        https://*.feishu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=larkoffice.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491246/feifei%20clippy%20%E6%96%87%E6%A1%A3%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491246/feifei%20clippy%20%E6%96%87%E6%A1%A3%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 draggable div
    var draggable = document.createElement('div');
    draggable.style.width = '170px';
    draggable.style.height = '320px';
    draggable.style.position = 'fixed';
    draggable.style.right = '10%';
    draggable.style.bottom = '10%';
    draggable.style.userSelect = 'none';

    // 创建 iframe
    var iframe = document.createElement('iframe');
    iframe.src = 'https://antonoko.github.io/feishu-clippy';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.border = 'none';

    // 创建用于拖动的handle
    var handle = document.createElement('div');
    handle.style.width = '100%';
    handle.style.height = '30%';
    handle.style.position = 'absolute';
    handle.style.cursor = 'move';
    handle.style.bottom = '0';

    draggable.appendChild(iframe);
    draggable.appendChild(handle);
    document.body.appendChild(draggable);

    let dragging = false;

    handle.addEventListener('mousedown', function(e) {
        var coords = getCoords(draggable);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        draggable.style.position = 'absolute';
        moveAt(e);

        draggable.style.zIndex = 1000; // over other elements

        function moveAt(e) {
            var newLeft = e.pageX - shiftX,
                newTop = e.pageY - shiftY,
                draggableWidth = draggable.offsetWidth,
                draggableHeight = draggable.offsetHeight;

            // Prevent the draggable div from moving outside the document's top boundary
            if (newTop < 0) newTop = 0;
            // Prevent the draggable div from moving outside the document's left boundary
            if (newLeft < 0) newLeft = 0;

            // Prevent the draggable div from moving outside the document's bottom boundary
            if (newTop + draggableHeight > window.innerHeight) {
                newTop = window.innerHeight - draggableHeight;
            }
            // Prevent the draggable div from moving outside the document's right boundary
            if (newLeft + draggableWidth > document.body.clientWidth) {
                newLeft = document.body.clientWidth - draggableWidth;
            }

            draggable.style.left = newLeft + 'px';
            draggable.style.top = newTop + 'px';
        }

        document.addEventListener('mousemove', onMouseMove);

        function onMouseMove(e) {
            moveAt(e);
        }
        function clearMouseMove() {
            document.removeEventListener('mousemove', onMouseMove);
            draggable.onmouseup = null;
            document.removeEventListener('mouseup', clearMouseMove);
        };

        document.addEventListener('mouseup', clearMouseMove);
    });

    function getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }





})();