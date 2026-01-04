// ==UserScript==
// @name         屏蔽CvnX2的alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http://pos.annil.com:8047/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388426/%E5%B1%8F%E8%94%BDCvnX2%E7%9A%84alert.user.js
// @updateURL https://update.greasyfork.org/scripts/388426/%E5%B1%8F%E8%94%BDCvnX2%E7%9A%84alert.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.alert = function (msg) {
    console.log(msg);
  }
})();