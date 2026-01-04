// ==UserScript==
// @name        链家二手房 - lianjia.com
// @namespace   Violentmonkey Scripts
// @match       https://wh.lianjia.com/ershoufang/*
// @grant       none
// @version     1.0
// @author      liurj
// @description 2021/1/13 上午10:13:02
// @downloadURL https://update.greasyfork.org/scripts/420219/%E9%93%BE%E5%AE%B6%E4%BA%8C%E6%89%8B%E6%88%BF%20-%20lianjiacom.user.js
// @updateURL https://update.greasyfork.org/scripts/420219/%E9%93%BE%E5%AE%B6%E4%BA%8C%E6%89%8B%E6%88%BF%20-%20lianjiacom.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var list = $('#content ul.sellListContent li');
    var arrayJson = new Array() 
    $.each( list, function( key, val ) {
      var info = $(val).children('div.info');
      var url = $(info).children('.title').children('a').attr('href');
      var title = $(info).children('.title').text();
      var positions = $(info).children('.flood').text().split('-');
      var houseinfos = $(info).children('.address').text().split('|');
      var tags = $(info).children('.tag').text();
      var price = $(info).children('.priceInfo').children('.totalPrice').text();
      var unitprice = $(info).children('.priceInfo').children('.unitPrice').text();
      var startDate = $(info).children('.followInfo').text();
      price = priceConvert(price);
      unitprice = unitprice.replace('单价','').replace('元/平米','');
      var follow = strTrim(startDate.split('/')[0]).replace('人关注','');
      var pushDate = strTrim(startDate.split('/')[1]).replace('以前发布','');
      var data = {
        url :url,
        title:title,
        lpName:strTrim(positions[0]),
        pos:strTrim(positions[1]),
        tag:tags,
        totalprice:price,
        unitprice:unitprice,
        pushDate:pushDate,
        follow:follow
        
      }
      console.log( key +",url："+url+" ,发布日期："+startDate+ ",标题：" + title + ",楼盘名称："+strTrim(positions[0])+",位置："+strTrim(positions[1])+ houseinfoeach(data,houseinfos)+
                    ",标签："+tags+",总价："+price+",单价："+unitprice);
      
      arrayJson.push(data);
      
    });
    save(arrayJson ,'result.json');
    
  // 等待3 秒
  setTimeout(
  function() 
  {
    if(!$('.page-box .house-lst-page-box a:last').hasClass('on')){
      // 下一页
      window.location.href = $('.page-box .house-lst-page-box a:last').attr('href');
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
        if(houseinfos.length <= 7){
          result += ",房型：" + strTrim(houseinfos[0]);
          result += ",面积：" + strTrim(houseinfos[1]);
          result += ",朝向：" + strTrim(houseinfos[2]);
          result += ",装修：" + strTrim(houseinfos[3]);
          result += ",楼层：" + strTrim(houseinfos[4]);
          result += ",建筑日期：" + strTrim(houseinfos[5]);
          result += ",楼型：" + strTrim(houseinfos[6]);
          data.shi = strTrim(houseinfos[0]).split('室')[0];
          data.ting = strTrim(houseinfos[0]).split('室')[1].replace('厅','');
          data.mianji = strTrim(houseinfos[1]).replace('平米','');
          data.chaoxiang = strTrim(houseinfos[2]);
          data.zhuangxiu = strTrim(houseinfos[3]);
          data.louceng = strTrim(houseinfos[4]);
          data.date = strTrim(houseinfos[5]);
          data.louxing = strTrim(houseinfos[6]);
        }

        if(houseinfos.length > 7){
          result += ",其他信息："
          var temp = "";
          for (var i = 7 ; i < houseinfos.length(); i ++ ){
            temp += houseinfos[i]
          }
          result += temp;
          data.otherInfo = temp;
        }
      }catch(e){
        console.log(e)
      }
  return result;
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
