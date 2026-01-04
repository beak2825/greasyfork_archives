// ==UserScript==
// @name     Blocker for Rankirani
// @description جلوگیری از بازدید سایت های مشخص شده در blocklist
// @license MIT
// @version  1
// @include  *://rankirani.ir/*
// @grant    GM_setValue
// @namespace https://greasyfork.org/users/310316
// @downloadURL https://update.greasyfork.org/scripts/386361/Blocker%20for%20Rankirani.user.js
// @updateURL https://update.greasyfork.org/scripts/386361/Blocker%20for%20Rankirani.meta.js
// ==/UserScript==

blocklist = ["tadbirmail.ir", "qodsna.com", "eheyat.com", "www.mersadnews.ir", "sbnews.ir", "fater24.com", "eheyat.com", "salehintehran.ir", "www.mazandrooz.ir", "qodsna.com", "sorooshekhabar.ir", "ofoghetaze.com", "sorooshnews.com", "uromnews.ir", "www.sorooshekhabar.ir", "q27.ir", "goftarname.ir", "shabestan.ir", "tadbiretazenews.com", "usfacts.ir"];

var x = document.getElementsByClassName("h5 Currently-Viewing");
for (var i = 0; i < blocklist.length; i++) {
  if (x[0].textContent.indexOf(blocklist[i]) != -1) { //if (document.body.textContent.indexOf(blocklist[i])!=-1){
    unsafeWindow.open = function () {
      return null;
    };
    console.log("********blocked***********");
    //document.getElementsByClassName("btn btn-danger btn-sm font-xtx")[0].click(); //press cancel button.
  }

}
