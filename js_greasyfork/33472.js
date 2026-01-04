// ==UserScript==
// @name        Auto-No
// @version     0.2.1
// @description Automatically select all 'No' options for spam HITs.
// @match       https://www.travbuddy.com/spam_mturk_preview.php*
// @run-at      document-end
// @namespace https://greasyfork.org/users/8394
// @downloadURL https://update.greasyfork.org/scripts/33472/Auto-No.user.js
// @updateURL https://update.greasyfork.org/scripts/33472/Auto-No.meta.js
// ==/UserScript==

var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
  if (inputs[i].type !== 'radio') continue;

  if (inputs[i].value === 'false') {
    inputs[i].checked = true;
  }
}
