// ==UserScript==
// @name             虫部落去广告
// @namespace        Violentmonkey Scripts
// @match            *://*.chongbuluo.com/
// @grant            none
// @version          1.0
// @author           Senkita
// @description      2020/4/10 下午9:23:47
// @require          https://greasyfork.org/scripts/400309-%E8%99%AB%E9%83%A8%E8%90%BD%E5%8E%BB%E5%B9%BF%E5%91%8A/code/%E8%99%AB%E9%83%A8%E8%90%BD%E5%8E%BB%E5%B9%BF%E5%91%8A.js?version=790703
// ==/UserScript==

(function(){
senInterval(function(){
     // Google搜索
     $(window.frames["engine"].doucment).find('.swiper_wrap').remove();
     // Wikipedia
     $(window.frames["engine"].doucment).find('.search').remove();
     // 百度高级
     $(window.frames["engine"].doucment).find('.#ft').remove();
 },1000);
})();