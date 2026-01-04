// ==UserScript==
// @name         江苏省成人高校招生全国统一考试网上报名系统去掉禁止粘贴
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  江苏省成人高校招生全国统一考试网上报名系统去掉禁止粘贴及其他功能
// @author       You
// @match        https://cz.jseea.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/474886/%E6%B1%9F%E8%8B%8F%E7%9C%81%E6%88%90%E4%BA%BA%E9%AB%98%E6%A0%A1%E6%8B%9B%E7%94%9F%E5%85%A8%E5%9B%BD%E7%BB%9F%E4%B8%80%E8%80%83%E8%AF%95%E7%BD%91%E4%B8%8A%E6%8A%A5%E5%90%8D%E7%B3%BB%E7%BB%9F%E5%8E%BB%E6%8E%89%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474886/%E6%B1%9F%E8%8B%8F%E7%9C%81%E6%88%90%E4%BA%BA%E9%AB%98%E6%A0%A1%E6%8B%9B%E7%94%9F%E5%85%A8%E5%9B%BD%E7%BB%9F%E4%B8%80%E8%80%83%E8%AF%95%E7%BD%91%E4%B8%8A%E6%8A%A5%E5%90%8D%E7%B3%BB%E7%BB%9F%E5%8E%BB%E6%8E%89%E7%A6%81%E6%AD%A2%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
         setTimeout(()=>{
             const dom = document.querySelector('.user-input').nextSibling
          dom.onpaste = function(event) {
              return true
          };
             dom.oncontextmenu = function(event) {
              return true
          };
               dom.oncopy = function(event) {
              return true
          };
             dom.oncut = function(event) {
              return true
          };
        },
        1000);
})();