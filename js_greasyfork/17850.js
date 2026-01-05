// ==UserScript==
// @name        CarKing001
// @namespace   https://greasyfork.org/users/11909
// @description CarKing001 - 车王二手车残值率
// @include     http://www.carking001.com/ershouche/*
// @version     2016.03.08.01
// @author      OscarKoo
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17850/CarKing001.user.js
// @updateURL https://update.greasyfork.org/scripts/17850/CarKing001.meta.js
// ==/UserScript==

;(function($) {
  var getKM = function(text) {
    var km = text.substr(0, text.length - 2);
    var index = km.indexOf('万');
    return parseFloat(index >= 0 ? (km.substr(0, km.length - 1) * 10000) : km);
  };

  var getMonths = function(text) {
    if (!text || text == '-') return 1;
    var dates = text.split('/')
    var now = new Date();
    return (now.getFullYear() - parseInt(dates[0], 10)) * 12 + (now.getMonth() + 1 - parseInt(dates[1], 10));
  };

  var getNewPrice = function(text) {
    return parseFloat(text.match(/￥(\d+\.\d*)万/)[1]);
  };

  var getOriginalPrice = function(text) {
    return parseFloat(text.match(/新车价：(\d+\.*\d*)万/)[1]);
  };


  var calculate = function() {
    $('ul.carList>li>.fl').each(function() {
      try {
        var km, months, newPrice, originalPrice, p;
        $(this).children('p').filter(function(index) {
          return index == 0 || index == 1;
        }).each(function(index) {
          switch (index) {
            case 0:
              var span = $(this).children('span');
              km = getKM(span.eq(0).text());
              months = getMonths(span.eq(1).text());
              break;
            case 1:
              p = $(this);
              var t = p.text();
              newPrice = getNewPrice(t);
              originalPrice = getOriginalPrice(t)
              break;
          }
        });
        var priceDiff = originalPrice - newPrice;
        var rate = priceDiff / originalPrice * 100;
        p.append('<span style="border-left: 1px solid #ccc;">&nbsp;&nbsp;差价：' + priceDiff.toFixed(4) + '万元；跌幅：' + rate.toFixed(2) + '%；年限：' + months + '月；折合：' + (rate / (months / 12)).toFixed(2) + '%/年；' + (priceDiff / months * 10000).toFixed(2) + '元/月；' + (priceDiff / km * 10000).toFixed(2) + '元/公里</span>');
      } catch (e) {
        console.log(e);
      }
    });
  };
  calculate();
})($);