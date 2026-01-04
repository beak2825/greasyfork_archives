// ==UserScript==
// @name          site aliExpress - order status colors
// @namespace     http://userstyles.org
// @description	  Colorize action buttons to indicate status of orders (ordered, payed, shipped, received, feedback).
// @match         *://*.aliexpress.com/*
// @run-at        document-end
// @author        hg42
// @license       MIT
// @version       2024.06.10
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/490861/site%20aliExpress%20-%20order%20status%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/490861/site%20aliExpress%20-%20order%20status%20colors.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(processElements, 0);
})();

function processElements(){
  var elements, ele;

  // buttons

  try{
    elements = $(".order-item-btn:has(:contains('delivery'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FF0000";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item-btn:has(:contains('Track'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FF0000";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item-btn:has(:contains('review'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#00AA00";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('Completed')) .order-item-btn:has(:contains('cart'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#00AA00";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('Canceled')) .order-item-btn:has(:contains('cart'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#999999";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item-btn:has(:contains('Delete'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#00AA00";
          ele.style.color = "#FFFFFF";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  // cards

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('ship'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFFFCC";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('delivery'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFEEEE";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('Collected'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFF6EE";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('Completed'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#EEFFEE";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".order-item:has(.order-item-header-status-text:contains('Canceled'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#EEEEEE";
      }
    }
    elements = $(".order-item:has(.order-item-header-status-text:contains('Canceled')) > *");
    if(elements.length>0){
      for(ele of elements){
          ele.style.opacity = "0.5";
      }
    }
  }
  catch(err){
    console.log(err);
  }

}