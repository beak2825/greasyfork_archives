// ==UserScript==
// @name         Поиск скрытых планет. velox.kingstars.ru
// @namespace    tuxuuman:velox.kingstars.ru:searcher
// @version      1.1
// @description  Ищет скрытые планеты игрока
// @author       tuxuuman <mail: tuxuuman@gmail.com> <telegram: @syaomay>
// @match        *://velox.kingstars.ru/povelitel.php*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      http://velox.kingstars.ru/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/async@2.6.0/dist/async.min.js
// @require      https://cdn.jsdelivr.net/npm/async@2.6.0/dist/async.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/39453/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D1%85%20%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%20veloxkingstarsru.user.js
// @updateURL https://update.greasyfork.org/scripts/39453/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8B%D1%85%20%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82%20veloxkingstarsru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GALAXIES = 17;
    const SYSTEMS = 99;

    function galaxyPageQueriesData() {
        let queriesData = [];
        for(let gi = 1; gi <= GALAXIES; gi++)
            for(let si = 1; si <= SYSTEMS; si++)
                queriesData.push({ galaxy: gi, system: si });
        return queriesData;
    }

    function $ajax(url, options = {}) {
        if(options.method == "POST" && typeof(options.body) == "object" && !(options.body instanceof FormData)) {
            let form_data = new FormData();
            let data = options.body;
            for ( let key in data ) {
                form_data.append(key, data[key]);
            }
            options.body = form_data;
            //console.log('options.body', Array.from(options.body.values()));
        }

        return fetch(url, Object.assign({
            method: "GET",
            credentials : "include"
        }, options))
          .then(resp => resp.arrayBuffer())
          .then(buff => {
            var win1251 = new TextDecoder("windows-1251");
            return win1251.decode(buff);
        });

    }

    // ищет планеты в указанной системе
    function findPnalents(userId, options) {
        return $ajax("http://velox.kingstars.ru/galaxy.php?mode=1", {
            body: options,
            method: "POST"
        })
        .then(html => {
            let doc = $.parseHTML(html);
            doc = $(doc);
            let tr = doc.find('td.fonbuildl > table.needres > tbody> tr:gt(1)');
            let planets = [];
            tr.each((i, e) => {
                if (i % 2 == 1) return;
                let td = $(e).children('th, td');
                let userLink = td.eq(5).children('a');

                let planet = {
					planet_img: td.eq(1).find('img').attr('src'),
                    planet_id: td.eq(0).text().trim(),
                    galaxy_id: options.galaxy,
                    system_id: options.system,
                    planet_name: td.eq(2).text().trim(),
                    player_id: userLink.length ? userLink.attr('href').match(/id=(\d+)/)[1] : "unknown"
                };
                planets.push(planet);
            });

            return planets.filter(planet => planet.player_id == userId);
        });
    }

	GM_addStyle(`
	.loading-img {
		width: 15px;
		height: 15px;
	}
	.planets .planet {
	  display: inline-table;
	  width: 90px;
	  padding: 10px;
	}
	.planets .planet .planet-img {
      width: 100%;
      display: block;
    }
	`);

    const SEARCH_RESULT_TEMPLATE = `
<div class="text_friends">
	<b>Колонии игрока</b>
</div>
<div class="planets">
<% if (planets.length == 0) { %>
Планеты не найдены
<% } else { _.forEach(planets, function(planet) { %>
	<div class="planet">
		<img src="<%= planet.planet_img %>">
		<a target="_blank" href="/galaxy.php?mode=3&galaxy=<%= planet.galaxy_id %>&system=<%= planet.system_id %>"><%= planet.planet_name %></a>
	</div>
<% }); }%>
</div>
	`;

    const renderSearchResult = _.template(SEARCH_RESULT_TEMPLATE);

    function findAllPlanets(userId) {
        let queriesData = galaxyPageQueriesData();

        async.mapLimit(queriesData, 15, async q => {
            let planetrs = await findPnalents(userId, q);
            updateProgress();
            return planetrs;
        },(err, res) => {
            if(err) console.error('findAllPlanets', err);
            else {
                let users = Array.prototype.concat.apply([], res);
                userSearchFinish(users);
            }
        });
    }

	function getUderId() {
		let matches = location.search.match(/id=(\d+)/);
		return matches ? matches[1] : null;
	}

	function updateProgress(val) {
		val = parseInt(val);
		if (Number.isNaN(val))
			searchProgress.val(searchProgress.val() + 1);
		else searchProgress.val(val);
	}

    function userSearchStart() {
		let userId = getUderId();

		if(!userId) {
			alert("Имя игрока не может быть пустым!", + userId);
			return;
		}

		if (!/Игрок решил не показывать свои колонии/.test(seachResultContainer.text())) {
			alert("Данный пользователь не скрыл свои планеты. Поиск не требуется");
			return;
		}

        //seachResultContainer.html("");
        startSeachButton.attr('disabled', 'true');
        loadingBlock.show();
		searchProgress.show();
        findAllPlanets(userId);
    }

    function userSearchFinish(planets) {
		console.log("userSearchFinish", planets);
        startSeachButton.attr('disabled', null);
        loadingBlock.hide();
		searchProgress.hide();
		updateProgress(0);
        seachResultContainer.html(renderSearchResult({
            planets
        }));
    }


    let loadingBlock = $("<div>Идет поиск... <img class='loading-img' src='http://www.transportguru.in/images/loading.gif'></div>", {
    }).hide();

    let seachResultContainer = $(".s_planet");

	let searchProgress = $(`<progress>`, {
		attr: {
			value: 0,
			max: GALAXIES * SYSTEMS
		}
    }).hide();

    let startSeachButton = $('<button>', {
        text: "Найти планеты игрока",
        click: userSearchStart
    });

    seachResultContainer
        .append(startSeachButton)
        .append(loadingBlock)
		.append(searchProgress);
})();