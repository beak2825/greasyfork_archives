// ==UserScript==
// @name        Mercari JP - Buy with Neokyo 
// @namespace   https://github.com/norrismiv
// @match       https://jp.mercari.com/item/*
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @grant       none
// @version     1.0
// @author      mad scientist
// @description Adds a button to Mercari JP pages to buy with Neokyo proxy
// @downloadURL https://update.greasyfork.org/scripts/435117/Mercari%20JP%20-%20Buy%20with%20Neokyo.user.js
// @updateURL https://update.greasyfork.org/scripts/435117/Mercari%20JP%20-%20Buy%20with%20Neokyo.meta.js
// ==/UserScript==

var loadInterval = 0;

function neokyo() {
    loadInterval = setInterval(neokyoLoad, 200);
}

 function neokyoLoad() {
  'use strict';
   
  if ($('#neokyo-buy').length > 0)
  {
    clearInterval(loadInterval);
    return; 
  }
  let mercariItem = $(location).attr('href').substring($(location).attr('href').lastIndexOf('/') + 1);
   
  let neokyoButton = `<div id='neokyo-buy'>
  <mer-button fluid="" intent="primary" data-testid="open-neokyo-link" mer-defined="" data-js-focus-visible="" type="externalLink" to="https://neokyo.com/en/product/mercari/${mercariItem}">
    <a target="_blank" rel="noopener noreferrer" href="https://neokyo.com/en/product/mercari/${mercariItem}" data-location="item:item_title:link:link_buy_on_neokyo">
    <div>
      <span>Buy this item on Neokyo!</span>
      <mer-icon-external-link class="mer-spacing-l-4" color="inherit" size="xsmall" mer-defined=""></mer-icon-external-link>
    </div>
    </a>
  </mer-button>
</div>`
  
  let buyContainer = $("div").find(`[data-testid=checkout-button-container]`);
  
  
  $("div").find(`[data-testid=checkout-button-container]`).after(neokyoButton);
}

if (document.readyState == 'complete') {
    neokyo();
} else {
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            neokyo();
        }
    }
}