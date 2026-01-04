// ==UserScript==
// @name         highlight haskell code in okmij.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hightlight haskell code in okimij.org
// @author       oshmkufa
// @match        https://okmij.org/ftp/*.hs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okmij.org
// @license      MIT
// @resource HLJS_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/languages/haskell.min.js
// @grant GM_getResourceText
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/472246/highlight%20haskell%20code%20in%20okmijorg.user.js
// @updateURL https://update.greasyfork.org/scripts/472246/highlight%20haskell%20code%20in%20okmijorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const hljsCSS = GM_getResourceText("HLJS_CSS");
    GM_addStyle(hljsCSS);

    const code = document.querySelector("pre");
    code.classList.add("language-haskell");
    hljs.highlightElement(code);
})();