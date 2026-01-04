// ==UserScript==
// @name         Hide NCSLs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides NCSLs for less clutter
// @author       Hayden Lindsey
// @match        https://trans-logistics.amazon.com/ssp/dock/hrz/ob
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453525/Hide%20NCSLs.user.js
// @updateURL https://update.greasyfork.org/scripts/453525/Hide%20NCSLs.meta.js
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
        //const obsConfig = { childList: true};
        //const targetNode = document.getElementsByClassName('notification-list dropdown-menu')[0];//find a list
        const obsConfig = { attributes: true, attributeFilter:["class"], attributeOldValue: true };
        const targetNode = document.getElementById('block-ui-container');
        observer.observe(targetNode, obsConfig);
        // Set up mutation observer to watch when refresh dialog is shown & cleared
        function elemChangeCallback (mutationsList, observer) {
            addelements();
            for (let mutation of mutationsList) {
                if (mutation.target.classList.contains('hidden') && mutation.oldValue == '') {

                }
            }
        }
        ///////////ADD ELEMENTS/////////////
        function addelements()
        {
            var hiderouteexist = document.getElementById("hideroute");
            if(!hiderouteexist)
            {
                const placeelements = document.getElementById("alui-columnVisibility-container");

                var hrdiv = document.createElement("div");
                hrdiv.setAttribute("id", "hideroute");
                hrdiv.style.display = "inline-block";
                hrdiv.style.margin = "0px 6px 0px 6px";
                hrdiv.style.float = "left";
                hrdiv.style.fontWeight = "400";
                hrdiv.style.color = '#666';
                var hrb = document.createElement("button");
                hrb.setAttribute("id", "hrb");
                hrb.innerHTML = "Hide NCSL";
                hrb.addEventListener("click", hidencsl);

                placeelements.parentNode.appendChild(hrdiv);
                hrdiv.appendChild(hrb);

                var next = document.getElementById("dashboard_next");
                var prev = document.getElementById("dashboard_previous");
                var dl = document.querySelector('select[name="dashboard_length"]');
                dl.addEventListener("change", checkncsl);
                dl.addEventListener("change", redocolors);
                next.addEventListener("click", checkncsl)
                prev.addEventListener("click", checkncsl);
            }
        }
        var newdash = [];
        var ncsl = "NCSL";
        function hidencsl()
        {
            newdash = [];
            var hrb = document.getElementById("hrb");
            var dashboard = document.getElementById("dashboard").children[1].children;
            console.log(dashboard.length);
            if(hrb.innerHTML === "Hide NCSL")
            {
                for(var x =0; x<dashboard.length; x++)
                {
                    if(!dashboard[x].className.includes("groupRow"))
                    {
                        var routename = dashboard[x].children[8].textContent;
                        if(routename.includes(ncsl))
                        {
                            dashboard[x].className += " hidden";
                            hrb.innerHTML = "Show NCSL";
                        }
                    }
                }
            }
            else if(hrb.innerHTML === "Show NCSL")
            {
                for(x =0; x<dashboard.length; x++)
                {
                    if(!dashboard[x].className.includes("groupRow"))
                    {
                        routename = dashboard[x].children[8].textContent;
                        if(routename.includes(ncsl))
                        {
                            dashboard[x].className -= " hidden";
                            hrb.innerHTML = "Hide NCSL";
                        }
                    }
                }
            }
            redocolors();
        }

        function checkncsl()
        {
            newdash = [];
            var dashboard = document.getElementById("dashboard").children[1].children;
            var dashhead = document.getElementById("dashboard").children[0];
            var hrb = document.getElementById("hrb");
            for(var x =0; x<dashboard.length; x++)
            {
                var routename = dashboard[x].children[8];
                // console.log("rn: ", routename.parentNode.parentNode.parentNode);
                if(!routename.parentNode.parentNode.parentNode.className.includes("hidden"))
                {
                    hrb.innerHTML = "Hide NCSL";
                }
                if(routename.parentNode.parentNode.parentNode.className.includes("hidden"))
                {
                    hrb.innerHTML = "Show NCSL";
                    break;
                }
            }
        }
        function redocolors()
        {
            var oddlength = document.querySelectorAll('tr.odd, tr.even, tr.NaN');
            for(var x = 0; x<oddlength.length; x++)
            {
                if(!oddlength[x].className.includes("hidden"))
                {
                    newdash.push(oddlength[x].getAttribute("id"));
                }
            }
            for(x = 0; x<newdash.length; x+=2)
            {
                var actualelement = document.getElementById(newdash[x]);
                if(actualelement)
                {
                    actualelement.className = "odd";
                }
            }
            for(x = 1; x<newdash.length; x+=2)
            {
                actualelement = document.getElementById(newdash[x]);
                if(actualelement)
                {
                    actualelement.className = "even";
                }
            }
        }
    }
})();