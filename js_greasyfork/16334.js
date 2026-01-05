// ==UserScript==
// @name        palimas.com fix
// @namespace   deadmeat@ŧrash-mail.com
// @description removes malicious links from palimas.com
// @include     http://palimas.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16334/palimascom%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16334/palimascom%20fix.meta.js
// ==/UserScript==
var a = document.getElementsByTagName("a");
for (i = 0; i < a.length; i++) {
  var onclick = a[i].getAttributeNode("onclick");
  var href = a[i].getAttributeNode("href");
  if (href.value == "http://prpops.com/p/9vyv/direct") {
    var video = onclick.value;
    var regex = /video.php\?id=[0-9]+/.exec(video);
    a[i].setAttribute("href", regex);
    a[i].removeAttribute("onclick");
  }
}
