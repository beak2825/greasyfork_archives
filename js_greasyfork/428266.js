// ==UserScript==
// @name              [🔥]!!网购小助手,不花冤枉钱：自动查询淘宝、天猫、天猫国际、京东、京东国际、唯品会等隐藏的大额优惠券，有无优惠券一目了然，持续维护更新，请放心使用！
// @name:zh           [🔥]!!网购小助手,不花冤枉钱：自动查询淘宝、天猫、天猫国际、京东、京东国际、唯品会等隐藏的大额优惠券，有无优惠券一目了然，持续维护更新，请放心使用！
// @name:zh-TW        [🔥]!!網購小助手,不花冤枉錢：自動查詢淘寶、天貓、天貓國際、京東、京東國際、唯品會等隱藏的大額優惠券，有無優惠券一目瞭然，持續維護更新，請放心使用！
// @description       网购小助手功能有：🔥1、浏览商品时脚本会自动查询商品是否有隐藏的优惠券，支持：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；🔥2、商品二维码生成，手机可快捷访问该商品；🔥3、浏览记录标注，避免反复浏览相同商品（本地存储，可手动清空，快捷键shift+c清空）；🔥4、PC网页优化，让使用更加舒适；代码全部采用低侵入提示，脚本长期维护更新~
// @description:zh    网购小助手功能有：🔥1、浏览商品时脚本会自动查询商品是否有隐藏的优惠券，支持：京东、淘宝、天猫、天猫超市、天猫国际、京东国际、京东图书、京东大药房、阿里大药房、唯品会等；🔥2、商品二维码生成，手机可快捷访问该商品；🔥3、浏览记录标注，避免反复浏览相同商品（本地存储，可手动清空，快捷键shift+c清空）；🔥4、PC网页优化，让使用更加舒适；代码全部采用低侵入提示，脚本长期维护更新~
// @description:zh-TW 網購小助手功能有：🔥1、瀏覽商品時指令碼或直譯式程式會自動查詢商品是否有隱藏的優惠券，支援：京東、淘寶、天貓、天貓超市、天貓國際、京東國際、京東圖書、京東大藥房、阿里大藥房、唯品会等；🔥2、商品二維碼生成，手機可快捷訪問該商品；🔥3、瀏覽記錄標註，避免反覆瀏覽相同商品（本地存儲，可手動清空，快捷键shift+c清空）；🔥4、PC網頁優化，讓使用更加舒適；代碼全部採用低侵入提示，指令碼或直譯式程式長期維護更新~
// @icon		      data:image/png;base64,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
// @namespace         coupon_honghaoer
// @version           2.2.6
// @author            洪皓儿
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://pages.tmall.com/wow/an/cs/search**
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://item.jingdonghealth.cn/*
// @match             *://item.jkcsjd.com/*
// @match             *://*.yiyaojd.com/*
// @match             *://www.vipglobal.hk
// @match             *://*.vip.com/*
// @match             *://detail.vip.com/detail-*
// @match             *://www.vipglobal.hk/detail-*
// @match             *://category.vip.com/suggest.php**
// @match             *://list.vip.com/*.html
// @match             *://*.suning.com/*
// @exclude           *://jianghu.taobao.com/*
// @exclude           *://login.taobao.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://map.taobao.com/*
// @exclude           *://creator.guanghe.taobao.com/*
// @exclude           *://myseller.taobao.com/*
// @exclude           *://qn.taobao.com/*
// @exclude           *://jingfen.jd.com/*
// @exclude           *://passport.jd.com/*
// @exclude           *://jmw.jd.com/*
// @exclude           *://passport.shop.jd.com/*
// @exclude           *://passport.vip.com/*
// @exclude           *://huodong.taobao.com/wow/z/guang/gg_publish/*
// @exclude           *://passport.suning.com/*
// @connect           shuoaini.xyz
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_addStyle
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license           AGPL License
// @antifeature  	  referral-link 【此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，请知悉！】
// @charset		      UTF-8
// @run-at            document-idle
// @original-script   https://greasyfork.org/zh-CN/scripts/469417
// @original-author   huahuacat
// @original-license  AGPL License
// @downloadURL https://update.greasyfork.org/scripts/428266/%5B%F0%9F%94%A5%5D%21%21%E7%BD%91%E8%B4%AD%E5%B0%8F%E5%8A%A9%E6%89%8B%2C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E6%9C%89%E6%97%A0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0%EF%BC%8C%E8%AF%B7%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428266/%5B%F0%9F%94%A5%5D%21%21%E7%BD%91%E8%B4%AD%E5%B0%8F%E5%8A%A9%E6%89%8B%2C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E6%9C%89%E6%97%A0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0%EF%BC%8C%E8%AF%B7%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%EF%BC%81.meta.js
// ==/UserScript==
 
(function() {
  'use strict';

  /**
   * 代码版权说明：
   * 原作者huahuacat，本脚本在原作者基础上优化了代码结构，添加了新功能
   * 本脚本代码已获得原作者授权，并遵循AGPL License开源协议，请悉知！
   */

  const recordBrowsingHistoryKey = "record_browsing_history_key";
  const browsedHtml = `
    <div style="position:absolute;white-space: nowrap; top:7px;padding:2px 5px;font-size:12px;background-color:rgba(0,0,0);color:#FFF;z-index:9999999999;border-radius:20px;right:10px;"><b>已浏览</b></div>
  `;

  /**
   * 公共的方法
   */
  class CommonTools {
    request(method, url, param, isCrossOrigin = false) {
      if (isCrossOrigin) {
        return this.crossRequest(method, url, param);
      } else {
        return this.gmRequest(method, url, param);
      }
    }
    gmRequest(method, url, param) {
      if (method.toUpperCase()==="GET") {
        param = null;
      }
      return new Promise(function(resolve, reject) {
        GM_xmlhttpRequest({
          url: url,
          method: method,
          data: param,
          onload: function(response) {
            const status = response.status;
            if (status === 200) {
              const responseText = response.responseText;
              resolve({
                "code": "success",
                "result": responseText
              });
            } else {
              reject({
                "code": "error",
                "result": null
              });
            }
          }
        });
      });
    }
    crossRequest(method, url, param) {
      if (!method) {
        method = "get";
      }
      if (!url) {
        return new Promise(function(resolve, reject) {
          reject({
            "code": "error",
            "result": null
          });
        });
      }
      if (!param) {
        param = {};
      }
      method = method.toUpperCase();
      let config = {
        method: method
      };
      if (method === 'POST') {
        config.headers = {
          'Content-Type': 'application/json'
        };
        config.body = JSON.stringify(param);
      }
      return new Promise(function(resolve, reject) {
        fetch(url, config).then(response => response.text()).then(text => {
          resolve({
            "code": "success",
            "result": text
          });
        }).catch(error => {
          reject({
            "code": "error",
            "result": null
          });
        });
      });
    }
    randomNumber() {
      return Math.ceil(Math.random() * 100000000);
    }
    getPlatform(host = window.location.host) {
      let platform = "";
      if (host.includes(".taobao.") || host.includes(".liangxinyao.")) {
        platform = "taobao";
      } else if (host.includes(".tmall.")) {
        platform = "tmall";
      } else if (host.includes(".jd.") || host.includes(".yiyaojd.") || host.includes(".jkcsjd.") || host.includes(".jingdonghealth.")) {
        platform = "jd";
      } else if (host.includes(".vip.") || host.includes(".vipglobal.")) {
        platform = "vpinhui";
      } else if (host.includes(".suning.")) {
        platform = "suning";
      }
      return platform;
    }
    getParamterQueryUrl(text, tag) { //查询GET请求url中的参数
      if (text.includes("?")) { //选取?后面的字符串,兼容window.location.search，前面的?不能去掉
        const textArray = text.split("?");
        text = "?" + textArray[textArray.length - 1];
      }
      const t = new RegExp("(^|&)" + tag + "=([^&]*)(&|$)");
      const a = text.substr(1).match(t);
      if (a != null) {
        return a[2];
      }
      return "";
    }
    getEndHtmlIdByUrl(url) {
      if (url.includes("?")) {
        url = url.split("?")[0];
      }
      if (url.includes("#")) {
        url = url.split("#")[0];
      }
      const splitText = url.split("/");
      let idText = splitText[splitText.length - 1];
      idText = idText.replace(".html", "");
      return idText;
    }
    suningParameter(url) {
      const regex = /product\.suning\.com\/(\d+\/\d+)\.html/;
      const match = url.match(regex);
      if (match) {
        return match[1].replace(/\//g, '-');
      }
      return null;
    }
    getElementAsync(selector, target = document.body, allowEmpty = true, delay = 10, maxDelay = 10 * 1000) {
      return new Promise((resolve, reject) => {
        if (selector.toUpperCase() === "BODY") {
          resolve(document.body);
          return;
        }
        if (selector.toUpperCase() === "HTML") {
          resolve(document.documentElement);
          return;
        }
        let totalDelay = 0;

        let element = target.querySelector(selector);
        let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
        if (result) {
          resolve(element);
          return;
        }

        const elementInterval = setInterval(() => {
          if (totalDelay >= maxDelay) {
            clearInterval(elementInterval);
            resolve(null);
          }
          element = target.querySelector(selector);
          result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
          if (result) {
            clearInterval(elementInterval);
            resolve(element);
          } else {
            totalDelay += delay;
          }
        }, delay);
      });
    }
    GMgetValue(name, value = null) {
      let storageValue = value;
      if (typeof GM_getValue === "function") {
        storageValue = GM_getValue(name, value);
      } else if (typeof GM.setValue === "function") {
        storageValue = GM.getValue(name, value);
      } else {
        const arr = window.localStorage.getItem(name);
        if (arr != null) {
          storageValue = JSON.parse(arr);
        }
      }
      return storageValue;
    }
    GMsetValue(name, value) {
      if (typeof GM_setValue === "function") {
        GM_setValue(name, value);
      } else if (typeof GM.setValue === "function") {
        GM.setValue(name, value);
      } else {
        window.localStorage.setItem(name, JSON.stringify(value));
      }
    }
    decryptStr(str) {
      const result = atob(str);
      return result.split('').reverse().join('');
    }
    encryptStr(str) {
      const result = str.split('').reverse().join('');
      return btoa(result);
    }
    GMopenInTab(url, options = {
      "active": true,
      "insert": true,
      "setParent": true
    }) {
      if (typeof GM_openInTab === "function") {
        GM_openInTab(url, options);
      } else {
        GM.openInTab(url, options);
      }
    }
  }

  const dialog = (function() {
    class Dialog {
      constructor() {
        this.mask = document.createElement('div');
        this.dialogStyle = document.createElement('style');

        this.setStyle(this.mask, {
          "width": '100%',
          "height": '100%',
          "backgroundColor": 'rgba(0, 0, 0, .6)',
          "position": 'fixed',
          "left": "0px",
          "top": "0px",
          "bottom": "0px",
          "right": "0px",
          "zIndex": "9999999999999"
        });

        this.content = document.createElement('div');
        this.setStyle(this.content, {
          "maxWidth": '450px',
          "width": "100%",
          "maxHeight": '600px',
          "backgroundColor": '#fff',
          "boxShadow": '0 0 2px #999',
          "position": 'absolute',
          "left": '50%',
          "top": '50%',
          "transform": 'translate(-50%,-50%)',
          "borderRadius": '5px'
        });
        this.mask.appendChild(this.content);
      }
      middleBox(param) {
        this.content.innerHTML = '';

        let title = '默认标题内容';
        if (typeof param === '[object String]') {
          title = param;
        } else if (typeof param === '[object Object]') {
          title = param.title;
        }

        document.body.appendChild(this.mask);
        this.title = document.createElement('div');
        this.setStyle(this.title, {
          "width": '100%',
          "height": '40px',
          "lineHeight": '40px',
          "boxSizing": 'border-box',
          "backgroundColor": "#dedede",
          "color": '#000',
          "textAlign": 'center',
          "fontWeight": "700",
          "fontSize": "17px",
          "borderRadius": "4px 4px 0px 0px"
        });

        this.title.innerText = title;
        this.content.appendChild(this.title);

        this.closeBtn = document.createElement('div');
        this.closeBtn.innerText = '×';

        this.setStyle(this.closeBtn, {
          "textDecoration": 'none',
          "color": '#000',
          "position": 'absolute',
          "right": '10px',
          "top": '0px',
          "fontSize": '25px',
          "display": "inline-block",
          "cursor": "pointer"
        });
        this.title.appendChild(this.closeBtn);

        const self = this;
        this.closeBtn.onclick = function() {
          self.close();
          if (param.onClose && (typeof param.onClose) === "function") {
            param.onClose();
          }
        };
      }
      showMake(param) {
        if (param.hasOwnProperty("styleSheet")) {
          this.dialogStyle.textContent = param.styleSheet;
        }
        document.head.appendChild(this.dialogStyle);

        this.middleBox(param);
        this.dialogContent = document.createElement('div');
        this.setStyle(this.dialogContent, {
          "padding": "15px",
          "maxHeight": "400px"
        });
        this.dialogContent.innerHTML = param.content;
        this.content.appendChild(this.dialogContent);
        param.onContentReady(this);
      }
      close() {
        document.body.removeChild(this.mask);
        document.head.removeChild(this.dialogStyle);
      }
      setStyle(ele, styleObj) {
        for (let attr in styleObj) {
          ele.style[attr] = styleObj[attr];
        }
      }
    }
    let dialog = null;
    return (function() {
      if (!dialog) {
        dialog = new Dialog();
      }
      return dialog;
    })();
  })();

  /**
   * 优惠券相关功能
   */
  class Coupon {
    platforms = ["detail.tmall.com", "item.taobao.com", "item.jd.com", "item.yiyaojd.com", "npcitem.jd.hk",
      "detail.tmall.hk", "detail.vip.com", "item.jkcsjd.com", "product.suning.com", "item.jingdonghealth.cn"
    ];
    constructor(commonTools) {
      this.commonTools = commonTools;
      this.createQrcodeIsResult = true;
    }
    isRun() {
      for (let i = 0; i < this.platforms.length; i++) {
        if (window.location.host.includes(this.platforms[i])) {
          return true;
        }
      }
      return false;
    }
    filterName(str) {
      if (!str) return "";
      str = str.replace(/\t/g, "");
      str = str.replace(/\r/g, "");
      return encodeURIComponent(str);
    }
    async getGoodsData(platform) {
      let goodsId = "";
      let goodsName = "";
      const href = window.location.href;
      if (platform === "taobao" || platform === "tmall") {
        goodsId = this.commonTools.getParamterQueryUrl(window.location.search, "id");
        try {
          const titleObj = document.querySelector("[class^='ItemTitle--']");
          if (titleObj) {
            goodsName = titleObj.textContent;
          }
        } catch (e) {}
      } else if (platform === "jd") {
        goodsId = this.commonTools.getEndHtmlIdByUrl(href);
        try {
          const titleObj = document.querySelector(".sku-name");
          if (titleObj) {
            goodsName = titleObj.textContent;
          }
        } catch (e) {}
      } else if (platform === "vpinhui") {
        goodsId = this.commonTools.getEndHtmlIdByUrl(href).replace("detail-", "");
        const titleObj = document.querySelector(".pib-title-detail");
        if (titleObj) {
          goodsName = titleObj.textContent;
        }
      } else if (platform === "suning") {
        goodsId = this.commonTools.suningParameter(href);
        const titleObj = document.querySelector("#itemDisplayName");
        if (titleObj) {
          goodsName = titleObj.textContent;
        }
      }
      const data = {
        "goodsId": goodsId,
        "goodsName": this.filterName(goodsName)
      };
      return data;
    }
    randomSpmValue() {
      const spmMetas = document.querySelectorAll("meta[name='data-spm'], meta[name='spm-id']");
      spmMetas.forEach(meta => {
        const max = 5000;
        const min = 1000;
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        const randomLetter = String.fromCharCode(Math.floor(Math.random() * 26) + "a".charCodeAt(0));
        meta.setAttribute("content", randomValue + randomLetter);
      });
      const allElements = document.body.querySelectorAll("*");
      allElements.forEach(el => {
        el.removeAttribute("data-spm-anchor-id");
        el.removeAttribute("data-spm");
      });
    }
    runAliDeceptionSpm() {
      const host = window.location.host;
      if (host.includes("aliyun.com") || host.includes("taobao.com") || host.includes("tmall.com")) {
        this.randomSpmValue();
        setInterval(() => {
          this.randomSpmValue();
        }, 2000);
      }
    }
    browsingHistoryMark(platform, goodsId) {
      let histories = this.commonTools.GMgetValue(recordBrowsingHistoryKey, []);
      const saveContent = platform + "_" + goodsId;
      if (!histories.includes(saveContent)) {
        histories.unshift(saveContent);
        this.commonTools.GMsetValue(recordBrowsingHistoryKey, histories.slice(0, 60));
      }
    }
    async browsingHistoryGoods(platform, goodsId) {}
    async createHtml(platform, goodsId, goodsName) {
      if (!platform || !goodsId) {
        return "kong";
      }

      this.browsingHistoryMark(platform, goodsId);
      this.browsingHistoryGoods(platform, goodsId);

      let addition = "";
      if (platform === "vpinhui") {
        const vip = goodsId.split("-");
        addition = vip[0];
        goodsId = vip[1];
      }
      const goodsCouponUrl = "https://api.shuoaini.xyz/api/coupon/query?no=888&version=1.0.2&platform=" + platform + "&id=" + goodsId + "&q=" + goodsName + "&addition=" + addition;

      try {
        const data = await this.commonTools.request("GET", goodsCouponUrl, null, false);
        if (data.code === "success" && data.result) {
          const json = JSON.parse(data.result);

          await this.createCoupon(platform, json.data);
          await this.createQrcode(platform, json.mscan);

          let heartms = 0;
          const HEART_DELAY = 1500,
            MAX_MS = 1000 * 30;
          const createResultInterval = setInterval(async () => {
            if (this.createQrcodeIsResult) {
              if (document.querySelector("[name='exist-llkbccxs-9246-hi']") || heartms >= MAX_MS) {
                clearInterval(createResultInterval);
              } else {
                await this.createCoupon(platform, json.data);
              }
            }
            heartms += HEART_DELAY;
          }, HEART_DELAY);
        }
      } catch (e) {
        console.log("createCouponHtml:", e);
      }
    }
    async getHandlerElement(handler) {
      const getElement = async (handler) => {
        const promiseArray = [];
        const handlers = handler.split("@");
        for (const eleName of handlers) {
          if (!eleName) continue;
          if (eleName === "body") {
            promiseArray.push(new Promise(resolve => resolve(document.body)));
          } else if (eleName === "html") {
            promiseArray.push(new Promise(resolve => resolve(document.documentElement)));
          } else {
            promiseArray.push(this.commonTools.getElementAsync(eleName, document.body, true, 10, 1500));
          }
        }
        const element = await Promise.race(promiseArray);
        return element || null;
      };

      const element = await getElement(handler);
      return new Promise(resolve => resolve(element));
    }
    async createCoupon(platform, result) {
      try {
        this.createQrcodeIsResult = false;
        if (!result || result === "null" || !result.hasOwnProperty("css") || !result.hasOwnProperty("html") || !result.hasOwnProperty("handler")) {
          return;
        }
        const {
          css,
          html,
          handler,
          templateId
        } = result;
        if (!css || !html || !handler) {
          return;
        }
        GM_addStyle(css);

        const handlerElement = await this.getHandlerElement(handler);
        if (handlerElement) {
          let parentEl;
          if (platform === "taobao" || platform === "tmall") {
            parentEl = handlerElement.parentElement;
          } else {
            parentEl = handlerElement;
          }
          if (parentEl) {
            parentEl.insertAdjacentHTML('afterend', html);
          }
        }

        const templateElement = document.getElementById(templateId);
        if (!templateElement) {
          return;
        }

        const couponId = templateElement.dataset.id;
        const goodsPrivateUrl = "https://api.shuoaini.xyz/api/private/real?no=888&v=1.0.2&p=" + platform + "&id=";

        if (!/\d/.test(couponId)) {
          return;
        }

        setInterval(() => {
          templateElement.querySelectorAll("*").forEach(el => {
            el.removeAttribute("data-spm-anchor-id");
          });
        }, 400);

        const couponElementA = templateElement.querySelector("a[name='cpShUrl']");
        if (couponElementA) {
          const clickHandler = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.commonTools.request("GET", goodsPrivateUrl + couponId, null, false).then((privateResultData) => {
              if (privateResultData.code === "success" && privateResultData.result) {
                const url = JSON.parse(privateResultData.result).url;
                if (url) this.commonTools.GMopenInTab(url, {
                  active: true
                });
              }
            });
          };
          couponElementA.removeEventListener("click", clickHandler);
          couponElementA.addEventListener("click", clickHandler);
        }

        const canvasElement = document.getElementById("ca" + templateId);
        if (canvasElement) {
          const qrcodeResultData = await this.commonTools.request("GET", goodsPrivateUrl + couponId, null, false);
          if (qrcodeResultData && qrcodeResultData.code === "success" && qrcodeResultData.result) {
            const img = JSON.parse(qrcodeResultData.result).img;
            if (img) {
              const cxt = canvasElement.getContext("2d");
              const imgData = new Image();
              imgData.src = img;
              imgData.onload = function() {
                cxt.drawImage(imgData, 0, 0, imgData.width, imgData.height);
              };
            }
          }
        }
      } catch (e) {
        console.log("~~~~~~~~~~~~~~~~~", e);
      } finally {
        this.createQrcodeIsResult = true;
      }
    }
    async createQrcode(platform, mscan) {
      if (!mscan || mscan === "null" || !mscan.hasOwnProperty("mount") || !mscan.hasOwnProperty("html") || !mscan.hasOwnProperty("qrcode")) {
        return;
      }
      const {
        mount,
        html,
        qrcode,
        iden
      } = mscan;
      if (mount && html && qrcode && iden) {
        const mountEl = document.querySelector(mount);
        if (mountEl) {
          mountEl.insertAdjacentHTML('beforeend', html);
          const canvasElement = document.getElementById("mscan" + iden);
          if (canvasElement) {
            const width = canvasElement.getAttribute("width");
            const height = canvasElement.getAttribute("height");
            const cxt = canvasElement.getContext("2d");
            const imgData = new Image();
            imgData.src = qrcode;
            imgData.onload = function() {
              cxt.drawImage(imgData, 0, 0, width, height);
            };
          }
        }
      }
    }
    async start() {
      if (this.isRun()) {
        this.runAliDeceptionSpm();
        const platform = this.commonTools.getPlatform();
        if (!platform) return;

        if (platform === "tmall" || platform === "taobao") {
          this.commonTools.getElementAsync("div[class^='skuWrapper--']", document.body, false, 10, 1500).then((skuItemWrapper) => {
            if (skuItemWrapper) {
              skuItemWrapper.style.maxHeight = "400px";
              skuItemWrapper.style.overflow = "auto";
            }
          }).catch(() => {});
        } else if (platform === "jd") {
          const skuItemWrapper = document.querySelector("#choose-attrs");
          if (skuItemWrapper) {
            skuItemWrapper.style.maxHeight = "400px";
            skuItemWrapper.style.overflow = "auto";
          }
        }
        const goodsData = await this.getGoodsData(platform);
        this.createHtml(platform, goodsData.goodsId, goodsData.goodsName);
      }
    }
  }

  class SearchPageObject {
    intervalIsRunComplete = true;

    constructor(commonTools) {
      this.commonTools = commonTools;
      this.histories = commonTools.GMgetValue(recordBrowsingHistoryKey, []);
    }

    isRun() {
      const regexes = [
        /^https:\/\/www\.taobao\.com(\/|\/\?)?/i, /^https:\/\/s\.taobao\.com/i, /^https:\/\/shop(\d+)\.taobao\.com/i, /^https:\/\/www\.tmall\.com(\/|\/\?)?/i,
        /pages\.tmall\.com/i, /list\.tmall\.com/i, /list\.tmall\.hk/i, /tmall\.com\/category/i, /tmall\.com\/search/i,
        /tmall\.com\/shop/i, /tmall\.com\/\?q=/i, /maiyao\.liangxinyao\.com/i, /^https:\/\/www\.jd\.com(\/|\/\?)?/i, /search\.jd\.com/i,
        /search\.jd\.hk/i, /pro\.jd\.com\/mall/i, /jd\.com\/view_search/i, /category\.vip\.com/i, /list\.vip\.com/i,
        /^https:\/\/(?!product|dfp\.)([^\/]+)\.suning\.com\//i
      ];
      return regexes.some(reg => reg.test(window.location.href));
    }

    requestConf() {
      return this.commonTools.request("GET", "https://api.shuoaini.xyz/api/plugin/load/conf", null, true).then(data => {
        if (data.code === "success" && data.result) {
          return data.result;
        }
        return null;
      });
    }

    pickupSearchElements(conf, platform) {
      const selectorElementList = [];
      const visitHref = window.location.href;
      let confFilter = conf;
      try {
        confFilter = confFilter.replace(/\\\\/g, "\\");
      } catch (e) {}
      const confJson = JSON.parse(confFilter);

      if (confJson.hasOwnProperty(platform)) {
        const platformConfJson = confJson[platform];
        for (const itemJson of platformConfJson) {
          if (!itemJson.hasOwnProperty("elements") || !itemJson.hasOwnProperty("matches")) {
            continue;
          }
          const {
            elements,
            matches
          } = itemJson;
          const isMatch = matches.some(reg => (new RegExp(reg, "i")).test(visitHref));
          if (isMatch) {
            for (const el of elements) {
              selectorElementList.push({
                "element": el.element,
                "findA": el.findA,
                "page": el.page,
                "extra": el.extra
              });
            }
          }
        }
      }
      return selectorElementList;
    }

    searchPage(selectorElementList) {
      const items = [];
      selectorElementList.forEach(elementData => {
        if (elementData.element) {
          document.querySelectorAll(elementData.element + ":not([honghaoerbox='true'])").forEach(element => {
            items.push({
              "element": element,
              "findA": elementData.findA,
              "extra": elementData.extra,
              "page": elementData.page
            });
          });
        }
      });
      if (items.length > 0) {
        this.createAllElementHtml(items);
      }
    }

    async processLinksInBatches(items, batchSize) {
      const results = [];
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(item => this.createOneElementHtml(item))
        );
        results.push(...batchResults);
      }
      return results;
    }

    createAllElementHtml(items) {
      this.intervalIsRunComplete = false;
      this.processLinksInBatches(items, 18).then(() => {
        this.intervalIsRunComplete = true;
      });
    }

    getAnchorElement(element, findA) {
      let finalElement = null;
      if (findA === "this") {
        finalElement = element;
      } else {
        const selector = findA.replace(/^child@/, "");
        finalElement = element.querySelector(selector);
      }
      return finalElement;
    }

    createOneElementHtml(item) {
      const {
        element,
        page,
        findA,
        extra
      } = item;
      const self = this;
      return new Promise((resolve, reject) => {
        if (element.hasAttribute("honghaoerbox")) {
          resolve(-1);
          return;
        }
        element.setAttribute("honghaoerbox", "true");
        element.style.position = "relative";
        element.addEventListener("click", function() {
          this.insertAdjacentHTML('beforeend', browsedHtml);
        });

        const finalElement = self.getAnchorElement(element, findA);
        if (!finalElement) {
          resolve(-3);
          return;
        }

        let goodsDetailUrl = null;
        let isAnchorA = true;
        if (extra) {
          const {
            durl,
            attribute
          } = extra;
          const attributeValue = finalElement.getAttribute(attribute);
          if (attributeValue) {
            goodsDetailUrl = durl.replace("@", attributeValue);
            isAnchorA = false;
          }
        } else {
          goodsDetailUrl = finalElement.getAttribute("href");
        }

        if (!goodsDetailUrl) {
          resolve(-2);
          return;
        }

        let analysisData = null;
        if (page.includes("jd_")) {
          const jdId = self.commonTools.getEndHtmlIdByUrl(goodsDetailUrl);
          if (jdId) analysisData = {
            "id": jdId,
            "platform": "jd"
          };
        } else if (page.includes("vpinhui_")) {
          const vipId = self.commonTools.getEndHtmlIdByUrl(goodsDetailUrl).replace("detail-", "");
          if (vipId) {
            analysisData = {
              "id": vipId.split("-")[1],
              "platform": "vpinhui"
            };
          }
        } else if (page.includes("suning_")) {
          const suningId = self.commonTools.suningParameter(goodsDetailUrl);
          if (suningId) {
            analysisData = {
              "id": suningId,
              "platform": "suning"
            };
          }
        } else {
          const platform = self.commonTools.getPlatform(goodsDetailUrl);
          const id = self.commonTools.getParamterQueryUrl(goodsDetailUrl, "id");
          if (platform && id) {
            analysisData = {
              "id": id,
              "platform": platform
            };
          }
        }

        if (!analysisData) {
          resolve(-3);
          return;
        }

        const mark = analysisData.platform + "_" + analysisData.id;
        if (self.histories.includes(mark)) {
          element.insertAdjacentHTML('beforeend', browsedHtml);
        }

        const searchUrl = "https://api.shuoaini.xyz/api/ebusiness/q/c?p=" + analysisData.platform + "&id=" + analysisData.id;
        self.commonTools.request("GET", searchUrl, null, true).then(data => {
          if (data.code === "success" && data.result) {
            const {
              id,
              tip,
              encryptLink
            } = JSON.parse(data.result);
            if (tip) {
              element.insertAdjacentHTML('beforeend', tip);
            }
            if (encryptLink) {
              let decryptUrl = null;
              try {
                const decryptLink = atob(encryptLink);
                decryptUrl = decryptLink.split('').reverse().join('');
              } catch (e) {}
              if (decryptUrl) {
                if (isAnchorA) {
                  self.relativeAnchorAJu(page, element, decryptUrl);
                } else {
                  self.relativeJu(element, decryptUrl);
                }
              }
            }
          }
          resolve(0);
        }).catch(() => {
          resolve(-4);
        });
      });
    }

    relativeJu(element, decryptUrl) {
      const self = this;
      const clickHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        self.commonTools.GMopenInTab(decryptUrl);
      };
      element.removeEventListener("click", clickHandler);
      element.addEventListener("click", clickHandler);
    }

    relativeAnchorAJu(page, element, decryptUrl) {
      const self = this;
      try {
        if (page.includes("jd_")) {
          element.querySelectorAll("a").forEach(a => {
            const href = a.getAttribute("href");
            if (href && /item\.jd|npcitem\.jd/.test(href)) {
              const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.commonTools.GMopenInTab(decryptUrl);
              };
              a.removeEventListener("click", clickHandler);
              a.addEventListener("click", clickHandler);
            }
          });
        } else if (page.includes("taobao_") || page.includes("tmall_")) {
          const clickHandler = (e) => {
            const target = e.target;
            const tagName = target.tagName.toUpperCase();
            let isPreventDefault = false;
            if (tagName === "A") {
              const href = target.getAttribute("href");
              const isDetail = [/detail\.tmall\.com/, /item\.taobao\.com/].some(reg => reg.test(href));
              if (isDetail) {
                isPreventDefault = true;
              }
            } else {
              isPreventDefault = true;
            }
            if (isPreventDefault) {
              e.preventDefault();
              e.stopPropagation();
              self.commonTools.GMopenInTab(decryptUrl);
            }
          };
          element.removeEventListener("click", clickHandler);
          element.addEventListener("click", clickHandler);
        } else if (page.includes("vpinhui_")) {
          element.querySelectorAll("a").forEach(a => {
            const href = a.getAttribute("href");
            if (href && href.includes("detail.vip.com/detail-")) {
              const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.commonTools.GMopenInTab(decryptUrl);
              };
              a.removeEventListener("click", clickHandler);
              a.addEventListener("click", clickHandler);
            }
          });
        } else if (page.includes("suning_")) {
          element.querySelectorAll("a").forEach(a => {
            const href = a.getAttribute("href");
            if (href && href.includes("product.suning.com")) {
              const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.commonTools.GMopenInTab(decryptUrl);
              };
              a.removeEventListener("click", clickHandler);
              a.addEventListener("click", clickHandler);
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
    start() {
      if (this.isRun()) {
        const platform = this.commonTools.getPlatform();
        this.requestConf().then(conf => {
          const selectorElementList = this.pickupSearchElements(conf, (platform === "tmall" ? "taobao" : platform));
          if (this.intervalIsRunComplete) {
            this.searchPage(selectorElementList);
          }
          setInterval(() => {
            if (this.intervalIsRunComplete) {
              this.searchPage(selectorElementList);
            }
          }, 1500);
        });
      }
    }
  }

  const commonTools = new CommonTools();
  (new Coupon(commonTools)).start();
  (new SearchPageObject(commonTools)).start();

  GM_registerMenuCommand("清除浏览记录", () => {
    if (confirm('此弹窗来自脚本-[🔥]!!网购小助手,不花冤枉钱\n是否要移除所有的浏览记录？移除后将不可恢复...')) {
      commonTools.GMsetValue(recordBrowsingHistoryKey, []);
    }
  });
})();