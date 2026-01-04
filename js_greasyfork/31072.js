// ==UserScript==
// @name         Steam Badge Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @icon         http://www.steamcardexchange.net/include/design/img/favicon_blue.png
// @author       Bisumaruko
// @match        http://www.steamcardexchange.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31072/Steam%20Badge%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/31072/Steam%20Badge%20Viewer.meta.js
// ==/UserScript==

/* global $, GM_xmlhttpRequest, confirm */

(function($) {
    'use strict';

    //load data
    var ignoredGames = JSON.parse(localStorage.getItem('SBV_ignored_games') || '[]');
    var cache = JSON.parse(localStorage.getItem('SBV_cache') || '{}');
    var urls = [];
    var apps = [];

    //construct functions
    const init = function() {
        $('#content-area')
            .text('')
            .html(`
                <div class="content-box">
                	<div class="content-box-topbar-large">
                		<span class="left"><h1 class="empty">BADGE</h1></span>
                	</div>
                	<a href="index.php?showcase-filter-ac" class="showcase-navigation-link">A - C</a>
                	<a href="index.php?showcase-filter-df" class="showcase-navigation-link">D - F</a>
                	<a href="index.php?showcase-filter-gi" class="showcase-navigation-link">G - I</a>
                	<a href="index.php?showcase-filter-jl" class="showcase-navigation-link">J - L</a>
                	<a href="index.php?showcase-filter-mo" class="showcase-navigation-link">M - O</a>
                	<a href="index.php?showcase-filter-pr" class="showcase-navigation-link">P - R</a>
                	<a href="index.php?showcase-filter-su" class="showcase-navigation-link">S - U</a>
                	<a href="index.php?showcase-filter-vx" class="showcase-navigation-link">V - X</a>
                	<a href="index.php?showcase-filter-yz" class="showcase-navigation-link">Y - Z</a>
                	<a href="index.php?showcase-filter-09" class="showcase-navigation-link">0 - 9</a>
                	<a href="index.php?showcase-filter-recadded" class="showcase-navigation-link recent">Recently<br>Added</a>
                	<a href="index.php?showcase-filter-all" class="showcase-navigation-link">All</a>
                </div>
            `);

        $('.showcase-navigation-link').click(function(e) {
            e.preventDefault();

            message('Loading...');

            if (!e.target.href.includes('filter')) return;

            urls = [];
            apps = [];

            if (e.target.href.includes('filter-all')) {
                ['ac', 'df', 'gi', 'jl', 'mo', 'pr', 'su', 'vx', 'yz', '09'].forEach(filter => {
                    urls.push('http://www.steamcardexchange.net/index.php?showcase-filter-' + filter);
                });
            } else urls.push(e.target.href);

            fetchFilter();
        });
        //append clear cache button
        $('<a/>', {
                'text': 'Clear Cache',
                'style': 'float: right; margin-right: 20px;'
            })
            .on('click', function() {
                if (confirm('Are you sure to delete cache data?')) {
                    localStorage.removeItem('SBV_cache');
                    cache = [];
                }
            })
            .appendTo('.content-box-topbar-large');
        //append clear ignored games button
        $('<a/>', {
                'text': 'Clear Ignored Games',
                'style': 'float: right; margin-right: 20px;'
            })
            .on('click', function() {
                if (confirm('Are you sure to delete ignored games?')) {
                    localStorage.removeItem('SBV_ignored_games');
                    ignoredGames = [];
                }
            })
            .appendTo('.content-box-topbar-large');
    };
    const fetchFilter = function() {
        let url = urls.shift();

        if (url) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(res) {
                    if (res.status === 200) {
                        $('<div/>', {
                                'html': res.responseText
                            })
                            .find('.showcase-game-item > a')
                            .each(function() {
                                apps.push({
                                    id: parseInt(this.href.split('-').pop()),
                                    title: $(this).find('img').attr('alt'),
                                    imgURL: $(this).find('img').attr('data-original'),
                                    url: this.href
                                });
                            });
                    }

                    fetchFilter();
                }
            });
        } else { //Finished fetching filters
            if (!apps.length) return message('Fetching failed, please try again later.');

            $('.SBV_message').remove();
            $('.showcase-game-item').remove();
            processGame();
        }
    };
    const processGame = function() {
        let app = apps.shift();
        if (!app) return;

        while (ignoredGames.includes(app.id)) {
            app = apps.shift();
        }

        let badges = cache[app.id];
        let interval = 0;

        if (Array.isArray(badges)) appendGame(app, badges);
        else {
            fetchGame(app, appendGame);
            interval = 1000;
        }

        setTimeout(processGame, interval);
    };
    const appendGame = function(app, badges) {
        let gameItem = $(`
            <div class="showcase-game-item">
                <div class="game-image-background"></div>
                <a title="Click to get game details" href="index.php?gamepage-appid-${app.id}">
                    <img class="game-image lazy" src="${app.imgURL}">
                </a>
                <div class="game-title">
                    <h2 class="empty">
                        <a href="http://store.steampowered.com/app/${app.id}/">${app.title}</a>
                    </h2>
                    <a><span>&#9747;</span></a>
                </div>
                <div class="game-info"></div>
            </div>
        `);

        if (badges !== null) {
            if (badges.length) {
                appendBadges(gameItem.find('.game-info'), app, badges);
            } else {
                gameItem.find('.game-info').text('This game does not have badges.');
            }
        } else {
            gameItem.find('.game-info').text('Fetching failed, click to reload');
            gameItem.click(function() {
                let info = $(this).find('.game-info');

                info.text('Reloading...');
                fetchGame(app, function(_app, _badges) {
                    info.text('');
                    appendBadges(info, _app, _badges);
                });
            });
        }

        gameItem.find('.game-title > a')
            .attr('title', 'Hide this game')
            .css({
                'float': 'right',
                'margin-right': '20px'
            })
            .click(function() {
                ignoredGames.push(app.id);
                localStorage.setItem('SBV_ignored_games', JSON.stringify(ignoredGames));
                gameItem.remove();
            });

        $('#content-area > .content-box').append(gameItem);
    };
    const fetchGame = function(app, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: app.url,
            onload: function(res) {
                let badges = null;

                if (res.status === 200) {
                    badges = [];
                    let temp = $(res.responseText);

                    temp
                        .find('#foilbadges .element-image')
                        .each(function() {
                            badges[0] = {
                                name: $(this).attr('alt'),
                                imgURL: $(this).attr('src').split('/').pop()
                            };
                        });

                    temp
                        .find('#badges .element-image')
                        .each(function() {
                            let level = parseInt($(this).next().next().text().trim().slice(6, 7));
                            if (isNaN(level)) return true;

                            badges[level] = {
                                name: $(this).attr('alt'),
                                imgURL: $(this).attr('src').split('/').pop()
                            };
                        });

                    cache[app.id] = badges;
                    localStorage.setItem('SBV_cache', JSON.stringify(cache));
                }

                callback(app, badges);
            }
        });
    };
    const appendBadges = function(target, app, badges) {
        let container = $('<div class="SBV_container"></div>');

        badges.forEach((badge, index) => {
            if (!badge) return;

            let text = index === 0 ? 'Foil' : 'Level ' + index;
            let link = 'http://steamcommunity.com/my/gamecards/' + app.id + '/' + (index === 0 ? '?border=1' : '');

            $('<div/>', {
                    'html': `
                    <img title="${badge.name}" src="http://cdn.akamai.steamstatic.com/steamcommunity/public/images/items/${app.id}/${badge.imgURL}" >
                    <a href="${link}">${text}</a>`
                })
                .appendTo(container);
        });

        target.append(container);
    };
    const message = function(msgText) {
        $('#content-area > .content-box').append(`
            <div class="showcase-game-item SBV_message">
                <span>${msgText}</span>
            </div>
        `);
    };

    //append style
    $('#navbar-menu').css({
        'width': 'initial',
        'right': '0px'
    });
    $('#logout').css({
        'position': 'fixed',
        'right': '8px'
    });

    GM_addStyle(`
        .SBV_container, .SBV_container > div {
            height: 70px;
            box-sizing: border-box;
            text-align: center;
        }
        .SBV_container > div {
            width: 111px;
            display: inline-block;
        }
        .SBV_container img {
            height: 54px;
            display: block;
            margin: auto;
        }
    `);

    //append button
    $('#navbar-menu').append('<div class="navbar-menu-item" id="SBV"><a class="item-link">BADGE</a></div>');

    //attach event
    $('#SBV').click(function() {
        $(document.body).css('background-image', 'none');
        init();
    });

})(jQuery);