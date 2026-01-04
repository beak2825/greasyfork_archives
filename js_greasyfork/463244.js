// ==UserScript==
// @name         cave bot
// @version      1.0
// @description  Stores excess silver in caves
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/463244/cave%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/463244/cave%20bot.meta.js
// ==/UserScript==

(async function () {
    // wait for page to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

    cave_bot = {}

    cave_bot.store_silver = function (amount) {
        gpAjax.ajaxPost("town_overviews", "store_iron_in_all_towns", {iron_to_keep: 20000, iron_to_store: amount},!1, function (b) {})
    }

    cave_bot.stored_silver = function (amount) {
        console.log("Stored a maximum of " + amount + " silver in all towns with silver over 20000.")
    }

    cave_bot.started_cave_mode = function () {
        console.log("Started the autocave bot.")
    }

    cave_bot.start_cave_mode = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 3600 * 1000);

        TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
        setTimeout(cave_bot.store_silver, 200, 9000)
        setTimeout(cave_bot.stored_silver, 250, 9000)
        setTimeout(cave_bot.start_cave_mode, r)

    }

    cave_bot.add_menu_button_to_toolbar = function () {
        $('<div class="activity_wrap"><div class="activity cave_mode"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        var css = {
            'background': 'transparent url("data:image/png;base64,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") no-repeat scroll -2px -3px',
        }
        var cave_button = $('div .cave_mode');
        cave_button.css(css);
        cave_button.on('click', cave_bot.start_cave_mode);
        cave_button.on('click', cave_bot.started_cave_mode);

        console.log("added cave button")
    }

    cave_bot.add_menu_button_to_toolbar()

})();