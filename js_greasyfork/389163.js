// ==UserScript==
// @name         Power-Bidder Live Auctioneers Enhancements
// @namespace    errantmind
// @version      0.1
// @author       errant
// @description  Blocks bad ebay shit and highlights good shit
// @include      *://www.liveauctioneers.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/389163/Power-Bidder%20Live%20Auctioneers%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/389163/Power-Bidder%20Live%20Auctioneers%20Enhancements.meta.js
// ==/UserScript==



const itemBlockedDescription = ["chinese", "asian", "japanese", "korean", "mongolian", "middle eastern", "tibetan", "persian", "african", "buddha"];

const questionableWords = ["design ", "style ", "inspiration", "look", "roman ", "legionnaire", "handmade", "revival", "repro", "ancient"];

function checkItemBlockedDescription(banlist, desc) {
  for (var i = 0; i < banlist.length; i++) {
    if (desc.toLowerCase().indexOf(banlist[i]) > -1) {
      return true;
    }
  }
  return false;
}


$(function() {
  var count = 0;        

  $('div[class^="card___"]').each(function(i, obj) {    

    // Highlight Items with Bids
    var findResult = $(this).find('div[class^="bid-count___"]');          
    if (findResult.length > 0 && !findResult.text().match(/\b0 bids/) && findResult.text().match(/\d+ bids?/)) {
          $(this).css('background-color', '#d2f8d2');
    }
    
    // Highlight Items with questionable words
    findResult = $(this).find("span");          
    if (findResult.length > 0 && checkItemBlockedDescription(questionableWords, findResult.text())) {
          $(this).css('background-color', 'yellow');
    }

    // Remove Blocked Descriptions
    findResult = $(this).find("span"); 
    if (findResult.length > 0 && checkItemBlockedDescription(itemBlockedDescription, findResult.text())) {
          (this).remove();
          return;
    }
  });
});