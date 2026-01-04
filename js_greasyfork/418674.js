// ==UserScript==
// @name         [hwm]_economic_calculations
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Some calculations are done and displayed on economic pages like in facilities and cost of production of an artifact
// @author       Hapko
// @include       https://www.heroeswm.ru/*
// @include       https://www.lordswm.com/*
// @include       https://178.248.235.15/*
// @downloadURL https://update.greasyfork.org/scripts/418674/%5Bhwm%5D_economic_calculations.user.js
// @updateURL https://update.greasyfork.org/scripts/418674/%5Bhwm%5D_economic_calculations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let url = new URL(window.location.href);
    if (url.pathname.includes("object-info.php")){
        doCostPriceCalculation();
    }
    else if (url.pathname.includes("shop.php") && url.searchParams.get("cat") != "transport"){
        doEasyNavigationInShop();
    }
    function doEasyNavigationInShop(){
        //this function gets all artifacts on page and creates a quick navigation page at top of shop
        let mainContainerTable = null;
        let artifactsContainerTable = null;
        const ALL_LEVELS = 24;
        //finding the table container for whole shop and for artifacts
        let allTables = document.getElementsByTagName("tbody");
        let i = 0;
        while (mainContainerTable == null && i < allTables.length) {
            if (allTables[i].children[0].children.length == 4
                && (allTables[i].children[0].children[0].innerText.includes("Продажа артефактов") || allTables[i].children[0].children[0].innerText.includes("Artifact shop"))
              ){
                mainContainerTable = allTables[i];
                artifactsContainerTable = mainContainerTable.children[1].children[0];
            }
            i++;
        }
        allTables = null;
        if (!mainContainerTable){return 0;}

        let artifacts = [];
        //adding id tags to artifact elements and also parsing and storing artifact info for later display
        i = 0;
        while (i < artifactsContainerTable.children.length){
            if (artifactsContainerTable.children[i].tagName.toLowerCase() == "table"){
                let artifactContainer = artifactsContainerTable.children[i].children[0];
                artifactContainer.setAttribute( "id", "artifact_" + i );
                let artifactInfoContainer = artifactContainer.children[1].children[1];
                let artifact = {id: i, title: artifactContainer.children[0].children[0].innerText.trim(), reqLevel: 1, durability: 1, ap: 1, modifiers: document.createElement("div")};
                let j = 0;
                while (j < artifactInfoContainer.childNodes.length){
                    if (/Required level:|Требуемый уровень:/.test(artifactInfoContainer.childNodes[j].innerText)){
                        artifact.reqLevel = parseInt(artifactInfoContainer.childNodes[j + 1].data);
                        artifact.reqLevel = artifact.reqLevel >= 0 ? artifact.reqLevel : parseInt(artifactInfoContainer.childNodes[j+2].innerText) * ALL_LEVELS;
                    } else if (/Durability:|Прочность:/.test(artifactInfoContainer.childNodes[j].innerText)){
                        artifact.durability = parseInt(artifactInfoContainer.childNodes[j + 1].data);
                    } else if (/Ammunition points:|Очки амуниции:/.test(artifactInfoContainer.childNodes[j].innerText)){
                        artifact.ap = parseInt(artifactInfoContainer.childNodes[j + 1].data);
                    } else if (/Modifiers:|Модификаторы:/.test(artifactInfoContainer.childNodes[j].innerText)){
                        artifact.modifiers = artifactInfoContainer.childNodes[j + 1];
                    }
                    j++;
                }
                artifacts.push(artifact);
            }
            i++;
        }
        //building string to display quick links at top of shop
        let s = "<tr><td colspan='3'>"
        +"<table class='wbwhite' style='width:100%;text-align:center;'>"
        +"<tr style='font-weight:bold;height:40px;'><td width='10%'>Req.Level</td><td width='20%'>Artifact</td><td>Modifiers</td><td  width='10%'>Durability</td></tr>";
        for (let i = 0; i < artifacts.length; i++){
            s += `<tr ${i%2==0?"class='wblight'":""}><td>${artifacts[i].reqLevel >= ALL_LEVELS ? "<font color='red'>" + (artifacts[i].reqLevel / ALL_LEVELS) + "</font>" : artifacts[i].reqLevel}</td><td style='height: 30px;'><a style='text-decoration: underline; cursor: pointer' onclick='document.getElementById("artifact_${artifacts[i].id}").scrollIntoView({block:"center"})'>${artifacts[i].title}</a></td><td style="padding-left: 15%;">${artifacts[i].modifiers.outerHTML}</td><td>${artifacts[i].durability}</td>`;
        }
        s += "</table><br></td></tr>";
        //mainContainerTable.innerHTML = s + mainContainerTable.innerHTML;
        artifactsContainerTable.innerHTML = s + artifactsContainerTable.innerHTML;
    }
    function doCostPriceCalculation(){
        //this function calculates the cost pricce of the artifact and displays it on the facility page
        //finding table from where to get values for calculations and display results
        let allTables = document.getElementsByTagName("tbody");
        let foundTable = null;
        let i = 0;
        while (foundTable == null && i < allTables.length){
            if (
                allTables[i].children[0].children.length == 6
                && (allTables[i].children[0].children[0].innerText == "Тип" || allTables[i].children[0].children[0].innerText == "Type")
                && (allTables[i].children[0].children[1].innerText == "Ед/час" || allTables[i].children[0].children[1].innerText == "Units/hour")
                && allTables[i].children.length > 2
               )
            {
                foundTable = allTables[i];
            }
            i++;
        }
        if (foundTable != null){
            //table was found now to get values for calculations
            let wage = 0;
            let output = 0;
            let hoursRequired = 0;
            let totalExpenditure = 0;
            let itemPrice = 0;
            let costPrice = 0;
            //finding wage of facility
            i = 0;
            while (wage <= 0 && i < allTables.length){
                if (allTables[i].children[0].children[0].innerText == "Wage:" || allTables[i].children[0].children[0].innerText == "Зарплата:"){
                    wage = allTables[i].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].innerText;
                    wage.replaceAll(/,/g, "");
                }
                i++;
            }
            //finding item output and item price in facility
            i = 0;
            while (output <= 0 && i < allTables.length){
                if (allTables[i].children.length == 2 && (allTables[i].children[0].children[0].innerText == "Type" || allTables[i].children[0].children[0].innerText == "Тип") && (allTables[i].children[0].children[1].innerText == "Output" || allTables[i].children[0].children[1].innerText == "Выход")){
                    output = allTables[i].children[1].children[1].innerText.replaceAll(/,/g, "");;
                    itemPrice = allTables[i].children[1].children[3].children[0].children[0].children[0].children[0].children[1].innerText.replaceAll(/,/g, "");;
                }
                i++;
            }
            //finding hours required for item production
            hoursRequired = foundTable.children[1].children[1].innerText;
            //calculating resource expenditure
            for (let i = 2; i < foundTable.children.length; i++){
                totalExpenditure += (parseFloat(foundTable.children[i].children[1].innerText) * parseFloat(foundTable.children[i].children[2].innerText));
            }
            //calculating worker's pay/wage expenditure
            totalExpenditure += wage * hoursRequired;
            //calculating cost price
            costPrice = totalExpenditure / output;
            //displaying cost price
            foundTable.innerHTML += '<tr class="wblight" align="center"><td class="wb" align="left"><b>&nbsp;' + (url.hostname.includes('lordswm.com') ? 'Cost price' : 'Себестоимость') + '</b></td><td colspan="2" class="wb" align="center">&nbsp;'+costPrice.toFixed(2)+'&nbsp;</td><td class="wb" align="left"><b>&nbsp;' + (url.hostname.includes('lordswm.com') ? 'Profit/item' : 'Прибыль/Ед') + '</b></td><td colspan="2" class="wb" align="center">&nbsp;'+(parseFloat(itemPrice) - costPrice.toFixed(2)).toFixed(2)+'&nbsp;</td></tr>';
        }
    }
})();