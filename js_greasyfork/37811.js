// ==UserScript==
// @name         Moomoo.io /ᐠ｡ᆽ｡ᐟ \ Mod *BETA*
// @namespace    Moomoo.io /ᐠ｡ᆽ｡ᐟ \ Mod *BETA*
// @version      0.1
// @description  Easy Hats switch
// @author       /ᐠ｡ᆽ｡ᐟ \
// @match        https://moomoo.io/*
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        http://dev.moomoo.io/?party=45.63.90.79/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @icon         https://cdn.discordapp.com/attachments/359595961980420097/386420015458549770/Galahad.png
// @downloadURL https://update.greasyfork.org/scripts/37811/Moomooio%20%E1%90%A0%EF%BD%A1%E1%86%BD%EF%BD%A1%E1%90%9F%20%5C%20Mod%20%2ABETA%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/37811/Moomooio%20%E1%90%A0%EF%BD%A1%E1%86%BD%EF%BD%A1%E1%90%9F%20%5C%20Mod%20%2ABETA%2A.meta.js
// ==/UserScript==


var moomooVer = $('#linksContainer2 .menuLink').html(),
    removeSelectors = ['#youtuberOf', '#linksContainer1', '#downloadButtonContainer', '#promoImgHolder', '#followText', '#adCard', '.menuHeader:nth-child(5)', '.menuHeader:nth-child(6)', '.menuText', '#twitterFollow', '#___ytsubscribe_0'],
    css = '#rightCardHolder {display: block!important;}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style'),
    ws,
    myID,
    hasApple = true,
    f = 0,
    aV = [0,0],
    hZ = [[15, "Winter Cap"], [12, "Booster Hat"], [31, "Flipper Hat"], [10, "Bush Gear"], [22, "Emp Helmet"], [40,  "Tank Gear"], [20, "Samurai Armor"], [7, "Bull Helmet"], [11, "Spike Gear"]],
    rZe = 0;

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}

function hF(ki){
    if(aV[0] === 0){
        storeEquip(hZ[ki][0]);
        document.title = hZ[ki][1];
        aV[1] = 90;
        revertTitle();
    } else {
        storeBuy(hZ[ki][0]);
        aV[0] = 0;
        aV[1] = 180;
        document.title = "Bought. (if you had enough gold and didn't already buy it)";
        revertTitle();
    }
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 96: kfc.preventDefault(); aV[0] = 1; aV[1] = 300; document.title = "Buying...."; break;
            case 110: if(aV[0] === 1){kfc.preventDefault(); aV[1] = 120; document.title = "Not buying....";}  aV[0] = 0; break;
            case 107: kfc.preventDefault(); storeEquip(0); break;
            case 97: kfc.preventDefault(); hF(0); break;
            case 98: kfc.preventDefault(); hF(1); break;
            case 99: kfc.preventDefault(); hF(2); break;
            case 100: kfc.preventDefault(); hF(3); break;
            case 101: kfc.preventDefault(); hF(4); break;
            case 102: kfc.preventDefault(); hF(5); break;
            case 103: kfc.preventDefault(); hF(6); break;
            case 104: kfc.preventDefault(); hF(7); break;
            case 105: kfc.preventDefault(); hF(8); break;
        }
	}
});

registerCommands();
