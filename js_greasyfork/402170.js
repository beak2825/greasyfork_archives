// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//

// ==UserScript==
// @namespace   https://gitlab.com/kekumu
// @name        Multi-click to select code
// @description Multi-click a code snippet to select everything in the code block.
// @version     1.0.0
// ==OpenUserJS==
// @author      kekumu; https://gitlab.com/kekumu
// ==/OpenUserJS==
// @copyright   2020, kekumu (https://gitlab.com/kekumu)
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.html
// @homepage    https://github.com/kekumu/userscripts/lib/click2select.js
// @supportURL  https://github.com/kekumu/userscripts/labels/click2select.js
// ==/UserLibrary==
// @include     *
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/402170/Multi-click%20to%20select%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/402170/Multi-click%20to%20select%20code.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  const DEFAULT_SETTINGS = {4: 'code', 5: 'pre'};

  let user_settings = await GM.getValue('settings');

  /*
   * Some extensions (e.g. Tampermonkey) hide the storage/values menu if
   * there's no data saved there. This will make it appear so that you can
   * edit the settings.
   */
  if (!user_settings) {
    GM.setValue('settings', {});
    user_settings = {};
  }

  const settings = Object.assign(DEFAULT_SETTINGS, user_settings);

  function clickHandler(num, selector) {
    return event => {
      if (event.detail === num) {
        let el = event.target.closest(selector);
        if (el) {
          window.getSelection().selectAllChildren(event.target.closest(selector));
          event.preventDefault();
        }
      }
    }
  }

  for (const prop in settings) {
    document.addEventListener('mousedown', clickHandler(Number(prop), settings[prop]));
  }

})();
