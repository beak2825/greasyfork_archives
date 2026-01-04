// ==UserScript==
// @name             Gaana No Autoplay and No Alerts
// @namespace   tuktuk3103@gmail.com
// @description   Auto Clicks Autoplay Button and Prevents Alerts
// @include          https://gaana.com/*
// @version          1.00
// @grant              none
// @icon                https://css375.gaanacdn.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/423452/Gaana%20No%20Autoplay%20and%20No%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/423452/Gaana%20No%20Autoplay%20and%20No%20Alerts.meta.js
// ==/UserScript==


function PageLoaded() {

  if(document.getElementById("queue_mode").textContent.toUpperCase() == "ON"){
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, true);
    document.getElementById("queue_mode").dispatchEvent(evt);
  }
  window.onbeforeunload = null;

};

window.addEventListener ('load', PageLoaded);