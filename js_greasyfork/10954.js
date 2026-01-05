// ==UserScript==
// @name         [.05 K Ehinger]Image naming 
// @namespace    robert
// @namespace    https://greasyfork.org/en/users/13168-robert
// @include      https://search.partners.org/mturk/naming/mturk.html*
// @version      1
// @grant        none
// @run-at       document-end
// @description  Auto-opens survey link in new window
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/10954/%5B05%20K%20Ehinger%5DImage%20naming.user.js
// @updateURL https://update.greasyfork.org/scripts/10954/%5B05%20K%20Ehinger%5DImage%20naming.meta.js
// ==/UserScript==

/*
To do:
- after open new window, focus textbox
- copy/paste validation code
- give user option to autosubmit
*/

if ( $("p:contains('kehinger@partners.org')").length ) 
{
  document.getElementById('checkconsent').click();
  var surveyUrl = 'https://search.partners.org/mturk/naming/index.php?assignmentid=' + gup('assignmentId') + 
      '&workerid=' + gup('workerId');
  window.open(surveyUrl, "MsgWindow", '_blank', 'toolbar=0,location=0,menubar=0');
}

/*
Auto-opens survey link in new window
*/