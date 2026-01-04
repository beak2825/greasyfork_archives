// ==UserScript==
// @name         Steam Community - Show Nicknames on Badge Page
// @icon         https://store.steampowered.com/favicon.ico
// @namespace    https://github.com/tkhquang
// @version      1.10
// @description  Show nicknames alongside with original names for friends with cards on Badge Page if exists
// @author       Quang Trinh
// @license      MIT; https://raw.githubusercontent.com/tkhquang/userscripts/master/LICENSE
// @match        *://steamcommunity.com/*/*/gamecards/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396069/Steam%20Community%20-%20Show%20Nicknames%20on%20Badge%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/396069/Steam%20Community%20-%20Show%20Nicknames%20on%20Badge%20Page.meta.js
// ==/UserScript==

(function () {
  "use strict";

  [...document.querySelectorAll(".badge_friendwithgamecard .persona")].forEach((friend) => {
    fetch(`https://steamcommunity.com/miniprofile/${friend.getAttribute("data-miniprofile")}`)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(`An error occured. Status Code: ${response.status}`);
          return;
        }

        response.text().then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const name = doc.querySelector(".persona")?.innerText;
          const nickname = doc.querySelector(".secondaryname")?.innerText;
          if (nickname) {
            friend.innerText = `${name} ${nickname}`;
            return;
          }

          friend.innerText = name;
        });
      })
      .catch((err) => {
        console.log("Fetch Error :-S", err);
      });
  });
})();
