// ==UserScript==
// @name         Engage
// @version      2.13
// @namespace            https://greasyfork.org/en/users/95954
// @description  Increases your productivity on EngageME.TV
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @icon            http://i.imgur.com/FhCT7Ke.png
// @icon64URL       http://i.imgur.com/8VRBwr7.png
// @include	    http://*lootup.tv/*
// @include	       http://lootup.tv/*
// @include	       https://lootup.tv/*
// @downloadURL https://update.greasyfork.org/scripts/33101/Engage.user.js
// @updateURL https://update.greasyfork.org/scripts/33101/Engage.meta.js
// ==/UserScript==
setInterval(function() {
    var adsearch = document.getElementsByClassName('jw-flag-ads');
    if (adsearch.length > 0)
    {
        jwplayer().next();
    }
    jwplayer().setVolume(0);
    yesiam();
}, Math.floor(Math.random() * (30000 - 21000)) + 21000);