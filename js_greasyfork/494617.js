// ==UserScript==
// @name         tryOutView
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  try out
// @author       m
// @match        *://ai.goviewlink.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/494617/tryOutView.user.js
// @updateURL https://update.greasyfork.org/scripts/494617/tryOutView.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('try out On!')
    setTimeout(()=>{
        const target = document.getElementsByClassName('n-modal-body-wrapper')[0] || null
        if(target) {
            const parent = target.parentElement;
            parent.removeChild(target)
        }
    }, 500)
    // Your code here...
})();