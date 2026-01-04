// ==UserScript==
// @name         動漫花園流氓廣告阻擋
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把動漫花園的廣告阻擋，並減少不必要的內容，簡化界面。block ad from DMHY and modify User infterface delete unnecessary content.
// @author       Royal
// @match        https://share.dmhy.org/*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371202/%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%E6%B5%81%E6%B0%93%E5%BB%A3%E5%91%8A%E9%98%BB%E6%93%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371202/%E5%8B%95%E6%BC%AB%E8%8A%B1%E5%9C%92%E6%B5%81%E6%B0%93%E5%BB%A3%E5%91%8A%E9%98%BB%E6%93%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

     //如果你想把普通廣告打開請改為true, if you wish to enable the normal AD plaease change it to true
    var normal_ad=false;
    //如果你想把logo打開請改為true,if you wish to enable the Logo plaease change it to true
    var logo=false;
    //如果你想把資源詳細資料打開請改為true,if you wish to enable the info tab plaease change it to true
    var info_tab=false;
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$(document).ready(function() {
    // the kiwi ad by yahoo is so sketchy so I block it completely
    // 雅虎的kiwi廣告經常跳到下載鍵那邊，所以我決定把他除掉
    $("#950_ad").hide();
    $(".kiwi-ad-wrapper-950x80").hide();
    // the normal is minimize under the background, hope it don't affact the ad revenue
    // 普通廣告縮小隱藏於背景，減少對網站廣告收入的影響
    if (normal_ad == false){
    $("#1280_ad").find("img").attr({width:"1", height:"1"});
    $("#msdl_ad").find("img").attr({width:"1", height:"1"});
    }
    if (logo == false){
    //順便把logo也藏起來好了
    $(".headerleft").hide();
    }
    if (info_tab == false){
    $(".info.resource-info.right").hide();
    $(".info.relative-goods").hide();

    }

});

    //alert();
})();