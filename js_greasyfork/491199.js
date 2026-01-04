// ==UserScript==
// @name        CourseShare
// @namespace   Violentmonkey Scripts
// @match       https://www.coursera.org/*
// @icon        https://f-droid.org/repo/com.fhs.ksre/en-US/icon_9lz9lmbGFBvVD8zrAr5ppDSiHa0BY_1M4Nq0waQmrLk=.png
// @grant       none
// @version     1.0
// @author      Some ukranon 🇺🇦
// @license     MIT
// @description Share submission link with others
// @downloadURL https://update.greasyfork.org/scripts/491199/CourseShare.user.js
// @updateURL https://update.greasyfork.org/scripts/491199/CourseShare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createPopup(newUrl) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.padding = '10px';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid #ddd';
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)';

        const link = document.createElement('input');
        link.value = newUrl;
        link.readOnly = true;
        link.style.marginRight = '10px';

        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy';
        copyButton.onclick = function() {
            navigator.clipboard.writeText(newUrl).then(() => {
                copyButton.innerText = 'Done!';
                setTimeout(() => popup.remove(), 2000);
            });
        };

        popup.appendChild(link);
        popup.appendChild(copyButton);
        document.body.appendChild(popup);
    }

    function interceptData() {
        let originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                let pattern = /api\/onDemandPeerComments\.v1\/\?q=submission&userId=\d+&peerSubmissionId=([^\~]+)~([^\~]+)~([^\~]+)&fields=/;
                let matches = url.match(pattern);
                if (matches && matches.length > 3) {
                    let importantPart = matches[3];
                    if (importantPart) {
                        let currentUrl = window.location.href;
                        let newUrl = currentUrl.replace(/\/submit$/, '/review/' + importantPart);
                        createPopup(newUrl);
                    }
                }
            });
            originalOpen.apply(this, [method, url]);
        };
    }

    interceptData();
})();