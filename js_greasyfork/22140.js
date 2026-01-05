// ==UserScript==
// @name        Staging Banner
// @include     https://staging.origamirisk.com/*
// @description Displays a Scrolling marquee on Origami Staging
// @author Gregory Alford <greg.alford@myfloridacfo.com> 
// @version 1.0
// @namespace https://greasyfork.org/users/59239
// @downloadURL https://update.greasyfork.org/scripts/22140/Staging%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/22140/Staging%20Banner.meta.js
// ==/UserScript==

var hd = document.createElement("div");
hd.innerHTML = '<div style="margin: auto auto 0 auto; ' +
    'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
    'font-size: x-large; background-color: #fff000; ' +
    'color: #00000; ;" ><marquee style="margin: auto 0 1px 0; height: 20px;" scrollamount= "15";> ' +
    'STAGING ENVIRONMENT - NOT LIVE DATA'+
    '</marquee></div>';
document.body.insertBefore(hd, document.body.firstChild);