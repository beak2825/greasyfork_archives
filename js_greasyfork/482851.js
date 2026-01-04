// ==UserScript==
// @name         淘宝购物车信息获取
// @namespace    http://tampermonkey.net/
// @version      0.61
// @description  Get selected items in Taobao cart
// @author       You
// @match        https://cart.taobao.com/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482851/%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482851/%E6%B7%98%E5%AE%9D%E8%B4%AD%E7%89%A9%E8%BD%A6%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log(`Title: `);
  // 创建一个按钮
  let button = document.createElement("button");
  button.textContent = "Get Cart Info";
  button.style.position = "fixed";
  button.style.top = "0";
  button.style.right = "0";
  button.style.zIndex = "9999";
  button.style.fontSize = "20px";
  // button 美化
  button.style.padding = "10px";
  button.style.border = "none";
  button.style.backgroundColor = "#f40";
  button.style.color = "#fff";
  button.style.cursor = "pointer";
  button.style.outline = "none";

  document.body.appendChild(button);
  // json
  let json = {
    items: [],
  };
  // 添加点击事件监听器
  button.addEventListener("click", function () {
    // 获取已经勾选的商品
    let selectedItems = document.querySelectorAll(".trade-cart-item-info-checked");

    // 遍历每一个商品
    for (let item of selectedItems) {
      // 判断是否为空，如果为空则跳过
      // if (
      //   item.parentNode.parentNode.parentNode.parentNode.querySelector(
      //     ".item-pic.J_ItemPic.img-loaded > a"
      //   ) === null
      // ) {
      //   // 跳过
      //   continue;
      // }
      // 获取商品名称
      let title = item
        .querySelector(".trade-cart-item-detail> div > a")
        .getAttribute("title");

      // 获取商品url
      let url = item.querySelector(".trade-cart-item-detail> div > a").getAttribute("href");
            console.log(
       title,url
      );
      // img url
      let img_url = item.querySelector(".trade-cart-item-detail> a > img").src;

      
      // 类型  .trade-cart-item-info-checked > div > div.trade-cart-item-sku.sku--amddnLro > div > div
          let cate = item.querySelector(".trade-cart-item-sku > div > div").textContent.trim();

      // let cate = item.parentNode.parentNode.parentNode.parentNode.querySelector(
      //   ".item-props.item-props-can"
      // );
      // // 遍历类型中的每一个属性 sku-line
      // let cate_str = "";
      // if (cate) {
      //   for (let cate_item of cate.querySelectorAll(".sku-line")) {
      //     cate_str += cate_item.textContent.trim() + "; ";
      //   }
      // }
      //单价  J_Price price-now 的文本内容
      var elements = item.querySelectorAll(".trade-price-container");  
      if (elements.length > 0) {  
          // 使用 length - 1 来获取最后一个元素的索引  
          var priceElement = elements[elements.length - 1];  
        
          // 假设你想获取这个元素的文本内容  
          // var content = lastElement.textContent || lastElement.innerText; // 对于IE浏览器，可能需要innerText  
        
          // console.log(content);  
      } else {  
          console.log("没有找到匹配的元素");  
      }

      let price = priceElement.textContent.trim().replace("优惠价","").replace("￥","");
      
      //数量 text text-amount J_ItemAmount 的value
      let num = item.querySelector(
       " .trade-cart-item-quantity > div > input "
      ).value;
// console.log(value);
      // 总价 J_ItemSum number 的文本内容
      let total = price*num;
      // 输出商品信息
      console.log(
        `Title: ${title} URL: ${url} img_url: ${img_url} cate: ${cate} price: ${price} num: ${num} total: ${total}`
      );
      // 添加到json
      json.items.push({
        title: title.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "-"),
        url: url,
        img_url: img_url,
        cate: cate.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]/g, "-"),
        price: price,
        num: num,
        total: total,
      });
    }
    // json 去除重复
    let json_items = json.items;
    json.items = [];
    for (let item of json_items) {
      let flag = true;
      for (let item2 of json.items) {
        if (item.cate === item2.cate && item.title === item2.title) {
          flag = false;
          break;
        }
      }
      if (flag) {
        json.items.push(item);
      }
    }

    console.log(JSON.stringify(json));
    // 保存到剪切板
    GM_setClipboard(JSON.stringify(json), "text");
    // 清空变量
    json = {
      items: [],
    };
  });
  // 合并生成json
  // 输出json
})();

