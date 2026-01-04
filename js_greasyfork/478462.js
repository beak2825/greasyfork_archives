// ==UserScript==
// @name         culture bot
// @version      1.1.2
// @description  auto starts culture funcions
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/478462/culture%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/478462/culture%20bot.meta.js
// ==/UserScript==

(async function () {
    // wait for page to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

    var css_yellow = {'background': 'yellow no-repeat scroll -2px -3px'}

    var css_brown = {'background': 'brown no-repeat scroll -2px -3px'}

    // define bot
    culture_bot = {}

    // console log functions
    culture_bot.started_celebration_bot = function (celebration) {
        console.log('Started ' + celebration + ' bot!')
    }
    culture_bot.started_celebration = function (celebration) {
        console.log('Just started ' + celebration + '!')
    }
    culture_bot.new_celebrations_in = function (celebration, r) {
        console.log('Starting ' + celebration + ' again on: ' + new Date(Date.now() + r))
    }
    culture_bot.no_celebration = function (celebration, r) {
        console.log('No towns ready for ' + celebration + ', trying again on ' + new Date(Date.now() + r))
    }

    // start parties ajaxpost
    culture_bot.start_parties = function () {
        gpAjax.ajaxPost("town_overviews", "start_all_celebrations",  {celebration_type:"party"}, !1, function (b) {});
    }

    // start theaters ajaxpost
    culture_bot.start_theaters = function () {
        gpAjax.ajaxPost("town_overviews", "start_all_celebrations", {celebration_type:"theater"}, !1, function (b) {});
    }

    // start games ajaxpost
    culture_bot.start_games = function () {
        gpAjax.ajaxPost("town_overviews", "start_all_celebrations", {celebration_type:"games"}, !1 , function (b) {});
    }

    // start triumphs ajaxpost
    culture_bot.start_triumphs = function () {
        gpAjax.ajaxPost("town_overviews", "start_all_celebrations", { celebration_type: 'triumph' }, !1, function (b) {});
    }

    culture_bot.active_celebrations = function (celebrations, towns) {
        let result = []
        for (let i = 0; i < celebrations.length; i++) {
            for (let index in towns) {
                if (towns[index] == celebrations[i]) {
                    result.push(towns[index])
                }
            }
        }
        return result
    }

    // add bot button
    culture_bot.add_menu_button_to_toolbar = function () {
        $('<div class="activity_wrap"><div class="activity start_culture"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        culture_button = $('div .start_culture')
        culture_button.css(css_brown)
        culture_button.on('click', culture_bot.start_tool)
        culture_button.on('click', culture_bot.switch)
    }

    culture_bot.switch = function () {
        culture_bot.on = !culture_bot.on;
        if (culture_bot.on == true) {
            culture_bot.started_celebration_bot();
            culture_bot.start_culture_1();
        } else {
            culture_bot.stop_tool();
        }
    }

    // party bot
    culture_bot.start_party_bot = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 1800 * 1000);
        let parties = Object.entries(MM.getModels().Celebration).filter(celebration => celebration[1].get("celebration_type") == "party").map(celebration => celebration[1].get('town_id'))
        const towns = Object.keys(MM.getModels().Town);

        // create array with all towns_ids holding parties
        let parties_towns = culture_bot.active_celebrations(parties, towns)

        let available_parties = 0

        // counts amount of towns ready to party
        towns.forEach(function (town_id) {
            if (MM.getModels().Buildings[town_id].get('academy') >= 30 && !(parties_towns.includes(town_id)) && MM.getModels().Town[town_id].get('stone') >= 18000 && MM.getModels().Town[town_id].get('wood') >= 15000 && MM.getModels().Town[town_id].get('iron') >= 15000) {
                available_parties++
            } else if (MM.getModels().Buildings[town_id].get('academy') >= 30 && !(parties_towns.includes(town_id))) {
                rgr.show_shipments('party', 'fast', 'fast only');
                rgr.send_shipments();
            }
        });

        // start parties if possible & set cooldown
        if (available_parties > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_parties, 100)
            setTimeout(culture_bot.started_celebration, 150, 'party')
            culture_bot.partyloop = setTimeout(culture_bot.start_party_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'party', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'party', r)
            culture_bot.partyloop = setTimeout(culture_bot.start_party_bot,  r)
        }
    }

    // theater bot
    culture_bot.start_theater_bot = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 1800 * 1000);
        let theaters = Object.entries(MM.getModels().Celebration).filter(celebration => celebration[1].get("celebration_type") == "theater").map(celebration => celebration[1].get('town_id'))
        const towns = Object.keys(MM.getModels().Town);

        let theater_towns = culture_bot.active_celebrations(theaters, towns)

        let available_theaters = 0

        towns.forEach(function (town_id) {
            if (MM.getModels().Buildings[town_id].get('theater') == 1 && !(theater_towns.includes(town_id)) && MM.getModels().Town[town_id].get('stone') >= 12000 && MM.getModels().Town[town_id].get('wood') >= 10000 && MM.getModels().Town[town_id].get('iron') >= 10000) {
                available_theaters++
            } else if (MM.getModels().Buildings[town_id].get('theater') == 1 && !(theater_towns.includes(town_id))) {
                rgr.show_shipments('theater', 'fast', 'fast only');
                rgr.send_shipments();
            }
        });

        if (available_theaters > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_theaters, 100)
            setTimeout(culture_bot.started_celebration, 150, 'theater')
            culture_bot.theaterloop = setTimeout(culture_bot.start_theater_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'theater', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'theater', r)
            culture_bot.theaterloop = setTimeout(culture_bot.start_theater_bot,  r)
        }
    }


    // games bot
    culture_bot.start_game_bot = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 900 * 1000);
        let games = Object.entries(MM.getModels().Celebration).filter(celebration => celebration[1].get("celebration_type") == "games").map(celebration => celebration[1].get('town_id'))
        const towns = Object.keys(MM.getModels().Town);

        let games_towns = culture_bot.active_celebrations(games, towns)

        let available_games = 0

        towns.forEach(function (town_id) {
            if (MM.getModels().Buildings[town_id].get('academy') >= 30 && Number(document.evaluate('//*[@id="ui_box"]/div[11]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML) >= 50 && !(games_towns.includes(town_id))) {
                available_games++
            }
        });

        if (available_games > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_games, 100)
            setTimeout(culture_bot.started_celebration, 150, 'games')
            culture_bot.gameloop = setTimeout(culture_bot.start_game_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'games', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'games', r)
            culture_bot.gameloop = setTimeout(culture_bot.start_game_bot, r)
        }
    }


    // triumphs bot
    culture_bot.start_triumph_bot = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 1800 * 1000);
        let triumphs = Object.entries(MM.getModels().Celebration).filter(celebration => celebration[1].get("celebration_type") == "triumph").map(celebration => celebration[1].get('town_id'))
        const towns = Object.keys(MM.getModels().Town);

        let triumph_towns = culture_bot.active_celebrations(triumphs, towns)

        let available_triumphs = 0

        towns.forEach(function (town_id) {
            if (MM.getModels().Buildings[town_id].get('academy') >= 30 && Number(document.evaluate('/html/body/div[1]/div[5]/div[4]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML) >= 300 && !(triumph_towns.includes(town_id))) {
                available_triumphs++
            }
        });

        if (available_triumphs > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_triumphs, 100)
            setTimeout(culture_bot.started_celebration, 150, 'triumph')
            culture_bot.triumphloop = setTimeout(culture_bot.start_triumph_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'triumph', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'triumph', r)
            culture_bot.triumphloop = setTimeout(culture_bot.start_triumph_bot,  r)
        }
    }

    culture_bot.stop_all_culture = function () {
        clearTimeout(culture_bot.partyloop);
        clearTimeout(culture_bot.theaterloop);
        clearTimeout(culture_bot.gameloop);
        clearTimeout(culture_bot.triumphloop);
    }

    culture_bot.stop_tool = function () {
        culture_button.css(css_brown);
        culture_bot.stop_all_culture();
        culture_bot.status = "Not doing auto culture at this time.";
    }

    culture_bot.start_tool = function () {
        culture_button.css(css_yellow);
        var r = Math.floor(Math.random() * 300 * 1000 + 1800 * 1000);
        culture_bot.start_party_bot();
        culture_bot.start_theater_bot();
        culture_bot.status = "Next culture in: " + new Date(Date.now() + r);
    }

    // add buttons
    culture_bot.add_menu_button_to_toolbar()

})();