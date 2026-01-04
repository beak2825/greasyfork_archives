// ==UserScript==
// @name         Tundra Example Userscript
// @version      1
// @description  Example userscript for Tundra
// @author       Goodra
// @match        http://*.moomoo.io/*
// @match        https://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/216897
// @downloadURL https://update.greasyfork.org/scripts/372763/Tundra%20Example%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/372763/Tundra%20Example%20Userscript.meta.js
// ==/UserScript==

//TO RUN THIS SCRIPT YOU MUST HAVE TUNDRA INSTALLED
//YOU CAN GET TUNDRA FROM https://discord.gg/NdQzvtE

(function() {
    'use strict';
    setTimeout(function(){
    console.log('Tundra example loaded');
    window.mods.aHeal.timer = 150;
    window.setMods('aHeal', window.mods.aHeal.on); /*No way to just save timer so I save something else to save timer*/
    setInterval(function(){window.send('ch', 'Cool chat example');}, 1000);/* sending chats*/
    function place(id, rot){
      window.send('5', id, null);
      window.send('c', 1, rot);
      window.send('c', 0, rot);
    }
    document.addEventListener('keydown', function(e){
        if(document.activeElement.id.toLowerCase() == 'chatbox')return;
        switch (e.keyCode) {
            case 86: place(window.items[2], 0); place(window.items[2], 1.55); place(window.items[2], 3.1); place(window.items[2], -1.55);break;/*click v = quad spike*/
        }
    })}, 1000);//Use setTimeout so it injects after all the window varables have been loaded
})();
