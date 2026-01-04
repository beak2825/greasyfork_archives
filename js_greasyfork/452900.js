// ==UserScript==
// @name         OPMS Navbar color change for Environment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help you remember what OPMS environment you're on
// @author       Bazz Travers
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452900/OPMS%20Navbar%20color%20change%20for%20Environment.user.js
// @updateURL https://update.greasyfork.org/scripts/452900/OPMS%20Navbar%20color%20change%20for%20Environment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false;

    const URLColorMap = {
        "http://localhost" : {backgroundColor: "cyan", name: "dev"},
        "https://demo.opms.com.au" : {backgroundColor: "yellow", textColor: "red", name: "demo"}
    };

    const url = window.location.href;
    let mapping = { color : "red", //red if failed to detect environment
                   name : "Unknown environment"};

    for(let [key, value] of Object.entries(URLColorMap))
    {
        if(url.startsWith(key))
        {
            if(DEBUG)console.log("Does " + url + " start with " + key + ": true");
            if(value.name) mapping.name = value.name;
            if(value.textColor) mapping.textColor = value.textColor
            if(value.backgroundColor) mapping.backgroundColor = value.backgroundColor;
        }
        else
        {
            if(DEBUG)console.log("Does " + url + " start with " + key + ": false");
        }
    }

    const navbar = document.getElementsByClassName("navbar")[0];
    if(navbar)
    {
        const logoText = document.getElementById("logo_text");
        const environmentText = document.createTextNode(" - Environment : " + mapping.name);

        logoText.appendChild(environmentText);
        if(DEBUG)console.log("Navbar color script running : URL - " + url + ", Navbar - " + navbar + ", Color - " + mapping.backgroundColor);
        navbar.style.background = mapping.backgroundColor;
        if(mapping.textColor) //if text color is specified then apply it.
        {
            if(DEBUG)console.log("Custom text color supplied using :" + mapping.textColor);
            logoText.style.color = mapping.textColor
        }
        else //Else make the text color a the inverted color of the background for legability
        {
            if(DEBUG)console.log("No custom text color supplied, using background color instead");
            logoText.style.color = mapping.backgroundColor;
            logoText.style.filter = "invert(100%)"
        }
    }
})();