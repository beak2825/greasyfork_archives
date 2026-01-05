// ==UserScript==
// @name         Wantedly Follow for OEN Page
// @namespace    https://greasyfork.org/ja/users/61980-kuma
// @version      0.1.2
// @description  try to take over the world!
// @author       kuma
// @match        https://www.wantedly.com/projects/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/27030/Wantedly%20Follow%20for%20OEN%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/27030/Wantedly%20Follow%20for%20OEN%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function delay (func, num) {
      return new Promise(function(resolve) {
        setTimeout(function() {
          func();
          resolve();
        }, num);
      });
    }
    $(function() {
      var target = $('.company-thumbnail [data-hasqtip]');
      var buttonSelector = '.company-following-button[data-method=post]';
      target.trigger('mouseover');
      Promise.resolve().then(delay(function() {
        console.log($(buttonSelector).length, 'display');
        if ($(buttonSelector).length === 0) {
          resolve();
          return;
        }
        $(buttonSelector).click();
      }, 5000)).then(delay(function() {
         // var url = $('.next a').prop('href');
         // location.href = url;
      },  8000));
    });
})();
