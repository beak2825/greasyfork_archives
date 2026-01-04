// ==UserScript==
// @name         Print requests with content-type 'application/vnd.apple.mpegurl'
// @namespace    http://your-domain-here/
// @version      12
// @description  Print content-type 'application/vnd.apple.mpegurl'
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463890/Print%20requests%20with%20content-type%20%27applicationvndapplempegurl%27.user.js
// @updateURL https://update.greasyfork.org/scripts/463890/Print%20requests%20with%20content-type%20%27applicationvndapplempegurl%27.meta.js
// ==/UserScript==


(function() {
  'use strict';

    const xhrProto = XMLHttpRequest.prototype;
    const origOpen = xhrProto.open;
    const origSend = xhrProto.send;

    xhrProto.open = function(method, url) {
        this.addEventListener('load', function() {
            console.log('Response headers:', this.getAllResponseHeaders());
        });

        origOpen.apply(this, arguments);
    };

    xhrProto.send = function() {
        origSend.apply(this, arguments);
    };


    // Add an event listener to wait for the page to load
    window.onload = function() {
        // Get all <video> tags on the page
        var videoTags = document.getElementsByTagName('video');

        // Loop through each <video> tag and log its source URL
        for (var i = 0; i < videoTags.length; i++) {
            console.log('Video source URL:', videoTags[i].src);
        }
    };
})();