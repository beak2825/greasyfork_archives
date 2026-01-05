// ==UserScript==
// @name         No More Amazon Mobile Links On Desktop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes all Amazon Mobile Pages to Amazon Desktop.
// @author       nascent
// @match        http://www.amazon.com/gp/aw/*
// @match        http://www.amazon.co.uk/gp/aw/*
// @grant        none
//
// @history 0.1 Initial Release
// @downloadURL https://update.greasyfork.org/scripts/17540/No%20More%20Amazon%20Mobile%20Links%20On%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/17540/No%20More%20Amazon%20Mobile%20Links%20On%20Desktop.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


//  Example URLs
//  http://www.amazon.co.uk/gp/aw/ol/B006GNMOZE/ref=mw_dp_olp?ie=UTF8&condition=new
//  http://www.amazon.co.uk/Ultimate-Steering-Wheel-Stand-Black/dp/B006GNMOZE/ref=sr_1_1?ie=UTF8&qid=1456827307&sr=8-1&keywords=The+Ultimate+Steering+Wheel+Stand+in+Black

var url = window.location.href;
var newUrl = url.replace(/\/gp\/aw\//g, "/").replace(/\/d\//g, "/dp/").replace(/\/ol\//g, "/dp/");
window.location.href = newUrl;