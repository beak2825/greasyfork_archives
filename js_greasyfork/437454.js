// ==UserScript==
// @name         Metacritic focus search bar on load
// @namespace    https://www.metacritic.com/
// @version      1.0
// @description  Sets input focus on the search bar when you load a page on Metacritic
// @author       xdpirate
// @license      GPL v2.0
// @match        https://www.metacritic.com/
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=metacritic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437454/Metacritic%20focus%20search%20bar%20on%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/437454/Metacritic%20focus%20search%20bar%20on%20load.meta.js
// ==/UserScript==

document.getElementById("primary_search_box").focus();