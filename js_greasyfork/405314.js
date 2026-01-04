// ==UserScript==
// @name         HideDiscover
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Поиск хайдов в просматриваемой теме на miped.ru
// @author       You
// @match        https://miped.ru/f/threads/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      miped.ru
// @require      https://code.jquery.com/jquery-2.1.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/405314/HideDiscover.user.js
// @updateURL https://update.greasyfork.org/scripts/405314/HideDiscover.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // настройки скрипта
    let pagesToCheck = 10;                             // количество предыдущих страниц которые нужно проверить на наличие хайдов



    // код скрипта
    const httpRequest = (params) => {
        return new Promise((resolve) => {
            params.timeout = 30000;
            params.onload = resolve;
            params.onerror = resolve;
            params.ontimeout = resolve;
            params.onabort = resolve;

            const func = typeof GM !== 'undefined' ? GM.xmlHttpRequest : GM_xmlhttpRequest;
            func(params);
        });
    }

    const check = async (path) => {
        checking = true;

        const response = await httpRequest({
            method: 'GET',
            url: path
        });

        if (response.status !== 200) {
            return null;
        }

        try {
            var datahtml = response.responseText;
            //console.log($(datahtml).find(".bbCodeBlock--hide").text());

            let hides = {};
            let items = [];
            let counter = 0;
            $(datahtml).find('.bbCodeBlock--hide').each(function(i, el) {

                let title = $(el).find('.bbCodeBlock-title').text();
                let likes, posts, days, rep = "";
                let search = null;

                search = title.match(/(\d*)\sлайк/);
                if (!search || !search[1]) {
                    search = title.match(/(\d*)\sреакци.*?у вас/);
                }
                if (search && search[1]) {
                    likes = search[1];
                }

                search = title.match(/(\d*)\sпост/);
                if (!search || !search[1]) {
                    search = title.match(/(\d*)\sсообщени.*?у вас/);
                }
                if (search && search[1]) {
                    posts = search[1];
                }

                search = title.match(/(\d*)\sдней/);
                if (search && search[1]) {
                    days = search[1];
                }

                search = title.match(/(\d*)\sрепы/);
                if (search && search[1]) {
                    rep = search[1];
                }

                items.push( {
                    post:  $(el).closest('article.message').data('content'),
                    params: {
                        posts: posts,
                        likes: likes,
                        days: days,
                        rep: rep
                    }
                });
                counter++;
            });

            hides.count = counter;
            hides.items = items;
            return hides;
        } catch (e) {
            return null;
        }
        checking = false;
    }

    const main = async () => {
        let current_path = location.pathname;
        let current_page = current_path.replace(/.*\/page-/, '');
        let current_topic = current_path.replace(/(.*\/)page-.*/, '$1');
        $('.js-alertsMenuBody').after('<div id="HideUnhide"><div class="previous menu-row"></div><div class="current menu-row"></div></div>');

        for (var i = 0; i <= pagesToCheck; i++) {
            let prev_page = current_page - i;
            if (prev_page > 0) {
                let prev_path = current_path.replace(/(.*\/page-).*/, '$1' + prev_page);
                let hides = await check(location.origin + prev_path);

                if (i && hides && hides.count) {
                    if (!$('div').is('#HideUnhide .previous .title')) {
                        $('#HideUnhide .previous').append('<div class="title">Хайды на предыдущих страницах</div>');
                    }
                    if (hides.count == 1) {
                        $('#HideUnhide .previous').append('<div> ' + hides.count + ' на <a href="' + current_topic + hides.items[0].post + '">стр. ' + prev_page + '</a></div>');
                    }
                    else {
                        $('#HideUnhide .previous').append('<div> ' + hides.count + ' на <a href="' + location.origin + prev_path + '">стр. ' + prev_page + '</a></div>');
                    }
                }
                if (!i && hides.items.length) {
                    $('.p-navgroup-link--alerts').append('<div style="position: absolute;left: 0;background: green;color: white;font-size: 10px;top: 3px;line-height: 1;padding: 1px 3px;font-weight: 600;">' + hides.items.length + '</div>');

                    $('#HideUnhide .current').append('<div>Хайды на странице</div>');
                    $.each(hides.items, function(index, value) {
                        $('#HideUnhide .current').append(
                            '<div><a href="' + current_topic + value.post + '">' +
                            (value.params.posts ? value.params.posts + 'п ' : '') +
                            (value.params.likes ? value.params.likes + 'л ' : '') +
                            (value.params.days ? value.params.days + 'д ' : '') +
                            (value.params.rep ? value.params.rep + 'р ' : '') +
                            '</a></div>'
                        );
                    });
                }
            }
        }
    }


    let checking = false;
    main();

})(jQuery);



