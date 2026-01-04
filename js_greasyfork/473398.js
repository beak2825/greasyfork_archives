// ==UserScript==
// @name         TORN: Simplified Territories
// @namespace    dekleinekobini.torn.simplified-territories
// @version      1.0
// @description  Simplify the Torn territories.
// @author       DeKleineKobini [2114440]
// @license      MIT
// @match        https://www.torn.com/city.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473398/TORN%3A%20Simplified%20Territories.user.js
// @updateURL https://update.greasyfork.org/scripts/473398/TORN%3A%20Simplified%20Territories.meta.js
// ==/UserScript==

"use strict";

GM_addStyle(`
  .leaflet-tile-pane {
    display: none;
  }

  .war {
    stroke: hsla(0, 100%, 50%, 0.4) !important;
  }
`);