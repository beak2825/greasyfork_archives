// ==UserScript==
// @name          DinNewTest
// @namespace     http://www.webmonkey.com
// @include       http://stackoverflow.com/*
// @description   A basic example of Greasemonkey that causes an alert at each page load.
// @version 0.0.1.20151001063056
// @downloadURL https://update.greasyfork.org/scripts/12778/DinNewTest.user.js
// @updateURL https://update.greasyfork.org/scripts/12778/DinNewTest.meta.js
// ==/UserScript==

GM_xmlhttpRequest ( {
    method:     "GET",
    url:        "http://www.google.com/",
    onload:     function (response) {
                    console.log (   response.status,
                                    response.responseText.substring (0, 80)
                                );
                }
} );