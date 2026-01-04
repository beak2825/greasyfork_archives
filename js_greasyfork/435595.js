// ==UserScript==
// @name         chaoxing downloader
// @namespace    cekavis
// @version      0.1
// @description  a small tool
// @author       Cekavis
// @match        *.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435595/chaoxing%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435595/chaoxing%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        var ppts = document.getElementsByTagName('iframe');
        console.log(ppts);
        for(var ppt of ppts){
            if(ppt.hasAttribute('data')){
                console.log(JSON.parse(ppt.getAttribute('data')).objectid);
                var a = document.createElement('a');
                a.target = "_blank";
                a.href = "https://cs-ans.chaoxing.com/download/" + JSON.parse(ppt.getAttribute('data')).objectid;
                a.innerHTML = "点击下载";
                ppt.parentNode.appendChild(a);
            }
        }
    }
})();