// ==UserScript==
// @name        HWM_SMS_Sound
// @namespace   Рианти
// @description Уведомление о почте (и кланрассылке, если включены уведомления)
// @include     http://www.heroeswm.ru/*
// @exclude     /.+(battle|battlechat|frames|war|cgame|login|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php.*/
// @exclude     /.+daily\.heroeswm\.ru.+/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12723/HWM_SMS_Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/12723/HWM_SMS_Sound.meta.js
// ==/UserScript==

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue = function (key, def) { return localStorage[key] || def; }
    this.GM_setValue = function (key, value) { return localStorage[key] = value; }
    this.GM_deleteValue = function (key) { return delete localStorage[key]; }
}

var lastPlayed = GM_getValue('lastPlayed', '');

if(!lastPlayed){
    var _soundSrc = 'http://hwm.mcdir.ru/sounds/sms.mp3';

    if (document.querySelector('img[src*="pismo.gif"]')){
        new Audio(_soundSrc).play();
        GM_setValue('lastPlayed', 1);
    }
} else {
    if (!document.querySelector('img[src*="pismo.gif"]')){
        GM_deleteValue('lastPlayed');
    }
}