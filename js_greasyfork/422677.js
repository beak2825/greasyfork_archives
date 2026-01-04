// ==UserScript==
// @name         VDRM
// @namespace    http://tampermonkey.net/
// @version      0.2.67
// @description  VDRM integration script
// @author       Anton Lazarau
// @include      *test.venatusmedia.com/*
// @include      *op.gg/*
// @include      *futbin.com/*
// @include      https://*nookazon.com/*
// @include      https://*hltv.org/*
// @include      https://*whatculture.com/*
// @include      https://*gfinityesports.com/*
// @include      https://*fifaindex.com/*
// @include      https://*realsport101.com/*
// @include      https://*gosunoob.com/*
// @include      https://*challonge.com/*
// @include      https://*venatusmedia.com/*
// @include      https://*rocket-league.com/*
// @include      https://*mmotimer.com/*
// @include      https://*fnbr.co/*
// @include      https://*powerpyx.com/*
// @include      https://*gamersdecide.com/*
// @include      https://*gamespew.com/*
// @include      https://*brawlify.com/*
// @include      https://*gematsu.com/*
// @include      https://*flickeringmyth.com/*
// @include      https://*keengamer.com/*
// @include      https://*videogamer.com/*
// @include      https://*dropnite.com/*
// @include      https://*mobafire.com/*
// @include      https://*psu.com/*
// @include      https://*playstationtrophies.org/*
// @include      https://*xboxachievements.com/*
// @include      https://*wrestletalk.com/*
// @include      https://*ginx.tv/*
// @include      https://*allthetests.com/*
// @include      https://*thumbsticks.com/*
// @include      https://*batman-news.com/*
// @include      https://*gamerjournalist.com/*
// @include      https://*test.resetera.com/*
// @include      https://*dev.mobafire.com/*
// @include      https://*jeuxvideo-live.com/*
// @include      https://*trustedreviews.com/*
// @include      https://*ggrecon.com/*
// @include      https://*resetera.com/*
// @include      https://*mtgarena.pro/*
// @include      https://*segmentnext.com/*
// @include      https://*epicstream.com/*
// @include      https://*rpgsite.net/*
// @include      https://*dak.gg/*
// @include      https://*mobachampion.com/*
// @include      https://*lol.ps/*
// @include      https://*belloflostsouls.net/*
// @include      https://*gamerguides.com/*
// @include      https://*metabattle.com/*
// @include      https://*planetminecraft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422677/VDRM.user.js
// @updateURL https://update.greasyfork.org/scripts/422677/VDRM.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var script = document.createElement('script');
    script.onload = function () {
        return new Promise((resolve, reject) => { if (resolve) console.log(resolve); else console.log(reject); });
        //Promise.resolve.then(() => console.log('VDRM script loaded'));
        //console.log('VDMR script loaded');
        //resolve();
    };
    script.src = 'https://cdn.prvk.io/studio/test/tampermonkey/creative.js?v='.concat(Date.now());
    //script.src = 'https://cdn.prvk.io/studio/modal-takeover/tampermonkey/test/creative.js?v='.concat(Date.now());
    //script.src = "https://cdn.prvk.io/modal-takeover/141-xandr/creative.js?v=".concat(Date.now());

    script.id = "vdrm-script";
    //script.clickTag = "%%DEST_URL%%";
    console.log(script.clickTag);

    if (document.getElementById('vdrm-script')) return;
    document.head.appendChild(script);

    setTimeout(() => document.querySelectorAll('.vm-skin').forEach((element) => element.remove()), 5000);

})();