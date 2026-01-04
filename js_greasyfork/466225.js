// ==UserScript==
// @name         Trust Factor Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  A Lightweight Trust Factor script
// @author       JVY
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/466225/Trust%20Factor%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/466225/Trust%20Factor%20Viewer.meta.js
// ==/UserScript==

// Run script (every 3s in case something fails)
main();
setInterval(function() { main(); }, 3000);

// Main function
function main() {

    // If Trust Factor bar exists, cancel execution
    if ( document.querySelectorAll(".trustfactor").length != 0 ) { return; }

    // If URL isn't user's main page, cancel execution
    if ( location.href.split("/").length > 5 ) {
        if ( location.href.split("/")[ location.href.split("/").length-1 ] != "" ) { return; }
    }

    // If Steam API Key isn't set, let the user know. Then cancel execution.
    let apiKey = getApiKey();
    if ( apiKey == null ) {
        displayApiKeyError();
        return;
    }

    // Get SteamID
    if ( location.href.split("/")[3] == "profiles") { getTrustFactor( location.href.split("/")[4] ); }
    else { GM_xmlhttpRequest({
        method: "GET",
        url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + apiKey + "&vanityurl=" + location.href.split("/")[4],
        onload: function(response) {

            // If API Key was invalid, display it.
            if ( response.responseText.includes("<html><head><title>Forbidden</title></head><body><h1>Forbidden</h1>Access is denied.") ) {
                displayApiKeyError();
                return;
            }

            getTrustFactor( JSON.parse(response.responseText).response.steamid );

        }
    })}

}

// API Key Get/Set
function getApiKey() { return GM_getValue("steamApiKey", null); }
function setApiKey(key) { return GM_setValue("steamApiKey", key); }


// Get Trust Factor from FaceitFinder
function getTrustFactor(steamID) {
    let trustFactor = 0;
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://faceitfinder.com/profile/" + steamID,
        onload: function(response) {

            // Load Faceitfinder Profile HTML
            var site = document.createElement( 'html' );
            site.innerHTML = response.responseText;

            // Scrape trust factor as integer 0 to 100
            let trustFactor = parseInt( site.querySelector(".account-steam-trust").getAttribute("title").replace("Trust level = ", "").replace("%", "") );

            // Display trust factor
            displayTrustFactor( trustFactor, steamID );

        }
    })
}

// Display Trust Factor under profile picture
function displayTrustFactor(trustFactor, steamID) {

    // Make sure there isn't already a Trust Factor bar
    if ( document.querySelectorAll(".trustfactor").length != 0 ) { return; }

    // Create bar for Trust Factor
    let trustFactorBar = document.createElement("div");
    trustFactorBar.style.width = "100%";
    trustFactorBar.style.height = "10%";
    trustFactorBar.style.backgroundColor = "#202020";
    trustFactorBar.style.marginTop = "105%";
    trustFactorBar.style.cursor = "pointer";
    trustFactorBar.title = "Trust Factor: " + trustFactor + "%";
    trustFactorBar.classList.add("trustfactor");
    trustFactorBar.addEventListener("click", function() { window.open("https://faceitfinder.com/profile/" + steamID); })

    // Create colored indicator
    let trustFactorBarFill = document.createElement("div");
    trustFactorBarFill.style.width = trustFactor + "%";
    trustFactorBarFill.style.height = "100%";
    trustFactorBarFill.style.backgroundColor = getColor(trustFactor);
    trustFactorBar.appendChild(trustFactorBarFill);

    // Attach bar below profile picture
    document.querySelectorAll(".playerAvatar")[2].appendChild(trustFactorBar);

}

// Display API Key message
function displayApiKeyError() {

    // Make sure there isn't already a Trust Factor bar
    if ( document.querySelectorAll(".trustfactor").length != 0 ) { return; }

    // Create bar for API Key message
    let trustFactorBar = document.createElement("div");
    trustFactorBar.style.width = "100%";
    trustFactorBar.style.height = "10%";
    trustFactorBar.style.backgroundColor = "#202020";
    trustFactorBar.style.marginTop = "105%";
    trustFactorBar.style.cursor = "pointer";
    trustFactorBar.classList.add("trustfactor");
    trustFactorBar.style.fontSize = "12px";
    trustFactorBar.innerText = "No API Key set! Click to fix it.";
    trustFactorBar.addEventListener("click", function() {
        fetch("https://steamcommunity.com/dev/apikey").then(response => response.text() )
        .then(function(response) {

            // Load API Key Form HTML
            var site = document.createElement( 'html' );
            site.innerHTML = response;

            // If user does not have key
            if ( site.querySelector("#bodyContents_ex").childNodes[3].innerText.slice(5).includes(" ") ) {
                // Get Session ID
                let sessionid = "";
                for (const cookieLine of document.cookie.split("; ")) { if (cookieLine.includes("sessionid=")) { sessionid = cookieLine; } }

                // Create API Key
                fetch("https://steamcommunity.com/dev/registerkey", {"method": "POST", "body": "domain=registered_" + Math.floor(Math.random() * 9999999999999) + "&agreeToTerms=agreed&" + sessionid + "&Submit=Register", "headers": {"content-type": "application/x-www-form-urlencoded","cookie": document.cookie},}).then(response => response.text())
                .then(function(response) {
                    site.innerHTML = response;
                    const apiKey = site.querySelector("#bodyContents_ex").childNodes[3].innerText.slice(5);
                    setApiKey(apiKey);
                    document.querySelector(".trustfactor").parentElement.removeChild( document.querySelector(".trustfactor") );
                    main();
                })
            } else {
                // Otherwise just get it from the page
                const apiKey = site.querySelector("#bodyContents_ex").childNodes[3].innerText.slice(5);
                setApiKey(apiKey);
                document.querySelector(".trustfactor").parentElement.removeChild( document.querySelector(".trustfactor") );
                main();
            }

        })
    })

    // Attach message below profile picture
    document.querySelectorAll(".playerAvatar")[2].appendChild(trustFactorBar);

}

// Function that maps domain {0, 100} as red to green
function getColor(value){
    var hue=(value*1.2).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}
