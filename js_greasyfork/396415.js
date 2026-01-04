// ==UserScript==
// @name          AlternativeTo.net - Always Windows
// @description   This is a simple script to ensure that you're always seeing results for Windows based software.
// @version       1.0.3
// @author        PersonalProxy
// @match         *://*.alternativeto.net/software/*
// @exclude       */reviews/*
// @exclude       */about/*
// @run-at        document-start
// @grant         none
// @license       MIT
// @copyright     2020, PersonalProxy (https://openuserjs.org/users/PersonalProxy)
// @namespace     https://greasyfork.org/users/444929
// @downloadURL https://update.greasyfork.org/scripts/396415/AlternativeTonet%20-%20Always%20Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/396415/AlternativeTonet%20-%20Always%20Windows.meta.js
// ==/UserScript==

/*--- Check if "?platform=windows" is at end of URL, excepting any "hashes" or searches. */

if (!/platform=windows/.test(window.location.search)) {

  var newURL = window.location.protocol + "//" +
    window.location.host +
    window.location.pathname + "?platform=windows" +
    window.location.search +
    window.location.hash;
  /*-- replace() puts the good page in the history instead of the bad page.*/

  window.location.replace(newURL);
}