// ==UserScript==
// @name         Battlebot
// @version      0.1
// @namespace    none
// @description  Fights in the battledome after you select your opponent c:
// @author       Nyu (clraik)
// @match        http://www.neopets.com/dome/arena.phtml
// @downloadURL https://update.greasyfork.org/scripts/34853/Battlebot.user.js
// @updateURL https://update.greasyfork.org/scripts/34853/Battlebot.meta.js
// ==/UserScript==


if(document.URL.indexOf("dome/arena.phtml") != -1) {// if url contains dome/arena.phtml
    $(document).ready(function(){
        document.getElementById("start").click();// Click on start button
        setTimeout(function(){ ability();},3000);// Wait one second and select ability
        setTimeout(function(){ equip();},8000);// Wait five seconds and select equip
        setTimeout(function(){ fight();},9000);// Wait seven seconds and clicks fight button
        setTimeout(function(){ collect();},13000);// Collects the prize //DOESN'T WORK YET but it will still give you the prizes.
        // Only use one of the next two:
        setTimeout(function(){ loot();},14000);// Use this one if you want it to fight until you can't get more rewards.
        //setTimeout(function(){ again();},15000);// Use this to keep it working until you close the tab or stop the script.
    });
}
function ability(){
    $("[id='p1am']").click();
    $("[data-ability='21']").click();//21 = Lens Flare
    /*
    WARNING! Only select abilities your pet already knows, or it wont select anything.
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
}
function fight(){
    document.getElementById("fight").click();
}
   function equip(){
    $("[id='p1e1m']").click();
    document.getElementsByClassName("fsmid")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("img")[0].click();
    // Select first column, first element |◙○○|
    //                                    |○○○|
    $("[id='p1e2m']").click();
    document.getElementsByClassName("fsmid")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[1].getElementsByTagName("img")[0].click();
    // Select first column, second element |○○○|
    //                                     |◙○○|
    //  ul 0 1 2
    //li
    // 0   ◙ ◙ ◙
    // 1   ◙ ◙ ◙
    //Change the numbers in getElementsByTagName("ul")[UL_NUMBER] and getElementsByTagName("li") [LI_NUMBER] to the items you want to use.
}
function collect(){
    document.getElementsByClassName("end_game")[0].getElementsByClassName("end_ack")[0].getElementsByClassName("collect")[0].click();
}
function again(){
    $("[id='bdplayagain']").click();
}
function loot(){
    var rewards=document.getElementById("bd_rewardsloot").outerHTML.toString();
    if (rewards.includes("NP limit")&&rewards.includes("item limit")){
        window.alert("Neopoint and item limit reward reached.\nThanks for using The Battlebot!");
    }else{
        setTimeout(function(){ again();},15000);// Wait fifteen seconds and clicks play again
    }
}