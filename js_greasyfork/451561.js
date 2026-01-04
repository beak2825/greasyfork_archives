// ==UserScript==
// @name         Horseshoe
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Horseshoe Helper
// @author       Hayden Lindsey 09/16/2022
// @match        https://trans-logistics.amazon.com/sortcenter/vista
// @match        https://trans-logistics.amazon.com/sortcenter/flowrate
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451561/Horseshoe.user.js
// @updateURL https://update.greasyfork.org/scripts/451561/Horseshoe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.readyState != 'complete') {
        window.addEventListener('load', windowLoadedCallback);
    } else {
        windowLoadedCallback();
    }

    function windowLoadedCallback() {
        console.log('windowLoadListener');
        const observer = new MutationObserver(elemChangeCallback);
        const obsConfig = { attributes: true, attributeFilter:["class"], attributeOldValue: true };
        const targetNode = document.getElementById('block-ui-container');
        observer.observe(targetNode, obsConfig);
        //addBulkSearchButton();
        // Set up mutation observer to watch when refresh dialog is shown & cleared
        function elemChangeCallback (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.target.classList.contains('hidden') && mutation.oldValue == '') {

                }
            }
        }
        ///////////ADD BUTTON/////////////
        var interval = setInterval(addelements, 500);
        var packageidlist = [];
        var routelist = [];
        var rowcountint = setInterval(findrowcount, 1000);
        function findrowcount()
        {
            // console.log("findrowcount");
            var rowcount = document.getElementsByClassName("select-wrap -pageSizeOptions")[0];
            if(rowcount)
            {
                clearInterval(rowcountint);
                // console.log("found rowcount");
                setNativeValue(rowcount.children[0], "100");
                setTimeout(function() {
                    var pastcpt = document.getElementById("past-cpt-check");
                    console.log(pastcpt.value);
                    var changehours = document.querySelectorAll('a[class="blue-link"]')[0];
                    changehours.click();
                    var hours = document.getElementById("hour-window-picker");
                    setNativeValue(hours, 10)
                    var btn = document.querySelectorAll('button[class="inline-btn primary-btn"]')[0];
                    btn.click();
                    var sfpb = document.getElementsByClassName("horizontal-tabs")[0];
                    sfpb.children[3].classList = "ui-state-default";
                    sfpb.children[4].classList = "";
                }, 500);
            }
        }
        function addelements()
        {
            console.log("addtextarea");
            var routefind = document.getElementById("sfpb");
            if(!routefind)
            {
                const placeelement = document.getElementsByClassName("horizontal-tabs")[0];
                if(placeelement)
                {
                    clearInterval(interval);
                    // console.log("found placeelement");
                    // console.log(placeelement);
                    var delay = (function(){
                        var timer = 0;
                        return function(callback, ms){
                            clearTimeout (timer);
                            timer = setTimeout(callback, ms);
                        };
                    })();
                    placeelement.style.width = "auto";
                    placeelement.style.height = "70px";
                    placeelement.style.margin = "0px 0px 0px 6px";
                    var findpackagesbutton = document.createElement("button");
                    findpackagesbutton.setAttribute("id", "sfpb");
                    findpackagesbutton.innerHTML = "Find Packages";
                    findpackagesbutton.addEventListener("click", getpackages);
                    findpackagesbutton.style.width="auto";
                    findpackagesbutton.style.height = "auto";
                    findpackagesbutton.classList += "ui-state-disabled";
                    findpackagesbutton.style.margin = "0px 6px 0px 6px";
                    placeelement.appendChild(findpackagesbutton);

                    var searchforpackages = document.createElement("textarea");
                    searchforpackages.setAttribute("id", "sfpta");
                    searchforpackages.style.height = "30px";
                    searchforpackages.style.width = "auto";
                    searchforpackages.style.margin = "0px 0px 0px 6px";
                    searchforpackages.classList += "ui-state-disabled";
                    searchforpackages.onkeyup = function() {
                        delay(function() {searchingforpackages(); searchforpackages.select() }, 500) };

                    var pldiv = document.createElement("div");
                    pldiv.setAttribute("id", "pldiv");
                    pldiv.style.display = "inline-block";
                    pldiv.style.margin = "0px 3px 0px 6px";
                    var packagelabel = document.createElement("label");
                    packagelabel.setAttribute("id", "packagelabel");
                    packagelabel.innerHTML = "Enter or scan package IDs in textbox";
                    packagelabel.style.fontSize = "15px";
                    packagelabel.style.position = "relative";

                    var rldiv = document.createElement("div");
                    rldiv.setAttribute("id", "rldiv");
                    rldiv.style.display = "inline-block";
                    var routelabel = document.createElement("label");
                    routelabel.setAttribute("id", "routelabel");
                    routelabel.innerHTML = "";
                    routelabel.style.fontSize = "15px";
                    routelabel.style.color = "#FF0000";
                    // routelabel.style.position = "relative";

                    placeelement.appendChild(searchforpackages);
                    insertAfter(placeelement, pldiv);
                    pldiv.appendChild(packagelabel);
                    insertAfter(pldiv, rldiv);
                    rldiv.appendChild(routelabel);
                }
                else
                {
                    console.log("did not find placeelement");
                }
            }
        }
        function setNativeValue(element, value) {
            let lastValue = element.value;
            element.value = value;
            let event = new Event("change", { target: element, bubbles: true });
            // React 15
            event.simulated = true;
            // React 16
            let tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(event);
        }
        function insertAfter(referenceNode, newNode) {
            // console.log("insertafter");
            // console.log("r: ", referenceNode);
            // console.log("n: ", newNode);
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        function searchingforpackages()
        {
            console.log("Searching...");
            var textarea = document.getElementById("sfpta");
            var plabel = document.getElementById("packagelabel");
            var rlabel = document.getElementById("routelabel");
            textarea.value = textarea.value.replace(" ", "");
            var tasplit = textarea.value.split(String.fromCharCode(10));
            var list = [];
            setTimeout(function() {
                for(var x =0; x<packageidlist.length; x++)
                {
                    for(var z = 0; z<tasplit.length; z++)
                    {
                        if(tasplit[z] != "" && packageidlist[x].includes(tasplit[z]))
                        {
                            list.push(packageidlist[x].split(" route")[0]);
                            routelist.push(packageidlist[x].split("route ")[1]);
                        }
                    }
                }
                plabel.innerHTML = "";
                rlabel.innerHTML = "";
                if(tasplit.length == 1 && tasplit[0] == "")
                {
                    plabel.innerHTML = "Enter or scan package IDs in textbox";
                }
                for(var y = 0; y<list.length; y++)
                {
                    plabel.innerHTML += list[y] + " route <br \>";
                    rlabel.innerHTML += routelist[y] + "<br \>";
                }
            },1000);
        }
        function getpackages()
        {
            console.log("getpackages");
            var rn = document.querySelectorAll('div[class="rt-td"]');
            var numtojumpby = document.querySelectorAll('div[class="rt-tr"]')[0].children.length;
            var number=1;
            findpackages(number);
            function findpackages(number)
            {
                if(number<=rn.length)
                {
                    console.log(number);
                    if(rn[number].textContent.includes("DDU"))
                    {
                        setTimeout(function(){
                            var pspackage = rn[number+(numtojumpby-3)].children[0].children[0];
                            pspackage.click();
                            // console.log(rn[6].textContent);
                            console.log(rn[number]);
                            // console.log(pspackage);
                            setTimeout(function(){
                                var packageids = document.querySelectorAll('a[class="tt-link"]');
                                if(packageids.length == 0)
                                {
                                    console.log(rn[number].textContent + " is empty");
                                    packageidlist.push("Route " + rn[number].textContent + " is empty");
                                }
                                for(var x=0; x<packageids.length; x++)
                                {
                                    console.log("S"+packageids[x].textContent + " is route " + rn[number].textContent);
                                    packageidlist.push("S"+packageids[x].textContent + " is route " + rn[number].textContent);
                                }
                                number+=numtojumpby;
                                findpackages(number);
                            }, 300);
                        },300);
                    }
                    else
                    {
                        number+=numtojumpby;
                        findpackages(number);
                    }
                }
                else if(number > rn.length)
                {
                    var backbutton = document.getElementsByClassName("slide-in-back ui-button")[0];
                    backbutton.click();
                    console.log(packageidlist);
                    console.log(routelist);
                }
            }
        }
    }
})();