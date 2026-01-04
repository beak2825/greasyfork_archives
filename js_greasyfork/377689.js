// ==UserScript==
// @name         Poster Finder 2000 Kaldata
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Събира едно под друго нечии постове от текущата страница до последната
// @author       bornofash
// @match        https://www.kaldata.com/forums/topic/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/377689/Poster%20Finder%202000%20Kaldata.user.js
// @updateURL https://update.greasyfork.org/scripts/377689/Poster%20Finder%202000%20Kaldata.meta.js
// ==/UserScript==

// Delay between requesting pages (in seconds)
var delay = 3;

var $ = window.jQuery;
var name, pages, base_url;

function update(msg, evn) {
    $('#posterFinder_counter').text(msg).css('pointer-events', evn);
}

function add_articles(data) {
    var user_articles = [];
    $(data).find('article').each(function() {
        var username = $(this).find('aside h3 strong a').text();
        if (username === name) {
            user_articles.push( $(this) );
        }
    })
    for (var x in user_articles) {
        $('#elPostFeed form').append(user_articles[x]);
    }
}

function schedule_calls(next_page) {
    $.ajax({
        url: base_url + "?page=" + next_page,
        type: 'GET',
        success: function(data) {
            update('Прогрес: ' + next_page, 'none');
            add_articles(data);
            if (next_page+1 <= pages) {
                setTimeout(() => {
                    schedule_calls(next_page+1);
                }, delay * 1000);
            } else {
                update('Прогрес: Готово!', 'auto');
            }
        },
        cache: false,
    });
}

function main() {
    pages = parseInt($('li.ipsPagination_last a').attr('data-page'));
    var next_page = parseInt($('li.ipsPagination_active a').attr('data-page'))+1;
    base_url = window.location.href.split('?page=')[0];

    // Remove other people's posts from current page
    $('article').each(function() {
        var username = $(this).find('aside h3 strong a').text();
        if (username !== name) {
            $(this).remove()
        }
    })

    if (next_page <= pages) {
        update('Прогрес: ' + next_page, 'none');
        schedule_calls(next_page);
    } else {
        update('Прогрес: Готово!', 'auto');
    }
}

(function() {
    'use strict';

    var button = $('<a href="javascript:void(0)">Събери нечии постове</a>');
    button.attr('id', 'posterFinder_counter');
    button.attr('title', 'Събери нечии постове от текущата страница до последната.');
    button.click(function() {
        name = prompt('Въведи име на потребител');
        name!==null && main();
    });
    $('div.ipsSpacer_bottom').append(button);
})();