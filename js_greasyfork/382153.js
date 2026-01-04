// ==UserScript==
// @name         skribblHax vBetter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  better than other skribbl hax
// @author       You
// @match        *://skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382153/skribblHax%20vBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/382153/skribblHax%20vBetter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function(window){
        window.clickElem=function(elem,x,y){
            var bcr=elem.getBoundingClientRect();
            x+=bcr.left;
            y+=bcr.top;
            elem.dispatchEvent(new MouseEvent("mousedown",{bubbles:true,clientX:x,clientY:y,button:0}));
            elem.dispatchEvent(new MouseEvent("mouseup",{bubbles:true,clientX:x,clientY:y,button:0}));
            elem.dispatchEvent(new MouseEvent("click",{bubbles:true,clientX:x,clientY:y,button:0}));
        };
        window.drawDot=function(x,y,s,c){
            window.clickElem(document.querySelectorAll('.colorItem')[Math.floor(Math.min(21,Math.max(0,c)))],1,1);
            window.clickElem(document.querySelectorAll('.brushSize')[Math.floor(Math.min(3,Math.max(0,s)))],1,1);
            window.clickElem(window.canvasGame,x,y);
        };
        window.drawPattern=async function(){
            for(var iii=0;iii<window.canvasGame.clientWidth/5;iii++){
                for(var ooo=0;ooo<window.canvasGame.clientHeight/5;ooo++){
                    drawDot(5*iii,5*ooo,Math.random()*4,Math.random()*22);
                    await new Promise(rrr=>setTimeout(rrr,0));
                }
                await new Promise(rrr=>setTimeout(rrr,0));
            }
        };
    })(window)
})();