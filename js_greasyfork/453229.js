// ==UserScript==
// @name         AER DL
// @namespace    aer
// @version      0.1
// @description  AER quick dl
// @author       Yui
// @match        https://www.aeaweb.org/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aeaweb.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453229/AER%20DL.user.js
// @updateURL https://update.greasyfork.org/scripts/453229/AER%20DL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url0='oo'
    var url1='11'
    var num=document.querySelectorAll(' h3 > a').length
    for(i=0;i<num;i++){
        url0=document.querySelectorAll(' h3 > a')[i].href
        url1=url0.replace(/www.*articles\?id=/,'pubs.aeaweb.org/doi/pdfplus/')
        document.querySelectorAll(' h3 > a')[i].href=url1
        document.querySelectorAll(' h3 > a')[i].target='_blank'
        console.log(i)
        console.log(url1)
    }


})();