// ==UserScript==
// @name        New script qq.com
// @namespace   Violentmonkey Scripts
// @match       https://ilabel.weixin.qq.com/mission/26220/label*
// @grant       none
// @version     1.0
// @author      -
// @description 2025/7/1 18:41:25
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/541338/New%20script%20qqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/541338/New%20script%20qqcom.meta.js
// ==/UserScript==
(function () {
  "use strict";

  var style = document.createElement("style");
  style.textContent = `
        .footer{
          padding-left:76%;
        }
        .el-button.el-button--primary{
          margin-bottom:20px;
          width:550px;
          height:50px;
        }
    `;

  document.head.appendChild(style);
})();