// ==UserScript==
// @name        TVLW - Temps de stockage
// @namespace   TVLW
// @description Script permettant d'afficher la date à laquelle l'espace de stockage sera plein
// @include     http://www.theverylittlewar.com/constructions.php
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12788/TVLW%20-%20Temps%20de%20stockage.user.js
// @updateURL https://update.greasyfork.org/scripts/12788/TVLW%20-%20Temps%20de%20stockage.meta.js
// ==/UserScript==

// Noms des ressources
var resourcesName = ['energie', 'hydrogene', 'carbone', 'oxygene', 'azote'];

// Ordre des batiments
var buildings = {
  'energie': 0,
  'stockage': 1,
  'hydrogene': 3,
  'carbone': 4,
  'oxygene': 5,
  'azote': 6
};

// Fonction permettant de convertir une chaine de caractere en nombre
function toNumber (ressourceString) {
  return parseInt(ressourceString.replace(/ /g, ''));
};

// Fonction permettant de recuperer la quantite actuelle d'une ressource
function getResource (resourceName) {
  var ressources = document.getElementsByClassName('text-uppercase')[0].children;
  var index = resourcesName.indexOf(resourceName);
  if (index !== -1) {
    return toNumber(ressources[index].childNodes[0].childNodes[0].title);
  }
  else {
    console.error('Error : resource \'' + resourceName + '\' doesn\'t exist');
  }
};

// Fonction permettant de recuperer les informations sur un batiment (production, capactié de stockage ...)
function getBuildingInfo (buildingName) {
  if (buildingName in buildings) {
    return toNumber(document.getElementsByClassName('panel-body')[buildings[buildingName]].childNodes[9].title);
  }
  else {
    console.error('Error : building \'' + buildingName + '\' doesn\'t exist');
  }
};

var storageCapacity = getBuildingInfo('stockage');

// Calcul du temps pendant lequel on peut stocker chaque ressource
// (capaciteDeStockage - ressourceActuelle) / production
var storageTimes = [];
for (var i = 0; i < resourcesName.length; i++) {
	storageTimes.push((storageCapacity - getResource(resourcesName[i])) / getBuildingInfo(resourcesName[i]));
}

// Calcul de l'heure a laquelle l'espace de stockage sera plein
var limitingTime = Math.min.apply(null, storageTimes);
var currentDate = new Date();
var storageFullDate = new Date(currentDate.getTime() + limitingTime * 60 * 60 * 1000);

// Ajout du texte indiquant quand l'espace de stockage sera rempli
var storage = document.getElementsByClassName('panel-body')[1];
var lineBreak = document.createElement('br');
storage.appendChild(lineBreak);
var text = document.createTextNode('L\'espace de stockage \nsera plein le ' + storageFullDate.toLocaleDateString() + ' à ' + storageFullDate.toLocaleTimeString());
storage.appendChild(text);