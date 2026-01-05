// ==UserScript==
// @name         Neopets: Battledome Fighter
// @version      1.0
// @namespace    Nyu@Clraik
// @description  Fights in the battledome after you select your opponent.
// @author       Nyu
// @match        *://*.neopets.com/dome/arena.phtml*
// @match        *://*.neopets.com/dome/fight.phtml*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/488477/Neopets%3A%20Battledome%20Fighter.user.js
// @updateURL https://update.greasyfork.org/scripts/488477/Neopets%3A%20Battledome%20Fighter.meta.js
// ==/UserScript==



//////////////////////////////// IMPORTANT /////////////////////////////////////////
// This is an old version, it only supports one-hit fights.
// You can check the new and improved version on the clraik forums.
// New version includes multiple turns support, more battle modes and smart healing.
////////////////////////////////////////////////////////////////////////////////////



//CHANGE THESE FOR YOUR OWN:
var abilityToUseFirst=21;//First Turn, Lens Flare
var FirstTurnWeapon1="Ghostkerbomb";
var FirstTurnWeapon2="Illusens Staff";

//Abilities are shown below:
/*
WARNING! Only select abilities your pets already knows, or it wont select anything.
1 = Static Cling
10 = Halitosis
11 = Drizzle
12 = Bandage
13 = Meditate
14 = Shade
15 = Cranky
16 = Meh
17 = Positive Thinking
2 = An Icycle
18 = Sear
19 = Irritable Minions
20 = Throw Pillows
21 = Lens Flare
22 = Shhhhhhhhh...
23 = Shroud
24 = Float
25 = Burrow
26 = Tempest
27 = Snowager's Breath
28 = Warlock's Rage
3 = Healing Fire
29 = Rejuvenate
30 = Drain Life
31 = Reflect
32 = Rally Cry
33 = Adrenaline Rush
34 = Meepit Stampede
35 = Summon Monoceraptor
37 = Esophagor Stench
*/




/////////////////////////////////////////////////////////
//DO NOT EDIT BELOW IF YOU'RE NOT SURE WHAT YOU'RE DOING.
/////////////////////////////////////////////////////////

var time=5000;

if(document.URL.indexOf("dome/arena.phtml") != -1) {
    $(document).ready(function(){
        $("[id='start']").click();
        try{
            setTimeout(function(){ ability(abilityToUseFirst);},3000);
        }catch(e){}

        setTimeout(function(){ equip();},8000);
        setTimeout(function(){ fight();},9000);
    });
}
function ability(ability){
    $("[id='p1am']").click();
    $("[data-ability='"+ability+"']").click();
}
function fight(){
    var slotw1=document.getElementsByClassName("menu p1")[0].innerHTML;
    var slotw2=document.getElementsByClassName("menu p1")[1].innerHTML;
    var slota=document.getElementsByClassName("menu p1")[2].innerHTML;

    if (slotw1.includes("background-image")||slotw2.includes("background-image")){
        $("[id='fight']").click();
        setTimeout(function(){ enemyHP();},2000);
    }
    else{// if a weapon is not selected, try to equip and repeat.
        equip();
        setTimeout(function(){ fight();},1000);
    }
}
function enemyHP(){
    var p1hp=document.getElementById("p1hp").outerHTML.toString();
    if(p1hp.includes('id="p1hp">0</div>')){
        alert("You were defeated :c");
    }
    var p2hp=document.getElementById("p2hp").outerHTML.toString();
    if(p2hp.includes('id="p2hp">0</div>')){
        finish();
    }
}

function collect(){
    $("[class='end_ack collect']").click();
}

function equip(){
    document.getElementsByClassName("menu p1")[0].click();
    try{
        document.querySelector('img[alt="'+FirstTurnWeapon1+'"]').click();
    }
    catch(e){
        document.querySelector('img[title="'+FirstTurnWeapon1+'"]').click();
    }
    if (FirstTurnWeapon2!==""){
        document.getElementsByClassName("menu p1")[1].click();
        try{
            document.querySelector('img[alt="'+FirstTurnWeapon2+'"]').click();
        }
        catch(e){
            document.querySelector('img[title="'+FirstTurnWeapon2+'"]').click();
        }
    }
}

function finish(){
    collect();

    var rewards=document.getElementById("bd_rewardsloot").outerHTML.toString();
    if (rewards.includes("NP limit") && rewards.includes("item limit")){
        setTimeout(function(){ alert("Neopoint and item limit reward reached!");},2000);
    }else{
        setTimeout(function(){ document.getElementById('bdplayagain').click();},2000);
    }

}