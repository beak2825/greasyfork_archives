// ==UserScript==
// @name         确山卫计委
// @namespace    确山卫计委
// @version      0.05
// @description  确山卫计委-刷课
// @match        *://*.yzspeixun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392002/%E7%A1%AE%E5%B1%B1%E5%8D%AB%E8%AE%A1%E5%A7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/392002/%E7%A1%AE%E5%B1%B1%E5%8D%AB%E8%AE%A1%E5%A7%94.meta.js
// ==/UserScript==
(function() {
    'use strict';
  setInterval(function(){ goNextSection();window.alert=function(){} }, 480000);

})();