// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.ico
// @name             阿里巴巴生意参谋增强
// @namespace        https://www.thfou.com/
// @version          1.0.4
// @description      生意参谋数据多元化，展示更多数据，减少计算时间。
// @author           头号否
// @match            *://sycm.1688.com/ms/home/*
// @require          https://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @compatible	     Firefox
// @compatible	     Edge
// @compatible   	 Safari
// @compatible   	 Opera
// @compatible	     UC
// @license          GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/393762/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/393762/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout (function(){
 var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML=".payRate{margin-top: 48px;};";
document.getElementsByTagName('HEAD').item(0).appendChild(style);
document.querySelectorAll('#homeHomeRealtimeSurvey')[0].style.cssText = "min-height:450px";
 var payRateNew = document.createElement('div');
  payRateNew.className = 'shop-realtime-shop-index-cell payRate';
//支付转化率
 var payByrCnt = document.querySelectorAll('.payByrCnt p')[1].innerText;
 var uv = document.querySelectorAll('.uv p')[1].innerText;
 var pb = payByrCnt/uv;
 var pblv = Number(pb*100).toFixed(2);
  pblv+='%';
//昨日支付转化率
 var payByrCntold = document.querySelectorAll('.shop-realtime-shop-sub-indexes p span')[7].innerText;
 var uvold = document.querySelectorAll('.shop-realtime-shop-sub-indexes p span')[15].innerText;
 var pbold = payByrCntold/uvold;
 var pblvold = Number(pbold*100).toFixed(2);
  pblvold+='%';
//转化率数据
 var payRateA = '<p class="shop-realtime-shop-index-name text-overflow"><i class="oui-icon oui-icon-payAmt-simple"></i><span>支付转化率</span></p><p class="shop-realtime-shop-index-value text-overflow">';
 var payRateB = pblv;
 var payRateC = '</p><div class="shop-realtime-shop-sub-indexes "><p class="shop-realtime-shop-sub-value text-overflow"><span class="shop-realtime-shop-sub-value-title">昨日转化率:</span><span>';
 var payRateD = pblvold;
 var payRateE = '</span></p></div>';
  payRateNew.innerHTML = payRateA + payRateB + payRateC + payRateD + payRateE;
$('.shop-realtime-shop-main-indexes').append(payRateNew);
//人均浏览量
 var rjpv = document.createElement('div');
  rjpv.className = 'shop-realtime-shop-index-cell pv';
//实时浏览量
 var pv = document.querySelectorAll('.pv p')[1].innerText;
 var rjpvsj = Math.ceil(pv/uv);
//昨日人均浏览量
 var pvold = document.querySelectorAll('.shop-realtime-shop-sub-indexes p span')[17].innerText;
 var rjpvsjold = Math.ceil(pvold/uvold);
//人均浏览量数据
 var rjpvA = '<p class="shop-realtime-shop-index-name text-overflow"><i class="oui-icon oui-icon-pv-simple"></i><span>人均浏览量</span></p><p class="shop-realtime-shop-index-value text-overflow">';
 var rjpvB = rjpvsj;
 var rjpvC = '</p><div class="shop-realtime-shop-sub-indexes "><p class="shop-realtime-shop-sub-value text-overflow"><span class="shop-realtime-shop-sub-value-title">昨日人均浏览量:</span><span>';
 var rjpvD = rjpvsjold;
 var rjpvE = '</span></p></div>';
  rjpv.innerHTML = rjpvA + rjpvB + rjpvC + rjpvD + rjpvE;
$('.shop-realtime-shop-main-indexes').append(rjpv);
//banner海报
var ad = document.createElement('div');
ad.className = 'op1688-pages-home-shop-survey-wrapper';
ad.style = 'width:429;height:120px;background: #ffffff;margin-top: 10px;';
ad.innerHTML = '<a href="https://daima.thfou.com" target="_blank"><img src="https://daima.thfou.com/img/sycmad.jpg"></a>';
$('.op1688-pages-home-realtime').append(ad);
//支付金额对比
var jye = document.createElement('div');
    jye.className = 'shop-realtime-shop-payAmt-wrapper';
    jye.style = 'margin-bottom: 40px;';
    var zrjye = document.querySelectorAll('.shop-realtime-shop-sub-indexes p span')[1].innerText.replace(/,/g, '');
    var jrjye = document.querySelectorAll('.shop-realtime-shop-index-value')[0].innerText.replace(/,/g, '');
    var jyedb = jrjye-zrjye;
    var crdata = document.querySelector('.shop-realtime-shop-payAmt-wrapper');
    if(jyedb<0){
        jye.innerHTML = '<div class="shop-realtime-shop-index-cell payAmt"><p class="shop-realtime-shop-index-name text-overflow"><i class="oui-icon oui-icon-payAmt-simple"></i><span>实时支付金额对比昨日总金额(元)</span></p><p class="shop-realtime-shop-index-value text-overflow"><span class="oui-icon oui-icon-trend-down">' + Math.abs(jyedb) + '</span></p></div><p class="shop-realtime-shop-legend"><span class="shop-realtime-shop-legend-today" style=" margin-right: 0px; "><span class="shop-realtime-shop-legend-square" style="background-color: rgb(0, 127, 255);"></span><span class="shop-realtime-shop-legend-name">由<a href="https://www.thfou.com" target="_blank">头号否</a>提供</span></span></p><table class="shop-realtime-shop-sub-indexes payAmt"><tbody><tr><td><p class="shop-realtime-shop-sub-value text-overflow"><span class="shop-realtime-shop-sub-value-title">小提示：如需查看实时数据对比，请手动刷新页面即可。</span></p></td></tr></tbody></table>';
        crdata.parentNode.insertBefore(jye, crdata);
    }else{
        jye.innerHTML = '<div class="shop-realtime-shop-index-cell payAmt"><p class="shop-realtime-shop-index-name text-overflow"><i class="oui-icon oui-icon-payAmt-simple"></i><span>实时支付金额对比昨日总金额(元)</span></p><p class="shop-realtime-shop-index-value text-overflow"><span class="oui-icon oui-icon-trend-up">' + jyedb + '</span></p></div><p class="shop-realtime-shop-legend"><span class="shop-realtime-shop-legend-today" style=" margin-right: 0px; "><span class="shop-realtime-shop-legend-square" style="background-color: rgb(0, 127, 255);"></span><span class="shop-realtime-shop-legend-name">由<a href="https://www.thfou.com" target="_blank">头号否</a>提供</span></span></p><table class="shop-realtime-shop-sub-indexes payAmt"><tbody><tr><td><p class="shop-realtime-shop-sub-value text-overflow"><span class="shop-realtime-shop-sub-value-title">小提示：如需查看实时数据对比，请手动刷新页面即可。</span></p></td></tr></tbody></table>';
        crdata.parentNode.insertBefore(jye, crdata);
    };
},3000);
})();