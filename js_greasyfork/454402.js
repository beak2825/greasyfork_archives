// ==UserScript==
// @name         Overleaf customisation.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  overleaf line-wrap toggle for overleaf.com
// @author       You
// @match        https://www.overleaf.com/project/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454402/Overleaf%20customisation.user.js
// @updateURL https://update.greasyfork.org/scripts/454402/Overleaf%20customisation.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setTimeout(function () {
        var toolbar = document.querySelector('div.toolbar-editor > div.toolbar-right');
        var element = document.createElement('A');
        element.textContent = 'Toggle wrap';
        element.onclick = function() {
            var editor = document.querySelector('.ace-editor-body');
            let session = ace.edit(editor).getSession();
            session.setUseWrapMode(!session.$useWrapMode)
        };
        toolbar.insertBefore(element, toolbar.children[0]);
    }, 3000);
})();