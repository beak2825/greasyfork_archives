// ==UserScript==
// @name         存量房房源工具
// @namespace    whatever
// @description
// @version      0.7
// @author       xsephiroth
// @match        http://zfcj.gz.gov.cn/zfcj/fyxx/clffy*
// @grant        none
// @license      MIT
// @description 自动计算房屋平方数单价
// @downloadURL https://update.greasyfork.org/scripts/446120/%E5%AD%98%E9%87%8F%E6%88%BF%E6%88%BF%E6%BA%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/446120/%E5%AD%98%E9%87%8F%E6%88%BF%E6%88%BF%E6%BA%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

const ADDRESS_MAP = [
  { keyword: "莲港大道126", name: "庄士(一期)" },
  { keyword: "北环路501", name: "庄士(二期)" },
  { keyword: "南环路131", name: "尚上名筑" },
  { keyword: "南环路132", name: "尚上名筑" },
  { keyword: "东环路123", name: "鑫隆世家" },
  { keyword: "黄山路45", name: "保利" },
  { keyword: "黄山路47", name: "保利" },
  { keyword: "亚运大道1328", name: "亚运天成" },
  { keyword: "铁中路3号", name: "亚运天誉" },
  { keyword: "兴亚二路31号", name: "运动员一区" },
  { keyword: "兴亚二路32号", name: "运动员四区" },
  { keyword: "兴亚二路38号", name: "运动员四区" },
  { keyword: "连海路39号", name: "山海连城" },
  { keyword: "乐羊羊路1号", name: "山海湾" },
  { keyword: "乐羊羊路55号", name: "亚运城天峯" },
  { keyword: "北环路363号", name: "七里海" },
];

(function () {
  "use strict";
  // 免输验证码
  window.validate = () => true;

  let lastLoadedId = "";

  /**
   * @type {HTMLTableElement}
   */
  const table = document.querySelector("#formTable");

  /**
   * @type {HTMLElement}
   */
  const loadingEl = document.querySelector(".fixed-table-loading");
  setInterval(() => {
    const isLoaded = checkIsLoaded(loadingEl);
    if (!isLoaded) return;

    // 移除掉首行标题数据
    const [, ...items] = [...table.querySelectorAll("tr")];

    const loadedId = getFirstItemId(items);
    if (loadedId === lastLoadedId) return;

    lastLoadedId = loadedId;
    calcPrices(items);
    mapItemsAddressToMapLink(items);
  }, 500);
})();

/**
 * @param {HTMLElement} v
 */
const checkIsLoaded = (v) => v.style.display === "none";

/**
 * @param {HTMLTableRowElement[]} items
 */
const getFirstItemId = (items) => {
  const [first] = items;
  const [, id] = first.querySelectorAll("td");
  return id.innerText;
};

/**
 * @param {HTMLTableRowElement[]} items
 */
const calcPrices = (items) =>
  items.map((item) => {
    const [, , , , priceEl, , areaEl] = item.querySelectorAll("td");
    const price = +priceEl.innerText;
    const area = +areaEl.innerText;

    const areaPriceEl = document.createElement("p");
    const areaPrice = price / area;
    areaPriceEl.innerText = areaPrice.toFixed(2) + "万/方";
    areaPriceEl.style.color = "#fff";
    areaPriceEl.style.padding = "2px";
    areaPriceEl.style.backgroundColor = areaPrice < 2 ? "#41b550" : "#628166";
    areaEl.appendChild(areaPriceEl);
  });

/**
 * 将表格中的‘发布坐落’的地址链接修改为地图链接及补充小区名
 *
 * @param {HTMLTableRowElement[]} items
 */
const mapItemsAddressToMapLink = (items) => {
  items.map((item) => {
    const [, , , addressEl] = item.querySelectorAll("td");
    const address = addressEl.innerText;
    const mapLink = "https://ditu.amap.com/search?query=" + address;
    addressEl.querySelector("a")?.setAttribute("href", mapLink);

    const extraAddress = ADDRESS_MAP.find(
      (addr) =>
        addressEl.innerText?.replaceAll(" ", "").indexOf(addr.keyword) !== -1
    );
    if (!extraAddress) return;
    const extraAddressEl = document.createElement("div");
    extraAddressEl.style.padding = "2px";
    extraAddressEl.style.borderRadius = "5px";
    extraAddressEl.style.backgroundColor = "#fa8231";
    extraAddressEl.style.fontSize = "12px";
    extraAddressEl.style.color = "white";
    extraAddressEl.innerText = extraAddress.name;
    addressEl.appendChild(extraAddressEl);
  });
};
