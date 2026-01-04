// ==UserScript==
// @name         JDownloader Automat - Mod
// @namespace    reloxx13.jdownloader.automat-mod
// @author       Bernard Toplak
// @author       reloxx13
// @license MIT
// @version      1.1
// @description  Send URLs to JDownloader using Click'n'Load 2 functionality and close OCH page.
// @grant 		 window.close
// @grant 		 window.focus
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @match        https://*.fireload.com/*
// @match        https://*.1fichier.com/*
// @match        https://*.up-4ever.net/*
// @match        https://*.frdl.to/*
// @match        https://*.megaup.net/*
// @match        https://*.file-upload.org/*
// @match        https://*.ddownload.com/*
// @match        https://*.filefactory.com/*
// @match        https://*.rapidgator.net/*
// @match        https://*.send.cm/*
// @match        https://*.send.now/*
// @match        https://*.clickndownload.site/*
// @match        https://*.buzzheavier.com/*
// @match        https://*.mixdrop.ps/*
// @downloadURL https://update.greasyfork.org/scripts/520483/JDownloader%20Automat%20-%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/520483/JDownloader%20Automat%20-%20Mod.meta.js
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

          setTimeout(() => {
            window.close();
          },1000);
        },
        onerror: function(error) {
            console.error('Error sending URL to JDownloader:', error);
        }
    });

})();