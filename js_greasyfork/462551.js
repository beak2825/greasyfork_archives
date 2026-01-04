// ==UserScript==
// @name         dxm
// @namespace    https://greasyfork.org/zh-CN/scripts/462551
// @version      2.64
// @author       Huang
// @description  统计当前订单件数 & 针对区域定价的报关金额进行批量填充
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dianxiaomi.com
// @match        https://www.dianxiaomi.com/order/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/462551/dxm.user.js
// @updateURL https://update.greasyfork.org/scripts/462551/dxm.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const o=document.createElement("style");o.textContent=t,document.head.append(o)})(" h3.total-num{color:#007bff;position:absolute;left:200px;top:7px;font-size:13px}#orderListTable tr.goodsId{position:relative}.operation-btns{position:absolute;left:300px;top:4px}.operation-btns a{color:#28a745;font-size:13px;margin-right:20px}#dxmOrderDetailDiv{display:none}.total-count{color:red;line-height:30px;font-size:13px;margin-left:10px}.pkg-types{color:gray;line-height:30px;font-size:13px;margin-left:10px} ");

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
  class Utils {
    // 模拟input
    static tEvent(b, a) {
      if (b) {
        window.newhtmlevents = window.newhtmlevents || document.createEvent("HTMLEvents");
        newhtmlevents.initEvent(a, true, true);
        return b.dispatchEvent(newhtmlevents);
      }
    }
    static simulateInput(ele, val) {
      this.tEvent(ele, "click");
      this.tEvent(ele, "input");
      ele.value = val;
      this.tEvent(ele, "keyup");
      this.tEvent(ele, "change");
      this.tEvent(ele, "blur");
    }
    static htmlParser(htmlString) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(htmlString, "text/html");
      return doc;
    }
    static isGpsrCountry(countryCode) {
      const countries = ["奥地利", "比利时", "保加利亚", "塞浦路斯", "克罗地亚", "捷克共和国", "丹麦", "爱沙尼亚", "芬兰", "法国", "德国", "希腊", "匈牙利", "爱尔兰", "意大利", "拉脱维亚", "立陶宛", "卢森堡", "马耳他", "荷兰", "波兰", "葡萄牙", "罗马尼亚", "斯洛伐克", "斯洛文尼亚", "西班牙", "瑞典"];
      return countries.includes(countryCode);
    }
    /**
     * 从URL中提取指定键的查询参数值。
     * @param {string} url - 包含查询参数的URL。
     * @param {string} key - 要提取值的查询参数键。
     * @returns {string|null} - 指定键的查询参数值，如果不存在则返回null。
     */
    static getUrlKeyValuePairs(url, key) {
      const pairs = {};
      const parts = url.split("?")[1].split("&");
      for (const part of parts) {
        const [key2, value] = part.split("=");
        pairs[key2] = value;
      }
      return pairs[key] || null;
    }
    static isiPad() {
      const ua = navigator.userAgent;
      const platform = navigator.platform;
      if (/iPad/i.test(ua) || platform === "iPad") {
        return true;
      }
      return platform === "MacIntel" && navigator.maxTouchPoints > 1;
    }
  }
  const _Declare = class _Declare {
    static init() {
      $(document).off("click", `a[onclick="showBatchCustoms();"]`);
      $(document).on("click", `a[onclick="showBatchCustoms();"]`, () => {
        _Declare.prepareData();
      });
      _Declare.applyTrackingDirect();
    }
    static applyTrackingDirect() {
      $(`button[onclick="batchMoveProcessed();"]`).each(function() {
        $(this).attr("onclick", null);
      });
      $(document).off("click", "[id^='moveProcessBtn']");
      $(document).on("click", "[id^='moveProcessBtn']", () => {
        let isCheckedAnyone = $(`#showSelCheckboxNum`).length > 0;
        if (!isCheckedAnyone) {
          $.fn.message({ type: "error", msg: "请至少选择一个订单ya" });
          return;
        }
        _Declare.prepareData();
        showBatchCustoms();
      });
    }
    // 准备要在报关列表用到的数据
    static prepareData() {
      let t = [], that = this, _reg = /[^0-9.]/g;
      $(`input[name='packageId']`).each(function() {
        if ($(this).prop("checked")) {
          let common = $(this).closest("tr").next().children();
          const isJIT = $(this).closest("tr").next()[0].getAttribute("data-platform").includes("Choice");
          if (!isJIT) {
            let eleList = common.eq(0).find("tr");
            let rightPrice = common.eq(1).text().replace(_reg, "");
            rightPrice = Number(rightPrice);
            let singleItem = eleList.length == 1;
            if (singleItem) {
              let leftPrice = eleList.find("p:contains('USD')").text().replace(_reg, "");
              leftPrice = Number(leftPrice);
              let finalPrice = leftPrice < rightPrice ? leftPrice : rightPrice;
              t.push(finalPrice);
            } else {
              eleList.each((i, e) => t.push($(e).find("p:contains('USD')").text().replace(_reg, "")));
            }
          }
          that.finalDeclareValues = t;
        }
      });
    }
    static fillValues() {
      let that = this;
      const [chsName, engName, weight] = ["狗衣服", "Dog Clothes", 50];
      $(`input[name="declaredValues"]`).each(function(index) {
        Utils.simulateInput($(this).get(0), that.finalDeclareValues[index]);
      });
      $(`input[name="nameChs"]`).each(function(index) {
        if ($(this).val() == "") Utils.simulateInput($(this).get(0), chsName);
      });
      $(`input[name="nameEns"]`).each(function(index) {
        if ($(this).val() == "") Utils.simulateInput($(this).get(0), engName);
      });
      $(`input[name="weights"]`).each(function(index) {
        let curVal = $(this).val();
        if (curVal == "" || curVal == 0) Utils.simulateInput($(this).get(0), weight);
      });
    }
  };
  __publicField(_Declare, "finalDeclareValues", []);
  let Declare = _Declare;
  class Summary {
    constructor(url) {
      this.curURL = url;
      if (Utils.isiPad() === false) {
        this.compute();
      }
      this.total();
      this.packageTypes();
      this.addGpsrTag();
    }
    /**
     * 判断当前url是否可以追踪物流信息。
     * @returns {boolean} - 如果可以追踪物流信息，则返回true，否则返回false。
     */
    ifCanTrack() {
      let ifTargetURL = this.curURL.includes("list.htm");
      if (ifTargetURL) {
        let state = Utils.getUrlKeyValuePairs(this.curURL, "state");
        if (state === "shipped") {
          return true;
        }
        return false;
      }
      return false;
    }
    // 统计订单件数
    compute() {
      let titleRows = document.querySelectorAll(".goodsId");
      titleRows.forEach((titleRow) => {
        let total = 0;
        let nextElement = titleRow.nextElementSibling;
        this.addFreightAndTrackElements(nextElement, titleRow);
        while (nextElement && !nextElement.classList.contains("goodsId")) {
          let numBoxes = nextElement.querySelectorAll('[class^="circularSpan"]');
          for (let numBox of numBoxes) {
            let num = parseInt(numBox.textContent);
            total += num;
          }
          nextElement = nextElement.nextElementSibling;
        }
        titleRow.insertAdjacentHTML("beforeend", `<h3 class='total-num'>${total}件</h3>`);
      });
    }
    addFreightAndTrackElements(contentRow, titleRow, total) {
      const baseURL = `https://csp.aliexpress.com/m_apps`;
      const operationDiv = $('<div class="operation-btns"></div>');
      let orderId = contentRow.querySelector(".tableOrderId a").innerText;
      const freightLink = $(`<a target='_blank' href='${baseURL}/logistic/create_ship_cn?trade_order_id=${orderId}'>查看运费</a>`);
      operationDiv.append(freightLink);
      let ifCanTrack = this.ifCanTrack();
      if (ifCanTrack) {
        const logisticsLink = $(`<a target='_blank' href='${baseURL}/logistics/tracking?tradeOrderId=${orderId}'>物流轨迹</a>`);
        operationDiv.append(logisticsLink);
      }
      $(titleRow).append(operationDiv);
    }
    total() {
      let total = 0;
      let pieceSpans = document.querySelector("#orderListTable").querySelectorAll('[class^="circularSpan"]');
      if (pieceSpans.length == 0) return;
      pieceSpans.forEach((pieceSpan) => {
        let num = parseInt(pieceSpan.textContent);
        total += num;
      });
      let existingTotal = document.querySelector(".total-count");
      if (existingTotal) {
        existingTotal.remove();
      }
      $("#allClassification").append(`<span class="total-count">Total: ${total} 件</span>`);
    }
    packageTypes() {
      let pkgs = document.querySelectorAll(".buyerSelectProvider");
      if (pkgs.length == 0) return;
      let economy = 0, saver = 0, standard = 0;
      pkgs.forEach((pkg) => {
        if (pkg.textContent.includes("Economy")) {
          economy++;
        } else if (pkg.textContent.includes("Saver")) {
          saver++;
        } else if (pkg.textContent.includes("Standard")) {
          standard++;
        }
      });
      let existingTotal = document.querySelector(".pkg-types");
      if (existingTotal) {
        existingTotal.remove();
      }
      $("#allClassification").append(`<span class="pkg-types">经济: ${economy}个  简易: ${saver}个  标准: ${standard}个</span>`);
    }
    addGpsrTag() {
      let titleRows = document.querySelectorAll(".goodsId");
      titleRows.forEach((titleRow) => {
        let nextElement = titleRow.nextElementSibling;
        let tag = $(nextElement).find('a[onclick^="dxmOrderDetail("]').next();
        let country = tag.closest("td").prev().children().last().text().replace(/「|」/g, "");
        let isGSPR = Utils.isGpsrCountry(country);
        if (isGSPR) {
          tag.append(`<span class="squareSpanOra">G</span>`);
        }
      });
    }
  }
  class LookDetail {
    constructor(responseTags) {
      this.DETAIL_PAGE_URL = `https://csp.aliexpress.com/apps/order/detail?orderId=`;
      this.detailTags = Utils.htmlParser(responseTags);
      this.main();
    }
    main() {
      var strongElements = this.detailTags.querySelectorAll("strong");
      strongElements.forEach((ele) => {
        let text = ele.textContent;
        if (text.includes("站点")) {
          if (text.includes("半托管")) {
            this.jump2AliOrderDetail(strongElements, "平台编号");
          } else {
            this.jump2AliOrderDetail(strongElements, "订单号");
          }
        }
      });
    }
    jump2AliOrderDetail(strongElements, splitText) {
      strongElements.forEach((viceEle) => {
        let orderNumTag = viceEle.textContent;
        if (orderNumTag.includes(splitText)) {
          let orderId = orderNumTag.split(splitText)[1].replace("：", "");
          let url = `${this.DETAIL_PAGE_URL}${orderId}`;
          $("#orderDetailClose1").click();
          window.open(url);
        }
      });
    }
  }
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._requestUrl = url;
    return originalOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(body) {
    const handleResponse = () => {
      if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
        const { _requestUrl: url, responseText: data } = this;
        if (!data) return;
        Declare.init();
        const delay = 50;
        const keywords = ["list.htm", "splitList.htm", "mergeList.htm", "searchPackage.htm"];
        if (keywords.some((u) => url.includes(u))) setTimeout(() => new Summary(url), delay);
        if (url.includes("showBatchCustoms.htm")) setTimeout(() => Declare.fillValues(), delay);
        if (url.includes("detail.htm")) setTimeout(() => new LookDetail(data), delay);
      }
    };
    this.addEventListener("readystatechange", handleResponse);
    return originalSend.apply(this, arguments);
  };

})();