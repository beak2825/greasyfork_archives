// ==UserScript==
// @name         测试脚本
// @version      5
// @description  测试脚本测试
// @author       Wind_DSA
// @match        https://www.vmall.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlasinfo.com.cn
// @grant        none
// @namespace https://www.vmall.com/*
// @downloadURL https://update.greasyfork.org/scripts/478366/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478366/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 当前浏览器url根据/分割成数组
var hrefArr = window.location.href.split("/");
// 如果链接数组包含product则进入商品抢购等待页
if (hrefArr.includes("product")) {
  console.log("进入商品页面");
  //监听页面即将开始按钮变成立即下单按钮触发
  let panicBuyingInterval = setInterval(() => {
    if (filterEl("立即购买", "div")) {
      var xd = filterEventEl("立即购买");
      if (xd) {
        console.log("点击立即购买");
        xd.click();
        clearInterval(panicBuyingInterval);
        return;
      }
      return;
    }
  }, 500);

  let popInterval = setInterval(() => {
    //   下单时如果按钮点击过早会出现活动未开始弹窗，以下方法为了监听弹窗。
    if (filterEl("知道了", "span")) {
      var hd = filterEventEl("知道了");
      if (hd) {
        hd.click();
        setTimeout(() => {
          var xd = filterEventEl("立即购买");
          if (xd) {
            xd.click();
            clearInterval(popInterval);
            return;
          }
        }, 500);
      }
    }
  }, 500);
} else if (hrefArr.includes("order")) {
  console.log("进入订单提交页面");
  // 页面元素全部加载完成在执行方法
  window.onload = function () {
    let submitInterval = setInterval(() => {
      console.log(filterEl("再试试", "span"))
      if (filterEl("再试试", "span")) {
        setTimeout(() => {
          var zss = filterEventEl("再试试");
          if (zss) {
            zss.click();
            console.log("点击再试试按钮");
          }
        }, getRandomDelay(500, 800));
      } else {
        var tj = filterEventEl("提交订单");
        if (tj) {
          tj.click();
          console.log("提交订单");
        }
      }
    }, 500);
  };
}
// 筛选是否有符合元素
function filterEl(elText, elName) {
  var spanElements = document.querySelectorAll(elName);
  return Array.from(spanElements).some(function (element) {
    return element.textContent === elText;
  });
}
// 筛选事件元素
function filterEventEl(elName) {
  var elementsWithOnClickAndSpanContent =
    document.querySelectorAll("div");
  for (var i = 0; i < elementsWithOnClickAndSpanContent.length; i++) {
    var element = elementsWithOnClickAndSpanContent[i];
    if (element.textContent.trim() === elName) {

      return element.children[0].children[0];
    }
  }
  return null;
}
// 生成随机数
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
