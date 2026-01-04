// ==UserScript==
// @name          WoD 耗材单价
// @icon          http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace     lgg
// @description   市集和拍卖页面，针对耗材显示单价，省钱利器。
// @include       https://*.world-of-dungeons.org/wod/spiel/trade/trade.php*
// @grant         none
// @modifier      Christophero
// @version       2022.08.21.1
// @downloadURL https://update.greasyfork.org/scripts/520636/WoD%20%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/520636/WoD%20%E8%80%97%E6%9D%90%E5%8D%95%E4%BB%B7.meta.js
// ==/UserScript==
// console.log('start1');
//* constants
let goldStr =
  '<img alt="" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币" border="0">';
let PRICE_ATTRI_NAME = "lggAvPrice";
let PRICE_UNAVAILABLE = "lggBadPrice";
let CLASS_ROW = "row";

//* global lets
let tblBody = findTBodyElement();
let tblRowList = new Array();
let sortBtnElement;

//* main
for (let i = 0; i < tblBody.rows.length; i++) {
  row_i = tblBody.rows[i];
  let pricePU = genAveragePriceForConsumableGoods(row_i);
  row_i.setAttribute(PRICE_ATTRI_NAME, pricePU);
  tblRowList.push(row_i);
}

addSortBtn();
// sortRowByAveragePrice(tblRowList);

//* 找到商品列表table的<tbody>标签
function findTBodyElement() {
  let tableList = document.getElementsByClassName("content_table");
  let saleTable = tableList[0];
  let tableBodyList = saleTable.children;
  let tblBody;
  for (let i = tableBodyList.length - 1; i >= 0; i--) {
    if (tableBodyList[i].tagName == "TBODY") {
      tblBody = tableBodyList[i];
    }
  }
  return tblBody;
}

//* 给定某行物品<tr>，找到对应的耗材单价以及总价，插入平均价格，返回插入的平均价格
function genAveragePriceForConsumableGoods(trElement) {
  if (row_i.cells.length < 2) return;
  col_item = row_i.cells[1];
  col_price = row_i.cells[3];
  let itemCountStr = col_item.innerHTML.match(/\(\d+\/\d+\)/);
  itemCountStr = itemCountStr + "";
  if (itemCountStr != "null") {
    let itemCounts = itemCountStr.match(/\d+/);
    let itemPrice = col_price.textContent.replace(",", "").match(/\d+/);
    if (!itemPrice) {
      return PRICE_UNAVAILABLE;
    }
    let itemPricePerUse =
      parseFloat(itemPrice + "") / parseFloat(itemCounts + "");
    itemPricePerUse = itemPricePerUse.toFixed(4);
    // console.log('数量:' + itemCounts + ', 单价:' + itemPricePerUse + '/u');
    col_price.innerHTML =
      itemPricePerUse + goldStr + "/u &nbsp&nbsp&nbsp" + col_price.innerHTML;
    return itemPricePerUse;
  } else {
    return PRICE_UNAVAILABLE;
  }
}

//* 排序，两个row是<tr>，并且已经插入了PRICE_ATTRI_NAME属性
function rowCompare(row1, row2) {
  let p1 = row1.getAttribute(PRICE_ATTRI_NAME);
  let p2 = row2.getAttribute(PRICE_ATTRI_NAME);
  if (p1 == PRICE_UNAVAILABLE && p2 == PRICE_UNAVAILABLE) {
    return 0;
  } else if (p1 == PRICE_UNAVAILABLE) {
    return -1;
  } else if (p2 == PRICE_UNAVAILABLE) {
    return 1;
  }

  p1 = parseFloat(p1);
  p2 = parseFloat(p2);

  return p1 - p2;
}

function sortRowByAveragePrice() {
  //* 排序，重新输出
  tblRowList.sort(rowCompare);
  while (tblBody.hasChildNodes()) {
    tblBody.removeChild(tblBody.lastChild);
  }
  for (let i = 0; i < tblRowList.length; i++) {
    let suffixStr = i & 1;
    tblRowList[i].setAttribute("class", CLASS_ROW + suffixStr);
    tblBody.appendChild(tblRowList[i]);
  }
}

function addSortBtn() {
  let tableList = document.getElementsByClassName("content_table");
  let saleTable = tableList[0];
  let tableBodyList = saleTable.children;

  let tblHead;
  for (let i = tableBodyList.length - 1; i >= 0; i--) {
    if (tableBodyList[i].tagName == "THEAD") {
      tblHead = tableBodyList[i];
    }
  }
  if (!tblHead) return;
  let header;
  for (let i = 0; i < tblHead.children.length; i++) {
    let tmp = tblHead.children[i];
    if (tmp.className == "header") {
      //* 这里大小写敏感
      header = tmp;
    }
  }

  let thEl = header.children[3];
  let sortBtn = document.createElement("input");
  sortBtn.setAttribute("class", "button clickable");
  sortBtn.setAttribute("type", "button");
  sortBtn.setAttribute("value", "单价排序");
  sortBtn.addEventListener("click", function () {
    sortRowByAveragePrice();
    sortBtn.setAttribute("class", "button_disabled");
    sortBtn.setAttribute("disabled", "disabled");
  });
  thEl.appendChild(sortBtn);
}
// ㄟ( ▔, ▔ )ㄏ 版本有待完善
