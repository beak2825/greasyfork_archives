// ==UserScript==
// @name         V2EX.SIGN
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  v2ex自动签到
// @author       cinhoo
// @license      GPL-3.0 License
// @match        https://*.v2ex.com/
// @match        https://*.v2ex.com/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @require      https://unpkg.com/axios@1.4.0/dist/axios.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474662/V2EXSIGN.user.js
// @updateURL https://update.greasyfork.org/scripts/474662/V2EXSIGN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function mission_daily() {
        let banner = document.querySelector('#Rightbar a[href="/mission/daily"]')
            || document.querySelector('#Wrapper a[href="/mission/daily"]');
        if (!banner) return;

        let resp = await axios.get("/mission/daily");
        let template = document.createElement("template");
        template.innerHTML = resp.data;

        let button = template.content.querySelector('#Main .cell input[value^="领取"]')
            || template.content.querySelector('#Wrapper .cell input[value^="领取"]');
        let link = button.getAttribute("onclick").match(new RegExp("'([^']*)'"))[1];
        resp = await axios.get(link);
        if (resp.data.includes("每日登录奖励已领取")) {
            banner.parentNode.innerHTML = '<span class="gray"><li class="fa fa-ok-sign" style="color: #0c0;"></li> &nbsp;每日登录奖励已领取</span>';
        }
    }

    mission_daily();
})();