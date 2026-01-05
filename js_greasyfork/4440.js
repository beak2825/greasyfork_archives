// ==UserScript==
// @name       Skip Google Malware Warning
// @namespace  http://wol.ph/
// @version    1.0
// @description  Don't like the annoying Google Malware Warning screen? This script automatically skips it after loading.
// @match      https://www.google.*/interstitial?url=*
// @homepage   https://github.com/WoLpH/skip-google-malware-warning
// @copyright  2014, Wolph
// @downloadURL https://update.greasyfork.org/scripts/4440/Skip%20Google%20Malware%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/4440/Skip%20Google%20Malware%20Warning.meta.js
// ==/UserScript==

window.location.replace(unescape(window.location.href.replace(/.*url=/, '')));
