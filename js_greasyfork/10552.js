// ==UserScript==
// @name           TDGD
// @version        2.0
// @namespace      TeenDreams Gallery Downloader
// @description    Download the zips of you favorite models
// @include        http://www.teendreams.com/t3/set/view/photo/*
// @downloadURL https://update.greasyfork.org/scripts/10552/TDGD.user.js
// @updateURL https://update.greasyfork.org/scripts/10552/TDGD.meta.js
// ==/UserScript==
url = window.location;
enlaces = document.getElementsByTagName('a');
url = new String(window.location);
set = url.split("/photo/")[1].split("/")[0];
enlaces[18].setAttribute('href', "http://content.teendreams.com/content/zips/tdreams_"+ set +".zip");
