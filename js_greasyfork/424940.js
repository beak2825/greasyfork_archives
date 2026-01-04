// ==UserScript==
// @name         Kadoatery
// @namespace    neopets
// @version      2021.04.08
// @description  not complete yet
// @match        http://www.neopets.com/games/kadoatery/index.phtml*
// @match        http://www.neopets.com/inventory.phtml
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/424940/Kadoatery.user.js
// @updateURL https://update.greasyfork.org/scripts/424940/Kadoatery.meta.js
// ==/UserScript==

const PRICE_LIMIT = 50000;
const LIST_POSITION = 3;
const showList = true;

/*-------------------------------------*/

if (!GM_getValue) {
    GM_getValue = (key, def) => localStorage[key] || def;
    GM_setValue = (key, value) => localStorage[key] = value;
}

/*-------------------------------------*/

var d = document;
var url = window.location.href;
const html = $("html").html();

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$.fn.exists = function () {
    return this.length > 0;
};

/*-------------------------------------*/

if ($("#nst").exists()) {
    var nst = $("#nst").text().replace(" NST", "");
    var NST = `[${nst}] `;
}

// Toggle auto modes
if (!GM_getValue("Settings")) {
    let Settings = {
        inventory: [], // Log inventory
        lastRef: "unknown", // Last refresh time
        lastnum: 0, // Previous # of available kadfoods
        blacklistID: [],
        post: ''
    };
    GM_setValue("Settings", Settings);
}
var Settings = GM_getValue("Settings");

/*-------------------------------------*/

// Get inventory list
if (url.includes("inventory")) {
    // // Pre-beta inventory
    // let items = [];
    // let item = $(".inventory:first a[onclick*='openwin']");
    // for (let i = 0; i < item.length; i++) {
    // 	let name = item.eq(i).parent().contents().eq(2).text();
    // 	items.push(name);
    // }
    // Settings.inventory = items;
    // GM_setValue("Settings", Settings);

    // New Beta inventory
    $(document).ajaxSuccess(function (event, xhr) {
        let items = [];
        const response = xhr?.responseText;
        if (response) {
            const $response = $($.parseHTML(response));
            $response.find(".item-name").each(function (index, element) {
                const item = element.innerHTML;
                items.push(item);
            });
        }
        Settings.inventory = items;
        GM_setValue("Settings", Settings);
    });
}

// Kadoatery
if (url.includes("kadoatery")) {

    var kad = $(".content td:has('strong'):not(:contains('Thanks,'))");
    var newPost = false;

    if ((kad.length - Settings.lastnum) > 0) {
        Settings.lastRef = nst;
        newPost = true;
    }

    $('<style>.kadtime {text-align: center; color: red; font-size: 125%;}</style>').appendTo("head");
    $("#content").find("div:first").before(`<div id="kadtime" class="kadtime">Last refresh: ${Settings.lastRef}</div>`);

    Settings.lastnum = kad.length;
    GM_setValue("Settings", Settings);

    if (showList === true) {
        $("form[action*='objects']").before(`<div id="kadpost">${Settings.post}</div><br><br>`);
    }

    if (kad.length === 0) {

        // Clear blacklist if all are fed
        Settings.blacklistID = [];
        GM_setValue("Settings", Settings);

        //console.log(NST + "No available kad");
        setTimeout(function () {
            location.reload();
        }, rand(1000, 3000));

    }
    else {
        var match = false;
        var kadfoods = [];
        for (var i = 0; i < kad.length; i++) {
            let item = $(kad[i]).find("strong").eq(1).html();
            kadfoods.push(item);
            for (var j = 0; j < Settings.inventory.length; j++) {
                if (kadfoods[i] === Settings.inventory[j]) {
                    match = true;
                    console.log(`Feeding ${kadfoods[i]}`);
                    $(kad[i]).find("a[href*='feed']").get(0).click();
                }
            }
        }

        if (match === false) {

            var post = '';
            (async () => {
                for (var k = 0; k < kadfoods.length; k++) {

                    var random = Math.floor(Math.random() * kadfoods.length);
                    var random_kad = kadfoods[random];

                    try {
                        var id = $(kad[random]).find("a[href*='feed']").attr("href").match(/\d+/g)[0];
                        if (Settings.blacklistID.includes(id)) {

                            if (k === (kadfoods.length - 1)) {
                                // If all kads are blacklisted, refresh
                                setTimeout(function () {
                                    location.reload();
                                }, rand(1000, 3000));
                                break;
                            }
                            else {
                                // if not, try to SSW the next available food
                                continue;
                            }
                        }
                    } catch (e) {
                        console.log(e.message);
                    }

                    console.log(`%c${NST}Available kad!`, "color: lime");
                    $(kad[random]).css({
                        "background-color": "lime"
                    });

                    var sswOutcome = await ssw(random_kad, PRICE_LIMIT, LIST_POSITION);

                    if (sswOutcome === false) {
                        console.log(`Blacklisting ${id}`);
                        Settings.blacklistID.push(id);
                        GM_setValue("Settings", Settings);
                        // continue;
                    }
                    else {
                        break;
                    }

                }

                if (showList === true) {
                    for (k = 0; k < kadfoods.length; k++) {
                        post += `${kadfoods[k]}<br>`;
                        if ((k + 1) % 4 === 0) { // 3, 7, 11, 15, 19
                            post += "<br>";
                        }
                    }
                    post += `Last refresh @ ${Settings.lastRef}`;

                    if (newPost === true) {
                        Settings.post = post;
                        $("#kadpost").html(Settings.post);
                        GM_setValue("Settings", Settings);
                    }
                }

            })();
        }
    }
}

/*-------------------------------------*/

function ssw(item, limit = 0, position = 1) {
    return new Promise(resolve => {
        console.log(`Buying ${item}`);

        var index = position - 1;
        var itemname = item.replace(/ /g, "+");

        console.time("SSW time taken");

        $.ajax({
            url: `http://www.neopets.com/shops/ssw/ssw_query.php?q=${itemname}&priceOnly=0&context=0&partial=0&min_price=&max_price=&lang=en&json=1`,
            async: true,
            timeout: 10000,
            success: function (result) {

                console.timeEnd("SSW time taken");

                var price = parseInt(result?.data.prices[index]);
                if (price < limit || limit === 0) {

                    var shoplink = result.data.links[index].match(/\/browseshop[^']+/g)[0];
                    window.open(shoplink);
                    resolve(true);

                }
                else {

                    if (isNaN(price)) {
                        console.log(`${item} is an unbuyable item`);
                    }
                    else {
                        console.log(`${item} is priced at ${price} NP, above the limit of ${limit} NP`);
                    }
                    resolve(false);
                }
            }
        });
    });
}

function buyItem(referer, link) {
    fetch(link, {
        "referrer": referer,
        "method": "GET"
    }).then(response => console.log(response))
}