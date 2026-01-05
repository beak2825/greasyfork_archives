// ==UserScript==
// @name         CircleHack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Circle Path score hack!
// @author       Yassine Nacer AKA YassineLinX
// @match        http://www.emanueleferonato.com/2016/02/11/html5-prototype-of-ios-game-circle-path-made-with-phaser/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18266/CircleHack.user.js
// @updateURL https://update.greasyfork.org/scripts/18266/CircleHack.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
(function () {
   
    
function AddButton()
    {        
        var btn = document.createElement("BUTTON");
        var btn_txt = document.createTextNode("SCORE HACK");
        btn.appendChild(btn_txt);
        document.body.appendChild(btn);
        btn.style.position = "fixed";
        btn.style.top = "0px";
        btn.style.right = "0px";
        btn.setAttribute("onclick", "test()");
    }
AddButton();
window.test = function()
{
    var new_score = prompt("Enter a new score");
    localStorage.setItem("circlepath",JSON.stringify({
        score: new_score
    }));
    location.reload();
}    
    
})();
