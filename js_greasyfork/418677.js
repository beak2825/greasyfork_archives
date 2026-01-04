// ==UserScript==
// @name         Price Per battle
// @namespace    https://www.lordswm.com
// @version      0.8
// @description  Show Price per battle in market. If you encounter problem, contact me https://www.lordswm.com/pl_info.php?id=6997830
// @author       You
// @match        https://www.lordswm.com/auction.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418677/Price%20Per%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/418677/Price%20Per%20battle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const localStorageKey = "repairCostArtifacts";
    const localStorageRcKey = "repairCostRepairCost";
    const localStorageEfficiencyKey = "repairCostRepairEfficiency";
    const storage = window.localStorage;
    let existKey = storage.getItem(localStorageKey);
    let artToSaveCost;
    if(existKey === null){
        storage.setItem(localStorageKey,"{}")
    }
    existKey = storage.getItem(localStorageRcKey);
    if(existKey === null){
        storage.setItem(localStorageRcKey,101)
    }
    existKey = storage.getItem(localStorageEfficiencyKey);
    if(existKey === null){
        storage.setItem(localStorageEfficiencyKey,90)
    }

    document.querySelectorAll("tr.wb").forEach(x=>{
        try{
            let s = x.innerText;
            let index = s.search("Durability: ")+"Durability: ".length;
            let dur = parseInt(s.substr(index));
            let maxDur = parseInt(s.substr(index).split("/")[1])
            let splited = s.split('\n');
            /*index = 4;
            if (splited.indexOf("Buyout price:")!=-1){
                index=6;
            }
            if (splited.indexOf("	Buy now!	")!=-1){
                index=splited.indexOf("	Buy now!	")+1;
            }
*/

            let price = parseInt(x.children[2].innerText.replaceAll(',',''))
            if(isNaN(price/dur))
            {
                return;
            }
            //console.log(price/dur);
            let ele = document.createElement('p');
            ele.id = "ppb";
            ele.price = price;
            ele.dur = dur;
            ele.maxDur = maxDur;
            ele.innerText = "Price per battle = "+(price/dur).toFixed(2);
            ele.fatherWow = x;
            ele.cpb = (price/dur);
            x.children[0].appendChild(ele)
        }
        catch(err)
        {
            console.log(err);
        }
    })

    let url = new URL(document.URL);
    let artType = url.searchParams.get("art_type");
    if (artType !== null)
    {
        console.log("its art market, run prices")

        let selling = document.querySelector("td.wbwhite");
        let div = document.createElement("div");

        let i = document.createElement("input");
        //i.setAttribute("placeholder", "");
        let label = document.createElement("label");
        label.for = "repairCost";
        label.innerText = "Repair Cost  "
        i.id = "repairCost";
        i.size = "5"
        //i.value = 16000;
        let rc = getArtPrice(artType)
        if(rc!==undefined)
        {
            i.value = rc;

        }
        //this indicate we need to save repair cost when clicked on calc
        artToSaveCost = artType;

        div.appendChild(label)
        div.appendChild(i)


        i = document.createElement("input");
        i.id = "repairEfficiency";
        //i.setAttribute("placeholder", "Repair efficiency");
        i.value = storage.getItem(localStorageEfficiencyKey);
        i.size = "5"
        label = document.createElement("label");
        label.for = "repairEfficiency";
        label.innerText = "  Repair Efficiency %  "
        div.appendChild(label)
        div.appendChild(i)


        i = document.createElement("input");
        i.id = "bsRepairCost";
        //i.setAttribute("placeholder", "Repair cost");
        i.value = storage.getItem(localStorageRcKey);
        i.size = "5"
        label = document.createElement("label");
        label.for = "bsRepairCost";
        label.innerText = "  Smith cost %  "

        div.appendChild(label)
        div.appendChild(i)

        i = document.createElement("button");
        i.innerText = "Calculate with repairing";
        i.onclick=calcPriceAllArts;
        div.appendChild(i)
        selling.prepend(div)
        if(rc!==undefined){
            i.click();
        }
    }

    function sortByCpb(){
        Array.from(document.querySelectorAll("p#ppb")).sort((a,b)=>a.cpb<b.cpb?-1:1).forEach(x=>x.fatherWow.parentElement.appendChild(x.fatherWow));
    }

    function calcPriceAllArts()
    {
        let repairCost = parseInt(document.querySelector("input#repairCost").value);
        setArtPrice(artToSaveCost,repairCost);

        let repairEfficiency = parseInt(document.querySelector("input#repairEfficiency").value);
        storage.setItem(localStorageEfficiencyKey,repairEfficiency);

        let bsRepairCost = parseInt(document.querySelector("input#bsRepairCost").value);
        storage.setItem(localStorageRcKey,bsRepairCost);

        document.querySelectorAll("p#ppb").forEach(x=>{
            let calculated = calcPrice(x.dur,x.maxDur,x.price,repairCost,repairEfficiency,bsRepairCost);
            x.innerText=`Lowest PPB: ${calculated.cpb.toFixed(2)} after ${calculated.numberOfRepairs} repairs`
            x.cpb = calculated.cpb;

        })
        sortByCpb();
    }

    function calcPrice(dur,maxDur,auctionCost,artRepairCost,repairEfficiency,bsRepairCost){
        //calcPrice(60,70,16000,15555,90,101)example
        let maxDuration = maxDur;
        let cpb;
        let numberOfRepairs = -1;
        let totalDuration = dur;
        let totalCost = auctionCost;
        let previousCPB;
        let actualCPB;
        do{

            previousCPB= totalCost/totalDuration;
            numberOfRepairs++;
            cpb = previousCPB;
            totalDuration += Math.floor(maxDuration*repairEfficiency/100);
            totalCost += artRepairCost*bsRepairCost/100;
            maxDuration -= 1;
            console.log(maxDuration,totalDuration,totalCost);
            actualCPB = totalCost/totalDuration;
        }
        while(actualCPB<previousCPB);
        console.log(cpb,numberOfRepairs);
        return {cpb:cpb,numberOfRepairs:numberOfRepairs};
    }
    window.calcPrice = calcPrice;


    function getArtPrice(artName){
        let stringArts = storage.getItem(localStorageKey);
        let arts = JSON.parse(stringArts);
        return arts[artName];
    }

    function setArtPrice(artName, artPrice) {
        let stringArts = storage.getItem(localStorageKey);
        let arts = JSON.parse(stringArts);
        arts[artName] = artPrice;
        storage.setItem(localStorageKey,JSON.stringify(arts))
    }

})();