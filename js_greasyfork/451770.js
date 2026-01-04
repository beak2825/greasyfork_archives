// ==UserScript==
// @name        FUTBIN - Vivalemuc autobuyer SBC
// @version     23.0.0
// @description SBC Data for Autobuyer
// @license     MIT
// @author      Vivalemuc
// @match       https://www.futbin.com/23/squad/**
// @match       https://www.futbin.com/23/squad-builder/**
// @match       https://www.futbin.com/squad-builder
// @match       https://www.futbin.com/squad-builder/**


// @grant       none
// @namespace https://greasyfork.org/users/839270
// @downloadURL https://update.greasyfork.org/scripts/451770/FUTBIN%20-%20Vivalemuc%20autobuyer%20SBC.user.js
// @updateURL https://update.greasyfork.org/scripts/451770/FUTBIN%20-%20Vivalemuc%20autobuyer%20SBC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zone = document.getElementsByClassName("top-bar-small-title ")[2];
    var parent = zone.parentNode;

    var aP = document.createElement('a');
    // Create the text node for anchor element.
    var linkP = document.createTextNode("SBC");
    // Append the text node to anchor element.
    aP.appendChild(linkP);
    aP.setAttribute('type','button'); // for FF
    aP.setAttribute('onclick','createTxt("ps4");'); // for FF
    aP.onclick = function() {createTxt("ps4");}; // for IE
    aP.setAttribute('class',' fut-23-btn btn-copy px-3 pull-right');
    parent.insertBefore(aP, zone);



    function createTxt(plateforme){
        var rows = $(".pcdisplay.ut23");
        var csv = '';
        for( var i = 0; i < rows.length; i++ ) {
            var cells = $(rows[i]);
            var playerId=  cells[0].dataset.baseId;
            var resourceId = cells[0].dataset.resourceId;
            var playerPrice=0;
            if(plateforme=="pc")
                playerPrice = cells[0].dataset.pricePc;
            else if(plateforme=="xbox")
                playerPrice = cells[0].dataset.priceXbl;
            else if(plateforme=="ps4")
                playerPrice = cells[0].dataset.pricePs3;

            var playerRating= cells[0].dataset.rating;
            var rarity= cells[0].dataset.rareType;
            var name = cells[0].dataset.playerCommom;
            if(playerId==resourceId){
                csv +='{"name": "'+name+'","maskedDefId": '+playerId+',"buyPrice": '+playerPrice+',"sellPrice": 1,"sellBid":0,"level":"any","rarity": '+rarity+',"style": -1,"position":"any","zone":-1, "maxPurchases":1,"buyIf":'+playerRating+', "sellIf":'+playerRating+',"buyWithStyle":false, "minContract":0}'
            }else{
                csv +='{"name": "'+name+'","defId": '+resourceId+',"buyPrice": '+playerPrice+',"sellPrice": 1,"sellBid":0,"level":"any","rarity": '+rarity+',"style": -1,"position":"any","zone":-1, "maxPurchases":1,"buyIf":'+playerRating+', "sellIf":'+playerRating+',"buyWithStyle":false, "minContract":0}'
            }
            csv += '\r\n';
        }
        // download the .csv by creating a link
        var BOM = "\uFEFF";

        var link = document.createElement('a');

        link.id = 'download-sbc-'+Date.now();
        var BOM = "\uFEFF";
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + BOM + encodeURIComponent(csv));
        link.setAttribute('download', "autobuyer_sbc_"+Date.now()+'.txt');
        document.body.appendChild(link);
        document.querySelector('#'+link.id).click();

    }

})();