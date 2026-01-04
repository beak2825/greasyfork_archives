// ==UserScript==
// @name burbuja.info
// @namespace anonDeveloper
// @description This script remove the burbuja.info ad "no hombre no"
// @version 1.1
// @license MIT
// @include https://www.burbuja.info/inmobiliaria/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// https://gist.github.com/raw/2625891/waitForKeyElements.js
//			https://api.jquery.com/remove/
// Block in your adblock https://vm.s3wfg.com/js/vortexloader.js
// Block in your adblock https://static.sunmedia.tv/integrations/fe69655d-ae1f-4218-bea4-8489a0ec1f5c/fe69655d-ae1f-4218-bea4-8489a0ec1f5c.js
// Block in your adblock https://www.burbuja.info/cdn-cgi/apps/head/FrtRYzO0dO2cMyhPjw0dyINve6g.js
// Block in your adblock https://the.gatekeeperconsent.com/v2/cmp.js?v=158
// @grant    GM_addStyle
// @grant    GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/487161/burbujainfo.user.js
// @updateURL https://update.greasyfork.org/scripts/487161/burbujainfo.meta.js
// ==/UserScript==
 
$("div[style*='block']").css('display', '');
