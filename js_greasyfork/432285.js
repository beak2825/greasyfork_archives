// ==UserScript==
// @name         Hide pinterest.com in Google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides pinterest.com images in Google searches
// @author       SoWhy
// @match        https://www.google.com/search?*
// @grant        none
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/432285/Hide%20pinterestcom%20in%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/432285/Hide%20pinterestcom%20in%20Google.meta.js
// ==/UserScript==

$( "div.isv-r:contains('pinterest.com')" ).css( "display", "none" );