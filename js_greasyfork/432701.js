// ==UserScript==
// @name         Eink-Zhihu
// @namespace    https://greasyfork.org/users/169007
// @version      1.4.6
// @description  Keep only main content in zhihu
// @author       ZZYSonny
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432701/Eink-Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/432701/Eink-Zhihu.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    const exGlobalStyle = document.createElement('style');
    const M = [
        [
            [
                ".VideoAnswerPlayer",
                ".CornerButtons",
                ".AppHeader",
                ".QuestionHeader",
                ".Question-sideColumn",
                ".GlobalSideBar",
                ".Reward",
                ".Catalog",
                ".Sticky",
                ".MCNLinkCard",
                ".Topstory > div:not(.Topstory-container)"
            ], c => `${c}{display: none;}`
        ], [
            [
                ".Question-main",
                ".Question-mainColumn",
                ".Topstory-container",
                ".Topstory-mainColumn"
            ],c => `${c}{width:100%;padding:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;}`
        ], [
            ["figure"],
            c => `${c}{width: 50%;padding-left:25%;pointer-events:none;}`
        ]
    ];
    exGlobalStyle.type = 'text/css';
    exGlobalStyle.innerHTML = M.flatMap(p => p[0].map(p[1])).join("\n");
    head.appendChild(exGlobalStyle);
})();