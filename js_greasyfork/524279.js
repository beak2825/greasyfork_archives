// ==UserScript==
// @name         Block CSDN in Google/Baidu Search
// @name:zh-CN   google百度搜索屏蔽CSDN
// @namespace    https://github.com/fanyilun0/greasyfork
// @version      0.1
// @description  Automatically append "-csdn" to search queries to block CSDN results. Works for Google and Baidu search pages.
// @description:zh-CN  自动在搜索条件后面增加 -csdn， 以此屏蔽csdn网站信息。只适用于google和百度的搜索页面
// @author       fanyilun0
// @match        *://www.google.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/$
// @grant        none
// @license      MIT
// @compatible   firefox
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/524279/Block%20CSDN%20in%20GoogleBaidu%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/524279/Block%20CSDN%20in%20GoogleBaidu%20Search.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const className = {
    baidu: '.s_ipt',
    google: 'textarea.gLFyf',
  };
  const key = window.location.href.indexOf('://www.baidu.com') != -1 ? 'baidu' : 'google';
  const wordInput = document.querySelector(className[key]);
  console.log('match textarea', wordInput);
  if (wordInput) {
    wordInput.addEventListener('keydown', function (e) {
      if (e.key == 'Enter' && this.value.length > 0 && this.value.indexOf('-csdn') == -1) {
        this.value += ' -csdn';
      }
    });
    wordInput.addEventListener('blur', function () {
      if (this.value.length > 0 && this.value.indexOf('-csdn') == -1) {
        this.value += ' -csdn';
      }
    });
    wordInput.addEventListener('focus', function () {
      const index = this.value.indexOf(' -csdn');
      if (index != -1) {
        this.value = this.value.substring(0, index);
      }
    });
  }
})();
