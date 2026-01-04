// ==UserScript==
// @name         CPT Chaser
// @namespace    http://tampermonkey.net/
// @version      1
// @description  CPT Chasing for operations
// @author       Hayden Lindsey
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/cpt
// @match        https://trans-logistics.amazon.com/sortcenter/tantei*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/450960/CPT%20Chaser.user.js
// @updateURL https://update.greasyfork.org/scripts/450960/CPT%20Chaser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.readyState != 'complete') {
        window.addEventListener('load', windowLoadedCallback);
    } else {
        windowLoadedCallback();
    }

    function windowLoadedCallback() {
        // console.log('windowLoadListener');
        const observer = new MutationObserver(elemChangeCallback);
        const obsConfig = { attributes: true, attributeFilter:["class"], attributeOldValue: true };
        const targetNode = document.getElementById('block-ui-container');
        observer.observe(targetNode, obsConfig);
        //addBulkSearchButton();
        // Set up mutation observer to watch when refresh dialog is shown & cleared
        function elemChangeCallback (mutationsList, observer) {
            makebuttons();
            for (let mutation of mutationsList) {
                if (mutation.target.classList.contains('hidden') && mutation.oldValue == '') {

                }
            }
        }
        fpnl();
        function fpnl()//first previous next last
        {
            setTimeout(function() {
                var firstbutton = document.getElementsByClassName("first ui-corner-tl ui-corner-bl prev fg-button ui-button ui-state-default");
                for(var i = 0; i < firstbutton.length; i++)
                {
                    if(firstbutton[i])
                    {
                        firstbutton[i].addEventListener("click", function() { makebuttons(350) });
                        // makebuttons();
                    }
                    else
                    {
                        console.log("not found");
                        fpnl();
                    }
                }
                var prevbutton = document.getElementsByClassName("previous prev fg-button ui-button ui-state-default");
                for(i = 0; i < prevbutton.length; i++)
                {
                    if(prevbutton[i])
                    {
                        prevbutton[i].addEventListener("click", function() { makebuttons(350) });
                        // makebuttons();
                    }
                    else
                    {
                        console.log("not found");
                        fpnl();
                    }
                }
                var pagesearch =document.querySelectorAll('[style*="width: 15px"]');
                for(i = 0; i < pagesearch.length; i++)
                {
                    if(pagesearch[i])
                    {
                        pagesearch[i].addEventListener("keyup", function() { makebuttons(350) });
                        // makebuttons();
                    }
                    else
                    {
                        console.log("not found");
                        fpnl();
                    }
                }
                var nextbutton = document.getElementsByClassName("next nxt fg-button ui-button ui-state-default");
                for(i = 0; i < nextbutton.length; i++)
                {
                    if(nextbutton[i])
                    {
                        nextbutton[i].addEventListener("click", function() { makebuttons(350) });
                        // makebuttons();
                    }
                    else
                    {
                        console.log("not found");
                        fpnl();
                    }
                }
                var lastbutton = document.getElementsByClassName("last ui-corner-tr ui-corner-br nxt fg-button ui-button ui-state-default");
                for(i = 0; i < lastbutton.length; i++)
                {
                    if(lastbutton[i])
                    {
                        lastbutton[i].addEventListener("click", function() { makebuttons(350) });
                        // makebuttons();
                    }
                    else
                    {
                        console.log("not found");
                        fpnl();
                    }
                }
            }, 1000);
        }
        function makecontainerlist()
        {
            // var divexists = document.getElementById("tsdiv");
            // var hr = document.getElementsByClassName("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all")[0];
            // if(!divexists)
            {
                // var tsdiv = document.createElement("div");
                // tsdiv.setAttribute("id", "tsdiv");
                // tsdiv.style.display = "inline-block";
                // hr.appendChild(tsdiv);
                // var tscontainersearch = document.createElement("textarea");
                // tscontainersearch.setAttribute("id", "containersearch");
                // tscontainersearch.setAttribute("readOnly", true);
                // tscontainersearch.style.background = "#CCCCCC";
                // tscontainersearch.style.position = "absolute";
                // tscontainersearch.style.height = "80px";
                // tscontainersearch.style.width = "170px";
                // tscontainersearch.style.left = "300px";
                // tscontainersearch.style.top = "39px";
                //tsdiv.appendChild(tscontainersearch);
            }
        }
        function makebuttons(timeout)
        {
            // setTimeout(function() {
            console.log("makebuttons");
            console.log("Timeout: ", timeout);
            //palletlist = [];
            var findtable = document.getElementById("cptsLoadInProgress").children[1].children;
            var t = document.getElementById("cptsLoadInProgress")
            if(t)
            {
                setTimeout(function() {
                    for(var i = 0; i < findtable.length; i++){
                        var findbutton = document.getElementById("btn" + i)
                        if(!findbutton)
                        {
                            let btn = document.createElement("button");
                            btn.id = "btn" + i;
                            findtable[i].appendChild(btn);
                            btn.innerHTML = "button" + [i];
                            btn.style.width = "auto";
                            btn.style.height = "auto";
                            btn.className = "DTTT_button ui-button ui-state-default";
                            btn.addEventListener("click", function() {findpallets(btn) });
                        }
                    }
                    for(var h = 0; h<findtable.length; h++)
                    {
                        var getlane = findtable[h].children[2];
                        var btn = document.getElementById("btn" + h);
                        var loaddetailshidden = document.getElementsByClassName("loadDetails hidden")[h];
                        btn.innerHTML = getlane.textContent.split(loaddetailshidden.textContent)[0];
                        // if(btn.innerHTML.includes("DDU"))
                        // {
                        //     btn.className = "";
                        //     btn.style.background = "#00FF00";
                        // }
                    }
                }, timeout);
                checkforzeroes();
            }
            else
            {
                makebuttons(1000);
            }
            // }, timeout);
        }
        // makebuttons();
        var vpw = false;
        function findpallets(elem)//when you click buttons
        {
            console.log("findpallets");
            // var insertcontainers = document.getElementById("containersearch");
            //insertcontainers.textContent = "";
            if(elem != "none")
            {
                //console.log("elem = ", elem);
                //insertcontainers = document.getElementById("containersearch");
                var containerizedpallet = elem.parentElement.children[13].children[0];//13 containerized / 18 staged
                containerizedpallet.click();
                checkvpw();
            }
            else
            {
                //console.log("not none: elem = ", elem);
                var today = new Date();
                //insertcontainers = document.getElementById("containersearch");
                var td = String(today.getDate()).padStart(2, '0');
                var tm = today.toLocaleString('default', { month: 'short' });//String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var ty = today.getFullYear().toString().slice(-2);
                var yesterday = new Date();
                var yd = String(today.getDate() -1).padStart(2, '0');
                var ym = yesterday.toLocaleString('default', {month: 'short'}).split(3);
                var yy = yesterday.getFullYear().toString().slice(-2);
                today = td + '-' + tm + '-' + ty;
                yesterday = yd + '-' + ym + '-' + yy;
                //console.log(yesterday)
                var packagestable = document.getElementById("tableCPT-InFacility").children[1].children;
                var plist = [];
                //undefined, containerid, type, count, time, location, location type
                setTimeout(function() {
                    for(var i = 0; i < packagestable.length; i++)
                    {
                        var containerid = packagestable[i].children[1];
                        var containertype = packagestable[i].children[2].textContent;
                        var count = packagestable[i].children[3].textContent;
                        var time = packagestable[i].children[4].textContent;
                        var loc = packagestable[i].children[5].textContent;
                        var locationtype = packagestable[i].children[6].textContent;
                        if(time.includes(today) || time.includes(yesterday))
                        {
                            if(!loc.includes("POD") && !loc.includes("YTN"))
                            {
                                if(!locationtype.includes("DOCK_DOOR") && !locationtype.includes("BUILDING"))
                                {
                                    for(var x=0; x<containerid.parentElement.children.length; x++)
                                    {
                                        containerid.parentElement.children[x].style.backgroundColor = "#FAF61B";
                                    }
                                    plist.push(containerid.textContent)
                                }
                            }
                        }
                    }
                    if(plist.length > 0)
                    {
                        for(let element = 0; element<plist.length; element++)
                        {
                            le(plist[element], element);
                        }
                        function le(element, number)
                        {
                            console.log("loopelement");
                            var newwin = window.open("https://trans-logistics.amazon.com/sortcenter/tantei?nodeId=BNA5&searchType=Container&searchId=" + element, "troubleshooter" + number);
                            newwin.onload = function()
                            {
                                setTimeout(function() {
                                    var et = newwin.document.getElementsByClassName("css-14dbfau")[1];
                                    et.click();
                                    newwin.document.title = element;
                                }, 400);
                            }
                        }
                    }
                    //var close = document.getElementsByClassName("ui-icon ui-icon-closethick")[0];
                    //close.click();
                }, 100);

            }
        }
        function checkvpw()
        {
            console.log("checkvpw");
            var vp = document.getElementsByClassName("message")[0].parentElement.parentElement.className;
            if(vp == "hidden")
            {
                vpw = true
                findpallets("none");
            }
            else
            {
                setTimeout(function() {
                    checkvpw();
                }, 2000);
            }
        }
        function checkforzeroes()
        {
            setTimeout(function() {
                var getp = document.getElementsByClassName("packageDetails");//finds package details tab
                var bulist = [];
                for(var rel = 6; rel<getp.length; rel+=12)
                {
                    bulist.push(getp[rel].textContent);
                }
                for(var bu = 0; bu<bulist.length; bu++)
                {
                    var btnn = document.getElementById("btn" + bu);
                    if(btnn.innerHTML.includes("DDU"))
                    {
                        btnn.className = "";
                        btnn.style.background = "#00FF00";
                        btnn.style.fontWeight = "bold";

                        if(bulist[bu] == "1")
                        {
                            btnn.style.background = "#FAF61B";
                        }
                    }
                    if(bulist[bu] == "0")
                    {
                        btnn.className = "";
                        btnn.hidden = true;
                        // btnn.style.background = "#FAF61B";
                    }
                }
            }, 400);
        }
        // Your code here...
    }
})();