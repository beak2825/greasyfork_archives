// ==UserScript==
// @name         GetTheCurrentDate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get The Current Date
// @author       MeGaBOuSsOl
// @match        Your url
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/433628/GetTheCurrentDate.user.js
// @updateURL https://update.greasyfork.org/scripts/433628/GetTheCurrentDate.meta.js
// ==/UserScript==

const date = new Date();
var day= date.getDate();
var month = date.getMonth() +1; 
var year=date.getYear();
var today= ("le " +day + '/' + month + '/'+ ((2000+year)-100));
alert(today);
