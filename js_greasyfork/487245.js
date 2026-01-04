// ==UserScript==
// @name elchapuzasinformatico
// @namespace anonDeveloper
// @description This script removes the elchapuzasinformatico.com ad's
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       none
// @version 1.0
// @license MIT 
// @match 
// @run-at  document-body
// add to your adblock to skip the cookies message https://clickiocmp.com/*
// clickiocdn.com and wp-content/cache/min/1/t/consent_217011.js
// https://gist.github.com/tylerdukedev/d0b3fbacb37897da2af58c1d91a7f36c
// @downloadURL https://update.greasyfork.org/scripts/487245/elchapuzasinformatico.user.js
// @updateURL https://update.greasyfork.org/scripts/487245/elchapuzasinformatico.meta.js
// ==/UserScript==

$('div[class^="ads_single_top_desktop"]').remove();
$('div[class^="ads_single_firstp_desktop"]').remove();
$('div[class^="ads_single_firstp_movil"]').remove();