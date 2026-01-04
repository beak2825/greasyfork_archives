// ==UserScript==
// @name         斗鱼导出主播收益记录
// @namespace    https://github.com/qianjiachun
// @version      2024.11.04.01
// @description  导出主播收益记录
// @author       小淳
// @match			*://www.douyu.com/creator/income
// @require         https://lib.baomitu.com/xlsx/0.16.4/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @connect      douyucdn.cn
// @downloadURL https://update.greasyfork.org/scripts/408800/%E6%96%97%E9%B1%BC%E5%AF%BC%E5%87%BA%E4%B8%BB%E6%92%AD%E6%94%B6%E7%9B%8A%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/408800/%E6%96%97%E9%B1%BC%E5%AF%BC%E5%87%BA%E4%B8%BB%E6%92%AD%E6%94%B6%E7%9B%8A%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

"use strict";
const DELAY = 0; // 访问间隔 1秒
const WAITTIME = 30000; // 遇到访问频繁，等待30秒
const PAGESIZE = 100; // 每页数据量，60是最稳定的不会缺数据，如果觉得慢可以调大，比如1000（请确保用户ID显示正常的情况下再调大，如果用户ID显示空白说明不能调大）

let allGift = {};

function getYuchiGift(rid) {
  return new Promise(resolve => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://open.douyucdn.cn/api/RoomApi/room/" + rid,
      responseType: "json",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onload: function (response) {
        let ret = response.response;
        let obj = {};
        for (let i = 0; i < ret.data.gift.length; i++) {
          obj[ret.data.gift[i].name] = Number(Number(ret.data.gift[i].gx).toFixed(0));
        }
        resolve(obj);
      }
    });
  })
}

function getGiftPreInfo(rid) {
  return new Promise((resolve, reject) => {
    fetch(`https://gift.douyucdn.cn/japi/reward/giftv2/preInfo/pc/v2?rid=${rid}&userLevel=135&version=8.6.2.2`, { method: "GET" })
      .then(res => res.json())
      .then(ret => {
        if (!ret?.data || ret?.error !== 0) {
          resolve("");
        }
        let giftPreInfo = ret?.data?.giftPreInfo;
        let giftIdsExpand = ["22484", "22483"]; // 高等级专属礼物
        let giftId = 22484;
        for (let i = 0; i < 1000; i++) {
          giftId++;
          giftIdsExpand.push(String(giftId));
        }
        giftPreInfo = giftPreInfo.replace(/-{2}$/, "-" + giftIdsExpand.join("_") + "-");
        resolve(giftPreInfo);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getRoomGiftDataV2(preInfo) {
  return new Promise((resolve, reject) => {
    fetch(`https://gift.douyucdn.cn/japi/reward/giftv2/list/details/pc/v2?giftPreInfo=${preInfo}&userLevel=150`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        let roomGiftData = {};
        if ("giftList" in ret.data) {
          for (let i = 0; i < ret.data.giftList.length; i++) {
            let item = ret.data.giftList[i];
            let svga = "";
            for (const key in item.effectInfo) {
              if (item.effectInfo[key]?.animation?.svga && item.effectInfo[key]?.animation?.svga !== "") {
                svga = item.effectInfo[key].animation.svga;
                break;
              }
            }
            roomGiftData[item.name] = Number(item.priceInfo.price) / 10;
          }
        }
        resolve(roomGiftData);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getRoomGiftData(rid) {
  return new Promise((resolve, reject) => {
    fetch("https://gift.douyucdn.cn/api/gift/v2/web/list?rid=" + rid, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        let roomGiftData = {};
        if ("giftList" in ret.data) {
          for (let i = 0; i < ret.data.giftList.length; i++) {
            let item = ret.data.giftList[i];
            let svga = "";
            for (const key in item.effectInfo) {
              if (item.effectInfo[key]?.animation?.svga && item.effectInfo[key]?.animation?.svga !== "") {
                svga = item.effectInfo[key].animation.svga;
                break;
              }
            }
            roomGiftData[item.name] = Number(item.priceInfo.price) / 10;
          }
        }
        resolve(roomGiftData);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getBagGift() {
  return new Promise(resolve => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json",
      responseType: "text",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onload: function (response) {
        let ret = response.response;
        let len = ret.length;
        ret = ret.substring(17, len - 2);
        resolve(JSON.parse(ret));
      }
    });
  })
}

function getRoomId() {
  return new Promise((reslove, reject) => {
    queryData("https://www.douyu.com/japi/creator/w/apinc/getUserInfo").then((ret) => {
      reslove(ret.data.rid);
    }).catch(err => {
      reject(err);
    })
  })
}

function init() {
  initStyles();
  initExportButton();
}

function initStyles() {
  let style = document.createElement("style");
  style.appendChild(document.createTextNode(`
    .export-button {
        position: absolute;
        display: inline-block;
        border-radius: 3px;
        text-align: center;
        width: 60px;
        height: 26px;
        background: #ff4444;
        color: white;
        line-height: 26px;
        cursor: pointer;
        right: 90px;
    }
    .collect-button {
        position: absolute;
        display: inline-block;
        border-radius: 3px;
        text-align: center;
        width: 60px;
        height: 26px;
        background: #a753b5;
        color: white;
        line-height: 26px;
        cursor: pointer;
        right: 20px;
    }
    .noticejs-top{top:0;width:100%!important}.noticejs-top .item{border-radius:0!important;margin:0!important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100%!important}.noticejs-bottom .item{border-radius:0!important;margin:0!important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible!important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible!important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible!important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible!important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left!important;margin-left:7px;margin-right:0!important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs ::-webkit-scrollbar{width:8px}.noticejs ::-webkit-scrollbar-button{width:8px;height:5px}.noticejs ::-webkit-scrollbar-track{border-radius:10px}.noticejs ::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs ::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}
`));
  document.head.appendChild(style);
}


function initExportButton() {
  initExportButton_Dom();
  initExportButton_Func();
}

function initExportButton_Dom() {
  let a = document.createElement("div");
  a.className = "export-button";
  a.id = "ex-export";
  a.innerText = "导出";
  let b = document.getElementsByClassName("pagination--2u_IVeo");
  b[0].appendChild(a);

  a = document.createElement("div");
  a.className = "collect-button";
  a.id = "ex-collect";
  a.innerText = "统计";
  b[0].appendChild(a);
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

async function startExport() {
  let jsonData = [];

  let lastId = "";
  let bianhao = 1;
  let currentPage = 1;
  let ret;

  let propType = getPropType();
  let queryType = getQueryType();
  let profitType = getProfitType();
  let [beginTime, endTime] = getTimeRange();

  let buttonDom = document.getElementsByClassName("export-button")[0];

  do {
    // ret = await queryData(`https://www.douyu.com/wjapi/nc/exchange/live/incomeDetail?appCode=ZBDS&pageNum=${currentPage}&pageSize=${PAGESIZE}&profitType=${profitType}&propType=${propType}&incomeStartDate=${beginTime}&incomeEndDate=${endTime}${lastId !== "" ? `&lastId=${lastId}` : ""}`)
    ret = await queryData(`https://www.douyu.com/wjapi/nc/exchange/live/incomeDetail/v2?profitType=${profitType}&queryType=${queryType}&incomeStartDate=${beginTime}&incomeEndDate=${endTime}&direction=1${lastId !== "" ? `&id=${lastId}` : ""}`);
    if (ret.error === 0) {
      let len = ret.data.length;
      if (len == 0) {
        break;
      }
      lastId = ret.data[len - 1].id;
      buttonDom.innerText = `导出${ currentPage }`;
      currentPage++;

      for (let i = 0; i < ret.data.length; i++) {
        let item = ret.data[i];
        let tmpObj = {
          id: bianhao,
          typeDesc: item.profitTypeDesc,
          dateline: dateFormat("yyyy-MM-dd hh:mm:ss", new Date(Number(item.dateline) * 1000)),
          userName: item.userName,
          relId: item.relId,
          relName: item.relName,
          number: item.num,
          price: Number(allGift[item.relName]) * Number(item.num) / 10,
          profit: Number(Math.abs(Number(item.amount)) / 100),
          roomId: item.roomId,
          settleTarget: item.settleTarget,
        }
        jsonData.push(tmpObj);
        bianhao++;
      }
    } else if (ret.msg == "访问太频繁, 请稍后再试") {
      await sleep(WAITTIME);
      continue;
    } else {
      console.log(ret.msg);
      break;
    }
    await sleep(DELAY);
  } while (ret.data.length >= 20);

  if (jsonData.length > 0) {
    let header = ["编号", "收益类型", "交易时间", "赠送者", "礼物id", "礼物名称", "赠送数量", "价格", "收益", "房间id", "结算对象"]
    let body = [];
    for (let i = 0; i < jsonData.length; i++) {
      let temp = [];
      for (let item in jsonData[i]) {
        temp.push(jsonData[i][item]);
      }
      body.push(temp);
    }
    exportJsonToExcel(header, body, `导出【${dateFormat("yyyy-MM-dd", new Date(beginTime * 1000))} ~ ${dateFormat("yyyy-MM-dd", new Date(endTime * 1000))}】`);
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

  let propType = getPropType();
  let queryType = getQueryType();
  let profitType = getProfitType();
  let [beginTime, endTime] = getTimeRange();

  let buttonDom = document.getElementsByClassName("collect-button")[0];

  do {
    // ret = await queryData(`https://www.douyu.com/wjapi/nc/exchange/live/incomeDetail?appCode=ZBDS&pageNum=${currentPage}&pageSize=${PAGESIZE}&profitType=${profitType}&propType=${propType}&incomeStartDate=${beginTime}&incomeEndDate=${endTime}${lastId !== "" ? `&lastId=${lastId}` : ""}`)
    ret = await queryData(`https://www.douyu.com/wjapi/nc/exchange/live/incomeDetail/v2?profitType=${profitType}&queryType=${queryType}&incomeStartDate=${beginTime}&incomeEndDate=${endTime}&direction=1${lastId !== "" ? `&id=${lastId}` : ""}`);
    if (ret.error === 0) {
      let len = ret.data.length;
      if (len == 0) {
        break;
      }
      lastId = ret.data[len - 1].id;
      buttonDom.innerText = `统计${ currentPage }`;
      currentPage++;

      for (let i = 0; i < ret.data.length; i++) {
        let item = ret.data[i];
        // 构造表头
        if (jsonHeader.indexOf(item.relName) == -1) {
          jsonHeader.push(item.relName);
        }

        // 构造表格
        if (item.userName in jsonBody == false) {
          jsonBody[item.userName] = {}; // 初始化
          jsonBody[item.userName]["totalProfit"] = 0;
          jsonBody[item.userName]["totalPrice"] = 0;
        }
        if (item.relName in jsonBody[item.userName] == false) {
          jsonBody[item.userName][item.relName] = 0;
        }
        jsonBody[item.userName][item.relName] += Number(item.num);
        if (Math.abs(Number(item.amount)) >= 0) {
          jsonBody[item.userName]["totalProfit"] += Math.abs(Number(item.amount)) / 100;
        }
        if (allGift[item.relName]) {
          jsonBody[item.userName]["totalPrice"] += Number(allGift[item.relName]) * Number(item.num) / 10;
        }
      }

    } else if (ret.msg == "访问太频繁, 请稍后再试") {
      await sleep(WAITTIME);
      continue;
    } else {
      console.log(ret.msg);
      break;
    }
    await sleep(DELAY);
  } while (ret.data.length >= 20);

  let header = createCollectHeader(jsonHeader);
  let body = createCollectBody(jsonHeader, jsonBody);
  exportJsonToExcel(header, body, `统计【${dateFormat("yyyy-MM-dd", new Date(beginTime * 1000))} ~ ${dateFormat("yyyy-MM-dd", new Date(endTime * 1000))}】`);
  showMessage("统计完毕", "success");
  buttonDom.innerText = `统计`;
}

function getPropType() {
  let list = document.getElementsByClassName("SubTabs--bRAHdsP")[0].querySelectorAll("div");
  for (let i = 0; i < list.length; i++) {
    if (list[i].className.includes("isActive")) {
      return i;
    }
  }
}

function getQueryType() {
  let list = document.getElementsByClassName("SubTabs--bRAHdsP")[0].querySelectorAll("div");
  for (let i = 0; i < list.length; i++) {
    if (list[i].className.includes("isActive")) {
      return i * 2;
    }
  }
}

function getProfitType() {
  let list = document.getElementsByClassName("shark-Select-menu")[0].querySelectorAll("dd");
  for (let i = 0; i < list.length; i++) {
    if (list[i].className.includes("selected")) {
      return i;
    }
  }
}

function getTimeRange() {
  let input = document.getElementById("rc-tabs-0-panel-gift").getElementsByClassName("shark-Input");
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
  ret.push("昵称", ...jsonHeader, "价格", "收益");
  return ret;
}

function createCollectBody(jsonHeader, jsonBody) {
  let ret = [];
  for (const userName in jsonBody) {
    const userItem = jsonBody[userName];
    let temp = [];
    temp.push(userName);

    for (let i = 0; i < jsonHeader.length; i++) {
      if (jsonHeader[i] in userItem) {
        temp.push(userItem[jsonHeader[i]]);
      } else {
        temp.push("");
      }
    }
    temp.push(userItem["totalPrice"]);
    temp.push(userItem["totalProfit"]);
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
  let rid = await getRoomId();
  let a = await getYuchiGift(rid);
  let b = await getBagGift();
  let preInfo = await getGiftPreInfo(rid);
  let roomGift = await getRoomGiftData(rid);
  let roomGiftV2 = await getRoomGiftDataV2(preInfo);
  for (const item in b.data) {
    allGift[b.data[item].name] = Number(Number(b.data[item].devote).toFixed(0));
  }
  allGift = {...allGift, ...a, ...roomGift, ...roomGiftV2}
  console.log(allGift)
  let timer = setInterval(() => {
    const tab = document.getElementById("rc-tabs-0-tab-gift");
    if (!tab) return;
    if (tab.getAttribute("aria-selected") !== "true") return;
    if (document.getElementsByClassName("pagination--2u_IVeo").length > 0) {
      clearInterval(timer);
      init();
    }
  }, 200);
})()