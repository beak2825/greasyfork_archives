// ==UserScript==
// @name     Spec.Cost.Highlight.Object
// @version  1.4.11
// @grant    none
// @namespace http://tampermonkey.net/
// @license MIT
// @description Internal use only not alowed external use
// @match https://login.germandrawings.com/?page=taskEdit*
// @require https://greasyfork.org/scripts/461066-specialcust/code/SpecialCust.js
// @require https://greasyfork.org/scripts/461067-productioninfo/code/ProductionInfo.js
// @sandbox JavaScript
// @downloadURL https://update.greasyfork.org/scripts/460884/SpecCostHighlightObject.user.js
// @updateURL https://update.greasyfork.org/scripts/460884/SpecCostHighlightObject.meta.js
// ==/UserScript==


/*specialCostumers = { ...specialCostumers,
                    28401: {
                        manual: "https://www.google.com",
                        message:"Poraka za normalna naracka",
                        lageplan:{
                          manual:"https://www.yahoo.com",
                            message:"Porakata za lageplan"
                       }
                    }}
                    productionInfo = { ...productionInfo, 251842330: { manual: "https://www.yahoo.com", message:"Na ovaa naracka ne saka koti i iminja na sobi, bez razlika sto pisuva vo sistem" } };
*/
setInterval( function() {

    var planNumber = 0;
    var costumer = 0;
    var orderNumber =0;
    var isSpecial = false;
    var orderData = null;
    var productLageplan = false;



    if (document.getElementById("addonTable")===null){
    }else{
        productLageplan = document.getElementById("addonTable").innerText.includes("Lageplan");
    }

    console.log("Narackata e Lageplan= "+productLageplan);

    if(document.getElementsByClassName("mb-1")[0]===undefined){
        console.log("nema info so broj na klient na stranata sto ja gledas")
    }else{
        planNumber = document.getElementsByClassName("mb-1")[0].innerText;
        costumer = String(planNumber).slice(0,5);
        costumer = Number(costumer);
        orderNumber = String(planNumber).slice(0,9);
        orderNumber = Number(orderNumber);

        if (Number.isInteger(costumer)){
            isSpecial = specialCostumers[costumer]!==undefined;
            console.log('specijalec = '+isSpecial+' | brojot na klient e '+costumer);
            if (isSpecial){
                bannerSpecialCostumer();
            }
        }

        else {
            planNumber = document.getElementsByClassName("mb-1")[0].firstElementChild.innerText;
            costumer = String(planNumber).slice(0,5);
            costumer = Number(costumer);
            orderNumber = String(planNumber).slice(0,9);
            orderNumber = Number(orderNumber);
            isSpecial = specialCostumers[costumer]!==undefined;
            console.log('specijalec = '+isSpecial+' | brojot na klient e '+costumer);
            if (isSpecial){
                bannerSpecialCostumer();
            }
        }
    }

    function bannerSpecialCostumer(){

        let bannerText = "";
        let bannerLink = "";


        if(productLageplan){
            if(specialCostumers[costumer].lageplan === undefined){
                bannerText = specialCostumers[costumer].message;
                bannerLink = specialCostumers[costumer].manual;
            }else{
                bannerText = specialCostumers[costumer].lageplan.message;
                bannerLink = specialCostumers[costumer].lageplan.manual;
            }

        }else{
            bannerText = specialCostumers[costumer].message;
            bannerLink = specialCostumers[costumer].manual;

        }


        if(document.getElementsByClassName("p-3 specBanner")[0]===undefined){

            const divSpec = document.createElement("div");
            divSpec.setAttribute("class","col-12 mt-3");

            const linkElementSpec = document.createElement("a");
            linkElementSpec.setAttribute("href",bannerLink);
            linkElementSpec.setAttribute("target", "_blank");

            const textBannerSpec = document.createElement("h5");
            textBannerSpec.setAttribute("class","p-3 specBanner");
            textBannerSpec.innerHTML = costumer+" Specijalec: "+bannerText;
            textBannerSpec.setAttribute("style","background-color:tomato; color:white");
            linkElementSpec.appendChild(textBannerSpec);
            divSpec.appendChild(linkElementSpec);

            var currentChild = document.getElementsByClassName("col-12")[0];
            document.getElementsByClassName("col-12")[0].insertBefore(divSpec, currentChild.firstChild);
        }

        document.getElementsByClassName("mb-1")[0].style["background-color"] = 'tomato';
        document.getElementsByClassName("mb-1")[0].style["color"] = 'white';

    }

    if (productionInfo[orderNumber]!==undefined){
        console.log("Ima dopolnitelno info za "+orderNumber);
        if(document.getElementsByClassName("p-3 prodBanner")[0]===undefined){

            const divProd = document.createElement("div");
            divProd.setAttribute("class","col-12 mt-3");

            const linkElementProd = document.createElement("a");
            linkElementProd.setAttribute("href",productionInfo[orderNumber].manual);
            linkElementProd.setAttribute("target", "_blank");

            const textBannerProd = document.createElement("h5");
            textBannerProd.setAttribute("class","p-3 prodBanner");
            textBannerProd.innerHTML = orderNumber+" INFO: "+productionInfo[orderNumber].message;
            textBannerProd.setAttribute("style","background-color:DodgerBlue; color:white");
            linkElementProd.appendChild(textBannerProd);
            divProd.appendChild(linkElementProd);

            var currentChild = document.getElementsByClassName("col-12")[0];
            document.getElementsByClassName("col-12")[0].insertBefore(divProd, currentChild.firstChild);
        }
    }else{
        console.log("Nema dopolnitelno info za "+orderNumber);
    }

}, 2000);