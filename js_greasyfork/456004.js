// ==UserScript==
// @name         Diep Autobuild / Auto Stat Upgrade
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Simple but effective diep.io script. How to use: Press T and type in a lvl 45 tank. It will give you the best build for it in the correct order.
// @author       MI300#4401
// @license      MIT
// @match        *://diep.io/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl8qLdrZqTx39hcDWN3mh2huwiHChMQGb_Sg&usqp=CAU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456004/Diep%20Autobuild%20%20Auto%20Stat%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/456004/Diep%20Autobuild%20%20Auto%20Stat%20Upgrade.meta.js
// ==/UserScript==
function workOutUserInput(userInput){
const Array = userInput.toLowerCase().split('');
const filterspaces = Array.filter(letter => letter !== ' ');
const filterhyphens = filterspaces.filter(letter => letter !== '-');
const string = filterhyphens.join('');
return string;
}
const upgrades = [
    {name: 'rocketeer', build: '565656565656567878787878787822333'},
    {name: 'skimmer', build: '565656565656484848484848487777777'},
    {name: 'factory', build: '565656565656564848484848484777777'},
    {name: 'spike', build: '5656565656565677744487777888222222222233333333338888888888111'},
    {name: 'autosmasher', build: '5656565656565677744487777888222222222233333333338888888888111'},
    {name: 'annihilator', build: '565656565656484848484848487777777'},
    {name: 'battleship', build: '565656565656564848484848447777777'},
    {name: 'autotrapper', build: '565656565656564444848877787878787'},
    {name: 'streamliner', build: '565656565656564444488888878777777'},
    {name: 'spreadshot', build: '565656565656567878787878787843242'},
    {name: 'auto5', build: '565656565656567847847847847847878'},
    {name: 'autogunner', build: '565656565656567847847847847847878'},
    {name: 'landmine', build: '5656565656565677744487777888222222222233333333338888888888111'},
    {name: 'tritrapper', build: '565656565656567878787878787823424'},
    {name: 'megatrapper', build: '565656565656564444488888887777777'},
    {name: 'overtrapper', build: '565656565656564848484848887777777'},
    {name: 'gunnertrapper', build: '565656565656567847847847847847878'},
    {name: 'sprayer', build: '565656565656567847847847847847878'},
    {name: 'predator', build: '565656565656564784784784784784788'},
    {name: 'manager', build: '565656565656568484848484844787777'},
    {name: 'hybrid', build: '565656565656848484848484847777777'},
    {name: 'fighter', build: '565656565656567878787878787823233'},
    {name: 'booster', build: '565656565656567878787878787823233'},
    {name: 'ranger', build: '565656565656564784784784784784784'},
    {name: 'stalker', build: '565656565656564784784784784784784'},
    {name: 'tripletwin', build: '565656565656567878787878787844444'},
    {name: 'necromancer', build: '565656565656564848484848484777777'},
    {name: 'pentashot', build: '565656565656567878787878787844442'},
    {name: 'overlord', build: '565656565656568484848484848477223'},
    {name: 'octotank', build: '565656565656567878787878787844423'},
    {name: 'triplet', build: '565656565656567878787878787844444'},
];
document.addEventListener('keydown', (kc) =>{
    if(kc.keyCode===84) u();
});


function u(){
const userinput = prompt('Please enter a tank')
console.log(userinput);
if(userinput == '' || userinput == null || userinput == ' ') return;
const match = upgrades.find((item) => {
    return item.name.includes(workOutUserInput(userinput))
});
console.log(match)
    input.execute('game_stats_build ' + match.build);
};