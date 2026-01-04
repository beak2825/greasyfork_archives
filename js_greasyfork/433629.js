// ==UserScript==
// @name         Goodbye GeocitiesJP, Hello GeoLog
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Geocities JP to GeoLog(geolog.mydns.jp) Auto Redirector
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433629/Goodbye%20GeocitiesJP%2C%20Hello%20GeoLog.user.js
// @updateURL https://update.greasyfork.org/scripts/433629/Goodbye%20GeocitiesJP%2C%20Hello%20GeoLog.meta.js
// ==/UserScript==

(() => {
  "use strict";
  document.querySelectorAll("a[href*='geocities.jp']").forEach((e) => {
    e.href = "https://geolog.mydns.jp/" + e.href.replace(/(^\w+:|^)\/\//, "");
  });
})();