// ==UserScript==
// @name         修改网页字体
// @namespace    https://github.com/liyuhaolol/ChangeWebFont
// @version      1.4
// @description  覆盖网页的body默认字体样式
// @author       菜狗子
// @match        *://*.taobao.com/*
// @match        *://p-bandai.jp/*
// @match        *://search.p-bandai.jp/*
// @match        *://tamashiiweb.com/*
// @icon         http://www.zku.net/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475267/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/475267/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

GM_addStyle(`
    * {
        font-family: 'MiSans VF','MiSans', 'PingFang SC', 'Microsoft Yahei', Arial, sans-serif;
    }
`);

window.onload = function () {
  changeDTelementWidth();
  changeJpFont();
};

function changeDTelementWidth() {
  var divElements = document.getElementsByClassName('detail_t detail_t1');
  if (divElements != null) {
    var divArray = Array.from(divElements);
    divArray.forEach(function (divElement) {
      var dlElement = divElement.querySelector('dl');
      if (dlElement != null) {
        var dtElements = dlElement.querySelectorAll('dt');
        if (dtElements != null) {
          var dtArray = Array.from(dtElements);
          dtArray.forEach(function (dtElement) {
            //console.log(dtElement);
            dtElement.style.width = '5em';
          });
        }
      }
    });
  }
}

function changeJpFont(){
  //修改MB简介字体
  var pElementTitle = document.getElementsByClassName('intro_txt');
  if(pElementTitle != null){
    //console.log(pElement);
    pElementTitle[0].style.fontFamily = '宋体,宋体-简,SimSun,Arial,sans-serif';
  }
  //修改跳转按钮字体
  var pElementJumpBtns= document.getElementsByClassName('linkbtn_s');
  if(pElementJumpBtns != null){
    var pArray = Array.from(pElementJumpBtns);
    pArray.forEach(function (pElement) {
      var aElement = pElement.querySelector('a');
      if(aElement != null){
        aElement.style.fontFamily = '宋体,宋体-简,SimSun,Arial,sans-serif';
      }
    });
  }
  //修改跳转按钮2字体
  var pElementJumpBtn= document.getElementsByClassName('linkbtn_m');
  if(pElementJumpBtn != null){
    var aElement = pElementJumpBtn[0].querySelector('a');
    if(aElement != null){
      aElement.style.fontFamily = '宋体,宋体-简,SimSun,Arial,sans-serif';
    }
  }
  //修改类目字体
  var cardttl = document.getElementsByClassName('card_ttl');
  if(cardttl != null){
    for (var i = 0; i < cardttl.length; i++) {
      var element = cardttl[i];
      element.style.fontFamily = 'MiSans VF,MiSans,PingFang SC,Microsoft Yahei,Arial,sans-serif';
    }
  }
}