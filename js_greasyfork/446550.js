// ==UserScript==
// @name         FMC Route Cloning
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Amazon Logistics Route Cloning
// @author       Hayden Lindsey
// @match        https://trans-logistics.amazon.com/fmc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/446550/FMC%20Route%20Cloning.user.js
// @updateURL https://update.greasyfork.org/scripts/446550/FMC%20Route%20Cloning.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function asyncCall() {
        console.log(1);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec
        console.log(2);
        // expected output: "resolved"
    }
    var types = ['shipperAccount','freightType','createReason','carrier','equipmentType','driverType',
                 'currency','operatorType','rateType','loadType','stopNode','unloadType'];
    var bora = document.getElementsByClassName("a-section header-rightpanel")[0].children[2].textContent
    if(bora == " - BNA5")
    {
        var sta = document.createElement("button");
        //sta.classList = "a-button-input";
        var placeSta = document.getElementById("execution-tab");
        sta.innerHTML = "Switch to Amazon";
        sta.id = "sta";
        placeSta.appendChild(sta);
        document.getElementById('sta').addEventListener('click', switchtoamazon, true);
    }
    else
    {
        var staa = document.createElement("button");
        var placeStaa = document.getElementById("execution-tab");
        staa.innerHTML = "Switch to BNA5";
        staa.id = "sta";
        placeStaa.appendChild(staa);
        document.getElementById('sta').addEventListener('click', switchtoamazon, true);

        var placeElements = document.getElementsByClassName("a-tabs a-declarative fmc_dashboard_tabs")[0];
        var cloneButton = document.createElement("button");
        cloneButton.innerHTML = "CLONE";
        cloneButton.id = "clone";
        placeElements.appendChild(cloneButton);
        document.getElementById('clone').addEventListener('click', openClone, true);

        var bnatime = document.createElement("input");
        bnatime.id = "bna5time";
        bnatime.style.width = "60px";
        placeElements.appendChild(bnatime);
        var btlabel = document.createElement("label");
        btlabel.innerHTML = "BNA5 Time";
        btlabel.style.position = "absolute";
        btlabel.style.left = bnatime.getBoundingClientRect().left + "px";
        placeElements.appendChild(btlabel);
    }

    function openClone()
    {
        console.log(bnatime.getBoundingClientRect);

        var ddmc = document.getElementsByClassName("dropdown mini");
        var ddm = document.getElementById(ddmc[0].children[0].id);
        ddm.click();
        var ddmenu = document.getElementsByClassName("dropdown-menu ")[2];
        ddmenu.children[0].click();
        clickSelection("select2-selection select2-selection--single");
    }

    function switchtoamazon()
    {
        var gear = document.getElementsByClassName("a-section gearWrapper");
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent("mouseover", true, true);
        gear[0].dispatchEvent(clickEvent);
        var accountname = document.getElementById("activeAccountName");
        accountname.click();
        var accountAmazon = document.getElementsByClassName("a-size-base")[0];
        accountAmazon.click();
        var switchacc = document.getElementById("switchAccount");
        switchacc.click();
    }
    async function clickSelection(searchSelection)
    {
        await new Promise(resolve => setTimeout(resolve, 1000));
        var rsb = document.getElementsByClassName("clickable-text remove-stop-button");
        var asb = document.getElementById("addStopButton");
        while(rsb.length != 2)
        {
            rsb[2].click();
        }
        asb.click();
        rsb[1].click();
        asb.click();
        var clickEvent = document.createEvent('MouseEvents');
        var searchResults = document.getElementsByClassName("select2-results__options");
        var tbResults = document.getElementsByClassName("select2-search__field");
        var x = document.getElementsByClassName(searchSelection);
        for(var i = 0; i < x.length; i ++)
        {
            //Shipper Account
            if(x[i].innerHTML.includes("shipperAccount"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var sa = 0; sa < searchResults[0].children.length; sa++)
                {
                    if(searchResults[0].children[sa].textContent.includes("OutboundDDU"))
                    {
                        searchResults[0].children[sa].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("freightType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var ft = 0; ft < searchResults[0].children.length; ft++)
                {
                    if(searchResults[0].children[ft].textContent.includes("truckload"))
                    {
                        searchResults[0].children[ft].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("createReason"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var cr = 0; cr < searchResults[0].children.length; cr++)
                {
                    if(searchResults[0].children[cr].textContent.includes("High volume"))
                    {
                        searchResults[0].children[cr].click();
                    }
                }
                searchResults[0].children[19].dispatchEvent(clickEvent);
            }
            if(x[i].innerHTML.includes("carrier"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                tbResults[4].value = "AZNG";
                tbResults[4].dispatchEvent(new Event("input"))
                await new Promise(resolve => setTimeout(resolve, 1000)); // 3 sec
                clickEvent.initEvent("mouseup", true, true);
                searchResults[0].children[0].dispatchEvent(clickEvent);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if(x[i].innerHTML.includes("equipmentType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var et = 0; et < searchResults[0].children.length; et++)
                {
                    if(searchResults[0].children[et].textContent.includes("TWENTY_SIX_FOOT_BOX_TRUCK"))
                    {
                        searchResults[0].children[et].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("driverType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var dt = 0; dt < searchResults[0].children.length; dt++)
                {
                    if(searchResults[0].children[dt].textContent.includes("Solo1"))
                    {
                        searchResults[0].children[dt].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("currency"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                searchResults[0].children[0].dispatchEvent(clickEvent);
            }
            if(x[i].innerHTML.includes("operatorType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var ot = 0; ot < searchResults[0].children.length; ot++)
                {
                    if(searchResults[0].children[ot].textContent.includes("Solo1"))
                    {
                        searchResults[0].children[ot].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("rateType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                for(var rt = 0; ot < searchResults[0].children.length; ot++)
                {
                    if(searchResults[0].children[ot].textContent.includes("PER_LOAD"))
                    {
                        searchResults[0].children[ot].click();
                    }
                }
            }
            if(x[i].innerHTML.includes("unloadType"))
            {
                clickEvent.initEvent("mousedown", true, true);
                x[i].dispatchEvent(clickEvent);
                clickEvent.initEvent("mouseup", true, true);
                searchResults[0].children[0].dispatchEvent(clickEvent);
            }
        }//end of for loop

        var arrivalTime = document.getElementsByName("arrivalTime")[0];
        var findarrivaltime = document.getElementById("bna5time");
        console.log(findarrivaltime);
        arrivalTime.value = arrivalTime.value.split(" ")[0] + " " + findarrivaltime.value;
        var departureTime = document.getElementsByName("departureTime")[0];
        console.log(Date(findarrivaltime.value));
        // departureTime.value = departureTime.value.split(" ")[0] + " " +
    }

})();