// ==UserScript==
// @name         获取豆瓣人气主演
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       imzhi <yxz_blue@126.com>
// @match        https://movie.douban.com/subject/*
// @match        https://movie.douban.com/celebrity/*
// @match        https://movie.douban.com/subject_search?search_text=*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/clipboard.js/2.0.6/clipboard.min.js
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/407398/%E8%8E%B7%E5%8F%96%E8%B1%86%E7%93%A3%E4%BA%BA%E6%B0%94%E4%B8%BB%E6%BC%94.user.js
// @updateURL https://update.greasyfork.org/scripts/407398/%E8%8E%B7%E5%8F%96%E8%B1%86%E7%93%A3%E4%BA%BA%E6%B0%94%E4%B8%BB%E6%BC%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tab_key = 'imzhi_douban_actor_tab';
    const actor_all_key = 'imzhi_douban_actor_all';
    const actor_rel_key = 'imzhi_douban_actor_rel';
    const actor_end_key = 'imzhi_douban_actor_end';
    const min_tit = 400;
    const min_tag = 400;
    if (/^https:\/\/movie\.douban\.com\/celebrity\/\d+\/.*$/.test(location.href)) {
        // 匹配影人收藏数
        const $h2 = $('#fans > .hd > h2');
        let num = 0;
        if ($h2.length) {
            num = $h2.text().trim().match(/影迷（(\d+)）/)[1];
            num = num ? num : 0;
        }

        let actor_all = GM_getValue(actor_all_key);
        const actor_rel = GM_getValue(actor_rel_key);
        if (actor_all[actor_rel[location.href]]) {
            actor_all[actor_rel[location.href]]['num'] = num
        }
        GM_setValue(actor_all_key, actor_all);
    }
    if (!/^https:\/\/movie\.douban\.com\/subject\/\d+\/$/.test(location.href)) {
        let tab_all = GM_getValue(tab_key);
        tab_all = tab_all ? tab_all : [];
        tab_all.push(location.href);
        GM_setValue(tab_key, tab_all);

        let actor_all = GM_getValue(actor_all_key);
        // 如果是最后一位主演，对主演收藏数进行过滤，并新增一键复制按钮
        if (GM_getValue(actor_end_key) === location.href) {
//             console.log('in actor_end_key');
            const actor_all_tit = actor_all.filter(function(actor) {
                let actor_num = actor.num;
                actor_num = actor_num ? actor_num : 0;
                return actor_num >= min_tit;
            });
//             console.log('actor_all_tit', actor_all_tit);
            const actor_all_tag = actor_all.filter(function(actor) {
                let actor_num = actor.num;
                actor_num = actor_num ? actor_num : 0;
                return actor_num >= min_tag;
            });
//             console.log('actor_all_tag', actor_all_tag);
            const button_arr_tit = actor_all_tit.map(function(actor) {
                return actor.text;
            });
//             console.log('button_arr_tit', button_arr_tit);
            const button_arr_tag = actor_all_tag.map(function(actor) {
                return actor.text;
            });
//             console.log('button_arr_tag', button_arr_tag);

            GM_setClipboard(button_arr_tag.join(',') + ';' + button_arr_tit.slice(0, 4).join('/'), 'text');
        }
        return;
    }

    if (!confirm('确定要获取豆瓣人气主演吗？')) {
        return;
    }
    GM_deleteValue(actor_all_key);
    GM_deleteValue(actor_rel_key);
    GM_deleteValue(tab_key);
    GM_deleteValue(actor_end_key);

    const actor_all_ = [];
    const actor_rel_ = {};
    $('[rel="v:starring"]').each(function(i, el) {
        const $el = $(el);
        const href = $el.prop('href');
        const text = $el.text().trim();
        actor_all_[i] = {href: href, text: text};
        actor_rel_[href] = i;
    });
    GM_setValue(actor_all_key, actor_all_);
    GM_setValue(actor_rel_key, actor_rel_);
    GM_setValue(actor_end_key, actor_all_[actor_all_.length - 1].href);

    actor_all_.forEach(function(actor, i) {
        setTimeout(function() {
            const tab = GM_openInTab(actor.href);

            const inter_id = setInterval(function() {
                let tab_all = GM_getValue(tab_key);
                tab_all = tab_all ? tab_all : [];
                if (tab_all.indexOf(actor.href) > -1) {
                    clearInterval(inter_id);
                    tab.close();
                }
            }, 1000);
        }, 3500 * i);
    });
})();