// ==UserScript==
// @name         HWM_BigDiscardingButtonsInArcomageOnMobile
// @namespace    Небылица
// @version      1.0
// @description  Большая кнопка сброса карт в таверне на мобилках
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/cgame\.php/
// @downloadURL https://update.greasyfork.org/scripts/385054/HWM_BigDiscardingButtonsInArcomageOnMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/385054/HWM_BigDiscardingButtonsInArcomageOnMobile.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function isMobileDevice(){ // Возвращает true/false в зависимости от того, является ли устройство мобильным (имеет ли сменную ориентацию экрана)
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    //

    if (isMobileDevice()){
        var discardingButtons = document.getElementsByClassName("cardDiscardBtn"),
            i,
            maxI = discardingButtons.length;
        for (i=0;i<maxI;i++){
            discardingButtons[i].style.width = "2em";
            discardingButtons[i].style.height = "2em";
        }
    }
})();