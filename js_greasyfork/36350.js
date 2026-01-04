// ==UserScript==
// @name         DontTouchMyScroll
// @namespace    NoNameSpace
// @version      0.1
// @description  port from DontTouchMyScroll-Chrome
// @author       You
// @include      *
// @match        https://github.com/levibostian/DontTouchMyScroll-Chrome/blob/master/app/disable_scroll.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36350/DontTouchMyScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/36350/DontTouchMyScroll.meta.js
// ==/UserScript==

'use strict';

/*
Found script: https://gist.github.com/oxguy3/ebd9fe692518c7f7a1e9#file-roughscroll-js
*/

document.getElementsByTagName("body")[0].addEventListener("wheel",function (event) {
    // exception for ACE Editor, JS text editor used by sites like GitHub
    if (event.target.classList.contains('ace_content')) {
        return;
    }

    event.stopPropagation();
}, true);