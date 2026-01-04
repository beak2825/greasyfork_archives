// ==UserScript==
// @name       All In Fighter Erepublik
// @version    1.00
// @description  Automated fighting. WHEN NOT NEEDED TURN IT OFF IN GREASEMONKEY ETC
// @include      http://*.erepublik.com/*
// @include      https://*.erepublik.com/*
// @copyright  WhIsKyMaN ussed some parts of MISI's script
// @downloadURL
// @updateURL
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/37797/All%20In%20Fighter%20Erepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/37797/All%20In%20Fighter%20Erepublik.meta.js
// ==/UserScript==
function wait() {
    if (typeof unsafeWindow.jQuery == 'undefined') {
        setTimeout(wait, 100);
    } else {
        $ = unsafeWindow.jQuery;
        main();
    }
}
wait();


function main() {
    main_type = location.href.split("/")[4];
    military_type = location.href.split("/")[5];
    hp = globalNS.userInfo.wellness;
    max_hp = reset_health_to_recover;
    rec_hp = parseInt($(".tooltip_health_limit").html());

    if (military_type == "battlefield") {
        //battle page, let's fight
        setTimeout(function() {
            if (SERVER_DATA.points.defender >= 1800 || SERVER_DATA.points.attacker >= 1800) {
                //battle finished
                //location.href = "http://www.erepublik.com/en";
                return;
            }
            t = setInterval(function() {
                if (globalNS.userInfo.wellness < 300) {
                    //regen energy
                    if ($(".health_kit_btn").attr("title") == "Get more energy") {
                        //Buy energy, ignore
                        location.href = "http://www.erepublik.com/en";
                    } else {
                        //let's eat food
                        $("#DailyConsumtionTrigger").click();
                    }
                }
                $('#fight_btn').click();
            }, 300);
        }, 500);
    }
}