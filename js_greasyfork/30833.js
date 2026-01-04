// ==UserScript==
// @name        Tumblr Image URL Redirect
// @description Redirects Tumblr Image URLs to the raw version
// @version     1.5.4
// @author      justausername
// @include     *media.tumblr.com*
// @include     *data.tumblr.com*
// @include     *vtt.tumblr.com*
// @run-at      document-start
// @namespace   justausername
// @downloadURL https://update.greasyfork.org/scripts/30833/Tumblr%20Image%20URL%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/30833/Tumblr%20Image%20URL%20Redirect.meta.js
// ==/UserScript==

if(window.location.hostname.indexOf("media.tumblr.com") > 0){
  window.location = window.location.href.replace(/vt(\.media)*\.tumblr\.com/i,"vtt.tumblr.com").replace(/..\.media\.tumblr\.com/i,"s3.amazonaws.com/data.tumblr.com").replace(/_1280h*|_640h*|_540h*|_500h*|_400h*|_250h*|_100h*/i,"_raw");
}else if(window.location.href.match(/_720|_480/i) !== null) {
  window.location = window.location.href.replace(/_720|_480/i,"");
}