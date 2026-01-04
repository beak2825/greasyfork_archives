// ==UserScript==
// @name        Data di scadenza delle offerte su Unieuro.it
// @match       *://*.unieuro.it/online/*
// @grant       none
// @version     1.0
// @license     GPL-3.0-or-later
// @require     https://cdnjs.cloudflare.com/ajax/libs/luxon/3.0.4/luxon.min.js
// @author      FrancescoRosi27 @ Pepper.it
// @description Un modo facile e veloce di scoprire quando scade un'offerta su Unieuro.it.
// @namespace https://greasyfork.org/users/719013
// @downloadURL https://update.greasyfork.org/scripts/453939/Data%20di%20scadenza%20delle%20offerte%20su%20Unieuroit.user.js
// @updateURL https://update.greasyfork.org/scripts/453939/Data%20di%20scadenza%20delle%20offerte%20su%20Unieuroit.meta.js
// ==/UserScript==
if (document.querySelector(`[data-header-cmspage="productDetails"]`) != null && JSON.parse(document.querySelector(`.container > [type="application/ld+json"]`).innerHTML).offers.priceValidUntil != "") {
  document.querySelector(".pdp-right__price-container").insertAdjacentHTML("beforeend", `<a id="data-scadenza-link" href="#" style="color: blue;">Data di scadenza dell'offerta</a>`);
  document.querySelector("#data-scadenza-link").addEventListener("click", () => {
    const dataAggiustata = JSON.parse(document.querySelector(`.container > [type="application/ld+json"]`).innerHTML).offers.priceValidUntil.replaceAll(` ${JSON.parse(document.querySelector(`.container > [type="application/ld+json"]`).innerHTML).offers.priceValidUntil.split(" ")[4]}`, "");
    alert(`Questa offerta scade ${luxon.DateTime.fromFormat(dataAggiustata, "ccc LLL dd TT yyyy").hour === 0 ? "a" : "alle"} ${luxon.DateTime.fromFormat(dataAggiustata, "ccc LLL dd TT yyyy").setLocale("it").toFormat("HH:mm")} del ${luxon.DateTime.fromFormat(dataAggiustata, "ccc LLL dd TT yyyy").setLocale("it").toFormat("dd LLLL")} (${luxon.DateTime.fromFormat(dataAggiustata, "ccc LLL dd TT yyyy").setLocale("it").toRelative()}).`);
  });
}