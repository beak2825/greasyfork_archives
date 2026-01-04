// ==UserScript==
// @name         PILI HLS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  產生 HLS 連結
// @author       阿皇仔
// @match        https://play.pili.com.tw/filmPlay/*
// @icon         https://www.google.com/s2/favicons?domain=pili.com.tw
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436690/PILI%20HLS.user.js
// @updateURL https://update.greasyfork.org/scripts/436690/PILI%20HLS.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
(async function() {
    'use strict';

    // Your code here...
    var fileId = document.URL.match(/https?:\/\/.+?\/filmPlay\/(.+)/).at(1);
    var idToken = document.cookie.match(/idToken=(.+?);/).at(1);
    var data = await fetch("https://play.pili.com.tw/api/file/getFilmInfo", {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=utf-8",
            "idtoken": idToken
        },
        body: JSON.stringify({
            fileId: fileId,
            platform: "web"
        }),
        credentials: "include"
    }).then(response => {
        return response.json();
    }).then(result => {
        return result;
    });
    var fileUrl = data.fileUrl;
    var purpleBtn = document.querySelectorAll(".b-action > .btn.btn-purple.btn-round").item(0);
    var myBtn = document.createElement("a");
    myBtn.className = purpleBtn.className;
    myBtn.href = fileUrl;
    myBtn.innerText = "HLS下載";
    purpleBtn.parentNode.insertBefore(myBtn, purpleBtn);
})();