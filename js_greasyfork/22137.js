// ==UserScript==
// @name         FVToolkit-AnimalTrafficking
// @namespace    CuteHornyUnicorn
// @version      0.1b1
// @description  Toolkit for Animal Husbandry. Shortcuts for transferring to own villagers, gender, breedability and status highlighting.
// @author       CuteHornyUnicorn
// @include     /^https?://www\.furvilla\.com/career/breeder/[0-9]*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22137/FVToolkit-AnimalTrafficking.user.js
// @updateURL https://update.greasyfork.org/scripts/22137/FVToolkit-AnimalTrafficking.meta.js
// ==/UserScript==
/*jshint multistr: true */

var getPage = function(url, callback) {
    var req = new XMLHttpRequest();
    req.onload = function() {
        if ( callback && typeof(callback) === 'function' ) {
            callback( this.responseXML );
        }
    };
    req.open( 'GET', url );
    req.responseType = 'document';
    req.send();
};

getPage( '/profile', function(response) {
    var listVillagers = response.querySelector( '.villagers-list' );
    var vilStore = listVillagers.querySelectorAll('ul > li');


       setInterval(function() {
    if (document.getElementsByClassName('modal-open')[0]) {

var modal = document.querySelector('#modalLabel').textContent.trim();
if (modal == 'Animal Transfer') {
var position = document.querySelector('#modalLabel');
       for (var liContent of vilStore) {
       var VilID = parseInt(liContent.querySelector('a[href^="http://"]').toString().match(/\d+/));
       var CurrentID = parseInt(window.location.href.toString().match(/\d+/));
       var VilName = liContent.querySelector('.villager-name').textContent.trim();
       var VilImg = liContent.getElementsByTagName("img")[0].getAttribute("src");

                        var VilCareer = liContent.querySelector('.villager-info');
       if (VilCareer !== null) {
              VilCareer = VilCareer.textContent.trim().toLowerCase();
           if (VilCareer == 'animal husbandry' && VilID != CurrentID) {
var addbreeder = document.createElement('div');
addbreeder.innerHTML = '<a href="#" style=" margin: 0 10px; float: left; font-size: 12px; font-weight: normal;" onClick="javascript:document.getElementsByName(\'recipient_id\')[0].value='+VilID+'"><img style=\'width: 50px;\' src='+VilImg+' /><br />'+VilName+'</a>';
position.appendChild(addbreeder);
           }    }
}
   }

       if (modal == 'Import Animal') {
var listAnimalsImport = document.querySelector('.inventory');
           var animalStoreImport = listAnimalsImport.querySelectorAll('li > .inventory-item-info');
for (var animalImport of animalStoreImport) {
    var animalNameImport = animalImport.querySelector('.name');
var isFemaleImport = animalImport.querySelectorAll('p')[1].textContent.match(' Female');
var isReadyImport = animalImport.querySelectorAll('p')[1].textContent.match(' Now');
if (isReadyImport && isFemaleImport) {animalNameImport.style = "background: #5b5 !important;";}



}
       }

    }
}, 100);

});

var listAnimals = document.querySelector('.animal');
var animalStore =listAnimals.querySelectorAll('li > .animal-item-info');
for (var animal of animalStore) {
    var isempty = animal.querySelectorAll('.name')[0].textContent;
    if (isempty !== 'Empty Slot' && isempty !== 'Add a Stable') {
    var breedableBox = animal.querySelectorAll('.status')[1];
    var breedable = breedableBox.textContent;
    var tamingBox = animal.querySelectorAll('.status')[0];
    var taming = tamingBox.textContent.match('Taming');
    var tamingdone = tamingBox.textContent.match('Complete');
    var tamed = tamingBox.textContent.match('Domesticated');
    var isfemale = animal.querySelector('.animal-item-info-sex').getElementsByTagName("img")[0].getAttribute("src").match('female');
    if (breedable !== 'Breedable Now') {breedableBox.textContent = breedable.replace('Breedable', 'ETA:');breedableBox.style = "color: #d88 !important;";}
    if (breedable == 'Breedable Now' && isfemale) {breedableBox.style = "background: #5b5 !important;";}
    if (breedable == 'Breedable Now'&& !isfemale) {breedableBox.style = "color: #5b5 !important;";}
    if (taming) {tamingBox.style = "background: #d88 !important;";}
    if (tamingdone) {tamingBox.style = "background: #d88 !important; color: #000 !important; font-weight: bold;";}
    if (tamed) {tamingBox.style = "color: #5b5 !important;";}
    if (!taming && !tamed) {tamingBox.style = "color: #d88 !important;";}
    } else if (isempty !== 'Add a Stable') {
    var collectionBox = animal.querySelectorAll('.status')[0];
        if (collectionBox) {
    var collection = collectionBox.textContent.match('Collecting');
    var collectionETA = animal.querySelectorAll('.status')[1];
    var collected = collectionETA.textContent.match('Complete');
    if (collection) {collectionBox.style = "background: #d88 !important;"; collectionETA.style = "color: #d88 !important;";}
    if (collected) {collectionBox.style = "background: #d88 !important; color: #000 !important; font-weight: bold;"; collectionETA.style = "color: #5b5 !important;";}
        }
    }
}