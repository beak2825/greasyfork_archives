// ==UserScript==
// @name         oib.io level show hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://oib.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391633/oibio%20level%20show%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/391633/oibio%20level%20show%20hack.meta.js
// ==/UserScript==
var decodeVar = [];
for(var l = 0; 40000>l;l++){
    var decode = "lapa"+l+"mauve";
    try {
        if(typeof window[decode] != "undefined"){
            decodeVar.push(window[decode]);
        }
    } catch (err) {
        console.log(err.message);
    }
}
setInterval(loop);
function loop(){
    player.select.split=true;
    player.select.feed=true;
    player.select.regroup=true;
    for(var k = 0; decodeVar[9].units.length > k; k++){
    decodeVar[9].units[k].info_delay = 9999999;
}
}