// ==UserScript==
// @name         带鱼屏助手
// @namespace    http://trycatch.xyz/dyp
// @version      0.1
// @description  有些网站对超宽屏支持不好，这个插件可以强制将网页宽度设置成1080居中显示，可以勉强用一下。
// @author       Yang
// @include      *
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/395826/%E5%B8%A6%E9%B1%BC%E5%B1%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/395826/%E5%B8%A6%E9%B1%BC%E5%B1%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DB_KEY = "HOST_LIST";
    let host = window.location.hostname;
    let do_cmd_id = GM_registerMenuCommand("适配", on_do);
    let undo_cmd_id = GM_registerMenuCommand("取消适配", on_undo);
    let do_cmd_show = true;
    let undo_cmd_show = true;

    function show_do_cmd() {
        if(do_cmd_show == false) {
            do_cmd_id = GM_registerMenuCommand("适配", on_do);
            do_cmd_show = true;
        }
        
    }

    function show_undo_cmd() {
        if(undo_cmd_show == false) {
            undo_cmd_id = GM_registerMenuCommand("取消适配", on_undo);
            undo_cmd_show = true;
        }
    }

    function hide_do_cmd() {
        if(do_cmd_show == true) {
            GM_unregisterMenuCommand(do_cmd_id);
            do_cmd_show = false;
        }
    }

    function hide_undo_cmd() {
        if(undo_cmd_show == true) {
            GM_unregisterMenuCommand(undo_cmd_id);
            undo_cmd_show = false;
        }
    }

    function is_host_in_db(host) {
        let host_list = GM_getValue(DB_KEY, []);
        if (host_list.indexOf(host) == -1) {
            return false;
        } else {
            return true;
        }
    }

    function add_host(host) {
        if (is_host_in_db(host)) {
            return;
        }
        let host_list = GM_getValue(DB_KEY, []);
        host_list.push(host)
        GM_setValue(DB_KEY, host_list);
    }

    function remove_host(host) {
        if (is_host_in_db(host)) {
            let host_list = GM_getValue(DB_KEY, []);
            let new_list = host_list.filter(item => item != host)
            GM_setValue(DB_KEY, new_list);
        }
    }

    function on_do() {
        add_host(host);
        document.body.style.left = (document.body.clientWidth - 1080) / 2 + "px";
        document.body.style.width = "1080px";
        document.body.style.position = "relative";
        hide_do_cmd();
        show_undo_cmd();
    };

    function on_undo() {
        remove_host(host);
        hide_undo_cmd();
        show_do_cmd();
        window.location.reload();
    };

    if (is_host_in_db(host)) {
        hide_do_cmd();
        show_undo_cmd();
        on_do();
    } else {
        hide_undo_cmd();
        show_do_cmd();
    }
})();