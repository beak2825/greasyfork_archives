// ==UserScript==
// @name         palwrld.gg : tier list export
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-03-20
// @description  export la tier list sous une forme que excel accepterai
// @author       cyril delanoy
// @match        https://palworld.gg/tier-list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=palworld.gg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/490328/palwrldgg%20%3A%20tier%20list%20export.user.js
// @updateURL https://update.greasyfork.org/scripts/490328/palwrldgg%20%3A%20tier%20list%20export.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // GENERIQUE
    let verboseDebug = false;
    function toggleDebug(){
        verboseDebug = ! verboseDebug;
        console.log("toggleDebug Verbeux=",verboseDebug);
    }
    GM_registerMenuCommand("toggle Debug", toggleDebug); // active/desactive le debug
    function freshConsoleLog(...args){
        console.clear();
        //console.log(arguments); // affichage des arguments
        //console.log(args); // affichage en tant que liste
        console.log(...args); // affichage normal
    }
    function debug(...args){// fonction qui affiche du debug si activé
        if(verboseDebug){console.log(...args);}
    }
    function debugClear(...args){// fonction qui affiche du debug si activé mais apres avoir effacé la console
        if(verboseDebug){freshConsoleLog(...args);}
    }


    // fonctions dédiées
    // Tier list => list {} avec overall Tier:[A-DS] ; working Tier ; flying Mount Tier ; ground Mounts Tier ; Combat Tier ; Pal ; [Working Skills] ; min speed ; max speed ; mount type ;
    function getTierList(DOM_tier){ // fonction qui retourne une tier list sous la forme d'une liste de dict
        let lst_Dict_tier = [];

        // recupéré le niveau de tier

        // récuperer tous les elements du tier
        //     récupérer les attributs des élements (vitesse, working abilities ...)

        debugClear("[getTierList]",lst_Dict_tier);
        return lst_Dict_tier;
    }
    function getTiersList(){ // fonction qui retourne les tier lists sous la forme d'une liste de dict
        let lst_Dict_tiers = [];
        let DOM_tier, lst_Dict_tier;
        try{
            let DOM_tier_list = document.querySelector(".tier-list");
            let lst_DOM_tiers = DOM_tier_list.getElementsByClassName("tier");
            for(let i=0;i<lst_DOM_tiers.length;i++){
                DOM_tier = lst_DOM_tiers[i];
                lst_Dict_tier = getTierList(DOM_tier);
                if(Array.isArray(lst_Dict_tier)){ // c'est une liste, on étend
                    Array.prototype.push.apply(lst_Dict_tiers,lst_Dict_tier); //extend lst_Dict_tiers avec le tier en cours
                }else{ // ce n'est pas une liste, on push classique
                    lst_Dict_tiers.push(lst_Dict_tier);
                }
            }
        }catch(error){
            console.log("[getTiersList] ERROR :",error);
        }

        debugClear("[getTiersList]",lst_Dict_tiers);
        return lst_Dict_tiers;
    }

    function combineAllTiersList_from_storage(){

    }

    function getCurrentTierType(){ // fonction qui retourne le nom de la tier list en cours
        let currentTierList = null;
        try{
            let DOM_currentTierList = document.querySelector(".router-link-active.router-link-exact-active.other-tier");
            currentTierList = DOM_currentTierList.innerText;
        }catch(error){
            console.log("[getCurrentTierType] ERROR :",error);
        }

        debugClear("[getCurrentTierType]",currentTierList);
        return currentTierList
    } // OK

    // boutons
    GM_registerMenuCommand("Load this Tier list", getTiersList); // WIP
    GM_registerMenuCommand("combine all Tier list", combineAllTiersList_from_storage); // WIP

    GM_registerMenuCommand("current Test", getCurrentTierType); // WIP


})();