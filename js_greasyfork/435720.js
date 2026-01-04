// ==UserScript==
// @name         Export from chessgames.com to lichess
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows a user to quickly export a PGN to lichess for analysis
// @author       UncleVinny
// @include      https://www.chessgames.com/perl/chessgame?gid=*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435720/Export%20from%20chessgamescom%20to%20lichess.user.js
// @updateURL https://update.greasyfork.org/scripts/435720/Export%20from%20chessgamescom%20to%20lichess.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// Note: this script tweaks the original by bfishbaum, found here:
// https://greasyfork.org/en/scripts/389928-lichess-analysis-link-on-chessbase

GM_addStyle (`
  #exportDiv {
    display:                inline-block; 
    width:                  600px;
    margin-bottom:          4px; /* This adds a white buffer below the div */
    padding:                4px; /* This makes the background grey a little taller. */
    background:             #9E9E9E;
    font-family:            Arial, Helvetica, sans-serif;
    font-weight:            bold;
    font-size:              12px;
  }

  #exportButton {
    background-color:       #4D4D4D; /* lichess grey */
    border:                 none;
    margin:                 0px 4px; /* distance to element on the right */
    color:                  white;
    padding:                3px 5px; /* padding around the text */
    text-align:             center; /* alignment within the button */
    font-weight:            bold; /* for some reason this doesn't get picked up from the div */
    border-radius:          5px;
    display:                inline-block;
}

  #urlLabel {
    display:                inline-block;
    margin:                 0px 10px;
    color:                  #4D4D4D;
    text-align:             left; 
}

  #lichessURL {
    display:                inline-block;
    color:                  #110011;
    text-align:             left; 
}

  #error {
    margin:                 0px 10px;
    color:                  #dd1111;
}

`);

(function() {
    'use strict';
    const LICHESS_IMPORT = 'https://lichess.org/api/import';

    function buildPGNLink() {
        var url = new URL(window.location.href);
        var gid = url.searchParams.get("gid");
        var link = "https://www.chessgames.com/perl/nph-chesspgn?text=1&gid=" + gid;
        return link;
    }  
  
    function tidyPGN(inputPGN) {
      var newPGN = inputPGN.split("\n");
      newPGN = newPGN.join(" ");
      return newPGN;
    }
  
    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
  
    function placeElement(new_elem, path) {
      var path_element = getElementByXpath(path);
      path_element.parentNode.insertBefore(new_elem, path_element.nextSibling);
    }
  
    function getCleanPgn(callback) {
      var url = new URL(window.location.href);
      var gid = url.searchParams.get("gid");
      var pgnLink = "https://www.chessgames.com/perl/nph-chesspgn?text=1&gid=" + gid;
      fetch(pgnLink).then(function(response) {
        response.text().then(function(body){
          var cleanPgn;
          cleanPgn = tidyPGN(body);
          callback(cleanPgn);
        })
      }) 
    }
  
    async function submitToLichess(_pgn) {
      const params = new URLSearchParams();
      params.append("pgn", _pgn);
      const options = {
        method: 'POST',   
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
        body: params.toString()
      };
      
      // now post to lichess...
      let response = await fetch(LICHESS_IMPORT, options);
      
      if (response.ok) {
        let result = await response.json();
        var displayLink = document.getElementById("lichessURL");
        displayLink.textContent = 'http://lichess.org/' + result.id;
        displayLink.hidden = false;
        displayLink.href = 'http://lichess.org/' + result.id;
        var urlLabel = document.getElementById("urlLabel");
        urlLabel.hidden = false;
        console.info(result);        
      } else {
        var errorText = document.createElement('a');
        errorText.id = 'error';
        errorText.href = 'https://greasyfork.org/en/scripts/435720-export-from-chessgames-com-to-lichess/feedback';
        errorText.innerHTML = "Error when uploading to lichess. Click here and report this at greasyfork, thanks!";
        placeElement(errorText, "//html/body/center[2]/div");
        console.info(response.status);
      }
    }
                                                
    function exportAction() {
      getCleanPgn(submitToLichess);
    }
  
    function addExportButton() {
      // create div 
      var div_block = document.createElement('div');
      div_block.setAttribute("id", "exportDiv");
      div_block.setAttribute("align", "left"); // I'd like all elements in the div to be aligned to the left
      var button = '<button id="exportButton" type="button">export to lichess</button>';
      var label = '<p id="urlLabel" hidden=true>exported game URL:</p>';
      var url = '<a id="lichessURL" hidden=true href="https://lichess.org">hidden</a>';
      div_block.innerHTML = button+label+url;
      placeElement(div_block, "//html/body/center[2]/div");

      // set up listener
      document.getElementById ("exportButton").addEventListener('click', exportAction);
    }
  
    addExportButton();

})();