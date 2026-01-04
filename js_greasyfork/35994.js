// ==UserScript==
// @name TSDM 自動簽到
// @author UMIQLO
// @grant none
// @exclude     *://www.tsdm*.*/plugin.php?id=np_cliworkdz:work*
// @exclude     *://www.tsdm*.*/forum.php?mod=viewthread&tid=321479
// @include     *://www.tsdm*.*
// @version     1.4.4
// @run-at      document-end
// @license     GPL version 3
// @namespace https://greasyfork.org/users/124064
// @description 天使動漫自動簽到腳本 / 預設表情 "開心" / 預設簽到信息 "來簽到了啊"
// @downloadURL https://update.greasyfork.org/scripts/35994/TSDM%20%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/35994/TSDM%20%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0.meta.js
// ==/UserScript==
jQuery(document).ready(function($) {
    const groupName = $('#g_upmine').children().html();
    const checkInCHS = $("a:contains('签到领奖!')");
    const checkInCHT = $("a:contains('簽到領獎!')");
    const msg = {
        "CHT": "來簽到了啊",
        "CHS": "来签到了啊",
    };
    $('#g_upmine').children().html(groupName + "(TSDM自動簽到)");
    if ((checkInCHT.length > 0) || (checkInCHS.length > 0)) {
        const checkInEle = (checkInCHT.length > 0) ? checkInCHT : checkInCHS;
        const checkInMsg = (checkInCHT.length > 0) ? msg.CHT : msg.CHS;
        checkInEle.click();
        setInterval(() => {
            $('#todaysay').val(checkInMsg);
            Icon_selected('kx');
            const btn = $("button:contains('点我签到!')");
            if (btn.length > 0) {
                btn.click();
            }
        }, 1500);
    } else {
        $('#g_upmine').children().html(groupName + "(您已經簽到了)");
    }
});