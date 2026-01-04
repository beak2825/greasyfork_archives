// ==UserScript==
// @name        ChangeIP
// @namespace   http://www.ip-adress.eu/
// @version     1.0 BETA
// @author      elaw
// @description Changes your IP address on tinychat. (still testing)
// @include     http://www.ip-adress.eu/*
// @include     http://whatismyipaddress.com/*
// @include     https://tinychat.com/*
// @copyright  2017+, You
// @namespace https://greasyfork.org/users/153402
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33401/ChangeIP.user.js
// @updateURL https://update.greasyfork.org/scripts/33401/ChangeIP.meta.js
// ==/UserScript==





var tessel = require('tessel');
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
for (var k2 in interfaces[k]) {
var address = interfaces[k][k2];
if (address.family === 'IPv4' && !address.internal) {
addresses.push(address.address);
}
}
}

console.log(addresses);

