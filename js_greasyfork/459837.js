// ==UserScript==
// @name         Конвертация курса тенге к рублю и доллару в Steam
// @namespace    Dr.VEX
// @version      0.0.3
// @author       Dr.VEX
// @description  Позволяет отображать цену в стиме в рублях и тенге и WMZ
// @license      MIT
// @homepage     https://github.com/VEXstar/scripts
// @homepageURL  https://github.com/VEXstar/scripts
// @supportURL   https://github.com/VEXstar/scripts/issues
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/
// @match        *://store.steampowered.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      tools.kaf-tau.space
// @connect      kaf-tau.space
// @downloadURL https://update.greasyfork.org/scripts/459837/%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BA%D1%83%D1%80%D1%81%D0%B0%20%D1%82%D0%B5%D0%BD%D0%B3%D0%B5%20%D0%BA%20%D1%80%D1%83%D0%B1%D0%BB%D1%8E%20%D0%B8%20%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80%D1%83%20%D0%B2%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/459837/%D0%9A%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%BA%D1%83%D1%80%D1%81%D0%B0%20%D1%82%D0%B5%D0%BD%D0%B3%D0%B5%20%D0%BA%20%D1%80%D1%83%D0%B1%D0%BB%D1%8E%20%D0%B8%20%D0%B4%D0%BE%D0%BB%D0%BB%D0%B0%D1%80%D1%83%20%D0%B2%20Steam.meta.js
// ==/UserScript==

let rubExchange = 0.17;
let USDExchange = 0.0022;

const rubCourse = (tenge) =>{return tenge*rubExchange};
const wmzCourse = (tenge) =>{return tenge*USDExchange};

function wellDone() {

  GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://tools.kaf-tau.space/exchange',
    onload:     function (responseDetails) {
                    const parsed = JSON.parse(responseDetails.responseText);
                    USDExchange = parsed["USD"];
                    rubExchange = parsed["RUB"];
                    console.log ("USD exchange",USDExchange,"RUB exchange", rubExchange, "lastUpdate", parsed["lastUpdate"]);
                    replacePrices();
                }
} );
}

function replacePrices() {
  const dfp = [].slice.call(document.getElementsByClassName("discount_final_price"));
  const dop = [].slice.call(document.getElementsByClassName("discount_original_price"));
  const price = [].slice.call(document.getElementsByClassName("price"));
  const all = dfp.concat(price);
  dop.forEach(el=>{el.innerText = ""});
  all.forEach(el=>{
    if(el.innerText.indexOf("Бесплатно") != -1 || el.innerText.indexOf("₸") == -1){
      return;
    }
    const oldText = el.innerText;
    const tengePrice = parseInt(oldText.replaceAll("₸","").replaceAll(" ",""));
    const rubPrice = Math.round(rubCourse(tengePrice));
    const wmzPrice = Math.round(wmzCourse(tengePrice));
    el.innerText = el.innerText + " ("+rubPrice+"₽ / "+wmzPrice+"USD)";
  });
  const oldBalanceText = document.getElementById("header_wallet_balance").innerText;
  const tengeBalance = parseFloat(oldBalanceText.replaceAll("₸","").replaceAll(" ",""));
  const rubPrice = Math.round(rubCourse(tengeBalance));
  const wmzPrice = Math.round(wmzCourse(tengeBalance));
  document.getElementById("header_wallet_balance").innerText = oldBalanceText + " ("+rubPrice+"₽ / "+wmzPrice+"USD)";
}

setTimeout(wellDone,1300);