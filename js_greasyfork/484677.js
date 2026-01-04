// ==UserScript==
// @name        提取EM code
// @namespace   Violentmonkey Scripts
// @match       https://quote.eastmoney.com/*.html
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 2024/1/12 11:13:34
// @downloadURL https://update.greasyfork.org/scripts/484677/%E6%8F%90%E5%8F%96EM%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/484677/%E6%8F%90%E5%8F%96EM%20code.meta.js
// ==/UserScript==

(function () {
  "use strict";
  addLoadEvent(() => {
    const url = window.location.href;
    const str = /quote\.eastmoney\.com/i;
    if (str.test(url)) {
      //为主页面
      let divElement1 = document.createElement("div");
      divElement1.className = "gs1";
      document.body.appendChild(divElement1);
      divElement1.style = "top: calc( 15% - 20px );font-size: 16px;";
      var htmlsource = document.documentElement.outerHTML;
      //显示基金名称,名称面板
      var myRe1 = /quotecode[\s]*\=[\s]*"([0-9A-Za-z]*\.[0-9A-Za-z]*)"/;
      var quotecode1 = myRe1.exec(htmlsource);
      var myRe2 = /"quotecode[\s]*"\:[\s]*"([0-9A-Za-z]*\.[0-9A-Za-z]*)"/;
      var quotecode2 = myRe2.exec(htmlsource);
      // console.log(quotecode1);
      // console.log(quotecode2);
      var quotecode = quotecode1 ? quotecode1[1] : quotecode2[1];
      console.log(quotecode);
      divElement1.innerHTML = quotecode;
    }
  });
  addStyle(`
      .gs1 {
          padding: 5px 5px;
          font-size: 14px;
          color: snow;
          position: fixed;
          text-align: left;
          cursor: copy;
          border-radius: 10px;
          background-color: rgba(135, 134, 241, 0.84);
          right: 5px;
          top: 15%;
          z-index: 999999;
          //box-shadow: 0 0 7px 0 rgba(18, 80, 18,0.4), 0 0 0 1px rgba(0,0,0,0.3);
          min-width: 50px;
      }`);
  function addLoadEvent(func) {
    let oldOnload = window.onload;
    if (typeof window.onload != "function") {
      window.onload = func;
    } else {
      window.onload = function () {
        try {
          oldOnload();
        } catch (e) {
          console.log(e);
        } finally {
          func();
        }
      };
    }
  }
  //添加css样式
  function addStyle(rules) {
    let styleElement = document.createElement("style");
    styleElement["type"] = "text/css";
    document.getElementsByTagName("head")[0].appendChild(styleElement);
    styleElement.appendChild(document.createTextNode(rules));
  }
})();
