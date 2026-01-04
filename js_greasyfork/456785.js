// ==UserScript==
// @name         PlonkViewer for GeoGuessr
// @version      1.1
// @author       Han75
// @license      MIT
// @description  Click on your marker to view google street view imagery at the location that you guessed!
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/en/users/973646
// @downloadURL https://update.greasyfork.org/scripts/456785/PlonkViewer%20for%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/456785/PlonkViewer%20for%20GeoGuessr.meta.js
// ==/UserScript==

/**
 * IMPORTANT PLEASE READ THIS COMMENT. EXTENTION WILL NOT WORK IF YOU DONT.
 * This is a google street view API key. It is paid, but you can borrow geoguessr's API key for free. Follow these steps to do this:
 * 1. Start a game on geoguessr, then press F12 to open the developer tools menu. You may want to resize this menu to make it bigger
 * 2. Go to the "network" tab. If it's hidden, you may have to click the double arrows ">>" icon to find it.
 * 3. In the "filter" box, copy this phrase(Without the quotes): "ViewportInfoService"
 * 4. Click on the viewportinfoservice pop-up under the "Name" section.
 * 5. In the "general">"Request URL" section you should see something that looks like this:
 *  https://maps.googleapis.com/maps/api/js/ViewportInfoService.GetViewportInfo?...
 *      {Lots of random text and numbers}...&key=TheAPIKey_12345&token=119870
 *    in this case, the API key that we are interested in is "TheAPIKey_12345".
 *    copy the Key and paste it below where it says "KEY_HERE".
 */


const API_KEY = `KEY_HERE`;
//GeoGuessr games API
const GEO_GAME_API = `https://www.geoguessr.com/api/v3/games/`;
//Google API endpoint that finds the nearest street view location.
//Returns closest latlong in under the key ["location"]["lat"], ["location"]["lng"]
const ENDPOINT_10KM_SV_API = `https://maps.googleapis.com/maps/api/streetview/metadata?key=${API_KEY}&radius=10000&location=`;
//Returns closest latlong in under the key ["location"]["lat"], ["location"]["lng"]
const ENDPOINT_100KM_SV_API = `https://maps.googleapis.com/maps/api/streetview/metadata?key=${API_KEY}&radius=100000&location=`;
//The street view location. Add `{lattitude},{longitude}` to this.
const ENDPOINT_SV_URL = `https://google.com/maps?q&layer=c&cbll=`;

async function latlngToGSV(lat, lng) {
    //Search for streetview coverage within a 10 KM radius(Smaller radius helps to find official coverage)
    let dataURL = `${ENDPOINT_10KM_SV_API}${lat},${lng}`;
    let res = await fetch(dataURL);
    let data = await res.json();
    let retURL = "";
    //If no street view in a 10 KM radius, search a 100KM radius. With this setting its more likely to find 
    //photo spheres and trekker. 
    if(data["status"] === "ZERO_RESULTS"){
        let dataaURL = `${ENDPOINT_100KM_SV_API}${lat},${lng}`;
        let ress = await fetch(dataaURL);
        let dataa = await ress.json();
        //If coverage cannot be found, return street view of the eifel tower. 
        if(dataa["status"]==="ZERO_RESULTS"){
            retURL = "https://google.com/maps?q&layer=c&cbll=48.8568513,2.2967612";
        }else{
        //If coverage is found return street view link to the coverage. 
            retURL = `${ENDPOINT_SV_URL}${dataa["location"]["lat"]},${dataa["location"]["lng"]}`;
        }
    }else{
        retURL = `${ENDPOINT_SV_URL}${data["location"]["lat"]},${data["location"]["lng"]}`;
    }
    return retURL;
}
//Get player guesses for a game.
async function getPlayerGuesses() {
    let gameID = document.querySelector('meta[property="og:url"]').getAttribute("content").split("/")[4];
    let dataURL = `${GEO_GAME_API}${gameID}`;
    let res = await fetch(dataURL);
    let data = await res.json();
    return data["player"]["guesses"];
}

window.onload = (e) => {
    // Select the target node (the element to be monitored for changes)
    let targetNode = document.body;
    let stopRepeat=false;
    // Options for the observer (which mutations to observe)
    let config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    let oldContext="";
    let callback = function (mutationsList, observer) {
        // Get all divs with the desired attribute
        if(API_KEY==="KEY_HERE") return;
        
        let link = document.querySelector('meta[property="og:url"]').getAttribute("content");
        let context = link.split("/")[3];
        if (oldContext!=context){
            oldContext=context;
            stopRepeat=false;
        }
        let divs;
        switch(context){
            case "game":
                if(stopRepeat) return;
                divs = document.querySelectorAll('div[data-qa="guess-marker"]');
                // If there are more than one divs, execute the desired function
                if (divs.length > 1) {
                    stopRepeat=true;
                    executeFunction(divs);
                }
                break;
            case "results":
                if(stopRepeat||!document.querySelector("title").innerText.includes("Game breakdown")) return;
                divs = document.querySelectorAll('div.map-pin_mapPin__fiygK:not(.map-pin_clickable__2reGS)');
                if (divs.length > 1) {
                    stopRepeat=true;
                    executeFunction(divs);
                }
                break;
            default:
                stopRepeat=false;
        }

            
        
    };

    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    async function executeFunction(playerMarkers) {

        
        let playerGuesses = await getPlayerGuesses();
        if(playerGuesses===undefined||playerGuesses.length===undefined){
            return;
        }
        for (let i = 0; i < playerGuesses.length; i++) {

            let lat = playerGuesses[i]["lat"];
            let lng = playerGuesses[i]["lng"];
            let streetViewURL = await latlngToGSV(lat, lng);
            playerMarkers[i].style.cursor="pointer";
            playerMarkers[i].addEventListener("click", function () {
                window.open(streetViewURL, "_blank");
            });
        }
    }
    
}

