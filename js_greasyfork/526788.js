// ==UserScript==
// @name         Fix google scholar Nature URL redirect error
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix google scholar Nature URL redirect error!
// @author       massyao
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @match        https://scholar.google.com/*
// @match        https://scholar.google.com.au/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526788/Fix%20google%20scholar%20Nature%20URL%20redirect%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/526788/Fix%20google%20scholar%20Nature%20URL%20redirect%20error.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('google scholar url error detecting !')
    const list = [...document.querySelectorAll('.gs_rt a')];
    list.forEach(a => {
        const link = a.href;
        if(link.match(/.+(redirect_uri=[^&]+[a-zA-Z]+\.\d+\..)+/)) {
            a.href = link.replace('.&', '&');
            console.log('nature url fixed!')
        }
    })
})();