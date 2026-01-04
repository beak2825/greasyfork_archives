// ==UserScript==
// @name         Friendly Reminder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  HMMM
// @author       Snoozingnewt
// @match        https://artofproblemsolving.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436077/Friendly%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/436077/Friendly%20Reminder.meta.js
// ==/UserScript==
/*paste "// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js" into the opening part*/
var observer = new MutationObserver(resetTimer);var timer = setTimeout(action, 3000, observer);observer.observe(document, {childList: true, subtree: true});function resetTimer(changes, observer) {clearTimeout(timer); timer = setTimeout(action, 3000, observer);}function action(o) {o.disconnect();(function() {'use strict';alert("Just a friendly reminder that snoozingnewt is the best AoPS user");(function () {})();})();}