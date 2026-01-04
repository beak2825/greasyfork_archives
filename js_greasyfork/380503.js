// ==UserScript==
// @name         HAT SWITCHER
// @namespace    stuff
// @version      0.1
// @description  Stuff `n thingz
// @author       You
// @match        *://*.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380503/HAT%20SWITCHER.user.js
// @updateURL https://update.greasyfork.org/scripts/380503/HAT%20SWITCHER.meta.js
// ==/UserScript==
(function(){"use-strict";localStorage["t"]=true;var l={i:{name:"bull",id:7,o:6e3,key:72},u:{name:"soldier",id:6,o:4e3,key:74},s:{name:"flipper",id:31,o:2500,key:75},l:{name:"tank",id:40,o:15e3,key:76},p:{name:"turret hat",id:53,o:1e4,key:78},k:{name:"pig",id:29,o:null,key:77},"null":{name:"null",id:0,o:null,key:66}};function e(){return document.getElementById("scoreDisplay").innerText}document.addEventListener("keydown",function(e){if(e.keyCode===l["i"].key){var t=l["i"].id;storeBuy(t);storeEquip(t)}if(e.keyCode===l["u"].key){var r=l["u"].id;storeBuy(r);storeEquip(r)}if(e.keyCode===l["u"].key){var i=l["u"].id;storeBuy(i);storeEquip(i)}if(e.keyCode===l["s"].key){var o=l["s"].id;storeBuy(o);storeEquip(o)}if(e.keyCode===l["l"].key){var u=l["l"].id;storeBuy(u);storeEquip(u)}if(e.keyCode===l["p"].key){var s=l["p"].id;storeBuy(s);storeEquip(s)}if(e.keyCode===l["k"].key){var n=l["k"].id;storeBuy(n);storeEquip(n)}if(e.keyCode===l["null"].key){var a=l["null"].id;storeBuy(a);storeEquip(a)}})})();