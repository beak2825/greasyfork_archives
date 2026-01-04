// ==UserScript==
// @name         Eink-Manhuagui
// @namespace    https://greasyfork.org/users/169007
// @version      1.0.0
// @description  Manhuagui Style
// @author       ZZYSonny
// @match        https://m.manhuagui.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436940/Eink-Manhuagui.user.js
// @updateURL https://update.greasyfork.org/scripts/436940/Eink-Manhuagui.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const head = document.getElementsByTagName('head')[0];
    const exGlobalStyle = document.createElement('style');
    const M = [
        [
            [
                "#manga > img",
            ], c => `${c}{height: 80vh !important; width: auto !important}`
        ],
        [
            [
                "#manga",
            ], c => `${c}{text-align: center}`
        ]
    ];
    exGlobalStyle.type = 'text/css';
    exGlobalStyle.innerHTML = M.map(p => p[0].map(p[1]).join("\n")).join("\n");
    head.appendChild(exGlobalStyle);
})();