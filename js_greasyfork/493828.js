// ==UserScript==
// @name         剑网三游戏商城（网页版）倒计时功能
// @version      0.0.2
// @namespace    https://greasyfork.org/users/1295044
// @description  剑网三游戏商城（网页版）倒计时、账号信息展示
// @author       scorn3463
// @match        https://webmall.xoyo.com
// @icon         https://webmall.xoyo.com/favicon-200x200.png
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/493828/%E5%89%91%E7%BD%91%E4%B8%89%E6%B8%B8%E6%88%8F%E5%95%86%E5%9F%8E%EF%BC%88%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%89%E5%80%92%E8%AE%A1%E6%97%B6%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493828/%E5%89%91%E7%BD%91%E4%B8%89%E6%B8%B8%E6%88%8F%E5%95%86%E5%9F%8E%EF%BC%88%E7%BD%91%E9%A1%B5%E7%89%88%EF%BC%89%E5%80%92%E8%AE%A1%E6%97%B6%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

var oldxhr = window.XMLHttpRequest;

const parentDiv = document.createElement("div");
const infoUserDiv = document.createElement("div");
const infoLockDiv = document.createElement("div");
const infoGoodDiv = document.createElement("div");
const infoTimeDiv = document.createElement("div");
let timerInterval;
parentDiv.innerHTML = "";
parentDiv.style.position = "absolute";
document.body.insertBefore(parentDiv, document.body.firstChild);
parentDiv.appendChild(infoUserDiv);
parentDiv.appendChild(infoLockDiv);
parentDiv.appendChild(infoGoodDiv);
parentDiv.appendChild(infoTimeDiv);

function newobj() { }

function init() {
  getLockStatus(window.location.hash.substring(1));
}

function getData(data, url) {
  if (url.indexOf("/user/base-info") > 0) {
    userData(JSON.parse(data));
  } else if (url.indexOf("/good/get-good-detail-by-id") > 0) {
    goodData(JSON.parse(data));
  } else if (url.indexOf("/user/one-key-unlock-result") > 0) {
    unlock(JSON.parse(data));
  }
}

function userData(data) {
  const userData = data.data;
  const userCode = data.code;
  let userInfo;
  if (userCode === 0) {
    userInfo =
      "角色: " +
      userData.role_name +
      "<br/>" +
      "服务器: " +
      userData.zone_name +
      "-" +
      userData.server_name +
      "<br/>" +
      "剩余通宝: " +
      userData.tb;
  } else {
    userInfo = data.msg;
  }

  infoUserDiv.innerHTML = userInfo;
}

function goodData(data) {
  const goodData = data.data;
  let goodInfo =
    "商品: " +
    goodData.name +
    "<br/>" +
    "价格: " +
    goodData.price +
    "<br/>" +
    "折扣价格: " +
    goodData.discount_price +
    "<br/>" +
    "开始时间: " +
    formatDate(new Date(goodData.sold_start_time * 1000)) +
    "<br/>";

  if (goodData.sold_end_time && goodData.sold_end_time > 0) {
    goodInfo =
      goodInfo +
      "结束时间: " +
      formatDate(new Date(goodData.sold_end_time * 1000)) +
      "<br/>";
  }

  infoGoodDiv.innerHTML = goodInfo;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    startTiming(goodData.sold_start_time * 1000);
  }, 100);
}

function startTiming(startTime) {
  if (Date.now() > startTime) {
    infoTimeDiv.innerHTML = "倒计时: 已开始";
    clearInterval(timerInterval);
  } else {
    infoTimeDiv.innerHTML = "倒计时: " + formatTime(startTime - Date.now());
  }
}

function unlock(data) {
  if (data && data.data) {
    if (data.data.operated && data.data.unlocked) {
      sessionStorage.setItem("lockStatus", true);
      lockStatusChange(lockStatus);
    }
  }
}

function handleRoutingEvent(e) {
  let newURL = e.newURL.split("#")[1];
  getLockStatus(newURL);
}

function getLockStatus(url) {
  if (url && url === "/") {
    setTimeout(() => {
      let lockStatus = document.querySelectorAll("[class^='index-lockStatusIcon']").length === 0;
      sessionStorage.setItem("lockStatus", lockStatus);
      lockStatusChange(lockStatus);
    }, 1000);
  } else {
    lockStatusChange(sessionStorage.getItem("lockStatus") === "true");
  }
}

function lockStatusChange(status) {
  let lockInfo = "玲珑密保锁: " + (status ? "已解锁" : "<span style='color: red'>未解锁</span>");
  infoLockDiv.innerHTML = lockInfo;
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  var hours = ("0" + date.getHours()).slice(-2);
  var minutes = ("0" + date.getMinutes()).slice(-2);
  var seconds = ("0" + date.getSeconds()).slice(-2);

  var formattedDate =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  return formattedDate;
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return formattedTime;
}

window.XMLHttpRequest = function () {
  let tagetobk = new newobj();
  tagetobk.oldxhr = new oldxhr();
  let handle = {
    get: function (target, prop, receiver) {
      if (prop === "oldxhr") {
        return Reflect.get(target, prop);
      }
      if (typeof Reflect.get(target.oldxhr, prop) === "function") {
        if (Reflect.get(target.oldxhr, prop + "proxy") === undefined) {
          target.oldxhr[prop + "proxy"] = (...funcargs) => {
            return target.oldxhr[prop].call(target.oldxhr, ...funcargs);
          };
        }
        return Reflect.get(target.oldxhr, prop + "proxy");
      }
      if (prop.indexOf("response") !== -1) {
        getData(Reflect.get(target.oldxhr, prop), target.oldxhr.responseURL);
        return Reflect.get(target.oldxhr, prop);
      }
      return Reflect.get(target.oldxhr, prop);
    },
    set(target, prop, value) {
      return Reflect.set(target.oldxhr, prop, value);
    },
    has(target, key) {
      return Reflect.has(target.oldxhr, key);
    },
  };

  let ret = new Proxy(tagetobk, handle);

  return ret;
};

window.addEventListener("hashchange", handleRoutingEvent);
init();
