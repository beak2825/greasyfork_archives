// ==UserScript==
// @name         在网页上记笔记
// @namespace    http://tampermonkey.net/
// @version      2024-02-16
// @description  浅浅记一下笔记。
// @author       EnrynHsu
// @match        https://cn.bing.com/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487940/%E5%9C%A8%E7%BD%91%E9%A1%B5%E4%B8%8A%E8%AE%B0%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/487940/%E5%9C%A8%E7%BD%91%E9%A1%B5%E4%B8%8A%E8%AE%B0%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    const editor_pad = document.createElement('div')
    document.body.appendChild(editor_pad)
    editor_pad.innerHTML = "<button id='hsu_button_edit'>记笔记</button>"

    document.getElementById('hsu_button_edit').addEventListener('click',() => {
        editor_pad.innerHTML = "<label id='hsu_editor_padheader' style='display: block;" +
            "            margin-bottom: 10px;            font-size: 0.8rem;" +
            "            letter-spacing: 1px;' \"story\">Your Note:</label>\n" +
            "        <textarea style='            font-size: 0.95rem;            padding: 10px;" +
            "            max-width: 100%; font-family: 新宋体,serif;" +
            "            line-height: 1.5;" +
            "            border-radius: 5px;" +
            "            border: 1px solid #ccc;" +
            "            box-shadow: 1px 1px 1px #999;" +
            "            letter-spacing: 0px;' \"story\" name=\"story\" rows=\"5\" cols=\"33\">" +
            "" +
            "</textarea>"
        editor_pad.style.position = "fixed"
        editor_pad.style.top = "300px"
        editor_pad.style.right = "300px"
        editor_pad.style.width = "300px"
        editor_pad.style.height = "300px"
        editor_pad.style.zIndex = "99999999999999"
        editor_pad.id = "hsu_editor_pad"
        dragElement(editor_pad)
    })
    // editor_pad.innerHTML = "<label id='hsu_editor_padheader' style='display: block;" +
    //     "            margin-bottom: 10px;            font-size: 0.8rem;" +
    //     "            letter-spacing: 1px;' \"story\">Tell us your story:</label>\n" +
    //     "        <textarea style='            font-size: 0.95rem;            padding: 10px;" +
    //     "            max-width: 100%; font-family: 新宋体,serif;" +
    //     "            line-height: 1.5;" +
    //     "            border-radius: 5px;" +
    //     "            border: 1px solid #ccc;" +
    //     "            box-shadow: 1px 1px 1px #999;" +
    //     "            letter-spacing: 0px;' \"story\" name=\"story\" rows=\"5\" cols=\"33\">\n" +
    //     "            It was a dark and stormy night...\n" +
    //     "        </textarea>"
    editor_pad.style.position = "fixed"
    editor_pad.style.bottom = "0px"
    editor_pad.style.right = "10px"
    editor_pad.style.width = "300px"
    editor_pad.style.height = "300px"
    editor_pad.style.zIndex = "9999999999999999"
    editor_pad.id = "hsu_editor_pad"




    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(element.id + "header")) {
            // 如果存在，标题是您从中移动 DIV 的位置:
            document.getElementById(element.id + "header").onmousedown = dragMouseDown;
        } else {
            // 否则，从 DIV 内的任何位置移动 DIV:
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 在启动时获取鼠标光标位置:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 每当光标移动时调用一个函数:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 释放鼠标按钮时停止移动:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();