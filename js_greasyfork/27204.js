// ==UserScript==
// @name Spiegel Plus Unscramble
// @namespace *
// @include http://www.spiegel.de/*/*
// @description decrypt Spiegel Plus content
// @version 0.0.1
// @downloadURL https://update.greasyfork.org/scripts/27204/Spiegel%20Plus%20Unscramble.user.js
// @updateURL https://update.greasyfork.org/scripts/27204/Spiegel%20Plus%20Unscramble.meta.js
// ==/UserScript==
// Source:
// http://www.dkriesel.com/blog/2016/0703_verschluesselung_von_spiegelonline-bezahlartikeln_extrem_einfach_knackbar
// See Comment #27

SPLaterpay.callback.hasAccess(); $('.lp_mwi_payment-method-wrapper').parent().parent().hide(); $('.deobfuscated-content').parent().removeClass();
