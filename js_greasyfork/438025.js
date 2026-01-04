// ==UserScript==
// @name        安居客二手房地图找房显示单价
// @namespace   Violentmonkey Scripts
// @match       https://*.anjuke.com/map/sale/
// @grant       none
// @version     1.0
// @author      Ybond
// @description 2021/11/12 下午4:32:39
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438025/%E5%AE%89%E5%B1%85%E5%AE%A2%E4%BA%8C%E6%89%8B%E6%88%BF%E5%9C%B0%E5%9B%BE%E6%89%BE%E6%88%BF%E6%98%BE%E7%A4%BA%E5%8D%95%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/438025/%E5%AE%89%E5%B1%85%E5%AE%A2%E4%BA%8C%E6%89%8B%E6%88%BF%E5%9C%B0%E5%9B%BE%E6%89%BE%E6%88%BF%E6%98%BE%E7%A4%BA%E5%8D%95%E4%BB%B7.meta.js
// ==/UserScript==
//异步数据,每两秒计算一次
setInterval(function () {
    $(".item-mod").each(function (index, element) {
        let _this = $(element)
        calc(_this)
    })
}, 2000)

//计算
function calc(obj) {
    let mj = obj.find('p.clearfix>span:eq(0)').html().toString().replace("m²", "");
    let zj = obj.find('p.clearfix>.item-price>em').html().toString();
    let dj = parseInt(parseFloat(zj) * 10000 / parseFloat(mj));
    let t = obj.find('p.clearfix span.dj_');
    if (t.length < 1) {
        obj.find('p.clearfix ').append('<span class="dj_"></span>');
    }
    obj.find('p.clearfix span.dj_').html(dj)
}