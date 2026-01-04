// ==UserScript==
// @name         Adding a Button for copy the information
// @description Adds live example button, with styling.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Aaron Chen
// @match        http://dqa02/projects/*/issues*
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395827/Adding%20a%20Button%20for%20copy%20the%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/395827/Adding%20a%20Button%20for%20copy%20the%20information.meta.js
// ==/UserScript==

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position="fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}


(function() {
    'use strict';
    $('.subject').append('<br/><input class="monkey__checkbox" type="checkbox">Checked for Clipboard</input>');
    $('.monkey__checkbox').change(function() {
      if (this.checked) {
        const td = $(this).parent("td");
        const desc = td.find('a').text();
        const href = td.find('a').attr('href');
        const link = `http://${location.host}/${href}`;
        const issueID = href.split('/')[2];
        const formatedStr = `#${issueID} ${desc} ${link}`;
        console.log(formatedStr);
        fallbackCopyTextToClipboard(formatedStr);
      }
    });
})();