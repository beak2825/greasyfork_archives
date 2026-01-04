// ==UserScript==
// @name        FUTBIN - Vivalemuc autobuyer SBC
// @version     1.1.1
// @description SBC Data for Autobuyer
// @license     MIT
// @author      Vivalemuc
// @match       https://www.futbin.com/22/squad/**
// @match       https://www.futbin.com/22/squad-builder/**
// @match       https://www.futbin.com/squad-builder
// @match       https://www.futbin.com/squad-builder/**


// @grant       none
// @namespace https://greasyfork.org/users/839270
// @downloadURL https://update.greasyfork.org/scripts/435540/FUTBIN%20-%20Vivalemuc%20autobuyer%20SBC.user.js
// @updateURL https://update.greasyfork.org/scripts/435540/FUTBIN%20-%20Vivalemuc%20autobuyer%20SBC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zone = document.getElementById("show-players-price");
    var parent = zone.parentNode;

    var aP = document.createElement('button');
    // Create the text node for anchor element.
    var linkP = document.createTextNode("Download SBC Solution (PS4)");
    // Append the text node to anchor element.
    aP.appendChild(linkP);
    aP.setAttribute('onclick','createTxt("ps4");'); // for FF
    aP.onclick = function() {createTxt("ps4");}; // for IE
    aP.setAttribute('class','btn-csv btn btn-sm btn-primary submit-comment waves-effect waves-light');
    aP.setAttribute('style','width: 100%; margin: 0px 0px 5px 0px;')
    parent.insertBefore(aP, zone);


    var aX = document.createElement('button');
    // Create the text node for anchor element.
    var linkX = document.createTextNode("Download SBC Solution (Xbox)");
    // Append the text node to anchor element.
    aX.appendChild(linkX);
    aX.setAttribute('onclick','createTxt("xbox");'); // for FF
    aX.onclick = function() {createTxt("xbox");}; // for IE
    aX.setAttribute('class','btn-csv btn btn-sm btn-primary submit-comment waves-effect waves-light');
    aX.setAttribute('style','width: 100%; margin: 0px 0px 5px 0px;')
    parent.insertBefore(aX, zone);



    function createTxt(plateforme){
        var rows = $(".pcdisplay.ut22");
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