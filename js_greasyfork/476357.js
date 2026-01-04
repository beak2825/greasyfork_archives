// ==UserScript==
// @name         age本地收藏
// @namespace    age.fav.local
// @version      0.1
// @description  为age动漫添加本地收藏。在收藏列表进行管理操作。本地收藏仅能在当前浏览器中使用，不支持跨平台，不支持更新排序，不分账号，也不保证不会丢失。因此建议仅仅用来存放已看完的归档名单。
// @author       BSoD
// @license      MIT
// @match        *://www.agemys.org/my/collects
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476357/age%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/476357/age%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';
    /*const asleep = ms => new Promise(resolve => {
        setTimeout(resolve, ms);
    });
    await asleep(1000);*/

    const loc_fav_get = () => {
        try {
            return JSON.parse(localStorage.local_fav);
        } catch {
            return {};
        }
    };

    const loc_fav_set = (tab) => {
        localStorage.local_fav = JSON.stringify(tab);
    };

    const loc_fav_add = (fav_id, fav_name) => {
        const lftab = loc_fav_get();
        lftab[fav_id] = fav_name;
        loc_fav_set(lftab);
    };

    const loc_fav_rm = (fav_id, fav_name) => {
        const lftab = loc_fav_get();
        delete lftab[fav_id];
        loc_fav_set(lftab);
    };

    const chk_flag = (key, val = null) => {
        const kname = 'loc_fav_flag_' + key;
        if(val === null) {
            return localStorage[kname] == 'true';
        } else {
            //console.log('here', val, val ? 'true' : 'false');
            localStorage[kname] = val ? 'true' : 'false';
            return !!val;
        }
    }

    const add_buttons = () => {
        const btns = $('button.video-item-cancel-fav');
        btns.each(function(){
            const btn = $(this);
            const nbtn = btn.clone();
            const fav_id = btn.attr('node-data-id');
            const fav_name = btn.parent().parent().find('div.video_item-title a').text();
            nbtn.text('+本地').css({
                'right': 'auto',
                'left': '5px',
            }).on('click', (ev) => {
                ev.stopPropagation();
                //console.log('here click add loc', fav_id);
                loc_fav_add(fav_id, fav_name);
                $('div.video_list_box--loc div.row').append(make_col(fav_id, fav_name));
            });
            btn.before(nbtn);
        });
    };

    const add_favs = () => {
        console.log('add fav');
        const el_rmt_flst = $('div.collect_list div.video_list_box--bd');
        const el_loc_flst = $('<div>').addClass('video_list_box--loc');
        const el_row = $('<div>').addClass('row row-cols-6 g-1');
        el_loc_flst.append(
            $('<div>').addClass('text-truncate text-center py-2').text('本地收藏').on('click', (ev) => {
                ev.stopPropagation();
                if(el_row.is(":hidden")) {
                    chk_flag('hide_loc', false);
                    el_row.show();
                } else {
                    chk_flag('hide_loc', true);
                    el_row.hide();
                }
                //el_row.toggle();
            })
        );
        el_loc_flst.append(el_row);
        const lftab = loc_fav_get();
        for(let [fav_id, fav_name] of Object.entries(lftab)) {
            el_row.append(make_col(fav_id, fav_name));
        }
        if(chk_flag('hide_loc')) {
            el_row.hide();
        }
        el_rmt_flst.before(el_loc_flst);
        //console.log('here', el_loc_flst);
        //console.log('here2', loc_fav_get());
    };

    const make_col = (fav_id, fav_name) => {
        const img_url = 'https://cdn.aqdstatic.com:966/age/' + fav_id + '.jpg';
        const page_url = 'https://www.agemys.org/detail/' + fav_id;
        const el_col = $('<div>').addClass('col g-2 position-relative').append(
            $('<div>').addClass('video_item').append(
                $('<div>').addClass('video_item--image position-relative').append(
                    $('<img>').addClass('lazyload d-block w-100').css('display', 'block')
                    .attr('referrerpolicy', 'no-referrer').attr('src', img_url).attr('data-original', img_url)
                ).append(
                    $('<div>').addClass('video-mask')
                ).append(
                    $('<i>').addClass('video-player-icon')
                ).append(
                    $('<button>').addClass('btn btn-sm btn-danger video-item-cancel-fav').attr('type', 'button')
                    .attr('node-data-id', fav_id).attr('node-data-status', '1').text('取消本地收藏').on('click', (ev) => {
                        ev.stopPropagation();
                        //console.log('here click rm loc', fav_id);
                        loc_fav_rm(fav_id, fav_name);
                        el_col.remove();
                    })
                )
            ).append(
                $('<div>').addClass('video_item-title text-truncate text-center py-2').append(
                    $('<a>').addClass('link-light text-decoration-none stretched-link').attr('href', page_url)
                    .text(fav_name)
                )
            )
        )
        return el_col;
    };

    const cur_url = location.href;
    if(cur_url.includes('collects')) {
        add_buttons();
        add_favs();
    }
});