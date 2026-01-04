// ==UserScript==
// @name         超星学习通-超级粘贴
// @namespace    CXXXT_CJZT
// @version      3.0
// @description  解除超星学习通粘贴限制，以纯文本粘贴
// @author       DND
// @license      MIT
// @match        https://*.chaoxing.com/mooc-ans/*
// @run-at       document-start
// @grant        none
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSIjMDAwMDAwIj48cGF0aCBkPSJNMTMgN0g3VjVoNnptMCA0SDdWOWg2em0tNiA0aDZ2LTJIN3oiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zIDE5VjFoMTR2NGg0djE4SDd2LTR6bTEyLTJWM0g1djE0em0yLTEwdjEySDl2MmgxMFY3eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9nPjwvc3ZnPg==
// @downloadURL https://update.greasyfork.org/scripts/519698/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%B6%85%E7%BA%A7%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/519698/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%B6%85%E7%BA%A7%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==


function TEMPeditorPaste(o, html) {
    //let tempDOM=document.createElement("div");
    //tempDOM.innerHTML=html.html;
    //let text=tempDOM.textContent;
    html.html = html.html.replace(/\s*style="[^"]*"/g, '');
    return true;
}

function modifyPaste() {
    /*UEeditor binding*/
    let textarea_array = document.getElementsByTagName("textarea");


    for (let textarea of textarea_array) {
        if (textarea.id.includes("answer")) {
            let answer_editor = window.UE.getEditor(textarea.id);

            /*UEeditor API*/
            answer_editor.removeListener('beforepaste', window.editorPaste);
            //console.log(answer_editor.queryCommandState('pasteplain'));
            answer_editor.execCommand('strong', 'color', 'width');
            answer_editor.addListener('beforepaste', TEMPeditorPaste);

        }
    }
}

(function () {
    'use strict';
    console.log("超星学习通-超级粘贴启动");
    window.addEventListener("load", function () {
        modifyPaste();
    })


})();