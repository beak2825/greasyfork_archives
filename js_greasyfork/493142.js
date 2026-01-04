// ==UserScript==
// @name        leetcode小助手
// @description leetcode 热题100随机挑选
// @namespace   qiuguangyi123.leetcode-random-hot
// @version     0.0.1
// @author      qiuguangyi123
// @homepage    https://github.com/qiuguangyi123/tampermonkey-scripts
// @supportURL  https://github.com/qiuguangyi123/tampermonkey-scripts/issues
// @license     MIT
// @match       *://leetcode.cn/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/493142/leetcode%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493142/leetcode%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
!function() {
  "use strict";
  function e(e) {
    var t, n = (t = 'div[class="truncate"]', document.querySelectorAll(t));
    if (!(n.length <= 0)) {
      clearInterval(e);
      var r = function(e, t) {
        var n = Array.from(e);
        return new Array(t).fill(0).map((function() {
          var e = Math.floor(Math.random() * n.length), t = n[e];
          return n.splice(e, 1), t;
        }));
      }(n, 5);
      return r.map((function(e) {
        return e.innerText;
      }));
    }
  }
  !function(e, t) {
    void 0 === t && (t = {});
    var n = t.insertAt;
    if (e && "undefined" != typeof document) {
      var r = document.head || document.getElementsByTagName("head")[0], o = document.createElement("style");
      o.type = "text/css", "top" === n && r.firstChild ? r.insertBefore(o, r.firstChild) : r.appendChild(o), 
      o.styleSheet ? o.styleSheet.cssText = e : o.appendChild(document.createTextNode(e));
    }
  }(""), window.onload = function() {
    var t = setInterval((function() {
      console.log(e(t));
    }), 300);
  };
}();
