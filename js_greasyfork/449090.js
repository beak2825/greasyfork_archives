// ==UserScript==
// @name         ACL Movement
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically input ACL moves.
// @author       Hayden Lindsey
// @match        https://trans-logistics.amazon.com/sortcenter/flowrate*
// @match        https://trans-logistics.amazon.com/sortcenter/vista*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449090/ACL%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/449090/ACL%20Movement.meta.js
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
            addacl();
            for (let mutation of mutationsList) {
                if (mutation.target.classList.contains('hidden') && mutation.oldValue == '') {

                }
            }
        }

        //////////////////START ACL//////////////////
        function addacl()
        {
            var lx = 590;
            var ly = -30;
            var tx = 655;
            var ty = -30;
            var aclb = document.getElementById("aclBody");
            if(!aclb)
            {
                const filter = document.getElementsByClassName("filter-holder float-left")[0]

                var aclBody = document.createElement("div");
                aclBody.setAttribute("id", "aclBody");
                aclBody.style.display = "inline-block";

                filter.parentNode.appendChild(aclBody);

                //////////////////ACL START BUTTON//////////////////
                var aclbutton = document.createElement("button");
                aclbutton.id = "aclbutton";
                aclbutton.style.position = "absolute";
                aclbutton.style.left = (lx+335) + "px";
                aclbutton.style.top = (ly+30) + "px";
                aclbutton.style.fontSize = "14px";
                aclbutton.style.lineHeight = "10px";
                aclbutton.innerHTML = "Start ACL";
                aclbutton.addEventListener('click', function () { startACL("n") } );
                aclBody.appendChild(aclbutton);

                //////////////////SEARCH ROUTES//////////////////
                var aclLabel = document.createElement("label");
                aclLabel.innerHTML = "Start Route";
                aclLabel.style.position = "absolute";
                aclLabel.style.left = lx + "px";
                aclLabel.style.top = ly + "px";
                aclBody.appendChild(aclLabel);

                var aclSearchRoute = document.createElement("input");
                aclSearchRoute.id = "aclsr";
                aclSearchRoute.style.position = "absolute";
                aclSearchRoute.style.height = "20px";
                aclSearchRoute.style.width = "90px";
                aclSearchRoute.style.left = tx + "px";
                aclSearchRoute.style.top = ty + "px";
                aclBody.appendChild(aclSearchRoute);

                //////////////////CHANGED ROUTE//////////////////
                var aclChangeLabel = document.createElement("label");
                aclChangeLabel.innerHTML = "Changed Route";
                aclChangeLabel.style.position = "absolute";
                aclChangeLabel.style.left = (lx-20) + "px";//"700px";
                aclChangeLabel.style.top = (ly+30) + "px";//"-10px";
                aclBody.appendChild(aclChangeLabel);

                var aclChangedRoute = document.createElement("input");
                aclChangedRoute.id = "changedroute";
                aclChangedRoute.style.position = "absolute";
                aclChangedRoute.style.height = "20px";
                aclChangedRoute.style.width = "90px";
                aclChangedRoute.style.left = (tx) + "px";//"785px";
                aclChangedRoute.style.top = (ty+30) + "px";//"-10px";
                aclBody.appendChild(aclChangedRoute);

                //////////////////CONTAINER SEARCH//////////////////
                var aclContainerSearchLabel = document.createElement("label");
                aclContainerSearchLabel.innerHTML = "Container IDs";
                aclContainerSearchLabel.style.position = "absolute";
                aclContainerSearchLabel.style.left = (lx+210) + "px";
                aclContainerSearchLabel.style.top = (ly-115) + "px";
                aclBody.appendChild(aclContainerSearchLabel);

                var aclContainerSearch = document.createElement("textarea");
                aclContainerSearch.id = "containersearch";
                aclContainerSearch.style.position = "absolute";
                aclContainerSearch.style.height = "150px";
                aclContainerSearch.style.width = "160px";
                aclContainerSearch.style.left = (tx+105) + "px";
                aclContainerSearch.style.top = (ty-97) + "px"
                aclBody.appendChild(aclContainerSearch);
            }
        }
    }
    //////////////////end of load//////////////////
    function test()
    {
        var containersearch = document.getElementById("containersearch");
        var x = containersearch.value.split(/\r?\n/);
        for (var i = 0; i <x.length; i ++)
        {
            console.log(x[i]);
        }
    }
    //////////////////////////////////////////////////////////////////
    function startACL(t)
    {
        if(t == "n") ////t=n so it goes through this part
        {
            // console.log(t);
            var searchlane = document.getElementsByClassName("outboundTableFilterInput ui-autocomplete-input")[0];
            var clickEvent = document.createEvent('MouseEvents');
            var aclSearchRoute = document.getElementById("aclsr");

            searchlane.value = aclSearchRoute.value;
            searchlane.dispatchEvent(new Event('keydown'));

            setTimeout(function () {
                var lane = document.getElementsByClassName("Lane ui-menu-item")
                lane[0].click();
            }, 500);

            setTimeout(function () {
                var actualdetails = document.getElementsByClassName("toolTipText palletIconEnabled")[0];
                actualdetails.click();
            }, 800);
            ff()
        }
        else ///////t=y so the popupdetails is opened and visible
        {
            var filtersearch = document.getElementById("containerDetails_filter").children[0].children[0];
            var changedroute = document.getElementById("changedroute");

            var containersearch = document.getElementById("containersearch");
            var x = containersearch.value.split(/\r?\n/);
            console.log("XLENGTH:", x.length);
            for (var i = 0; i <x.length-1; i ++)//adding pallets to selected containers
            {
                // console.log(x[i]);
                filtersearch.value = x[i];
                filtersearch.dispatchEvent(new Event('keyup'));
                var containercheckbox = document.getElementById("input_"+x[i]);
                containercheckbox.click();
            }
            filtersearch.value = "";
            filtersearch.dispatchEvent(new Event('keyup'));
            var movetodivoptions = document.getElementsByClassName("lanes-select-control select2-hidden-accessible")[0];
            for (let i = 0; i < movetodivoptions.options.length; i++)
            {
                if(movetodivoptions[i].value.includes(changedroute.value))
                {
                    // console.log(movetodivoptions[i].value);
                    movetodivoptions.value = movetodivoptions.options[i].value;
                    movetodivoptions.dispatchEvent(new Event("change"));
                    //move click disabled for security
                    var movebutton = document.getElementById("move-button");
                    // console.log(movebutton.classList);
                    movebutton.classList.remove("disabled-button");
                    //movebutton.click();
                }
            }
        }
    }
    function ff()
    {
        var stopff = false;
        var containerdetailspopup = document.getElementsByClassName("ui-dialog ui-widget ui-widget-content ui-corner-all  ui-draggable ui-resizable")[0];
        if(!containerdetailspopup)
        {
            setTimeout(function () { ff() }, 1000);
        }
        else
        {
            if(containerdetailspopup.style.display == "block")
            {
                console.log(containerdetailspopup.style.display);
                startACL("y");
            }
            else
            {
                console.log(containerdetailspopup.style.display);
                setTimeout(function () { ff() }, 1000);
            }
        }
    }
})();