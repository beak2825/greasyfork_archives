// ==UserScript==
// @name        Github like reader
// @namespace   Violentmonkey Scripts
// @match       https://*.github.com/*
// @grant       none
// @version     1.2
// @author      Maxw
// @description Ajusta a página com a largura da tela automaticamente.
// @downloadURL https://update.greasyfork.org/scripts/405021/Github%20like%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/405021/Github%20like%20reader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    style.innerHTML = '.timeline-new-comment{max-width: 100%} .markdown-body{ font-size: 1.4em } .discussion-timeline{ width: 90% } .container-lg{max-width: 90%} .container-xl{max-width: 90%}';
    document.head.appendChild(style);
})();