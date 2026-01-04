// ==UserScript==
// @name         Uniformes de Hockey
// @namespace    http://tampermonkey.net/
// @version      1
// @description  no more blocky blur
// @author       Gabrielciri5
// @match        https://boxcritters.com/play/*
// @grant        none
// @resource https://boxcritters.com/play/index.html
// @resource
// @downloadURL https://update.greasyfork.org/scripts/401442/Uniformes%20de%20Hockey.user.js
// @updateURL https://update.greasyfork.org/scripts/401442/Uniformes%20de%20Hockey.meta.js
// ==/UserScript==

(function() {
    'use strict';
     socket.removeAllListeners("joinRoom")
socket.on("joinRoom", function(t) {
  world.handleJoinRoom(t)

    world.data.items.items.ringmaster_suit_red = world.data.items.items.hockey_jersey_red;
    world.data.items.items.ringmaster_hat_black = world.data.items.items.hockey_helmet_red;
    world.data.items.items.plaid_green = world.data.items.items.hockey_jersey_blue
    world.data.items.items.jester_hat = world.data.items.items.hockey_helmet_blue;




})
})();