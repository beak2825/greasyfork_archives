// ==UserScript==
// @name        自动点击百度搜索的“停止回答”按钮
// @namespace   Violentmonkey Scripts
// @match       https://www.baidu.com/s*
// @grant       none
// @version     1.0
// @author      lihao
// @description 2024/7/18 15:08:59
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501042/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E2%80%9C%E5%81%9C%E6%AD%A2%E5%9B%9E%E7%AD%94%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/501042/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%9A%84%E2%80%9C%E5%81%9C%E6%AD%A2%E5%9B%9E%E7%AD%94%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
  console.clear()
 
  function wait (selector,func, times, interval) {
    var _times = times || 100, //100次
        _interval = interval || 20, //20毫秒每次
        _selector = selector, //选择器
        _iIntervalID; //定时器id
 
      _iIntervalID = setInterval(function() {
          if(!_times) { //是0就退出
              clearInterval(_iIntervalID);
          }
          _times <= 0 || _times--; //如果是正数就 --
          _self = $(_selector); //再次选择
          if( _self.length ) { //判断是否取到
              func && func.call(_self);
              clearInterval(_iIntervalID);
          }
      }, _interval);
 
    return this;
}
 
  // 自动关闭
  wait("span:contains(停止回答)",function(){$("span:contains(停止回答)").trigger("click")},100,200);
 
 
})();