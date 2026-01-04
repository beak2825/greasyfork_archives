// ==UserScript==
// @name         禁用sendBeacon
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  禁用navigator.sendBeacon
// @author       tmr
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435663/%E7%A6%81%E7%94%A8sendBeacon.user.js
// @updateURL https://update.greasyfork.org/scripts/435663/%E7%A6%81%E7%94%A8sendBeacon.meta.js
// ==/UserScript==

(function () {
  'use strict';
  navigator.sendBeacon = function (url, data) {
    // console.log('fake sendBeacon: ', url, data);
    return true;
  };
})();
