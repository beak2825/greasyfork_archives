// ==UserScript==
// @name         TORN: Bazaar Repricing
// @namespace    dekleinekobini.private.bazaarrepricing
// @version      1.0.0
// @author       DeKleineKobini
// @description  Quickly edit bazaar prices.
// @match        https://www.torn.com/bazaar.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=753706
// @downloadURL https://update.greasyfork.org/scripts/393109/TORN%3A%20Bazaar%20Repricing.user.js
// @updateURL https://update.greasyfork.org/scripts/393109/TORN%3A%20Bazaar%20Repricing.meta.js
// ==/UserScript==

"use strict";

const SETTINGS = {
    amount: 1,
};

initScript({
    name: "Bazaar Pricing",
    logging: "ALL"
});

addCSS("bazaarpricing", "#cp-p, #cp-m { padding: 0px 4px; margin-bottom: 4px }")

runOnEvent(load, "hashchange", false);
$(document).ready(load);

function load() {
    let page = location.pathname.substring(1);
    let p = new URLSearchParams(getSpecialSearch()).get("p");

    if (page != "bazaar.php" || p != "manage") return;

    setTimeout(() => {
        $("#top-page-links-list > a:eq(2)").after("<a id='cp-p' class='button dkk-button right line-h24' target='_self' href='#'>Increase</a><a id='cp-m' class='button dkk-button right line-h24' target='_blank' href='#'>Decrease</a>");

        $("#cp-p").click((event) => checkEvent(event, "+"));
        $("#cp-m").click((event) => checkEvent(event, "-"));
    }, 350);
}

function checkEvent(event, type) {
    event.preventDefault();
    $(".price .input-money-group").each((index, element) => {
        let group = $(element).find("input");

        let input2 = group.eq(1);

        let percent = 1 + (SETTINGS.amount / 100);
        let price = type == "+" ? input2.attr("value") * percent : input2.attr("value") / percent;


        group.eq(0).val(price.format());
        input2.get(0).value = price;
    });
}