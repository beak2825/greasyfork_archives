// ==UserScript==
// @name         Paid Note Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       Theta
// @match        https://note.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=note.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442122/Paid%20Note%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/442122/Paid%20Note%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        const payElem = document.getElementsByClassName("m-paywallHeader");
        const existingNoticeElem = document.getElementsByClassName("paid-notice-elem");
        if(payElem.length && existingNoticeElem.length===0){
            const par = document.getElementsByClassName("p-article")[0];

            const noticeElem = document.createElement('p');
            noticeElem.prepend("有料記事");
            noticeElem.className = "paid-notice-elem";
            Object.assign(noticeElem.style,{
                color:"red",
                textAlign:"center",
                fontSize:"48px",
                fontWeight:"bold",
                backgroundColor:"yellow",
                margin:"20px auto"
            });

            const tmp = par.children[0];
            par.insertBefore(noticeElem, tmp);
        }
    },1000);
})();