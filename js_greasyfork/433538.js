// ==UserScript==
// @name         github一键跳转vsCode在线浏览
// @namespace    https://github.com/kailiang-zhao
// @version      1.1
// @description  github一键跳转vsCode在线浏览，更直观的在线查看代码
// @homeurl      https://github.com/kailiang-zhao/tampermokey-script/githubToVsCodeOnline.js
// @license      MIT
// @author       kailiang.zhao
// @match        https://*.github.com/*/*
// @icon         https://code.visualstudio.com/favicon.ico
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433538/github%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACvsCode%E5%9C%A8%E7%BA%BF%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/433538/github%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%ACvsCode%E5%9C%A8%E7%BA%BF%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    insertButton();
})();

$(document).on('pjax:complete', function() {insertButton();})

function insertButton() {
    console.log('开始新增“VSCode在线浏览”按钮');
    var insertElem = document.querySelector(".file-navigation > .flex-auto");
    var template, frag;
    if (insertElem === null) {
        insertElem = document.querySelector("#blob-path");
        template = '<a class="btn mr-2" target="_blank" href="https://github1s.com' + window.location.pathname + '">VSCode在线浏览</a>';
        frag = document.createRange().createContextualFragment(template);
    } else {
        template = '<a class="btn ml-2" target="_blank" href="https://github1s.com' + window.location.pathname + '">VSCode在线浏览</a>';
        frag = document.createRange().createContextualFragment(template);
    }
    insertElem.after(frag.firstChild);
    console.log('新增“VSCode在线浏览”按钮成功');
}
