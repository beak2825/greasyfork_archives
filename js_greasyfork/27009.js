// ==UserScript==
// @name         Cubemania - Auto Select Inspection
// @namespace    https://greasyfork.org/users/649
// @version      1.1.1
// @description  auto checks the 15 second inspection checkbox on the cubemania timer
// @author       Adrien Pyke
// @match        *://www.cubemania.org/puzzles/*/timer
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/27009/Cubemania%20-%20Auto%20Select%20Inspection.user.js
// @updateURL https://update.greasyfork.org/scripts/27009/Cubemania%20-%20Auto%20Select%20Inspection.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Config = {
    getAutoSelect(key) {
      const value = GM_getValue(key);
      if (typeof value === 'undefined') return true;
      return value;
    },
    setAutoSelect(key, value) {
      GM_setValue(key, value);
    }
  };

  const puzzle = location.pathname.match(/^\/puzzles\/(.+)\//iu)[1];
  const autoselect = Config.getAutoSelect(puzzle);
  if (autoselect) {
    document.querySelector('input.inspection-toggle').click();
  }

  GM_registerMenuCommand(
    `${
      autoselect ? 'Disable' : 'Enable'
    } "Auto Select Inspection" for ${puzzle}`,
    () => {
      Config.setAutoSelect(puzzle, !autoselect);
      location.reload();
    }
  );
})();
