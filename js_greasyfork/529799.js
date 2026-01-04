// ==UserScript==
// @name         Nyaa Torrent Table Row Highlight
// @version      2025-03-15
// @description  Highlight table rows on hover with a color
// @author       yisonPylkita
// @match        https://nyaa.si/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @license      MIT
// @grant        GM_addStyle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/529799/Nyaa%20Torrent%20Table%20Row%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/529799/Nyaa%20Torrent%20Table%20Row%20Highlight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
      tbody tr:hover {
        background-color: magenta !important;
      }

      tbody tr:hover td { color: white; }
    `);
})();