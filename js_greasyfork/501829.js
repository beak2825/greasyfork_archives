// ==UserScript==
// @name         Gists GitHub 修改页面拉长文本框
// @namespace    http://tampermonkey.net/
// @version      2024-07-27.2
// @description  一屏更多内容！
// @author       Keeper
// @match        *://gist.github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501829/Gists%20GitHub%20%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E6%8B%89%E9%95%BF%E6%96%87%E6%9C%AC%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/501829/Gists%20GitHub%20%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2%E6%8B%89%E9%95%BF%E6%96%87%E6%9C%AC%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const doEdit = function() {
        const editTextArea = document.querySelector("#gists > div.js-gist-file > file-attachment > blob-editor > div.commit-create.position-relative > div > div");
        if (editTextArea !== undefined && editTextArea !== null) {
            editTextArea.style = "height: 1000px;";
        }
    }
    doEdit();
    setInterval(doEdit, 100);
    window.onload=function(){
        doEdit();
    }
})();