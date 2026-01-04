// ==UserScript==
// @name           Full header string binance
// @namespace      https://greasyfork.org/en/users/159342-cleresd
// @description    Full header string binance. Yeap.
// @version        1.01
// @match          https://www.binance.com/ru/futuresng/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/406174/Full%20header%20string%20binance.user.js
// @updateURL https://update.greasyfork.org/scripts/406174/Full%20header%20string%20binance.meta.js
// ==/UserScript==

setTimeout(function(){
document.querySelectorAll('div[name=subheader] > div:nth-child(1) > div:nth-child(1)')[0].remove()
document.querySelectorAll('div[name=subheader] > div:nth-child(1) > div:nth-child(1)')[0].style.display = "table";
}, 500);