// ==UserScript==
// @name         CrunchyBR, Crunchyroll banner remover
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Removes banners and notifications from crunchyroll
// @author       Leppur
// @match        https://www.crunchyroll.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/415903/CrunchyBR%2C%20Crunchyroll%20banner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/415903/CrunchyBR%2C%20Crunchyroll%20banner%20remover.meta.js
// ==/UserScript==
//
// github        https://github.com/Leppur/CrunchyBR


// Options

// What is removed
const removeBanner = true;
const removeTextBox = true; // It's about the blue text box that comes up every now and then
const removeSeriesPromoBanner = true;
const removeBetaTest = true;

if(removeBanner && document.getElementById("marketing_banner")) {
	document.getElementById("marketing_banner").remove();
} if(removeTextBox && document.getElementById("message_box")) {
	document.getElementById("message_box").remove();
} if(removeTextBox && document.getElementById("series_promo_banner")) {
	document.getElementById("series_promo_banner").remove();
} if(removeBetaTest && document.getElementsByClassName('opt-in')[0]) {
	document.getElementsByClassName('opt-in')[0].remove();
}
