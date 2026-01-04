// ==UserScript==
// @name         B站直播间自动抢天选时刻和自动跟风combo弹幕
// @namespace    http://tampermonkey.net/
// @homepage     https://ltxlong.github.io/sc-catch-doc/
// @version      2.1.1
// @description  自动点击天选时刻、自动跟风发送combo弹幕，可以配置开启/关闭单个功能，可以配置是否需要关注才执行，默认需要关注，有直播间黑名单功能
// @author       ltxlong
// @match        *://live.bilibili.com/1*
// @match        *://live.bilibili.com/2*
// @match        *://live.bilibili.com/3*
// @match        *://live.bilibili.com/4*
// @match        *://live.bilibili.com/5*
// @match        *://live.bilibili.com/6*
// @match        *://live.bilibili.com/7*
// @match        *://live.bilibili.com/8*
// @match        *://live.bilibili.com/9*
// @match        *://live.bilibili.com/blanc/1*
// @match        *://live.bilibili.com/blanc/2*
// @match        *://live.bilibili.com/blanc/3*
// @match        *://live.bilibili.com/blanc/4*
// @match        *://live.bilibili.com/blanc/5*
// @match        *://live.bilibili.com/blanc/6*
// @match        *://live.bilibili.com/blanc/7*
// @match        *://live.bilibili.com/blanc/8*
// @match        *://live.bilibili.com/blanc/9*
// @icon         https://www.bilibili.com/favicon.ico
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.js
// @resource Swal     https://unpkg.com/sweetalert2@11/dist/sweetalert2.min.css
// @resource SwalDark https://unpkg.com/@sweetalert2/theme-dark@5/dark.min.css
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/506290/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%A4%A9%E9%80%89%E6%97%B6%E5%88%BB%E5%92%8C%E8%87%AA%E5%8A%A8%E8%B7%9F%E9%A3%8Ecombo%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/506290/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%A4%A9%E9%80%89%E6%97%B6%E5%88%BB%E5%92%8C%E8%87%AA%E5%8A%A8%E8%B7%9F%E9%A3%8Ecombo%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let live_player_div = document.getElementById('live-player');
    if (!live_player_div) { return; }

    let room_id_str_arr = unsafeWindow.location.pathname.split('/');
    let room_id = room_id_str_arr.pop();
    if (!room_id) {
        if (room_id_str_arr[1]) {
            room_id = room_id_str_arr[1];
        }
    }
    let real_room_id = room_id;

    let room_url_api = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=';
    let room_fetch_url = room_url_api + room_id;

    let follow_api = 'https://api.bilibili.com/x/relation?fid=';
    let live_room_up_uid = 0; // 主播的uid，查询关注关系用

    let dm_send_api = 'https://api.live.bilibili.com/msg/send';
    let u_frsc = (document.cookie.split(';').map(c=>c.trim()).find(c => c.startsWith('bili_jct=')) || '').split('bili_jct=')[1] || ''; // 发送弹幕用
    let u_frsc_flag = u_frsc !== ''; // 是否已经登录
    let combo_dm_recent_send_arr = []; // 已经跟风发送的combo弹幕，发送后，30秒剔除
    let auto_dm_send_last_rnd = 0; // 上一次跟风发送combo弹幕的时间s，用于判断至少间隔20秒才再次查询关注
    let last_follow_check_flag = false; // 上一次查询关注结果
    let combo_dm_send_fail_arr = []; // 发送失败的combo弹幕，用于再次发送判断，失败10秒后或者发送成功后剔除

    let flag_isFullscreen = false;

    let live_auto_room_blacklist_flag = false; // 是否本房间在黑名单

    let live_auto_tianxuan_follow_flag = true; // 是否关注了的主播才自动天选

    let live_auto_dm_combo_follow_flag = true; // 是否关注了的主播才自动跟风

    let live_auto_tianxuan_switch_flag = true; // 是否打开自动天选功能

    let live_auto_dm_combo_switch_flag = true; // 是否打开自动跟风功能

    let the_swalcss_color = "#ff679a";

    let swalcss = `
			.swal2-styled{transition: all 0.2s ease;}
			.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:${the_swalcss_color} transparent }
			.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:${the_swalcss_color};color:#fff;font-size:1em}
			.swal2-styled.swal2-confirm:hover,.swal2-styled.swal2-deny:hover{opacity:0.8;background-image:none!important}
			.swal2-styled.swal2-confirm:focus{box-shadow:0 0 0 3px ${the_swalcss_color}80}
			.swal2-styled.swal2-deny:focus{box-shadow:0 0 0 3px #dc374180}
			.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}
			.swal2-timer-progress-bar{width:100%;height:.25em;background:${the_swalcss_color}33 }
			.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:${the_swalcss_color};color:#fff;line-height:2em;text-align:center}
			.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:${the_swalcss_color} }
			.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:${the_swalcss_color}}
			.swal2-popup {padding:1.25em 0 1.25em;flex-direction:column}
			.swal2-close {position:absolute;top:1px;right:1px;transition: all 0.2s ease;}
			div:where(.swal2-container) .swal2-html-container{padding: 1.3em 1.3em 0.3em;}
			div:where(.swal2-container) button:where(.swal2-close):hover {color:${the_swalcss_color}!important;font-size:60px!important}
			div:where(.swal2-icon) .swal2-icon-content {font-family: sans-serif;}
			.swal2-container {z-index: 1145141919810;}
			`;

    // 动态添加样式
    function addStyle(id, css, tag = 'style', element = 'body', position = 'before') {
        let styleDom = document.getElementById(id);
        if (styleDom) styleDom.remove();
        let style = document.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        if (position === "before") {
            $(element).prepend($(style));
        } else {
            $(element).append($(style));
        }
    }

    // 先监听颜色方案变化
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (e) {
        if (e.matches) {
            // 切换到暗色主题
            addStyle('swal-pub-style', GM_getResourceText('SwalDark'));
        } else {
            // 切换到浅色主题
            addStyle('swal-pub-style', GM_getResourceText('Swal'));
        }

        addStyle('Panlinker-SweetAlert2-User', swalcss);
    });
    // 再修改主题
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 切换到暗色主题
        addStyle('swal-pub-style', GM_getResourceText('SwalDark'));
    } else {
        // 切换到浅色主题
        addStyle('swal-pub-style', GM_getResourceText('Swal'));
    }

    addStyle('Panlinker-SweetAlert2-User', swalcss);

    // Toast 提示配置
    let toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        showCloseButton: true,
        didOpen: function (toast) {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    // Toast 简易调用
    let message = {
        success: function (text) {
            toast.fire({ title: text, icon: 'success' });
        },
        error: function (text) {
            toast.fire({ title: text, icon: 'error' });
        },
        warning: function (text) {
            toast.fire({ title: text, icon: 'warning' });
        },
        info: function (text) {
            toast.fire({ title: text, icon: 'info' });
        },
        question: function (text) {
            toast.fire({ title: text, icon: 'question' });
        }
    };

    let menu_item_blacklist = null;
    let menu_item_tianxuan_switch = null;
    let menu_item_dm_combo_switch = null;
    let menu_item_tianxuan_follow = null;
    let menu_item_dm_combo_follow = null;

    function check_blacklist_menu(room_id) {
        let auto_room_black_list_json = unsafeWindow.localStorage.getItem('live_auto_room_blacklist');
        if (auto_room_black_list_json === null || auto_room_black_list_json === 'null' || auto_room_black_list_json === '[]' || auto_room_black_list_json === '') {
            // 显示加入黑名单
            menu_item_blacklist = GM_registerMenuCommand('点击将当前直播房间加入黑名单', function() {
                unsafeWindow.localStorage.setItem('live_auto_room_blacklist', JSON.stringify([room_id]));

                live_auto_room_blacklist_flag = true;

                message.success('当前直播房间已加入黑名单！<br><br>插件在本页面已停止运行！');

                add_menu_item_all();
            });

            live_auto_room_blacklist_flag = false;

        } else {
            let auto_room_black_list = JSON.parse(auto_room_black_list_json);
            if (auto_room_black_list.includes(room_id)) {
                // 显示移除黑名单
                menu_item_blacklist = GM_registerMenuCommand('当前直播房间已加入黑名单，点击移出黑名单', function() {
                    auto_room_black_list = auto_room_black_list.filter(item => item !== room_id);
                    unsafeWindow.localStorage.setItem('live_auto_room_blacklist', JSON.stringify(auto_room_black_list));

                    live_auto_room_blacklist_flag = false;

                    message.success('当前直播房间已除出黑名单！<br><br>插件在本页面开始运行！');

                    add_menu_item_all();
                });

                live_auto_room_blacklist_flag = true;

            } else {
                // 显示加入黑名单
                menu_item_blacklist = GM_registerMenuCommand('点击将当前直播房间加入黑名单', function() {
                    auto_room_black_list.push(room_id);
                    unsafeWindow.localStorage.setItem('live_auto_room_blacklist', JSON.stringify(auto_room_black_list));

                    live_auto_room_blacklist_flag = true;

                    message.success('当前直播房间已加入黑名单！<br><br>插件在本页面已停止运行！');

                    add_menu_item_all();
                });

                live_auto_room_blacklist_flag = false;

            }
        }
    }

    check_blacklist_menu(room_id);

    function check_switch_tianxuan_config_menu() {
        let live_auto_tianxuan_switch_flag_get = unsafeWindow.localStorage.getItem('live_auto_tianxuan_switch_flag');
        if (live_auto_tianxuan_switch_flag_get === null || live_auto_tianxuan_switch_flag_get === 'null' || live_auto_tianxuan_switch_flag_get === '') {

            menu_item_tianxuan_switch = GM_registerMenuCommand('点击关闭自动抢天选时刻（现在已开启）', function() {

                unsafeWindow.localStorage.setItem('live_auto_tianxuan_switch_flag', 'false');

                live_auto_tianxuan_switch_flag = false;

                message.success('已关闭自动抢天选时刻！');

                add_menu_item_all();
            });

            live_auto_tianxuan_switch_flag = true;

        } else {

            if (live_auto_tianxuan_switch_flag_get === 'true') {

                menu_item_tianxuan_switch = GM_registerMenuCommand('点击关闭自动抢天选时刻（现在已开启）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_tianxuan_switch_flag', 'false');

                    live_auto_tianxuan_switch_flag = false;

                    message.success('已关闭自动抢天选时刻！');

                    add_menu_item_all();
                });

                live_auto_tianxuan_switch_flag = true;

            } else {

                menu_item_tianxuan_switch = GM_registerMenuCommand('点击开启自动抢天选时刻（现在已关闭）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_tianxuan_switch_flag', 'true');

                    live_auto_tianxuan_switch_flag = true;

                    message.success('已开启自动抢天选时刻！');

                    add_menu_item_all();
                });

                live_auto_tianxuan_switch_flag = false;
            }
        }
    }

    check_switch_tianxuan_config_menu();

    function check_switch_dm_combo_config_menu() {
        let live_auto_dm_combo_switch_flag_get = unsafeWindow.localStorage.getItem('live_auto_dm_combo_switch_flag');
        if (live_auto_dm_combo_switch_flag_get === null || live_auto_dm_combo_switch_flag_get === 'null' || live_auto_dm_combo_switch_flag_get === '') {

            menu_item_dm_combo_switch = GM_registerMenuCommand('点击关闭自动跟风combo弹幕（现在已开启）', function() {

                unsafeWindow.localStorage.setItem('live_auto_dm_combo_switch_flag', 'false');

                live_auto_dm_combo_switch_flag = false;

                message.success('已关闭自动跟风combo弹幕！');

                add_menu_item_all();
            });

            live_auto_dm_combo_switch_flag = true;

        } else {

            if (live_auto_dm_combo_switch_flag_get === 'true') {

                menu_item_dm_combo_switch = GM_registerMenuCommand('点击关闭自动跟风combo弹幕（现在已开启）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_dm_combo_switch_flag', 'false');

                    live_auto_dm_combo_switch_flag = false;

                    message.success('已关闭自动跟风combo弹幕！');

                    add_menu_item_all();
                });

                live_auto_dm_combo_switch_flag = true;

            } else {

                menu_item_dm_combo_switch = GM_registerMenuCommand('点击开启自动跟风combo弹幕（现在已关闭）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_dm_combo_switch_flag', 'true');

                    live_auto_dm_combo_switch_flag = true;

                    message.success('已开启自动跟风combo弹幕！');

                    add_menu_item_all();
                });

                live_auto_dm_combo_switch_flag = false;
            }
        }
    }

    check_switch_dm_combo_config_menu();

    function check_follow_tianxuan_config_menu() {
        let live_auto_tianxuan_follow_flag_get = unsafeWindow.localStorage.getItem('live_auto_tianxuan_follow_flag');
        if (live_auto_tianxuan_follow_flag_get === null || live_auto_tianxuan_follow_flag_get === 'null' || live_auto_tianxuan_follow_flag_get === '') {
            // 显示取消必须关注才生效
            menu_item_tianxuan_follow = GM_registerMenuCommand('点击设置不需要关注也自动抢天选时刻（现在需要）', function() {

                unsafeWindow.localStorage.setItem('live_auto_tianxuan_follow_flag', 'false');

                live_auto_tianxuan_follow_flag = false;

                message.success('已设置：<br><br>不需要关注主播也自动抢天选时刻！');

                add_menu_item_all();
            });

            live_auto_tianxuan_follow_flag = true;

        } else {

            if (live_auto_tianxuan_follow_flag_get === 'true') {
                // 显示取消必须关注才生效
                menu_item_tianxuan_follow = GM_registerMenuCommand('点击设置不需要关注也自动抢天选时刻（现在需要）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_tianxuan_follow_flag', 'false');

                    live_auto_tianxuan_follow_flag = false;

                    message.success('已设置：<br><br>不需要关注主播也自动抢天选时刻！');

                    add_menu_item_all();
                });

                live_auto_tianxuan_follow_flag = true;

            } else {
                // 显示必须关注才生效
                menu_item_tianxuan_follow = GM_registerMenuCommand('点击设置需要关注才会自动抢天选时刻（现在不需要）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_tianxuan_follow_flag', 'true');

                    live_auto_tianxuan_follow_flag = true;

                    message.success('已设置：<br><br>需要关注主播才会自动抢天选时刻！');

                    add_menu_item_all();
                });

                live_auto_tianxuan_follow_flag = false;
            }
        }
    }

    check_follow_tianxuan_config_menu();

    function check_follow_dm_combo_config_menu() {
        let live_auto_dm_combo_follow_flag_get = unsafeWindow.localStorage.getItem('live_auto_dm_combo_follow_flag');
        if (live_auto_dm_combo_follow_flag_get === null || live_auto_dm_combo_follow_flag_get === 'null' || live_auto_dm_combo_follow_flag_get === '') {
            // 显示取消必须关注才生效
            menu_item_dm_combo_follow = GM_registerMenuCommand('点击设置不需要关注也自动跟风combo弹幕（现在需要）', function() {

                unsafeWindow.localStorage.setItem('live_auto_dm_combo_follow_flag', 'false');

                live_auto_dm_combo_follow_flag = false;

                message.success('已设置：<br><br>不需要关注主播也自动跟风combo弹幕！');

                add_menu_item_all();
            });

            live_auto_dm_combo_follow_flag = true;

        } else {

            if (live_auto_dm_combo_follow_flag_get === 'true') {
                // 显示取消必须关注才生效
                menu_item_dm_combo_follow = GM_registerMenuCommand('点击设置不需要关注也自动跟风combo弹幕（现在需要）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_dm_combo_follow_flag', 'false');

                    live_auto_dm_combo_follow_flag = false;

                    message.success('已设置：<br><br>不需要关注主播也自动跟风combo弹幕！');

                    add_menu_item_all();
                });

                live_auto_dm_combo_follow_flag = true;

            } else {
                // 显示必须关注才生效
                menu_item_dm_combo_follow = GM_registerMenuCommand('点击设置需要关注才会自动跟风combo弹幕（现在不需要）', function() {

                    unsafeWindow.localStorage.setItem('live_auto_dm_combo_follow_flag', 'true');

                    live_auto_dm_combo_follow_flag = true;

                    message.success('已设置：<br><br>需要关注主播才会自动跟风combo弹幕！');

                    add_menu_item_all();
                });

                live_auto_dm_combo_follow_flag = false;
            }
        }
    }

    check_follow_dm_combo_config_menu();

    function remove_menu_item_all() {
        GM_unregisterMenuCommand(menu_item_blacklist);
        GM_unregisterMenuCommand(menu_item_tianxuan_switch);
        GM_unregisterMenuCommand(menu_item_dm_combo_switch);
        GM_unregisterMenuCommand(menu_item_tianxuan_follow);
        GM_unregisterMenuCommand(menu_item_dm_combo_follow);
    }

    function add_menu_item_all() {
        remove_menu_item_all();

        check_blacklist_menu(room_id);
        check_switch_tianxuan_config_menu();
        check_switch_dm_combo_config_menu();
        check_follow_tianxuan_config_menu();
        check_follow_dm_combo_config_menu();
    }

    function roominfo_get_upuid_fetch() {
        // 获取room消息，并且解析出up_uid
        return fetch(room_fetch_url, { credentials: 'include' }).then(response => {
            return response.json();
        }).then(ret => {
            if (ret.code === 0) {
                live_room_up_uid = ret.data?.room_info?.uid || 0;
                real_room_id = ret.data?.room_info?.room_id || room_id;
            }

            return live_room_up_uid;
        }).catch(error => {
            return live_room_up_uid;
        });
    }

    // 返回true-已关注，false-未关注。需要.then()链式调用获取结果
    function get_follow_up_flag() {
        if (live_room_up_uid === 0) {
            roominfo_get_upuid_fetch().then(the_live_room_up_uid => {
                live_room_up_uid = the_live_room_up_uid;
            });
        }

        return fetch(follow_api + live_room_up_uid, {
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(ret => {
            if (ret.code === 0 && ret.data.attribute !== 0 && ret.data.attribute !== 128) {
                return true;
            } else {
                return false;
            }
        }).catch(error => {
            return false;
        });
    }

    function close_and_remove_tip_modal() {
        // 关闭模态框
        $(document).find('.auto_tip_mod').hide();

        // 从 body 中移除模态框
        $(document).find('.auto_tip_mod').remove();
    }

    function open_and_close_tip_modal(show_str, show_color) {

        let auto_tip_modal = document.createElement('div');
        auto_tip_modal.className = 'auto_tip_mod';
        auto_tip_modal.style.position = 'fixed';
        auto_tip_modal.style.display = 'none';
        auto_tip_modal.style.color = show_color;
        auto_tip_modal.style.textAlign = 'center';
        auto_tip_modal.style.backgroundColor = '#ffffff';
        auto_tip_modal.style.border = 0;
        auto_tip_modal.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.3)';
        auto_tip_modal.innerHTML = show_str;
        auto_tip_modal.style.zIndex = 3333;

        auto_tip_modal.style.borderRadius = '10px';
        auto_tip_modal.style.padding = '10px';
        auto_tip_modal.style.left = unsafeWindow.innerWidth / 2 + 'px';
        auto_tip_modal.style.top = unsafeWindow.innerHeight / 2 + 'px';

        if (flag_isFullscreen) {
            $(document).find('#live-player').append(auto_tip_modal);
        } else {
            document.body.appendChild(auto_tip_modal);
        }

        // 显示模态框
        auto_tip_modal.style.display = 'block';

        // 在一定时间后关闭并删除模态框
        setTimeout(() => {
            close_and_remove_tip_modal();
        }, 1500);
    }

    // 自动天选
    function auto_tianxuan_handle(the_sc_follow_up_flag) {
        setTimeout(() => {
            let the_anchor_box_iframe_obj = $('#anchor-guest-box-id iframe').contents();
            if (the_anchor_box_iframe_obj.length === 0) {
                the_anchor_box_iframe_obj = $('.m-nobar__popup-container__popup-content iframe').contents();
            }
            let the_click_btn = the_anchor_box_iframe_obj.find('#app .participation-box .particitation-btn img.btn-name');
            let the_close_btn = the_anchor_box_iframe_obj.find('#app .participation-box .close-btn');

            let the_anchor_auto_joinTimeout;
            let the_anchor_auto_closeTimeout;

            if (the_sc_follow_up_flag && the_click_btn.length) {

                clearTimeout(the_anchor_auto_joinTimeout);
                clearTimeout(the_anchor_auto_closeTimeout);

                // 延时2s后
                the_anchor_auto_joinTimeout = setTimeout(() => {
                    the_click_btn.trigger('click');

                    open_and_close_tip_modal('成功自动点击天选 ✓', '#A7C9D3');

                }, 2000);

                // 延时2s后
                the_anchor_auto_closeTimeout = setTimeout(() => {
                    the_close_btn.trigger('click');

                    // 兼容天选关闭按钮失效的情况
                    $('.m-nobar__popup-container').hide();
                }, 2000);
            }
        }, 1000); // 等渲染完成
    }

    // 发送弹幕
    function send_dm_fetch(msg, rnd) {

        return fetch(dm_send_api, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: `color=16777215&fontsize=25&mode=1&msg=${msg}&rnd=${rnd}&roomid=${real_room_id}&csrf=${u_frsc}`
        }).then(response => {
            return response.json();
        }).then(ret => {

            if (ret.code === 0) {
                return true;
            } else {
                return false;
            }
        }).catch(error => {
            return false;
        });
    }

    function to_dm_fetch(the_combo_dm_msg, the_time_rnd) {

        send_dm_fetch(the_combo_dm_msg, the_time_rnd).then(the_dm_send_flag => {

            if (the_dm_send_flag) {
                // 定时、剔除（相同的combo弹幕相隔30秒）
                setTimeout(() => {
                    combo_dm_recent_send_arr = combo_dm_recent_send_arr.filter(dm_item => dm_item !== the_combo_dm_msg);
                    combo_dm_send_fail_arr = combo_dm_send_fail_arr.filter(dm_item => dm_item !== the_combo_dm_msg);
                }, 30 * 1000);

            } else {

                if (combo_dm_send_fail_arr.includes(the_combo_dm_msg)) {
                    // 连续两次发送失败，10s后再给机会
                    setTimeout(() => {
                        combo_dm_recent_send_arr = combo_dm_recent_send_arr.filter(dm_item => dm_item !== the_combo_dm_msg);
                        combo_dm_send_fail_arr = combo_dm_send_fail_arr.filter(dm_item => dm_item !== the_combo_dm_msg);
                    }, 10 * 1000);

                } else {
                    combo_dm_recent_send_arr = combo_dm_recent_send_arr.filter(dm_item => dm_item !== the_combo_dm_msg);
                    combo_dm_send_fail_arr.push(the_combo_dm_msg);
                }
            }
        });
    }

    // 自动跟风发送combo弹幕
    function auto_dm_combo_handle(parsedArr_info) {

        const the_combo_dm_msg = parsedArr_info[1];

        // 因有时候combo弹幕会额外的带 x/×/X数字结尾，故过滤掉
        if (!/[x×X]\d+$/.test(the_combo_dm_msg)) {

            combo_dm_recent_send_arr.push(the_combo_dm_msg);

            const the_time_rnd = parseInt((new Date).getTime() / 1000);

            // 查询关注至少相隔20s（10s好像太少，30s又太多，那就20s吧）
            if (the_time_rnd - auto_dm_send_last_rnd > 20) {

                if (live_auto_dm_combo_follow_flag) {
                    get_follow_up_flag().then(the_sc_follow_up_flag => {

                        auto_dm_send_last_rnd = the_time_rnd;
                        last_follow_check_flag = the_sc_follow_up_flag;

                        if (the_sc_follow_up_flag) {
                            to_dm_fetch(the_combo_dm_msg, the_time_rnd);
                        }
                    });
                } else {
                    to_dm_fetch(the_combo_dm_msg, the_time_rnd);
                }

            } else {

                if (live_auto_dm_combo_follow_flag) {
                    if (last_follow_check_flag) {
                        to_dm_fetch(the_combo_dm_msg, the_time_rnd);
                    }
                } else {
                    to_dm_fetch(the_combo_dm_msg, the_time_rnd);
                }
            }
        }
    }

    function sc_handleFullscreenChange() {
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) {

            flag_isFullscreen = true;
        } else {
            flag_isFullscreen = false;
        }
    }

    live_player_div.addEventListener('fullscreenchange', sc_handleFullscreenChange);
    live_player_div.addEventListener('webkitfullscreenchange', sc_handleFullscreenChange);
    live_player_div.addEventListener('mozfullscreenchange', sc_handleFullscreenChange);
    live_player_div.addEventListener('MSFullscreenChange', sc_handleFullscreenChange);

    roominfo_get_upuid_fetch().then(the_live_room_up_uid => {

        live_room_up_uid = the_live_room_up_uid;

        setTimeout(() => {
            if (!live_auto_room_blacklist_flag && u_frsc_flag && live_auto_tianxuan_switch_flag) {
                if (live_auto_tianxuan_follow_flag) {
                    get_follow_up_flag().then(the_sc_follow_up_flag => {
                        let the_anchor_before_obj = $(document).find('#gift-control-vm .anchor-lottery-entry');

                        if (the_sc_follow_up_flag && the_anchor_before_obj.length) {
                            the_anchor_before_obj.trigger('click'); // 若已关注，并且已经存在天选，则先触发点击，展开天选弹窗

                            auto_tianxuan_handle(the_sc_follow_up_flag);
                        }
                    });

                } else {
                    let the_anchor_before_obj = $(document).find('#gift-control-vm .anchor-lottery-entry');

                    if (the_anchor_before_obj.length) {
                        the_anchor_before_obj.trigger('click'); // 若已关注，并且已经存在天选，则先触发点击，展开天选弹窗

                        auto_tianxuan_handle(true);
                    }
                }
            }
        }, 3000); // 等渲染完成
    });

    const original_parse = JSON.parse;
    JSON.parse = function (str) {
        try {
            const parsed_arr = original_parse(str);
            if (!live_auto_room_blacklist_flag && u_frsc_flag && parsed_arr && parsed_arr.cmd !== undefined) {
                if (live_auto_dm_combo_switch_flag && parsed_arr.cmd === 'DANMU_MSG') {
                    if (parsed_arr.info && parsed_arr.info[0][15]['extra'].includes('"hit_combo\":1') && !combo_dm_recent_send_arr.includes(parsed_arr.info[1])) {
                        auto_dm_combo_handle(parsed_arr.info);
                    }

                } else if (live_auto_tianxuan_switch_flag && parsed_arr.cmd === 'ANCHOR_LOT_START') {
                    if (live_auto_tianxuan_follow_flag) {
                        get_follow_up_flag().then(the_sc_follow_up_flag => {
                            auto_tianxuan_handle(the_sc_follow_up_flag);
                        });
                    } else {
                        auto_tianxuan_handle(true);
                    }
                }
            }

            return parsed_arr;
        } catch (error) {
            throw error;
        }
    };
})();