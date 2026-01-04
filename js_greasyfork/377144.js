// ==UserScript==
// @name         再见了百家号搜索结果-超级简洁版
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/377144
// @description  搜索排除百家号
// @version      1.0
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       依然菜刀
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377144/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C-%E8%B6%85%E7%BA%A7%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/377144/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C-%E8%B6%85%E7%BA%A7%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function () {
  String.prototype.endWith = function (s) {
    if (s == null || s === "" || this.length === 0 || s.length > this.length)
      return false;
    return this.substring(this.length - s.length) === s;
  };

  var INS = ' -baijiahao';

  var hostname = window.location.hostname;
  if (hostname === 'www.baidu.com') {
    process();
  }

  function removeIns(txt) {
    if (txt.endWith(INS)) {
      return txt.substr(0, txt.length - INS.length);
    }
    return txt;
  }

  function getRealVal(input) {
    return input.getAttribute('data-value') || '';
  }

  function process() {
    var $kw = $("#kw");
    var oVal = removeIns($kw.val());
    $kw.val(oVal);
    $kw.attr('value', oVal);
    $kw.attr('data-value', oVal);
    $kw.on('input', function(event){
      this.value = event.originalEvent.data;
    });
    Object.defineProperty($kw[0], 'value', {
      get: function () {
        var txt = getRealVal(this);
        if (txt && !txt.endWith(INS)) {
          txt += INS;
        }
        return txt;
      },
      set: function (newVal) {
        this.setAttribute('data-value', newVal);
      }
    });
  }
})();