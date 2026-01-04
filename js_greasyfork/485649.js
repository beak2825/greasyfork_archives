// ==UserScript==
// @name        淘宝网添加显示评价按钮
// @namespace   _shc0743
// @match       https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @grant       none
// @version     1.1
// @author      shc0743
// @description 能够直接打开一些显示为“双方已评”又点不开的评价
// @run-at      document-end
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/485649/%E6%B7%98%E5%AE%9D%E7%BD%91%E6%B7%BB%E5%8A%A0%E6%98%BE%E7%A4%BA%E8%AF%84%E4%BB%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/485649/%E6%B7%98%E5%AE%9D%E7%BD%91%E6%B7%BB%E5%8A%A0%E6%98%BE%E7%A4%BA%E8%AF%84%E4%BB%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==


(function () {
  setTimeout(function () {
    const boughtRoot = document.getElementById('tp-bought-root');
    boughtRoot.addEventListener('click', function (ev) {
      const el = ev.target;
      if (!el) return;
      if (!el.className.includes('text-mod__link')) return;
      if (el.tagName.toUpperCase() === 'A') return;
      if (!(el.innerText === '双方已评' || el.innerText === '我已评价')) {
        console.info('[ignored]', el);
        return;
      }
      const rnd = 'ddi-rnd__-' + ((new Date().getTime()) + (Math.floor(Math.random() * 1e10)));
      el.dataset.ddiRndData = rnd;
      const idElem = boughtRoot.querySelector(`.js-order-container > div[data-id]:has([data-ddi-rnd-data="${rnd}"])`);
      let tradeId = null;
      if (idElem) {
        tradeId = idElem.dataset.id || null;
      }
      if (!tradeId) {
        tradeId = prompt('未能从HTML结构中找到订单号。请尝试在下面手动输入订单号。');
        if (!tradeId) return;
      }
      openRatePage(tradeId);
    })

  }, 5000);

  function openRatePage(id) {
    return window.open('https://rate.taobao.com/RateDetailBuyer.htm?parent_trade_id=' + id);
  }
}());
