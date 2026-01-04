// ==UserScript==
// @name         Power-Bidder Ebay Enhancements
// @namespace    errantmind
// @version      0.39
// @author       errant
// @description  Blocks bad ebay shit and highlights good shit
// @include      *://www.ebay.com/*
// @include      *://www.ebay.co.uk/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388823/Power-Bidder%20Ebay%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/388823/Power-Bidder%20Ebay%20Enhancements.meta.js
// ==/UserScript==

const itemBlockedSeller = ["fiddybee", "dlpappas", "reveal978", "therewasadeath.vintage"];

const itemBlockedLocation = ["From Bulgaria", "From China", "From India", "From Thailand", "From Hong Kong", "From Ukraine", "From Hungary", "From Morocco", "From Israel", "From Japan"];

const itemBlockedDescription = ["antique design", "vintage design", "victorian design", "georgian design", 
                                "antique style", "vintage style", "victorian style", "georgian style", "inspired", 
                                "sponsored", "antique look", "deco design", "deco style", "nouveau style", "nouveau design"];

const questionableWords = ["design ", "style ", "inspiration", "look", "roman ", "legionnaire", "handmade", "revival", "repro", "ancient", "steampunk", "mexican", "japan", "japanese", "china", "chinese", "india", "africa"];

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

  $('.s-item').each(function(i, obj) {

    // Highlight Items with Bids
    var findResult = $(this).find(".s-item__bidCount");          
    if (findResult.length > 0 && !findResult.text().match(/\b0 bids/) && findResult.text().match(/\d+ bids?/)) {
          //console.log("Object " + i + " contains Blocked Description");
          $(this).css('background-color', '#d2f8d2');
    }
    
    // Highlight Items with questionable words
    findResult = $(this).find(".s-item__title");          
    if (findResult.length > 0 && checkItemBlockedDescription(questionableWords, findResult.text())) {
          //console.log("Object " + i + " contains Blocked Description");
          $(this).css('background-color', 'yellow');
    }
    
    // Highlight watching
    findResult = $(this).find(".s-item__watchheart-text--watching");          
    if (findResult.length > 0) {
          //console.log("Object " + i + " contains Blocked Description");
          findResult.css('border-style', 'dotted')
          findResult.css('background-color', 'blue');
    }

    // Remove Blocked Locations
    findResult = $(this).find(".s-item__itemLocation");
    if (findResult.length > 0 && itemBlockedLocation.indexOf(findResult.text()) > -1) {
          //console.log("Object " + i + " contains Blocked Location");
          //$(this).css('background-color', 'red');
          (this).remove();
          return;
    }

    // Remove Blocked Descriptions
    findResult = $(this).find(".s-item__title");          
    if (findResult.length > 0 && checkItemBlockedDescription(itemBlockedDescription, findResult.text())) {
          //console.log("Object " + i + " contains Blocked Description");
          //$(this).css('background-color', 'yellow');
          (this).remove();
          return;
    }
    
    // Remove Sellers
    findResult = $(this).find(".s-item__seller-info-text");          
    if (findResult.length > 0 && checkItemBlockedDescription(itemBlockedSeller, findResult.text())) {
          //console.log("Object " + i + " contains Blocked Description");
          //$(this).css('background-color', 'yellow');
          (this).remove();
          return;
    }
  });
});