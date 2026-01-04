// ==UserScript==
// @name         palworld.gg : export abilities
// @namespace    http://tampermonkey.net/
// @version      2024-03-18
// @description  Extraction de donnée pour export excel
// @author       Cyril delanoy
// @license MIT
// @match        https://palworld.gg/pals
// @icon         https://www.google.com/s2/favicons?sz=64&domain=palworld.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490390/palworldgg%20%3A%20export%20abilities.user.js
// @updateURL https://update.greasyfork.org/scripts/490390/palworldgg%20%3A%20export%20abilities.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function extractAll_Pals(){
        try{

        }catch(error){
            console.log("[] ERROR",error);
        }
    }

    function getPalName_from_capabilitiesDiv(DOM_div){
        let pal = null;
        try{
            let DOM_div_container = DOM_div.parentElement;
            let DOM_a_pal = DOM_div_container.parentElement;
            pal = DOM_a_pal.innerText.split("\n")[0]; //innerText:"Lamball\n1\nCommon\n1\n1\n1"
        }catch(error){
            console.log("[getPalName_from_capabilitiesDiv] ERROR",error);
        }
        return pal;
    }
    function getCapabilityName_from_DOM_item(DOM_item){
        let capabilityName = null;
        try{
            let DOM_image = DOM_item.querySelector("img");
            capabilityName = DOM_image.getAttribute("alt");
        }catch(error){
            console.log("[] ERROR",error);
        }
        return capabilityName;
    }

    function getDictCapabilities(DOM_div_capabilities){ // retourne le dictionnaire comportant les capacités
        let dict_capabilities = {};
        try{
            let lst_DOM_items = DOM_div_capabilities.getElementsByClassName("item");
            for(let i=0;i<lst_DOM_items.length;i++){
                let DOM_item = lst_DOM_items[i];
                if(DOM_item.innerText == 0){// pas la capacité, on continue
                    continue
                }
                // a cette capacité
                let capabilityName = getCapabilityName_from_DOM_item(DOM_item)
                dict_capabilities[capabilityName] = DOM_item.innerText;

            }

        }catch(error){
            console.log("[getDictCapabilities] ERROR",error);
        }
        return dict_capabilities;

    }

    function extractAll_capabilities(){
        let lst_pals_and_capabilities = [];
        let lst_div_capabilities = document.getElementsByClassName("works short");
        for(let i=0;i<lst_div_capabilities.length;i++){
            let DOM_div_capabilities = lst_div_capabilities[i];
            let palName=getPalName_from_capabilitiesDiv(DOM_div_capabilities);
            lst_pals_and_capabilities.push(getDictCapabilities(DOM_div_capabilities));
            lst_pals_and_capabilities[i]["palName"] = palName;

        }
        return lst_pals_and_capabilities;
    }

    function getFrenchHeader(enHeader){
        let enHeaders = ['Handiwork','Mining', 'Transporting', 'palName', 'Deforesting', 'Kindling', 'Oil Extracting', 'Watering', 'Gathering', 'Generating Electricity', 'Farming', 'Medicine Production', 'Planting', 'Cooling']
        let frHeaders = ['Crafting', 'Minage', 'Transport', 'Nom', 'Bois', 'Feu', "Extraction d'huile", 'Eau', 'Collecte', 'Electricité', 'Ferme', 'Pharmacie', 'Plantation', 'Glace'];
        return frHeaders[enHeaders.indexOf(enHeader)];
    }
    function getFrenchHeaders(headers){
        let frenchHeaders=[];
        for(let i=0;i<headers.length;i++){
            frenchHeaders.push(getFrenchHeader(headers[i]));
        }
        return frenchHeaders
    }
    function getHeaders(lstDict){
        let lstHeaders = [];
        for(let i=0;i<lstDict.length;i++){
            let keys = Object.keys(lstDict[i]);
            for(let j=0;j<keys.length;j++){
                let key = keys[j];
                if(!lstHeaders.includes(key)){
                    lstHeaders.push(key);
                }
            }
        }
        console.log(lstHeaders);
        return lstHeaders;
    }

    function consolePrintForExcel(lst_pals_and_capabilities){
        let headers = getHeaders(lst_pals_and_capabilities);
        let frenchHeaders=getFrenchHeaders(headers);
        let lines = [frenchHeaders.join("\t")];
        for(let i=0;i<lst_pals_and_capabilities.length;i++){
            let dictPal = lst_pals_and_capabilities[i];
            let lstToDisplay = [];
            for(let j=0;j<headers.length;j++){
                let header = headers[j]
                if(dictPal[header] == undefined){
                    lstToDisplay.push(0)
                }else{
                    lstToDisplay.push(dictPal[header] );
                }
            }
            lines.push(lstToDisplay.join("\t"));
        }
        console.log(lines.join("\n"))
    }
    console.log(extractAll_capabilities());
    //console.log(getHeaders(extractAll_capabilities()));

    /* Pour preparer le terrain,
        utiliser getHeaders(extractAll_capabilities()) pour liser les header utilisé
        puis modifier getFrenchHeader
    */
    consolePrintForExcel(extractAll_capabilities())

})();