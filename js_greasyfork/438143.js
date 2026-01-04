// ==UserScript==
// @name                 No patreon banners, less polution
// @name:pt-BR           Menos banners de Patreon, menos poluição
// @description          A script to make gbatemp like the old times, only Member banners.
// @description:pt-BR    Um script para fazer o gbatemp ficar como nos velhos tempos, apenas banners Member.
// @license  WTFPL
// @version  1.0
// @author   HunterZ
// @match    https://gbatemp.net/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @grant    GM.getValue
// @namespace https://greasyfork.org/users/861920
// @downloadURL https://update.greasyfork.org/scripts/438143/No%20patreon%20banners%2C%20less%20polution.user.js
// @updateURL https://update.greasyfork.org/scripts/438143/No%20patreon%20banners%2C%20less%20polution.meta.js
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.
/* global $, waitForKeyElements */
$("a").remove(".userBanner");
$("a[class*='patron-']").removeClass (function (index, css) {
   return (css.match (/(^|\s)patron\S+/g) || []).join(' ');
});