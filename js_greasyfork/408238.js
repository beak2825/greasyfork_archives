// ==UserScript==
// @name         京东历史价格走势图 by 京价保
// @namespace    京价保
// @version      0.2
// @description  在京东商品页面增加历史价格走势图
// @author       京价保
// @match        *://item.jd.com/*
// @match        *://re.jd.com/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.zaoshu.so
// @require      https://cdn.jsdelivr.net/npm/@antv/g2@4.0.14/dist/g2.min.js
// @require       https://greasyfork.org/libraries/GM_setStyle/0.0.15/GM_setStyle.js
// @downloadURL https://update.greasyfork.org/scripts/408238/%E4%BA%AC%E4%B8%9C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%B5%B0%E5%8A%BF%E5%9B%BE%20by%20%E4%BA%AC%E4%BB%B7%E4%BF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/408238/%E4%BA%AC%E4%B8%9C%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E8%B5%B0%E5%8A%BF%E5%9B%BE%20by%20%E4%BA%AC%E4%BB%B7%E4%BF%9D.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let styleNode = GM_setStyle({
    data: `
    .jjbPriceChart{
        position: static;
        float: left;
        width: 100%;
        background-color: #fff;
        border: 1px solid #eee;
    }

    .jjbPriceChart .title {
        font-size: 14px;
        line-height: 24px;
        height: 28px;
        padding: 6px 10px;
        background-color: #f7f7f7;
        border-bottom: 1px solid #eee;
    }

    .g2-tooltip{
        position: absolute;
        background: #ffffffe0;
        border: 1px solid #dededec2;
        padding: 1em 2em;
        min-width: 180px;
        transition: all 0.4s ease-out;
    }

    .g2-tooltip .promotions li{
        font-size: 12px;
        margin-bottom: 0.5em;
    }

    .g2-tooltip .g2-tooltip-list li{
        font-size: 14px;
        margin-bottom: 0.5em;
    }

    .g2-tooltip .tag{
        color: #df3033;
        background: 0 0;
        border: 1px solid #df3033;
        padding: 2px 3px;
        margin-right: 5px;
        display: inline-block;
        line-height: 16px;
    }

    .jjbPriceChart .provider {
        padding: 3px 10px;
        position: absolute;
        right: 5px;
        bottom: 5px;
    }

    #jjbPriceChart{
        width: 100%;
        background: #fff;
    }

    #disablePriceChart{
        float: right;
        padding: 0px 4px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
    }

    #jjbPriceChart .no_data,
    #jjbPriceChart .loading {
        text-align: center;
        padding: 20px;
        background-position-y: top;
        padding-top: 30px;
        margin-top: 10px;
    }

    .first_area_md {
        height: auto !important;
        position: relative;
    }

    .first_area_md .jjbPriceChart{
        margin-top: 20px;
    }

    .price_notice{
        display: none;
    }

    .utm_source-notice{
        text-align: center;
        background: #fdedd2;
        color: #947219;
        padding: 0.2em .6em;
    }

    .utm_source-notice .report{
        float: right;
        cursor: pointer;
        color: #cc1f1f;
        background: #fff;
        padding: 0px 10px;
        border-radius: 2px;
    }

    .reportUtmSource .weui-dialog{
        max-width: 500px;
        background: #f8f8f8;
    }

    #specialPromotion {
        width: 80%;
        display: inline-block;
        height: 22px;
        line-height: 24px;
    }

    .special-promotion-item{
        padding: 3px 10px;
        vertical-align: middle;
    }

    .special-promotion-item a{
        font-size: 14px;
        vertical-align: middle;
    }

    .special-promotion-item .icon{
        padding-right: 10px;
        float: left;
    }


    #specialPromotion .promotions{
        float: left;
        width: 80%;
    }

    #specialPromotion .controller{
        width: 20%;
        float: right;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 8px 0px;
    }

    #specialPromotion .controller .item__child {
        cursor: pointer;
        min-width: 12px;
        min-width: 1.2rem;
        min-height: 4px;
        min-height: 0.4rem;
        display: block;
        margin: 0 3px;
        border: 1px solid #ddd;
        background-color: #dddddd;
    }

    #specialPromotion .controller .item__child.on {
        background-color:  #7abd53;
    }

    #specialPromotion .controller .item__child:hover {
        background-color: #096
    }
  `,
  });

  let urlInfo = /(https|http):\/\/item.jd.com\/([0-9]*).html/g.exec(
    window.location.href
  );
  if (window.location.host == "re.jd.com") {
    urlInfo = /(https|http):\/\/re.jd.com\/cps\/item\/([0-9]*).html/g.exec(
      window.location.href
    );
  }
  let sku = urlInfo[2];

  console.log("sku", sku);

  let priceChartDOM = `
    <div class="jjbPriceChart">
      <h4 class="title">
        价格走势
        <select name="days">
          <option value="30">最近30天</option>
          <option value="60">最近60天</option>
          <option value="90">最近90天</option>
        </select>
        <div id="specialPromotion">
        </div>
        
      </h4>
      <div id="jjbPriceChart">
        <div class="ELazy-loading loading">加载中</div>
      </div>
      <span class="provider"><a href="https://blog.jjb.im/price-chart.html" target="_blank">由京价保提供</a></span>
    </div>
  `;
  if ($(".product-intro").length > 0) {
    $(".product-intro").append(priceChartDOM);
  }

  if ($(".first_area_md").length > 0) {
    $(".first_area_md").append(priceChartDOM);
  }

  function timestampToDateNumber(timestamp) {
    return new Date(timestamp).toISOString().slice(0, 10).replace(/-/g, "");
  }

  var slideIndex = 1;
  function showPromotions(n) {
    var i;
    var x = document.getElementsByClassName("special-promotion-item");
    slideIndex = n;
    if (n > x.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = x.length;
    }
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    $(`#specialPromotion .controller .item__child`).removeClass("on");
    setTimeout(() => {
      $(
        `#specialPromotion .controller .item__child:eq(${slideIndex - 1})`
      ).addClass("on");
    }, 10);
    console.log("showPromotions", n, slideIndex, x[slideIndex - 1]);
    if (x[slideIndex - 1]) {
      x[slideIndex - 1].style.display = "block";
    }
  }

  function dealWithData(data) {
    if (data.chart.length > 2) {
      $("#jjbPriceChart").html("");
      let specialPromotion = data.specialPromotion;
      let chart = new G2.Chart({
        container: "jjbPriceChart",
        autoFit: true,
        padding: [50, 50, 80, 50],
        height: 300,
      });
      chart.data(data.chart);
      chart.scale({
        timestamp: {
          type: "time",
          mask: "MM-DD HH:mm",
          range: [0, 1],
          tickCount: 5,
        },
      });
      chart.scale("value", {
        min: data.averagePrice ? data.averagePrice / 3 : 0,
        nice: true,
      });
      chart
        .line()
        .position("timestamp*value")
        .shape("hv")
        .color("key")
        .tooltip({
          fields: ["key", "value", "timestamp"],
          callback: (key, value, timestamp) => {
            const itemDate = timestampToDateNumber(timestamp);
            return {
              key,
              value: value,
              date: itemDate,
            };
          },
        });
      chart.tooltip({
        showCrosshairs: true, // 展示 Tooltip 辅助线
        shared: true,
        showTitle: true,
        customContent: (title, items) => {
          let itemDom = "";
          let promotionsDom = "";
          let promotions = [];

          items.forEach((item) => {
            promotions = data.promotionLogs.find(function (promotion) {
              return promotion.date == item.date;
            });
            itemDom += `<li style="color:${item.color}"><span class="price-type">${item.key}</span>: ${item.value} 元</li>`;
          });
          promotions &&
            promotions.detail &&
            promotions.detail.forEach((item) => {
              promotionsDom += `<li><span class="tag">${item.typeName}</span><span class="description">${item.description}</span></li>`;
            });
          return `<div class="g2-tooltip">
              <div class="g2-tooltip-title" style="margin-bottom: 4px;">${title}</div>
              <ul class="g2-tooltip-list">${itemDom}</ul>
              <ul class="promotions">${promotionsDom}</ul>
            </div>`;
        },
      });

      let specialPromotionDom = ``;
      specialPromotion &&
        specialPromotion.forEach((item) => {
          specialPromotionDom += `<div class="special-promotion-item"><a class="promotion-item" style="${
            item.style
          }" href="${item.url}" target="_break">${
            item.icon
              ? `<span class="icon"><img src="${item.icon}"/></span>`
              : ""
          }${item.title}</a></div>`;
        });
      let specialPromotionControllerDom = ``;
      specialPromotion &&
        specialPromotion.forEach((item, index) => {
          specialPromotionControllerDom += `<span class="item__child" data-index="${index}"></span>`;
        });
      $("#specialPromotion").html(`
        <div class="promotions">${specialPromotionDom}</div>
        <div class="controller">${specialPromotionControllerDom}</div>
      `);
      chart.render();
      setTimeout(() => {
        showPromotions(Math.floor(Math.random() * specialPromotion.length) + 1);
        $("#specialPromotion .controller .item__child").live(
          "click",
          function () {
            let index = $(this).data("index");
            console.log("index", index);
            showPromotions(index + 1);
          }
        );
      }, 50);

      setInterval(() => {
        showPromotions(Math.floor(Math.random() * specialPromotion.length) + 1);
      }, 30000);
    } else {
      $("#jjbPriceChart").html(`<div class="no_data">暂无数据</div>`);
    }
  }

  function getPriceChart(sku, days) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://api.zaoshu.so/price/${sku}/detail?days=${days}`,
      headers: {
        Referer: location.href,
        "User-agent": "Mozilla/4.0 (compatible) Greasemonkey",
      },
      onload: function (responseDetails) {
        dealWithData(JSON.parse(responseDetails.responseText));
      },
      onerror: function () {
        $("#jjbPriceChart").html(
          `<div id="retry" class="no_data">查询失败，点击重试</div>`
        );
        $("#retry").bind("click", () => {
          getPriceChart(sku);
        });
      },
    });
  }

  setTimeout(function () {
    getPriceChart(sku)
    $('.jjbPriceChart. select[name=days]').change(function () {
      getPriceChart(sku, $(this).val());
    });
  }, 1000)
})();
