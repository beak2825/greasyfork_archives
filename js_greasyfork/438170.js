// ==UserScript==
// @name         Rainbow nickname
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Rainbow nickname bot
// @author       COdER#3389
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @icon         http://imageshack.com/a/img923/4396/i1Wmrm.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438170/Rainbow%20nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/438170/Rainbow%20nickname.meta.js
// ==/UserScript==

// Variables
var admin = [];
var a;
 var cmd;
 var input;

// Client function
MPP.client.on("a", function(msg) {
    a = msg.a.split(' ');
    cmd = a[0];
    input = msg.a.substring(cmd.length).trim();

if ((admin.indexOf(msg.p._id) > - 1) || (msg.p._id==MPP.client.getOwnParticipant()._id)) {
if (cmd == "/name") {
var count = 0;
var size = 100;
var rainbow = new Array(size);

for (var i = 0; i < size; i++) {
    var red = sin_to_hex(i, 0 * Math.PI * 2 / 3); // 0   deg
    var blue = sin_to_hex(i, 1 * Math.PI * 2 / 3); // 120 deg
    var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

    rainbow[i] = "#" + red + green + blue;
}

function sin_to_hex(i, phase) {
    var sin = Math.sin(Math.PI / size * 2 * i + phase);
    var int = Math.floor(sin * 127) + 128;
    var hex = int.toString(16);

    return hex.length === 1 ? "0" + hex : hex;
}

function rainbow1() {
    setTimeout(rainbow1, 500)
    if (count > rainbow.length) count = 0;
    count++;
    MPP.client.sendArray([{
        m: "userset",
        set: {
            color: `${rainbow[count]}`
        }
    }]);
}

setTimeout(rainbow1, 3000)
}};})