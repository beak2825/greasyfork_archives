// ==UserScript==
// @name         Engage 2.0
// @version      2.0
// @namespace            https://greasyfork.org/en/users/95954
// @description  Increases your productivity on EngageME.TV
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @icon            http://i.imgur.com/FhCT7Ke.png
// @icon64URL       http://i.imgur.com/8VRBwr7.png
// @include	       http://*.engageme.tv/*
// @include	       http://engageme.tv/*
// @include	       https://engageme.tv/*
// @downloadURL https://update.greasyfork.org/scripts/30503/Engage%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/30503/Engage%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){ clearCookies(); location.reload(); }, 60000*15);
    clearCookies();
    function clearCookies()
    {
        document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    }

    var textArray = [
        'http://search.spotxchange.com/vast/2.0/155521?VPAID=1&content_page_url=http%3A%2F%2Fengageme.tv%2Fwatchrv.php%3Fclick%3D109689_1114797853%26prof%3D8571%26pub%3D109689%26sub1%3DEARNGG-115158305892969098806&cb=615601101524682500&player_width=1012&player_height=569&token[video_url]=%2F%2Fcontent.jwplatform.com%2Fmanifests%2FL1ipJ8Yb.m3u8',
        'http://search.spotxchange.com/vast/2.0/155521?VPAID=1&content_page_url=http%3A%2F%2Fengageme.tv%2Fwatchrv.php%3Fclick%3D109689_1113912349%26prof%3D8571%26pub%3D109689%26sub1%3DEARNGG-115158305892969098806&cb=657200789008777200&player_width=1012&player_height=569&token[video_url]=%2F%2Fcontent.jwplatform.com%2Fmanifests%2FHfExjzsY.m3u8',
        'http://search.spotxchange.com/vast/2.0/155521?VPAID=1&content_page_url=http%3A%2F%2Fengageme.tv%2Fwatchrv.php%3Fclick%3D109689_1112481769%26prof%3D8571%26pub%3D109689%26sub1%3DEARNGG-115158305892969098806&cb=515599166813898800&player_width=1012&player_height=569&token[video_url]=%2F%2Fcontent.jwplatform.com%2Fmanifests%2F3iBqS1CP.m3u8'
    ];
    function AdSearch(){let randomNumber = Math.floor(Math.random()*textArray.length);return textArray[randomNumber];}
        setInterval(function() {
            yesiam();
    }, 75000);

    setInterval(function() {
        var points = document.getElementById('count').textContent;
        if (points>8900){clearCookies(); location.reload();}
        var adsearch = document.getElementsByClassName('jw-flag-ads');
        if (!adsearch.length > 0)
        {
            jwplayer().playAd(AdSearch());
        }
    }, 1650);

})();