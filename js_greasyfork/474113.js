// ==UserScript==
// @name        vp settings
// @namespace   Violentmonkey Scripts
// @match        *://vp.csii.com.cn/
// @match        *://vp.csii.com.cn/*
// @license     MIT
// @grant       none
// @version     1.0.3
// @author      jyking
// @description 2023/8/25 15:16:11
// @downloadURL https://update.greasyfork.org/scripts/474113/vp%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/474113/vp%20settings.meta.js
// ==/UserScript==

(function() {
  var originalSend = window.XMLHttpRequest.prototype.send;
  window.XMLHttpRequest.prototype.send = function() {
    var self = this;
    var originalOnreadystatechange = self.onreadystatechange;

    // 修改响应数据的函数
    function modifyResponse() {
      if (self.readyState === 4 && self.status === 200 && self.responseURL.endsWith('/timesheet/AppDataSum.json')) {
        var modifiedData = modifyData(self.responseText);
        Object.defineProperty(self, 'response', { value: modifiedData });
        Object.defineProperty(self, 'responseText', { value: modifiedData });
      }

      if (originalOnreadystatechange) {
        originalOnreadystatechange.apply(this, arguments);
      }
    }

    self.onreadystatechange = modifyResponse;
    originalSend.apply(this, arguments);
  };
})();

function modifyData(data) {
  // 在这里修改返回的数据
  var modifiedData = data;
  // 将 JSON 数据解析为对象
  var json = JSON.parse(modifiedData);
  // 将 "qjdaishenpi" 字段的值减1
  json.qjdaishenpi = json.qjdaishenpi - 1;
  // 将修改后的对象转换回 JSON 字符串
  modifiedData = JSON.stringify(json);
  return modifiedData;
}


