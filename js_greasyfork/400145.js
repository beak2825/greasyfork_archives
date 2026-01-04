// ==UserScript==
// @name         Roblox Servery
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Najděte si "skoro" prázdný server.
// @author       You
// @match        https://roblox.com/games/*
// @match        https://web.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400145/Roblox%20Servery.user.js
// @updateURL https://update.greasyfork.org/scripts/400145/Roblox%20Servery.meta.js
// ==/UserScript==

(function() {
    'use strict';
(async function() {
    let counterP = 100;
    let counter = 0;

    const playersCount = document.querySelector("#about > div.section.game-about-container > div.section-content.remove-panel > ul > li:nth-child(1) > p.text-lead.font-caption-body.wait-for-i18n-format-render").innerText.replace(/[^0-9]+/,"");

    let PlaceID = location.href.match(/https:\/\/web.roblox.com\/games\/(\d+)\/.*/)[1]
    if(PlaceID) {
for(let i = 20; i < 500; i++){
    let cs = i < 100 ? 50*i : 100*i;


    fetch(`https://web.roblox.com/games/getgameinstancesjson?placeId=${PlaceID}&startIndex=${cs}`).then( t=>t.json()).then(async t=> {
if(t.Collection.length){
    console.log(t.Collection[0].PlayersCapacity,t.Collection[0].JoinScript)



    for(let c of t.Collection){
    const joinB = document.createElement("a",null)
joinB.setAttribute("onclick", c.JoinScript)
joinB.setAttribute("class", "btn-full-width btn-control-xs rbx-game-server-join")
joinB.style.background="lightgreen";
joinB.innerText = c.PlayersCapacity;
   // await setTimeout(()=>0,50)
        console.log(Number(joinB.innerText[0]+joinB.innerText[1]))
        if(Number(joinB.innerText[0]+joinB.innerText[1]) < counterP ){
            counter = 0;
            counterP = Number(joinB.innerText[0]+joinB.innerText[1])
            document.querySelector(".content").append(joinB)
        } else {
        if(counter <= 1){
            counter++;
            document.querySelector(".content").append(joinB)
        }
        }
    //if((joinB.innerText[0]+joinB.innerText[1]) < 4){
      // document.querySelector(".content").append(joinB)

   //    }
    //}


}

}})}
    }
})()
    // Your code here...
})();