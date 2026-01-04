// ==UserScript==
// @name         SpeechLogger
// @namespace    http://byxiaoxie.com/
// @version      0.3
// @description  SpeechLogger - 破解限制
// @author       ByXiaoXie
// @match        https://speechlogger.appspot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419616/SpeechLogger.user.js
// @updateURL https://update.greasyfork.org/scripts/419616/SpeechLogger.meta.js
// ==/UserScript==

(function() {
    localStorage.setItem("currentCredit",66666666);
    credit_show.innerHTML = "<b>"+localStorage.getItem("currentCredit")+"</b>";
    credit_show2.innerHTML = "<b>"+localStorage.getItem("currentCredit")+"</b>";
    // $("#translation_key_activity").fadeIn(500);
    setInterval(function(){timeRemainingTranscription = 600;},5000)
})();