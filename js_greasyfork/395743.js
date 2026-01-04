// ==UserScript==
// @name         Streamline Google Calendar HTML
// @version      0.2.6
// @description  Hide certain Google Calendar web app buttons and HTML elements. Made for use in a RasPi calendar.
// @author       Rodrigo Contreras
// @match        https://calendar.google.com/calendar/*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/438919
// @downloadURL https://update.greasyfork.org/scripts/395743/Streamline%20Google%20Calendar%20HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/395743/Streamline%20Google%20Calendar%20HTML.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var grid = document.evaluate('//div[@role="grid"][@jscontroller]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    while (grid === null) {
        await new Promise(r => setTimeout(r, 500));
        grid = document.evaluate('//div[@role="grid"][@jscontroller]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    grid.style.marginLeft = 0; // Normally there's a small margin to the left where the hamburger menu opens up

    var xpathQueries = [
        '//*[@aria-label="Create"]/../../../..', // Button with cross to create an event
        '//*[@aria-label="Main drawer"]', // Hamburger menu button
        // '//*[@aria-label="Support"]/../../../../..', // Div with search, support and config buttons. No longer used as it is replaced by the clock.
        '//*[@aria-label="Previous period"]/..', // Button to move a month back
        '//*[@aria-label="Next period"]/..', // Button to move a month forward
        '//*[starts-with(@aria-label, "Today")]/../../../..', // Button to jump to today
        '//*[@aria-label="Google apps"]/../../..', // Button with 3x3 dots to open Google Apps menu
        '//button[@aria-haspopup="menu"]//*[local-name()="svg"]', // Arrow next to the week/month selector
        '//div[@aria-label="Show side panel"]' // Button in the bottom right to open the side panel with Tasks and Keep
    ];

    var query;
    var selectedElement;
    setTimeout(async function(){
        for (query of xpathQueries) {
            console.log(query);
            selectedElement = null;
            selectedElement = document.evaluate(query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            while (selectedElement === null) {
                await new Promise(r => setTimeout(r, 250));
                selectedElement = document.evaluate(query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }
            selectedElement.style.display = "none";
        }
    }, 5000);

    var mainDiv = null;
    var mainXpath='//div[@role="main"]'
    while (mainDiv === null) {
        await new Promise(r => setTimeout(r, 250));
        mainDiv = document.evaluate(mainXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    mainDiv.style.marginBottom = 0;

    const clockStyle = {
        "color": "#3c4043",
        "font-family": "'Google Sans',Roboto,Arial,sans-serif",
        "font-size": "22px",
        "font-weight": "400",
        "letter-spacing": "0",
        "line-height": "28px",
        "white-space": "nowrap",
        "margin-left": "auto",
        "margin-right": "0"
    }

    var searchForm = null;
    var searchContainerXpath = "//span/button[@aria-label=\"Search\"]/../../../../../..";
    while (searchForm === null) {
        await new Promise(r => setTimeout(r, 250));
        searchForm = document.evaluate(searchContainerXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    let newItem = document.createElement('div');
    newItem.setAttribute("id","clock");
    searchForm.parentElement.replaceChild(newItem, searchForm);
    newItem.style.visibility = "visible";

    for (var key in clockStyle){
        newItem.style[key] = clockStyle[key];
    }

    function time() {
        var d = new Date();
        var m = d.getMinutes();
        var h = d.getHours();
        newItem.textContent =
        ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
        }

    setInterval(time, 1000);

})
();