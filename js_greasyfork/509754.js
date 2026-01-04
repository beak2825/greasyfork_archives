// ==UserScript==
// @name         本地-通途价格检查
// @namespace    http://maxpeedingrods.cn/
// @version      1.0.2
// @description  检查Listing价格是否符合要求
// @license      No License
// @author       Knight
// @match        https://listing.tongtool.com/online/aliexpress/info.htm?listingId=*
// @match        https://listing.tongtool.com/draft/aliexpress/info.htm?id=*
// @match        *://172.16.13.158:18001/*
// @match        *://tlh.maxpeedingrods.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/509754/%E6%9C%AC%E5%9C%B0-%E9%80%9A%E9%80%94%E4%BB%B7%E6%A0%BC%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/509754/%E6%9C%AC%E5%9C%B0-%E9%80%9A%E9%80%94%E4%BB%B7%E6%A0%BC%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

let keywordsCheckMsg = "";
let keywordsCheckSuccess = false;
let priceCheckMsg = "";
let priceCheckSuccess = false;

function start() {
  //创建检查按钮
  createCheckButton();
}

/**
 * 创建检查按钮
 */
function createCheckButton() {
  let button = document.createElement("button");
  button.className = "baseBtn";
  button.innerText = "关键词&价格检查";
  button.id = "knight-price-check";
  button.style.width = "120px";
  button.style.backgroundColor = "#0089cf";
  button.style.color = "#ffffff";
  button.style.border = "none";
  button.style.height = "30px";
  button.style.cursor = "pointer";
  button.style.marginLeft = "10px";

  button.onclick = function () {
    /*---------------关键词检查------------------*/
    //获取标题
    let title = $("table:first").first().find(".textbox-value").val();

    //获取属性
    let dataOne = $(
      "#rootEle > div > table > tbody > tr:nth-child(5)  table"
    ).find("input[type=text]");
    let dataTwo = [];
    dataOne.each(function () {
      dataTwo.push($(this).val());
    });

    //获取PC描述
    let oIframe = document.getElementById("ueditor_0");
    let pcDesc =
      oIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
    //console.log("pcDesc", pcDesc);
    //获取移动端描述
    let mobileDesc = $(
      "#rootEle > div > table > tbody > tr > td > div > div > div:nth-child(5) > table"
    ).html();
    //console.log("mobileDesc", mobileDesc);
    let desc = dataTwo + pcDesc + mobileDesc;
    //console.log("desc", desc);
    postCheckKeywords(title, desc);

    return false;
  };

  document.querySelector("#btnbar").append(button);
}

function priceCheckBefore() {
  console.log("--price--before----");

  let areaPrices = [];

  //获取区域价
  let areaPriceTr = $(
    "#rootEle > div > table > tbody > tr:nth-child(5) > td > div:nth-child(2) > div.mt10.bor-blue > div > table > tbody > tr"
  );
  areaPriceTr.each(function () {
    // 获取第二列数据并过滤括号及其中的内容
    let country = $(this)
      .find("td:eq(1)")
      .text()
      .replace(/\(.*\)/, "")
      .trim();

    // 获取第三列数据并提取SKU的值
    let lineSkuStr = $(this).find("td:eq(2) input").val();
    console.log("area-sku:" + lineSkuStr);
    let atIndex = lineSkuStr.indexOf("@");
    let skuMatch = lineSkuStr.substring(atIndex + 1);
    let sku = skuMatch ? skuMatch : "";

    // 获取第五列数据并提取input中的值（假设这里已经有具体的值）
    let priceInputValue = $(this).find("td:eq(4) input").val();

    // 整合数据
    if (sku.length > 0) {
      areaPrices.push([country, sku, priceInputValue]);
    }
  });

  //如果无区域价，则获取店铺价
  if (areaPrices.length == 0) {
    //获取店铺SKU和售价，作为CN价
    let storeSkuStr = $(
      "#baseInfoDiv > div > div:nth-child(9) > span > span > input"
    ).val();
    console.log("store-sku:" + storeSkuStr);
    let atIndex = storeSkuStr.indexOf("@");
    let skuMatch = storeSkuStr.substring(atIndex + 1);
    let storeSku = skuMatch ? skuMatch : "";

    let storePrice = $(
      "#baseInfoDiv > div > div:nth-child(11) > span > span.textbox.numberbox > input.textbox-text.validatebox-text"
    ).val();
    if (storeSku.length > 0) {
      areaPrices.push(["CN", storeSku, storePrice]);
    }
  }

  return areaPrices;
}

/**
 * 检查价格
 */
function priceCheck(areaPrices) {
  const myKey = "tongtool-listing-helper-access-token";
  let myValue = GM_getValue(myKey);

  if (!myValue || myValue == "") {
    $.messager.alert("失败", "未获取到token，请先访问刊登助手", "error");
    return false;
  }

  //去除2边的双号引
  myValue = myValue.slice(1, -1);

  if (areaPrices.length <= 0) {
    $.messager.alert("失败", "未从页面上获取到价格", "error");
    return false;
  }

  let sku = areaPrices[0][1];

  let url =
    "https://tlh.maxpeedingrods.cn:9070/api/v1/aliexpress/priceCheck/getPrice?sku=" +
    sku;
  let timeout = 60 * 1000;
  let token = "Bearer " + myValue;

  GM_xmlhttpRequest({
    method: "GET",
    url: url,
    timeout: timeout,
    headers: { Authorization: token },
    onload: function (response) {
      console.log(response);
      let result = JSON.parse(response.responseText);

      if (result.code != 200) {
        //$.messager.alert('失败',"调用价格检查接口失败："+result.message,'error');
        priceCheckMsg = "调用价格检查接口失败：" + result.message;
      } else {
        if (result.data.length <= 0) {
          //$.messager.alert('成功',"请求成功，但未获取到价目表价格",'info');
          priceCheckMsg = "请求成功，但未获取到价目表价格";
          priceCheckSuccess = true;
        } else {
          //过滤组合SKU价格
          let filteredData = [];
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].sku == result.data[i].sku_name) {
              filteredData.push(result.data[i]);
            }
          }

          if (filteredData.length <= 0) {
            //$.messager.alert('成功',"请求成功，但过滤组合SKU之后无价目表价格",'info');
            priceCheckMsg = "请求成功，但过滤组合SKU之后无价目表价格";
            priceCheckSuccess = true;
          } else {
            //对比价格
            areaPrices = areaPricesLocationFormat(areaPrices);
            let diffResult = areaPricesDiff(areaPrices, filteredData);
            let diffMessage = areaPricesDiffMessage(diffResult);

            //$.messager.alert('成功',diffMessage,'info');
            //$(".messages-body").css('overflow','scroll');

            priceCheckMsg = diffMessage;
            priceCheckSuccess = true;
          }
        }
      }

      showTipMessage();
    },
    onerror: function (e) {
      console.log(e);
      alert("检查异常：" + e.message);
    },
    ontimeout: function () {
      alert("检查超时");
    },
  });
}

function showTipMessage() {
  let msg =
    "关键词检查结果：<br/>" +
    keywordsCheckMsg +
    "<br/><br/>" +
    "价格检查结果：<br/>" +
    priceCheckMsg;

  if (!keywordsCheckSuccess || !priceCheckSuccess) {
    $.messager.alert("失败", msg, "error");
  } else {
    $.messager.alert("成功", msg, "info");
  }
  $(".messages-body").css("height", "auto");
  $(".messages-body").css("overflow", "scroll");
}

//显示消息
function areaPricesDiffMessage(diffResult) {
  let msg = "";
  for (let key in diffResult) {
    if (diffResult.hasOwnProperty(key)) {
      msg +=
        "【" +
        key +
        "】价格 " +
        diffResult[key][0] +
        " 低于底价：" +
        diffResult[key][1] +
        "<br/>";
    }
  }

  return msg == "" ? "success" : msg;
}

//对比价格
function areaPricesDiff(areaPrices, priceData) {
  let diffResult = [];
  for (let i = 0; i < areaPrices.length; i++) {
    for (let j = 0; j < priceData.length; j++) {
      let diffFee = 0;

      if (areaPrices[i][0] == "CN") {
        //CN需要减去运费
        if (priceData[j].warehouse_country_code == areaPrices[i][0]) {
          if (priceData[j].rate > 0) {
            let shipFee = ceilDecimal(
              (Number(priceData[j].cny_total_fee) +
                Number(priceData[j].cny_remote_fee)) /
                Number(priceData[j].rate)
            );
            diffFee = ceilDecimal(
              Number(priceData[j].approval_price) - Number(shipFee)
            );
          } else {
            diffFee = 0;
          }
        }
      } else {
        //非CN直接对比
        if (priceData[j].warehouse_country_code == areaPrices[i][0]) {
          diffFee = ceilDecimal(Number(priceData[j].approval_price));
        }
      }

      let priceArea = areaPrices[i][0];
      let priceOri = Number(areaPrices[i][2]);
      let priceMin = diffFee;
      //Listing价格，低于底价，则提醒
      if (priceOri < priceMin) {
        diffResult[priceArea] = [priceOri, priceMin];
      }
    }
  }
  console.log(diffResult);
  return diffResult;
}

function ceilDecimal(number, decimalPlaces = 2) {
  if (isNaN(number)) {
    console.error("Invalid number provided to ceilDecimal.");
    return NaN;
  }
  const factor = Math.pow(10, decimalPlaces);
  return Math.ceil(number * factor) / factor;
}

//将通途里的发货地，映射为对应国家简称
function areaPricesLocationFormat(areaPrices) {
  return areaPrices.map(function (item) {
    switch (item[0]) {
      case "United States":
        item[0] = "US";
        break;
      case "France":
        item[0] = "FR";
        break;
      case "Vietnam":
        item[0] = "VN";
        break;
      case "SPAIN":
        item[0] = "ES";
        break;
      case "Italy":
        item[0] = "IT";
        break;
      case "土耳其":
        item[0] = "TR";
        break;
      case "墨西哥":
        item[0] = "MX";
        break;
      case "加拿大":
        item[0] = "CA";
        break;
    }
    return item;
  });
}

/**
 * 查询检测结果
 */
function postCheckKeywords(title, desc) {
  let url =
    "https://ebay.maxpeedingrods.cn/index.php/ajax/checkBrandKeywords?key=123";
  let timeout = 60 * 1000;
  let myData = new FormData();
  myData.append("title", title);
  myData.append("desc", desc);

  GM_xmlhttpRequest({
    method: "POST",
    url: url,
    timeout: timeout,
    data: myData,
    onload: function (response) {
      console.log(response);
      let result = JSON.parse(response.responseText);

      if (result.status == 0) {
        //$.messager.alert('失败',result.info,'error');
        keywordsCheckMsg = result.info;
        keywordsCheckSuccess = false;
      } else {
        //$.messager.alert('成功',result.info,'info');
        keywordsCheckMsg = result.info;
        keywordsCheckSuccess = true;
      }

      priceCheck(priceCheckBefore());
    },
    onerror: function (e) {
      console.log(e);
      alert("检查异常：" + e.message);
    },
    ontimeout: function () {
      alert("检查超时");
    },
  });
}

function waitForElement(selector) {
  var element = $(selector); // 获取目标元素

  if (element.length > 0) {
    // 若元素已经存在于DOM中，则直接执行相应代码
    start();
  } else {
    setTimeout(function () {
      // 否则，每隔1000ms重新查找该元素，直到找到为止
      waitForElement(selector);
    }, 1000);
  }
}

(function () {
  "use strict";

  // 读取 localStorage 数据
  const myKey = "tongtool-listing-helper-access-token";
  const myValue = localStorage.getItem(myKey);
  if (myValue) {
    // 存储数据到 Tampermonkey 的存储中
    GM_setValue(myKey, myValue);
    console.log(`Stored ${myKey}: ${myValue} in Tampermonkey storage`);
  }

  $(document).ready(function () {
    waitForElement(
      "#rootEle > div  table > tbody > tr:nth-child(1) > td > div.mb10.detail-max-width > div > div:nth-child(2) > span:nth-child(1) > span"
    );
  });
})();