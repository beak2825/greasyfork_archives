// ==UserScript==
// @name         farm bot
// @version      1.5.2
// @description  farms resources every 10 minutes
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/477132/farm%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/477132/farm%20bot.meta.js
// ==/UserScript==

(async function () {
    // wait for page to load
    var sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)


    var css_red = {'background': 'red no-repeat scroll -2px -3px'}

    var css_green = {'background': 'green no-repeat scroll -2px -3px'}

    var css_blue = {'background': 'blue no-repeat scroll -2px -3px'}

    
    // define the bot
    farm_bot = {};
    farm_bot.farm_next = "Not yet farming at this time.";

    // log console functions
    farm_bot.started_bot = function () {
        console.log("Started the bot!")
    }
    farm_bot.just_farmed = function () {
        console.log("Farmed all farm villages")
    }
    farm_bot.no_farm_towns_available = function (s, r) {
        console.log("No farm towns available, trying again on: " + new Date(Date.now() + s.max_wait * 1000 + r)) // let user know when next farm is
    }
    farm_bot.farm_again_in = function (r) {
        console.log("Farming again on: " + new Date(Date.now() + r))
    }
    farm_bot.stopped_farming = function () {
        console.log("Stopped the bot!")
    }

    farm_bot.open_menu = function () {
        GPWindowMgr.Create(GPWindowMgr.TYPE_DIALOG, "farm bot");
        farm_bot.window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_DIALOG)
        farm_bot.window.setPosition(['center', 'center']);
        farm_bot.window.setSize(250, 100)
        if (typeof(farm_bot.farm_next) == "object") {
            farm_bot.window.setContent2('Next farm on: ' + farm_bot.farm_next.toTimeString().slice(0, 8));
        } else if (typeof(farm_bot.farm_next) == "string") {
            farm_bot.window.setContent2(farm_bot.farm_next);
        }
    }
    // setup functions
    farm_bot.bd_status = function () {
        var a = {
            count: 0,
            max_wait: 600,
            ready: 0,
            not_ready: 0
        }
        var farms = MM.getCollections().FarmTownPlayerRelation[0].models
        farms.forEach(function (farm) {
            if (farm.get('relation_status') == 1) {
                a.count++
                var wait = farm.getLootableAt() - Timestamp.now()
                if (wait > 0) {
                    a.not_ready++
                    // remember the maximum waiting time
                    if (wait < a.max_wait) a.max_wait = wait
                } else {
                    a.ready++
                }
            }
        })
        return a
    }

    // start farm
    farm_bot.start_tool = function () {
        var now = readableUnixTimestamp(Date.now() / 1000)
        var s = farm_bot.bd_status();

        farm_button.css(css_green);

        var t = Math.random();
        var tt = Math.floor(Math.random() * 1000 * 120 +  180* 1000 );

        if (t > 0.94) {
            sleep(tt);
        }
        if (s.ready > 0) {
            let r = Math.floor(Math.random() * 55 * 1000 + 1000 * 605);
            console.log(now + ' farmer: ' + s.ready + ' farms ready');
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '');
            setTimeout(farm_bot.farm_10_minute, 100);
            setTimeout(farm_bot.just_farmed, 150);
            farm_bot.farmloop = setTimeout(farm_bot.start_tool, r);
            setTimeout(farm_bot.farm_again_in, 200, r);
            farm_bot.farm_next = new Date(Date.now() + r);
        } else {
            // no available farms
            let r = Math.floor(Math.random() * 55 * 1000 + 1000 * 5);
            setTimeout(farm_bot.start_tool, s.max_wait * 1000 + r)
            setTimeout(farm_bot.no_farm_towns_available, 150, s, r)
            farm_bot.farm_next = new Date(Date.now() + s.max_wait * 1000 + r)
        }
    }

    // stop farm
    farm_bot.stop_tool = function () {
        farm_button.css(css_red);
        clearTimeout(farm_bot.farmloop);
        farm_bot.stopped_farming();
        farm_bot.farm_next = "Not farming at this time.";
    }

    // add button to toolbar in game
    farm_bot.add_menu_button_to_toolbar = function () {
        $('<div class="activity_wrap"><div class="activity bd_farm"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        farm_button = $('div .bd_farm');

        farm_button.css(css_red);
        farm_button.on('click', farm_bot.switch);

        $('<div class="activity_wrap"><div class="activity bd_farm_time"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        time_button = $('div .bd_farm_time');

        time_button.css(css_blue)
        time_button.on('click', farm_bot.open_menu);




    }

    // start or stop bot
    farm_bot.switch = function () {
        farm_bot.on = !farm_bot.on;
        if (farm_bot.on == true) {
            farm_bot.start_tool();
            farm_bot.started_bot();
        } else {
            farm_bot.stop_tool();
        }
    }

    // actual farm ajaxpost function
    farm_bot.farm_10_minute = function () {
        var towns = Object.keys(ITowns.towns).sort((a, b) => (MM.getModels().Town[a].attributes.name > MM.getModels().Town[b].attributes.name) ? 1 : -1).map(i => Number(i));
        gpAjax.ajaxPost('farm_town_overviews', 'claim_loads_multiple', {towns: towns,time_option_base: 300,time_option_booty: 600,claim_factor: "normal",town_id: Number(Game.townId),nl_init: true});
    }

    // add button
    farm_bot.add_menu_button_to_toolbar();

    console.log("added farm button");
}
)();