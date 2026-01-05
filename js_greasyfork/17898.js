// ==UserScript==
// @name        IO_Helper
// @namespace   io_helper
// @description Imperia Online game helper.
// @include     http://www*.imperiaonline.org/imperia/game_v6/game/village.php*
// @include     http://www*.imperiaonline.org/imperia/game_v6/game/frontpage.php*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js
// @require     https://greasyfork.org/scripts/19192-waitforkeyelements-minified/code/WaitForKeyElements-minified.js
// @require     https://greasyfork.org/scripts/19190-greasemonkey-supervalues-minified/code/GreaseMonkey_SuperValues-minified.js
// @resource 	ioh-html https://raw.githubusercontent.com/panayot-zhi/IOH_Auxiliary/master/ioh-main.html
// @resource 	ioh-style https://raw.githubusercontent.com/panayot-zhi/IOH_Auxiliary/master/ioh-style.css
// @version     3.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/17898/IO_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/17898/IO_Helper.meta.js
// ==/UserScript==

// DONE: Notify in-game for incoming attacks
// DONE: Notify in-game on completed missions
// DONE: Notify in-game on completed alliance missions
// DONE: Options to split army on attack screen
// DONE: Calculate plunder from spy reports
// DONE: Sort windows by z-index
// DONE: Call your number on incoming attack
// DONE: Log and save attacks when discovered
// DONE: Use UI to change IOH options (TODO: Partially)
// TODO: Option to transport all resources (brute forcefully)
// DONE: Option when simulating to load parameters same as attackers (pessimistic simulation)
// DONE: Transform links in comments(list all sources) to actual hyperlinks
// TODO: Scheduled transport missions
// TODO: Saved and scheduled attacks