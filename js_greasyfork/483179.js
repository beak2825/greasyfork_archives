// ==UserScript==
// @name         snowball fight nebula highlight
// @namespace    http://tampermonkey.net/
// @version      2023-12-28
// @description  highlights nebula members in snowbal fight :)
// @author       You
// @match        https://www.grundos.cafe/winter/snowball_fight/teams/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483179/snowball%20fight%20nebula%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/483179/snowball%20fight%20nebula%20highlight.meta.js
// ==/UserScript==

const targetList = document.querySelectorAll('a[onclick*="window.open(\"');

let guildList = ["Zelda","sunniedaes","Kiu","Erriu","defays","brilvaedo_hurts","freakazoid","SpaceCat","Widow","Kyouri","Lugoria","Cinna","magiarecordobsessed","Shuluu","itsjenn","Alestrius","Snail","moonfaerie","Ariel","carol","Katelyn","Lua","klutzy","CrystalFlame","pluto","valentine","StarCascade","Byleth","Ria","Neeks","jordby","Psychokitty","Morissa","Fayeli","mutant","tsu","Tsubasa","Marth","Jianne","daisyandherpets","kitten","CallMeThaddy","charming_thievery","Christina","Vee","vespiquen","druzydreams","Twiggies","elochi","carin","meker","Taylor","Mature","Venus","Kiki","Velaris","Swamp","Cybunny","Sydney","noodles","Kelsie","katbuns","WitchTak","SunFaerie","markie","Kaoss","Edelgard","bubbles","Magnavita","ycips","Cursed","Spearmint" ]

for (let i = 0; i < targetList.length; i++) {
    if (guildList.includes(targetList[i].innerText)) {
        targetList[i].style.color = "green";
        targetList[i].previousSibling.data = "\n✔️ "
    }
}
