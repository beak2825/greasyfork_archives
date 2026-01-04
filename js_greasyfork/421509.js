// ==UserScript==
// @name         Github1s
// @namespace    https://github.com/JackieZheng/Github1s
// @version      0.5
// @description  One second to read GitHub code with VS Code.
// @author       JackieZheng
// @match        https://github.com/*/*
// @supportURL   https://github.com/JackieZheng/Github1s/issues
// @icon         https://github1s.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/421509/Github1s.user.js
// @updateURL https://update.greasyfork.org/scripts/421509/Github1s.meta.js
// ==/UserScript==

GM_addStyle("anchored-position{display: none !important}}");
GM_addStyle("anchored-position[class$=popover-open] {display: block !important}}");

(function() {
    'use strict';
    var github1sBtn = document.createElement("li");
    github1sBtn.innerHTML ='Github1s';
    github1sBtn.className='open-on-sourcegraph btn btn-sm tooltipped tooltipped-s';
    github1sBtn.style.color='var(--color-btn-primary-text)';
    github1sBtn.style.backgroundColor='var(--color-btn-primary-bg)';
    var li=document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline').item(0)?.getElementsByTagName('li')[0]
    document.getElementsByClassName('pagehead-actions flex-shrink-0 d-none d-md-inline').item(0)?.insertBefore(github1sBtn,li)
    github1sBtn.onclick=function()
    {
        var href=top.location.href.replace('github.com','github1s.com')
        top.location.href=href;
    }
})();
