// ==UserScript==
// @license MIT
// @name         QTI document downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  QTI createpoint.qti.qualcomm.com document download to file "DocNumber_version_title" old style small letter file name.
// @author       hk3f
// @match        https://createpoint.qti.qualcomm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qualcomm.com
// @grant    GM_xmlhttpRequest
// @grant    GM_openInTab
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @run-at   context-menu
// @downloadURL https://update.greasyfork.org/scripts/473568/QTI%20document%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/473568/QTI%20document%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
  //load context-menu URL
  let el = document.activeElement;
  if (el.tagName !== "A") el = el.closest("a");
  if (el) {
  let url = el.href;
  console.log(url);
  //parse URL title ID
  let idx = url.slice(url.lastIndexOf("/")+1 , url.length);
  console.log('TitleID=' , idx);
  //get title info json data
  let infoUrl = "https://createpoint.qti.qualcomm.com/chipcenter/title/" + idx;
  console.log('Url Of Title detailed info = ' , infoUrl);
  GM_xmlhttpRequest({
    method: 'GET',
    url: infoUrl,
    headers: {
        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
        'Accept': 'application/atom+xml,application/xml,text/xml',
    },
    onload: function(response) {
        var obj = JSON.parse(response.responseText);
        console.log("Target Document ID = ", obj.documents[0].id);
        //download target document with old style file name
        let urlTarget = "https://createpoint.qti.qualcomm.com/chipcenter/download/title/" + obj.documents[0].id;
        console.log("Target Document URL = ", urlTarget);
        GM_openInTab(urlTarget);
    }

  });

} else console.log('not actually a link');


})();