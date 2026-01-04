// ==UserScript==
// @name         DC_MapOverlay le guide du fuyard
// @namespace    DC_MapOverlay le guide du fuyard
// @version      0.2.3
// @description  Modification de la carte initiale dans DC, par remplacement et/ou ajout d'une surcouche
// @author       Sarahdium
// @match        https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/395164/DC_MapOverlay%20le%20guide%20du%20fuyard.user.js
// @updateURL https://update.greasyfork.org/scripts/395164/DC_MapOverlay%20le%20guide%20du%20fuyard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //========================
    /*
    Début du Paramétrage
    */
    //========================

    //Adresse de l'image remplaçant la carte initiale
    //** Utiliser des images en transparence (PNG) aux mêmes dimensions que la carte originale (400x400)
    //** Utiliser des URL en HTTPS (ajouter le "s" suffit généralement);
    var replace_imgMap_url = 'https://www.dreadcast.net/Admin/Map/Buildings';
    //Interrupteur pour le remplacement
    //**true  => la carte intiale est remplacée
    //**false => la carte initiale reste inchangée
    var replace_image = true;

    //Adresse de l'image s'ajoutant à la carte initiale (remplacée ou non)
    //** Utiliser des images en transparence (PNG) aux mêmes dimensions que la carte originale (400x400)
    //** Utiliser des URL en HTTPS (ajouter le "s" suffit généralement);
    //var overlay_imgMap_url = 'URL';
    var overlay_imgMap_url = 'https://nsa40.casimages.com/img/2020/01/14/200114023705130304.png';
    //Interrupteur pour l'ajout
    //**true  => la surcouche est ajoutée
    //**false => la surcouche n'est pas ajoutée
    var add_image = true;

    //========================
    /*
    Fin du Paramétrage
    */
    //========================

    var orig_imgMap;
    var orig_imgMap_url;
    var orig_imgMap_style;
    var orig_container;

    if(overlay_imgMap_url.trim().length>0){
        var overlay_div = document.createElement('div');
        overlay_div.className += "simpleMap overlayMap";
        overlay_div.style.cssText = 'position:absolute;z-index:1;width:400px;height:400px;background:url("'+overlay_imgMap_url+'") 0 0 no-repeat;';
    }

    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url.startsWith("ItemMap/Display/")) {
            orig_imgMap = document.querySelector('.simpleMap');
            if(replace_image && replace_imgMap_url.trim().length>0){
                orig_imgMap_style = orig_imgMap.currentStyle || window.getComputedStyle(orig_imgMap, false);
                orig_imgMap_url = orig_imgMap_style.backgroundImage.slice(4, -1).replace(/"/g, "");
                orig_imgMap.style.backgroundImage = 'url("'+replace_imgMap_url+'")';
            }

            if(add_image && overlay_imgMap_url.trim().length>0){
                orig_container = document.querySelector('.mapContent');
                orig_container.insertBefore(overlay_div, orig_imgMap);
            }
        }
    });


})();