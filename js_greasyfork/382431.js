// ==UserScript==
// @name            wsmud_status_size
// @namespace       edc
// @version         0.0.4
// @date            01/05/2019
// @modified        01/05/2019
// @homepage        https://greasyfork.org/zh-CN/scripts/382431-wsmud-status-size
// @description     武神传说 MUD
// @author          edcit.cn
// @match           http://*.wsmud.com/*
// @require         http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/382431/wsmud_status_size.user.js
// @updateURL https://update.greasyfork.org/scripts/382431/wsmud_status_size.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $("head").append(`<style type='text/css'>.item-status-bar > .status-item{font-size:0.5rem;}</style>`);
})();