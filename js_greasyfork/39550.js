// ==UserScript==
// @name         Chrome JS & CSS Highlighter
// @version      1.0
// @description  Highlight's CSS and JS code in tab
// @author       satanch
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/css.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/javascript.min.js
// @grant        none
// @namespace https://greasyfork.org/users/119240
// @downloadURL https://update.greasyfork.org/scripts/39550/Chrome%20JS%20%20CSS%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/39550/Chrome%20JS%20%20CSS%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname.substr(-3, 3) !== '.js' && window.location.pathname.substr(-4, 4) !== '.css')
        return false;

    const style = document.createElement('style');
    style.innerHTML = '.hljs{display:block;overflow-x:auto;padding:0.5em;background:white;color:black}.hljs-comment,.hljs-quote{color:#800}.hljs-keyword,.hljs-selector-tag,.hljs-section,.hljs-title,.hljs-name{color:#008}.hljs-variable,.hljs-template-variable{color:#660}.hljs-string,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-regexp{color:#080}.hljs-literal,.hljs-symbol,.hljs-bullet,.hljs-meta,.hljs-number,.hljs-link{color:#066}.hljs-title,.hljs-doctag,.hljs-type,.hljs-attr,.hljs-built_in,.hljs-builtin-name,.hljs-params{color:#606}.hljs-attribute,.hljs-subst{color:#000}.hljs-formula{background-color:#eee;font-style:italic}.hljs-selector-id,.hljs-selector-class{color:#9b703f}.hljs-addition{background-color:#baeeba}.hljs-deletion{background-color:#ffc8bd}.hljs-doctag,.hljs-strong{font-weight:bold}.hljs-emphasis{font-style:italic}';
    document.querySelector('head').appendChild(style);

    document.body.style.margin = 0;
    const source = document.querySelector('pre');
    hljs.highlightBlock(source);
})();
