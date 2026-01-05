// ==UserScript==
// @name           	去除2chcn等手机版网站广告
// @description    	去除2chcn，驱动之家等手机版网站广告
// @include        	https://*.gamme.com.tw/*
// @include        	http://2chcn.com/*
// @include        	http://m.mydrivers.com/*
// @include        	http://www.google.cn/search?q=*
// @include        	http://nogizaka46democracy.blog.jp/*
// @include        	http://g.pconline.com*
// @include        	http://m.zol.com.cn*
// @include        	http://wap.ithome.com*
// @author         	yechenyin
// @version        	0.70
// @namespace 	   	https://greasyfork.org/users/3586-yechenyin
// @require         https://code.jquery.com/jquery-1.11.2.min.js
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/11107/%E5%8E%BB%E9%99%A42chcn%E7%AD%89%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/11107/%E5%8E%BB%E9%99%A42chcn%E7%AD%89%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==



/****************************************************/
var ads = 'a.favorite, .fixedFb,.xmas_gift, .fixedLine, .adpopup, .appPop, .all_warning, #fullBG, #fullad_all, .ad_down, .appPop, .news_list li.if, .post .if, .pimgShare, .if2, a.goTop, aside,div[class^="soc_ad"], #pc-aptg, #hd_float, .bottom-fixed, ins';
ads += ', div[align="center"], #mynewslist li:nth-child(1), #mynewslist li:nth-child(2), #ad_jrkb';
$('head').append($('<style>', {class:'hide_ad'}).text(ads + ' {display:none!important}'));

if (location.href.indexOf("http://g.pconline.com") === 0) {
$('head').append($('<style>', {class:'hide_ad'}).text('body>div:last-child, #pc-aptg {display:none!important}'));
}

jQuery.fn.loaded = function(action, delay) {
  var selector = this.selector;
  var check = setInterval(function () {
    if ($(selector).length > 0) {
      console.log($(selector).length + ' ' + selector + " is loaded");
      clearInterval(check);
      setTimeout(function() {
        action();
      }, delay || 0);
    }
  }, 100);
};

if (location.href.match("https://news.gamme.com.tw/")) {
$('.navbar').css({position:'static'});
$('.msgNum').attr('style', 'position: absolute; bottom: auto; top:90px');
$('head').append($('<style>').text('.msgNum {top:90px}'));
$('head').append($('<style>').text('.news_list li, .top_list li {height:100px}'));
$('.fixedbg').loaded(function () {
  $('.fixedbg').remove();
});
}

if (location.href.indexOf("http://www.google.cn/search?q=") === 0) {
  location.href = location.href.replace('http://www.google.cn/' ,'https://www.google.com.hk/');
}

if (location.href.indexOf("http://2chcn.com") === 0) {
  $('ins').remove();
}