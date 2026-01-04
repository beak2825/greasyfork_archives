// ==UserScript==
// @name         Resize Tumblr Image On New Tab
// @namespace    TumblrImgResize
// @version      1.1
// @description  Resizes images to their raw size on tumblr
// @homepageURL  https://greasyfork.org/en/scripts/368408-resize-tumblr-image-on-new-tab
// @run-at       document-idle
// @match        http://*.media.tumblr.com/*
// @match        https://*.media.tumblr.com/*
// @match        http://secure.static.tumblr.com/*
// @match        https://secure.static.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/368408/Resize%20Tumblr%20Image%20On%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/368408/Resize%20Tumblr%20Image%20On%20New%20Tab.meta.js
// ==/UserScript==

function replace(){
  var url = document.location.toString();
  if((url.substring(url.lastIndexOf("_")+1, url.lastIndexOf("_")+5) === "1280") === false){
  	location.replace((url.substring(0, url.lastIndexOf("_")+1) + "1280" + url.substring(url.lastIndexOf("."))));
  }
}

replace();

