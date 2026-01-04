// ==UserScript==
// @name         Torn Black Friday Pinner
// @namespace    nodelore.torn.easy-market
// @version      1.0
// @description  Pin items in bazaar with 1 price.
// @author       nodelore[2786679]
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480676/Torn%20Black%20Friday%20Pinner.user.js
// @updateURL https://update.greasyfork.org/scripts/480676/Torn%20Black%20Friday%20Pinner.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const pricePattern = /\$(\d{1,3}(?:,\d{3})*|\d{1,2})(?:\.\d+)?/;

  const updateItem = (item)=>{
    const name = item.find("p[class^='name']").text();
    const priceText = item.find("p[class^='price']").text().trim();
    const match = pricePattern.exec(priceText);
    if (name !== "" && match) {
      const matchPrice = match[1];
      const stringWithoutCommas = matchPrice.replace(/,/g, "");
      const priceValue = parseInt(stringWithoutCommas, 10);
      if(priceValue === 1){
        if(!item.hasClass('append')){
            item.find('div[class*=description]').css({
              'background': '#99CC00'
            });

            if(item.find('div#isBlockedForBuyingTooltip').length === 0){
              item.find('div[class*=description]').css({
                'background': '#00A9F9'
              });
            }
          }

          item.addClass('append');
        }
    }
  }

  const observer = new MutationObserver((mutationList)=>{
    for(const mut of mutationList){
      for(const addedNode of mut.addedNodes){
        if(addedNode.tagName === 'DIV' && addedNode.classList.contains('itemsContainner___tVzIR')){
          $(addedNode).find('div[class*=itemDescription]').each(function(){
            const item = $(this);
            updateItem(item);
          });
        }
        else if(addedNode.tagName === 'DIV' && addedNode.classList.contains('row___LkdFI') && !addedNode.classList.contains('append')){
          $(addedNode).find('div[class*=itemDescription]').each(function(){
            const item = $(this);
            updateItem(item);
          });
        }
      }
    }
  });

  observer.observe($('div#bazaarRoot')[0], {childList: true, subtree: true});
})();