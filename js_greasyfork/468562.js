// ==UserScript==
// @name         Proxy Server Web Browsing with Authentication
// @namespace    http://your-site-name-here/
// @version      1.0
// @description  Use a proxy server with authentication to browse the web
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468562/Proxy%20Server%20Web%20Browsing%20with%20Authentication.user.js
// @updateURL https://update.greasyfork.org/scripts/468562/Proxy%20Server%20Web%20Browsing%20with%20Authentication.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set up the proxy configuration
    var proxyHost = '172.16.0.122'; // Replace with your own proxy server address
    var proxyPort = '8000'; // Replace with your own proxy server port
    var proxyUrl = 'http://' + proxyHost + ':' + proxyPort;

    // Set up the authentication information for the proxy server
    var authName = 'lijintao'; // Replace with your own username for authentication
    var authPass = 'jingMK23102!'; // Replace with your own password for authentication

    // Get the current page's content using a proxy server with authentication
    var xhr = new XMLHttpRequest();
    xhr.open('GET', proxyUrl + '?url=' + encodeURIComponent(window.location.href), true);
    xhr.setRequestHeader('Proxy-Authorization', 'Basic ' + btoa(authName + ':' + authPass));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Display the retrieved web page content
            unsafeWindow.document.documentElement.innerHTML = xhr.responseText;
        }
    };
    xhr.send();
})();