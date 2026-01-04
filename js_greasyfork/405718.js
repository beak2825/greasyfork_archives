// ==UserScript==
// @name         Hash
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Everyone
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405718/Hash.user.js
// @updateURL https://update.greasyfork.org/scripts/405718/Hash.meta.js
// ==/UserScript==


// crc32 from https://stackoverflow.com/questions/18638900/javascript-crc32
function makeCRCTable(){
    var c;
    var crcTable = [];
    for(var n =0; n < 256; n++){
        c = n;
        for(var k =0; k < 8; k++){
            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
}

window.crc32 = function(str) {
    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
    var crc = 0 ^ (-1);

    for (var i = 0; i < str.length; i++ ) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
};