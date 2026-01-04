// ==UserScript==
// @name             MWI Watch Market - 奶牛的市场关注监视
// @namespace        http://tampermonkey.net/
// @version          test0.0.11
// @description      监视下心怡物品的当前价格，还有1day和3day的数据，数据采集于MWIAPI，1day,3day数据为自己生成，没找到获取强化装备市场数据的地方，所以无法监控强化装备市场，如果有误或者有问题可以在MWIItemWatchData的仓库下给我留言
// @author           lzy
// @license          MIT
// @match            https://www.milkywayidle.com/*
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535364/MWI%20Watch%20Market%20-%20%E5%A5%B6%E7%89%9B%E7%9A%84%E5%B8%82%E5%9C%BA%E5%85%B3%E6%B3%A8%E7%9B%91%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/535364/MWI%20Watch%20Market%20-%20%E5%A5%B6%E7%89%9B%E7%9A%84%E5%B8%82%E5%9C%BA%E5%85%B3%E6%B3%A8%E7%9B%91%E8%A7%86.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let market; //当前的市场数据
  let itemCNname; //物品的翻译数据
  let db; //indexedDB用于保存一些用户的历史数据
  const WatchStoreName = "watch";
  const LogStoreName = "log";
  const isOnline = true; //在线获取数据开关，频繁获取github容易被ban
  const ShowButtonId = "mkWatchButton", //显示按钮
    CleanButtonId = "mkWatchCleanButton", //清除按钮
    RefreshButtonId = "mkWatchRefreshButton", //刷新按钮
    HideButtonId = "mkWatchHideButton", //隐藏按钮
    BoxClass = "mkWatchBox", //主体盒子
    HeaderClass = "mkWatchBox_Header",
    HeaderLabelClass = "mkWatchBox_Header_Label", //标题
    HeaderActionClass = "mkWatchBox_Header_Action", //操作按钮
    ActionClass = "mkWatchBox_Action", //操作按钮
    BoxContainerClass = "mkWatchBox_ItemsWatchContainer", //主体容器
    ItemsClass = "mkWatchBox_Items", //物品容器
    ItemsAddInputId = "mkWatchBox_Items_Input_Add", //物品输入框
    ItemsAddSelectId = "mkWatchBox_Items_Select_Add", //物品选择框
    ItemsRemoveInputId = "mkWatchBox_Items_Input_Remove", //物品输入框
    ItemsRemoveSelectId = "mkWatchBox_Items_Select_Remove", //物品选择框
    ItemsAddClass = "mkWatchBox_Items_Add", //物品容器
    ItemsRemoveClass = "mkWatchBox_Items_Remove", //物品容器
    ItemNameClass = "mkWatchBox_Items_Name", //物品名称
    ItemAskClass = "mkWatchBox_Items_Ask", //物品出售价格
    ItemBidClass = "mkWatchBox_Items_Bid", //物品收购价格
    ItemGroupClass = "mkWatchBox_Items_Group"; //物品收购价格
  let saveedItems = []; //保存的物品列表
  let data24h, data3day; //24小时和3天的历史价格数据
  function init() {
    const p1 = getMarkets();
    const p2 = initIndexedDb();
    const p3 = getItemsList();
    const p4 = getItemLogMarkets();
    Promise.all([p1, p2, p3, p4]).then((res) => {
      console.info("数据获取完毕");
      initHtml();
    });
  }
  async function getMarkets() {
    //获取当前数据
    try {
      let res;
      if (isOnline) {
        res = await fetch(
          "https://raw.githubusercontent.com/holychikenz/MWIApi/main/milkyapi.json",
        ); //在线数据
      } else {
        res = await fetch("./milkyapi.json"); //本地测试数据
      }
      const data = await res.json();
      market = data.market;
    } catch (err) {
      market = null;
      console.error("获取市场数据失败");
    }
    return market;
  }
  async function getItemLogMarkets() {
    //获取处理过后的一个历史价格数据
    try {
      if (isOnline) {
        let res24h = await fetch(
          "https://happyplum.github.io/MWIItemWatchData/1days.json",
        );
        data24h = await res24h.json();
        let res3day = await fetch(
          "https://happyplum.github.io/MWIItemWatchData/3days.json",
        );
        data3day = await res3day.json();
      } else {
        let res24h = await fetch("./node-getMWIData/dist/1days.json");
        data24h = await res24h.json();
        let res3day = await fetch("./node-getMWIData/dist/3days.json");
        data3day = await res3day.json();
      }
    } catch (err) {}
  }
  function initIndexedDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("milk", 1);
      req.onerror = (err) => {
        console.error("不支持indexedDB?", err);
        reject(err);
      };
      req.onsuccess = (event) => {
        db = event.target.result;
        db.setData = setData;
        db.getData = getData;
        db.getAllData = getAllData;
        resolve(db);
      };
      req.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(WatchStoreName)) {
          db.createObjectStore(WatchStoreName, { autoIncrement: true });
        }
        if (!db.objectStoreNames.contains(LogStoreName)) {
          db.createObjectStore(LogStoreName, { autoIncrement: true });
        }
      };
    });
  }
  async function setData(key, value = {}, tableName = WatchStoreName) {
    if (!db) await initIndexedDb();
    return new Promise((resolve, reject) => {
      try {
        if (!db.objectStoreNames.contains(tableName)) {
          reject(new Error(`Object store "${tableName}" not found`));
          return;
        }
        const transaction = db.transaction(tableName, "readwrite");
        const request = transaction
          .objectStore(tableName)
          .put({ key, ...value }, key);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = (error) => {
          reject(error);
        };
        transaction.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async function getData(key, tableName = WatchStoreName) {
    if (!db) await initIndexedDb();
    return new Promise((resolve, reject) => {
      const getRequest = db
        .transaction(tableName, "readonly")
        .objectStore(tableName)
        .get(key);
      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      getRequest.onerror = (error) => {
        reject(error);
      };
    });
  }
  async function delData(key, tableName = WatchStoreName) {
    if (!db) await initIndexedDb();
    return new Promise((resolve, reject) => {
      const getRequest = db
        .transaction(tableName, "readwrite")
        .objectStore(tableName)
        .delete(key);
      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      getRequest.onerror = (error) => {
        reject(error);
      };
    });
  }
  async function cleanData(tableName = WatchStoreName) {
    if (!db) await initIndexedDb();
    return new Promise((resolve, reject) => {
      try {
        if (!db.objectStoreNames.contains(tableName)) {
          reject(new Error(`Object store "${tableName}" not found`));
          return;
        }
        const transaction = db.transaction(tableName, "readwrite");
        transaction.objectStore(tableName).clear();
        transaction.oncomplete = () => {
          resolve();
        };
        transaction.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async function getAllData(tableName = WatchStoreName) {
    if (!db) await initIndexedDb();
    return new Promise((resolve, reject) => {
      const getRequest = db
        .transaction(tableName, "readonly")
        .objectStore(tableName)
        .getAll();
      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };
      getRequest.onerror = (error) => {
        reject(error);
      };
    });
  }
  async function getItemsList() {
    let res;
    if (isOnline) {
      res = await fetch(
        "https://happyplum.github.io/MWIItemWatchData/items.json",
      );
    } else {
      res = await fetch("./node-getMWIData/dist/items.json");
    }
    const data = await res.json();
    itemCNname = data;
  }
  function getCNName(key) {
    const itemKey = key
      .toLocaleLowerCase()
      .replace(/'/g, "")
      .replace(/ /g, "_");
    return itemCNname[`/items/${itemKey}`];
  }
  function createHtml() {
    const html = `
    <div class="${BoxClass}">
      <div class="${HeaderClass}">
        <div class="${HeaderLabelClass}">
          市场物品监测
        </div>
        <div class="${HeaderActionClass}">
          <div id="${CleanButtonId}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635238249" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4288" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" p-id="4289"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" p-id="4290"></path></svg></div>
          <div id="${RefreshButtonId}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635228519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4141" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M934.4 206.933333c-17.066667-4.266667-34.133333 6.4-38.4 23.466667l-23.466667 87.466667C797.866667 183.466667 654.933333 96 497.066667 96 264.533333 96 74.666667 281.6 74.666667 512s189.866667 416 422.4 416c179.2 0 339.2-110.933333 398.933333-275.2 6.4-17.066667-2.133333-34.133333-19.2-40.533333-17.066667-6.4-34.133333 2.133333-40.533333 19.2-51.2 138.666667-187.733333 232.533333-339.2 232.533333C298.666667 864 138.666667 706.133333 138.666667 512S300.8 160 497.066667 160c145.066667 0 277.333333 87.466667 330.666666 217.6l-128-36.266667c-17.066667-4.266667-34.133333 6.4-38.4 23.466667-4.266667 17.066667 6.4 34.133333 23.466667 38.4l185.6 49.066667c2.133333 0 6.4 2.133333 8.533333 2.133333 6.4 0 10.666667-2.133333 17.066667-4.266667 6.4-4.266667 12.8-10.666667 14.933333-19.2l49.066667-185.6c0-17.066667-8.533333-34.133333-25.6-38.4z" p-id="4142"></path></svg></div>
          <div id="${HideButtonId}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635265487" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4440" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M955.733333 492.8c-6.4-12.8-162.133333-317.866667-443.733333-317.866667-23.466667 0-46.933333 2.133333-70.4 6.4-17.066667 4.266667-29.866667 19.2-25.6 36.266667 4.266667 17.066667 19.2 29.866667 36.266667 25.6 19.2-4.266667 38.4-4.266667 57.6-4.266667 209.066667 0 345.6 209.066667 379.733333 266.666667-10.666667 19.2-32 53.333333-64 91.733333-10.666667 12.8-8.533333 34.133333 4.266667 44.8 6.4 4.266667 12.8 6.4 21.333333 6.4s19.2-4.266667 25.6-10.666666c51.2-61.866667 78.933333-115.2 78.933333-117.333334 6.4-8.533333 6.4-19.2 0-27.733333zM215.466667 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l91.733333 91.733333C138.666667 354.133333 72.533333 484.266667 68.266667 490.666667c-4.266667 8.533333-4.266667 19.2 0 29.866666 6.4 12.8 162.133333 315.733333 443.733333 315.733334 83.2 0 164.266667-27.733333 241.066667-81.066667l96 96c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8L215.466667 125.866667z m243.2 334.933333l104.533333 104.533333c-12.8 12.8-32 21.333333-51.2 21.333334-40.533333 0-74.666667-34.133333-74.666667-74.666667 0-19.2 8.533333-38.4 21.333334-51.2zM512 772.266667c-209.066667 0-345.6-209.066667-379.733333-266.666667 21.333333-36.266667 81.066667-130.133333 174.933333-196.266667l104.533333 104.533334c-25.6 25.6-38.4 59.733333-38.4 96 0 76.8 61.866667 138.666667 138.666667 138.666666 36.266667 0 70.4-14.933333 96-38.4l98.133333 98.133334c-61.866667 42.666667-128 64-194.133333 64z" p-id="4441"></path></svg></div>
        </div>
      </div>
      <div class="${BoxContainerClass}">
      </div>
       <div class="${ActionClass}">
          <input id="${ItemsAddInputId}" placeholder="物品名称筛选" autocomplete="off" /><select id="${ItemsAddSelectId}">
          </select>
          <div class="${ItemsAddClass}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635130485" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3390" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" p-id="3391"></path><path d="M682.666667 480h-138.666667V341.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v138.666667H341.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h138.666667V682.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-138.666667H682.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" p-id="3392"></path></svg></div>
        </div>
        <div class="${ActionClass}">
          <input id="${ItemsRemoveInputId}" placeholder="物品名称筛选" autocomplete="off" /><select id="${ItemsRemoveSelectId}">
          </select>
          <div class="${ItemsRemoveClass}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635197834" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3987" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512 949.333333C270.933333 949.333333 74.666667 753.066667 74.666667 512S270.933333 74.666667 512 74.666667 949.333333 270.933333 949.333333 512 753.066667 949.333333 512 949.333333z m0-810.666666C307.2 138.666667 138.666667 307.2 138.666667 512S307.2 885.333333 512 885.333333 885.333333 716.8 885.333333 512 716.8 138.666667 512 138.666667z" p-id="3988"></path><path d="M682.666667 544H341.333333c-17.066667 0-32-14.933333-32-32s14.933333-32 32-32h341.333334c17.066667 0 32 14.933333 32 32s-14.933333 32-32 32z" p-id="3989"></path></svg></div>
        </div>
    </div>`;
    return html;
  }

  async function initHtml() {
    if (!document.body) {
      //如果body不存在，可能html还没绘制完毕，延迟1秒再执行
      return setTimeout(initHtml, 1000);
    }
    //插入主体
    const abody = createHtml();
    document.body.insertAdjacentHTML("beforeend", abody);
    //插入占位按钮,还没想好用什么图标，先放个按钮,用于显示框架
    const aicon = `<div id="${ShowButtonId}"><?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1746635280605" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4593" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M789.333333 74.666667H234.666667C194.133333 74.666667 160 108.8 160 149.333333v725.333334c0 40.533333 34.133333 74.666667 74.666667 74.666666h554.666666c40.533333 0 74.666667-34.133333 74.666667-74.666666V149.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666z m-138.666666 64v296.533333L576 364.8c-6.4-6.4-14.933333-8.533333-21.333333-8.533333-8.533333 0-17.066667 2.133333-21.333334 8.533333l-74.666666 72.533333v-298.666666h192z m149.333333 736c0 6.4-4.266667 10.666667-10.666667 10.666666H234.666667c-6.4 0-10.666667-4.266667-10.666667-10.666666V149.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h160v322.133333c0 14.933333 6.4 27.733333 14.933333 36.266667 21.333333 21.333333 53.333333 21.333333 74.666667 0l70.4-68.266667 70.4 68.266667c10.666667 10.666667 23.466667 14.933333 36.266666 14.933333 29.866667 0 53.333333-23.466667 53.333334-53.333333v-320H789.333333c6.4 0 10.666667 4.266667 10.666667 10.666666v725.333334z" p-id="4594"></path></svg></div>`;
    document.body.insertAdjacentHTML("beforeend", aicon);
    //添加下拉选框
    refreshItems();
    //绑定框体事件
    bindButtonListener();
  }
  function bindButtonListener() {
    //外框体事件
    const showbutton = document.getElementById(ShowButtonId);
    showbutton.addEventListener("click", showOrHideBox);
    const hidebutton = document.getElementById(HideButtonId);
    hidebutton.addEventListener("click", HideBox);
    const refreshbutton = document.getElementById(RefreshButtonId);
    refreshbutton.addEventListener("click", refresh);
    const cleanbutton = document.getElementById(CleanButtonId);
    cleanbutton.addEventListener("click", clean);
    const headerLabel = document.querySelector(`.${HeaderLabelClass}`);
    headerLabel.addEventListener("mousedown", moveBox);
    //添加删除事件
    const addSearch = document.querySelector(`#${ItemsAddInputId}`);
    addSearch.addEventListener("input", searchAddItem);
    const addbutton = document.querySelector(`.${ItemsAddClass}`);
    addbutton.addEventListener("click", addWatchItem);
    const removeSearch = document.querySelector(`#${ItemsRemoveInputId}`);
    removeSearch.addEventListener("input", searchRemoveItem);
    const removebutton = document.querySelector(`.${ItemsRemoveClass}`);
    removebutton.addEventListener("click", removeWatchItem);
  }
  function moveBox(e) {
    //拖动逻辑
    const box = document.querySelector(`.${BoxClass}`);
    let x = e.clientX;
    let y = e.clientY;
    document.onmousemove = function (e) {
      let nowX = e.clientX;
      let nowY = e.clientY;
      let disX = nowX - x;
      let disY = nowY - y;
      box.style.left = `${box.offsetLeft + disX}px`;
      box.style.top = `${box.offsetTop + disY}px`;
      x = nowX;
      y = nowY;
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  function showOrHideBox() {
    const box = document.querySelector(`.${BoxClass}`);
    if (box.style.display === "none") {
      ShowBox();
    } else {
      HideBox();
    }
  }
  function ShowBox() {
    const box = document.querySelector(`.${BoxClass}`);
    box.style.display = "block";
  }
  function HideBox() {
    const box = document.querySelector(`.${BoxClass}`);
    box.style.display = "none";
  }
  let reing = false;
  async function refresh() {
    if (reing) {
      //给RefreshButtonId增加reloading的class
      alert("最近刷新过了，10秒后可再刷新");
      return;
    }
    reing = true;
    const refreshbutton = document.getElementById(RefreshButtonId);
    refreshbutton.classList.add("reloading");
    //清空容器，来增加个过度的感觉，不然感觉反馈不太明显
    const container = document.querySelector(`.${BoxContainerClass}`);
    container.innerHTML = "";
    //刷新逻辑,需要重新获取价格数据,然后重新绘制items
    const p1 = getMarkets();
    const p2 = getItemLogMarkets();
    Promise.all([p1, p2]).then((res) => {
      refreshItems();
      console.info("刷新完毕");
      setTimeout(() => {
        reing = false;
        refreshbutton.classList.remove("reloading");
      }, 10 * 1000);
    });
  }
  function clean() {
    cleanData(WatchStoreName);
    cleanData(LogStoreName);
    refreshItems();
  }

  let addList = []; //添加的下拉列表
  let removeList = []; //删除的下拉列表
  async function genSelectOptions() {
    //根据market生成select选项，显示需要转换成中文，value为key
    //分为3类，添加，删除，未知3类分批，未知类型不需要添加到select中，但是需要打印用来标注
    if (!market) return;
    saveedItems = await getAllData();
    addList = [];
    removeList = [];
    Object.keys(market).forEach((key) => {
      let value = getCNName(key);
      if (!value) {
        console.log(`没有找到${key}的翻译`);
        return;
      }
      const option = { value: key, text: value };
      if (saveedItems.find((item) => item.key === key)) {
        removeList.push(option);
      } else {
        addList.push(option);
      }
    });
  }
  let filterAddList = [];
  function searchAddItem(e) {
    const str = e.target.value;
    filterAddList = addList.filter((item) => {
      return item.text.includes(str);
    });
    renderAddSelectOption();
  }
  let filterRemoveList = [];
  function searchRemoveItem(e) {
    const str = e.target.value;
    filterRemoveList = removeList.filter((item) => {
      return item.text.includes(str);
    });
    renderRemoveSelectOption();
  }
  function renderAddSelectOption() {
    //添加下拉相关
    const addSelect = document.querySelector(`#${ItemsAddSelectId}`);
    addSelect.innerHTML = "";
    const list = filterAddList.length > 0 ? filterAddList : addList;
    list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.text = item.text;
      addSelect.add(option);
    });
  }
  function renderRemoveSelectOption() {
    //删除下拉相关
    const removeSelect = document.querySelector(`#${ItemsRemoveSelectId}`);
    removeSelect.innerHTML = "";
    const list = filterRemoveList.length > 0 ? filterRemoveList : removeList;
    list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.text = item.text;
      removeSelect.add(option);
    });
  }
  async function addWatchItem() {
    //获取当前select的值
    const select = document.querySelector(`#${ItemsAddSelectId}`);
    const key = select.value;
    if (!key) return;
    await setData(key, { index: 0, ae: -1 });
    refreshItems(); //添加完毕后要刷新下
  }
  async function removeWatchItem() {
    const select = document.querySelector(`#${ItemsRemoveSelectId}`);
    const key = select.value;
    if (!key) return;
    await delData(key);
    refreshItems(); //添加完毕后要刷新下
  }
  async function refreshItems() {
    await genSelectOptions();
    renderAddSelectOption();
    renderRemoveSelectOption();
    renderItems();
  }
  async function renderItems() {
    //清空容器，可能和refresh阶段有点重复，放着反正也没事
    const container = document.querySelector(`.${BoxContainerClass}`);
    container.innerHTML = "";
    if (!saveedItems) saveedItems = await getAllData();
    if (saveedItems.length === 0) return;
    //首先获取监听物品
    const watchItems = saveedItems
      .filter((item) => item.index !== -1)
      .sort((a, b) => b.index - a.index);
    watchItems.forEach((item) => {
      const html = getItemHtml(item);
      container.insertAdjacentHTML("beforeend", html);
    });
  }
  function formatNum(num) {
    const number = Number(num);
    if (number > 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    if (number > 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toFixed(0) + "";
  }
  function getItemHtml(item) {
    const key = item.key;
    const name = getCNName(key);
    return createItem(key, name);
  }
  function getslope(slope) {
    if (slope > 0) {
      return `↑`;
    } else if (slope < 0) {
      return `↓`;
    }
    return `→`;
  }
  function createItem(key, name) {
    const m = market[key];
    const oneDay = data24h[key];
    const threeDay = data3day[key];
    const html = `
        <div class="${ItemsClass}">
          <div class="${ItemNameClass}">${name}</div>
          <div class="${ItemGroupClass}">
            <div class="${ItemAskClass}">ask:${formatNum(m.ask)}</div>
            <div class="${ItemBidClass}">bid:${formatNum(m.bid)}</div>
          </div>
          <div class="${ItemBidClass}">1day ${getslope(oneDay.slope)}</div>
          <div class="${ItemBidClass}">avgCom:${formatNum(
      oneDay.avgCombined,
    )}</div>
          <div class="${ItemGroupClass}">
            <div class="${ItemBidClass}">maxAsk:${formatNum(
      oneDay.maxAsk,
    )}</div>
            <div class="${ItemBidClass}">avgAsk:${formatNum(
      oneDay.avgAsk,
    )}</div>
            <div class="${ItemBidClass}">minAsk:${formatNum(
      oneDay.minAsk,
    )}</div>
          </div>
          <div class="${ItemGroupClass}">
            <div class="${ItemBidClass}">maxBid:${formatNum(
      oneDay.maxBid,
    )}</div>
            <div class="${ItemBidClass}">avgBid:${formatNum(
      oneDay.avgBid,
    )}</div>
            <div class="${ItemBidClass}">minBid:${formatNum(
      oneDay.minBid,
    )}</div>
          </div>
          <div class="${ItemBidClass}">3day ${getslope(threeDay.slope)}</div>
          <div class="${ItemBidClass}">avgCom:${formatNum(
      threeDay.avgCombined,
    )}</div>
          <div class="${ItemGroupClass}">
          <div class="${ItemBidClass}">maxAsk:${formatNum(
      threeDay.maxAsk,
    )}</div>
    <div class="${ItemBidClass}">avgAsk:${formatNum(threeDay.avgAsk)}</div>
          <div class="${ItemBidClass}">minAsk:${formatNum(
      threeDay.minAsk,
    )}</div>
    </div>
    <div class="${ItemGroupClass}">
          <div class="${ItemBidClass}">maxBid:${formatNum(
      threeDay.maxBid,
    )}</div>
    <div class="${ItemBidClass}">avgBid:${formatNum(threeDay.avgBid)}</div>
          <div class="${ItemBidClass}">minBid:${formatNum(
      threeDay.minBid,
    )}</div>
    </div>
        </div>`;
    return html;
  }
  function addClass() {
    let modelStyle = `
    #mkWatchButton {
      position: absolute;
      right: 300px;
      top: 40px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    #mkWatchButton svg{
      fill: #faa21e;
      width: 20px;
      height: 20px;
    }
    .mkWatchBox {
      position: absolute;
      z-index:1;
      right: 240px;
      top: 100px;
      width: 380px;
      min-height: 200px;
      padding: 10px;
      background: #033963;
      border: #74b9ff solid 1px;
      border-radius: 8px;
      color: #fff;
    }
    .mkWatchBox .mkWatchBox_Header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-end;
    }
    .mkWatchBox .mkWatchBox_Header .mkWatchBox_Header_Label {
      flex: 1;
      user-select: none;
      cursor: move;
    }
    .mkWatchBox .mkWatchBox_Header .mkWatchBox_Header_Action {
      display: flex;
    }
    .mkWatchBox_ItemsWatchContainer {
      display: flex;
      min-height: 88px;
      flex-wrap: wrap;
      overflow: auto;
      max-height: 440px;
    }
    .mkWatchBox_ItemsWatchContainer .mkWatchBox_Items {
      height: 430px;
      width: 100px;
      border: #fff solid 1px;
      border-radius: 3px;
      padding: 4px;
      margin: 4px;
      font-size: 12px;
    }
    #mkWatchBox_Items_Input_Add,
    #mkWatchBox_Items_Input_Remove {
      width: 100px;
    }
    #mkWatchBox_Items_Select_Add,
    #mkWatchBox_Items_Select_Remove {
      width: 200px;
      margin-left: 4px;
    }
    .mkWatchBox_Items {
      text-align: center;
    }
    .mkWatchBox_Items_Group {
      border: 1px solid #74b9ff;
      padding: 4px;
      margin: 4px 0px;
    }
    #mkWatchCleanButton,
    #mkWatchRefreshButton,
    #mkWatchHideButton {
      cursor: pointer;
      margin: 0px 4px;
    }
    #mkWatchCleanButton svg,
    #mkWatchRefreshButton svg,
    #mkWatchHideButton svg {
      fill: #fff;
      width: 20px;
      height: 20px;
    }
    .mkWatchBox_Items_Add,
    .mkWatchBox_Items_Remove {
      cursor: pointer;
    }
    .mkWatchBox_Items_Add svg,
    .mkWatchBox_Items_Remove svg {
      width: 20px;
      height: 20px;
      fill: #fff;
      margin: 0px 4px;
    }
    .mkWatchBox_Action {
      display: flex;
    }
    .reloading#mkWatchRefreshButton svg {
      fill: #aaa;
      cursor: not-allowed;
    }`;
    try {
      GM_addStyle(modelStyle);
    } catch (err) {}
  }
  addClass();
  init();
})();
