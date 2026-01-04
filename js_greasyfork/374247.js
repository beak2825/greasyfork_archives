// ==UserScript==
// @name         NarouRankingFilter
// @namespace    drownia.narourankingfilter
// @version      1.3
// @description  なろうのランキングにフィルター機能を追加
// @author       Drownia
// @homepage https://twitter.com/Dr0wnia
// @match        https://yomou.syosetu.com/rank/list/type/*
// @match        https://yomou.syosetu.com/rank/isekailist/type/*
// @match        https://yomou.syosetu.com/rank/genrelist/type/*
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374247/NarouRankingFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/374247/NarouRankingFilter.meta.js
// ==/UserScript==

GM_config.init({
    'id': 'NarouRankingFilter',
    'title': '小説家になろう ランキングフィルター',
    'fields': {
        'whitelist_em': {
            'label': 'ホワイトリスト（完全一致）',
            'type': 'textarea',
            'default': ''
        },
        'blacklist_em': {
            'label': 'ブラックリスト（完全一致）',
            'type': 'textarea',
            'default': ''
        },
        'whitelist_pm': {
            'label': 'ホワイトリスト（部分一致）',
            'type': 'textarea',
            'default': ''
        },
        'blacklist_pm': {
            'label': 'ブラックリスト（部分一致）',
            'type': 'textarea',
            'default': ''
        }
    },
    'events': {
        'save': function(forgotten) {
            location.reload();
        }
    }
});

$(function() {
    $('#header').append('<li><a id = "open_config"><span style="color:blue">⚙️ランキングのフィルター設定を開く</span></a></li>')
    jQuery(document).on('click', '#open_config', function(){
        GM_config.open();
    });
    var blank_line_reg = /^\n$/gm
    GM_config.set('whitelist_em', GM_config.get('whitelist_em').replace(blank_line_reg, ''));
    GM_config.set('blacklist_em', GM_config.get('blacklist_em').replace(blank_line_reg, ''));
    GM_config.set('whitelist_pm', GM_config.get('whitelist_pm').replace(blank_line_reg, ''));
    GM_config.set('blacklist_pm', GM_config.get('blacklist_pm').replace(blank_line_reg, ''));
    var white_tag_em = GM_config.get('whitelist_em').split('\n');
    var black_tag_em = GM_config.get('blacklist_em').split('\n');
    var white_tag_pm = GM_config.get('whitelist_pm').split('\n');
    var black_tag_pm = GM_config.get('blacklist_pm').split('\n');
    if (black_tag_em == '') {black_tag_em[0] = 'DUMMYTAG'}
    if (black_tag_pm == '') {black_tag_pm[0] = 'DUMMYTAG'}
    var reg_white_em, reg_black_em, reg_white_pm, reg_black_pm;
    reg_white_em = [];
    reg_black_em = [];
    reg_white_pm = [];
    reg_black_pm = [];
    for (var i = 0; i <= white_tag_em.length - 1; i++){
        reg_white_em.push(new RegExp('(?<=<a href="/search\\.php\\?word=)(?=' + white_tag_em[i] + ').+(?=">)'));
    }
    for (i = 0; i <= black_tag_em.length - 1; i++){
        reg_black_em.push(new RegExp('(?<=<a href="/search\\.php\\?word=)(?=' + black_tag_em[i] + ').+(?=">)'));
    }
    for (i = 0; i <= white_tag_pm.length - 1; i++){
        reg_white_pm.push(new RegExp('(?<=<a href="/search\\.php\\?word=).*(?=' + white_tag_pm[i] + ').*(?=">)'));
    }
    for (i = 0; i <= black_tag_pm.length - 1; i++){
        reg_black_pm.push(new RegExp('(?<=<a href="/search\\.php\\?word=).*(?=' + black_tag_pm[i] + ').*(?=">)'));
    }

    var rank = $('div.rank_h').map(function(i, obj) {
        return [[obj, $('table.rank_table')[i]]];
    });
    var utf8_uri = new RegExp(
            "%[0-7][0-9A-F]|"+
            "%C[2-9A-F]%[89AB][0-9A-F]|%D[0-9A-F]%[89AB][0-9A-F]|"+
            "%E[0-F](?:%[89AB][0-9A-F]){2}|"+
            "%F[0-7](?:%[89AB][0-9A-F]){3}|"+
            "%F[89AB](?:%[89AB][0-9A-F]){4}|"+
            "%F[CD](?:%[89AB][0-9A-F]){5}","ig");
    var filtered_rank = rank.filter(function(i) {
        var white_em_bool, black_em_bool, white_pm_bool, black_pm_bool;
        white_em_bool = [];
        black_em_bool = [];
        white_pm_bool = [];
        black_pm_bool = [];

        var replaced_white_em = $($('tr:nth-child(4)')[i]).prop('outerHTML').replace(utf8_uri, function(whole){
            return decodeURI(whole);
        })
        for (var i2 = 0; i2 <= white_tag_em.length - 1; i2++){
            white_em_bool.push(reg_white_em[i2].test(replaced_white_em));
        }
        var white_em_equals = new Array(white_em_bool.length);
        for (i2 = 0; i2 <= white_em_bool.length - 1; i2++){
            white_em_equals[i2] = true;
        }

        var replaced_black_em = $($('tr:nth-child(4)')[i]).prop('outerHTML').replace(utf8_uri, function(whole){
            return decodeURI(whole);
        });
        for (i2 = 0; i2 <= black_tag_em.length - 1; i2++){
            black_em_bool.push(!reg_black_em[i2].test(replaced_black_em));
        };
        var black_em_equals = new Array(black_em_bool.length);
        for (i2 = 0; i2 <= black_em_bool.length - 1; i2++){
            black_em_equals[i2] = true;
        };

        var replaced_white_pm = $($('tr:nth-child(4)')[i]).prop('outerHTML').replace(utf8_uri, function(whole){
            return decodeURI(whole);
        })
        for (i2 = 0; i2 <= white_tag_pm.length - 1; i2++){
            white_pm_bool.push(reg_white_pm[i2].test(replaced_white_pm));
        }
        var white_pm_equals = new Array(white_pm_bool.length);
        for (i2 = 0; i2 <= white_pm_bool.length - 1; i2++){
            white_pm_equals[i2] = true;
        }

        var replaced_black_pm = $($('tr:nth-child(4)')[i]).prop('outerHTML').replace(utf8_uri, function(whole){
            return decodeURI(whole);
        })
        for (i2 = 0; i2 <= black_tag_pm.length - 1; i2++){
            black_pm_bool.push(!reg_black_pm[i2].test(replaced_black_pm));
        }
        var black_pm_equals = new Array(black_pm_bool.length);
        for (i2 = 0; i2 <= black_pm_bool.length - 1; i2++){
            black_pm_equals[i2] = true;
        }

        return JSON.stringify(white_em_bool) == JSON.stringify(white_em_equals) &&
                JSON.stringify(black_em_bool) == JSON.stringify(black_em_equals) &&
                JSON.stringify(white_pm_bool) == JSON.stringify(white_pm_equals) &&
                JSON.stringify(black_pm_bool) == JSON.stringify(black_pm_equals);
    }).map(
        function(i, obj) {
            return [[obj[0], obj[1]]];
        }
    );

    var url_reg = /\/rank\/list\/type\/.*/;
    var modify_num = 1;
    if (url_reg.test(location.pathname)) {
        modify_num = 2
    }
    for (i = 0; i <= 325; i++) {
        $('.ranking_list:nth-child(' + (i+modify_num) + ')').html($(filtered_rank[i]));
    }
})
