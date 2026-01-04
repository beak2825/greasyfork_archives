// ==UserScript==
// @name        Mangadex - Colorize Follow Status
// @namespace   Violentmonkey Scripts
// @match       https://mangadex.org/
// @match       https://mangadex.org/updates
// @grant       none
// @version     1.1
// @author      2TspSalt
// @description Highlight the titles on the home and updates pages with different colors to show which ones you're following, dropped, etc.
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/422902/Mangadex%20-%20Colorize%20Follow%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/422902/Mangadex%20-%20Colorize%20Follow%20Status.meta.js
// ==/UserScript==

(function () {
  // CHANGE THESE COLORS TO CUSTOMIZE!
  var colorStatus = [
    undefined,
    "LawnGreen",        // 1. Reading
    "MediumBlue",       // 2. Completed
    "Gold",             // 3. On Hold
    "MediumTurquoise",  // 4. Plan to Read
    "FireBrick",        // 5. Dropped
    "DarkMagenta",      // 6. Re-Reading
  ];

  function applyFollowStyle(data) {
    return function (a) {
      var idStr = a.href.match(/\/title\/([\d]+)\//)[1];
      if (!idStr) return;

      var idVal = parseInt(idStr, 10);
      var followType = (
        data.find(function (m) {
          return m.mangaId === idVal;
        }) || {}
      ).followType;
      if (!followType) return;

      var c = colorStatus[followType];
      a.style.color = c;
      a.parentElement.style.color = c;
    };
  }

  fetch("https://api.mangadex.org/v2/user/me/followed-manga", {
    credentials: "include",
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (body) {
      if (Array.isArray(body.data)) {
        Array.from(document.querySelectorAll(".manga_title"))
          .filter(function (a) {
            return a.href;
          })
          .forEach(applyFollowStyle(body.data));
      }
    });
})();
