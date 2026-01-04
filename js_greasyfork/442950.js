// ==UserScript==
// @name         Muestra selector de guias AST
// @namespace    https://discord.gg/YWwWdwqCZj
// @version      0.1
// @description  Muestra el selector de guias en task donde se oculta en el Advanced Autofill.
// @author       gianfap
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442950/Muestra%20selector%20de%20guias%20AST.user.js
// @updateURL https://update.greasyfork.org/scripts/442950/Muestra%20selector%20de%20guias%20AST.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('body>form, body>.content, body>#content {padding-top: 80px!important;')})();