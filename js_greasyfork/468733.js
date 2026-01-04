

// ==UserScript==
// @name         Cirus
// @namespace   zero.rw.torn
// @version      0.9
// @description  Generates RW Template
// @author       -zero [2669774]
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468733/Cirus.user.js
// @updateURL https://update.greasyfork.org/scripts/468733/Cirus.meta.js
// ==/UserScript==



const api = '';

var apData = JSON.parse(localStorage.getItem('apData')) || [];


// DO NOT CHANGE ANYTHING BELOW

var result = ``;
var melee= ``;
var primary = ``;
var secondary = ``;
var armor = ``;


const but = `<button class='torn-btn' id='templateZero'>GENERATE</button>`;
const butM = `<button class='torn-btn' id='templateZeroM'>Melee</button>`;
const butP = `<button class='torn-btn' id='templateZeroP'>Primary</button>`;
const butS = `<button class='torn-btn' id='templateZeroS'>Secondary</button>`;
const butA = `<button class='torn-btn' id='templateZeroA'>Armor</button>`;
const butC = `<button class='torn-btn' id='templateZeroC'>CLEAR</button>`;

async function clear(){
    localStorage.removeItem("apData");
    apData = [];
    alert('Cleared!');
}

async function copyMelee(){
    navigator.clipboard
        .writeText(melee)
        .then(() => {
        alert("successfully copied Melee");
    })
        .catch(() => {
        alert("something went wrong");
    });
}

async function copySecondary(){
    navigator.clipboard
        .writeText(secondary)
        .then(() => {
        alert("successfully copied Secondary");

    })
        .catch(() => {
        alert("something went wrong");
    });
}

async function copyPrimary(){
    navigator.clipboard
        .writeText(primary)
        .then(() => {
        alert("successfully copied Primary");

    })
        .catch(() => {
        alert("something went wrong");
    });
}

async function copyArmor(){
    navigator.clipboard
        .writeText(armor)
        .then(() => {
        alert("successfully copied Armor");

    })
        .catch(() => {
        alert("something went wrong");
    });
}



async function generate(){
    $('#templateZero').addClass('disabled');
    $('#templateZero').prop('disabled',true);

    console.log('generating!');
    var bazpi = `https://api.torn.com/user/?selections=display&key=${api}&comment=Zim`;
    var bazD = await $.getJSON(bazpi);
    var colors = {'Orange':'#f76707','Red':'#f03e3e','Yellow':'#f59f00'};

    

    for (var itemNo in bazD.display){
        var item = bazD.display[itemNo];

        var itemId;

        if (item.UID){
            itemId = String(item.UID);
            var name = item.name;
            var price = parseInt(item.price/100000);
            price = price.toLocaleString("en-US");

            var itemURL = `https://api.torn.com/torn/${itemId}?selections=itemdetails&key=${api}&comment=Zim Data`;
            var bonuses = [];

            console.log(apData);

            if (apData.includes(itemId)){
                console.log('Found');
                result += apData[itemId];
                continue;
            }

            console.log('Checking ' + itemId);
            var itemD = await $.getJSON(itemURL);
            if (itemD.error){
                console.log(itemD.error);
                continue;
            }
            var type = itemD.itemdetails.type;
            var rarity =itemD.itemdetails.rarity || 'None';

            var color = colors[rarity] || '#ffffff';
            var dmg = itemD.itemdetails.damage || 'None';
            var acc = itemD.itemdetails.accuracy || 'None';
            var quality = itemD.itemdetails.quality || 'None';

            for (var bonus in itemD.itemdetails.bonuses){
                var bonusN = itemD.itemdetails.bonuses[bonus].bonus;
                var bonusV = itemD.itemdetails.bonuses[bonus].value;
                bonuses.push(bonusV + '% '+bonusN);
            }
            var fbonus = bonuses.join(' / ');

            var tresult = `[left][center][left][size=16]- [b][b][b][b][b][color=${color}]${rarity[0]} ${quality}%[/color] [/b][/b][/b][/b][/b]- [b][b][b][b][b][color=#0ca678]${fbonus}[/color] [/b][/b][/b][/b][/b]${name} -[i] [/i][i][b][b][b][b][i][color=#37b24d]NA[/color][/i][/b][/b][/b][/b][/i]
[/size][/left]
[/center]
[/left]
[left][center][left][left][center][left][size=16][i]- [/i][color=${color}][b][b][b][b][b]Stats [/b][/b][/b][/b][/b][/color][i]-[/i] [color=#0ca678][i][b][b][b][b][i][D: ${dmg} / A: ${acc}][/i][/b][/b][/b][/b][/i][b][i] [/i][/b][/color]- [b][u][color=#74b816][?][/color][/u][u][color=#74b816]
[/color][/u][/b][/size][/left]
[/center]
[/left]
[size=16]- [color=${color}][b]Status[/b] [/color]- [b][color=#74b816][Available][/color][/b]
[i]- [/i][color=${color}][b][b][b][b][b]Notes[/b][/b] [/b][/b][/b][/color][i]- [/i][i][color=#7048e8]NA[/color][/i][/size][/left]
[/center]
[/left]
[size=16]
[/size]`;
            console.log(type);

            if (type == "Primary"){
                primary += tresult;
            }
            if (type == "Secondary"){
                secondary += tresult;
            }
            if (type == "Melee"){
                melee += tresult;
            }
            if (type == "Defensive"){
                armor += tresult;
            }
            apData.push(itemId);

        }
    }

    localStorage.setItem('apData', JSON.stringify(apData));
    // console.log(result);

    alert("Successfully Generated! Click the buttons to copy.");
    $('#templateZero').removeClass('disabled');
    $('#templateZero').prop('disabled',false);




}

function insert(){
    if ($('#forums').length > 0){
        $('.content-title > h4').append(but);
        $('#templateZero').on('click', generate);

        $('.content-title > h4').append(butA);
        $('#templateZeroA').on('click', copyArmor);

        $('.content-title > h4').append(butP);
        $('#templateZeroP').on('click', copyPrimary);

        $('.content-title > h4').append(butS);
        $('#templateZeroS').on('click', copySecondary);

        $('.content-title > h4').append(butM);
        $('#templateZeroM').on('click', copyMelee);

        $('.content-title > h4').append(butC);
        $('#templateZeroC').on('click', clear);

    }
    else{
        setTimeout(insert, 300);
    }
}

(function() {
    'use strict';
    insert();

    // Your code here...
})();

