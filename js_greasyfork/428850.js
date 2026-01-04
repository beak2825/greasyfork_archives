// ==UserScript==
// @name         NS Ads Remove
// @namespace    https://github.com/KoalaBoy
// @version      0.1
// @description  ลบโฆษณา
// @author       KoalaBoy
// @include      https://www7.nungsub.com/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428850/NS%20Ads%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/428850/NS%20Ads%20Remove.meta.js
// ==/UserScript==

//Nungsub
//Remove Top Banner
var topBanner = document.getElementById('bsa-html');
var parentTopBanner = topBanner.parentNode;
parentTopBanner.removeChild(topBanner);

//Remove Side Banner
var sideBanner = document.getElementById('custom_html-47');
var parentSideBanner = sideBanner.parentNode;
parentSideBanner.removeChild(sideBanner);
