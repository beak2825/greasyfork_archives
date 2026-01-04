// ==UserScript==
// @name         acwing player control
// @namespace    http://tampermonkey.net/
// @version      2024Sep091705
// @description  video control
// @author       onionycs
// @match        https://www.acwing.com/file_system/file/content/whole/index/content/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acwing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507624/acwing%20player%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/507624/acwing%20player%20control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {

        if (event.key === 'd'||event.key === 'D') {
            let kai=document.getElementsByClassName('icon-danmu-open')[0];
            if(kai.style.display === 'none'){
                document.getElementsByClassName('icon-danmu-close')[0].click();
            }else{
                kai.click();
            }
        }

        if (event.key === 't'||event.key === 'T') {
            document.getElementsByClassName('wide-screen-model')[0].click();
        }

    });
    // Your code here...
})();