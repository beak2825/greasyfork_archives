// ==UserScript==
// @name         CopyFromHill
// @namespace    http://tampermonkey.net/
// @version      2024-03-11
// @description  Copy text from McGraw Hill.
// @author       OakSwingZZZ
// @match        https://prod.reader-ui.prod.mheducation.com/*
// @match        https://my.mheducation.com/secure/student/urn:com.mheducation.openlearning:enterprise.identity.organization:prod.global:organization:a74e8033-7fea-45f4-83af-b6df20ed0f49/urn:com.mheducation.openlearning:enterprise.roster:prod.us-east-1:section:e9c0dac0-437c-11ee-a3cd-33124b2453ac/dashboard/section
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mheducation.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489597/CopyFromHill.user.js
// @updateURL https://update.greasyfork.org/scripts/489597/CopyFromHill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const myTimeout = setTimeout(ready, 4000);
    let iframe;

    window.addEventListener("keydown", (e)=>{
        if(e.code == "KeyR"){
                $(".cdk-overlay-container")[0].remove();
        }
    });

    function ready() {

        iframe = document.getElementsByTagName("iframe")[0].contentWindow.document;

        iframe.addEventListener("keydown", (e)=>{
            if (e.code == "KeyC" && e.ctrlKey && e.shiftKey){
                const selection = iframe.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const text = range.toString();
                    console.log(text);
                    GM_setClipboard(text);
                }
            }
            if(e.code == "KeyR"){
                $(".cdk-overlay-container")[0].remove();
            }

        });
        let body = iframe.getElementsByTagName("body")[0];
        body.setAttribute("oncopy", "return true");

        window.setInterval(function(){document.title = "COPY ENABLED";},200);
        $("div.controls").append("<h1>Press R when window goes grey after text selection to enable copying.</h1>");
    }
})();