    // ==UserScript==
// @name         超星考试题目复制（新版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快捷复制学习通的考试题目和选项
// @author       小小羊
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.1.1/jquery.min.js
// @match        https://mooc1.chaoxing.com/exam/*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436797/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E5%A4%8D%E5%88%B6%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436797/%E8%B6%85%E6%98%9F%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E5%A4%8D%E5%88%B6%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

'use strict';
$(() => {
    drawCopyBtn();
    superEditor();
});

// Your code here...

var options = [];
options.push(document.querySelector(".mark_name.colorDeep p"));
function drawCopyBtn() {
    // 渲染题目复制按钮
    let btn = document.createElement("button");
    btn.innerText = "点我复制";
    btn.id = "copyBtn";
    btn.style.position = "fixed";
    btn.style.top = "70px";
    btn.style.left = "50px";
    
    document.body.appendChild(btn);
    btn.onclick = (e) => {
        copyAns(-1, e);
    }


    // 渲染选项复制按钮
    document.querySelectorAll(".fl.answer_p").forEach((el, index) => {
        let a = document.createElement("a");
        a.innerText = "复制";
        a.style.position = "relative";
        a.onclick = (e) => { copyAns(index, e); }
        el.parentElement.appendChild(a);
        options.push(el);
    });
}

var editors = [];
function superEditor() {
    // 对页面中的富文本编辑器进行添加事件
    var frames = document.querySelectorAll(".edui-editor-iframeholder iframe");
    console.log(frames);
    frames.forEach(frame => {
        let body = frame.contentWindow.document.body;
        // ctrl + v 事件
        body.onkeydown = (e) => {
            if (e.key == 'v' && e.ctrlKey) pasteAns(body);
        }

    });
}

function copyAns(index = -1, event) {
    var text = "";
    text = options[index + 1].innerText;
    // 去除末尾的空格回车
    text = text.trim().replace("\n", "");
    copy(text);
    event.stopPropagation();
}

async function pasteAns(element) {
    let p = document.createElement("p");
    let text = await navigator.clipboard.readText();
    p.innerText = text;
    if (element.innerText == "\n") element.removeChild(element.firstChild);
    element.appendChild(p);
}

async function copy(text) {
    console.log(text);
    await navigator.clipboard.writeText(text);
    alert("复制成功\n\n" + text);
}