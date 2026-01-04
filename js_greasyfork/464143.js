// ==UserScript==
// @name         Easy e-drink buyer
// @namespace    TORN
// @version      1.0
// @description  Shows how much money per energy while buying e-drinks on imarket
// @author       htys[1545351]
// @match        https://www.torn.com/imarket.php*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/464143/Easy%20e-drink%20buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/464143/Easy%20e-drink%20buyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    const interval = setInterval(updatePage, 500);

    const item_dict = { "985": 5, "986": 10, "987": 15, "530": 20, "553": 20, "532": 25, "554": 25, "533": 30, "555": 30 };
    const name_dict = {
        "Can of Goose Juice": 5,
        "Can of Damp Valley": 10,
        "Can of Crocozade": 15,
        "Can of Munster": 20,
        "Can of Santa Shooters": 20,
        "Can of Red Cow": 25,
        "Can of Rockstar Rudolph": 25,
        "Can of X-MASS": 30,
        "Can of Taurine Elite": 30
    };

    function updatePage() {
        for (let id in item_dict) {
            const $searchname = $(".searchname[item=" + id + "]");
            if ($searchname.length > 0 && $searchname.attr("hint") != "yes") {
                $searchname.attr("hint", "yes");
                const price = $searchname.siblings().text().split("(")[0].trim();
                const price_per_e = formatMoney(parseInt(formatMoney(price) / item_dict[id]));
                const display_html = `(${item_dict[id]}E) ${price}<span class="t-red">(${price_per_e}/e)</span>`
                $searchname.html(display_html);
            }
        }

        const $item_name = $("li.item-name");
        if ($item_name.length > 0) {
            $item_name.each(function(index, value) {
                if ($(this).attr("hint") != "yes") {
                    $(this).attr("hint", "yes");

                    let name = $(this).children(".item-t").text().trim();
                    if (name.indexOf("(") > 0) {
                        name = name.split("(")[0].trim();
                    }

                    if (name in name_dict) {
                        const $cost_price = $(this).siblings("li.cost").children("span.cost-price");

                        if ($cost_price.length > 0) {
                            const price = $cost_price.text();
                            const price_per_e = formatMoney(parseInt(formatMoney(price) / name_dict[name]));
                            const display_html = `<span class="t-red">(${price_per_e}/e)</span> ${price}`;
                            $cost_price.html(display_html);
                        } else {
                            const $cost = $(this).siblings("li.cost");
                            const price = $cost.text().split(":")[1].trim();
                            const price_per_e = formatMoney(parseInt(formatMoney(price) / name_dict[name]));
                            const display_html = `<span class="t-show bold">Price:</span><span class="t-red">(${price_per_e}/e)</span> ${price}`;
                            $cost.html(display_html);
                        }
                    }
                }
            });
        }
    }

    function formatMoney(num) {
        if (num.toString().indexOf('$') >= 0) {
            return Number(num.replace(/\$|,/g, ''));
        } else if (!Number.isNaN(Number(num))) {
            return num.toString().replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) { return s + "," }).replace(/^[^\$]\S+/, function(s) { return "$" + s });
        } else {
            return 0;
        }
    }
})();