// ==UserScript==
// @name        Better Chat
// @namespace   Violentmonkey Scripts
// @match       https://iwannabethestream.com/*
// @grant       none
// @license MIT
// @version     3.0
// @author      -
// @description 12/01/2025, 22:14:12
// @downloadURL https://update.greasyfork.org/scripts/523585/Better%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/523585/Better%20Chat.meta.js
// ==/UserScript==
(function() {
  'use strict';
    var inna = '<iframe aria-live="polite" scrolling="no" src="https://s.ex.hn/chat/"></iframe> <iframe src="https://www.twitch.tv/embed/cerulean86/chat?darkpopout&amp;parent=s.ex.hn" scrolling="no" height="100%" width="100%" frameborder="0" ></iframe>';
    // var div = document.getElementById("comms");
    // div.innerHTML ='';


    // var div = document.getElementById("container");
    // var elem = document.createElement("div");
    // elem.style = "display: flex;  float: right; flex-direction: column; width: 24em; z-index: 10;";
    // elem.innerHTML = inna;
    // div.appendChild(elem)
    var div = document.getElementById("container");
    div.style.position = "unset";

    var div = document.getElementById("comms");
    div.innerHTML = inna;

    // var temp = div.innerHTML;
    // div.innerHTML = temp + '<div style="display: flex;  float: right; flex-direction: column; width: 24em; z-index: 10;"><iframe aria-live="polite" scrolling="no" src="https://s.ex.hn/chat/"></iframe> <iframe src="https://www.twitch.tv/embed/cerulean86/chat?darkpopout&amp;parent=s.ex.hn" scrolling="no" height="100%" width="100%" frameborder="0" ></iframe></div>';
})();

