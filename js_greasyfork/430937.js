// ==UserScript==
// @name         98堂自动签到
// @namespace    Never4Ever.Sign98
// @version      0.3
// @description  每天第一次浏览98堂时自动签到
// @author       Never4Ever
// @include      https://www.sehuatang.*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430937/98%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/430937/98%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var my_date = new Date();
    var last_sign_date = GM_getValue("98tang+last+sign+date");

    var url = "https://" + window.location.host + "/plugin.php?id=dd_sign&mod=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign";
    var jump_url = "https://" + window.location.host + "/plugin.php?id=dd_sign:index";

    var signed = false;
    if (last_sign_date != undefined && last_sign_date == my_date.toLocaleDateString()) {
        signed = true;
    }

    var buttonSign = '<button style="background: #b50000;color: white;" id="mySignButton">签到</button>';

    if (!document.getElementById('mySignButton')) {
        var scoreP = document.getElementById('extcreditmenu');
        scoreP.insertAdjacentHTML('beforebegin', buttonSign);
    }

    var mySignButton = document.getElementById('mySignButton');
    mySignButton.onclick = function () {
        window.open(jump_url);
    }

    if (signed) {
        mySignButton.innerText = "今日已签到";
        mySignButton.style.background='grey';
    }
    else {
        //签到
        GM_xmlhttpRequest(
            {
                method: "get",
                url: url,
                onload: function (r) {
                    GM_setValue("98tang+last+sign+date", my_date.toLocaleDateString());
                    signed = true;
                    mySignButton.innerText = "今日已签到"
                    mySignButton.style.background='grey';
                    window.open(jump_url);
                }
            }
        );
    }
















    // Your code here...
})();