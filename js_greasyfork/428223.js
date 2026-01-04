// ==UserScript==
// @name         Cloei Script
// @description  Nothing
// @author       Chlomatical
// @version      1.0
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428223/Cloei%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/428223/Cloei%20Script.meta.js
// ==/UserScript==

(function() {
    const int = setInterval(function(){
        render();
    },5000);
})();

function render(){
    var empty = [
        "install please"
        
        
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        ]
    var list = ["Matthew can't do maths!",
                "Matthew the worm slayer",
                "Matthew: ;I get te16 shut them up'",
                "Pork, fuck u u pepeg",
                "Pork, u little shit","Pork, u a fking stick",
                "Pork, jus dun go too far u might die if u actlly swim drunk",
                "Pork, shuttup u pepeg",
                "This fking nunubot",
                "Jus seeing pork drains so much of my energy alr",
                "Pork is Justin Bieber lookalike, no wonder when i see him my blood pressure goes up"
               ]
    var colour = [
        "green","red","blue","orange","purple","white"
        ]
    var div = document.createElement("div")
    div.className = "hehexd"
    var rndInt = randomIntFromInterval(0,list.length);
    var rndInt2 = randomIntFromInterval(0,80);
    var rndInt3 = randomIntFromInterval(0,80);
    var rndInt4 = randomIntFromInterval(0,colour.length)
    var rndInt5 = randomIntFromInterval(20,30);
    div.innerText = list[rndInt];
    div.style.top = "".concat(rndInt2,"vh")
    div.style.left = "".concat(rndInt3,"vw");
    div.style.zIndex= "9999"
    div.style.color = colour[rndInt4];
    div.style.fontSize = "".concat(rndInt5,"px");
    div.style.position = "fixed"
    document.body.appendChild(div);
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}