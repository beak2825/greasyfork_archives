// ==UserScript==
// @name         mitce post
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  push links
// @author       You
// @match        https://mitce.com/clientarea.php?*action=productdetails*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mitce.com
// @connect      nas.pasre.cn
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498736/mitce%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/498736/mitce%20post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var input = document.getElementById('subscriptionautoLink');
    if (input) {
        var clash = input.value;
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://nas.pasre.cn:612/mitce?url=" + encodeURIComponent(clash),
            onload: function (response) {
                console.log("success", response.responseText);
            }
        });
    }
})();