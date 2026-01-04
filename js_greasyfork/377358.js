// ==UserScript==
// @name         Resize Twitter Image On New Tab
// @namespace    TwitrImgResize
// @version      1.0
// @description  Resizes images to their raw size on twitter
// @homepageURL  https://greasyfork.org/en/scripts/377358-resize-twitter-image-on-new-tab
// @run-at       document-idle
// @match        https://pbs.twimg.com/media/*
// @downloadURL https://update.greasyfork.org/scripts/377358/Resize%20Twitter%20Image%20On%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/377358/Resize%20Twitter%20Image%20On%20New%20Tab.meta.js
// ==/UserScript==

function replace(){
  var url = document.location.toString();
  var type = url.substring(url.lastIndexOf(".")+1, url.lastIndexOf(".")+4);
  if(url.endsWith("?format="+type+"&name=orig")===false){
    location.replace(url + "?format="+type+"&name=orig");
  }
}

replace();

