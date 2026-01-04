// ==UserScript==
// @name         苏宁客服助手
// @namespace    http://tampermonkey.net/
// @description  用于在产品侧栏显示产品的参数，并计算当前的活动的到手价格，目前只适配于冰箱和冷柜
// @author       kjl-rabbit
// @include      *//product.suning.com/*
// @version      0.54
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375298/%E8%8B%8F%E5%AE%81%E5%AE%A2%E6%9C%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375298/%E8%8B%8F%E5%AE%81%E5%AE%A2%E6%9C%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  "use strict";
  var cShopBoxDiv = document.getElementById("cshopBox");
  // var proinfoMainDiv = document.getElementById("proinfoMain");
  var proinfoSide = document.querySelector(".proinfo-side-inner");
  cShopBoxDiv.id = "paraBox";
  // proinfoMainDiv.style.position = "static";
  var fragment = document.createDocumentFragment();
  proinfoSide.style.display = "none";
  // cShopBoxDiv.style.fontSize = "13px";
  var model = getPara("001360"); //型号
  var modelName = model.replace(/BCD-/g, ""); //冰箱简称
  function getPara(code) {
    let para = document.querySelector('[parametercode="' + code + '"] .val');
    return para ? para.innerHTML : "";
  }
  function createPara(name, para, text, unit) {
    if (text !== "" && para !== "") {
      name += "：";
      para = unit ? para + unit : para;
      let p = document.createElement("p");
      let span = document.createElement("span");
      p.innerHTML = name;
      span.innerHTML = para;
      //span.style.display = "inline-block";
      fragment.appendChild(p);
      p.appendChild(span);
      if (text !== undefined) {
        p.style.cursor = "pointer";
        p.onclick = function() {
          GM_setClipboard(text, "text");
          span.innerHTML = "复制成功";
          p.style.cssText =
            "color: white; cursor: pointer; background-color: green";
          function reset() {
            span.innerHTML = para;
            p.style.cssText = "cursor: pointer;";
          }
          let t = setTimeout(reset, 800);
        };
      }
    } else {
      return false;
    }
  }
  function addPara() {
    let consumption = getPara("012289") //能耗（冰箱/冷柜）
      ? getPara("012289").replace(/千瓦时/g, "") //冰箱能耗
      : getPara("000975").replace(/千瓦时/g, ""); //冷柜能耗
    let noise = getPara("001896").replace(/db|分贝/g, ""); //噪音
    let material = getPara("000822"); //材质
    let launchDate = getPara("001012"); //上市日期
    let dimensions = getPara("001240"); //产品尺寸
    let dimensionSplit = dimensions.replace(/毫米/, "").split(/\*|×/);
    let width = dimensionSplit[0] / 10;
    let depth = dimensionSplit[1] / 10;
    let height = dimensionSplit[2] / 10;
    let packDimensions = getPara("008092"); //包装尺寸
    let refrigeratingCapacity = getPara("000976"); //冷冻能力
    let fridgeCapacity = getPara("000769"); //冷藏室容量
    let freezerCapacity = getPara("000771"); //冷冻室容量
    let vcCapacity = getPara("000112"); //变温室容量
    let refrigeratingCapacityText =
      refrigeratingCapacity.replace(/千克/, "") > 6
        ? `这款的冷冻力是${refrigeratingCapacity}的哦，制冷速度是非常快的`
        : `这款的冷冻力是${refrigeratingCapacity}的，制冷速度是比较快的哦`;
    let noiseText = (function() {
      if (noise == 35) {
        return `这款是我们店最静音的冰箱之一，噪音只有${noise}分贝`;
      } else if (noise < 37) {
        return `这款的噪音是非常小的哦，只有${noise}分贝`;
      } else if (noise < 40) {
        return `这款的噪音是很小的哦，只有${noise}分贝`;
      } else if (noise < 43) {
        return `这款的噪音是比较小的哦，只有${noise}分贝`;
      } else {
        return `这款是商用冷柜，噪音是${noise}分贝，噪音是比较大的，家用的话不建议买这款哦`;
      }
    })();
    let dateReg = /(\d{4})(?:年|\-|\/|\.)?(\d{1,2})?(?:月|\-|\/|\.)?(\d{1,2})?(?:号|日)?/;
    function dateConvert(match, p1, p2, p3, offset, str) {
      if (p3) {
        p3 = p3.replace(/^0/, "");
        return `${p1}年${p2}月${p3}日`;
      } else if (p2) {
        p2 = p2.replace(/^0/, "");
        return `${p1}年${p2}月`;
      } else if (p1) {
        return `${p1}年`;
      } else {
        return "没写日期";
      }
    }
    launchDate = launchDate.replace(dateReg, dateConvert);
    createPara("型号", model, modelName);
    createPara(
      "能耗",
      consumption,
      `这款的综合耗电量是${consumption}千瓦时的，也就是每天${consumption}度电`,
      "千瓦时"
    );
    createPara("噪音", noise, noiseText, "分贝");
    createPara("材质", material, `这款的面板材质是${material}的哦`);
    createPara("上市日期", launchDate, `这款是${launchDate}上市的哦`);
    createPara("冷冻力", refrigeratingCapacity, refrigeratingCapacityText);
    createPara(
      "产品尺寸",
      dimensions,
      `${modelName}这款的尺寸（宽 深 高）是${dimensions}的哦`
    );
    createPara(
      "包装尺寸",
      packDimensions,
      `亲亲，这款的包装尺寸（宽 深 高）是${packDimensions}的哦`
    );
    createPara(
      "冷藏室容积",
      fridgeCapacity,
      `这款冷藏室的容量是${fridgeCapacity}的哦`
    );
    createPara(
      "冷冻室容积",
      freezerCapacity,
      `这款冷冻室的容量是${freezerCapacity}的哦`
    );
    createPara("变温室容积", vcCapacity, `这款变温室的容量是${vcCapacity}的哦`);
    createPara("宽度", width, `这款的宽度是${width}厘米`, "厘米");
    createPara("深度", depth, `这款的深度是${depth}厘米`, "厘米");
    createPara("高度", height, `这款的高度是${height}厘米`, "厘米");
    cShopBoxDiv.appendChild(fragment);
  }
  function displayPrice() {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let button = document.createElement("button");
    div.style.paddingTop = "50px";
    p.style.cssText =
      "display: inline-block; font-size: 25px; color: red; cursor: pointer;";
    button.innerHTML = "更新";
    fragment.appendChild(div);
    fragment.appendChild(p);
    fragment.appendChild(button);

    function getPrice() {
      let addCartText = document.querySelector("#addCart").textContent;
      let listPrice = document
        .getElementsByClassName("mainprice")[0]
        .innerHTML.replace(/[^\d]*(\d+).*/g, "$1");
      let numListPrice = +listPrice;
      switch (addCartText) {
        case "支付定金": {
          //预售活动
          let deposit = document
            .getElementsByClassName("small-price")[0]
            .innerHTML.replace(/[^\d]*(\d+).*/g, "$1"); //定金
          let fullPayment = document
            .getElementsByClassName("small-price")[1]
            .innerHTML.replace(/[^\d]*(\d+).*/g, "$1"); //尾款
          let numDeposit = +deposit;
          let numFullPayment = +fullPayment;
          let allPrice = numDeposit + numFullPayment;
          let startTime = document
            .querySelector("#balanceTime dd")
            .innerHTML.replace(/开始：(\d+月\d+日)0时0分0秒/, "$1"); //尾款支付日期
          let nodeSendTime = document.querySelector("#sendTime dd");
          let sendTimeText = nodeSendTime.innerHTML.replace(/发货/, "统一发货"); //预计发货日期
          let promotionText = `${modelName}这款现在是预售活动哦，现在先付定金，${startTime}付尾款，${sendTimeText}。
${deposit}元定金加上尾款${fullPayment}元，到手价一共${allPrice}元`;
          updatePrice(allPrice, promotionText, "预售活动");
          break;
        }
        case "立即预约": {
          let promotionDescText = document.getElementById("promotionDesc")
            .innerHTML;
          let flashSalePrice = promotionDescText.replace(
            /.*(?:不高于|到手仅|到手价)(\d+).*/,
            "$1"
          ); //从店招获取抢购价格
          let newTime = promotionDescText.replace(
            /.*号(\d+\-\d+点)(?:不高于|到手仅|到手价|价格).*/,
            "$1"
          );
          let buyTimeNodes = document.querySelectorAll("#buyTime dd");
          let buyTimeStart = buyTimeNodes[0].innerHTML.replace(
            /.*日(\d+)时.*/,
            "$1点"
          ); //从抢购流程获取预约时间
          let buyTimeEnd = buyTimeNodes[1].innerHTML.replace(
            /.*日(\d+)时.*/,
            "$1点"
          );
          let buyDate = buyTimeNodes[0].innerHTML.replace(
            /.*月(\d+)日.*/,
            "$1号"
          );
          if (newTime !== promotionDescText) {
            buyTimeStart = newTime.replace(/^(\d+)\-.*/, "$1点");
            buyTimeEnd = newTime.replace(/.*\-(\d+)\点$/, "$1点");
          }
          function addPrice() {
            if (!/\W+/.test(flashSalePrice)) {
              if (buyTimeStart == buyTimeEnd) {
                //无定金预售活动
                let promotionText = `${modelName}这款参加的是${buyDate}的无定金预售活动，现在直接点击预定，等${buyDate}付尾款就好了哦，${buyDate}的活动价是${flashSalePrice}元的。`;
                updatePrice(flashSalePrice, promotionText, "无定金预售活动");
              } else {
                //抢购活动，抢购价从店招获取
                let promotionText = `${modelName}这款参加的是${buyDate}的抢购活动，${buyDate}${buyTimeStart}到${buyTimeEnd}之间价格预计是${flashSalePrice}元（价格可能更低）；
过了${buyTimeEnd}后价格可能会有调整的，而且这款库存有限，所以建议亲亲越早下单越好哦~`;
                updatePrice(flashSalePrice, promotionText, "抢购活动");
              }
            } else {
              //抢购活动，抢购价未知
              let promotionText = `${modelName}这款参加的是${buyDate}的抢购活动，抢购时间是${buyDate}${buyTimeStart}到${buyTimeEnd}。
但这款现在的抢购活动价还没有公布呢，要等到抢购活动开始的时候才能知道的哦~`;
              updatePrice("未知", promotionText, "抢购活动");
            }
          }
          addPrice();
          break;
        }
        case "加入购物车": {
          let voucherBox = document.getElementById("voucherBox").textContent;
          let freeCouponDisplay = document.getElementById("freeCouponBox").style
            .display;
          let voucherTitleDisplay = document.getElementById("voucherTitle")
            .style.display;
          let manjianReg = /满1000元减100元;满2000元减300元;满4000元减600元;满7000元减1000元;满10000元减1500元/;
          if (voucherTitleDisplay == "block") {
            if (/每\d+元减\d+元/.test(voucherBox)) {
              //满减活动
              let dividend = voucherBox.replace(/每(\d+)元减\d+元.*/, "$1");
              let multi = voucherBox.replace(/每\d+元减(\d+)元.*/, "$1");
              if (numListPrice > dividend) {
                let priceSave = Math.floor(numListPrice / dividend) * multi;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满${dividend}减${multi}元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else {
                let promotionText = `${modelName}这款现在是满减活动，但这款因为还没有满${dividend}元，所以还是原价${numListPrice}元`;
                updatePrice(numListPrice, promotionText, "未达到满减要求");
              }
            } else if (/满3000元减300元/.test(voucherBox)) {
              if (numListPrice > 3000) {
                let priceSave = 300;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满3000减300元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              }
            } else if (manjianReg.test(voucherBox)) {
              if (numListPrice > 10000) {
                let priceSave = 1500;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满10000减1500元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else if (numListPrice > 7000) {
                let priceSave = 1000;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满8000减1000元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else if (numListPrice > 4000) {
                let priceSave = 600;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满4000减600元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else if (numListPrice > 2000) {
                let priceSave = 300;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满2000减300元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else if (numListPrice > 1000) {
                let priceSave = 100;
                let numNowPrice = numListPrice - priceSave;
                let promotionText = `${modelName}这款现在是满减活动，满1000减100元，购买就立减${priceSave}元，到手价${numNowPrice}元`;
                updatePrice(numNowPrice, promotionText, "满减活动");
              } else {
                let promotionText = `${modelName}这款现在是没有满1000元，所以没有参与现在的满减活动，到手价${numListPrice}元`;
                updatePrice(numListPrice, promotionText, "不参加满减活动");
              }
            }
          } else if (freeCouponDisplay == "block") {
            //有没有优惠券
            let freePriceStyle = document.getElementById("discountPriceValue")
              .style.display;
            if (freePriceStyle == "none") {
              //无优惠券
              let promotionText = `${modelName}这款没有可用的活动优惠券哦，还是原价${listPrice}元的`;
              updatePrice(listPrice, promotionText, "无可用优惠券");
            } else {
              //有优惠券
              let freePrice = document
                .querySelector("#discountPriceValue i")
                .innerHTML.replace(/(\d+)\.00元/, "$1");
              let numFreePrice = +freePrice;
              let numNowPrice = numListPrice - numFreePrice;
              let promotionText = `${modelName}这款在页面上有优惠券可以领哦，领券后优惠${freePrice}元，到手价就是${numNowPrice}元`;
              // let promotionText2 = `手机端的领券位置在【家电放心购】红字的下面哦`
              updatePrice(numNowPrice, promotionText, "领优惠券");
            }
          } else {
            //原价
            let promotionText = `${modelName}这款现在没有活动哦，还是原价${listPrice}元`;
            updatePrice(listPrice, promotionText, "原价");
          }
          break;
        }
        default:
          break;
      }
    }
    function updatePrice(nowPrice, promotionText, salesPromotion) {
      div.textContent = salesPromotion;
      nowPrice = /\d+/.test(nowPrice) ? nowPrice + "元" : nowPrice;
      p.textContent = nowPrice;
      if (nowPrice !== undefined) {
        p.onclick = function() {
          GM_setClipboard(promotionText, "text");
          p.innerHTML = "复制成功";
          p.style.cssText =
            "display: inline-block; font-size: 20px; color: white; cursor: pointer; background-color: green";
          function reset() {
            p.innerHTML = nowPrice;
            p.style.cssText =
              "display: inline-block; font-size: 25px; color: red; cursor: pointer;";
          }
          let t = setTimeout(reset, 800);
        };
      }
    }
    document.addEventListener("readystatechange", getPrice);
    button.onclick = getPrice;
    cShopBoxDiv.appendChild(fragment);
  }
  addPara();
  displayPrice();
})();
