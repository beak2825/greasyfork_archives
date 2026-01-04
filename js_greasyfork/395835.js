// ==UserScript==
// @name         印象笔记网页版禁用保存网页功能 disable page saving function for evernote/yingxiangbiji
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  印象笔记网页版禁用保存网页功能
// @author       NEOTSO
// @match        https://app.yinxiang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395835/%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E7%89%88%E7%A6%81%E7%94%A8%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E5%8A%9F%E8%83%BD%20disable%20page%20saving%20function%20for%20evernoteyingxiangbiji.user.js
// @updateURL https://update.greasyfork.org/scripts/395835/%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0%E7%BD%91%E9%A1%B5%E7%89%88%E7%A6%81%E7%94%A8%E4%BF%9D%E5%AD%98%E7%BD%91%E9%A1%B5%E5%8A%9F%E8%83%BD%20disable%20page%20saving%20function%20for%20evernoteyingxiangbiji.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const disableSave = (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 83 && e.preventDefault();

    document.onkeydown = disableSave;

    var observer = new MutationObserver(function (mutations, self) {
        var el = document.querySelector("#mceu_1 iframe");
        if (el) {
            console.log('found!')
            el.contentDocument.onkeydown = disableSave;
            self.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
})();