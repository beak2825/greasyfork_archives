// ==UserScript==
// @name        AWBW Maps - Search Replays in Truniht's Archive Button
// @namespace   https://greasyfork.org/en/users/1062240-vincent-hendrikx
// @match       https://awbw.amarriner.com/prevmaps.php*
// @grant       none
// @license     MIT
// @version     1.0
// @author      Vincent ～ VIH
// @icon        http://awbw.mooo.com/favicon.ico
// @description Adds a "Search Replays" button on map pages
// @downloadURL https://update.greasyfork.org/scripts/537157/AWBW%20Maps%20-%20Search%20Replays%20in%20Truniht%27s%20Archive%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537157/AWBW%20Maps%20-%20Search%20Replays%20in%20Truniht%27s%20Archive%20Button.meta.js
// ==/UserScript==

function main() {
  tools.insert_mooo_button();
}

const tools = {
  insert_mooo_button: () => {
    const map_nme_elem = document.querySelector("#game-header-table > div.bold.underline.game-header-header");
    const btn_row = document.querySelector("#replay-misc-controls > table > tbody > tr > td > table > tbody > tr");

    if (!map_nme_elem || !btn_row) return;

    const map_nme = map_nme_elem.textContent.trim();
    const encoded_query = encodeURIComponent(map_nme);
    const mooo_url = "http://awbw.mooo.com/searchReplays.php?q=" + encoded_query;

    const new_td = document.createElement("td");
    new_td.className = "norm";

    const mooo_btn = document.createElement("a");
    mooo_btn.href = mooo_url;
    mooo_btn.target = "_blank";
    mooo_btn.style.display = "inline-flex";
    mooo_btn.style.alignItems = "center";
    mooo_btn.style.gap = "4px";
    mooo_btn.style.fontSize = "13px";
    mooo_btn.style.textDecoration = "none";
    mooo_btn.style.color = "black";
    mooo_btn.style.fontFamily = "Arial, sans-serif";
    mooo_btn.onmouseover = () => {
      mooo_btn.style.textDecoration = "none";
      mooo_btn.style.color = "black";
    };
    mooo_btn.onmouseout = () => {
      mooo_btn.style.textDecoration = "none";
      mooo_btn.style.color = "black";
    };

    const icon = document.createElement("img");
    icon.src = "https://awbw.amarriner.com/terrain/aw2/gerecon.gif";
    icon.alt = "mooo icon";
    icon.width = 14;
    icon.height = 16;

    const label = document.createTextNode("Search Replays");

    mooo_btn.appendChild(icon);
    mooo_btn.appendChild(label);
    new_td.appendChild(mooo_btn);

    const cells = Array.from(btn_row.children);
    const plannerIndex = cells.findIndex(td => td.textContent?.trim() === "Planner");

    if (plannerIndex !== -1) {
      btn_row.insertBefore(new_td, cells[plannerIndex]);
    } else {
      btn_row.appendChild(new_td);
    }
  }
}

main();
