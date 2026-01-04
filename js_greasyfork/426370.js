// ==UserScript==
// @name         Geocaching Map Auto-Refresh
// @namespace    https://greasyfork.org/users/754130
// @version      1.01
// @description  Auto-refreshes the map in search mode. Adds an on/off button for this script. Disables "no geocaches" popup.
// @author       Bl4ke
// @match        *.geocaching.com/play/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426370/Geocaching%20Map%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/426370/Geocaching%20Map%20Auto-Refresh.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // number increases every time the map shows a new area, meaning the map has been dragged or zoomed
    var area_current = 0;
    var observersActive = false;
    var rf_bttn;
    var onOffBttn;
    // variables for measuring time between refreshes
    var startTime_refresh = new Date();
    var endTime_refresh;
    // when mouse down, map is dragged
    var mouseIsDown = false;
    window.addEventListener('mousedown', function() {
        mouseIsDown = true;
    });
    window.addEventListener('mouseup', function() {
        mouseIsDown = false;
    });


    // hide and press refresh button if available
    function handle_refresh_bttn() {
        rf_bttn = document.getElementById("clear-map-control");
        if(rf_bttn != null) {
            rf_bttn.style.zIndex = "-2";
            // for each area the refresh method is called
            refresh(area_current);
        }
    }

    // recursive function; presses refresh_bttn if map hasn't moved for a while and map isn't beeing dragged
    function refresh(area_temporary, startTime_area){
        // at first call set startTime_area
        if(startTime_area == undefined){
            startTime_area = new Date();
        }
        let endTime_refresh = new Date();

        //if map area hasn't moved
        if(area_temporary == area_current) {

            // if map isn't moved for a short time and isn't dragged, else try again later
            if(endTime_refresh - startTime_area > 850 && !mouseIsDown) {

                // if enough time has passed since last refresh, else try again later
                endTime_refresh = new Date();
                let cooldown = 4000;
                if(endTime_refresh - startTime_refresh > cooldown){
                    rf_bttn.click();
                    //console.log("[AR-Debug] Map refreshed!");
                    startTime_refresh = new Date();
                    return;
                }
                //console.log("[AR-Debug] waiting for cooldown");
            }
            window.setTimeout(refresh, 200, area_temporary, startTime_area);
        }
    }

    //closes "no geocaches found" pop-up and restarts obervers
    function close_popup() {
        let close_bttn = document.querySelector("button.modal-close-control");
        if(close_bttn != null){
            close_bttn.click();
            console.log("[AR] Popup closed!");
            stopObservers();

            // wait before restarting observers
            let offTime = 8;
            onOffBttn.disabled = true;
            let timer = setInterval(function(){
                if(offTime <= 0){
                    onOffBttn.innerHTML = "Auto-Refresh";
                    onOffBttn.disabled = false;
                    startObservers();
                    clearInterval(timer);
                }
                else{
                    onOffBttn.innerHTML = offTime;
                    offTime -= 1;
                }
            }, 1000);
        }
    }

    // disables the observers temporarily when settings are opened so that the popup trigger isn't activated
    function settings_popup_exemption() {
        document.querySelector("button[aria-label='Map settings']").addEventListener('click', function(){
            console.log("[AR] Settings opened. Disabling observers temporarily.");
            stopObservers();
            setTimeout(startObservers, 1000);
        });
    }

    // callback function for observer, executed when mutations are observed
    function callback(mutationsList, observer) {
        area_current += 1;
        //console.log("[AR-Debug] Map moved.");
        handle_refresh_bttn();
    }

    // callback function for popup observer, executed when mutations are observed
    function callback_popup(mutationsList, observer_popup) {
        //console.log("[AR-Debug] Observer_popup firing.");
        close_popup();
    }

    // create observer instances linked to their callback functions
    const observer = new MutationObserver(callback);
    const observer_popup = new MutationObserver(callback_popup);

    function startObservers() {
        // selecting the node that will be observed for mutations
        const targetNode = document.querySelector("a.map-cta");
        const targetNode_popup = document.body;

        // options for the observer (which mutations to observe)
        const config = { attributes: true, childList: false, subtree: false };
        const config_popup = {attributes: false, childList: true, subtree: false };

        // start observing the target nodes for configured mutations
        observer.observe(targetNode, config);
        observer_popup.observe(targetNode_popup, config_popup);

		observersActive = true;
        onOffBttn.style.cssText += "background-color: white";
		console.log("[AR] Observers started!");
        // check for refresh possibility on start
        handle_refresh_bttn();
    }

    function stopObservers() {
        observer_popup.disconnect();
        observer.disconnect();
		observersActive = false;
        onOffBttn.style.cssText += "background-color: rgb(228, 228, 228)";
        console.log("[AR] Observers stopped!");
    }

    function insertOnOffBttn() {
        var menuItem = document.createElement("li");
        menuItem.setAttribute("role", "menuitem");
        document.querySelector("button[aria-label='Map settings']").parentElement.parentElement.prepend(menuItem);
        onOffBttn = document.createElement("button");
        onOffBttn.setAttribute("aria-label", "Auto-refresh Switch");
        onOffBttn.setAttribute("class", "map-control");
        onOffBttn.innerHTML = "Auto-Refresh";
        onOffBttn.style.cssText += "background-color: white";
        onOffBttn.style.cssText += "font-size: 60%";
        // on-off function
        onOffBttn.addEventListener('click', function(){
            if(observersActive) {
                stopObservers();
            }
            else {
                startObservers();
            }
        });
        menuItem.append(onOffBttn);
    }

    // wait until map is loaded
    function waitUntilMapAvailable() {
        let mapNode = document.querySelector("div.map-container");
        if(mapNode == null) {
            // the node doesn't exist yet, wait and try again
            window.setTimeout(waitUntilMapAvailable, 300);
            return;
        }
        // setup
        insertOnOffBttn();
        startObservers();
        settings_popup_exemption(); //sets up exemption

    }
    waitUntilMapAvailable();
})();