// ==UserScript==
// @name         Transform everyone in doctors
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Everyone will be a doctor! #StayHome
// @author       Gabrielciri5
// @match        https://boxcritters.com/play/*
// @grant        none
// @resource https://boxcritters.com/play/index.html
// @resource
// @downloadURL https://update.greasyfork.org/scripts/401849/Transform%20everyone%20in%20doctors.user.js
// @updateURL https://update.greasyfork.org/scripts/401849/Transform%20everyone%20in%20doctors.meta.js
// ==/UserScript==

(function() {
    'use strict';
     socket.removeAllListeners("joinRoom")
socket.on("joinRoom", function(t) {
  world.handleJoinRoom(t)

    var head = world.player.inventory[1].itemId;
    var body = world.player.inventory[2].itemId;
    var mask = world.player.inventory[3].itemId;
    var neck = world.player.inventory[4].itemId;

    world.player.gear.head = head;
    world.player.gear.body = body;
    world.player.gear.eyes = mask;
    world.player.gear.neck = neck;


    world.data.items.Directions[body]  = world.data.items.Directions.doctor_coat_white;
    world.data.items.Directions[head] =world.data.items.Directions.doctor_cap_blue;
    world.data.items.Directions[mask] = world.data.items.Directions.doctor_mask_blue;
    world.data.items.Directions[neck] = world.data.items.Directions.stethoscope;

for (let i in world.room.players) {
 world.room.players[i].g = world.player.gear;

    
}

})
})();