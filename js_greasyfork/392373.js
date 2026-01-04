// ==UserScript==
// @name         TORN: Bazaar Pricing
// @namespace    dekleinekobini.private.bazaarpricing
// @version      1.1.0
// @author       DeKleineKobini
// @description  Quickly edit bazaar prices.
// @match        https://www.torn.com/bazaar.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/392373/TORN%3A%20Bazaar%20Pricing.user.js
// @updateURL https://update.greasyfork.org/scripts/392373/TORN%3A%20Bazaar%20Pricing.meta.js
// ==/UserScript==

"use strict";

const settings = {
    decrease: 1,
    increase: 1
};

setDebug(true);

/* --------------------
CODE - EDIT ON OWN RISK
-------------------- */
initScript("bazaarpricing", "Bazaar Pricing", "BP", false);

GM_addStyle(
    "a.button {-webkit-appearance: button; -moz-appearance: button; appearance: button; text-decoration: none; } "
    + ".bp-button { background-color: rgba(255, 255, 255, 0.15); color: rgb(255, 255, 255); padding: 1px 4px; }"
);

runOnEvent(load, "hashchange", false);
$(document).ready(load);

$(document).on('keyup keydown', function(e){
    settings.shifted = e.shiftKey
} );

function load() {
    let page = location.pathname.substring(1);
    let p = new URLSearchParams(getSpecialSearch()).get("p");

    if (page != "bazaar.php" || p != "manage") return;

    setTimeout(addButtons, 350);
}

function changeprices(type, amount) {
    $(".price .input-money-group").each((index, element) => {
        let group = $(element).find("input");

        let input1 = group.eq(0);
        let input2 = group.eq(1);

        let price = input2.attr("value") * 1;

        let percent = amount / 100;

        if (type == "increase") {
            price = price * (1 + percent);
        } else if (type == "decrease") {
            if (false && !settings.shifted) {
                price = price * (1 - percent);
            } else {
                price = price / (1 + percent);
            }
        }

        input1.val(price.format());
        input2.get(0).value = price;
    });
}

function addButtons() {
    let parent = $("#top-page-links-list > a:eq(2)");

    parent.after("<a id='changepriceIncrease' class='button bp-button right line-h24' target='_self' href='#'>Increase</a><a id='changepriceDecrease' class='button bp-button right line-h24' target='_blank' href='#'>Decrease</a>");

    $("#changepriceIncrease").click((event) => {
        changeprices("increase", settings.increase);
        event.preventDefault();
    });
    $("#changepriceDecrease").click((event) => {
        changeprices("decrease", settings.decrease);
        event.preventDefault();
    });
}