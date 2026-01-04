// ==UserScript==
// @name         TikTok Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tiktok Video Downloader
// @author       You
// @match        https://www.tiktok.com/foryou*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449644/TikTok%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449644/TikTok%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var downloadFile = function(url, name){
        var ajax=new XMLHttpRequest();
        ajax.open( "GET", url, true);
        ajax.responseType = 'blob';
        ajax.onload= function(e){
            saveBlob(e.target.response, name, 'video/mp4');
        };
        setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
        return ajax;
    };
    var saveBlob = function(blob, fileName) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        a.dispatchEvent(new MouseEvent('click'));
    }
    var toogle_btn = document.createElement("button");
    toogle_btn.innerHTML = '🔽';
    toogle_btn.setAttribute(
        "style",
        "position: fixed;height: 30px;width: 30px;top: 100px;left: 5px;/z-index: 9999;border: none;background: #fff0;font-size: 27px;padding: 0px 0px 0px 0;opacity: 0.4;"
    );
    var download_video = function () {
        var timeNow = new Date();
        var fileName = timeNow.toLocaleDateString().replaceAll('/', '-') + timeNow.toLocaleTimeString().replaceAll(':', "-");
        var videoTag = document.getElementsByTagName('video')[0];
        downloadFile(videoTag.src, fileName);
    }
    toogle_btn.addEventListener('click', download_video);
    document.body.appendChild(toogle_btn);
    // Your code here...
})();