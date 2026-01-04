// ==UserScript==
// @name         mekaverse
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Help you choose Loot Bag
// @author       dashuo
// @match        https://opensea.io/collection/mekaverse
// @match        https://opensea.io/assets/mekaverse?*
// @match        https://opensea.io/collection/mekaverse?*
// @match        https://opensea.io/account
// @match        https://opensea.io/assets*
// @icon         https://www.google.com/s2/favicons?domain=opensea.io
// @grant        GM_getResourceText
// @resource DATALootRare https://raw.githubusercontent.com/a-dwarf/loot/main/meka.json
// @resource DATALootItems https://raw.githubusercontent.com/a-dwarf/loot/main/output/fatales/occurences.json
// @resource DATALootBags https://raw.githubusercontent.com/a-dwarf/loot/main/output/fatales/fateles_loot.json
// @downloadURL https://update.greasyfork.org/scripts/433844/mekaverse.user.js
// @updateURL https://update.greasyfork.org/scripts/433844/mekaverse.meta.js
// ==/UserScript==

var dataRare = GM_getResourceText('DATALootRare')
var dataItems = GM_getResourceText('DATALootItems')
var dataBags = GM_getResourceText('DATALootBags')
var gLootRare = JSON.parse(dataRare);
var gLootItems = JSON.parse(dataItems);
var gLootBags = JSON.parse(dataBags);


var inited = false;

function findRareByLootId(lootid) {
  var index = gLootRare.findIndex(function (x) { return x.lootId === Number(lootid);} );
  return gLootRare[index];
}

function findBagByLootId(lootid) {
  var index = gLootBags.findIndex(function (x) { return x.id === Number(lootid);} );
  return gLootBags[index];
}

function parseLootId(bagName) {
    var paragraph = bagName;
    var regex = /Meka #(\d+)/;
    var found = paragraph.match(regex);
    return found[1];
}

function getRarity(name) {
    var result = gLootItems.hasOwnProperty(name);
    if (!result) {
        return 0;
    }
    return gLootItems[name];
}

function rarityCSS(value) {
    let types = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
    if (value == 1) {
        return "mythic";
    }
    else if (value <= 10) {
        return "legendary";
    }
    return "base"
}

function genSVG(bag) {
    let parts = ""
    let y = 20;
    parts = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; } .legendary { fill: rgb(248, 183, 62); font-family: serif; font-size: 14px; } .mythic { fill: rgb(255, 68, 183); font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" />';
    bag.items.forEach(itemname => {
        let rarity = getRarity(itemname);
        parts += '<text x="10" y="'+ y +'" class="' + rarityCSS(rarity) + '">';
        parts += itemname;
        parts += '</text>';
        y += 20;
    });
    parts += '<text x="10" y="280" class="base">###PATCHED###</text>';
    parts += '</svg>';
    return parts;
}

window.onload=function(){
    var annotations1 = document.getElementsByClassName('item--media-frame');
    var parentItem1 = annotations1[0];
    var lootid1 = window.location.pathname.split('/')[3];
    var loot1 = findRareByLootId(lootid1);
    var newNode1 = document.createElement('div');
    newNode1.className = 'lootrare-label';
    newNode1.innerHTML = "<div class='lootrare-label' style='color: blue'> score:" + Number(loot1.score).toFixed(2) + " rarest:" + loot1.rarest + " </div>";
    parentItem1.prepend(newNode1);
};

function onwheelevent(event) {
    event.preventDefault();


    var elements = document.getElementsByClassName("AssetCardFooter--name");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.color = "red";
        var bagLabel = elements[i].innerText;
        var lootid = parseLootId(bagLabel);
        var loot = findRareByLootId(lootid);
        console.log(loot)

        var descDIV = elements[i].parentElement.parentElement.parentElement;

        var annotations = descDIV.getElementsByClassName('AssetCardFooter--collection-name');
        if (annotations !== undefined) {
            var parentItem = annotations[0];
            var result = parentItem.getElementsByClassName('lootrare-label');
            if (result.length === 0) {
                var newNode = document.createElement('div');
                newNode.className = 'lootrare-label';
                newNode.innerHTML = "<div class='lootrare-label' style='color: red'> rarest:" + loot.rarest + " </div>";
                parentItem.prepend(newNode);
            }
        }
    }
}

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        document.addEventListener('wheel', onwheelevent);
    }
})();