// ==UserScript==
// @name        New script - promehanika.lv
// @namespace   Violentmonkey Scripts
// @match       https://nps.promehanika.lv/stockorder/
// @grant       none
// @version     1.2
// @author      -
// @description 28.03.2021, 17:51:33
// @downloadURL https://update.greasyfork.org/scripts/424096/New%20script%20-%20promehanikalv.user.js
// @updateURL https://update.greasyfork.org/scripts/424096/New%20script%20-%20promehanikalv.meta.js
// ==/UserScript==
if(!window.location.href.includes("cat") || window.location.href.includes("cat=0")){
  function createButton(name, number) {
    let poga = document.createElement("button");
    poga.setAttribute("type", "button");
    poga.innerHTML = name;
    poga.setAttribute("id", "redirect" + name);
    poga.style.marginLeft = "5px";
    poga.addEventListener("click", () => window.location.href = `https://nps.promehanika.lv/stockorder/?cat=0&ORDER_TYPE%5B%5D=I&ORDER_TYPE%5B%5D=C&STATUS%5B%5D=1&STATUS%5B%5D=2&HOLD0=on&STR=&DELIVERY_TYPE_ID=0&DATE_FROM=01.01.2019&DATE_TIL=&CENTRAL_STOCK_NR=${number}&search=Mekl%C4%93t`);
    return poga;
  };
  // Adds extra buttons for shortcut settings.
  let pogaKP7 = createButton("KP7", "16");
  let pogaOTN = createButton("OTN", "35");
  let pogaKP7_OTN = createButton("KP7 + OTN", "35,16")
  let nolSaraksts = document.querySelector("#CENTRAL_STOCK_NR");
  nolSaraksts.parentNode.insertBefore(pogaOTN, nolSaraksts.nextSibling);
  nolSaraksts.parentNode.insertBefore(pogaKP7, nolSaraksts.nextSibling);
  nolSaraksts.parentNode.insertBefore(pogaKP7_OTN, nolSaraksts.nextSibling);
  let table = document.getElementsByClassName("details filterable");

  // Saving necessary table header indexes
  if (table.length > 0) {
    // Adds GET value to print link, so it doesn't autoprint page.
    Array.from(document.querySelectorAll('[title="Drukāt atlases lapu"]')).forEach((element) => element.href = `${element.href}&DISABLEPRINT=1`);
    let notes, warehouse, artCount, prntDoc;
    focus_field = "FILTER_FIELD";
    let rows = table[0].rows;
    for (let i = 0; i < rows[0].cells.length; i++) {
      if (rows[0].children[i].innerHTML == "Atl.Nol.") {
        warehouse = i;
      }
      if (rows[0].children[i].innerHTML == "Piezīmes") {
        notes = i;
      }
      if (rows[0].children[i].innerHTML == "Pr.Sk.") {
        artCount = i;
      }
      if (rows[0].children[i].innerHTML == "Dr.") {
        prntDoc = i;
        break;
      }
    }

    for (let i = 1, notesCell, artCountCell, warehouseCell, prntDocCell; i < rows.length - 2; i++) {
      warehouseCell = rows[i].cells[warehouse];
      notesCell = rows[i].cells[notes];
      artCountCell = rows[i].cells[artCount];
      prntDocCell = rows[i].cells[prntDoc];
      //if(warehouseCell.firstElementChild.innerHTML != "KP7") continue;
      if (notesCell.innerHTML.search(/(raž|raz|plastmasa)/i) != -1 && notesCell.innerHTML.search(/(ražotnes)/i) == -1) {
        rows[i].style.color = "red";
      }
      else if (artCountCell.innerHTML.includes(".")) {
        artCountCell.style.color = "red";
        artCountCell.setAttribute("title", `${artCountCell.getAttribute("title")} (Pārbaudi vai tā nav ražošana!)`);
      }
      // Adds local document, even if it's not started or it's already ended.
      if (prntDocCell.innerHTML == "") {
        prntDocCell.innerHTML = `<a href="https://nps.promehanika.lv/stockorder/printOrder.php?STOCK_ORDER_ID=${rows[i].cells[0].children[0].dataset.id}&DISABLEPRINT=1" target="_blank" title="Drukāt atlases lapu"><img src="./images/printer.png" alt="Dr."></a>`;
      }
    }
  }
}