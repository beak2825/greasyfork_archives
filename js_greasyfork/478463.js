// ==UserScript==
// @name         cave bot
// @version      1.4.2
// @description  Stores excess silver in caves
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/478463/cave%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/478463/cave%20bot.meta.js
// ==/UserScript==

(async function () {
    // wait for page to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

    var css_grey = {'background': 'grey no-repeat scroll -2px -3px'}

    var css_black = {'background': 'black no-repeat scroll -2px -3px'}

    cave_bot = {}

    cave_bot.store_silver = function (amount) {
        gpAjax.ajaxPost("town_overviews", "store_iron_in_all_towns", {iron_to_keep: 22000, iron_to_store: amount},!1, function (b) {})
    }

    cave_bot.stored_silver = function (amount) {
        console.log("Stored a maximum of " + amount + " silver in all towns with silver over 20000.")
    }

    cave_bot.started_cave_mode = function () {
        console.log("Started the autocave bot.")
    }

    cave_bot.start_tool = function () {
        let r = Math.floor(Math.random() * 2000 * 1000 + 3600 * 1000);

        cave_button.css(css_grey);
        TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
        setTimeout(cave_bot.store_silver, 200, 10000)
        setTimeout(cave_bot.stored_silver, 250, 10000)
        caveloop = setTimeout(cave_bot.start_tool, r)
        cave_bot.cave_next = new Date(Date.now() + r)
    }

    cave_bot.add_menu_button_to_toolbar = function () {
        $('<div class="activity_wrap"><div class="activity cave_mode"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        cave_button = $('div .cave_mode');
        cave_button.css(css_black);
        cave_button.on('click', cave_bot.switch);

        console.log("added cave button")
    }

    cave_bot.stop_tool = function () {
        cave_button.css(css_black);
        clearTimeout(cave_bot.caveloop);
        cave_bot.cave_next = "Not storing silver at this time.";
    }

    cave_bot.switch = function () {
        cave_bot.on = !cave_bot.on;
        if (cave_bot.on == true) {
            cave_bot.start_tool();
            cave_bot.started_cave_mode();
        } else {
            cave_bot.stop_tool();
        }
    
    }

    cave_bot.switch = function () {
        cave_bot.on = !cave_bot.on;
        if (cave_bot.on == true) {
            cave_bot.start_tool();
            cave_bot.started_cave_mode();
        } else {
            cave_bot.stop_tool();
        }
    }

    cave_bot.add_menu_button_to_toolbar()

})();