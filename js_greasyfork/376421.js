// ==UserScript==
// @name         PROJECT
// @namespace    bigboyspooks.com
// @version      0.1
// @description  You should know what this is
// @author       Spook
// @match        https://www.amazon.com/gc/redeem/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376421/PROJECT.user.js
// @updateURL https://update.greasyfork.org/scripts/376421/PROJECT.meta.js
// ==/UserScript==

(function() {
'use strict';
var items = Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "0","1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" );
let x = 0;
var current = "AS"
function createCodes() {
var code = items[Math.floor(Math.random()*items.length)];
var code2 = items[Math.floor(Math.random()*items.length)];
current += code;
current += code2;
current = current += "-";
var code5 = items[Math.floor(Math.random()*items.length)];
current = current += code5;
var code6 = items[Math.floor(Math.random()*items.length)];
current = current += code6;
var code7 = items[Math.floor(Math.random()*items.length)];
current = current += code7;
var code8 = items[Math.floor(Math.random()*items.length)];
current = current += code8;
var code9 = items[Math.floor(Math.random()*items.length)];
current = current += code9;
var code10 = items[Math.floor(Math.random()*items.length)];
current = current += code10;
current = current += "-";
var code11 = items[Math.floor(Math.random()*items.length)];
current = current += code11;
var code12 = items[Math.floor(Math.random()*items.length)];
current = current += code12;
var code13 = items[Math.floor(Math.random()*items.length)];
current = current += code13;
var code14 = items[Math.floor(Math.random()*items.length)];
current = current += code14;
var code15 = items[Math.floor(Math.random()*items.length)];
current = current += code15;
console.log(current);
}

createCodes();
    function autoFill() {
    document.getElementById("claimCode").value = "H";
  };
    function load() {
        console.log("works");
        autoFill();
    };
    window.addEventListener('load', function() {
        document.getElementById("gc-redemption-input").value = current;
}, false);
})();