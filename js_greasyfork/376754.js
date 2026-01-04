// ==UserScript==
// @name         EmpireImmoScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script for EmpireImmo
// @author       Askidox
// @match        http://monde3.empireimmo.com/*
// @include      http://monde3.empireimmo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376754/EmpireImmoScript.user.js
// @updateURL https://update.greasyfork.org/scripts/376754/EmpireImmoScript.meta.js
// ==/UserScript==

var ObjCostEmb = JSON.parse("{\"T2simplenonamnag\":{\"Cost\":21132,\"Time\":2,\"Next\":\"T2simplehabitable\"},\"T2simplehabitable\":{\"Cost\":30245,\"Time\":2,\"Next\":\"T2simplequip\"},\"T2simplequip\":{\"Cost\":58467,\"Time\":2,\"Next\":\"T2simpleluxueux\"},\"Resde6T2nonamnags\":{\"Cost\":318113,\"Time\":2,\"Next\":\"Resde6T2habitables\"},\"Resde6T2habitables\":{\"Cost\":255399,\"Time\":2,\"Next\":\"Resde6T2quips\"},\"Resde6T2quips\":{\"Cost\":755472,\"Time\":2,\"Next\":\"Resde6T2grandluxe\"},\"Res12T2nonamnags\":{\"Cost\":453255,\"Time\":3,\"Next\":\"Res12T2habitables\"},\"Res12T2habitables\":{\"Cost\":819879,\"Time\":3,\"Next\":\"Res12T2quips\"},\"Res12T2quips\":{\"Cost\":590357,\"Time\":3,\"Next\":\"Res12T2grandluxe\"},\"Res24T2nonamnags\":{\"Cost\":1571719,\"Time\":4,\"Next\":\"Res24T2habitables\"},\"Res24T2habitables\":{\"Cost\":726526,\"Time\":4,\"Next\":\"Res24T2quips\"},\"Res24T2quips\":{\"Cost\":978441,\"Time\":4,\"Next\":\"Res24T2grandluxe\"},\"Res48T2nonamnags\":{\"Cost\":1767851,\"Time\":6,\"Next\":\"Res48T2habitables\"},\"Res48T2habitables\":{\"Cost\":2843207,\"Time\":6,\"Next\":\"Res48T2quips\"},\"Res48T2quips\":{\"Cost\":5856417,\"Time\":6,\"Next\":\"Res48T2grandluxe\"},\"Chambreseulenonamnage\":{\"Cost\":21919,\"Time\":1,\"Next\":\"Chambreseulehabitable\"},\"Chambreseulehabitable\":{\"Cost\":31451,\"Time\":1,\"Next\":\"Chambreseulequipe\"},\"Chambreseulequipe\":{\"Cost\":46226,\"Time\":1,\"Next\":\"Chambreseuletoutconfort\"},\"Res6chambresvides\":{\"Cost\":66305,\"Time\":2,\"Next\":\"Res6chambreshabitables\"},\"Res6chambreshabitables\":{\"Cost\":49927,\"Time\":2,\"Next\":\"Res6chambresquipes\"},\"Res6chambresquipes\":{\"Cost\":139063,\"Time\":2,\"Next\":\"Res6chambrestoutconfort\"},\"Res12chambresvides\":{\"Cost\":75821,\"Time\":3,\"Next\":\"Res12chambreshabitables\"},\"Res12chambreshabitables\":{\"Cost\":179255,\"Time\":3,\"Next\":\"Res12chambresquipes\"},\"Res12chambresquipes\":{\"Cost\":139609,\"Time\":3,\"Next\":\"Res12chambrestoutconfort\"},\"Res24chambresvides\":{\"Cost\":326804,\"Time\":4,\"Next\":\"Res24chambreshabitables\"},\"Res24chambreshabitables\":{\"Cost\":350814,\"Time\":4,\"Next\":\"Res24chambresquipes\"},\"Res24chambresquipes\":{\"Cost\":485489,\"Time\":4,\"Next\":\"Res24chambrestoutconfort\"},\"Res48chambresvides\":{\"Cost\":728463,\"Time\":6,\"Next\":\"Res48chambreshabitables\"},\"Res48chambreshabitables\":{\"Cost\":1346335,\"Time\":6,\"Next\":\"Res48chambresquipes\"},\"Res48chambresquipes\":{\"Cost\":749493,\"Time\":6,\"Next\":\"Res48chambrestoutconfort\"},\"Petitcomplexersidentielnonamnag\":{\"Cost\":3303971,\"Time\":8,\"Next\":\"Petitcomplexersidentielhabitable\"},\"Petitcomplexersidentielhabitable\":{\"Cost\":3457239,\"Time\":8,\"Next\":\"Petitcomplexersidentieltoutconfort\"},\"Petitcomplexersidentieltoutconfort\":{\"Cost\":2774554,\"Time\":8,\"Next\":\"Petitcomplexersidentielluxueux\"},\"Complexersidentielmoyennonamnag\":{\"Cost\":4294349,\"Time\":10,\"Next\":\"Complexersidentielmoyenhabitable\"},\"Complexersidentielmoyenhabitable\":{\"Cost\":3943154,\"Time\":10,\"Next\":\"Complexersidentielmoyentoutconfort\"},\"Complexersidentielmoyentoutconfort\":{\"Cost\":4069757,\"Time\":10,\"Next\":\"Complexersidentielmoyenluxueux\"},\"Grandcomplexersidentielnonamnag\":{\"Cost\":5940612,\"Time\":15,\"Next\":\"Grandcomplexersidentielhabitable\"},\"Grandcomplexersidentielhabitable\":{\"Cost\":7967154,\"Time\":15,\"Next\":\"Grandcomplexersidentieltoutconfort\"},\"Grandcomplexersidentieltoutconfort\":{\"Cost\":7520908,\"Time\":15,\"Next\":\"Grandcomplexersidentielluxueux\"},\"Complexersidentielgantnonamnag\":{\"Cost\":14466800,\"Time\":13,\"Next\":\"Complexersidentielganthabitable\"},\"Complexersidentielganthabitable\":{\"Cost\":14957977,\"Time\":13,\"Next\":\"Complexersidentielganttoutconfort\"},\"Complexersidentielganttoutconfort\":{\"Cost\":21201962,\"Time\":13,\"Next\":\"Complexersidentielgantluxueux\"},\"Doublecomplexersidentielgantnonamnag\":{\"Cost\":9768608,\"Time\":25,\"Next\":\"Doublecomplexersidentielganthabitable\"},\"Doublecomplexersidentielganthabitable\":{\"Cost\":11891569,\"Time\":25,\"Next\":\"Doublecomplexersidentielganttoutconfort\"},\"Doublecomplexersidentielganttoutconfort\":{\"Cost\":13593245,\"Time\":25,\"Next\":\"Doublecomplexersidentielgantluxueux\"},\"Triplecomplexersidentielgantnonamnag\":{\"Cost\":14201778,\"Time\":40,\"Next\":\"Triplecomplexersidentielganthabitable\"},\"Triplecomplexersidentielganthabitable\":{\"Cost\":24293689,\"Time\":40,\"Next\":\"Triplecomplexersidentielganttoutconfort\"},\"Triplecomplexersidentielganttoutconfort\":{\"Cost\":18035715,\"Time\":40,\"Next\":\"Triplecomplexersidentielgantluxueux\"},\"Quadruplecomplexersidentielgantnonamnag\":{\"Cost\":19468927,\"Time\":45,\"Next\":\"Quadruplecomplexersidentielganthabitable\"},\"Quadruplecomplexersidentielganthabitable\":{\"Cost\":19477548,\"Time\":45,\"Next\":\"Quadruplecomplexersidentielganttoutconfort\"},\"Quadruplecomplexersidentielganttoutconfort\":{\"Cost\":43676179,\"Time\":45,\"Next\":\"Quadruplecomplexersidentielgantluxueux\"},\"Complexersidentielmilleniumnonamnag\":{\"Cost\":3904280622,\"Time\":64,\"Next\":\"Complexersidentielmilleniumhabitable\"},\"Complexersidentielmilleniumhabitable\":{\"Cost\":5058253255,\"Time\":64,\"Next\":\"Complexersidentielmilleniumtoutconfort\"},\"Complexersidentielmilleniumtoutconfort\":{\"Cost\":6552039291,\"Time\":64,\"Next\":\"Complexersidentielmilleniumluxueux\"},\"Complexersidentieltitaniumnonamnag\":{\"Cost\":347813957609,\"Time\":64,\"Next\":\"Complexersidentieltitaniumhabitable\"},\"Complexersidentieltitaniumhabitable\":{\"Cost\":479410534782,\"Time\":64,\"Next\":\"Complexersidentieltitaniumtoutconfort\"},\"Complexersidentieltitaniumtoutconfort\":{\"Cost\":675593099843,\"Time\":64,\"Next\":\"Complexersidentieltitaniumluxueux\"},\"Petitemaisonabandonne\":{\"Cost\":73670,\"Time\":2,\"Next\":\"Petitemaisonhabitable\"},\"Petitemaisonhabitable\":{\"Cost\":46333,\"Time\":2,\"Next\":\"Petitemaisonquipe\"},\"Petitemaisonquipe\":{\"Cost\":204889,\"Time\":2,\"Next\":\"Petitemaisonluxueuse\"},\"Maisonmoyenneabandonne\":{\"Cost\":23072,\"Time\":2,\"Next\":\"Maisonmoyennehabitable\"},\"Maisonmoyennehabitable\":{\"Cost\":36954,\"Time\":2,\"Next\":\"Maisonmoyennequipe\"},\"Maisonmoyennequipe\":{\"Cost\":294075,\"Time\":2,\"Next\":\"Maisonmoyenneluxueuse\"},\"Grandemaisonabandonne\":{\"Cost\":55858,\"Time\":2,\"Next\":\"Grandemaisonhabitable\"},\"Grandemaisonhabitable\":{\"Cost\":198280,\"Time\":2,\"Next\":\"Grandemaisonquipe\"},\"Grandemaisonquipe\":{\"Cost\":366185,\"Time\":2,\"Next\":\"Grandemaisonluxueuse\"}}");


(function() {
    if (document.URL.indexOf("agency/agency.php") != -1){
        //Location
        var buttonLocation = document.createElement("input");
        buttonLocation.type = "button";
        buttonLocation.value = "TdR Location";
        buttonLocation.style.marginLeft = "20px";
        buttonLocation.addEventListener("click", AffRentaLocation);

        document.querySelector(".EIPageTitleLabel").appendChild(buttonLocation);

        //AEV
        var buttonAEV = document.createElement("input");
        buttonAEV.type = "button";
        buttonAEV.value = "TdR AEV";
        buttonAEV.style.marginLeft = "20px";
        buttonAEV.addEventListener("click", AffRentaAEV);

        document.querySelector(".EIPageTitleLabel").appendChild(buttonAEV);

    }
})();


function AffRentaLocation(e){
    var bestRenta = {tr: undefined, TdR: 0, Prix: 0};
    var tbl = document.getElementById("EITableBuildings");
    if (tbl != null){
        var tableTR = tbl.querySelectorAll("tbody tr");
        tableTR.forEach(function(trElt){
            var TdR = Math.round(( ( GetNbByTR(trElt, 2) - GetNbByTR(trElt, 3) - GetNbByTR(trElt, 4)) / GetNbByTR(trElt, 1) )*10000)/100;
            trElt.children[1].textContent += " | "+TdR+"% ";
            if (bestRenta.TdR < TdR || bestRenta.TdR === TdR && bestRenta.Prix > GetNbByTR(trElt, 1)){
                bestRenta.tr = trElt;
                bestRenta.TdR = TdR;
                bestRenta.Prix = GetNbByTR(trElt, 1);
            }
        })

        tbl.querySelector("thead tr").children[1].textContent += " | TdR Location";
    }

    bestRenta.tr.style.backgroundColor = "#009933";

}

function AffRentaAEV(e){
    var ObjCostActu = GetCostActu();

    var bestRenta = {tr: undefined, TdR: 0, Prix: 0};
    var tbl = document.getElementById("EITableBuildings");
    if (tbl != null){
        var tableTR = tbl.querySelectorAll("tbody tr");
        tableTR.forEach(function(trElt){
            var ObjEmb = ObjCostEmb[GetNameID(trElt, 0)];
            if (ObjEmb != undefined && ObjCostActu[ObjEmb.Next] != undefined){
                var prixAchat = GetNbByTR(trElt, 1);
                var prixVente = ObjCostActu[ObjEmb.Next].Prix * 0.85;
                var coutEmb = ObjEmb.Cost;
                var totalCout = prixAchat + coutEmb + 1000 + (GetNbByTR(trElt, 3) + GetNbByTR(trElt, 4))*ObjEmb.Time;
                var Benef = prixVente - totalCout;
                var TdR = Math.round((Benef/totalCout)*10000/ObjEmb.Time)/100;
                if (Benef > 0){
                    trElt.children[1].textContent += " | "+(Math.round(Benef*100)/100)+" | "+TdR+" ";
                    /*if (bestRenta.TdR < TdR || bestRenta.TdR === TdR && bestRenta.Prix > GetNbByTR(trElt, 1)){
                    bestRenta.tr = trElt;
                    bestRenta.TdR = TdR;
                    bestRenta.Prix = GetNbByTR(trElt, 1);
                }*/
                }
            }


            /*
                var TdR = Math.round(( ( GetNbByTR(trElt, 2) - GetNbByTR(trElt, 3) - GetNbByTR(trElt, 4)) / GetNbByTR(trElt, 1) )*10000)/100;
                trElt.children[1].textContent += " | "+TdR+"% ";
                if (bestRenta.TdR < TdR || bestRenta.TdR === TdR && bestRenta.Prix > GetNbByTR(trElt, 1)){
                    bestRenta.tr = trElt;
                    bestRenta.TdR = TdR;
                    bestRenta.Prix = GetNbByTR(trElt, 1);
                }*/
        })

        tbl.querySelector("thead tr").children[1].textContent += " | Benef AEV | TdR AEV";
    }

    bestRenta.tr.style.backgroundColor = "#009933";

}

function GetCostActu (){
    var ObjRtn = new Object();
    var tbl = document.getElementById("EITableBuildings");

    if (tbl != null){
        var tableTR = tbl.querySelectorAll("tbody tr");
        tableTR.forEach(function(trElt){
            ObjRtn[GetNameID(trElt, 0)] = {
                Prix: GetNbByTR(trElt, 1)
            };
        })
    }
    return ObjRtn;
}

function GetNbByTR (trElt, nb){
    return GetNb(trElt.children[nb]);
}
function GetNb(elt){
    return parseInt(elt.textContent.replace(/\D/g, ""));
}
function GetNameID(trElt, nb){
    return trElt.children[nb].textContent.replace(/\s?[éàùè]?-?\.*/g, "");
}

/*function _(tbl){
    var tableTR = tbl.querySelectorAll("tbody tr");
    var ObjRtn = new Object();
    for (var i = 1; i < tableTR.length; i++){
        var trElt = tableTR[i];
        if (trElt.children.length === 7 && trElt.children[5].textContent != "-" && trElt.children[6].textContent != "-"){
            ObjRtn[GetNameID(trElt, 1)] = {
                Cost: GetNbByTR(trElt, 5),
                Time: GetNbByTR(trElt, 6),
                Next: GetNameID(tableTR[i+1], 1)
            };
        }
    }
    return ObjRtn;
}*/
