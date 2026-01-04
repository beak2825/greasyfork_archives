// ==UserScript==
// @namespace stealthyxor
// @name     Chikhen Real Earnings & Auto Collect
// @description Show actual earnings based on "Estimated Eggs Per Hour Production" for chickhen.com since their Calculator is simply wrong. Also automatically sells eggs, buys raven, reloads page.
// @version  2
// @grant    none
// @include  https://chikhen.com/farm
// @downloadURL https://update.greasyfork.org/scripts/411873/Chikhen%20Real%20Earnings%20%20Auto%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/411873/Chikhen%20Real%20Earnings%20%20Auto%20Collect.meta.js
// ==/UserScript==
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

var eph_div = Array.from(document.querySelectorAll('div.box.text-center'))
  .find(el => el.textContent.includes('Estimated Eggs Per Hour Production'));

var rate = parseInt(eph_div.childNodes[3].textContent);

eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode('Spendable (70%):'));
eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode(`${precisionRound(rate*0.007, 2)} h / ${precisionRound(rate*0.007*24, 2)} d / ${precisionRound(rate*0.007*24*7, 2)} w / ${precisionRound(rate*0.007*24*7*52/12, 2)} m`));
eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode('Earnings: (30%)'));
eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode(`${precisionRound(rate*0.003, 2)} h / ${precisionRound(rate*0.003*24, 2)} d / ${precisionRound(rate*0.003*24*7, 2)} w / ${precisionRound(rate*0.003*24*7*52/12, 2)} m`));
eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode('BTC:'));
eph_div.appendChild(document.createElement("br"));
eph_div.appendChild(document.createTextNode(`${precisionRound(rate*0.003/1e8, 8).toFixed(8)} h / ${precisionRound(rate*0.003*24/1e8, 8).toFixed(8)} d / ${precisionRound(rate*0.003*24*7/1e8, 8).toFixed(8)} w / ${precisionRound(rate*0.003*24*7*52/12/1e8, 8).toFixed(8)} m`));

// if theres a dialog button 'OK' click it to close
let ok_buttons = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('OK'));
if (!!ok_buttons)
  ok_buttons.click();

let chicken_rows = Array.from(document.querySelectorAll('div.row')).filter(el => el.children.length == 9);
let chicken_rows_sellable = chicken_rows.find(el => !!el.children[7].children[1].textContent && parseInt(el.children[7].children[1].textContent) >= 100);
if (!!chicken_rows_sellable) {
    chicken_rows_sellable.querySelector('button').click();
} else {
  let current_gold = document.querySelector('span.gold-digits').textContent;
  if (current_gold >= 150) {
    let raven_to_buy = Math.floor(current_gold/150);
    let raven_buy_button = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('BUY Raven CHICKS'));
    raven_buy_button.click();
    let input_amount = document.querySelector('input#Amount');
    input_amount.value = raven_to_buy;
    raven_buy_button = Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Buy Now!'));
    raven_buy_button.click();
  }

	setTimeout(function(){ location.reload(); }, 60*1000);
}