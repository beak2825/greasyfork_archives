// ==UserScript==
// @name         MH: Living Garden HUD Enhancer
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.1.6
// @description  Quick travel buttons for the Living Garden area locations. More features comning soon.
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/407059/MH%3A%20Living%20Garden%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/407059/MH%3A%20Living%20Garden%20HUD%20Enhancer.meta.js
// ==/UserScript==
$(document).ready(function() {
    const debug = localStorage.getItem('ws.debug');
    if (debug == true) {
        console.log('LG Script Started');
    }
    loadFunction();
})

function loadFunction() {
    buildAreaHUD();
}

$(document).ajaxComplete(function(event,xhr,options){
    if (options.url == 'https://www.mousehuntgame.com/managers/ajax/mice/getstat.php') {
    } else if (options.url == 'https://www.mousehuntgame.com/managers/ajax/users/userInventory.php') {
    } else {
        loadFunction();
    }
});

//**=========================================**//
//HUD Code
function buildAreaHUD() {
    const debug = localStorage.getItem('ws.debug');
    const location = user.environment_name;
    if (location == 'Living Garden' || location == 'Twisted Garden') {
    } else if (location == 'Lost City' || location == 'Cursed City') {
    } else if (location == 'Sand Dunes' || location == 'Sand Crypts') {
    } else {
        if (debug == true) {
            console.log('Not in a LG area');
        }
        return false;
    }
    if (debug == true) {
        console.log('Currently in: '+location);
    }
    buildTravelHUD();
    wipeCheeseBoard();
    populateEssences();
    const miniGameContainer = $('.minigameContainer');
    if ($('.charmHUD').length == 0) {
        const charmHUD = document.createElement('div');
        charmHUD.classList.add('charmHUD');
        $(charmHUD).css({
            'width': '100%',
            'left':'0',
            'bottom': '-10px',
            'position': 'absolute',
        });
        const shatteringCharm = document.createElement('div');
        shatteringCharm.classList.add('shatteringCharm');
        $(shatteringCharm).text('Shattering');
        $(shatteringCharm).click(function() { charmArm(1074) });
        $(shatteringCharm).css({
            'width': '55px',
            'height': '15px',
            'float': 'left',
            'color': 'white',
            'text-align': 'center',
            'margin-right': '3px',
            'margin-top': '2px',
            'border': '1px solid white',
            'background-color': 'rgb(0, 179, 33)',
            'cursor': 'pointer',
        });
        //
        if (location == 'Living Garden') {
            //LG Buttons
            const spongeBlue = document.createElement('div');
            spongeBlue.classList.add('spongeBlue');
            $(spongeBlue).text('Blue');
            $(spongeBlue).click(function() { charmArm(1020) });
            $(spongeBlue).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(97, 226, 247)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeBlue);
            //
            const spongeDoubleBlue = document.createElement('div');
            spongeDoubleBlue.classList.add('spongeDoubleBlue');
            $(spongeDoubleBlue).text('x2 Blue');
            $(spongeDoubleBlue).click(function() { charmArm(1130) });
            $(spongeDoubleBlue).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(97, 226, 247)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeDoubleBlue);
        } else if (location == 'Lost City') {
            //Lost Buttons
            const searcher = document.createElement('div');
            searcher.classList.add('searcher');
            $(searcher).text('Searcher');
            $(searcher).click(function() { charmArm(1018) });
            $(searcher).css({
                'width': '45px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(161, 85, 170)',
                'cursor': 'pointer',
            });
            charmHUD.append(searcher);
            //
            const safeguard = document.createElement('div');
            safeguard.classList.add('safeguard');
            $(safeguard).text('Safeguard');
            $(safeguard).click(function() { charmArm(1133) });
            $(safeguard).css({
                'width': '50px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(76, 36, 105)',
                'cursor': 'pointer',
            });
            charmHUD.append(safeguard);
        } else if (location == 'Sand Dunes') {
            //Dunes Buttons
            const grublingChow = document.createElement('div');
            grublingChow.classList.add('grublingChow');
            $(grublingChow).text('Chow');
            $(grublingChow).click(function() { charmArm(1016) });
            $(grublingChow).css({
                'width': '45px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(235, 124, 127)',
                'cursor': 'pointer',
            });
            charmHUD.append(grublingChow);
            //
            const grublingBonanza = document.createElement('div');
            grublingBonanza.classList.add('grublingBonanza');
            $(grublingBonanza).text('Bonanza');
            $(grublingBonanza).click(function() { charmArm(1131) });
            $(grublingBonanza).css({
                'width': '45px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(241, 186, 106)',
                'cursor': 'pointer',
            });
            charmHUD.append(grublingBonanza);
        } else if (location == 'Twisted Garden') {
            //TG Buttons
            const spongeRed = document.createElement('div');
            spongeRed.classList.add('spongeRed');
            $(spongeRed).text('Red');
            $(spongeRed).click(function() { charmArm(1017) });
            $(spongeRed).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(202, 73, 67)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeRed);
            //
            const spongeDoubleRed = document.createElement('div');
            spongeDoubleRed.classList.add('spongeDoubleRed');
            $(spongeDoubleRed).text('x2 Red');
            $(spongeDoubleRed).click(function() { charmArm(1132) });
            $(spongeDoubleRed).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(202, 73, 67)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeDoubleRed);
            //
            const spongeYellow = document.createElement('div');
            spongeYellow.classList.add('spongeYellow');
            $(spongeYellow).text('Yellow');
            $(spongeYellow).click(function() { charmArm(1022) });
            $(spongeYellow).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(184, 183, 45)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeYellow);
            //
            const spongeDoubleYellow = document.createElement('div');
            spongeDoubleYellow.classList.add('spongeDoubleYellow');
            $(spongeDoubleYellow).text('x2 Yellow');
            $(spongeDoubleYellow).click(function() { charmArm(1135) });
            $(spongeDoubleYellow).css({
                'width': '50px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(184, 183, 45)',
                'cursor': 'pointer',
            });
            charmHUD.append(spongeDoubleYellow);
            //
            charmHUD.append(shatteringCharm);
        } else if (location == 'Cursed City') {
            //Cursed Buttons
            const bravery = document.createElement('div');
            bravery.classList.add('bravery');
            $(bravery).text('Bravery');
            $(bravery).click(function() { charmArm(1011) });
            $(bravery).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(238, 132, 54)',
                'cursor': 'pointer',
            });
            charmHUD.append(bravery);
            //
            const shine = document.createElement('div');
            shine.classList.add('shine');
            $(shine).text('Shine');
            $(shine).click(function() { charmArm(1019) });
            $(shine).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(67, 114, 54)',
                'cursor': 'pointer',
            });
            charmHUD.append(shine);
            //
            const clarity = document.createElement('div');
            clarity.classList.add('clarity');
            $(clarity).text('Clarity');
            $(clarity).click(function() { charmArm(1012) });
            $(clarity).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(117, 207, 206)',
                'cursor': 'pointer',
            });
            charmHUD.append(clarity);
            //
            const safeguard = document.createElement('div');
            safeguard.classList.add('safeguard');
            $(safeguard).text('Safeguard');
            $(safeguard).click(function() { charmArm(1133) });
            $(safeguard).css({
                'width': '50px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(76, 36, 105)',
                'cursor': 'pointer',
            });
            charmHUD.append(safeguard);
            //
            charmHUD.append(shatteringCharm);
        } else if (location == 'Sand Crypts') {
            //Crypt Buttons
            const saltCharm = document.createElement('div');
            saltCharm.classList.add('saltCharm');
            $(saltCharm).text('Salt');
            $(saltCharm).click(function() { charmArm(1014) });
            $(saltCharm).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(236, 200, 187)',
                'cursor': 'pointer',
            });
            charmHUD.append(saltCharm);
            //
            const doubleSaltCharm = document.createElement('div');
            doubleSaltCharm.classList.add('doubleSaltCharm');
            $(doubleSaltCharm).text('x2 Salt');
            $(doubleSaltCharm).click(function() { charmArm(1134) });
            $(doubleSaltCharm).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(225, 164, 132)',
                'cursor': 'pointer',
            });
            charmHUD.append(doubleSaltCharm);
            //
            const scentCharm = document.createElement('div');
            scentCharm.classList.add('scentCharm');
            $(scentCharm).text('Scent');
            $(scentCharm).click(function() { charmArm(1015) });
            $(scentCharm).css({
                'width': '40px',
                'height': '15px',
                'float': 'left',
                'color': 'white',
                'text-align': 'center',
                'margin-right': '3px',
                'margin-top': '2px',
                'border': '1px solid white',
                'background-color': 'rgb(180, 173, 100)',
                'cursor': 'pointer',
            });
            charmHUD.append(scentCharm);
            //
            charmHUD.append(shatteringCharm);
        }
        //Last
        miniGameContainer.append(charmHUD);
    }
}
//Charm Arm Code
function charmArm(id) {
    hg.utils.TrapControl.setTrinket(id).go();
}


function wipeCheeseBoard() {
    const allPetals = $('.itemContainer').children().not('.travelHudLg');
    allPetals.removeAttr("href").removeAttr("onclick");
    allPetals.on('click',function(e){
        petalsOnClick(e.currentTarget.title);
    });
}

function petalsOnClick(name) {
    const val = name.split(" ");
    const first=val[0];
    const second=val[1];
    const petal = first.concat(" ",second);
    if (petal == 'Dewthief Petal') {
        hg.utils.TrapControl.setBait(1007).go();
    } else if (petal == 'Dreamfluff Herbs') {
        hg.utils.TrapControl.setBait(1008).go();
    } else if (petal == 'Duskshade Petal') {
        hg.utils.TrapControl.setBait(1008).go();
    } else if (petal == 'Graveblossom Petal') {
        hg.utils.TrapControl.setBait(1009).go();
    } else if (petal == 'Plumepearl Herbs') {
        hg.utils.TrapControl.setBait(1010).go();
    } else if (petal == 'Lunaria Petal') {
        hg.utils.TrapControl.setBait(1010).go();
    } else {
    }
}

function populateEssences() {
    let allEssences = $('.essenceContainer').children();
    allEssences.each(function(i,e) {
        const thisClass = $(e).attr('class');
        if (thisClass != 'livingGardenRecipes') {
            const essenceTitle = calculateYourPotential(thisClass);
            this.title = essenceTitle;
        }
    })
}

function calculateYourPotential(id) {
    const location = user.environment_name;
    let thisQuest = "";
    if (location == 'Living Garden' || location == 'Twisted Garden') {
        thisQuest = user.quests.QuestLivingGarden;
    } else if (location == 'Lost City' || location == 'Cursed City') {
        thisQuest = user.quests.QuestLostCity;
    } else if (location == 'Sand Dunes' || location == 'Sand Crypts') {
        thisQuest = user.quests.QuestSandDunes;
    }
    const a = thisQuest.essences[0].quantity;
    const b = thisQuest.essences[1].quantity;
    const c = thisQuest.essences[2].quantity;
    const d = thisQuest.essences[3].quantity;
    const e = thisQuest.essences[4].quantity;
    const f = thisQuest.essences[5].quantity;
    const g = thisQuest.essences[6].quantity;
    const h = thisQuest.essences[7].quantity;
    const i = thisQuest.essences[8].quantity;
    let name = "";
    let newTitle = "";
    let haveNow = "";
    let totalCanCraft = 0;
    if (id == 'item essence_a_crafting_item') {
        name = 'Aleth Essence';
        haveNow = a;
        totalCanCraft = 'NA';
    } else if (id == 'item essence_b_crafting_item') {
        name = 'Ber Essence';
        totalCanCraft = tallyEssences (0,a);
        haveNow = b;
    } else if (id == 'item essence_c_crafting_item') {
        name = 'Cynd Essence';
        totalCanCraft = tallyEssences (1,a,b);
        haveNow = c;
    } else if (id == 'item essence_d_crafting_item') {
        name = 'Dol Essence';
        totalCanCraft = tallyEssences (2,a,b,c);
        haveNow = d;
    } else if (id == 'item essence_e_crafting_item') {
        name = 'Est Essence';
        totalCanCraft = tallyEssences (3,a,b,c,d);
        haveNow = e;
    } else if (id == 'item essence_f_crafting_item') {
        name = 'Fel Essence';
        totalCanCraft = tallyEssences (4,a,b,c,d,e);
        haveNow = f;
    } else if (id == 'item essence_g_crafting_item') {
        name = 'Gur Essence';
        totalCanCraft = tallyEssences (5,a,b,c,d,e,f);
        haveNow = g;
    } else if (id == 'item essence_h_crafting_item') {
        name = 'Hix Essence';
        totalCanCraft = tallyEssences (6,a,b,c,d,e,f,g);
        haveNow = h;
    } else if (id == 'item essence_i_crafting_item') {
        name = 'Icuri Essence';
        totalCanCraft = tallyEssences (7,a,b,c,d,e,f,g,h);
        haveNow = i;
    }
    if (totalCanCraft == 'NA') {
        newTitle = name.concat('\nHave: ',haveNow);
    } else {
        newTitle = name.concat('\nHave: ',haveNow,'\nCan Craft: ',totalCanCraft);
    }
    return newTitle
}

function tallyEssences (n,a,b,c,d,e,f,g,h,i) {
    let craftable = 0;
    for (i=0;i<=n;i++) {
        if (i == 0) {
            craftable = Math.floor(a/3);
            b = b+craftable;
        } else if (i == 1) {
            craftable = Math.floor(b/3);
            c = c+craftable;
        } else if (i == 2) {
            craftable = Math.floor(c/3);
            d = d+craftable;
        } else if (i == 3) {
            craftable = Math.floor(d/3);
            e = e+craftable;
        } else if (i == 4) {
            craftable = Math.floor(e/3);
            f = f+craftable;
        } else if (i == 5) {
            craftable = Math.floor(f/3);
            g = g+craftable;
        } else if (i == 6) {
            craftable = Math.floor(g/3);
            h = h+craftable;
        } else if (i == 7) {
            craftable = Math.floor(h/3);
            i = i+craftable;
        }
    }
    return craftable
}

//**=========================================**//
//Travel Code
function buildTravelHUD() {
    const itemContainer = $('.itemContainer');
    if ($('.travelHudLg').length == 0) {
        const travelHudLg = document.createElement('div');
        travelHudLg.classList.add('travelHudLg');
        $(travelHudLg).css({
            'width': '100%',
        });
        //Garden Button
        const gardenButton = document.createElement('div');
        gardenButton.classList.add('gardenButton');
        $(gardenButton).text('Garden');
        $(gardenButton).css({
            'width': '40px',
            'height': '15px',
            'float': 'left',
            'text-align': 'center',
            'margin-right': '3px',
            'margin-top': '2px',
            'border': '1px solid',
            'background-color': 'rgb(49, 129, 34)',
            'cursor': 'pointer',
        });
        travelHudLg.append(gardenButton);
        //City Button
        const cityButton = document.createElement('div');
        cityButton.classList.add('cityButton');
        $(cityButton).text('City');
        $(cityButton).css({
            'width': '40px',
            'height': '15px',
            'float': 'left',
            'text-align': 'center',
            'margin-right': '3px',
            'margin-top': '2px',
            'border': '1px solid',
            'background-color': '#6dd0e5',
            'cursor': 'pointer',
        });
        travelHudLg.append(cityButton);
        //Sand Button
        const sandButton = document.createElement('div');
        sandButton.classList.add('sandButton');
        $(sandButton).text('Sand');
        $(sandButton).css({
            'width': '40px',
            'height': '15px',
            'float': 'left',
            'text-align': 'center',
            'margin-top': '2px',
            'border': '1px solid',
            'background-color': '#c7ae8f',
            'cursor': 'pointer',
        });
        travelHudLg.append(sandButton);
        //Last
        itemContainer.append(travelHudLg);
    } else {
        return false
    }
}
$(document).on('click', '.gardenButton', function() {
    app.pages.TravelPage.travel('desert_oasis');
})
$(document).on('click', '.cityButton', function() {
    app.pages.TravelPage.travel('lost_city');
})
$(document).on('click', '.sandButton', function() {
    app.pages.TravelPage.travel('sand_dunes');
})
