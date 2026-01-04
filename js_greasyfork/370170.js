// ==UserScript==
// @name         Ebay no Redirect to similar item
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds "nordt=true" to all itm links on ebay, which prevents a redirect to a "similar item" //keine Weiterleitung auf ähnlichen Artikel bei Ebay
// @author       sel3l
// @include        https://www.ebay.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370170/Ebay%20no%20Redirect%20to%20similar%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/370170/Ebay%20no%20Redirect%20to%20similar%20item.meta.js
// ==/UserScript==

(function() {
    'use strict';

var links = document.getElementsByTagName("a");

for (var i=0,imax=links.length; i<imax; i++) {
    if(links[i].href.search("/itm/")>0) links[i].href = links[i].href+"&nordt=true";
}

})();