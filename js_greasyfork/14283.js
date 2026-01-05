// ==UserScript==
// @name         Agarz Yasin
// @namespace    ProjectNexus
// @version      1.1
// @description  Kemal abinin ingilizcesine laf yok. Splitrununada. Heleki kod yazmasına..
// @author       Kemal Okan Dikkulak
// @match        http://agarz.com/
// @match        http://agarz.com/*
// @downloadURL https://update.greasyfork.org/scripts/14283/Agarz%20Yasin.user.js
// @updateURL https://update.greasyfork.org/scripts/14283/Agarz%20Yasin.meta.js
// ==/UserScript==

// Set Your Username: '乇•Ð★ⓅⓇⓄ★ＹＡＳＩＮ'
$("#nick").val("乇•Ð★ⓅⓇⓄ★ＹＡＳＩＮ");

// Macro Feed 
(function() {
    var amount = 8;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

// Defaults

setDarkTheme(true);
setShowScore(true);

// Trash Elements

var elmDeleted = document.getElementById("topInfo");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("instructions");
	elmDeleted.parentNode.removeChild(elmDeleted);

