// ==UserScript==
// @name         New Horseshoe
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  New Horseshoe for bna5
// @author       Hayden Lindsey
// @match        http://sortcenter-menu-na.amazon.com/audit/containerInfo
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453478/New%20Horseshoe.user.js
// @updateURL https://update.greasyfork.org/scripts/453478/New%20Horseshoe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var peint = setInterval(placeElements, 1000);
    function placeElements()
    {
        var newdivexists = document.getElementById("weekdaysundaydiv");
        if(!newdivexists)
        {
            var putelements = document.getElementById("parentInfo");
            var sdinput = document.getElementById("sd_input");
            var newdiv = document.createElement("div");
            newdiv.id = "newdiv1";
            newdiv.className = "parentInfoTile";
            newdiv.style.marginLeft = Number(putelements.offsetWidth) / 2.5 + "px";
            var newlabel = document.createElement("div");
            newlabel.id = "newlabeldiv1";
            newlabel.className = "tile_label";
            newlabel.textContent = "Route";
            newlabel.style.fontSize = "25px";
            var newvalue = document.createElement("div");//route number
            newvalue.id = "routenum";
            newvalue.className = "tile_value";
            newvalue.textContent = "Routexxxx";
            newvalue.style.fontSize = "25px";
            newvalue.style.fontWeight = "bold";
            newvalue.style.color = "#A020F0";
            // newvalue.style.backgroundColor = "#FC2E20";
            var newclears = document.createElement("div");
            newclears.className = "clears";

            putelements.appendChild(newdiv);
            newdiv.appendChild(newlabel);
            newdiv.appendChild(newvalue);
            // console.log(putelements);
            newdiv.appendChild(newclears);

            var wsdiv = document.createElement("div");
            wsdiv.id = "weekdaysundaydiv";
            wsdiv.className = "pit_2";
            wsdiv.style.marginLeft = Number(putelements.offsetWidth) / 2.5 + "px";
            var wslabel = document.createElement("label");
            wslabel.id = "wslabel";
            wslabel.innerHTML = "Weekday";
            wslabel.style.fontSize = "25px";
            var wsbutton = document.createElement("button");
            wsbutton.style.margin = "0px 6px 0px 6px";
            wsbutton.innerHTML = "Switch";
            wsbutton.style.fontSize = "25px";
            wsbutton.id = "wsbutton";
            wsbutton.addEventListener("click", switchws);
            // insertAfter(sdmessage, wsbutton);
            putelements.appendChild(wsdiv);
            wsdiv.appendChild(wslabel);
            wsdiv.appendChild(wsbutton);
            getRoute(false);
        }
    }
    function getRoute(isSunday)
    {
        var nextpage = document.getElementById("td_next");
        var prevpage = document.getElementById("td_prev");
        var getzip = document.getElementById("piv_2")
        var rn = document.getElementById("routenum");
        var wsl = document.getElementById("wslabel");
        var wsb = document.getElementById("wsbutton");
        var nld = document.getElementById("newlabeldiv1");
        if(prevpage.hasAttribute("disabled"))
        {
            nextpage.click();
        }
        if(getzip)
        {
            wsl.classList.remove("hidden");
            wsb.classList.remove("hidden");
            nld.classList.remove("hidden");
            getzip = document.getElementById("piv_2").textContent.replace(/\D/g, '');
            if(isSunday === false)//weekday
            {
                // console.log(getzip);
                if(WEEKDAYZIP.has(getzip))
                {
                    var weekdayroutenum = WEEKDAYZIP.get(getzip);
                    rn.textContent = weekdayroutenum;
                }
                else
                {
                    rn.textContent = "Not found";
                }
            }
            else if(isSunday === true)//sunday
            {
                if(SUNDAYZIP.has(getzip))
                {
                    var sundayroutenum = SUNDAYZIP.get(getzip);
                    rn.textContent = sundayroutenum;
                }
                else
                {
                    rn.textContent = "Not found";
                }
            }
        }
        else
        {
            rn.textContent = "Not found";
            wsl.className += "hidden";
            wsb.className += "hidden";
            nld.className += " hidden";
        }
    }
    function switchws()
    {
        var isweekday = document.getElementById("wslabel");
        if(isweekday.textContent == "Weekday")
        {
            isweekday.textContent = "Sunday";
            getRoute(true);
        }
        else
        {
            isweekday.textContent = "Weekday";
            getRoute(false);
        }

    }
    function insertAfter(referenceNode, newNode)
    {
        // console.log("insertafter");
        // console.log("r: ", referenceNode);
        // console.log(newNode);
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    // Your code here...
    var WEEKDAYZIP = new Map([
        ['37212','2205'],
        ['37212','2205'],
        ['37010','1503'],
        ['37011','2102'],
        ['37013','2102'],
        ['37201','2402'],
        ['37219','2402'],
        ['37238','2402'],
        ['37014','2402'],
        ['37046','2402'],
        ['37015','2106'],
        ['37035','2106'],
        ['42206','1201'],
        ['38544','1206'],
        ['37205','2302'],
        ['37221','2101'],
        ['42025','1401'],
        ['42082','1401'],
        ['37022','1201'],
        ['38221','1203'],
        ['42027','1304'],
        ['47601','1103'],
        ['47637','1103'],
        ['42101','1101'],
        ['42102','1101'],
        ['42103','1101'],
        ['42104','1101'],
        ['42122','1101'],
        ['42274','1101'],
        ['37024','2201'],
        ['37027','2201'],
        ['42211','1502'],
        ['42029','1502'],
        ['38320','1203'],
        ['37030','1404'],
        ['42127','2202'],
        ['42160','2202'],
        ['37032','2305'],
        ['47610','1103'],
        ['37203','1406'],
        ['37232','1406'],
        ['37234','1406'],
        ['37235','1406'],
        ['37240','1406'],
        ['37243','1406'],
        ['37127','2306'],
        ['37130','2306'],
        ['37132','2306'],
        ['37133','2306'],
        ['37040','1204'],
        ['37043','1204'],
        ['37044','1204'],
        ['42404','1104'],
        ['42715','1302'],
        ['42728','1302'],
        ['42753','1302'],
        ['38501','1403'],
        ['38502','1403'],
        ['38503','1403'],
        ['38505','1403'],
        ['38506','1403'],
        ['37047','2401'],
        ['38451','2401'],
        ['37052','2304'],
        ['42408','1104'],
        ['37029','2103'],
        ['37036','2103'],
        ['37055','2103'],
        ['37056','2103'],
        ['37214','2205'],
        ['37058','1504'],
        ['37206','2304'],
        ['37213','2304'],
        ['42038','1401'],
        ['42055','1401'],
        ['42129','1302'],
        ['42220','1102'],
        ['37061','2304'],
        ['37178','2304'],
        ['37062','2206'],
        ['37334','1306'],
        ['42223','2304'],
        ['37064','2203'],
        ['37065','2203'],
        ['37067','2203'],
        ['37068','2203'],
        ['37069','2203'],
        ['42134','1201'],
        ['42135','1201'],
        ['38562','1206'],
        ['37048','2104'],
        ['37066','2104'],
        ['42044','1301'],
        ['42045','1301'],
        ['42123','1303'],
        ['42131','1303'],
        ['42141','1303'],
        ['42142','1303'],
        ['42156','1303'],
        ['37217','2402'],
        ['37070','2105'],
        ['37072','2105'],
        ['37073','2105'],
        ['38563','1404'],
        ['37215','1503'],
        ['42743','1303'],
        ['42345','1103'],
        ['40111','1101'],
        ['40143','1101'],
        ['42347','1402'],
        ['37074','2105'],
        ['42348','1101'],
        ['42406','1202'],
        ['42420','1202'],
        ['37075','2106'],
        ['37077','2106'],
        ['37076','2301'],
        ['38462','2101'],
        ['42232','1103'],
        ['42236','1103'],
        ['42240','1103'],
        ['42241','1103'],
        ['42254','1103'],
        ['42266','1103'],
        ['42749','2202'],
        ['38556','1205'],
        ['37216','2206'],
        ['37080','2201'],
        ['42053','1502'],
        ['37082','2206'],
        ['37086','2301'],
        ['37083','1205'],
        ['37085','2303'],
        ['37118','2303'],
        ['38464','1406'],
        ['37090','2302'],
        ['42754','1402'],
        ['37091','2401'],
        ['42351','1105'],
        ['37096','2103'],
        ['38570','1205'],
        ['37097','2101'],
        ['37025','2206'],
        ['37098','2206'],
        ['38472','2401'],
        ['37115','2305'],
        ['37116','2305'],
        ['37189','2305'],
        ['42413','1104'],
        ['42431','1104'],
        ['37349','1306'],
        ['37355','1306'],
        ['42066','1304'],
        ['37101','1504'],
        ['37110','1404'],
        ['37111','1404'],
        ['37204','2205'],
        ['37220','2205'],
        ['37208','2402'],
        ['37218','2402'],
        ['37228','2402'],
        ['38574','1405'],
        ['42437','1202'],
        ['42261','1105'],
        ['37121','2204'],
        ['37122','2204'],
        ['42765','2202'],
        ['37128','1505'],
        ['37129','1505'],
        ['42020','1304'],
        ['42071','1304'],
        ['37134','1504'],
        ['47630','1202'],
        ['37135','2306'],
        ['37207','2305'],
        ['42262','1204'],
        ['37138','1506'],
        ['42301','1305'],
        ['42303','1305'],
        ['42001','1301'],
        ['42003','1301'],
        ['38242','1203'],
        ['42366','1105'],
        ['37145','2105'],
        ['37146','2201'],
        ['37148','1501'],
        ['42445','1401'],
        ['37150','1405'],
        ['37042','1102'],
        ['37191','1102'],
        ['47615','1105'],
        ['47635','1105'],
        ['42202','1105'],
        ['42276','1105'],
        ['42164','1201'],
        ['42452','1305'],
        ['42171','2202'],
        ['37166','1206'],
        ['37167','2303'],
        ['37210','2104'],
        ['37224','2104'],
        ['37087','1501'],
        ['38583','1405'],
        ['37172','2201'],
        ['38256','1203'],
        ['42459','1104'],
        ['42167','2105'],
        ['42784','1402'],
        ['42376','1305'],
        ['37012','2303'],
        ['37184','2303'],
        ['37185','1504'],
        ['37209','1503'],
        ['42086','1502'],
        ['37186','1201'],
        ['37187','2302'],
        ['37188','2102'],
        ['37211','1506'],
        ['37222','1506'],

    ]);
    var SUNDAYZIP = new Map([
        ['37013','920'],
        ['37135','920'],
        ['37015','923'],
        ['37205','919'],
        ['37209','919'],
        ['37215','919'],
        ['37221','919'],
        ['42025','911'],
        ['42029','911'],
        ['42082','911'],
        ['42101','912'],
        ['42103','912'],
        ['42104','912'],
        ['42122','912'],
        ['42171','912'],
        ['42274','912'],
        ['42211','901'],
        ['42743','906'],
        ['37201','922'],
        ['37203','922'],
        ['37206','922'],
        ['37207','922'],
        ['37212','922'],
        ['37213','922'],
        ['37216','922'],
        ['37219','922'],
        ['37234','922'],
        ['37235','922'],
        ['37240','922'],
        ['37040','915'],
        ['37042','915'],
        ['37043','915'],
        ['42715','905'],
        ['42728','905'],
        ['42753','905'],
        ['38501','924'],
        ['38506','924'],
        ['38570','924'],
        ['38574','924'],
        ['38583','924'],
        ['37029','913'],
        ['37036','913'],
        ['37055','913'],
        ['37062','913'],
        ['37334','917'],
        ['37014','926'],
        ['37027','926'],
        ['37046','926'],
        ['37064','926'],
        ['37067','926'],
        ['37069','926'],
        ['42134','905'],
        ['42135','905'],
        ['37048','916'],
        ['37066','916'],
        ['37074','916'],
        ['37148','916'],
        ['42127','906'],
        ['42129','906'],
        ['42141','906'],
        ['42167','906'],
        ['42749','906'],
        ['42765','906'],
        ['37072','921'],
        ['37073','921'],
        ['37080','921'],
        ['37115','921'],
        ['37188','921'],
        ['37189','921'],
        ['42345','909'],
        ['42406','907'],
        ['42420','907'],
        ['37075','927'],
        ['37076','928'],
        ['37138','928'],
        ['42223','923'],
        ['42236','923'],
        ['42240','923'],
        ['42266','923'],
        ['37086','929'],
        ['37167','929'],
        ['38464','910'],
        ['42754','908'],
        ['37091','910'],
        ['42413','908'],
        ['42431','908'],
        ['37355','917'],
        ['42066','901'],
        ['37110','914'],
        ['37087','930'],
        ['37090','930'],
        ['37122','930'],
        ['37127','918'],
        ['37128','918'],
        ['37129','918'],
        ['37130','918'],
        ['42020','902'],
        ['42071','902'],
        ['47601','907'],
        ['47610','907'],
        ['47630','907'],
        ['47635','907'],
        ['42301','909'],
        ['42303','909'],
        ['42001','903'],
        ['42003','903'],
        ['42053','904'],
        ['42202','902'],
        ['42206','902'],
        ['42220','902'],
        ['42276','902'],
        ['42164','905'],
        ['37010','913'],
        ['37172','913'],
        ['37204','925'],
        ['37210','925'],
        ['37211','925'],
        ['37214','925'],
        ['37217','925'],
        ['37220','925'],
    ]);
})();