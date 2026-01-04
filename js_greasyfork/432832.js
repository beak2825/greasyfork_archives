// ==UserScript==
// @name         loomlock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help you choose loomlock
// @author       Mythic_JPG_Collector 0x57fcb5ea64d904386e8490edebbacebc93c0d94a
// @match        https://opensea.io/collection/loomlocknft-2
// @match        https://opensea.io/assets/loomlocknft-2?*
// @match        https://opensea.io/collection/loomlocknft-2?*
// @icon         https://www.google.com/s2/favicons?domain=opensea.io
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/432832/loomlock.user.js
// @updateURL https://update.greasyfork.org/scripts/432832/loomlock.meta.js
// ==/UserScript==

var inited = false;

function parseLootId(bagName) {
    var paragraph = bagName;
    var regex = /Bag #(\d+)/;
    var found = paragraph.match(regex);
    return parseInt(found[1]);
}

//var staticSvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; } .legendary { fill: rgb(248, 183, 62); font-family: serif; font-size: 14px; } .mythic { fill: rgb(255, 68, 183); font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">Ghost Wand</text><text x="10" y="40" class="base">Shirt</text><text x="10" y="60" class="legendary">Full Helm of Anger</text><text x="10" y="80" class="legendary">War Belt of Perfection</text><text x="10" y="100" class="mythic">"Skull Bite" Hard Leather Boots of Reflection +1</text><text x="10" y="120" class="legendary">Wool Gloves of Skill</text><text x="10" y="140" class="base">Amulet</text><text x="10" y="160" class="base">Titanium Ring</text><text x="10" y="280" class="base">###PATCHED###</text></svg>';
function onwheelevent(event) {
    event.preventDefault();
    var elements = document.getElementsByClassName("AssetCardFooter--name");
    for (var i = 0; i < elements.length; i++) {
       // elements[i].style.color = "red";
        var duckid = elements[i].innerText;
        var descDIV = elements[i].parentElement.parentElement.parentElement;
        var girdDIV = descDIV.parentElement;
        //console.log(girdDIV);
        var imgsvg = girdDIV.getElementsByClassName('Image--image')[0];
        console.log(imgsvg);

        imgsvg.src = "https://aalsi5pli4u6k7cwauucdhtxjtamvejyxhulqu374gn5jr3ky7lq.arweave.net/ABckdetHKeV8VgUoIZ53TMDKkTi56LhTf-Gb1Mdqx9c/"+duckid+".png";
    }
}

(function() {
    'use strict';

    if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
        document.addEventListener('wheel', onwheelevent);
    }
})();