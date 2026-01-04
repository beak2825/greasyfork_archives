// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  23423423423
// @author       You
// @match        https://tqm.caq.org.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=caq.org.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477158/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/477158/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout( ()=>{
    document.getElementsByClassName('number')[0].innerText = '100分';
document.getElementsByClassName('mark')[0].innerText = '25';
    }, 1000);


    })();