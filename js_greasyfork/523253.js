// ==UserScript==
// @name        Remove academic evaluation
// @namespace   Violentmonkey Scripts
// @match       https://1.tongji.edu.cn/*
// @grant       none
// @version     1.0
// @author      -
// @description 1/8/2025, 10:40:02 PM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523253/Remove%20academic%20evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/523253/Remove%20academic%20evaluation.meta.js
// ==/UserScript==


(function() {
    'use strict';
    setTimeout(() => {
      document.querySelector('body > div.v-modal').remove();
      document.querySelector('body > div.el-message-box__wrapper').remove();
    }, 3000);
})();
