// ==UserScript==
// @name         Fix WebEx
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Improve WebEx Browser Events!
// @author       You
// @match        https://*.webex.com/ec3300/*
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/gh/jonlabelle/cookie-js@0164446481bebb3bb283024f3b1aea1fe80a9d9b/Cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/415616/Fix%20WebEx.user.js
// @updateURL https://update.greasyfork.org/scripts/415616/Fix%20WebEx.meta.js
// ==/UserScript==
GM_addStyle ( `
#dockdomid {
	opacity: 0;
}
#dockdomid:hover {
	opacity: 1;
	transition: opacity .1s ease-in-out .0s; } .share-header-message-CkhKQ {
	display: none;
}
button[aria-label="Event information"] {
	display: none;
}
` );

(function() {
    'use strict';

    let firstName = "firstName";
    let lastName = "lastName";
    let email = "email";

    window.onload = () => {
        document.getElementById("ec-btn-joinnow-thin-client").type = "submit";
        document.getElementById("_submit").remove();
        document.getElementsByName(firstName)[0].value = Cookie.get(firstName);
        document.getElementsByName(lastName)[0].value = Cookie.get(lastName);
        document.getElementsByName(email)[0].value = Cookie.get(email);

        document.getElementsByName("JoinActionForm")[0].addEventListener("submit", (e) => {
            Cookie.set(firstName, document.getElementsByName(firstName)[0].value, { expires: 365, sameSite: 'Strict', secure: true });
            Cookie.set(lastName, document.getElementsByName(lastName)[0].value, { expires: 365, sameSite: 'Strict', secure: true });
            Cookie.set(email, document.getElementsByName(email)[0].value, { expires: 365, sameSite: 'Strict', secure: true });
        });

        /*if (allfilled) {
            document.getElementsByName("JoinActionForm")[0].submit();
            }*/
    }

    //Connect to Audio
    let audioSelector = 'button[aria-label="Audio"]';
    let connectSelector = 'button[datadoi="AUDIO:VOIP:MENU_AUDIO"]';
    let fullscreenSelector = 'button.fullscreen';
    document.arrive(audioSelector, function() {
        document.querySelector(audioSelector).click();
    });
    document.arrive(connectSelector, function() {
        setTimeout(function () { //wait for connection
           document.querySelector(connectSelector).click();
            if (window.getComputedStyle(document.querySelector('.share-share-box-5GNZl')).display != "none") { //is screen shared?
                document.querySelector(fullscreenSelector).click();
            }
        }, 2000);
        Arrive.unbindAllArrive(); //free up memory
    });


})();