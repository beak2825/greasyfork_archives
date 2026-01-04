// ==UserScript==
// @name         Crowdin Prewrap
// @namespace    https://gist.github.com/Spidersouris/d5fe69384b25fc9e9ae7282361e9fe17
// @version      0.4
// @description  defines "white-space: pre-wrap" to pre on Crowdin
// @author       Enzo Doyen
// @match        https://crowdin.com/*
// @match        https://valve.crowdin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421151/Crowdin%20Prewrap.user.js
// @updateURL https://update.greasyfork.org/scripts/421151/Crowdin%20Prewrap.meta.js
// ==/UserScript==

(function init(){var el = document.getElementById('translation');if (el) { el.style.removeProperty('padding-bottom'); } else { setTimeout(init, 0);}})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('pre { white-space: pre-wrap !important; }');