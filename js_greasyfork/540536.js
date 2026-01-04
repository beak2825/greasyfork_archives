// ==UserScript==
// @name         Fastmail catch all From
// @namespace    http://tampermonkey.net/
// @version      2025-06-23
// @license      MIT
// @description  Select wildcard e-mail to avoid using your personal e-mail
// @author       Leonard Slass
// @match        https://app.fastmail.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540536/Fastmail%20catch%20all%20From.user.js
// @updateURL https://update.greasyfork.org/scripts/540536/Fastmail%20catch%20all%20From.meta.js
// ==/UserScript==

(function() {
    'use strict';

let state = "start";

function setWildcard() {
    const wildcard = document.querySelector(".v-MenuOption button")
    if (wildcard) {
        console.log('Found wildcard button', wildcard);
        wildcard.click();
        state = 'start';
    } else {
        setTimeout(setWildcard, 200);
    }
}

function onCompose() {
   // Your code here
   const button = document.querySelector(".v-ComposeFrom-bottom button")
   if (button) {
       state = 'from';
       console.log('Found From button:', button);
       button.click();
       setWildcard();
   } else {
       setTimeout(onCompose, 200);
   }
}


let lastURL = '';

function checkURL() {
   const url = window.location.href;
   if (url !== lastURL) {
       if (window.location.href.includes('compose') && state !== "compose") {
           console.log('Compose detected');
           state = 'compose';
           onCompose();
       }
       lastURL = url;
   }
   setTimeout(checkURL, 100);
}

checkURL();

})();
