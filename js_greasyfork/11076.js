// ==UserScript==
// @name         eNameX
// @namespace    http://xiami.im/
// @version      0.1
// @description  易名价格醒目脚本，防大佬标错价，防米农秒错米。坑同行的木有小JJ！
// @author       xiami.im
// @require      http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @include      http://*.ename.com/*
// @exclude      http://*.ename.com/*inquiry*
// @exclude      http://*.ename.com/book/expired*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11076/eNameX.user.js
// @updateURL https://update.greasyfork.org/scripts/11076/eNameX.meta.js
// ==/UserScript==
//Sell domains
$(document).ready(function () {
  //Add commas to the prices
  function addComma(num) {
    num = num.toString().split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
    return num;
  }
  //Farmatting the prices

  function formatPrice(priceNum) {
    var priceLen = priceNum.toString().length;
    if (priceLen > 4) {
      var tt = parseInt(priceNum) / 10000;
      var t3 = tt.toPrecision(3);
      var t4 = tt.toPrecision(4);
      if (priceLen > 8) {
        tip = (parseInt(priceNum.substr(3, priceLen - 3)) ? '~' : '') + parseFloat((tt / 10000).toPrecision(3)) + ' 亿';
      } else {
        tip = (parseInt(priceNum.substr(3, priceLen - 3)) ? '~' : '') + ((priceLen == 8) ? addComma(t4)  : parseFloat(t3)) + ' 万';
      }
    } else {
      tip = addComma(priceNum);
    }
    return tip;
  }
  //Replace default character with price dom

  $('table.site_com_table tr:gt(0)').each(function () {
    var priceTd = $(this).children('td:eq(3)');
    priceTd.html(priceTd.html().replace('元', ''));
    priceTd.append('<span class=priceStand></span>');
    priceTd.children('.priceStand').css({
      color: 'red',
      'letter-spacing': '1px'
    });
  });
  //Keyup listener
  $('table.site_com_table tr:gt(0)').each(function () {
    var priceTd = $(this).children('td:eq(3)');
    priceTd.children('input').keyup(function () {
      var priceNum = priceTd.children('input').val();
      formatPrice(priceNum);
      priceTd.children('.priceStand').text('￥' + tip);
    });
    //Bat Keyup listener
    var priceBat = $('table.site_com_table tr:eq(1)').children('td:eq(3)');
    priceBat.children('input').keyup(function () {
      var priceNum = priceBat.children('input').val();
      formatPrice(priceNum);
      $('table.site_com_table tr:gt(0)').each(function () {
        $(this).children('td:eq(3)').children('.priceStand').text('￥' + tip);
      });
    });
  });
  //Buy domains
  $('.bid_domain').append('<span class="priceTip"></span>');
  var priceValue = formatPrice($('#askingPrice').text());
  if ($('#askingPrice').text() == '1') {
    $('.priceTip').text('1元拍');
  } else {
    $('.priceTip').text('￥' + priceValue);
  }
  $('.priceTip').css({
    color: 'red'
  });
  $('table.com_table tr:gt(0)').each(function () {
    if ($(this).children('td:eq(7)').length > 0) {
      var priceList = $(this).children('td:eq(5)');
    } else if ($(this).children('td:eq(6)').length > 0) {
      priceList = $(this).children('td:eq(4)');
    }
    priceList.text('￥' + formatPrice(priceList.text().replace('元', ''))).css({
      color: 'red'
    });
  });
});
