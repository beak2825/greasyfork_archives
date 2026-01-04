// ==UserScript==
// @name        Google Search Side Panel Fix by Sapioit
// @namespace   Sapioit
// @copyright   Sapioit, 2020 - Present
// @author      sapioitgmail.com
// @license     GPL-2.0-only; http://www.gnu.org/licenses/gpl-2.0.txt
// @match       https://www.google.com/search*
// @match       https://google.com/search*
// @match       https://www.google.ro/search*
// @match       https://google.ro/search*
// @description Makes the sidebar be shown on the side of the search results, as opposed to below the search results.
// @version     1.0.0.1
// @icon        https://google.com/favicon.ico
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471229/Google%20Search%20Side%20Panel%20Fix%20by%20Sapioit.user.js
// @updateURL https://update.greasyfork.org/scripts/471229/Google%20Search%20Side%20Panel%20Fix%20by%20Sapioit.meta.js
// ==/UserScript==


GM_addStyle('.s6JM6d { display: inline-block; }');
GM_addStyle('#rhs { float: right; }');
