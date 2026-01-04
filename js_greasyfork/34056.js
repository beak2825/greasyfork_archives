// ==UserScript==
// @name         BUY WITHOUT HESITATION FOR TAOBAO
// @namespace    http://i0.md
// @version      0.1
// @description  BUY WITHOUT HESITATION
// @author       ieb
// @match        https://h5.m.taobao.com/cart/order.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34056/BUY%20WITHOUT%20HESITATION%20FOR%20TAOBAO.user.js
// @updateURL https://update.greasyfork.org/scripts/34056/BUY%20WITHOUT%20HESITATION%20FOR%20TAOBAO.meta.js
// ==/UserScript==
function test() {
    var cfa = document.querySelectorAll(".cell.fixed.action");
    if (cfa.length === 0) setTimeout(test, 100);
    cfa[0].click();
}
(function() {
    'use strict';
    test();
    // Your code here...
})();