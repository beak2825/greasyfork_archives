// ==UserScript==
// @name        自動選取所有欠費
// @namespace   fykuan
// @include     http*://www.fetc.net.tw/UX/*
// @grant       none
// @version     1.0
// @author      fykuan@gmail.com
// @description https://github.com/fykuan/fetc_select_all/
// @require     https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/396381/%E8%87%AA%E5%8B%95%E9%81%B8%E5%8F%96%E6%89%80%E6%9C%89%E6%AC%A0%E8%B2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/396381/%E8%87%AA%E5%8B%95%E9%81%B8%E5%8F%96%E6%89%80%E6%9C%89%E6%AC%A0%E8%B2%BB.meta.js
// ==/UserScript==


checkThem([].slice.call(document.querySelectorAll('input[type="checkbox"]')));

setMutationHandler(document, 'input[type="checkbox"]', checkThem);

function checkThem(nodes) {
    nodes.forEach(function(n) { n.checked = true });
}