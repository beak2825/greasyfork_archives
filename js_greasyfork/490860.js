// ==UserScript==
// @name          site 17track - highlight status
// @namespace     http://userstyles.org
// @description	  Colorize certain text phrases
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @match         *://*.17track.net/*
// @run-at        document-end
// @author        hg42
// @license MIT
// @version       2024-03-25
// @downloadURL https://update.greasyfork.org/scripts/490860/site%2017track%20-%20highlight%20status.user.js
// @updateURL https://update.greasyfork.org/scripts/490860/site%2017track%20-%20highlight%20status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(processElements, 0);
})();

function processElements(){
  var elements, ele;

  // items

  try{
    elements = $(".s-tr");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFEEEE";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".s-tr:has(span:contains('Import customs clearance complete'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#F8F8F8";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".s-tr:has(span:contains('Awaiting for transit to final delivery office'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFFFFF";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".s-tr:has(span:contains('Received by local delivery company'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#FFFFDD";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".s-tr:has(span:contains('delivered'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#DDFFDD";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

  try{
    elements = $(".s-tr:has(span:contains('zugestellt'))");
    if(elements.length>0){
      for(ele of elements){
          ele.style.background = "#DDFFDD";
          ele.style.color = "#000000";
      }
    }
  }
  catch(err){
    console.log(err);
  }

}