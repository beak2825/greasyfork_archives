// ==UserScript==
// @name         GGn upload ROM button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world :)
// @author       BestGrapeLeaves
// @match        https://gazellegames.net/upload.php*
// @icon         https://cdn.iconscout.com/icon/premium/png-256-thumb/game-folder-3668558-3054201.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450633/GGn%20upload%20ROM%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/450633/GGn%20upload%20ROM%20button.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const rom = $('<input type="button" value="ROM"></input>');
  $("select#miscellaneous").change(function () {
    const selected = $("select#miscellaneous option:selected").text();
    if (selected === "ROM") {
        rom.hide();
    } else {
        rom.show();
    }
  });
  rom.click(() => {
      $("select#miscellaneous").val("ROM").change();
  });
  rom.insertAfter("select#miscellaneous");
})();
