// ==UserScript==
// @name         reset_HRhomeBtn

// @version      0.3
// @description  fix home button
// @author       SeraphEST
// @include      /work.huaray.com.tw/admin/
// @icon         https://www.google.com/s2/favicons?domain=huaray.com.tw
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-duration-format/2.3.2/moment-duration-format.min.js
// @require      https://cdn.jsdelivr.net/npm/moment-taiwan@0.0.4/src/moment-taiwan.js
// @license MIT
// @namespace https://greasyfork.org/users/818008
// @downloadURL https://update.greasyfork.org/scripts/438508/reset_HRhomeBtn.user.js
// @updateURL https://update.greasyfork.org/scripts/438508/reset_HRhomeBtn.meta.js
// ==/UserScript==
/* jshint esversion:8 */
/* global $, moment */

(function() {
    'use strict';
    $("#goWebHome").attr("onclick", `window.open("/admin/index/index.php")`);
    
    if(/design\/work_time\.php/i.test(location.href)){
        let inject_target = $("td.right_bg");
        let prev_btn = $("<div>上一天</div>");
        let next_btn = $("<div>下一天</div>");
        let next_day = moment($("#work_date").val()).add(1, 'd').format("YYYY-MM-DD");
        let prev_day = moment($("#work_date").val()).subtract(1, 'd').format("YYYY-MM-DD");
        prev_btn.on("click", ()=>{
            location.href=`/admin/design/work_time.php?work_date=${prev_day}`;
        });
        next_btn.on("click", ()=>{
            location.href=`/admin/design/work_time.php?work_date=${next_day}`;
        });
        inject_target.append(prev_btn);
        inject_target.append(next_btn);
    }
})();