// ==UserScript==
// @name         jianshu Clean
// @name:zh-CN   简书净化
// @namespace    https://slaier.github.io/
// @version      1.1
// @author       slaier
// @description  jianshu auto readmore.
// @description:zh-cn 简书自动展开。
// @include      https://www.jianshu.com/p/*
// @grant        none
// @icon         https://www.jianshu.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387958/jianshu%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/387958/jianshu%20Clean.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.querySelector(".close-collapse-btn").click();
})();