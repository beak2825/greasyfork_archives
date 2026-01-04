// ==UserScript==
// @name            CLIST Contest Filter
// @name:ja         CLIST Contest Filter
// @namespace       https://github.com/Coki628/clist-contest-filter
// @version         1.0.5
// @description     You can choose and filter any favorite contests at homepage on CLIST
// @description:ja  CLISTのTOPページで自分の好きなコンテストサイトだけ表示できます。
// @author          Coki628
// @license         MIT
// @match           https://clist.by/
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/439442/CLIST%20Contest%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/439442/CLIST%20Contest%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定保存用オブジェクト
    const config = {
        favorites: new Set(),

        load() {
            const config_json = GM_getValue("ClistContestFilterConfig", null);
            if (config_json !== null) {
                try {
                    const data = JSON.parse(config_json);
                    this.favorites = new Set(data.favorites);
                } catch (e) {
                    console.error("ClistContestFilter: Invalid JSON", config_json);
                }
            }
        },

        save() {
            const data = { favorites: [...this.favorites], };
            const config_json = JSON.stringify(data);
            GM_setValue("ClistContestFilterConfig", config_json);
            // console.info("ClistContestFilter: saved");
        },

        has(site) {
            return this.favorites.has(site);
        },

        set(site, checked) {
            if (checked) {
                this.favorites.add(site);
            } else {
                this.favorites.delete(site);
            }
        },
    };
    config.load();

    // 存在するコンテストサイトの情報を取得
    let resources = new Set();
    $('.contest.row').each(function() {
        resources.add($(this).find('a.resource_search').text().trim());
    });
    // 領域とサイト毎のチェックボックス生成
    $('#contests').prepend(`
        <div id="custom-filter-box" style="padding: 10px 10px 5px;">
            <div></div>
            <div></div>
        </div>
    `);
    // フィルターボタン
    let checked = config.has('site-filter-on') ? ' checked' : '';
    $('#custom-filter-box>div:first').append(`
        <input id="site-filter-button" type="checkbox" value="site-filter-on"${checked}>
    `);
    $('#site-filter-button').bootstrapToggle({
        on: 'filtered',
        off: 'all',
        size: 'mini',
        onstyle: 'default active',
        offstyle: 'default active',
    });
    // サブコンテスト表示チェック
    checked = config.has('show-subcontest') ? ' checked' : '';
    $('#custom-filter-box>div:first').append(`
        <div style="margin-top: 5px;">
            <input type="checkbox" id="checkbox-show-subcontest" value="show-subcontest"${checked}>
            <label for="checkbox-show-subcontest" style="margin-right: 10px;">Show Subcontests</label>
        </div>
    `);
    // 各コンテストサイトのチェック
    for (const resource of resources.keys()) {
        checked = config.has(resource) ? ' checked' : '';
        $('#custom-filter-box>div:nth-child(2)').append(`
            <span style="white-space: nowrap;">
                <input type="checkbox" id="checkbox-${resource}" value="${resource}"${checked}>
                <label for="checkbox-${resource}" style="margin-right: 10px;">${resource}</label>
            </span>
        `);
    }

    // チェックボックスの変化に合わせて設定にも反映
    $('#site-filter-button,input[id^="checkbox-"]').on('change', function() {
        config.set($(this).val(), $(this).prop('checked'));
        config.save();
    });

    // 各行に今の設定を適用
    const updateRows = () => {
        // filtered
        if ($('#site-filter-button').prop('checked')) {
            $('.contest.row').each(function() {
                const site = $(this).find('a.resource_search').text().trim();
                // 未選択 or サブコンテスト(かつサブコンテスト未チェック)だけ非表示
                if (!config.has(site) || ($(this).hasClass('subcontest') && !$('#checkbox-show-subcontest').prop('checked'))) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'block');
                }
            });
        // all
        } else {

            $('.contest.row').each(function() {
                // サブコンテスト(かつサブコンテスト未チェック)だけ非表示
                if ($(this).hasClass('subcontest') && !$('#checkbox-show-subcontest').prop('checked')) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css('display', 'block');
                }
            });
        }
    };
    updateRows();

    $('#site-filter-button,input[id^="checkbox-"]').on('change', function() {
        updateRows();
    });
})();
