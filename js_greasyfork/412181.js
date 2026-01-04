// ==UserScript==
// @name               Hide Your Games on PSN
// @name:zh-CN         隐藏PSN游戏
// @namespace          http://tampermonkey.net/
// @version            0.2
// @description        Search and hide games on PSN management site
// @description:zh-CN  在PSN管理网页上搜索和隐藏游戏
// @author             Nathaniel Wu
// @include            *id.sonyentertainmentnetwork.com/*
// @license            Apache-2.0
// @grant              GM_addStyle
// @supportURL         https://github.com/Nathaniel-Wu/userscript-hide-psn-games/issues
// @downloadURL https://update.greasyfork.org/scripts/412181/Hide%20Your%20Games%20on%20PSN.user.js
// @updateURL https://update.greasyfork.org/scripts/412181/Hide%20Your%20Games%20on%20PSN.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const text_tags = {
        text_search: 0,
        regex_search: 1,
        cancel: 2,
        game_found: 3,
        total_games_found: 4,
        game_classifier: 5,
        new_games_ready_to_be_hidden: 6,
        save_reminder: 7
    }
    const localization = {
        "zh-Hans": ['文本搜索', '正则表达式搜索', '取消', '游戏已找到：', '共找到：', '款', '可供隐藏的新游戏：', '点击保存按钮隐藏'],
        "zh-Hant": ['文本搜索', '正則表達式搜索', '取消', '遊戲已找到：', '共找到：', '款', '可供隱藏的新遊戲：', '點擊保存按鈕隱藏'],
        "en-US": ['Text Search', 'RegEx Search', 'Cancel', 'Game Found: ', 'Total Game(s) Found: ', '', 'New Games(s) Ready To Be Hidden: ', 'Click the Save button to hide the game(s)']
    };
    function localized_text(text_tag) {
        let site_lang = document.documentElement.lang;
        let lang = localization.hasOwnProperty(site_lang) ? site_lang : "en-US";
        return localization[lang][text_tag];
    }
    function repeat_until_successful(function_ptr, interval) {
        if (!function_ptr())
            setTimeout(() => {
                repeat_until_successful(function_ptr, interval);
            }, interval);
    }
    function search_and_hide_game(pattern) {
        let regex_search = typeof (pattern) === 'object';
        let lower_case_pattern = null;
        if (!regex_search)
            lower_case_pattern = pattern.toLowerCase();
        let game_titles = [];
        let new_games_ready_to_be_hidden = 0;
        repeat_until_successful(() => {
            let found = false;
            let load_more_button_container_candidates = Array.prototype.slice.call(document.querySelectorAll('div.columns-center.fitting-width, ul#ps4-games-list'));
            let UL_index = load_more_button_container_candidates.findIndex((e) => e.tagName === 'UL');
            let game_elements = load_more_button_container_candidates[UL_index].querySelectorAll('.pdr-list-column.main-text.ps4-game-name-text.text-selectionitem');
            game_elements.forEach((e) => {
                if (e === game_elements[game_elements.length - 1] && !found)
                    e.scrollIntoView();
                if (regex_search) {
                    if (!Boolean(e.innerHTML.match(pattern)))
                        return;
                } else {
                    if (!Boolean(e.innerHTML.toLowerCase().match(lower_case_pattern)))
                        return;
                }
                found = true;
                let parent = e;
                while (parent.classList.length != 2 || (!parent.classList.contains('pdr-list-item')) || ((!parent.classList.contains('gamelist-check-on')) && (!parent.classList.contains('gamelist-check-off'))))
                    parent = parent.parentElement;
                let not_checked_before;
                if (not_checked_before = parent.classList.contains('gamelist-check-off')) {
                    parent.querySelector('.pdr-list-item.inner-list-item.list-thumbnail.check-box-item.game-list').click();
                    new_games_ready_to_be_hidden++;
                }
                let game_title = e.innerText;
                if (game_titles.indexOf(game_title) < 0) {
                    game_titles.push(game_title);
                    console.log(`${localized_text(text_tags.game_found)}${game_title}${not_checked_before ? '✅' : ''}`);
                    e.scrollIntoView();
                }
            });
            if (UL_index != load_more_button_container_candidates.length - 1) {
                load_more_button_container_candidates[UL_index + 1].querySelector('button.secondary-button.row-button.text-button').click();
                return false;
            } else {
                let alert_message = `${localized_text(text_tags.total_games_found)}${game_titles.length}${localized_text(text_tags.game_classifier)}
${localized_text(text_tags.new_games_ready_to_be_hidden)}${new_games_ready_to_be_hidden}${localized_text(text_tags.game_classifier)}
${localized_text(text_tags.save_reminder)}`
                console.log(alert_message);
                alert(alert_message);
                return true;
            }
        }, 3500 + Math.random() * 1000);
    }
    window.addEventListener('popstate', () => {
        if (Boolean(window.location.href.match(/privacy_settings\/group\/games\/hidden_games/))) {
            const search_menu = document.createElement('div');
            search_menu.id = 'search_menu';
            search_menu.innerHTML = `
                <div class="columns-center">
                    <form>
                        <input type="text" id="search_pattern" value="">
                        <div data-components="pdr-button" class="column-flex button ember-view">
                            <button id="text_search_button" tabindex="0" class="primary-button row-button text-button">
                                <span dir="ltr" class="caption">${localized_text(text_tags.text_search)}</span>
                            </button>
                        </div>
                        <div data-components="pdr-button" class="column-flex button ember-view">
                            <button id="regex_search_button" tabindex="0" class="primary-button row-button text-button">
                                <span dir="ltr" class="caption">${localized_text(text_tags.regex_search)}</span>
                            </button>
                        </div>
                        <div data-components="pdr-button" class="column-flex button ember-view">
                            <button id="cancel_button" tabindex="0" class="secondary-button row-button text-button">
                                <span dir="ltr" class="caption">${localized_text(text_tags.cancel)}</span>
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.querySelector('body').appendChild(search_menu);
            document.querySelector('#text_search_button').onclick = () => {
                let pattern = document.querySelector('#search_pattern').value;
                setTimeout(() => search_and_hide_game(pattern), 200);
                search_menu.remove();
            };
            document.querySelector('#regex_search_button').onclick = () => {
                let pattern = new RegExp(document.querySelector('#search_pattern').value);
                setTimeout(() => search_and_hide_game(pattern), 200);
                search_menu.remove();
            };
            document.querySelector('#cancel_button').onclick = () => {
                search_menu.remove();
            };
            GM_addStyle(`
                #search_menu {
                    position: absolute;
                    display: block;
                    padding: 10px;
                    background: #f0f0f0;
                    z-index: 999;
                    left: 50%;
                    top: 50%;
                    margin-left: -97px;
                    margin-top: -80px;
                }
            `);
        }
    });
})();
