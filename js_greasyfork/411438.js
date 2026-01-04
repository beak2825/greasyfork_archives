// ==UserScript==
// @name         auto respawn
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  autorespawn, toggle with 't'
// @author       You
// @match        https://takepoint.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411438/auto%20respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/411438/auto%20respawn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keydown", toggleRespawn);

    var foot = document.getElementById("footers");
    var respawn = true;
    var overlay = document.getElementsByClassName("featured-game-container")[0];
    overlay.style = "pointer-events: none; position: fixed; top:10px; left:10px; font-family: 'Comic Sans MS', cursive, sans-serif; color: #FFFFFF; font-style: normal; font-variant: normal; z-index: 9999;";
    let stats = [];


    var observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type == "attributes"){
                if(document.getElementById("footers").style.display == "flex"){
                    addScript();
                }
            }
        });
    });
    observer.observe(foot, {
        attributes: true //configure it to listen to attribute changes
    });

    function toggleRespawn(e){
        if(e.keyCode == 84){
            respawn = !respawn;
            console.log(respawn);
            overlay.innerHTML = respawn ? "<h3>respawn: true (press t to change)</h3>" : "<h3>respawn: false (press t to change)</h3>";
        }
    }
    // Your code here...

        function addScript(){
        let width = renderArea.canvasWidth;
        let height = renderArea.canvasHeight;
        let centerX = width/2;
        let centerY = height/2;
        ASM_CONSTS[7315] = function($0, $1, $2, $3) {
            let text = UTF8ToString($1);
            contexts[$0].strokeText(text, $2, $3);
            let positionX = $2 < centerX + 200 && $2 > centerX - 200;
            let positionY = $3 < centerY - 200;
            if($0 == 1 && positionX && positionY && !(stats.includes(text))){
                stats.push(text);
            }
            if(stats.length > 7){
                console.log(stats);
                if(respawn == true){
                    eg(); //play function
                }
                resetScript();
            }

        };
    }
    function resetScript(){
        stats = [];
        ASM_CONSTS[7315] = function($0, $1, $2, $3) {
            contexts[$0].strokeText(UTF8ToString($1), $2, $3);
        };
    }


})();
