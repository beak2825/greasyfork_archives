// ==UserScript==
// @name         小白测试
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  小白测试给笨蛋们用
// @author       You
// @match        https://jx3.seasunwbl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460887/%E5%B0%8F%E7%99%BD%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/460887/%E5%B0%8F%E7%99%BD%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
  var originalCreateElement = document.createElement
  function changeReqLink (script) {
    var src
    Object.defineProperty(script, 'src', {
      get: function () {
        return src
      },
      set: function (newVal) {
        src = newVal
        script.setAttribute('src', newVal)
      }
    })
    var originalSetAttribute = script.setAttribute
    script.setAttribute = function () {
      var args = Array.prototype.slice.call(arguments);
    
      if (args[0] === 'src' && args[1].includes('callback=') && args[1].includes('/api/buyer/goods/detail'))
      {
        console.log('请求地址: ' + args[1])
        window.__xiaobaibaiacallback = args[1].substr(args[1].indexOf('callback='),args[1].length).replace('callback=', '');
        args[1] = args[1].substr(0,args[1].indexOf('callback='))+ '&callback=__xiaobaibaia';
      }
      originalSetAttribute.call(script, ...args)
    }
  }
  document.createElement = function (tagName) {
    var dom = originalCreateElement.call(document, tagName)
    tagName.toLowerCase() === 'script' && (changeReqLink(dom))
    return dom
  }
window.__xiaobaibaia = function (e)
{
    console.log('返回参数: '+__xiaobaibaiacallback)
    e.data.state=5;
    var func=eval(__xiaobaibaiacallback);
    new func(e);
}

})()


