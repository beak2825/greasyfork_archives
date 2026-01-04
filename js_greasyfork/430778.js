// ==UserScript==
// @name         Pixiv new page opener
// @name:zh-CN   Pixiv new page opener
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  A tool to open some of pixiv pages in a new tab
// @description:zh-CN  一个用于将某些pixiv页面在新标签页打开的工具
// @author       Paper-Folding
// @match        https://www.pixiv.net/**
// @icon         https://www.google.com/s2/favicons?domain=pixiv.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430778/Pixiv%20new%20page%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/430778/Pixiv%20new%20page%20opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setInterval(() => {
        if (document.URL.search(/discovery|bookmark_new_illust|tags|following|users/) !== -1 || location.pathname === '/') {
            let allSubjects = document.querySelectorAll("[type=illust]");
            squarePageDealer(allSubjects);
        }
    }, 1000);
})();

function squarePageDealer(squares) {
    if (squares == null || squares.length === 0)
        return;
    squares.forEach(square => {
        if (square.dataset.newPageOpenerReady === 'true')
            return;
        let a = square.querySelector('a'), link;
        if (a != null)
            link = square.querySelector('a').getAttribute('href');
        else
            link = square.querySelector("span[to]").getAttribute("to");
        square.addEventListener('click', function (e) {
            if (e.target.tagName !== 'IMG')
                return;
            e.stopImmediatePropagation();
            e.stopPropagation();
            window.open(link, '_blank').focus();
            e.preventDefault();
        });
        square.dataset.newPageOpenerReady = true;
    });
}
