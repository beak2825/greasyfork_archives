// ==UserScript==
// @name         Premium Tanks Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mark the premium tanks you already own!
// @author       horussjr
// @match        http://wiki.wargaming.net/en/Premium_Tanks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38381/Premium%20Tanks%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/38381/Premium%20Tanks%20Tracker.meta.js
// ==/UserScript==

var userDetails = document.querySelector('script[data-user_id][data-user_name][data-realm]');
var account_id = userDetails.getAttribute('data-user_id');
var realm = userDetails.getAttribute('data-realm');

$.ajax({
    url: "https://api.worldoftanks." + realm + "/wot/encyclopedia/vehicles/?application_id=a64ba28ef0d3fb93d0e702c94b877b08",
    type: "POST",
    data: {
        "fields": "is_premium,name"
    },
    dataType: 'json',
    success: function(response) {
        var data = {};
        for (var i in response.data) {
            if (response.data[i].is_premium) {
                data[i] = response.data[i];
                if (response.data[i].name == 'T-44-100') response.data[i].name = 'T-44-100 (R)';
            }
        }
        $.ajax({
            url: "https://api.worldoftanks." + realm + "/wot/account/tanks/?application_id=a64ba28ef0d3fb93d0e702c94b877b08",
            type: "POST",
            data: {
                "account_id": account_id,
                "fields": "tank_id"
            },
            dataType: 'json',
            success: function(response) {
                for (var i in response.data[account_id]) {
                    if (data.hasOwnProperty(response.data[account_id][i].tank_id)) {
                        $(".b-description-img_name__premium").each(function(){
                            if ($(this).text() == data[response.data[account_id][i].tank_id].name) {
                                $(this).parent().parent().prepend('<img class="owned-prem" src="https://s24.postimg.org/4bc6ugyyd/ok_512.png" style="position:absolute;z-index:5;width:24px;height:24px;float:right;right:5px;top:5px;"/>');
                            }
                        });
                    }
                }
                var totalCount = Math.round($('.b-description-img').length/3);
                myPrem = Math.round($('.owned-prem').length/3);
                document.body.innerHTML += '<div style="position:fixed;width:200px;height:40px;z-index:5;background:#008000;text-align:center;bottom:0;right:20px;color:#fff;line-height:10px;border-radius:15px 15px 0 0"><span style="font-size:18px;display:block;margin-top:8px;">You own</span><br>' + myPrem + '/' + totalCount + '</div>';
            }
        });
    }
});