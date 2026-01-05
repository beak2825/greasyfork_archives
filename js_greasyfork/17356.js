// ==UserScript==
// @name        MrSkin Ratings in IMDb
// @namespace   mrskin.com
// @description This script was deleted from Greasy Fork, and due to its negative effects, it has been automatically removed from your browser.
// @include     http://*.imdb.com/name/nm*
// @include     http://*.imdb.com/title/tt*
// @version     1.24.0.1
//
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect imdb.com
// @connect mrskin.com
//
// @history 1.24 Fixed Title pages.  Found new data on MrSkin pages to extract info from as backup and to provide additional info in tooltip where available. Quick workaround to have better looking stars on new design title pages (reuse imdb's own stars)
// @history 1.23 Fixed support for New IMDB Title Design.  Edited line break for rating on new design so only occurs on name and not title pages.  Stars look ugly on New design Title Page, will modify later.
// @history 1.22 Fixed some missing semicolons.  Added line break for rating on new design so it doesn't truncate.
// @history 1.21 Fixed regex for 'new design' IMDB, apparently they updated the code at some point.  Thanks derjanb.
// @history 1.20 Removed native Chrome support (as Chrome doesn't allow 3rd party scripts anymore anyway). Bringing back compatibility for Firefox.  To use with Chrome, this scripts must be used with TamperMonkey now.
// @history 1.19 Changes to try to comply to TM 4.0 update
// @history 1.18 As MrSkin no longer stipulates Best Matches, it's not 100% if the MrSkin results are the correct actress/title. Now prompts if search results doesn't 100% match, might show for slightly different spellings or grammar.
// @history 1.17 MrSkin redesign rewrite. Remove autoupdater (all clients should do this automaticlly with greasemonkey and tampermonkey now).
// @history 1.16 Fix for current iterations of IMDB and MrSkin.
// @history 1.15 MrSkin removed search landing page.  Also Fix of formatting of code with last version.
// @history 1.14 Fix clickable rating link for new mrskin exact-match search skips.
// @history 1.13 Title check to ensure MrSkin results match.
// @history 1.12 MrSkin integration with IMDB Title pages. (Option)
// @history 1.11 Fix for MrSkin site change: skip search results on popular match.
// @history 1.10 Fix for missing MrSkin star resources
// @history 1.09 Google Chrome support. Fix for nudity roles in tooltip.
// @history 1.08 New IMDB design support. Fix for checking underage actresses.
// @history 1.07 Bug fix (search results url restored). 
// @history 1.06 User requested option for opening links in new tab
// @history 1.05 Fixed bug with script not working with unique names that have no similarities to other actresses.
// @history 1.04 Removed unecessary regex line
// @history 1.03 Made actress comparison case insensitive e.g: Clea DuVall. Fixed search url for when actress isn't found.
// @history	1.02 Added option to add google image search link
// @history	1.01 Fix for update of site and fixed mistaken use of constant rating image
// @history	1.00 Initial release
// @downloadURL https://update.greasyfork.org/scripts/17356/MrSkin%20Ratings%20in%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/17356/MrSkin%20Ratings%20in%20IMDb.meta.js
// ==/UserScript==
