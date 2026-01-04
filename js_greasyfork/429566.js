// ==UserScript==
// @name         Game Filter - zatrolene-hry.cz
// @description  Filter blocked games.
// @namespace    XcomeX
// @author       XcomeX
// @version      0.1
// @noframes
// @grant        none
// @match        https://www.zatrolene-hry.cz/bazar/*
// @downloadURL https://update.greasyfork.org/scripts/429566/Game%20Filter%20-%20zatrolene-hrycz.user.js
// @updateURL https://update.greasyfork.org/scripts/429566/Game%20Filter%20-%20zatrolene-hrycz.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const blockedGames = [
                        'Game Title', 'Next Game I really do not like', '', '',
                        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                        '', '', '', '', '', '', '', '', '', '', '', '', '', '',
                       ];

  function isOnTheList(textToCheck, checkList) {
    var onList = false;
    checkList.forEach(function(checkedItem) {
      if (checkedItem == '')
        return;
      
      if ( textToCheck.toLowerCase().includes(checkedItem.toLowerCase()) )
        onList = true; return;
    });
    return onList;
  }

  function gameFilter() {  
    var gameRows = document.querySelectorAll("div.list-item");
        
    gameRows.forEach(function(gameRow) {
      var gameTitle = gameRow.querySelector("h3 > a").innerHTML;
      var isBlocked = isOnTheList(gameTitle, blockedGames);
      if(isBlocked) {
        gameRow.parentNode.removeChild(gameRow);
      }
    });

  }
  
  // Start the script
  window.addEventListener('DOMContentLoaded', gameFilter);  
  
})();