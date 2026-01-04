// ==UserScript==
// @name         CSGO饰品自由议价
// @description  得润(need.run)官方脚本，用于buff、悠悠有品、igxe、c5饰品直达自由交流区，无惧敏感词
// @icon         https://s1.imagehub.cc/images/2023/04/12/d3461ee6e5a2ffa11b0903bf46b6b862.png
// @namespace    https://github.com/qianjiachun
// @version      2023.04.15.01
// @author       小淳
// @match        *://buff.163.com/goods*
// @match        *://www.youpin898.com/goodInfo*
// @match        *://www.igxe.cn/product/730*
// @match        *://www.c5game.com/csgo/*
// @require      https://cdn.jsdelivr.net/npm/notice.js@0.4.0/dist/notice.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464061/CSGO%E9%A5%B0%E5%93%81%E8%87%AA%E7%94%B1%E8%AE%AE%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/464061/CSGO%E9%A5%B0%E5%93%81%E8%87%AA%E7%94%B1%E8%AE%AE%E4%BB%B7.meta.js
// ==/UserScript==
unsafeWindow.needrun_requestHookList = [];
unsafeWindow.needrun_requestHookCallback = function (xhr) {};

var originalOpen = XMLHttpRequest.prototype.open;
var originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function () {
  this._url = arguments[1];
  originalOpen.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function () {
  var self = this;
  this.addEventListener('load', function () {
    if (self.readyState === 4 && self.status === 200) {
      unsafeWindow.needrun_requestHookList.push(self);
      unsafeWindow.needrun_requestHookCallback(self);
    }
  });
  originalSend.apply(this, arguments);
};
(function() {
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = ".flex {\r\n  display: flex;\r\n}\r\n\r\n.items-center {\r\n  align-items: center;\r\n}\r\n\r\n.justify-center {\r\n  justify-content: center;\r\n}\r\n\r\n.flex-center {\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n}\r\n\r\n.needrun-text-color {\r\n  background: linear-gradient(to right, rgb(47, 112, 193), rgb(116, 97, 195));\r\n  background-clip: text;\r\n  -webkit-background-clip: text;\r\n  -webkit-text-fill-color: transparent;\r\n}\r\n\r\n.needrun-chat-btn:hover {\r\n  scale: 1.2;\r\n}\r\n\r\n.needrun-chat-btn {\r\n  transition: all 0.3s;\r\n}.noticejs-top {\r\n  top: 0;\r\n  width: 100% !important\r\n}\r\n\r\n.noticejs-top .item {\r\n  border-radius: 0 !important;\r\n  margin: 0 !important\r\n}\r\n\r\n.noticejs-topRight {\r\n  top: 10px;\r\n  right: 10px\r\n}\r\n\r\n.noticejs-topLeft {\r\n  top: 10px;\r\n  left: 10px\r\n}\r\n\r\n.noticejs-topCenter {\r\n  top: 10px;\r\n  left: 50%;\r\n  transform: translate(-50%)\r\n}\r\n\r\n.noticejs-middleLeft,\r\n.noticejs-middleRight {\r\n  right: 10px;\r\n  top: 50%;\r\n  transform: translateY(-50%)\r\n}\r\n\r\n.noticejs-middleLeft {\r\n  left: 10px\r\n}\r\n\r\n.noticejs-middleCenter {\r\n  top: 50%;\r\n  left: 50%;\r\n  transform: translate(-50%, -50%)\r\n}\r\n\r\n.noticejs-bottom {\r\n  bottom: 0;\r\n  width: 100% !important\r\n}\r\n\r\n.noticejs-bottom .item {\r\n  border-radius: 0 !important;\r\n  margin: 0 !important\r\n}\r\n\r\n.noticejs-bottomRight {\r\n  bottom: 10px;\r\n  right: 10px\r\n}\r\n\r\n.noticejs-bottomLeft {\r\n  bottom: 10px;\r\n  left: 10px\r\n}\r\n\r\n.noticejs-bottomCenter {\r\n  bottom: 10px;\r\n  left: 50%;\r\n  transform: translate(-50%)\r\n}\r\n\r\n.noticejs {\r\n  font-family: Helvetica Neue, Helvetica, Arial, sans-serif\r\n}\r\n\r\n.noticejs .item {\r\n  margin: 0 0 10px;\r\n  border-radius: 3px;\r\n  overflow: hidden\r\n}\r\n\r\n.noticejs .item .close {\r\n  float: right;\r\n  font-size: 18px;\r\n  font-weight: 700;\r\n  line-height: 1;\r\n  color: #fff;\r\n  text-shadow: 0 1px 0 #fff;\r\n  opacity: 1;\r\n  margin-right: 7px\r\n}\r\n\r\n.noticejs .item .close:hover {\r\n  opacity: .5;\r\n  color: #000\r\n}\r\n\r\n.noticejs .item a {\r\n  color: #fff;\r\n  border-bottom: 1px dashed #fff\r\n}\r\n\r\n.noticejs .item a,\r\n.noticejs .item a:hover {\r\n  text-decoration: none\r\n}\r\n\r\n.noticejs .success {\r\n  background-color: #64ce83\r\n}\r\n\r\n.noticejs .success .noticejs-heading {\r\n  background-color: #3da95c;\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .success .noticejs-body {\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .success .noticejs-body:hover {\r\n  visibility: visible !important\r\n}\r\n\r\n.noticejs .success .noticejs-content {\r\n  visibility: visible\r\n}\r\n\r\n.noticejs .info {\r\n  background-color: #3ea2ff\r\n}\r\n\r\n.noticejs .info .noticejs-heading {\r\n  background-color: #067cea;\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .info .noticejs-body {\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .info .noticejs-body:hover {\r\n  visibility: visible !important\r\n}\r\n\r\n.noticejs .info .noticejs-content {\r\n  visibility: visible\r\n}\r\n\r\n.noticejs .warning {\r\n  background-color: #ff7f48\r\n}\r\n\r\n.noticejs .warning .noticejs-heading {\r\n  background-color: #f44e06;\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .warning .noticejs-body {\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .warning .noticejs-body:hover {\r\n  visibility: visible !important\r\n}\r\n\r\n.noticejs .warning .noticejs-content {\r\n  visibility: visible\r\n}\r\n\r\n.noticejs .error {\r\n  background-color: #e74c3c\r\n}\r\n\r\n.noticejs .error .noticejs-heading {\r\n  background-color: #ba2c1d;\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .error .noticejs-body {\r\n  color: #fff;\r\n  padding: 10px\r\n}\r\n\r\n.noticejs .error .noticejs-body:hover {\r\n  visibility: visible !important\r\n}\r\n\r\n.noticejs .error .noticejs-content {\r\n  visibility: visible\r\n}\r\n\r\n.noticejs .progressbar {\r\n  width: 100%\r\n}\r\n\r\n.noticejs .progressbar .bar {\r\n  width: 1%;\r\n  height: 30px;\r\n  background-color: #4caf50\r\n}\r\n\r\n.noticejs .success .noticejs-progressbar {\r\n  width: 100%;\r\n  background-color: #64ce83;\r\n  margin-top: -1px\r\n}\r\n\r\n.noticejs .success .noticejs-progressbar .noticejs-bar {\r\n  width: 100%;\r\n  height: 5px;\r\n  background: #3da95c\r\n}\r\n\r\n.noticejs .info .noticejs-progressbar {\r\n  width: 100%;\r\n  background-color: #3ea2ff;\r\n  margin-top: -1px\r\n}\r\n\r\n.noticejs .info .noticejs-progressbar .noticejs-bar {\r\n  width: 100%;\r\n  height: 5px;\r\n  background: #067cea\r\n}\r\n\r\n.noticejs .warning .noticejs-progressbar {\r\n  width: 100%;\r\n  background-color: #ff7f48;\r\n  margin-top: -1px\r\n}\r\n\r\n.noticejs .warning .noticejs-progressbar .noticejs-bar {\r\n  width: 100%;\r\n  height: 5px;\r\n  background: #f44e06\r\n}\r\n\r\n.noticejs .error .noticejs-progressbar {\r\n  width: 100%;\r\n  background-color: #e74c3c;\r\n  margin-top: -1px\r\n}\r\n\r\n.noticejs .error .noticejs-progressbar .noticejs-bar {\r\n  width: 100%;\r\n  height: 5px;\r\n  background: #ba2c1d\r\n}\r\n\r\n@keyframes noticejs-fadeOut {\r\n  0% {\r\n    opacity: 1\r\n  }\r\n\r\n  to {\r\n    opacity: 0\r\n  }\r\n}\r\n\r\n.noticejs-fadeOut {\r\n  animation-name: noticejs-fadeOut\r\n}\r\n\r\n@keyframes noticejs-modal-in {\r\n  to {\r\n    opacity: .3\r\n  }\r\n}\r\n\r\n@keyframes noticejs-modal-out {\r\n  to {\r\n    opacity: 0\r\n  }\r\n}\r\n\r\n.noticejs-rtl .noticejs-heading {\r\n  direction: rtl\r\n}\r\n\r\n.noticejs-rtl .close {\r\n  float: left !important;\r\n  margin-left: 7px;\r\n  margin-right: 0 !important\r\n}\r\n\r\n.noticejs-rtl .noticejs-content {\r\n  direction: rtl\r\n}\r\n\r\n.noticejs {\r\n  position: fixed;\r\n  z-index: 10050;\r\n  width: 320px\r\n}\r\n\r\n.noticejs ::-webkit-scrollbar {\r\n  width: 8px\r\n}\r\n\r\n.noticejs ::-webkit-scrollbar-button {\r\n  width: 8px;\r\n  height: 5px\r\n}\r\n\r\n.noticejs ::-webkit-scrollbar-track {\r\n  border-radius: 10px\r\n}\r\n\r\n.noticejs ::-webkit-scrollbar-thumb {\r\n  background: hsla(0, 0%, 100%, .5);\r\n  border-radius: 10px\r\n}\r\n\r\n.noticejs ::-webkit-scrollbar-thumb:hover {\r\n  background: #fff\r\n}\r\n\r\n.noticejs-modal {\r\n  position: fixed;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: #000;\r\n  z-index: 10000;\r\n  opacity: .3;\r\n  left: 0;\r\n  top: 0\r\n}\r\n\r\n.noticejs-modal-open {\r\n  opacity: 0;\r\n  animation: noticejs-modal-in .3s ease-out\r\n}\r\n\r\n.noticejs-modal-close {\r\n  animation: noticejs-modal-out .3s ease-out;\r\n  animation-fill-mode: forwards\r\n}";
  document.head.appendChild(__vite_style__);
  function renderChatButton({
    style,
    className,
    goodsInfo
  }) {
    if (!goodsInfo)
      return `<div style="cursor: pointer;${style}" class="needrun-chat-btn flex-center needrun-text-color ${className}">
		<svg t="1681373903044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4525" width="16" height="16"><path d="M628.363636 605.090909c-18.618182 0-34.909091-16.290909-34.909091-34.909091S609.745455 535.272727 628.363636 535.272727h41.890909c18.618182 0 34.909091 16.290909 34.909091 34.909091s-13.963636 34.909091-34.909091 34.909091H628.363636z m-325.818181 0c-18.618182 0-34.909091-16.290909-34.909091-34.909091S283.927273 535.272727 302.545455 535.272727h160.581818c18.618182 0 34.909091 16.290909 34.909091 34.909091s-16.290909 34.909091-34.909091 34.909091H302.545455z m0-209.454545c-18.618182 0-34.909091-16.290909-34.909091-34.909091S283.927273 325.818182 302.545455 325.818182h372.363636c18.618182 0 34.909091 16.290909 34.909091 34.909091S693.527273 395.636364 674.909091 395.636364H302.545455z m202.472727 507.345454l-104.727273 69.818182c-48.872727 32.581818-114.036364 18.618182-144.290909-30.254545-2.327273-4.654545-4.654545-6.981818-6.981818-11.636364l-18.618182-39.563636c-111.709091-13.963636-195.490909-107.054545-195.490909-218.763637V272.290909C34.909091 162.909091 116.363636 69.818182 225.745455 53.527273c95.418182-13.963636 190.836364-18.618182 286.254545-18.618182s190.836364 6.981818 286.254545 18.618182c109.381818 16.290909 190.836364 109.381818 190.836364 218.763636v400.290909c0 116.363636-90.763636 214.109091-207.127273 221.090909-90.763636 4.654545-179.2 9.309091-269.963636 9.309091h-6.981818zM474.763636 837.818182c4.654545-4.654545 11.636364-6.981818 18.618182-6.981818h16.290909c88.436364 0 176.872727-2.327273 265.309091-9.309091 79.127273-4.654545 141.963636-72.145455 141.963637-151.272728V269.963636c0-76.8-55.854545-139.636364-130.327273-148.945454-90.763636-9.309091-181.527273-16.290909-274.618182-16.290909s-183.854545 6.981818-276.945455 18.618182c-74.472727 9.309091-130.327273 74.472727-130.327272 148.945454v400.290909c0 79.127273 62.836364 146.618182 141.963636 151.272727h9.309091c11.636364 0 23.272727 6.981818 27.927273 18.618182l27.927272 55.854546c0 2.327273 2.327273 2.327273 2.327273 4.654545 11.636364 16.290909 32.581818 20.945455 48.872727 9.309091l111.709091-74.472727z" fill="rgb(116, 97, 195)" p-id="4526"></path></svg>
		<span style="margin-left:0.25rem;font-size:14px;">联系</span>
	</div>`;
    const url = getNeedRunUrlByGoodsInfo(goodsInfo);
    return `<div style="cursor: pointer;${style}" class="needrun-chat-btn ${className}">
	<a href="${url}" target="_blank" class="flex-center needrun-text-color">
		<svg t="1681373903044" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4525" width="16" height="16"><path d="M628.363636 605.090909c-18.618182 0-34.909091-16.290909-34.909091-34.909091S609.745455 535.272727 628.363636 535.272727h41.890909c18.618182 0 34.909091 16.290909 34.909091 34.909091s-13.963636 34.909091-34.909091 34.909091H628.363636z m-325.818181 0c-18.618182 0-34.909091-16.290909-34.909091-34.909091S283.927273 535.272727 302.545455 535.272727h160.581818c18.618182 0 34.909091 16.290909 34.909091 34.909091s-16.290909 34.909091-34.909091 34.909091H302.545455z m0-209.454545c-18.618182 0-34.909091-16.290909-34.909091-34.909091S283.927273 325.818182 302.545455 325.818182h372.363636c18.618182 0 34.909091 16.290909 34.909091 34.909091S693.527273 395.636364 674.909091 395.636364H302.545455z m202.472727 507.345454l-104.727273 69.818182c-48.872727 32.581818-114.036364 18.618182-144.290909-30.254545-2.327273-4.654545-4.654545-6.981818-6.981818-11.636364l-18.618182-39.563636c-111.709091-13.963636-195.490909-107.054545-195.490909-218.763637V272.290909C34.909091 162.909091 116.363636 69.818182 225.745455 53.527273c95.418182-13.963636 190.836364-18.618182 286.254545-18.618182s190.836364 6.981818 286.254545 18.618182c109.381818 16.290909 190.836364 109.381818 190.836364 218.763636v400.290909c0 116.363636-90.763636 214.109091-207.127273 221.090909-90.763636 4.654545-179.2 9.309091-269.963636 9.309091h-6.981818zM474.763636 837.818182c4.654545-4.654545 11.636364-6.981818 18.618182-6.981818h16.290909c88.436364 0 176.872727-2.327273 265.309091-9.309091 79.127273-4.654545 141.963636-72.145455 141.963637-151.272728V269.963636c0-76.8-55.854545-139.636364-130.327273-148.945454-90.763636-9.309091-181.527273-16.290909-274.618182-16.290909s-183.854545 6.981818-276.945455 18.618182c-74.472727 9.309091-130.327273 74.472727-130.327272 148.945454v400.290909c0 79.127273 62.836364 146.618182 141.963636 151.272727h9.309091c11.636364 0 23.272727 6.981818 27.927273 18.618182l27.927272 55.854546c0 2.327273 2.327273 2.327273 2.327273 4.654545 11.636364 16.290909 32.581818 20.945455 48.872727 9.309091l111.709091-74.472727z" fill="rgb(116, 97, 195)" p-id="4526"></path></svg>
		<span style="margin-left:0.25rem;font-size:14px;">联系</span>
	</a>
	</div>`;
  }
  function tidyObject(obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] === 0 || obj[key] && obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== "NaN") {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
  function getNeedRunUrlByGoodsInfo(goodsInfo) {
    const prefix = "https://need.run/goods";
    const {
      goodsName,
      paintIndex,
      paintSeed,
      paintWear,
      inspectImg,
      platform
    } = tidyObject(goodsInfo);
    let search = new URLSearchParams(tidyObject({
      name: encodeURIComponent(goodsName),
      index: String(paintIndex),
      seed: String(paintSeed),
      wear: formatPaintWear(paintWear),
      img: inspectImg,
      platform: String(platform)
    }));
    return `${prefix}?${search.toString()}`;
  }
  function showMessage(msg, type) {
    new NoticeJs({
      text: msg,
      type,
      position: "bottomRight"
    }).show();
  }
  const formatPaintWear = (wear) => {
    if (wear === "")
      return wear;
    const numberWear = Number(wear);
    return numberWear > 0 ? numberWear.toFixed(16) : "";
  };
  function openPage(url, b = true) {
    GM_openInTab(url, {
      active: b
    });
  }
  function init$7() {
    const requestList = unsafeWindow.needrun_requestHookList;
    if (requestList.length <= 0) {
      let marketShow = new unsafeWindow.marketShow();
      marketShow.init();
    }
    for (let i = 0; i < requestList.length; i++) {
      let item = requestList[i];
      if (item.responseURL.includes("goods/sell_order")) {
        let data = JSON.parse(item.responseText);
        insertDom$3(data.data);
        break;
      }
    }
    unsafeWindow.needrun_requestHookCallback = function(xhr) {
      if (xhr.responseURL.includes("goods/sell_order")) {
        let data = JSON.parse(xhr.responseText);
        insertDom$3(data.data);
      }
    };
  }
  function insertDom$3(data) {
    const {
      goods_infos,
      items
    } = data;
    const url = new URL(location.href);
    const goodsId = url.pathname.substring(url.pathname.lastIndexOf("/") + 1);
    const sellings = document.querySelectorAll(".list_tb_csgo .selling");
    for (let i = 0; i < sellings.length; i++) {
      const selling = sellings[i];
      const data2 = items[i];
      if (!goods_infos[goodsId].name || goods_infos[goodsId].name === "")
        continue;
      const inspectImg = data2.asset_info.info.inspect_mobile_url && data2.asset_info.info.inspect_mobile_url !== "" ? data2.asset_info.info.inspect_mobile_url : data2.img_src;
      const goodsInfo = {
        goodsName: goods_infos[goodsId].name,
        paintIndex: data2.asset_info.info.paintindex || 0,
        paintSeed: data2.asset_info.info.paintseed || 0,
        paintWear: data2.asset_info.paintwear || "",
        inspectImg,
        platform: 0
      };
      const dom = selling.querySelector(".j_shoptip_handler");
      dom.insertAdjacentHTML("afterend", renderChatButton({
        style: "width: 100%",
        goodsInfo
      }));
    }
  }
  const ChatButton$3 = {
    init: init$7
  };
  function initPkg$3() {
    if (location.href.includes("buff") && location.href.includes("goods")) {
      let count = 0;
      let timer = setInterval(() => {
        if (document.getElementsByClassName("j_shoptip_handler").length > 0) {
          clearInterval(timer);
          ChatButton$3.init();
          count++;
          if (count > 200)
            clearInterval(timer);
        }
      }, 300);
    }
  }
  function init$6() {
    initPkg$3();
  }
  const buff = {
    init: init$6
  };
  function apiGetYoupinGoodsDetail(goodsId, commodityNo) {
    return new Promise((resolve) => {
      fetch(`https://api.youpin898.com/api/commodity/Commodity/Detail?Id=${String(goodsId)}&CommodityNo=${String(commodityNo)}`, {
        method: "GET"
      }).then((res) => res.json()).then((ret) => {
        resolve(ret);
      }).catch((err) => {
        console.log(err);
        resolve({});
      });
    });
  }
  function init$5() {
    unsafeWindow.needrun_requestHookCallback = function(xhr) {
      if (xhr.responseURL.includes("GetCsGoPagedList")) {
        let data = JSON.parse(xhr.responseText);
        let count = 0;
        let timer = setInterval(() => {
          if (document.getElementsByClassName("sellerNickInfo").length > 0) {
            clearInterval(timer);
            insertDom$2();
            initFunc$2(data.Data.CommodityList);
          }
          count++;
          if (count > 200)
            clearInterval(timer);
        }, 100);
      }
    };
  }
  function insertDom$2() {
    const sellings = document.querySelectorAll(".sellerNickInfo");
    for (let i = 0; i < sellings.length; i++) {
      const selling = sellings[i];
      selling.insertAdjacentHTML("afterend", renderChatButton({
        style: "width: 100%"
      }));
    }
  }
  function initFunc$2(items) {
    const btns = document.querySelectorAll(".needrun-chat-btn");
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      const itemData = items[i];
      btn.addEventListener("click", async () => {
        showMessage("数据请求中，请稍等...", "info");
        const goodsId = itemData.Id;
        const commodityNo = itemData.CommodityNo;
        let ret = await apiGetYoupinGoodsDetail(goodsId, commodityNo);
        if (ret.Code !== 0) {
          showMessage("数据获取失败，请重试", "error");
          return;
        }
        showMessage("数据获取完毕", "success");
        const data = ret.Data;
        let img = "";
        if (data.NewImages && data.NewImages !== "") {
          img = "https://youpin.img898.com/" + data.NewImages;
        } else if (data.Images && data.Images !== "") {
          let imgArr = data.Images.split(",");
          for (let i2 = 0; i2 < imgArr.length; i2++) {
            img += "https://youpin.img898.com/" + imgArr[i2] + ";";
          }
        } else {
          img = data.ImgUrl;
        }
        const goodsInfo = {
          goodsName: data.CommodityName,
          inspectImg: img,
          paintIndex: data.PaintIndex ? Number(data.PaintIndex) : 0,
          paintSeed: data.PaintSeed ? Number(data.PaintSeed) : 0,
          paintWear: data.Abrade,
          platform: 1
        };
        openPage(getNeedRunUrlByGoodsInfo(goodsInfo));
      });
    }
  }
  const ChatButton$2 = {
    init: init$5
  };
  function initPkg$2() {
    ChatButton$2.init();
  }
  function init$4() {
    initPkg$2();
  }
  const youpin = {
    init: init$4
  };
  function apiGetIgxeGoodsInspectImg(id) {
    return new Promise((resolve) => {
      fetch(`https://www.igxe.cn/show-inspect-image-${String(id)}`, {
        method: "GET"
      }).then((res) => res.json()).then((ret) => {
        resolve(ret.url);
      }).catch((err) => {
        console.log(err);
        resolve("");
      });
    });
  }
  function init$3() {
    unsafeWindow.needrun_requestHookCallback = function(xhr) {
      if (xhr.responseURL.includes("product/trade")) {
        let data = JSON.parse(xhr.responseText);
        let count = 0;
        let timer = setInterval(() => {
          if (document.getElementsByClassName("user-img").length > 0) {
            clearInterval(timer);
            insertDom$1();
            initFunc$1(data.d_list);
          }
          count++;
          if (count > 200)
            clearInterval(timer);
        }, 100);
      }
    };
  }
  function insertDom$1() {
    const sellings = document.querySelectorAll(".user-img");
    for (let i = 0; i < sellings.length; i++) {
      const selling = sellings[i];
      if (selling.querySelector(".needrun-chat-btn")) {
        selling.querySelector(".needrun-chat-btn").remove();
      }
      let style = "width: 100%;";
      if (selling.querySelectorAll(".ui-box").length > 0) {
        style += "position: absolute;margin-top: 4rem;";
      }
      selling.insertAdjacentHTML("beforeend", renderChatButton({
        style
      }));
    }
  }
  function initFunc$1(items) {
    const btns = document.querySelectorAll(".needrun-chat-btn");
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      const item = items[i];
      btn.addEventListener("click", async () => {
        let img = item.icon_url;
        if (item.inspect_img_small && item.inspect_img_small !== "") {
          showMessage("数据请求中，请稍等...", "info");
          img = await apiGetIgxeGoodsInspectImg(item.id) || item.icon_url;
          showMessage("数据获取完毕", "success");
        }
        const goodsInfo = {
          goodsName: item.name,
          inspectImg: img,
          paintIndex: item.paint_index ? Number(item.paint_index) : 0,
          paintSeed: item.paint_seed ? Number(item.paint_seed) : 0,
          paintWear: item.exterior_wear,
          platform: 2
        };
        openPage(getNeedRunUrlByGoodsInfo(goodsInfo));
      });
    }
  }
  const ChatButton$1 = {
    init: init$3
  };
  function initPkg$1() {
    ChatButton$1.init();
  }
  function init$2() {
    initPkg$1();
  }
  const igxe = {
    init: init$2
  };
  function apiGetC5GoodsDetail(cardId) {
    return new Promise((resolve) => {
      fetch(`https://www.c5game.com/napi/trade/steamtrade/sga/sell/v3/detail?id=${cardId}`, {
        method: "GET"
      }).then((res) => res.json()).then((ret) => {
        resolve(ret);
      }).catch((err) => {
        console.log(err);
        resolve({});
      });
    });
  }
  function init$1() {
    insertDom();
    initFunc();
  }
  function insertDom() {
    const sellings = document.querySelectorAll(".onsale-table-item");
    for (let i = 0; i < sellings.length; i++) {
      const selling = sellings[i];
      if (!selling)
        return;
      const row = selling.getElementsByClassName("row");
      if (row.length === 0)
        return;
      const node4 = row[0].children[3];
      if (!node4)
        continue;
      node4.insertAdjacentHTML("beforeend", renderChatButton({
        style: "width: 100%"
      }));
    }
  }
  function initFunc() {
    const btns = document.querySelectorAll(".needrun-chat-btn");
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      btn.addEventListener("click", async () => {
        const parentNode = btn.parentElement.parentElement;
        const cardId = parentNode.getElementsByClassName("item-card")[0].getAttribute("cardid");
        if (cardId && cardId !== "") {
          showMessage("数据请求中，请稍等...", "info");
          let detail = await apiGetC5GoodsDetail(cardId);
          if (!detail.success) {
            showMessage("数据获取失败，请重试", "error");
            return;
          }
          showMessage("数据获取完毕", "success");
          const {
            data
          } = detail;
          const goodsInfo = {
            goodsName: data.name,
            inspectImg: data.inspectImage && data.inspectImage !== "" ? data.inspectImage : data.imageUrl,
            paintIndex: data.assetInfo.paintIndex ? Number(data.assetInfo.paintIndex) : 0,
            paintSeed: data.assetInfo.paintSeed ? Number(data.assetInfo.paintSeed) : 0,
            paintWear: data.assetInfo.wear,
            platform: 3
          };
          openPage(getNeedRunUrlByGoodsInfo(goodsInfo));
        }
      });
    }
  }
  const ChatButton = {
    init: init$1
  };
  function initPkg() {
    let count = 0;
    let timer = setInterval(() => {
      if (document.getElementsByClassName("item-card").length > 0) {
        clearInterval(timer);
        ChatButton.init();
      }
      count++;
      if (count > 200)
        clearInterval(timer);
    }, 300);
  }
  function init() {
    initPkg();
  }
  const c5 = {
    init
  };
  const pages = {
    // www,
    buff,
    youpin,
    igxe,
    c5
  };
  function initRouter() {
    const url = location.href;
    if (url.includes("buff"))
      pages.buff.init();
    if (url.includes("youpin"))
      pages.youpin.init();
    if (url.includes("igxe"))
      pages.igxe.init();
    if (url.includes("c5game"))
      pages.c5.init();
  }
  const index = "";
  const Notice = "";
  initRouter();
})();
