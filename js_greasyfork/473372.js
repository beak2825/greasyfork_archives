// ==UserScript==
// @name         Strava - Hide from Feed (Mute)
// @namespace    https://github.com/dtruebin/userscripts/
// @supportURL   https://github.com/dtruebin/userscripts/issues
// @version      0.1
// @description  Adds mute option to activity edit page.
// @author       Dmitry Trubin
// @match        https://www.strava.com/activities/*/edit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strava.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473372/Strava%20-%20Hide%20from%20Feed%20%28Mute%29.user.js
// @updateURL https://update.greasyfork.org/scripts/473372/Strava%20-%20Hide%20from%20Feed%20%28Mute%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // As of 2023-08-18, muting only works one way: https://github.com/dtruebin/userscripts/issues/1
  const div = `
  <div class="form-group">
    <label>Hide from Home or Club Feeds</label>
    <ul class="hide-stats-container">
      <li>
        <input type="checkbox" value="1" name="activity[hide_from_home]" id="hide_from_home">
        <label for="hide_from_home">Mute activity</label>
      </li>
    </ul>
  </div>`
  document.querySelector('fieldset.activity-tags').insertAdjacentHTML('afterend', div)
})();