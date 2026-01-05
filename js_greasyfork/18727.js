// ==UserScript==
// @name            google-groups-translation-message-hider
// @description     Hides the disturbing yellow boxes saying 'Translate message to English' in Google Groups.
// @author          Caglar Toklu
// @copyright       2016, Caglar Toklu
// @date            2016-04-12
// @grant           GM_addStyle
// @homepageURL     https://github.com/caglartoklu/google-groups-translation-message-hider.user.js
// @include         http://groups.google.com/*
// @include         https://groups.google.com/*
// @license         BSD 2-Clause
// @namespace       https://github.com/caglartoklu/greasemonkey
// @run-at          document-end
// @version         1.0.0
// @downloadURL https://update.greasyfork.org/scripts/18727/google-groups-translation-message-hider.user.js
// @updateURL https://update.greasyfork.org/scripts/18727/google-groups-translation-message-hider.meta.js
// ==/UserScript==

// This script is forked from:
// http://userscripts-mirror.org/scripts/show/149411
// The code of that script was perfectly correct, but it was not granted for:
// GM_addStyle http://wiki.greasespot.net/GM_addStyle
// It was possibly written before Greasemonkey 2.0 since
// from Greasemonkey 2.0, `@grant none` is assumed by default,
// if no other values are specified.
// http://wiki.greasespot.net/@grant
// google-groups-translation-message-hider adds the necessary metadata.

(function () {

  GM_addStyle('.gux-confirm-panel-c { display:none !important; }');

}());
