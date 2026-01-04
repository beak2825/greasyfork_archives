// ==UserScript==
// @name        房天下二手房
// @namespace   Violentmonkey Scripts
// @match       https://wuhan.esf.fang.com/house/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/1/14 上午11:04:41
// @downloadURL https://update.greasyfork.org/scripts/420220/%E6%88%BF%E5%A4%A9%E4%B8%8B%E4%BA%8C%E6%89%8B%E6%88%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/420220/%E6%88%BF%E5%A4%A9%E4%B8%8B%E4%BA%8C%E6%89%8B%E6%88%BF.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var list = $('.shop_list_4 dl[dataflag=bg]');
    var arrayJson = new Array() 
    $.each( list, function( key, val ) {
      var info = $(val).children('dd')[0];
      var priceInfo = $(val).children('dd')[1];
      var url = 'https://wuhan.esf.fang.com/' + $(info).children('h4').children('a').attr('href');
      var title = $(info).children('h4').children('a').attr('title');
      var positions = $(info).children('p.add_shop').children('span').text().split('-');
      var lpName = $(info).children('p.add_shop').children('a').attr('title');
      var houseinfos = $(info).children('p.tel_shop').text().split('|');
      var tags = $(info).children('p.clearfix.label').children('span').text();
      var price = $(priceInfo).children('span:first').text();
      var unitprice = $(priceInfo).children('span:last').text();
      price = priceConvert(price);
      unitprice = unitprice.replace('元/㎡','');
      var data = {
        url :url,
        title:title,
        lpName:strTrim(lpName),
        pos:strTrim(positions[0]),
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
    if($('.page_al p:eq(-2)').text() == '下一页'){
      // 下一页
      window.location.href = $('.page_al p:eq(-2) a').attr('href');
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
        if(houseinfos.length <= 6){
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
          data.mianji = strTrim(houseinfos[1]).replace('㎡','');
          data.chaoxiang = strTrim(houseinfos[3]);
          data.zhuangxiu = '';
          data.louceng = strTrim(houseinfos[2]);
          data.date = strTrim(houseinfos[4]);
          data.louxing = '';
        }

        if(houseinfos.length > 6){
          var temp = "";
          for (var i = 6 ; i < houseinfos.length(); i ++ ){
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
