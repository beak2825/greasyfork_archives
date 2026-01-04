// ==UserScript==
// @name         Download BiliBili
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trying to download bilibili vedios and mp3
// @author       lowkey
// @match        *://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kawabangga.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455890/Download%20BiliBili.user.js
// @updateURL https://update.greasyfork.org/scripts/455890/Download%20BiliBili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("start");
    // Get the url
    let url = window.location.href;
    let index = url.lastIndexOf("/");
    url = url.substring(0, index);
    console.log(url);
    // Add copy button
    let executeCount = 0;
    var autoAddInterval = setInterval(addButton, 1000);
    function addButton(){
        if(executeCount++ > 20) { // 20 seconds
            clearInterval(autoAddInterval);
        }
        if(document.querySelector('#neal_copy_btn') != null) return;
        let groupContainer = document.querySelector('.share-wrap'); //get this with the browser

        //clone node
        let copyBtnDiv = document.createElement("div");
        copyBtnDiv.innerHTML = '<div id="neal_copy_btn">下载</div>'
        copyBtnDiv.onclick = function(){
            let downloadUrl = escape(encodeURIComponent(url));
            console.log(downloadUrl);
            let mp3Download = "https://youtube4kdownloader.com/download/video/" + downloadUrl;
            window.open(mp3Download);
        }
        groupContainer.appendChild(copyBtnDiv);
    }
})();