// ==UserScript==
// @name         QD
// @namespace    undefined
// @version      0.0.2
// @description  AD killer
// @author       Xiang Yang
// @match        https://www.javqd.com/*
// @match        https://www.pornqd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37289/QD.user.js
// @updateURL https://update.greasyfork.org/scripts/37289/QD.meta.js
// ==/UserScript==

var intval = setInterval(check, 200);

function check(){
    if(document.getElementById('external-embed')){
        if(document.getElementById('external-embed').src){
           clearInterval(intval);
           window.location.href=document.getElementById('external-embed').src;
        }
    }
}