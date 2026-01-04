"use strict";
// ==UserScript==
// @name         bilibili导出主播收益记录
// @namespace    https://github.com/qianjiachun
// @version      2024.08.22.01
// @description  B站导出主播收益记录
// @author       小淳
// @match			*://link.bilibili.com/p/center/index*
// @match			*://api.live.bilibili.com/income/export*
// @require         https://lib.baomitu.com/xlsx/0.16.4/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470580/bilibili%E5%AF%BC%E5%87%BA%E4%B8%BB%E6%92%AD%E6%94%B6%E7%9B%8A%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470580/bilibili%E5%AF%BC%E5%87%BA%E4%B8%BB%E6%92%AD%E6%94%B6%E7%9B%8A%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

const DELAY = 0; // 访问间隔 1秒
const WAITTIME = 30000; // 遇到访问频繁，等待30秒
const PAGESIZE = 100; // 每页数据量，60是最稳定的不会缺数据，如果觉得慢可以调大，比如1000（请确保用户ID显示正常的情况下再调大，如果用户ID显示空白说明不能调大）

let userInfo = {};
let exportParams = {};

function initStyles() {
  let style = document.createElement("style");
  style.appendChild(document.createTextNode(`
    .entry-button {
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      text-align: center;
      width: 52px;
      height: 32px;
      color: white;
      line-height: 26px;
      cursor: pointer;
      margin-left: 10px;
  }
  .export-button {
    font-size: 20px;
    border-radius: 10px;
    text-align: center;
    width: 200px;
    height: 60px;
    background: #ff4444;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
    .collect-button {
      font-size: 20px;
      border-radius: 10px;
      text-align: center;
      width: 200px;
      height: 60px;
      background: #a753b5;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #export-wrap {
        width: 100%;
        height: calc(100% - 56px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .export-params {
      margin-bottom: 20px;
      font-size: 24px;
    }
    .noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}
`));
  document.head.appendChild(style);
}

async function init() {
  document.getElementsByClassName("error-container")[0].remove();
  let header = document.getElementById("biliMainHeader") || document.getElementById("internationalHeader");

  let newElement = document.createElement("div");
  newElement.id = "export-wrap"

  header.insertAdjacentElement("afterend", newElement);

  userInfo = await queryData(`https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info`);
  let searchParams = new URLSearchParams(new URL(window.location.href).search);
  let dataParam = searchParams.get("data");
  if (!dataParam) return;
  exportParams = JSON.parse(dataParam);

  initExportButton();
}

async function initEntry() {
  initEntryButton();
}

function initExportButton() {
  initExportButton_Dom();
  initExportButton_Func();
}

function initEntryButton() {
  initEntryButton_Dom();
  initEntryButton_Func();
}

function initExportButton_Dom() {
  let b = document.getElementById("export-wrap");

  let text = document.createElement("div");
  text.className = "export-params"
  text.innerHTML = `分类：${exportParams.coinType.label} | 类型：${exportParams.giftId.label} | 时间：${exportParams.beginTime}`;
  if (exportParams.uname !== "") text.innerHTML += " | 昵称：" + exportParams.uname;
  b.appendChild(text);

  let a = document.createElement("div");
  a.className = "export-button";
  a.id = "ex-export";
  a.innerText = "导出";
  b.appendChild(a);

  a = document.createElement("div");
  a.className = "collect-button";
  a.id = "ex-collect";
  a.innerText = "统计";
  b.appendChild(a);
}

function initExportButton_Func() {
  document.getElementById("ex-export").addEventListener("click", () => {
    showMessage("正在导出表格...", "info");
    startExport();
  })
  document.getElementById("ex-collect").addEventListener("click", () => {
    showMessage("正在统计...", "info");
    startCollect();
  })
}

function initEntryButton_Dom() {
  let width = parseInt(document.getElementsByClassName("item nickName")[0].querySelector("input").style.width);
  document.getElementsByClassName("item nickName")[0].querySelector("input").style.width = `${width / 2}px`;
  let a = document.createElement("button");
  a.className = "bl-button live-btn default bl-button--danger bl-button--size entry-button pink";
  a.id = "ex-entry";
  a.innerText = "导出";
  let b = document.getElementsByClassName("item nickName");
  b[0].appendChild(a);
}

function initEntryButton_Func() {
  document.getElementById("ex-entry").addEventListener("click", () => {
    let coinType = getCoinType();
    let uname = getUName();
    let beginTime = getBeginTime();
    let giftId = getGiftId();
    let json = {
      coinType,
      uname,
      beginTime,
      giftId
    };
    let url = `https://api.live.bilibili.com/income/export?data=${JSON.stringify(json)}`;
    // 打开新窗口
    window.open(url);
  })
}

async function startExport() {
  let jsonData = [];

  let lastId = "";
  let bianhao = 1;
  let currentPage = 1;
  let ret;

  const { coinType, uname, beginTime, giftId } = exportParams;

  let buttonDom = document.getElementsByClassName("export-button")[0];

  do {
    ret = await queryData(`https://api.live.bilibili.com/xlive/revenue/v1/giftStream/getReceivedGiftStreamNextList?limit=20&coin_type=${getCoinTypeValue(coinType.Ym)}&gift_id=${getGiftIdValue(giftId.Ym)}&begin_time=${beginTime}&uname=${uname}${lastId !== "" ? `&last_id=${lastId}` : ""}`)
    if (ret.code === 0) {
      let len = ret.data.list.length;
      if (len == 0) {
        break;
      }
      lastId = ret.data.list[len - 1].id;
      buttonDom.innerText = `导出${ currentPage }`;
      currentPage++;

      for (let i = 0; i < ret.data.list.length; i++) {
        let item = ret.data.list[i];
        let tmpObj = {
          id: bianhao,
          time: item.time,
          receive_title: item.receive_title,
          user_name: userInfo.data.uname,
          user_uid: userInfo.data.uid,
          room_id: item.room_id,
          uid: item.uid,
          uname: item.uname,
          gift_name: item.gift_name,
          gift_num: item.gift_num,
          gold: Number(item.gold) / 1000,
          normal_gold: Number(item.normal_gold) / 1000,
          ios_gold: Number(item.ios_gold) / 1000,
          hamster: item.hamster,
          normal_hamster: item.normal_hamster,
          ios_hamster: item.ios_hamster,
          price: Number(item.hamster) / 1000,
          price_normal: Number(item.normal_hamster) / 1000,
          price_ios: Number(item.ios_hamster) / 1000,
          liushui: Number(item.hamster) / 1000 * 2,
          liushui_normal: Number(item.normal_hamster) / 1000 * 2,
          liushui_ios: Number(item.ios_hamster) / 1000 * 2
        }
        jsonData.push(tmpObj);
        bianhao++;
      }
    } else {
      console.log(ret.message);
      break;
    }
    await sleep(DELAY);
  } while (ret.data.has_more !== 0);

  if (jsonData.length > 0) {
    let header = ["编号", "日期", "收礼身份", "收礼人昵称", "收礼人uid", "房间号", "送礼人uid", "送礼人昵称", "礼物名称", "礼物数量", "总消费金额", "总消费金额（NORMAL）", "总消费金额（IOS）", "金仓鼠数", "金仓鼠数（NORMAL）", "金仓鼠数（IOS）", "总收益", "总收益（NORMAL）", "总收益（IOS）", "总流水", "总流水（NORMAL）", "总流水（IOS）"];
    let body = [];
    for (let i = 0; i < jsonData.length; i++) {
      let temp = [];
      for (let item in jsonData[i]) {
        temp.push(jsonData[i][item]);
      }
      body.push(temp);
    }
    exportJsonToExcel(header, body, `导出【${beginTime}】【${exportParams.coinType.label}】【${exportParams.giftId.label}】`);
    showMessage("导出完毕", "success");
  } else {
    alert("无数据");
  }
  buttonDom.innerText = `导出`;
}

async function startCollect() {
  let jsonHeader = []; // 表头
  let jsonBody = {}; // 主体

  let lastId = "";
  let currentPage = 1;
  let ret;
  
  const { coinType, uname, beginTime, giftId } = exportParams;

  let buttonDom = document.getElementsByClassName("collect-button")[0];

  do {
    ret = await queryData(`https://api.live.bilibili.com/xlive/revenue/v1/giftStream/getReceivedGiftStreamNextList?limit=20&coin_type=${getCoinTypeValue(coinType.Ym)}&gift_id=${getGiftIdValue(giftId.Ym)}&begin_time=${beginTime}&uname=${uname}${lastId !== "" ? `&last_id=${lastId}` : ""}`)
    if (ret.code === 0) {
      let len = ret.data.list.length;
      if (len == 0) {
        break;
      }
      lastId = ret.data.list[len - 1].id;
      buttonDom.innerText = `统计${ currentPage }`;
      currentPage++;

      for (let i = 0; i < ret.data.list.length; i++) {
        let item = ret.data.list[i];
        // 构造表头
        if (jsonHeader.indexOf(item.gift_name) == -1) {
          jsonHeader.push(item.gift_name);
        }

        // 构造表格
        if (item.uid in jsonBody == false) {
          jsonBody[item.uid] = {uname: item.uname}; // 初始化
          jsonBody[item.uid]["totalGold"] = 0;
          jsonBody[item.uid]["totalGoldNormal"] = 0;
          jsonBody[item.uid]["totalGoldIos"] = 0;
          jsonBody[item.uid]["totalPrice"] = 0;
          jsonBody[item.uid]["totalPriceNormal"] = 0;
          jsonBody[item.uid]["totalPriceIos"] = 0;
          jsonBody[item.uid]["totalLiushui"] = 0;
          jsonBody[item.uid]["totalLiushuiNormal"] = 0;
          jsonBody[item.uid]["totalLiushuiIos"] = 0;
        }
        if (item.gift_name in jsonBody[item.uid] == false) {
          jsonBody[item.uid][item.gift_name] = 0;
        }
        jsonBody[item.uid][item.gift_name] += Number(item.gift_num);
        if (Number(item.gold) >= 0) {
          jsonBody[item.uid]["totalGold"] += Number(item.gold) / 1000;
          jsonBody[item.uid]["totalGoldNormal"] += Number(item.normal_gold) / 1000;
          jsonBody[item.uid]["totalGoldIos"] += Number(item.ios_gold) / 1000;
          jsonBody[item.uid]["totalPrice"] += Number(item.hamster) / 1000;
          jsonBody[item.uid]["totalPriceNormal"] += Number(item.normal_hamster) / 1000;
          jsonBody[item.uid]["totalPriceIos"] += Number(item.ios_hamster) / 1000;
          jsonBody[item.uid]["totalLiushui"] += Number(item.hamster) / 1000 * 2;
          jsonBody[item.uid]["totalLiushuiNormal"] += Number(item.normal_hamster) / 1000 * 2;
          jsonBody[item.uid]["totalLiushuiIos"] += Number(item.ios_hamster) / 1000 * 2;
        }
      }
    } else {
      console.log(ret.message);
      break;
    }
    await sleep(DELAY);
  } while (ret.data.has_more !== 0);


  let header = createCollectHeader(jsonHeader);
  let body = createCollectBody(jsonHeader, jsonBody);
  exportJsonToExcel(header, body, `统计【${beginTime}】【${exportParams.coinType.label}】【${exportParams.giftId.label}】`);
  showMessage("统计完毕", "success");
  buttonDom.innerText = `统计`;
}

function getCoinType() {
  let data = document.getElementsByClassName("selector")[0].__vue__.$data.selectedItem;
  return data;
}

function getCoinTypeValue(coinType) {
  let data = coinType.Ym;
  return "gold" === data ? 1 : "silver" === data ? 2 : 0;
}

function getGiftId() {
  let data = document.getElementsByClassName("selector")[1].__vue__.$data.selectedItem;
  return data;
}

function getGiftIdValue(giftId) {
  let data = giftId.Ym;
  return data || "";
}

function getBeginTime() {
  let data = document.getElementsByClassName("el-input__inner")[0].value;
  return data || "";
}

function getUName() {
  let data = document.getElementsByClassName("link-input")[0].value;
  return data || "";
}

function getTimeRange() {
  let input = document.getElementById("rc-tabs-1-panel-gift").getElementsByClassName("shark-Input");
  let beginTime = input[0].getAttribute("value");
  let endTime = input[1].getAttribute("value");

  beginTime = parseInt(new Date(beginTime + " 00:00:00").getTime() / 1000);
  endTime = parseInt(new Date(endTime + " 23:59:59").getTime() / 1000);
  return [beginTime, endTime];
}



function queryData(url) {
  return new Promise(resolve => {
    fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    }).then(res => {
      return res.json();
    }).then(ret => {
      resolve(ret);
    })
  })
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)))
}

function exportJsonToExcel(header, body, fileName = "下载") {
  let aoa = [];
  aoa.push(header, ...body);
  let sheet = XLSX.utils.aoa_to_sheet(aoa);
  openDownloadDialog(sheet2blob(sheet), fileName + '.xlsx');
}

function openDownloadDialog(url, saveName) {
  if (typeof url == 'object' && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement('a');
  aLink.href = url;
  aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent('click');
  else {
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = XLSX.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

function createCollectHeader(jsonHeader) {
  let ret = [];
  ret.push("uid", "昵称", ...jsonHeader, "总消费金额", "总消费金额（NORMAL）", "总消费金额（IOS）", "金仓鼠数", "金仓鼠数（NORMAL）", "金仓鼠数（IOS）", "总流水", "总流水（NORMAL）", "总流水（IOS）");
  return ret;
}

function createCollectBody(jsonHeader, jsonBody) {
  let ret = [];
  for (const uid in jsonBody) {
    const userItem = jsonBody[uid];
    let temp = [];
    temp.push(uid);
    temp.push(userItem["uname"]);

    for (let i = 0; i < jsonHeader.length; i++) {
      if (jsonHeader[i] in userItem) {
        temp.push(userItem[jsonHeader[i]]);
      } else {
        temp.push("");
      }
    }
    temp.push(userItem["totalGold"]);
    temp.push(userItem["totalGoldNormal"]);
    temp.push(userItem["totalGoldIos"]);
    temp.push(userItem["totalPrice"]);
    temp.push(userItem["totalPriceNormal"]);
    temp.push(userItem["totalPriceIos"]);
    temp.push(userItem["totalLiushui"]);
    temp.push(userItem["totalLiushuiNormal"]);
    temp.push(userItem["totalLiushuiIos"]);
    ret.push(temp);
  }
  return ret;
}

function showMessage(msg, type) {
  // type: success[green] error[red] warning[orange] info[blue]
  new NoticeJs({
    text: msg,
    type: type,
    position: 'bottomRight',
  }).show();
}

function dateFormat(fmt, date) {
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


/*
    Notice.js
*/
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define("NoticeJs", [], factory);
  else if (typeof exports === 'object') exports["NoticeJs"] = factory();
  else root["NoticeJs"] = factory()
})(typeof self !== 'undefined' ? self : this, function () {
  return (function (modules) {
    var installedModules = {};

    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports
      }
      var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      };
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      module.l = true;
      return module.exports
    }
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.d = function (exports, name, getter) {
      if (!__webpack_require__.o(exports, name)) {
        Object.defineProperty(exports, name, {
          configurable: false,
          enumerable: true,
          get: getter
        })
      }
    };
    __webpack_require__.n = function (module) {
      var getter = module && module.__esModule ? function getDefault() {
        return module['default']
      } : function getModuleExports() {
        return module
      };
      __webpack_require__.d(getter, 'a', getter);
      return getter
    };
    __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property)
    };
    __webpack_require__.p = "dist/";
    return __webpack_require__(__webpack_require__.s = 2)
  })([(function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var noticeJsModalClassName = exports.noticeJsModalClassName = 'noticejs-modal';
    var closeAnimation = exports.closeAnimation = 'noticejs-fadeOut';
    var Defaults = exports.Defaults = {
      title: '',
      text: '',
      type: 'success',
      position: 'topRight',
      timeout: 30,
      progressBar: true,
      closeWith: ['button'],
      animation: null,
      modal: false,
      scroll: {
        maxHeight: 300,
        showOnHover: true
      },
      rtl: false,
      callbacks: {
        beforeShow: [],
        onShow: [],
        afterShow: [],
        onClose: [],
        afterClose: [],
        onClick: [],
        onHover: [],
        onTemplate: []
      }
    }
  }), (function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.appendNoticeJs = exports.addListener = exports.CloseItem = exports.AddModal = undefined;
    exports.getCallback = getCallback;
    var _api = __webpack_require__(0);
    var API = _interopRequireWildcard(_api);

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]
          }
        }
        newObj.default = obj;
        return newObj
      }
    }
    var options = API.Defaults;

    function getCallback(ref, eventName) {
      if (ref.callbacks.hasOwnProperty(eventName)) {
        ref.callbacks[eventName].forEach(function (cb) {
          if (typeof cb === 'function') {
            cb.apply(ref)
          }
        })
      }
    }
    var AddModal = exports.AddModal = function AddModal() {
      if (document.getElementsByClassName(API.noticeJsModalClassName).length <= 0) {
        var element = document.createElement('div');
        element.classList.add(API.noticeJsModalClassName);
        element.classList.add('noticejs-modal-open');
        document.body.appendChild(element);
        setTimeout(function () {
          element.className = API.noticeJsModalClassName
        }, 200)
      }
    };
    var CloseItem = exports.CloseItem = function CloseItem(item) {
      getCallback(options, 'onClose');
      if (options.animation !== null && options.animation.close !== null) {
        item.className += ' ' + options.animation.close
      }
      setTimeout(function () {
        item.remove()
      }, 200);
      if (options.modal === true && document.querySelectorAll("[noticejs-modal='true']").length >= 1) {
        document.querySelector('.noticejs-modal').className += ' noticejs-modal-close';
        setTimeout(function () {
          document.querySelector('.noticejs-modal').remove()
        }, 500)
      }
      var position = '.' + item.closest('.noticejs').className.replace('noticejs', '').trim();
      setTimeout(function () {
        if (document.querySelectorAll(position + ' .item').length <= 0) {
          let p = document.querySelector(position);
          if (p != null) {
            p.remove()
          }
        }
      }, 500)
    };
    var addListener = exports.addListener = function addListener(item) {
      if (options.closeWith.includes('button')) {
        item.querySelector('.close').addEventListener('click', function () {
          CloseItem(item)
        })
      }
      if (options.closeWith.includes('click')) {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (e) {
          if (e.target.className !== 'close') {
            getCallback(options, 'onClick');
            CloseItem(item)
          }
        })
      } else {
        item.addEventListener('click', function (e) {
          if (e.target.className !== 'close') {
            getCallback(options, 'onClick')
          }
        })
      }
      item.addEventListener('mouseover', function () {
        getCallback(options, 'onHover')
      })
    };
    var appendNoticeJs = exports.appendNoticeJs = function appendNoticeJs(noticeJsHeader, noticeJsBody, noticeJsProgressBar) {
      var target_class = '.noticejs-' + options.position;
      var noticeJsItem = document.createElement('div');
      noticeJsItem.classList.add('item');
      noticeJsItem.classList.add(options.type);
      if (options.rtl === true) {
        noticeJsItem.classList.add('noticejs-rtl')
      }
      if (noticeJsHeader && noticeJsHeader !== '') {
        noticeJsItem.appendChild(noticeJsHeader)
      }
      noticeJsItem.appendChild(noticeJsBody);
      if (noticeJsProgressBar && noticeJsProgressBar !== '') {
        noticeJsItem.appendChild(noticeJsProgressBar)
      }
      if (['top', 'bottom'].includes(options.position)) {
        document.querySelector(target_class).innerHTML = ''
      }
      if (options.animation !== null && options.animation.open !== null) {
        noticeJsItem.className += ' ' + options.animation.open
      }
      if (options.modal === true) {
        noticeJsItem.setAttribute('noticejs-modal', 'true');
        AddModal()
      }
      addListener(noticeJsItem, options.closeWith);
      getCallback(options, 'beforeShow');
      getCallback(options, 'onShow');
      document.querySelector(target_class).appendChild(noticeJsItem);
      getCallback(options, 'afterShow');
      return noticeJsItem
    }
  }), (function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor)
        }
      }
      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor
      }
    }();
    var _noticejs = __webpack_require__(3);
    var _noticejs2 = _interopRequireDefault(_noticejs);
    var _api = __webpack_require__(0);
    var API = _interopRequireWildcard(_api);
    var _components = __webpack_require__(4);
    var _helpers = __webpack_require__(1);
    var helper = _interopRequireWildcard(_helpers);

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]
          }
        }
        newObj.default = obj;
        return newObj
      }
    }

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      }
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var NoticeJs = function () {
      function NoticeJs() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        _classCallCheck(this, NoticeJs);
        this.options = Object.assign(API.Defaults, options);
        this.component = new _components.Components();
        this.on('beforeShow', this.options.callbacks.beforeShow);
        this.on('onShow', this.options.callbacks.onShow);
        this.on('afterShow', this.options.callbacks.afterShow);
        this.on('onClose', this.options.callbacks.onClose);
        this.on('afterClose', this.options.callbacks.afterClose);
        this.on('onClick', this.options.callbacks.onClick);
        this.on('onHover', this.options.callbacks.onHover);
        return this
      }
      _createClass(NoticeJs, [{
        key: 'show',
        value: function show() {
          var container = this.component.createContainer();
          if (document.querySelector('.noticejs-' + this.options.position) === null) {
            document.body.appendChild(container)
          }
          var noticeJsHeader = void 0;
          var noticeJsBody = void 0;
          var noticeJsProgressBar = void 0;
          noticeJsHeader = this.component.createHeader(this.options.title, this.options.closeWith);
          noticeJsBody = this.component.createBody(this.options.text);
          if (this.options.progressBar === true) {
            noticeJsProgressBar = this.component.createProgressBar()
          }
          var noticeJs = helper.appendNoticeJs(noticeJsHeader, noticeJsBody, noticeJsProgressBar);
          return noticeJs
        }
      }, {
        key: 'on',
        value: function on(eventName) {
          var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
          if (typeof cb === 'function' && this.options.callbacks.hasOwnProperty(eventName)) {
            this.options.callbacks[eventName].push(cb)
          }
          return this
        }
      }]);
      return NoticeJs
    }();
    exports.default = NoticeJs;
    module.exports = exports['default']
  }), (function (module, exports) {}), (function (module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Components = undefined;
    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor)
        }
      }
      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor
      }
    }();
    var _api = __webpack_require__(0);
    var API = _interopRequireWildcard(_api);
    var _helpers = __webpack_require__(1);
    var helper = _interopRequireWildcard(_helpers);

    function _interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]
          }
        }
        newObj.default = obj;
        return newObj
      }
    }

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var options = API.Defaults;
    var Components = exports.Components = function () {
      function Components() {
        _classCallCheck(this, Components)
      }
      _createClass(Components, [{
        key: 'createContainer',
        value: function createContainer() {
          var element_class = 'noticejs-' + options.position;
          var element = document.createElement('div');
          element.classList.add('noticejs');
          element.classList.add(element_class);
          return element
        }
      }, {
        key: 'createHeader',
        value: function createHeader() {
          var element = void 0;
          if (options.title && options.title !== '') {
            element = document.createElement('div');
            element.setAttribute('class', 'noticejs-heading');
            element.textContent = options.title
          }
          if (options.closeWith.includes('button')) {
            var close = document.createElement('div');
            close.setAttribute('class', 'close');
            close.innerHTML = '&times;';
            if (element) {
              element.appendChild(close)
            } else {
              element = close
            }
          }
          return element
        }
      }, {
        key: 'createBody',
        value: function createBody() {
          var element = document.createElement('div');
          element.setAttribute('class', 'noticejs-body');
          var content = document.createElement('div');
          content.setAttribute('class', 'noticejs-content');
          content.innerHTML = options.text;
          element.appendChild(content);
          if (options.scroll !== null && options.scroll.maxHeight !== '') {
            element.style.overflowY = 'auto';
            element.style.maxHeight = options.scroll.maxHeight + 'px';
            if (options.scroll.showOnHover === true) {
              element.style.visibility = 'hidden'
            }
          }
          return element
        }
      }, {
        key: 'createProgressBar',
        value: function createProgressBar() {
          var element = document.createElement('div');
          element.setAttribute('class', 'noticejs-progressbar');
          var bar = document.createElement('div');
          bar.setAttribute('class', 'noticejs-bar');
          element.appendChild(bar);
          if (options.progressBar === true && typeof options.timeout !== 'boolean' && options.timeout !== false) {
            var frame = function frame() {
              if (width <= 0) {
                clearInterval(id);
                var item = element.closest('div.item');
                if (options.animation !== null && options.animation.close !== null) {
                  item.className = item.className.replace(new RegExp('(?:^|\\s)' + options.animation.open + '(?:\\s|$)'), ' ');
                  item.className += ' ' + options.animation.close;
                  var close_time = parseInt(options.timeout) + 500;
                  setTimeout(function () {
                    helper.CloseItem(item)
                  }, close_time)
                } else {
                  helper.CloseItem(item)
                }
              } else {
                width--;
                bar.style.width = width + '%'
              }
            };
            var width = 100;
            var id = setInterval(frame, options.timeout)
          }
          return element
        }
      }]);
      return Components
    }()
  })])
});

(async function () {
  // let rid = await getRoomId();
  // let a = await getYuchiGift(rid);
  // let b = await getBagGift();
  // let preInfo = await getGiftPreInfo(rid);
  // let roomGift = await getRoomGiftData(rid);
  // let roomGiftV2 = await getRoomGiftDataV2(preInfo);
  // for (const item in b.data) {
  //   allGift[b.data[item].name] = Number(Number(b.data[item].devote).toFixed(0));
  // }
  // allGift = {...allGift, ...a, ...roomGift, ...roomGiftV2}
  // console.log(allGift)
  const url = location.href;
  let count = 0;
  let timer = setInterval(() => {
    if (count >= 100) clearInterval(timer);
    if (url.includes("link.bilibili.com")) {
      if (document.getElementsByClassName("page-title").length > 0) {
        clearInterval(timer);
        if (document.getElementsByClassName("page-title")[0].innerHTML.includes("直播收益")) {
          initStyles();
          initEntry();
        }
      }
    } else {
      if (document.getElementsByClassName("error-container").length > 0) {
        clearInterval(timer);
        initStyles();
        init();
      }
    }
    count++
  }, 200);
})()