// ==UserScript==
// @name    DO-Auto-Move
// @version 4.2.2
// @description auto move players (it works 60% of the time every time)
// @author  holycrawler
// @match *.dugout-online.com/players/*
// @namespace https://greasyfork.org/users/798407
// @downloadURL https://update.greasyfork.org/scripts/430075/DO-Auto-Move.user.js
// @updateURL https://update.greasyfork.org/scripts/430075/DO-Auto-Move.meta.js
// ==/UserScript==

(() => {
  if (!document.querySelector(".top_positions")) return;
  const isSpreadSheet = !document.querySelector("#spread2").className.match("tab_off");
  const n = isSpreadSheet ? 1 : 0;
  let postData;
  const movePlayers = () => {
    const table = document.querySelectorAll("tr[class*='matches_row']");
    table.forEach((e) => {
      const url = e.querySelector("a").href;
      const age = +e.cells[4 + n].textContent;
      if (age < 19) {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: postData,
        })
          .catch((err) => console.log(err))
          .then(() => e.remove());
      }
    });
  };
  const newcell = document.querySelector(".compare_players_wrapper tr").insertCell();
  if (!isSpreadSheet) newcell.style.width = "440px";
  const newbutton = document.createElement("input");
  newbutton.type = "button";
  newbutton.style.float = "right";
  newcell.append(newbutton);
  newbutton.addEventListener("click", movePlayers);
  const isFirst = isSpreadSheet ? view_mode.youth.value === "1" : document.querySelector("#first1") != null;
  [postData, newbutton.value] = isFirst ? ["movetoyouth=1", "move to youth"] : ["moveto1st=1", "move to 1st"];
})();
