// ==UserScript==
// @name        PRES http redirect
// @namespace   PRESredirector
// @match       https://issa7-prerelease-ru.by.mgo.su/*
// @grant       none
// @version     1.0
// @author      -
// @description 16.04.2020, 13:35:45
// @downloadURL https://update.greasyfork.org/scripts/401078/PRES%20http%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/401078/PRES%20http%20redirect.meta.js
// ==/UserScript==

var url = location.href;
location.href = 'http://'+url.split('//')[1];