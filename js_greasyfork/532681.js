// ==UserScript==
// @name         速卖通税率代码参数
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  针对某办公系统区域调价交互进行优化。
// @author       glk
// @include      https://csp.aliexpress.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532681/%E9%80%9F%E5%8D%96%E9%80%9A%E7%A8%8E%E7%8E%87%E4%BB%A3%E7%A0%81%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532681/%E9%80%9F%E5%8D%96%E9%80%9A%E7%A8%8E%E7%8E%87%E4%BB%A3%E7%A0%81%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==


(function () {
  "use strict";
  const STYLE = `
    .rc-virtual-list .rc-virtual-list-holder {
      max-height: 1000px !important;
    }
  `
  function addStyle(styStr = "") {
    let _style = document.createElement("style");
    _style.innerHTML = styStr;
    document.getElementsByTagName("head")[0].appendChild(_style);
  }

  addStyle(STYLE)
})();
