// ==UserScript==
// @name        Mantis bug coloring for Bugzilla
// @author      Swyter
// @description Makes any Bugzilla-based bugtracker bearable to use
// @namespace   userscripts.org/user/swyter
// @include     *://bugzilla.*/buglist.cgi*
// @version     2019.02.09
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/377587/Mantis%20bug%20coloring%20for%20Bugzilla.user.js
// @updateURL https://update.greasyfork.org/scripts/377587/Mantis%20bug%20coloring%20for%20Bugzilla.meta.js
// ==/UserScript==

GM_addStyle
(`
  .bz_NEW              { background-color: #fcbdbd; } /* swy: i.e. new              */
  .bz_FEEDBACK         { background-color: #e3b7eb; } /* swy: i.e. feedback         */
  .bz_RELEASED_TO_TEST { background-color: #ffcd85; } /* swy: i.e. released to test */
  .bz_CONFIRMED        { background-color: #fff494; } /* swy: i.e. confirmed        */
  .bz_ASSIGNED         { background-color: #c2dfff; } /* swy: i.e. assigned         */
  .bz_RESOLVED         { background-color: #d2f5b0; } /* swy: i.e. resolved         */
  .bz_CLOSED           { background-color: #c9ccc4; } /* swy: i.e. closed           */
`);