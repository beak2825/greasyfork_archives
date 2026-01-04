// ==UserScript==
// @name         Change width
// @namespace    http://github.com/Yuto-24
// @version      0.1.1
// @description  take over width
// @author       Yuto-24
// @match        *://sspr-web.web.otsuka-shokai.co.jp/sspr/ESM/Content/Schedule/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=otsuka-shokai.co.jp
// @grant        none
// @license      Yuto-24
// @downloadURL https://update.greasyfork.org/scripts/473257/Change%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/473257/Change%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName('block_content')[0].style.width = 'calc(100% - 30px)'

    // document.getElementsByTagName('table')[8].style.width='100%'

    let n = document.getElementsByTagName('tr').length

    for(let i = 0; i < n; i++) {
        document.getElementsByTagName('tr')[i].style.width = '100%'
    }

    document.getElementById('ScrollTblHeaderDiv').style.width = 'calc(100vw - 331px - 15px - 14px)';
    document.getElementById('ScrollTblDiv').style.width = 'calc(100vw - 331px - 15px)';


})();