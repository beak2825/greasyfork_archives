// ==UserScript==
// @name         farm bot
// @version      1.0
// @description  farms resources every 10 minutes
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/463182/farm%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/463182/farm%20bot.meta.js
// ==/UserScript==

(async function () {
        // wait for page to load
        const sleep = (n) => new Promise((res) => setTimeout(res, n));
        await sleep(2000)

        // define the bot
        farm_bot = {}
        farm_bot.farm_next = new Date(Date.now())

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

        farm_bot.open_menu = function () {
            GPWindowMgr.Create(GPWindowMgr.TYPE_DIALOG, "farm bot");
            farm_bot.window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_DIALOG)
            farm_bot.window.setPosition(['center', 'center']);
            farm_bot.window.setSize(250, 100)
            farm_bot.window.setContent2('Next farm on: ' + farm_bot.farm_next.toTimeString().slice(0, 8));
        }

        // setup functions
        farm_bot.bd_status = function () {
            var a = {
                count: 0,
                max_wait: 9999,
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
        farm_bot.start_farm = function () {
            var now = readableUnixTimestamp(Date.now() / 1000)
            var s = farm_bot.bd_status();

            if (s.ready > 0) {
                let r = Math.floor(Math.random() * 60 * 1000 + 600 * 300);
                console.log(now + ' farmer: ' + s.ready + ' farms ready')
                TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
                setTimeout(farm_bot.farm_10_minute, 100)
                setTimeout(farm_bot.just_farmed, 150)
                setTimeout(farm_bot.start_farm, r)
                setTimeout(farm_bot.farm_again_in, 200, r)
                farm_bot.farm_next = new Date(Date.now() + r)
            } else {
                // no available farms
                let r = Math.floor(Math.random() * 60 * 1000);
                setTimeout(farm_bot.start_farm, s.max_wait * 1000 + r)
                setTimeout(farm_bot.no_farm_towns_available, 150, s, r)
                farm_bot.farm_next = new Date(Date.now() + s.max_wait * 1000 + r)
            }
        }

        // add button to toolbar in game
        farm_bot.add_menu_button_to_toolbar = function () {
            $('<div class="activity_wrap"><div class="activity bd_farm"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

            var css = {
                'background' : 'transparent url("data:image/png;base64,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")  no-repeat scroll -2px -3px',
            }
            var farm_button = $('div .bd_farm');
            farm_button.css(css);
            farm_button.on('click', farm_bot.start_farm);
            farm_button.on('click', farm_bot.started_bot);
            farm_button.on('dblclick', farm_bot.open_menu);

        }

        // actual farm ajaxpost function
        farm_bot.farm_10_minute = function () {
            gpAjax.ajaxPost('farm_town_overviews', 'claim_loads_multiple', {towns: Object.keys(ITowns.towns).map(i=>Number(i)),time_option_base: 300,time_option_booty: 600,claim_factor: "normal",town_id: Number(Game.townId),nl_init: true});
        }

        // add button
        farm_bot.add_menu_button_to_toolbar();
    }
)();