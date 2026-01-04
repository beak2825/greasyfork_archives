// ==UserScript==
// @name         Block Social Media
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replace a social media website with a message to get off(you can add any other ones you want)
// @author       icycoldveins
// @match    *://*.instagram.com/*
// @match    *://*.facebook.com/*
// @match    *://*.twitter.com/*
// @match    *://*.tiktok.com/*
// @license      MIT
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455523/Block%20Social%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/455523/Block%20Social%20Media.meta.js
// ==/UserScript==
(function () {
  "use strict";

  // Your code here...
  // replace instagram with a blank page that says "focus on your work"
  // create a div that says "focus on your work"
  var div = document.createElement("div");
  div.innerHTML = "Stop wasting time on social media. Focus on your work.";
  div.style.fontSize = "100px";
  div.style.textAlign = "center";
  div.style.marginTop = "100px";
  // replace the body with the div
  document.body.innerHTML = "";
  document.body.appendChild(div);
})();
