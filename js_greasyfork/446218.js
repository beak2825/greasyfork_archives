// ==UserScript==
// @name   WaziriX Fees Bot
// @namespace http://tampermonkey.net/
// @version  0.8
// @description WazirX scripto for take all fees
// @match  http://*/*
// @match  https://wazirx.com/*
// @author  @teggyt
// @icon   https://wazirx.com/logo.png
// @grant GM_registerMenuCommand
// @run-at context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446218/WaziriX%20Fees%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/446218/WaziriX%20Fees%20Bot.meta.js
// ==/UserScript==


function simulateMouseClick(targetNode) {

   function triggerMouseEvent(targetNode, eventType) {
      var clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent(eventType, true, true);
      targetNode.dispatchEvent(clickEvent);
   }

   ["mouseover", "mousedown", "mouseup", "click"].forEach(function(eventType) {
      triggerMouseEvent(targetNode, eventType);
   });
};

function sleep(millis) {
    var t = (new Date()).getTime();
    var i = 0;
    while (((new Date()).getTime() - t) < millis) {
        i++;
    }
}

function getElementsByXPath(xpath, parent) {
   let results = [];
   let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

   for (let i = 0, length = query.snapshotLength; i < length; ++i) {
      results.push(query.snapshotItem(i));
   }
   return results;
}

function submitBuy() {
    return new Promise(function(resolve){
        setTimeout(function() {
            var submitBuyElement = getElementsByXPath("//button[@class='sc-dlfnuX eHzrFm']")[0];
            simulateMouseClick(submitBuyElement);
            resolve();
        }, 300);
    });
}

function submitSell() {
    return new Promise(function(resolve){
        setTimeout(function() {
            var submitSellElement = getElementsByXPath("//button[@class='sc-dlfnuX dzFSZe']")[0];
            simulateMouseClick(submitSellElement);
            resolve();
        }, 300);
    });
}

function sell() {
    return new Promise(function(resolve){
        setTimeout(function() {
            var sellElement = getElementsByXPath("//div[@id='exchange-sell-tab']")[0];
            simulateMouseClick(sellElement);
            resolve();
        }, 400);
    });
}

function buy() {
    return new Promise(function(resolve){
        setTimeout(function() {
            var buyElement = getElementsByXPath("//div[@id='exchange-buy-tab']")[0];
            simulateMouseClick(buyElement);
            resolve();
        }, 400);
    });
}

var seqRunner = function(deeds) {
    return deeds.reduce(function(p, deed) {
        return p.then(function() {
            return deed();
        });
    }, Promise.resolve()); }



async function run(count) {
    for (let i = 0; i < count; i++) {
       await seqRunner([buy, submitBuy, sell, submitSell]).then(function() {
        });
    }
    console.log ("Функция запуска запущена.")
}


console.log ("Запуск скрипта");

GM_registerMenuCommand ("Запуск", run(1000));
GM_registerMenuCommand ("Стоп", run.count = 0);