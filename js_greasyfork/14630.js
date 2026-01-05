// ==UserScript==
// @name        Userstyles by TheArkive - Cleaner Images
// @author	TheArkive
// @namespace   None
// @description Modify CSS for certain sites
// @include     *
// @version     0.02
// @grant       GM_addStyle
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/14630/Userstyles%20by%20TheArkive%20-%20Cleaner%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/14630/Userstyles%20by%20TheArkive%20-%20Cleaner%20Images.meta.js
// ==/UserScript==

var URL = document.URL;
// alert('test: ' + URL)

if (URL.search(/ttps?:\/\/man7\.org/i) > 0) {
	document.querySelector("img[src='http://www.google.com/logos/Logo_40wht.gif']").src = "http://i.imgur.com/HjT74DQ.png";
} else if (URL.search(/ttps?:\/\/.*\.w3schools\.com/i) > 0) {
	document.querySelector("img[src='/images/colorpicker.gif']").src = "http://i.imgur.com/HCOlhbc.png";
	document.querySelector("img[src='/images/w3schoolscom_gray.gif']").src = "http://i.imgur.com/DssOxD5.png";
	document.querySelector("img[src='/images/w3cert.gif']").src = "http://i.imgur.com/4q7IekL.png";
}