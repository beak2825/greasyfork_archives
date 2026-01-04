// ==UserScript==
// @name        Calculate JustMySocks Flow
// @namespace   superszy
// @author      superszy
// @version     1.0
// @description Auto calculate JustMySocks flow info to a simple format
// @match       https://justmysocks5.net/members/getbwcounter.php*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/442909/Calculate%20JustMySocks%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/442909/Calculate%20JustMySocks%20Flow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jsonStr = document.querySelector("body").innerText;
    let json = JSON.parse(jsonStr);

    json.monthly_bw_limit_g = json.monthly_bw_limit_b/1000/1000/1000;
    json.bw_counter_g = json.bw_counter_b/1000/1000/1000;
    json.radio = json.bw_counter_b / json.monthly_bw_limit_b;

    document.querySelector("body").innerText += '\n\n流量限制：' + json.monthly_bw_limit_g + ' GB\n已用流量：' + json.bw_counter_g + ' GB\n已用比例：' + json.radio*100 + ' %\n刷新日期：' + json.bw_reset_day_of_month;
})();