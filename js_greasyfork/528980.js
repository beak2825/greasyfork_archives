// ==UserScript==
// @name         Remove AppMock
// @namespace    http://tampermonkey.net/
// @version      2025-03-06
// @description  Remove the annoying plugin
// @author       zerosrat
// @match        https://qnh.shangou.test.meituan.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528980/Remove%20AppMock.user.js
// @updateURL https://update.greasyfork.org/scripts/528980/Remove%20AppMock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setInterval(() => {
      const appMockBtns = document.querySelectorAll('.app-mock-button')
      appMockBtns?.forEach(node => node.remove())
    }, 3000)
})();
