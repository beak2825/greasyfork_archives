// ==UserScript==
// @name         Commsec Research Helper
 // @namespace    http://TBA.net/
// @version      0.2
// @description  Adds useful external links to commsec quotes page
// @author       Salty Feet
// @match        https://www2.commsec.com.au/quotes/*
// @license      MIT
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/445929/Commsec%20Research%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445929/Commsec%20Research%20Helper.meta.js
// ==/UserScript==

var thisTicker;
var links;
var linkTitle;
var newContent;
var _pre;

/* !!!!------------ONLY EDIT THE LINKS VARIABLE UNLESS YOU KNOW WHAT YOU'RE DOING----------------!!!!!*/
(function() {
    'use strict';
})();


function addElements () {
    /*
    This code adds your links to the commsec quotes page.
    DO NOT EDIT IT UNLESS YOU KNOW WHAT YOU'RE DOING
    */
    var helpers = document.createElement("div");
    helpers.id = "MyResearchHelpers";
    helpers.innerHTML = "<h4>My research helpers</h4>";
    helpers.style.padding = "1.6rem";
    helpers.style.fontSize = "1.5rem";
    helpers.style.width = "AUTO";
    helpers.style.backgroundColor = "yellow";
    document.body.appendChild(helpers);
    document.getElementById('MyResearchHelpers').className = 'MRH'

    for (var i = 0, l1 = links.length; i < l1; i++) {
        newContent = document.createElement('a');
        linkTitle = document.createTextNode(links[i][0]);
        newContent.appendChild(linkTitle);
        newContent.title = links[i][0];
        newContent.href = links[i][1];
        newContent.target = "_blank";
        _pre = document.createElement("pre");
        document.getElementById("MyResearchHelpers").appendChild(_pre);
        document.getElementById("MyResearchHelpers").appendChild(newContent);
    }
}

  window.onload = function() {
      var span = document.getElementById("overview-security-code");
      thisTicker=span.textContent;
      /*
      NOTE:
      links are entered in the format: TITLE, LINK
      You will need to know where the ticker code is placed in the websites link. you should be able to open the site providing you info, navigate to the ticker you want
      and see where the ticker code is placed in the URL. Copy the URL (website address in full) and use the below sample as a guide to recreating it. Some websites must use lowercase - see the example/s below
      Check each change you make after doing it
      */
      links = [
          ["Hotcopper", "https://hotcopper.com.au/asx/" + thisTicker.toLowerCase()],
          ["TradingView Charts", "https://www.tradingview.com/chart/W5XymItv/?symbol=" + thisTicker.toLowerCase()],
          ["Barchart", "https://www.barchart.com/stocks/quotes/" + thisTicker + ".AX/opinion"],
          ["Search Smallcaps", "https://smallcaps.com.au/?s=" + thisTicker],
          ["Search Twitter", "https://twitter.com/search?q=%24" + thisTicker.toLowerCase()],
          ["Search Alt Twit", "https://nitter.tiekoetter.com/search?f=tweets&q=%23" + thisTicker + "&since=&until=&near="],
          ["Livewire", "https://www.livewiremarkets.com/stock_codes/asx-" + thisTicker.toLowerCase()],
          ["Market Index", "https://www.marketindex.com.au/asx/" + thisTicker],
          ["Swingtradebot", "https://asx.swingtradebot.com/equities/" + thisTicker + ":ASX"],
          ["Kalkinemedia", "https://kalkinemedia.com/search?param=" + thisTicker],

      ];
      // Twitter also likes this format
      // ["Search Twitter", "https://twitter.com/search?q=%24" + thisTicker.toLowerCase() + "&src=cashtag_click"],

      //Alternative to Twitter: https://nitter.tiekoetter.com/search?f=tweets&q=%23rnu&since=&until=&near=

      addElements();

  };

