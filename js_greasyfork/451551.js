// ==UserScript==
// @name        FUTBIN - Vivalemuc autobuyer - Player Id
// @version     23.0.0
// @description PlayerId for Autobuyer
// @license     MIT
// @author      Vivalemuc
// @match       https://www.futbin.com/23/player/*
// @grant       none
// @namespace https://greasyfork.org/users/839270
// @downloadURL https://update.greasyfork.org/scripts/451551/FUTBIN%20-%20Vivalemuc%20autobuyer%20-%20Player%20Id.user.js
// @updateURL https://update.greasyfork.org/scripts/451551/FUTBIN%20-%20Vivalemuc%20autobuyer%20-%20Player%20Id.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zone = document.getElementById("page-info");
    var player= document.getElementById("Player-card");
    var playerId = zone.dataset.baseid;
    var resourceId = zone.dataset.playerResource;
    var rarity = player.dataset.rareType;
    var name = document.getElementsByClassName("pcdisplay-name")[0];
    var rating = document.getElementsByClassName("pcdisplay-rat")[0];

    if(playerId==resourceId){
        document.getElementsByClassName("page-header-top")[0].append('{"name": "'+name.textContent+'","maskedDefId": '+playerId+',"buyPrice":[BUY PRICE],"sellPrice": 1,"sellBid":0,"level":"any","rarity": '+rarity+',"style": -1,"position":"any","zone":-1, "maxPurchases":1,"buyIf":'+rating.textContent+', "sellIf":'+rating.textContent+',"buyWithStyle":false, "minContract":0}');

    }else{
        document.getElementsByClassName("page-header-top")[0].append('{"name": "'+name.textContent+'","defId": '+resourceId+',"buyPrice":[BUY PRICE],"sellPrice": 1,"sellBid":0,"level":"any","rarity": '+rarity+',"style": -1,"position":"any","zone":-1, "maxPurchases":1,"buyIf":'+rating.textContent+', "sellIf":'+rating.textContent+',"buyWithStyle":false, "minContract":0}');
    }
})();