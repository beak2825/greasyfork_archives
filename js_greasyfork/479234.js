// ==UserScript==
// @name         Send magnet link to server
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  send magnet link to a server when clicked on a link with href containing 'magnet:?'
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/479234/Send%20magnet%20link%20to%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/479234/Send%20magnet%20link%20to%20server.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a' && event.target.href.includes('magnet:?')) {
            const url = 'http://www.etion.cn/index.php?m=wxcx&a=savelist';
            const params = new URLSearchParams();
            params.append('link', event.target.href);

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: params.toString(),
                onload: function(response) {
                    let responseData = JSON.parse(response.responseText);
                    if (responseData.status === 1) {
                        GM_notification("Success", "Link sent successfully");
                        alert("Link sent successfully");
                    }else{
                        alert("err");
                    }
                    console.log('Server response:', responseData);
                }
            });

            console.log('Link sent: ' + event.target.href);

            // Prevent the default action (navigating to the link)
            event.preventDefault();
        }
    });
})();
