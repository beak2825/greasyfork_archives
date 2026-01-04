// ==UserScript==
// @name         Quranic Clock 12hr Converter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Converts 24-hour times to 12-hour AM/PM format on quranic-clock.xyz
// @author       A. Gharib
// @license      CC0
// @match        https://quranic-clock.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530768/Quranic%20Clock%2012hr%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/530768/Quranic%20Clock%2012hr%20Converter.meta.js
// ==/UserScript==

/* ﷽ */

(function(){
  let t=document.body.innerHTML;
  t=t.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g,(m,h,mn)=>{
    h=+h;
    let ap=h>=12?'PM':'AM';
    h=h%12||12;
    return `${h}:${mn} ${ap}`
  });
  document.body.innerHTML=t;
})();