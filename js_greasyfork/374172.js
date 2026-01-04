// ==UserScript==
// @name         GoogleDriver Auto Downloader
// @namespace    http://blog.kttsite.com/
// @version      1.0
// @description  Google雲端硬碟自動下載
// @author       ThanatosDi
// @match        https://drive.google.com/file/d/*
// @match        https://drive.google.com/uc*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/374172/GoogleDriver%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/374172/GoogleDriver%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href;
    var firstpage = new RegExp(/d\/[\S]+\//);
    var secondpage = new RegExp(/uc\?id=[\S]+&/);
    if (firstpage.test(url)){
        var fileid = location.href.split('/')[5];
        console.log(fileid);
        document.location.href="https://drive.google.com/uc?authuser=0&id="+fileid+"&export=download";
    }
    if (secondpage.test(url)){
        document.getElementById('uc-download-link').click();
    }
})();
