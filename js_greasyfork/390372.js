// ==UserScript==
// @name         当前标签页打开链接
// @namespace    juby
// @version      0.0.1
// @include      *
// @description  将在新标签页打开的网页链接改为在当前标签页打开
// @author       juby
// @match        *://*.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390372/%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/390372/%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.getElementsByTagName('a');
    for (let i=0; i < links.length; i++) {
      if (links[i].target === '_blank') {
        links[i].target = '_self';
      }
    }
})();