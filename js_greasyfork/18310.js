// ==UserScript==
// @name         Twitter Image Auto Larger
// @description  推特大图
// @version      0.2
// @grant        none
// @include      *://pbs.twimg.com/media/*
// @namespace https://greasyfork.org/users/9440
// @downloadURL https://update.greasyfork.org/scripts/18310/Twitter%20Image%20Auto%20Larger.user.js
// @updateURL https://update.greasyfork.org/scripts/18310/Twitter%20Image%20Auto%20Larger.meta.js
// ==/UserScript==

var large = /.jpg:large/;
var orig = /.jpg:orig/;

if (large.test(location.href)) {
	location.href = location.href.replace(".jpg:large", ".jpg:orig");
}
else if (orig.test(location.href)) {}
else {
	location.href = location.href.replace(".jpg", ".jpg:orig");
}