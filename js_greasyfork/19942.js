// ==UserScript==
// @name         UrlPrank
// @version      0.1
// @description  Change the URL and all the links on the page will change to that url. Use this to prank your friends!
// @author       Th3_A11_M1ghty_
// @match        *://*/*
// @namespace https://greasyfork.org/users/41967
// @downloadURL https://update.greasyfork.org/scripts/19942/UrlPrank.user.js
// @updateURL https://update.greasyfork.org/scripts/19942/UrlPrank.meta.js
// ==/UserScript==
/*jshint esnext: true */
url="example.com";
var body;
body = document.getElementsByTagName('a');
for (i = 0; i < body.length; i++) {
    document.getElementsByTagName("a")[i].href = url;
    }