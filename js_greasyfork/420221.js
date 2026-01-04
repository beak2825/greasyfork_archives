// ==UserScript==
// @name        安居客二手房
// @namespace   Violentmonkey Scripts
// @match       https://wuhan.anjuke.com/sale/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/1/14 下午1:26:45
// @downloadURL https://update.greasyfork.org/scripts/420221/%E5%AE%89%E5%B1%85%E5%AE%A2%E4%BA%8C%E6%89%8B%E6%88%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/420221/%E5%AE%89%E5%B1%85%E5%AE%A2%E4%BA%8C%E6%89%8B%E6%88%BF.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var list = $('.sale-left ul#houselist-mod-new li');
    var arrayJson = new Array() 
    $.each( list, function( key, val ) {
      var info = $(val).children('div.house-details')[0];
      var priceInfo = $(val).children('div.pro-price')[0];
      var url = $(info).children('div.house-title').children('a').attr('href');
      var title = $(info).children('div.house-title').children('a').attr('title');
      var positions = $(info).children('div.details-item:eq(1)').children('span').attr('title').split(/\s+/);
      var houseinfos = $(info).children('div.details-item:eq(0)').text().split('|');
      var tags = $(info).children('div.tags-bottom').children('span').text();
      var price = $(priceInfo).children('span:first').text();
      var unitprice = $(priceInfo).children('span:last').text();
      price = priceConvert(price);
      unitprice = unitprice.replace('元/m²','');
      var data = {
        url :url,
        title:title,
        lpName:strTrim(positions[0]),
        pos:strTrim(positions[1].split('-')[0]),
        tag:tags,
        totalprice:price,
        unitprice:unitprice,
        pushDate:-1,
        follow:0
        
      }
      houseinfoeach(data,houseinfos)
      arrayJson.push(data);
      
    });
    save(arrayJson ,'result.json');
    
  // 等待3 秒
  setTimeout(
  function() 
  {
    if($('.multi-page a:last').hasClass('aNxt')){
      // 下一页
      window.location.href = $('.multi-page a.aNxt:last').attr('href');
    }
  }, 3000);
})();

function priceConvert(price){
  var i = price.indexOf('万');
  if(i >= 0){
    var temp = price.substr(0,i) * 10000
    return temp;
  }
  return price;
}

// 保存为json文件
function save(data, filename){
  if(!data) {
  console.error('Console.save: No data')
  return;
  }
  if(!filename) filename = 'console.json'
  if(typeof data === "object"){
  data = JSON.stringify(data, undefined, 4)
  }
  var blob = new Blob([data], {type: 'text/json'}),
  e = document.createEvent('MouseEvents'),
  a = document.createElement('a')
  a.download = filename
  a.href = window.URL.createObjectURL(blob)
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  a.dispatchEvent(e)
}

function houseinfoeach(data,houseinfos){
      var result = "";
      try{
        if(houseinfos.length <= 4){
          if(strTrim(houseinfos[0]).indexOf('室')){
             data.shi = strTrim(houseinfos[0]).split('室')[0];
             if (strTrim(houseinfos[0]).split('室')[1].indexOf('厅')){
               data.ting = strTrim(houseinfos[0]).split('室')[1].replace('厅','');
             }else{
               data.ting = 0;
             }
          }else{
             data.shi = 0;
             data.ting = 0;
          }
          data.mianji = strTrim(houseinfos[1]).replace('m²','');
          data.chaoxiang = '';
          data.zhuangxiu = '';
          data.louceng = strTrim(houseinfos[2]);
          data.date = strTrim(houseinfos[3]);
          data.louxing = '';
        }

        if(houseinfos.length > 4){
          var temp = "";
          for (var i = 4 ; i < houseinfos.length(); i ++ ){
            temp += houseinfos[i]
          }
          data.otherInfo = temp;
        }
      }catch(e){
        console.log(e)
      }
}

function strTrim(str){
  var result = "";
  try{
    if(str){
      result = str.trim();
    }else{
      result = "无";
    }
  }catch(e){
    result = str;
  }
  return result;
}