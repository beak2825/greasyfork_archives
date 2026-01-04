// ==UserScript==
// @name     ضبط زري التالي والسابق
// @version  1
// @grant    unsafeWindow
// @match    *://quran.ksu.edu.sa/*
// @description ضبط زري التالي والسابق في موقع المصحف الإلكتروني
// @namespace https://greasyfork.org/users/3687
// @downloadURL https://update.greasyfork.org/scripts/378306/%D8%B6%D8%A8%D8%B7%20%D8%B2%D8%B1%D9%8A%20%D8%A7%D9%84%D8%AA%D8%A7%D9%84%D9%8A%20%D9%88%D8%A7%D9%84%D8%B3%D8%A7%D8%A8%D9%82.user.js
// @updateURL https://update.greasyfork.org/scripts/378306/%D8%B6%D8%A8%D8%B7%20%D8%B2%D8%B1%D9%8A%20%D8%A7%D9%84%D8%AA%D8%A7%D9%84%D9%8A%20%D9%88%D8%A7%D9%84%D8%B3%D8%A7%D8%A8%D9%82.meta.js
// ==/UserScript==
let timeoutId;

const gotoPage = unsafeWindow.gotoPage;

exportFunction(dest => {
  if(timeoutId)
    clearTimeout(timeoutId);
  
  if(typeof dest == "string")
    gotoPage(dest);
  else
  {
    timeoutId = setTimeout(() => {
      gotoPage(dest);
    }, 200);
  }
}, unsafeWindow, { defineAs: "gotoPage" });