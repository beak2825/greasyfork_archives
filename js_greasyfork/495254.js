// ==UserScript==
// @name         tapd_unlock
// @namespace    https://www.tapd.cn
// @version      0.1
// @description  VIP for tapd
// @author       dino
// @match        https://www.tapd.cn/*
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/495254/tapd_unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/495254/tapd_unlock.meta.js
// ==/UserScript==
/* global ajaxHooker*/
(function() {
    'use strict';
    ajaxHooker.hook(request => {
        if (request.url.includes('get_company_renew_info')) {
            request.response = res => {
                const data_json = JSON.parse(res.responseText);
                const data = data_json.data;
                data.product_info.member_num_limit = 1000;
                res.responseText = JSON.stringify(data_json);
            };
        }
    });
})();