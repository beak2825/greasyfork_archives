// ==UserScript==
// @name         culture bot
// @version      1.0
// @description  auto starts culture funcions
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/463245/culture%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/463245/culture%20bot.meta.js
// ==/UserScript==

(async function () {
    // wait for page to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)

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

    // add options to context menu
    culture_bot.culture_options = function () {
        var html = ''
        html += '<p style="display:inline">Culture options:</p><br>';
        html += '<a href=# onclick="void(culture_bot.start_culture_1());">Activate automatic Parties, Theaters</a><br>';
        html += '<a href=# onclick="void(culture_bot.start_culture_2());">Activate automatic Parties, Theaters and Triumphs</a><br>';
        html += '<a href=# onclick="void(culture_bot.start_culture_3());">Activate automatic Parties, Theaters and Games</a><br>';
        html += '<a href=# onclick="void(culture_bot.start_culture_4());">Activate automatic Parties, Theaters, Triumphs and Games</a><br>';
        html += '<a href=# onclick="void(culture_bot.start_culture_5());">Activate automatic Games</a><br>';
        return html
    }


    // open culture menu
    culture_bot.open_menu = function () {
        GPWindowMgr.Create(GPWindowMgr.TYPE_DIALOG, "culture bot");
        culture_bot.window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_DIALOG)
        culture_bot.window.setPosition(['center', 'center']);
        culture_bot.window.setSize(500, 200)
        culture_bot.window.setContent2(culture_bot.culture_options());
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

        var css = {
            'background' :  'transparent url("data:image/png;base64,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")'
        }

        var party_button = $('div .start_culture')
        party_button.css(css)
        party_button.on('click', culture_bot.open_menu)
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
            }
        });

        // start parties if possible & set cooldown
        if (available_parties > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_parties, 100)
            setTimeout(culture_bot.started_celebration, 150, 'party')
            setTimeout(culture_bot.start_party_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'party', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'party', r)
            setTimeout(culture_bot.start_party_bot,  r)

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
            }
        });

        if (available_theaters > 0) {
            TownGroupOverview.setActiveTownGroup(-1, 'town_group_overviews', '')
            setTimeout(culture_bot.start_theaters, 100)
            setTimeout(culture_bot.started_celebration, 150, 'theater')
            setTimeout(culture_bot.start_theater_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'theater', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'theater', r)
            setTimeout(culture_bot.start_theater_bot,  r)
        }
    }


    // games bot
    culture_bot.start_game_bot = function () {
        let r = Math.floor(Math.random() * 180 * 1000 + 1800 * 1000);
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
            setTimeout(culture_bot.start_game_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'games', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'games', r)
            setTimeout(culture_bot.start_game_bot, r)
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
            setTimeout(culture_bot.start_triumph_bot, r)
            setTimeout(culture_bot.new_celebrations_in, 200, 'triumph', r)
        } else {
            setTimeout(culture_bot.no_celebration, 100, 'triumph', r)
            setTimeout(culture_bot.start_triumph_bot,  r)
        }
    }

    culture_bot.start_culture_1 = function () {
        setTimeout(culture_bot.start_party_bot, 100)
        setTimeout(culture_bot.start_theater_bot, 200)
    }

    culture_bot.start_culture_2 = function () {
        setTimeout(culture_bot.start_party_bot, 100)
        setTimeout(culture_bot.start_theater_bot, 200)
        setTimeout(culture_bot.start_triumph_bot, 300)
    }
    culture_bot.start_culture_3 = function () {
        setTimeout(culture_bot.start_party_bot, 100)
        setTimeout(culture_bot.start_theater_bot, 200)
        setTimeout(culture_bot.start_game_bot, 300)
    }
    culture_bot.start_culture_4 = function () {
        setTimeout(culture_bot.start_party_bot, 100)
        setTimeout(culture_bot.start_theater_bot, 200)
        setTimeout(culture_bot.start_triumph_bot, 300)
        setTimeout(culture_bot.start_game_bot, 400)
    }
    culture_bot.start_culture_5 = function () {
        setTimeout(culture_bot.start_game_bot, 100)
    }

    // add buttons
    culture_bot.add_menu_button_to_toolbar()

})();