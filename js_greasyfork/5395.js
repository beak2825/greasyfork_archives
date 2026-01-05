// ==UserScript==
// @name        Remove NicoNicoPedia Internal Links
// @namespace   yama-masa.com
// @description Clean off all the links to other articles in NicoNicoPedia.
// @include     http://dic.nicovideo.jp/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5395/Remove%20NicoNicoPedia%20Internal%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/5395/Remove%20NicoNicoPedia%20Internal%20Links.meta.js
// ==/UserScript==
(function(){
Array.forEach(
document.body.querySelectorAll('a.auto,a.auto-hdn,a.dic'), function(ele) {
    ele.parentNode.replaceChild(ele.firstChild, ele)
})
})();