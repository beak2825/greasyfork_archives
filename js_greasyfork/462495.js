// ==UserScript==
// @name         Kill Application
// @namespace    http://candao.com/
// @version      1.4
// @description  Automatically append user.name=root to Kill Application requests in YARN Web UI
// @author       Bruce Lu
// @match        http://node01:8088/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462495/Kill%20Application.user.js
// @updateURL https://update.greasyfork.org/scripts/462495/Kill%20Application.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function interceptRequests() {
        const userName = 'root';
        const originalOpen = XMLHttpRequest.prototype.open;
        const baseUri = 'http://node01:8088'

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            if (method.toLowerCase() === 'put' && url.includes('/ws/v1/cluster/apps/')) {
                url = baseUri + url;
                url += (url.includes('?') ? '&' : '?') + 'user.name=' + userName;
                console.log('Modified request URL:', url);
            }

            return originalOpen.apply(this, [method, url, async, user, password]);
        };
    }

    const script = document.createElement('script');
    script.textContent = `(${interceptRequests.toString()})();`;
    document.head.appendChild(script);
})();