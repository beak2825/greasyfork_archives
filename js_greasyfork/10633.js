// ==UserScript==
// @name       jawz Hybrid - Verify business categories
// @version    1.1
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10633/jawz%20Hybrid%20-%20Verify%20business%20categories.user.js
// @updateURL https://update.greasyfork.org/scripts/10633/jawz%20Hybrid%20-%20Verify%20business%20categories.meta.js
// ==/UserScript==

var check = $('h1').text().trim();

if (check == 'Verify business categories') {
    var naddy = $('p:contains("Name and address:")').text().replace('Name and address:','').replace(/(?:\r\n|\r|\n)/g, ' ');
    var searchUrl = "http://www.google.com/search?q=" + naddy;
    searchUrl = searchUrl.replace("&", "%26").replace(/[ ]/g, "+").replace('#', '');

    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var wleft = window.screenX;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";

    popupX = window.open(searchUrl, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
}