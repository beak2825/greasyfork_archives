// ==UserScript==
// @name          KG_RecentGames
// @namespace     klavogonki
// @version       0.1
// @description   Create recent races with simple click on the buttons what appears in the gamelist and home page
// @include       https://klavogonki.ru/
// @include       https://klavogonki.ru/gamelist/
// @include       https://klavogonki.ru/g/*
// @include       http://klavogonki.ru/gamelist/
// @include       http://klavogonki.ru/g/*
// @downloadURL https://update.greasyfork.org/scripts/404431/KG_RecentGames.user.js
// @updateURL https://update.greasyfork.org/scripts/404431/KG_RecentGames.meta.js
// ==/UserScript==

function main(){
    var maxGameCount = 5;

    if (localStorage['recent_games_limit']) {
        maxGameCount = Math.max(0, localStorage['recent_games_limit']);
    }

    function generateName(aGame) {
        var gameTypes = {
            normal: 'Oбычный',
            abra: 'Абракадабра',
            referats: 'Яндекс.Рефераты',
            noerror: 'Безошибочный',
            marathon: 'Марафон',
            chars: 'Буквы',
            digits: 'Цифры',
            sprint: 'Спринт',
            voc: 'По словарю'
        };

        var visibilities = {
            normal: 'открытый',
            private: 'дружеский',
            practice: 'одиночный'
        };

        var ranks = ["новички", "любители", "таксисты", "профи", "гонщики", "маньяки", "супермены", "кибергонщики", "экстракиберы"];

        var gameType = gameTypes[aGame.params.gametype];
        var gameTypeCode = aGame.params.gametype;
        var vocName = aGame.params.vocName;
        var timeout = aGame.params.timeout + ' сек.';
        var visibility = visibilities[aGame.params.type];
        var levelFrom = ranks[aGame.params.level_from - 1];
        var levelTo = ranks[aGame.params.level_to - 1];

        return '<span class="recent-game-name gametype-' + aGame.params.gametype + '">' + ((vocName == '') ? gameType : '«' + vocName + '»') + '</span>'
            + '<span class="recent-game-description">' + visibility + ', ' + timeout
            + '<span class="recent-game-qual">' + (aGame.params.qual ? ' (к)': '') + '</span>'
            + (aGame.params.level_from != 1 || aGame.params.level_to != 9 ? ' <span class="recent-game-levels">' + levelFrom + ' - ' + levelTo + '</span>' : '')
            + '</span>';
    }

    function generateLink(aGame) {
        return 'http://klavogonki.ru/create/?'
            + 'gametype=' + aGame.params.gametype
            + (aGame.params.vocId != '' ? '&voc=' + aGame.params.vocId : '')
            + '&type=' + aGame.params.type
            + '&level_from=' + aGame.params.level_from
            + '&level_to=' + aGame.params.level_to
            + '&timeout=' + aGame.params.timeout
            + (aGame.params.qual ? '&qual=1' : '')
            + '&submit=1';
    }

    function addGameLink(elem, aGame, id) {
        var li = document.createElement('li');
        li.className = 'recent-game';
        if (aGame.pin) {
            li.className += ' pin-game';
        }
        li.id = 'recent-game-' + id;
        li.innerHTML =
            '<div class="recent-game-handle"><img src="/img/blank.gif"></div>'
            + '<div class="recent-game-buttons">'
            + '<div class="recent-game-pin"><img src="http://klavogonki.ru/img/pin.png" title="Зафиксировать" onclick="pinRecentGame(' + id + ')"></div>'
            + '<div class="recent-game-delete"><img src="http://klavogonki.ru/img/cross_small.png" title="Удалить" onclick="deleteRecentGame(' + id + ');"></div>'
            + '</div>'
            + '<a href="' + generateLink(aGame) + '">' + generateName(aGame) + '</a>';

        elem.appendChild(li);
    }

    function getPinGameCount(aGameList) {
        var n = 0;
        for (var i = 0; i < aGameList.length; i++) {
            if (aGameList[i].pin) {
                n++;
            }
        }
        return n;
    }

    function createHistoryContainer() {
        recentGames = getRecentGames();
        var pinGameCount = getPinGameCount(recentGames);
        var div = document.createElement('div');
        div.id = 'recent-games-container';

        for (var i = 0; i < recentGames.length && i < maxGameCount + pinGameCount; i++) {
            addGameLink(div, recentGames[i], i);
        }
        div.innerHTML = '<ul id="recent-games">' + div.innerHTML + '</ul><div style="clear:both;"></div>';

        return div;
    }

    function saveGameParams () {
        var desc = document.getElementById('gamedesc');
        if (!desc) {
            throw new Error('#gamedesc element not found.');
        }

        var span = desc.querySelector('span');
        if (!span) {
            throw new Error('#gamedesc span element not found.');
        }

        var descText = desc.textContent;
        if (/соревнование/.test(descText) || !maxGameCount) {
            return false;
        }

        var gameType = span.className.split('-').pop();
        var vocName = gameType === 'voc' ? span.textContent.replace(/[«»]/g, '') : '';
        var vocId = gameType === 'voc' ? parseInt(span.querySelector('a').href.match(/vocs\/(\d+)/)[1]) : '';

        var type = 'normal';
        if (/одиночный/.test(descText)) {
            type = 'practice';
        } else if (/друзьями/.test(descText)) {
            type = 'private';
        }

        var levelFrom = 1;
        var levelTo = 9;
        var matches = descText.match(/для (\S+)–(\S+),/);
        var ranks = {
            'новичков': 1,
            'любителей': 2,
            'таксистов': 3,
            'профи': 4,
            'гонщиков': 5,
            'маньяков': 6,
            'суперменов': 7,
            'кибергонщиков': 8,
            'экстракиберов': 9,
        };
        if (matches) {
            levelFrom = ranks[matches[1]];
            levelTo = ranks[matches[2]];
        }

        matches = descText.match(/таймаут\s(\d+)\s(сек|мин)/);
        var timeout = matches[2] === 'сек' ? parseInt(matches[1]) : parseInt(matches[1]) * 60;
        // OMG
        var qualification = /квалификация/.test(descText) ? 1 : 0;

        var lastGameParams = {
            gametype: gameType,
            vocName: vocName,
            vocId: vocId,
            type: type,
            level_from: levelFrom,
            level_to: levelTo,
            timeout: timeout,
            qual: qualification,
            // A legacy property, I guess:
            premium_abra: 0,
        };

        var sGameParams = JSON.stringify(lastGameParams);
        var gameList = getRecentGames();

        for (var i = 0; i < gameList.length; i++) {
            if (JSON.stringify(gameList[i].params) == sGameParams) {
                if (gameList[i].pin) {
                    return;
                } else {
                    gameList.splice(i, 1);
                    break;
                }
            }
        }

        var pinGameCount = getPinGameCount(gameList);
        while (gameList.length >= maxGameCount + pinGameCount) {
            gameList.pop();
        }

        var lastGame = {
            params: lastGameParams,
            id: -1,
            pin: 0
        };

        gameList.splice(pinGameCount, 0, lastGame);
        localStorage.setItem('recent_games', JSON.stringify(gameList));
    }

    if (/http:\/\/klavogonki.ru\/g\/\?gmid=/.test(location.href)) {
        var gameLoading = document.getElementById('gameloading');
        if (!gameLoading) {
            throw new Error('#gameloading element not found.');
        }

        if (gameLoading.style.display !== 'none') {
            var observer = new MutationObserver(function () {
                observer.disconnect();
                saveGameParams();
            });
            observer.observe(gameLoading, { attributes: true });
        } else {
            saveGameParams();
        }
    }

    if (/^http:\/\/klavogonki.ru\/$/.test(location.href)) {
        var div = createHistoryContainer();
        var e = document.getElementById('head');
        e.appendChild(div);
        sortableRecentGames();
    }

    if (/http:\/\/klavogonki.ru\/gamelist\//.test(location.href)) {
        var opt = document.createElement('span');
        opt.id = 'recent-games-options';

        var count = document.createElement('span');
        count.id = 'recent-games-count';
        count.innerHTML = maxGameCount;

        var dec = document.createElement('span');
        dec.id = 'recent-games-count-dec';
        dec.innerHTML = '&#9668';

        var inc = document.createElement('span');
        inc.id = 'recent-games-count-inc';
        inc.innerHTML = '&#9658';

        inc.observe("click", function(evt) {
            maxGameCount++;
            count.innerHTML = maxGameCount;
            localStorage['recent_games_limit'] = maxGameCount;
        });

        dec.observe("click", function(evt) {
            if (maxGameCount > 0) {
                maxGameCount--;
            }
            count.innerHTML = maxGameCount;
            localStorage['recent_games_limit'] = maxGameCount;
        });

        opt.innerHTML = 'История: ';
        opt.appendChild(dec);
        opt.appendChild(count);
        opt.appendChild(inc);

        var div = createHistoryContainer();
        var e = document.getElementsByClassName('gamelist-create')[0];
        e.appendChild(div);
        e.getElementsByTagName('form')[0].appendChild(opt);

        sortableRecentGames();
    }

    var style = document.createElement('style');
    style.innerHTML =
        '#recent-games-container {background:#FFF;}'
        + '#recent-games-container ul {margin:0; padding:0;}'
        + '.recent-game {list-style-type:none; position:relative; display:inline-block; vertical-align:top; padding:0; margin:6px 2px 2px; border:1px solid #CCC;}'
        + '.recent-game.pin-game {margin:4px 2px 0px; border:3px double #AAA;}'
        + '.recent-game:hover {border:1px solid #666; background:#F4F4F4;}'
        + '.recent-game.pin-game:hover {border:3px double #888}'
        + '.recent-game a {text-decoration:none; text-align:center; padding:5px; display:block;}'
        + '.recent-game-name {display:block; font-weight:bold;}'
        + '.recent-game-description {display:block; font-size:11px; color:#000;}'
        + '.recent-game-qual {color:#F00;}'
        + '.recent-game-levels {display:block; font-size:11px; color:#000;}'
        + '.recent-game-handle {display:none; position:absolute; left:0px; top:0px; width:16px; height:16px; z-index:100; cursor:move; background:transparent url("http://klavogonki.ru/img/dragdrop2.gif") no-repeat 0 0!important;}'
        + '.pin-game .recent-game-handle {display:block}'
        + '.recent-game-buttons {display:none; position:absolute; right:0px;}'
        + '.recent-game-buttons img:hover {opacity:1; cursor:pointer;}'
        + '.recent-game-buttons div {margin-left:3px;}'
        + '.recent-game:hover .recent-game-buttons {display:block}'
        + '.recent-game-delete {position:relative; left:-4px; top:-5px; width:7px; height:7px; float:left;}'
        + '.recent-game-delete img {opacity:0.15; position:absolute; clip:rect(5px, 11px, 12px, 4px);}'
        + '.recent-game-pin {float:left; margin-left:2px;}'
        + '.pin-game .recent-game-pin {display:none;}'
        + '.recent-game-pin img {max-width:7px; max-height:7px; opacity:0.3}'
        + '#recent-games-options {font-family: sans-serif; margin-left:10px;}'
        + '#recent-games-count {margin:0px 3px;}'
        + '#recent-games-count-inc {cursor:pointer;}'
        + '#recent-games-count-dec {cursor:pointer;}'
        ;
    document.body.appendChild(style);
}

function getRecentGames() {
    var gameList = localStorage['recent_games'] ? JSON.parse(localStorage['recent_games']) : [];
    // Update old configuration if needed:
    // TODO: remove this in the future version.
    gameList = gameList.map(function (game) {
        if (game.params.qual === 'on' || game.params.qual === '') {
            game.params.qual = game.params.qual === 'on' ? 1 : 0;
        }
        return game;
    });
    for (var i = 0; i < gameList.length; i++) {
        gameList[i].id = i;
    }
    return gameList;
}

function indexOfRecentGameId(id) {
    for (var i = 0; i < recentGames.length; i++) {
        if (recentGames[i].id == id) {
            return i;
        }
    }
}

function deleteRecentGame(id) {
    var gameElement = document.getElementById('recent-game-' + id);
    gameElement.parentNode.removeChild(gameElement);
    var gameObject = recentGames.splice(indexOfRecentGameId(id), 1);
    localStorage['recent_games'] = JSON.stringify(recentGames);
    return gameObject[0];
}

function pinRecentGame(id) {

    function hasClass(element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

    var gameElement = document.getElementById('recent-game-' + id);
    var gameElementList = document.getElementsByClassName('recent-game');

    for (var i = 0; i < gameElementList.length; i++) {
        if (!(hasClass(gameElementList[i], 'pin-game'))) {
            gameElement.className += ' pin-game';
            if (recentGames[i].id == id) {
                recentGames[i].pin = 1;
            } else {
                var gameObject = deleteRecentGame(id);
                gameObject.pin = 1;
                gameElementList[i].parentNode.insertBefore(gameElement, gameElementList[i]);
                recentGames.splice(i, 0, gameObject);
            }
            break;
        }
    }
    sortableRecentGames();
    localStorage['recent_games'] = JSON.stringify(recentGames);
}

function sortableRecentGames() {
    Sortable.create('recent-games', {
        overlap: 'horizontal',
        constraint: 'horizontal',
        only: 'pin-game',
        handle: 'recent-game-handle',
        onChange: function(el) {
            var id = /\d+$/.exec(el.id)[0];
            var oldIndex = indexOfRecentGameId(id);
            var newIndex = $$$('#recent-games .recent-game').index(el);
            recentGames.splice(newIndex, 0, recentGames.splice(oldIndex, 1)[0]);
            localStorage['recent_games'] = JSON.stringify(recentGames);
        }
    });
}

function addScript(source) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = source;
    document.body.appendChild(script);
}

function execScript(source) {
    if (typeof source == 'function') {
        source = '(' + source + ')();';
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = source;
    document.body.appendChild(script);
}

if(!document.getElementById('KTS_RecentGames')) {
	addScript('var recentGames;\n' + getRecentGames + indexOfRecentGameId + deleteRecentGame + pinRecentGame + sortableRecentGames);
	execScript(main);

	var tmp_elem = document.createElement('div');
	tmp_elem.id = 'KTS_RecentGames';
	tmp_elem.style.display = 'none';
	document.body.appendChild(tmp_elem);
}
