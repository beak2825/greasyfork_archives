// ==UserScript==
// @name         LootRare
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Help you choose Loot Bag
// @author       dashuo
// @match        https://opensea.io/collection/lootproject
// @match        https://opensea.io/assets/lootproject?*
// @match        https://opensea.io/collection/lootproject?*
// @icon         https://www.google.com/s2/favicons?domain=opensea.io
// @grant        GM_getResourceText
// @resource DATALootRare https://raw.githubusercontent.com/Anish-Agnihotri/dhof-loot/master/output/rare.json
// @resource DATALootItems https://raw.githubusercontent.com/Anish-Agnihotri/dhof-loot/master/output/occurences.json
// @resource DATALootBags https://raw.githubusercontent.com/ruyan768/loot-tools/main/loot.json
// @downloadURL https://update.greasyfork.org/scripts/434617/LootRare.user.js
// @updateURL https://update.greasyfork.org/scripts/434617/LootRare.meta.js
// ==/UserScript==

var dataRare = GM_getResourceText('DATALootRare')
var dataItems = GM_getResourceText('DATALootItems')
var dataBags = GM_getResourceText('DATALootBags')
var gLootRare = JSON.parse(dataRare);
var gLootItems = JSON.parse(dataItems);
var gLootBags = JSON.parse(dataBags);


var inited = false;

function findRareByLootId(lootid) {
  var index = gLootRare.findIndex(function (x) { return x.lootId === lootid;} );
  return gLootRare[index];
}

function findBagByLootId(lootid) {
  var index = gLootBags.findIndex(function (x) { return x.id === lootid;} );
  return gLootBags[index];
}

function parseLootId(bagName) {
    var paragraph = bagName;
    var regex = /Bag #(\d+)/;
    var found = paragraph.match(regex);
    return parseInt(found[1]);
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

function onwheelevent(event) {
    event.preventDefault();


    var elements = document.getElementsByClassName("AssetCardFooter--name");
    for (var i = 0; i < elements.length; i++) {
        // elements[i].style.color = "red";
        var bagLabel = elements[i].innerText;
        var lootid = parseLootId(bagLabel);
        var loot = findRareByLootId(lootid);
        var bag = findBagByLootId(lootid);
        var staticSVG = genSVG(bag);

        var encodedData = btoa(staticSVG);
        var base64SvgImage = 'data:image/svg+xml;base64,' + encodedData;
        var descDIV = elements[i].parentElement.parentElement.parentElement;
        var girdDIV = descDIV.parentElement.parentElement;
        var imgsvg = girdDIV.getElementsByClassName('Image--image')[0];

        imgsvg.src = base64SvgImage;

        var annotations = descDIV.getElementsByClassName('AssetCardFooter--collection-name');
        if (annotations !== undefined) {
            var parentItem = annotations[0];
            var result = parentItem.getElementsByClassName('lootrare-label');
            if (result.length === 0) {
                var newNode = document.createElement('div');
                newNode.className = 'lootrare-label';
                newNode.innerHTML = "<div class='lootrare-label' style='color: red'> score:" + loot.score + " rarest:" + loot.rarest + " </div>";
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