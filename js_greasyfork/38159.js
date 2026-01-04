// ==UserScript==
// @name     IU EduSoftWeb Captcha Bypass
// @namespace IU_EduSoftWeb_Bypass
// @version  1
// @grant    none
// @include  https://www.hcmiu.edu.vn/edusoftweb/*
// @description Bypasses annoying Captcha
// Made 04/02/2017
// @downloadURL https://update.greasyfork.org/scripts/38159/IU%20EduSoftWeb%20Captcha%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/38159/IU%20EduSoftWeb%20Captcha%20Bypass.meta.js
// ==/UserScript==

/*=======================================================
  Script
======================================================*/

window.onload = function bypass() {
  document.getElementById("ctl00_ContentPlaceHolder1_ctl00_txtCaptcha").value = document.getElementById("ctl00_ContentPlaceHolder1_ctl00_lblCapcha").innerHTML;
  document.getElementById("ctl00_ContentPlaceHolder1_ctl00_btnXacNhan").click();
}