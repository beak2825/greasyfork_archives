// ==UserScript==
// @name         Show transcript by default
// @version      1.0.1
// @description  Automatically show transcript by default
// @namespace    https://youtube.com/
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       bowencool
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/480993
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @require      https://cdn.jsdelivr.net/gh/bowencool/Tampermonkey-Scripts@f59cc91442dd34eb28e0d270486da5c7ac8d2d50/shared/waitForElementToExist.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480993/Show%20transcript%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/480993/Show%20transcript%20by%20default.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const transcript = await waitForElementToExist(
    '[target-id="engagement-panel-searchable-transcript"]'
  );
  transcript.setAttribute("visibility", "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED");
  console.log("transcript should show up now...");
})();
