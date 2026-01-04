// ==UserScript==
// @name         STOP_IN_500
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  STOP_IN_500
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  var pages = document.title
  if (pages.includes("500")) {
    var r = confirm("נסרקו 500 עמודים, האם לעצור?")
    if (r == true) document.getElementsByClassName('fxp_logo_img_hv loading')[0].click();
  }
	document.getElementsByClassName('fxp_logo_img_hv loading')[0].click()

})();