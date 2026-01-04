// ==UserScript==
// @name         Block add-block warning | indiatvnews.com
// @version      1.0.2
// @description        blocks the message that blosks adblock and cleans the page.
// @author       Dalveer
// @match        https://*.indiatvnews.com/*
// @compatible   chrome
// ******************************************************
// Please leave review/ feedback / rating for this script
// ******************************************************
// @namespace https://greasyfork.org/users/797771
// @downloadURL https://update.greasyfork.org/scripts/430030/Block%20add-block%20warning%20%7C%20indiatvnewscom.user.js
// @updateURL https://update.greasyfork.org/scripts/430030/Block%20add-block%20warning%20%7C%20indiatvnewscom.meta.js
// ==/UserScript==
document.body.innerHTML+="<style>body{overflow:auto!important} .social,#ipl-score-card-slide,#adblock-warning,.rhs,.follow-google,#comment,.gutterbottom{display:none!important} .maincontent,.lhs {width: auto !important;} .atmidvid,.artbigimg{max-width:300px!important}</style>"