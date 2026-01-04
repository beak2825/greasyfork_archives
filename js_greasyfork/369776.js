// ==UserScript==
// @name         Curator Links on Scratch
// @namespace    Hans5958
// @version      1
// @description  Creates a clickable link for the curator on the front page. (Deprecated: Use Scratch Addons instead.)
// @copyright    Hans5958
// @license      MIT
// @match        http*://scratch.mit.edu/
// @grant        none
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444667/Curator%20Links%20on%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/444667/Curator%20Links%20on%20Scratch.meta.js
// ==/UserScript==

var curator = document.getElementsByTagName("h4")[7].innerHTML.slice(20, 99);
document.getElementsByTagName("h4")[7].innerHTML = "Projects Curated by <a class=\"curator-links\" href=\"https://scratch.mit.edu/users/" + curator + "\">" + curator + "</a>";
document.getElementsByTagName("head")[0].innerHTML += "<style>a.curator-links {color: #6b6b6b; font-weight: bold;} a.curator-links:hover {text-decoration: underline;}</style>"
