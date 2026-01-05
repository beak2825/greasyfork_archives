// ==UserScript==
// @name        Greasy Fork Default Behavior
// @namespace   https://github.com/chriskim06/userscripts
// @description Add/edit scripts with syntax highlighting enabled by default and hide share stuff
// @match       /https://greasyfork.org/en/scripts/\w+(-|/).*/
// @match       https://greasyfork.org/en/script_versions/new
// @version     1.2.6
// @downloadURL https://update.greasyfork.org/scripts/15197/Greasy%20Fork%20Default%20Behavior.user.js
// @updateURL https://update.greasyfork.org/scripts/15197/Greasy%20Fork%20Default%20Behavior.meta.js
// ==/UserScript==

(function() {

  var textarea = document.getElementById('script_version_code');
  if (textarea !== null) {
    textarea.style.height = '560px';
  }

  var checkbox = document.getElementById('enable-source-editor-code');
  if (checkbox !== null && !checkbox.checked) {
    checkbox.checked = true;
  }

  var share = document.getElementById('share');
  if (share !== null) {
    share.style.display = 'none';
  }

})();

