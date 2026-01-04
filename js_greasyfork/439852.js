// ==UserScript==
// @name         GaS Digital Forums Spam Hider
// @namespace    https://gasdigitalnetwork.com/
// @version      0.1
// @description  Hides spammers on GaS Digital forums
// @author Garfield-Lzanya
// @match        https://gasdigitalnetwork.com/forums/*
// @match        https://gasdigitalnetwork.com/forums02/*
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @connect pastebin.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439852/GaS%20Digital%20Forums%20Spam%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/439852/GaS%20Digital%20Forums%20Spam%20Hider.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const updateIntervalInMS = 28800000; //8 hours
  checkUpdateAndFirstTime();
  var spamUserNames = GM_getValue("spammers");

  if ((location.pathname.includes("/forums02/forum/")) || (location.pathname.startsWith("/forums/"))) {
    var starters = document.querySelectorAll(".bbp-topic-started-by a");
    for (var s of starters) {
      if (spamUserNames.includes(decodeURIComponent(s.href.split("/")[5]))) {
        s.parentNode.parentNode.parentNode.parentNode.remove();
      }
    }
  }
  else if (location.pathname.includes("/forums02/topic/")) {
    var repliers = document.querySelectorAll(".bbp-reply-author a");
    for (var r of repliers) {
      if (spamUserNames.includes(decodeURIComponent(r.href.split("/")[5]))) {
        r.parentNode.parentNode.remove();
      }
    }
  }

  function checkUpdateAndFirstTime() {
    var lastUpdate = GM_getValue("lastUpdate");
    //First time
    if (!lastUpdate) {
      doUpdate();
      return;
    }
    var currentTime = new Date().getTime();
    //console.log("Spam list will be next updated " + new Date((lastUpdate + updateIntervalInMS)));
    if (currentTime > lastUpdate + updateIntervalInMS) {
      doUpdate();
    }
  }

  function doUpdate() {
    var cacheBuster = new Date().getTime();
    GM_xmlhttpRequest({
      method: "GET",
      url: "https://pastebin.com/raw/PSVFptfj?nocache=" + cacheBuster,
      responseType: "json",
      onload: saveNewSpammerList
    });
  }

  function saveNewSpammerList(response) {
    if (response.status != 200 && response.status != 304) {
      return;
    }
    var newSpammerArray = JSON.parse(response.responseText);
    //console.log(newSpammerArray)
    GM_setValue("spammers", newSpammerArray)
    var lastUpdate = new Date().getTime();
    GM_setValue("lastUpdate", lastUpdate);
    console.log("Updated spammer list");
  }
})();
