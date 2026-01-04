// ==UserScript==
// @name         VencijaScriptV3.0
// @namespace    VencijaScriptV3.0 Confira!
// @version      1.5
// @description  Use for good please play more the game with this script.
// @author       VencijaHacker
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405212/VencijaScriptV30.user.js
// @updateURL https://update.greasyfork.org/scripts/405212/VencijaScriptV30.meta.js
// ==/UserScript==
//By Noobish And Vencija
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];



window.sockets = [];
function init() {

    function sendChatMessage(str) {
        if (!window.sockets) return alert("no sockets");
            socket.emit("ch", str);
    }
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.floodtop = false;
window.UIList.push({
level: 6,
    x: 0,
    html: '<div id=floo onclick=floodao()>Flood Bots: Off</div>'
});
window.floodao = function () {
    var elaa = document.getElementById('floo');
    if (floodtop) {
        floodtop = false;
        elaa.textContent = 'Flood Bots: Off';
        clearInterval(flood);
    } else {
        floodtop = true;
        elaa.textContent = 'Flood Bots: On';
        window.flood = setInterval(floodon,0)
        function floodon() {
                        var x = ("ZUMBI COM FOME!")
            sendChatMessage(x);
              var x = ("ZUMBI COM FOME!")
            sendChatMessage(x);
         var x = ("ZUMBI COM FOME!")
       
            }
    }
    window.statusBar();
    return floodtop()
}
}
init();



window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];

window.sendIndex = 0;
window.loops = 0;
window.hasSentTarget = false;
window.usePatch = true;
window.cache = [];
window.cacheHeight = 0;
window.cacheIndexes = 0;
window.shift = false;
window.sendFrequency = 1E3 / 15
window.UIList.push({
    description: 'Coisas On',
});