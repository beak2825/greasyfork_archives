// ==UserScript==
// @name         Notify Page Options
// @namespace    https://greasyfork.org
// @license      MIT
// @version      1.0
// @description  Adds some extra formating to the notify page.
// @author       Nyannerz
// @match       https://gazellegames.net/torrents.php?*action=notify*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/530573/Notify%20Page%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/530573/Notify%20Page%20Options.meta.js
// ==/UserScript==



const addNumbering = true; //Adds a column of numbers to the left of your notifications.
const rowsPerPage = 50; //Set to the amount of notifications you get per page.

const dict = {//Use keywords to enable their styling, use colors with hexcodes, aka #f00 or #ff0000, # must be included for colors. Put a comma after every entry but the last.
  "[2025]":"italic underline strikethrough #f00",
  "TENOKE":"underline #0a0",
  "puzzle":"underline #0a0",
  "[FitGirl Repack]":"underline #0a0"
}; //Here is an example: "[2025]":"italic underline strikethrough #f00"


const highlighten = (string, highlight, styling) => {
    var boldAddition = styling.toLowerCase().includes("bold") ? "font-weight: 900;" : "";
    var italicAddition = styling.toLowerCase().includes("italic") ? "font-style: italic;" : "";

    var textDecorationAddition = "";
    if(styling.toLowerCase().includes("underline") && styling.toLowerCase().includes("strikethrough")) textDecorationAddition = "text-decoration: underline line-through;";
    else if (styling.toLowerCase().includes("underline")) textDecorationAddition = "text-decoration: underline;";
    else if (styling.toLowerCase().includes("strikethrough")) textDecorationAddition = "text-decoration: line-through;";

    var colourAddition = styling.includes("#") ? ("color:" + styling.substring(styling.lastIndexOf('#'))):"";

    if (string.includes(highlight)) {
      const escapedSearchString = highlight.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      const regex = new RegExp(`(${escapedSearchString})(?!")`, 'g');
      return string.replace(regex, (match) => {
        return `<span style="${boldAddition}${italicAddition}${textDecorationAddition}${colourAddition}">${highlight}</span>`;
      });
      //string = string.replaceAll(highlight, `<span style="${boldAddition}${italicAddition}${textDecorationAddition}${colourAddition}">${highlight}</span>`);
    }
    return string;
};

(function() {
  'use strict';

  var rows = Array.from(document.getElementsByClassName("group_torrent"));
  var title;

  var rowNr = 0;
  var queryString,urlParams,pageNr;
  if(addNumbering)
  {
    var headerCell = document.createElement('td');
    headerCell.innerHTML = "#";
    var colHead = Array.from(document.getElementsByClassName("colhead"))[0];
    colHead.insertBefore(headerCell,colHead.firstChild);
    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    pageNr = Number(urlParams.get('page'));
  }
  if(pageNr > 1) rowNr += (pageNr - 1) * rowsPerPage;
  rows.forEach((element) =>
  {
    if(addNumbering)
    {
      rowNr++;
      var cellElement = document.createElement('td');
      cellElement.innerHTML = rowNr;
      cellElement.style.textAlign = "center";
      element.insertBefore(cellElement,element.firstChild);
    }
    title = element.children[2 + (addNumbering ? 1 : 0)];
    for(var key in dict) { title.innerHTML = highlighten(title.innerHTML,key,dict[key]); }
  });

})();

