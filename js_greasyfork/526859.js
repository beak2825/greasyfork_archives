// ==UserScript==
// @name        Market Min-Max
// @namespace   finally.idle-pixel.minmaxmarket
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.2
// @author      finally
// @description Show min-max prices in market browser
// @downloadURL https://update.greasyfork.org/scripts/526859/Market%20Min-Max.user.js
// @updateURL https://update.greasyfork.org/scripts/526859/Market%20Min-Max.meta.js
// ==/UserScript==

let browseItem = "all";
let browse_get_table_result = null;
let old_show_element = show_element;
show_element = async (id) => {
  old_show_element(id);

  if (id != "market-table") return;

  let item_name = IdlePixelPlus?.plugins?.market?.lastBrowsedItem || browseItem;

  if (item_name == "all") return;

  await browse_get_table_result;

  let min = format_number(Market.tradables.find(v => v.item == item_name)?.lower_limit) || "???";
  let max = format_number(Market.tradables.find(v => v.item == item_name)?.upper_limit) || "???";

  let marketTableTr = document.querySelector("#market-table tr");
  let minMaxTr = document.createElement("tr");
  minMaxTr.innerHTML = `<th colspan="7">MIN: ${min} MAX: ${max}</th>`;
  marketTableTr.parentNode.insertBefore(minMaxTr, marketTableTr.nextSibling);
};

let old_browse_get_table = Market.browse_get_table;
Market.browse_get_table = async (item_name) => {
  browseItem = item_name;
  browse_get_table_result = old_browse_get_table(item_name);
  return browse_get_table_result;
};