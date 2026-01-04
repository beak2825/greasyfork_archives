// ==UserScript==
// @name        金剛直播長期登錄自動修改
// @namespace   https://discord.gg/GvWdqMA
// @description 金剛直播長期登錄自動修改，主代碼由 Poporing 提供，整體代碼由 三倍免肉 維護
// @match       https://www.kingkong.com.tw/*
// @version     2018.6.8.28
// @grant       none
// @homepageURL    https://greasyfork.org/scripts/368580
// @downloadURL https://update.greasyfork.org/scripts/368580/%E9%87%91%E5%89%9B%E7%9B%B4%E6%92%AD%E9%95%B7%E6%9C%9F%E7%99%BB%E9%8C%84%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/368580/%E9%87%91%E5%89%9B%E7%9B%B4%E6%92%AD%E9%95%B7%E6%9C%9F%E7%99%BB%E9%8C%84%E8%87%AA%E5%8B%95%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

storageTimeKingKong();

function storageTimeKingKong() {

    console.log('page.load');
    var timecheck=30000;
    var json_str = JSON.parse(localStorage.getItem("userTokenCache"));

    if (json_str !== null){
        json_str.storageTime = 13148794030678;
        console.log(JSON.stringify(json_str));
        localStorage.setItem("userTokenCache",JSON.stringify(json_str));
    }

    if (json_str !== null){
        if (json_str.storageTime == 13148794030678){
            console.log('storageTime == 13148794030678');
            timecheck=3600000;
        }
    }

    setTimeout(function(){ storageTimeKingKong(); }, timecheck);

}