// ==UserScript==
// @name          Сумма платежей в профиле Lolzteam
// @description	  Расширение, которое возвращает сумму платежей в Lolzteam
// @author        MALWARE
// @homepage      https://t.me/immalware/
// @include       https://lolz.guru/market/user/*/payments
// @namespace     lolzteam_payment_history
// @run-at        document-end
// @version       1.1
// @license       MIT
// @icon          https://lolz.guru/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/445004/%D0%A1%D1%83%D0%BC%D0%BC%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%B5%D0%B9%20%D0%B2%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%20Lolzteam.user.js
// @updateURL https://update.greasyfork.org/scripts/445004/%D0%A1%D1%83%D0%BC%D0%BC%D0%B0%20%D0%BF%D0%BB%D0%B0%D1%82%D0%B5%D0%B6%D0%B5%D0%B9%20%D0%B2%20%D0%BF%D1%80%D0%BE%D1%84%D0%B8%D0%BB%D0%B5%20Lolzteam.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
/* jshint esversion:6 */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms));}
let currentScrollHeight = 0;
while (true) {
  currentScrollHeight = document.body.scrollHeight;
  window.scrollTo(0, currentScrollHeight);
  await(sleep(2500));
  if (currentScrollHeight === document.body.scrollHeight) {
      break;
  }
}
window.scrollTo(0, 0);
var div = document.createElement('div');
div.innerHTML = '<div class="marketIndex--titleContainer" style="padding: 0px 0px 20px; display: "><div class="bottom"><div class="paymentStats"><div class="fl_l title">Сумма платежей за <span class="Label">всё время</span></div><div class="fl_r stats"><span class="stat bold mainc">+ <span class="Incomes">'+eval($(".in").text().replace(/\s/g, ''))+'</span> <span class="svgIcon--rub green fs-17px bold"></span></span><span class="stat bold"><span class="Outgoings">'+eval("- "+$(".out").text().replace(/\/ [\d.]+/g, '').replace(/[\n\t]/g, '-').replace(/\-+/g, '-').replace(/\s/g, '').replace(/\-$/, ''))+'</span> <span class="svgIcon--rub fs-17px bold"></span></span></div></div></div></div>';
var container = document.getElementsByClassName('market--userPaymentsFilter')[0];
container.insertBefore(div, container.firstChild);