// ==UserScript==
// @name         LinkShrink
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://linkshrink.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22684/LinkShrink.user.js
// @updateURL https://update.greasyfork.org/scripts/22684/LinkShrink.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var idx =document.location.pathname.indexOf("=http://");
if(idx>0){
    document.location = document.location.pathname.substr(idx+1);
} else {
    var link = $("#skip a");
    if(link && link.length > 0)
        document.location = link[0].href;
}
 