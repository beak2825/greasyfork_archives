// ==UserScript==
// @name         HWM gold by battle
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Цена за бой шмоток в инвентаре. Надеваете шмот, перезагружаете страницу. Работает только с шмотами которьіе можно купить на карте.
// @author       Сенпай
// @match        https://www.heroeswm.ru/inventory.php*
// @icon         https://i.imgur.com/RQdbFfd.jpeg
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/465986/HWM%20gold%20by%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/465986/HWM%20gold%20by%20battle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let getBar = function(){
        let bar = document.querySelectorAll('div.show_hint');
        return bar[0];
    }

    let getMaxDurability = function(str){
        return str.substring(str.lastIndexOf("/") + 1);
    }

    let getEquippedItems = function(){
        let name = "slot";
        let items = {};
        for (let i = 1; i<10; i++){
            let item = document.getElementById("slot" + i);
            if(item.hasChildNodes()){
                let itemForDurability = item.firstChild.firstChild.childNodes[0];
                let durability = itemForDurability.textContent;
                let maxDurability = getMaxDurability(durability);
                let itemCard = item.firstChild.firstChild.childNodes[1].childNodes[1]
                let itemFullName = itemCard.getAttribute("hint")
                let itemName = itemFullName.split(" <")[0];
                items[itemName] = maxDurability;
            }
        }
        return items;
    }

    let getEcoPage = function(callback){
        GM_xmlhttpRequest({
            method: 'GET',
            url: "https://www.heroeswm.ru/ecostat.php",
            onload: callback

        });
    }

    async function getHTMLString(){
        console.log("response await start");
        let response = await fetch("https://www.heroeswm.ru/ecostat.php", {
            method: "GET",
        });
        console.log("text await start");
        let text = response.textResponse;
        console.log(text);
        return text;
    }

    let getCost = function(items){
        getEcoPage(function(response){
            let htmlString = response.responseText;
            let totalCost = 0;
            //console.log(htmlString);
            for (let itemName in items){
                let durability = items[itemName];

                let index = htmlString.indexOf(itemName);

                const startIndex = htmlString.indexOf(itemName);
                let codeIndex = 0;
                let trashStart = 0;
                let endIndex = 0;


                if (startIndex !== -1) {
                    for(let i = 0; i<2; i++){


                        if(i == 0){
                            codeIndex = htmlString.indexOf("<code>", startIndex) + "<code>".length;
                            trashStart = htmlString.indexOf("&nbsp;", codeIndex) + "&nbsp;".length;
                            endIndex = htmlString.indexOf("&nbsp;", trashStart);
                        }else{
                            codeIndex = htmlString.indexOf("<code>", endIndex) + "<code>".length;
                            trashStart = htmlString.indexOf("&nbsp;", codeIndex) + "&nbsp;".length;
                            endIndex = htmlString.indexOf("&nbsp;", trashStart);
                        }
                    }
                    let cost = htmlString.substring(trashStart, endIndex);
                    totalCost += cost.replace(',','')/durability;

                } else {
                    console.log(`"${itemName}" not found in the string.`);
                }
            }
            let newDiv = document.createElement("div");
            let newContent = document.createTextNode("Цена за бой " + totalCost.toFixed(2));

            newDiv.appendChild(newContent);
            newDiv.style.color = "blue";
            getBar().appendChild(newDiv);
        });
    }
    let run = function(){
        let items = getEquippedItems();
        getCost(items);
    }
    run();

})();