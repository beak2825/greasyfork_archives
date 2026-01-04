// ==UserScript==
// @name         PON Berserk Acceleration and Meditation
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Ускорение берсерка, и автомедитация
// @author       Kaminoko
// @match        *://pathofninja.ru/*
// @match        *://www.pathofninja.ru/*
// @match        *://pathofninja.com/*
// @match        *://www.pathofninja.com/*
// @match        *://148.251.233.231/*
// @match        *://178.63.14.254/*
// @match        *://pon.fun/*
// @match        *://www.pon.fun/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/377768/PON%20Berserk%20Acceleration%20and%20Meditation.user.js
// @updateURL https://update.greasyfork.org/scripts/377768/PON%20Berserk%20Acceleration%20and%20Meditation.meta.js
// ==/UserScript==

var battleIsEnd = false;
var baseHitFunc;
//-- Скорость ударов в берсерке (ms)
var hitSpeedMin = 120;
var hitSpeedMax = 250;

//-- Включена ли медитация после боя и после скольких % ХП она начинается
var needMeditation = true;
var percentHPLimit = 0.5;
(function() {
    'use strict';
    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
    function fastHit() {
        if(!!baseHitFunc) {
           baseHitFunc();
        }
            var interv = randomInteger(hitSpeedMin, hitSpeedMax);
            setTimeout(fastHit, interv);
    }
    //-- Update Data in LS
    if(!localStorage.berc_battleIsEnd) {
        localStorage.berc_battleIsEnd = battleIsEnd ? "1" : "0";
    }
    else {
        battleIsEnd = localStorage.berc_battleIsEnd === "1" ? true : false;
    }

    //-- Fast HIT block
    var fastHitButton = unsafeWindow.document.querySelectorAll(".com_b2");
    if(fastHitButton.length > 0) {
        if(fastHitButton[1].value == "Отключить Берсерк") {
            var baseHitFunc = fastHitButton[0].onclick;
            setTimeout(fastHit, randomInteger(hitSpeedMin, hitSpeedMax));
        }
        else if(document.getElementById("act_enter") != null) {
            battleIsEnd = true;
            localStorage.berc_battleIsEnd = battleIsEnd ? "1" : "0";
        }
    }
    //-- Meditation block
    if(needMeditation && battleIsEnd && fastHitButton.length == 0) {
        var hpEl = unsafeWindow.document.getElementById("hp");
        if(hpEl != null) {
            var hpArr = hpEl.innerText.split("/");
            if(hpArr[0] == 0) {
                hpArr[0] = 1;
            }
            if(hpArr[0] / hpArr[1] < percentHPLimit) {
                setTimeout(function () {unsafeWindow.data_send('abil_medit_begin', '', [], unsafeWindow.abil_update_info);}, randomInteger(200, 500));
                battleIsEnd = false;
                localStorage.berc_battleIsEnd = battleIsEnd ? "1" : "0";
            }
        }
    }
})();