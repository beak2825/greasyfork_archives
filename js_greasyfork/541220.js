// ==UserScript==
// @name         CyberShinKanSen
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  赛博新干线，进入测速页面后就可以填表格了
// @author       xuzichi
// @match        https://oshi-tabi.voistock.com/bang-dream-10th/voice/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541220/CyberShinKanSen.user.js
// @updateURL https://update.greasyfork.org/scripts/541220/CyberShinKanSen.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function requirementMet() {
    console.log("requirementMet() called");
    var surveyId = $("#waiting-card").data("survey");
    showPlayer();
    sessionStorage.setItem("openedSurvey", surveyId);
  }

  function showPlayer() {
    console.log("player");
    var surveyId = $("#voice-player").data("survey");
    startSurvey(surveyId);
    sessionStorage.setItem("openedSurvey", surveyId);

    console.log("player");
    $("#overlay-card").hide();
    $("#waiting-card").hide();
    $("#voice-player").show().css({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    });
  }

  function startSurvey(surveyId) {
    getSurvey(surveyId);
  }

  // 页面加载完成后调用
  window.addEventListener("load", requirementMet);
})();
