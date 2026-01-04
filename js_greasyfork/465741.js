// ==UserScript==
// @name         JDownloader Automat
// @namespace    https://toplak.info
// @author       Bernard Toplak
// @version      1.0
// @description  Send fireload.com (or any active webpage) URL to JDownloader using Click'n'Load 2 functionality.
// @match        https://*.fireload.com/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465741/JDownloader%20Automat.user.js
// @updateURL https://update.greasyfork.org/scripts/465741/JDownloader%20Automat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    
    var jdownloaderUrl = 'http://127.0.0.1:9666/flash/add?urls='+url;

    GM.xmlHttpRequest({
        method: 'POST',
        url: jdownloaderUrl,
        headers : {
            Referer: "http://localhost/"
        },
        data: 'urls='+ url,
        onload: function(response) {
            console.log('URL sent to JDownloader: '+url);
        },
        onerror: function(error) {
            console.error('Error sending URL to JDownloader:', error);
        }
    });

})();