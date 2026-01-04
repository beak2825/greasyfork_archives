// ==UserScript==
// @name        CookieClicker trading bot
// @namespace   Violentmonkey Scripts
// @match       http://orteil.dashnet.org/cookieclicker/
// @match       https://orteil.dashnet.org/cookieclicker/
// @match       http://ozh.github.io/cookieclicker/
// @grant       none
// @version     1.0.8
// @author      lordratte
// @description  Automatically trade stocks
// @downloadURL https://update.greasyfork.org/scripts/434064/CookieClicker%20trading%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/434064/CookieClicker%20trading%20bot.meta.js
// ==/UserScript==

function trader_tick() {
  'use strict'
  let mgame = Game.Objects.Bank.minigame;
  let resting_values = mgame.goodsById.map(g => 10 * (g.id + 1) + Game.Objects.Bank.level - 1);

  function loop_goods(callback) {
    for (let good_id in mgame.goodsById.reverse()) {
      let good = mgame.goodsById[good_id];
      let sell_lim = resting_values[good_id];
      // price x (1 + broker_fee) <= resting_price
      // therefore: price <= resting_price / (1 + broker_fee)
      let buy_lim = sell_lim / (1 + 0.01 * (20 * Math.pow(0.95, mgame.brokers)));

      callback({
        'good': good,
        'sell_lim': sell_lim,
        'buy_lim': buy_lim
      });


    }
  }

  loop_goods(data => {
    if (data.good.val >= data.sell_lim) {
      mgame.sellGood(data.good.id, 20);
    }
  });
  loop_goods(data => {
    if (data.good.val < data.buy_lim) {
      mgame.buyGood(data.good.id, 20);
    }
  });

}

window.eval(trader_tick.toString() + ";" + "(" + (function() {
  'use strict';

  function load_trader() {
    try {
      Game.Objects.Bank.minigame.__old_tick = Game.Objects.Bank.minigame.tick;
      Game.Objects.Bank.minigame.tick = function() {
        this.__old_tick();
        trader_tick();
      }
      Sounds['snd/cashIn.mp3'] = {readyState:1};
      Sounds['snd/cashOut.mp3'] = {readyState:1};
      console.log('Trader loaded');
      return true;
    } catch {
      return false;
    }
  }

  var interval = setInterval(function() {
    if (Game && Game.ready && load_trader()) {
      clearInterval(interval);
    }
  }, 1000);
}).toString() + ")()");

// vim: ts=2 sw=2 sts=2
