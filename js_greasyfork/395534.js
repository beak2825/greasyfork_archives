// ==UserScript==
// @name         Neopets - Side Account Protector
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Stops you from going any farther on non-side-account pages.
// @author       baffleblend
// @include      http://www.neopets.com/games/*
// @include      http://www.neopets.com/winter/adventcalendar.phtml
// @include      http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @include      http://www.neopets.com/objects.phtml?obj_type=*&type=shop
// @include      http://www.neopets.com/pirates/anchormanagement.phtml
// @include      http://www.neopets.com/halloween/applebobbing.phtml
// @include      http://www.neopets.com/bank.phtml
// @include      http://www.neopets.com/art/submit_art.phtml
// @include      http://www.neopets.com/desert/shrine.phtml
// @include      http://www.neopets.com/magma/darkcave.phtml
// @include      http://www.neopets.com/beauty/vote.phtml
// @include      http://www.neopets.com/beauty/details.phtml?pet=*
// @include      http://www.neopets.com/worlds/geraptiku/tomb.phtml
// @include      http://www.neopets.com/games/crossword/*
// @include      http://www.neopets.com/pirates/forgottenshore.phtml
// @include      http://www.neopets.com/desert/fruitmachine.phtml
// @include      http://www.neopets.com/jelly/jelly.phtml
// @include      http://www.neopets.com/prehistoric/omelette.phtml
// @include      http://www.neopets.com/halloween/gravedanger/
// @include      http://www.neopets.com/medieval/grumpyking.phtml
// @include      http://www.neopets.com/faerieland/springs.phtml?*
// @include      http://www.neopets.com/worlds/kiko/kpop/
// @include      http://www.neopets.com/shenkuu/lunar/
// @include      http://www.neopets.com/moon/meteor.phtml
// @include      http://www.neopets.com/magma/quarry.phtml
// @include      http://www.neopets.com/takedonation_new.phtml?*
// @include      http://www.neopets.com/freebies/
// @include      http://ncmall.neopets.com/mall/shop.phtml?page=giveaway
// @include      http://www.neopets.com/medieval/rubbishdump.phtml
// @include      http://www.neopets.com/thriftshoppe/index.phtml
// @include      http://www.neopets.com/medieval/symolhole.phtml
// @include      http://www.neopets.com/freebies/tarlastoolbar.phtml
// @include      http://www.neopets.com/faerieland/tdmbgpop.phtml
// @include      http://www.neopets.com/trudys_surprise.phtml
// @include      http://www.neopets.com/island/tombola.phtml
// @include      http://www.neopets.com/medieval/wiseking.phtml
// @include      http://www.neopets.com/water/fishing.phtml
// @include      http://www.neopets.com/dome/*
// @include      http://www.neopets.com/battledome/*
// @include      http://www.neopets.com/desert/sc/*
// @include      http://www.neopets.com/halloween/scratch.phtml
// @include      http://www.neopets.com/winter/kiosk.phtml
// @include      http://www.neopets.com/altador/colosseum/
// @include      http://www.neopets.com/faerieland/wheel.phtml
// @include      http://www.neopets.com/desert/extravagance.phtml
// @include      http://www.neopets.com/medieval/knowledge.phtml
// @include      http://www.neopets.com/prehistoric/mediocrity.phtml
// @include      http://www.neopets.com/halloween/wheel/*
// @include      http://www.neopets.com/prehistoric/monotony/*
// @include      http://www.neopets.com/market.phtml?*
// @include      http://www.neopets.com/wishing.phtml
// @include      http://www.neopets.com/prehistoric/battleground/
// @include      http://www.neopets.com/medieval/turmaculus.phtml
// @include      http://www.neopets.com/winter/snowager.phtml
// @include      http://www.neopets.com/games/kadoatery/index.phtml?
// @include      http://www.neopets.com/faerieland/hiddentower938.phtml
// @include      http://www.neopets.com/medieval/guessmarrow.phtml
// @include      http://www.neopets.com/medieval/earthfaerie.phtml
// @include      http://www.neopets.com/faerieland/darkfaerie.phtml
// @include      http://www.neopets.com/island/kitchen.phtml
// @include      http://www.neopets.com/winter/snowfaerie.phtml
// @include      http://www.neopets.com/space/coincidence.phtml
// @include      http://www.neopets.com/prehistoric/ticketbooth.phtml
// @include      http://www.neopets.com/medieval/turdleracing.phtml
// @include      http://www.neopets.com/halloween/strtest/*
// @include      http://www.neopets.com/winter/shopofmystery.phtml
// @include      http://www.neopets.com/stockmarket.phtml*
// @include      http://www.neopets.com/faerieland/poogleracing.phtml
// @include      http://www.neopets.com/medieval/pickyourown_index.phtml
// @include      http://www.neopets.com/winter/igloo.phtml
// @include      http://www.neopets.com/pirates/foodclub.phtml*
// @include      http://www.neopets.com/faerieland/caverns/*
// @include      http://www.neopets.com/faerieland/employ/*
// @include      http://www.neopets.com/halloween/corkgun.phtml
// @include      http://www.neopets.com/halloween/coconutshy.phtml
// @include      http://www.neopets.com/medieval/cheeseroller.phtml
// @include      http://www.neopets.com/pirates/buriedtreasure/*
// @include      http://www.neopets.com/halloween/bagatelle.phtml
// @include      http://www.neopets.com/space/warehouse/*
// @include      http://www.neopets.com/refer/*
// @include      http://www.neopets.com/altador/council.phtml
// @include      http://www.neopets.com/halloween/braintree.phtml
// @include      http://www.neopets.com/halloween/esophagor.phtml
// @include      http://www.neopets.com/shenkuu/neggcave/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395534/Neopets%20-%20Side%20Account%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/395534/Neopets%20-%20Side%20Account%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';
function id(el,id) {return el.getElementById(id);}
function cl(el,cls) {return el.getElementsByClassName(cls);}
function tg(el,tag) {return el.getElementsByTagName(tag);}
function at(el,att) {return el.getAttribute(att);}
function rnd(limit) {return Math.ceil(Math.random() * limit)}
function hide(el){el.style.display="none";}
function randomPick(list){var theValue = rnd(list.length)-1;var selection = theValue; return list[selection];}

    //=====CONFIGURATION==========================================================

    var mainacc = ""; //Put your main account's username here so the script knows when it's safe.

function doIt(){

    var phrases = [ // What exactly is your pet going to yell at you?
    "If you want to go here, log out! Now!",
    "I won't let you put my life on the line for a quick neopoint!",
    "Just back away slowly, and nobody gets hurt.",
    "You forgot you were on this account, didn't you?",
    "This is for your own good, " + mainacc +"."
        ];


    //What's the name of the pet you want to show up if on a page where your active pet can't be detected?
    var defaultPet = "PETNAMEHERE";


    //========================================
    //Code below here.

    var activePetModule = cl(document,"sidebarTable")[0]; //Grabs the module where the active pet's information is stored
    var actpetname = null;
    var pageContent = cl(document,"content")[0];
    if (activePetModule !== undefined&& activePetModule !== null){
        actpetname = tg(activePetModule,"b")[0].textContent; //Detects current active pet's name
        pageContent = cl(document,"content")[0];
    }


var currentURL = window.location.href; //Reads the URL of the current page.
    var chosenPhrase = randomPick(phrases);
    var message = "This page is not allowed when logged into a side account! If you gained an item or neopoints from visiting this page,<br>go to <a href='http://www.neopets.com/inventory.phtml'>your inventory</a> or <a href='http://www.neopets.com/donations.phtml?'>the Money Tree</a> and dispose of it IMMEDIATELY."
    var redtext = "STOP!!!";
    var panicURLs = ["http://www.neopets.com/faerieland/springs.phtml?bought=true","http://www.neopets.com/magma/quarry.phtml","http://www.neopets.com/freebies/","http://www.neopets.com/shop_of_offers.phtml?slorg_payout=yes","http://www.neopets.com/freebies/tarlastoolbar.phtml"]
    var panicNow = false;
    var imageNumber = "3";

    for (var i = 0;i<panicURLs.length;i++){ //Checks if you're on a page that automatically rewards something.
     if (currentURL == panicURLs[i]){
         panicNow = true;
         }
    }

    if (panicNow === true)
    {
        redtext = "OH NO!!!";
        chosenPhrase = "Get rid of that! HURRY! Please, I don't want to die...";
        message = "You've gotten illegal items and/or neopoints! Go to <a href='http://www.neopets.com/quickstock.phtml'>your inventory</a> or <a href='http://www.neopets.com/donations.phtml?'>the Money Tree</a><br>and discard or donate anything you've gained RIGHT NOW!"
        imageNumber = "2";
    }


    if (actpetname !== undefined && actpetname !== null){
     defaultPet = actpetname; //Makes your active pet the one yelling at you, if there is one on that page.
    }
    pageContent.innerHTML = "<center><img src='http://pets.neopets.com/cpn/" + defaultPet +"/" + imageNumber + "/4.png'><br><h1 style='font-size:4em;color:#ff0000;margin-left:20%;margin-right:20%;'>" + redtext +"</h1><p style='font-weight:bold;'>" + defaultPet +" says, \'" + chosenPhrase +"\'</p><p>" + message + "</p><p>If this is your main account, please go to your userscript manager and configure this script.</p></center>";
    }
    var userHeader = cl(document,"user medText")[0];
    var loggedinto = tg(userHeader,"a")[0].textContent; //Grabs current username
    if (loggedinto != mainacc){ //Is the current username the same as your main account name?
     doIt();
    }
})()