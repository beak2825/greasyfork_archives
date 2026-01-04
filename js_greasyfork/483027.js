// ==UserScript==
// @name        Acelerador de tiempo
// @namespace   Violentmonkey Scripts

// @match       *://mdn.lol/*
// @match       *://awgrow.com/*
// @match       *://worldtanr.xyz/*
// @match       *://fadedfeet.com/*
// @match       *://kenzo-flowertag.com/*
// @match       *://homeculina.com/*
// @match       *://lawyex.co/*
// @match       *://yexolo.net/*
// @match       *://ineedskin.com/*

// @match       *://rsinsuranceinfo.com/*
// @match       *://rssoftwareinfo.com/*
// @match       *://rsfinanceinfo.com/*
// @match       *://rseducationinfo.com/*
// @match       *://rsadnetworkinfo.com/*
// @match       *://rshostinginfo.com/*

// @grant       none
// @version     1.0
// @author      sABER (juansi)
// @description Este script intenta manipular los manejadores de tiempo conocidos como setInterval y setTimeout. Primeramente decrementando los mismos.
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483027/Acelerador%20de%20tiempo.user.js
// @updateURL https://update.greasyfork.org/scripts/483027/Acelerador%20de%20tiempo.meta.js
// ==/UserScript==

(function(){
    function acelerador_SetInterval () {
        const nameFunc = window.setInterval;
        Object.defineProperty(window, 'setInterval', {
            value: function (func, delay) {
                if (delay === 1000) {
                    delay = 50;
                }
                return nameFunc.apply(this, arguments);
            }
        });
    }

    function acelerador_SetTimeout () {
        const nameFunc = window.setTimeout;
        Object.defineProperty(window, 'setTimeout', {
            value: function (func, delay) {
                if (delay === 1000) {
                    delay = 50;
                }
                return nameFunc.apply(this, arguments);
            }
        });
    }

    acelerador_SetTimeout();
    acelerador_SetInterval();

})();