// ==UserScript==
// @name        triple (vertix.io)
// @namespace   brazilrules
// @description Oh baby a triple (triple kill sound effect).
// @version     2.0.1
// @author      BRAZILRULES & HighNoon643
// @match       http://vertix.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20480/triple%20%28vertixio%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20480/triple%20%28vertixio%29.meta.js
// ==/UserScript==

;(() => {
    let _b = function() {
        socket.on("3", function(a) {
            let t = new Audio('http://soundboard.panictank.net/Oh%20Baby%20A%20Triple.mp3');
            if(3 == a.kd) t.play();
        });
    }
    
    let _t = window.setInterval(() => {
        if(socket) clearInterval(_t), _b();
    }, 0x64);
})();