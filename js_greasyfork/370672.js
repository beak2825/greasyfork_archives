// ==UserScript==
// @name         虾皮
// @namespace    https://greasyfork.org/zh-CN/scripts/370672-%E8%99%BE%E7%9A%AE
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://seller.shopee.tw/portal/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370672/%E8%99%BE%E7%9A%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/370672/%E8%99%BE%E7%9A%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

  //申明变量
  var product = document.getElementById("product-size-chart");

  var color;
  var size;
  var mainSKU;
  var skuPrice;
  var skuNumber;
  var lastSKUNode;

  var addSKUNode = function () {
    var svgArray = product.nextSibling.nextSibling.firstChild.firstChild.getElementsByTagName("svg");
    svgArray[svgArray.length - 1].parentNode.click();
  };

  var html = product.nextSibling.innerHTML;
  product.nextSibling.innerHTML = html + "<div id=\"fastSKU\" ><div>颜色：<input type=\"text\" id=\"color\">尺码：<input type=\"text\" id=\"size\"/>mainSKU:<input type=\"text\" id=\"mainSKU\"></div> 价格：<input type=\"text\" id=\"price\"/>数量：<input type=\"text\" id=\"number\"/><button id=\"fastSKUbutton\" type=\"button\">添加</button><button id=\"fnb\" type=\"button\">fnb</button></div>";
  //添加默认值
  document.getElementById("color").value = "黑色，白色";
  document.getElementById("size").value = "S,M,L,XL,XXL";
  document.getElementById("number").value = "100";
  //得到数据的方法
  var getdata = function () {
    color = document.getElementById("color").value;
    size = document.getElementById("size").value;
    mainSKU = document.getElementById("mainSKU").value;
    skuPrice = document.getElementById("price").value;
    skuNumber = document.getElementById("number").value;
    //测试用数据
    // color = "蓝色，红色,灰色";
    // size = "s,m,l，xl";
    // mainSKU = "00011";
    // skuPrice = "100";
    // skuNumber = "200";


    color = color.replace(/，/g, ",");
    size = size.replace(/，/g, ",");
  }

//  给最新的SKU节点赋值
  var fillingData = function (productName, sku, skuPrice, skuNumber) {
    var inputarray = lastSKUNode.getElementsByTagName("input");
    inputarray[0].value = productName;
    inputarray[1].value = sku;
    inputarray[2].value = skuPrice;
    inputarray[3].value = skuNumber;


  }
//  add方法
  var add = function () {
    var removeList = document.getElementsByClassName("repeater-remove");
    var removeLength = removeList.length;
    if (removeList.length > 0) {
      for (var i = 0; i < removeLength; i++) {
        removeList = document.getElementsByClassName("repeater-remove")
        removeList[0].click();
      }
    }


    getdata();
    var colorArray = color.split(",");
    var sizeArray = size.split(",");
    colorArray.forEach(function (value, index) {
      var realColor = trim(value);
      sizeArray.forEach(function (value) {

        var realSize = trim(value);
        var productName = realColor + " " + realSize;
        var sku = mainSKU + "0" + (index + 1) + "_" + realSize;
        addSKUNode();
        var skuNodeArray = product.nextSibling.nextSibling.firstChild.firstChild.getElementsByClassName("repeater");
        lastSKUNode = skuNodeArray[skuNodeArray.length - 1];
        fillingData(productName, sku, skuPrice, skuNumber);
      })
    })

  }
  //让input聚焦失焦模拟真实输入
  var fnb = function () {
    var skuNodeList = product.nextSibling.nextSibling.firstChild.firstChild.getElementsByClassName("repeater");
    for (var i = 0; i < skuNodeList.length; i++) {
      var iputList = skuNodeList[i].getElementsByTagName("input");
      for (var j = 0; j < iputList.length; j++) {
        iputList[j].focus();
        iputList[j].blur();
      }
      ;
    }

  }
//  去空格方法
  function trim(str){
    return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
  }
//给添加按钮绑定方法
  var b = document.getElementById("fastSKUbutton");
  b.onclick = add;

  var fnbb = document.getElementById("fnb");
  fnbb.onclick = fnb;

})();