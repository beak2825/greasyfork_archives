// ==UserScript==
// @name         FC Companion to the Companion
// @namespace    kmcgurty.com
// @version      1
// @description  Opens FC levels in the desktop app
// @author       Kmcgurty
// @match        http://fantasticcontraption.com/?designId=*
// @match        http://fantasticcontraption.com/?levelId=*
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419572/FC%20Companion%20to%20the%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/419572/FC%20Companion%20to%20the%20Companion.meta.js
// ==/UserScript==

let uri = document.querySelector("footer div:nth-child(3) a").href;
let id = uri.split(":")[1];

let url = `http://localhost:58889/launch?id=${encodeURIComponent(id)}`;

console.log("url:" + url);

GM_xmlhttpRequest({
    method: "GET",
    url: url,
    onload: function(response) {
        console.log(response);
        close();
    },
    onerror: function(error){
        console.log(error)
    }
});