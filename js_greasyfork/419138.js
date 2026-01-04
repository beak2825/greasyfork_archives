// ==UserScript==
// @name        baidu hot list Affix
// @namespace   https://github.com/Sanm-ZH/baidu-hotlist-affix
// @match       https://www.baidu.com/s?*
// @match       https://zhidao.baidu.com/search?*
// @grant       none
// @version     1.3.0
// @author      sanm-zh
// @icon        https://www.baidu.com/img/baidu_85beaf5496f291521eb75ba38eacbd87.svg
// @description 百度热榜固定
// @downloadURL https://update.greasyfork.org/scripts/419138/baidu%20hot%20list%20Affix.user.js
// @updateURL https://update.greasyfork.org/scripts/419138/baidu%20hot%20list%20Affix.meta.js
// ==/UserScript==

(function () {
    setTimeout(function() {
      // 存在评论区域时，不进行定位
      var remarkDom = document.querySelector('.xdp');
      if(remarkDom) {
        return false;
      }
      
      var reg = /(http|https):\/\/(www|zhidao).baidu.com\/(s|search)*/
      if(reg.test(location.href)) {
        // 调用dom处理
        hotListDomHandel();
      }
    }, 1500)
})();
  
// 获取热榜dom
function hotListDomHandel() {
    var isZhidao = location.href.indexOf('//zhidao.baidu.com/') > -1;
    var selector = '';
    if (isZhidao) {
      selector = '#right-billboard';
    } else {
      selector = '.FYB_RD';
    }
    var hotEle = document.querySelectorAll(selector);
    if (hotEle.length) {
      var top = getelementtopagetop(hotEle[0]),
          url = location.href;
      window.onscroll = function () {
          throttle(changeHotListStyle(hotEle[0], top, url), 1000);
      }
    } else {
        return false;
    }
}
  
// 固定热点列表样式
function changeHotListStyle(hotEle, top, url) {
    // url变化重新获取热榜dom
    if(location.href !== url) {
    hotListDomHandel();
    }
    var scrollTop = document.documentElement.scrollTop;
    if (scrollTop > top - 70) {
        hotEle.style = 'position: fixed;top: 80px;width: 368px';
    } else {
        hotEle.style = '';
    }
}
  
  // 获取el到顶部的距离
  function getelementtopagetop(el) {
      if (el.parentElement) {
          var h = el.parentElement.offsetTop === el.offsetTop ? 0 : el.offsetTop;
          return getelementtopagetop(el.parentElement) + h;
      }
      return el.offsetTop;
  }
  
// 节流
function throttle(fn, delay) {
    var prevTime = Date.now();
    return function () {
        var curTime = Date.now();
        if (curTime - prevTime > delay) {
            fn.apply(this, arguments);
            prevTime = curTime;
        }
    };
}