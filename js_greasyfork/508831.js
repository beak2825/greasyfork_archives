// ==UserScript==
// @name         Today
// @namespace    http://tampermonkey.net/
// @version      1
// @description  BackOffice today yönlendirme
// @author       Menderes Acarsoy
// @match        https://bo.bo-2222eos-gbxc.com/player/financial/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=837bahsine.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508831/Today.user.js
// @updateURL https://update.greasyfork.org/scripts/508831/Today.meta.js
// ==/UserScript==

var url = location.href;

var year = new Date().getFullYear();
var month = new Date().getMonth()+1;
var day = new Date().getDate();
var yday = new Date().getDate()-1;
var tomo = new Date().getDate()+1;
var paramFrom = "?from=" + year + "." + month + "." + day + ".00.00";
var paramFromYesterday = "?from=" + year + "." + month + "." + yday + ".00.00";
var paramTo= "&to=" + year + "." + month + "." + day + ".23.59";
var paramToTomo = "&to=" + year + "." + month + "." + tomo + ".23.59";

/// TODAY SEÇ ///
if(!location.href.includes('from') && !location.href.includes('lifetime')) {

   var hour = new Date().getHours();
   if (hour === 23) {window.location.replace(url.split("?")[0] + paramFrom + paramToTomo); return;}
   if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {window.location.replace(url.split("?")[0] + paramFromYesterday + paramTo); return;}

   window.location.replace(url + paramFrom + paramTo);
   return;
}
//////////////////////