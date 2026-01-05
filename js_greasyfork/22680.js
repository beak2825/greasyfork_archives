// ==UserScript==
// @name         SH.ST
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://sh.st/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22680/SHST.user.js
// @updateURL https://update.greasyfork.org/scripts/22680/SHST.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    document.__defineGetter__(hidden, function() { return false; });

  function check() {
     setTimeout(function() {
         var skip = document.getElementById("skip_button");

         if(skip) {
             var style = window.getComputedStyle(skip);
             if(style.display == "block") {
                 skip.click();
                 app.skipClickNotify.skipButtonAction({stop:function(){return true;}});
                 return;
             }
         }
         check();
     }, 500);
  }

  function onchange (evt) {
  //  var v = "visible", h = "hidden",
  //      evtMap = {
  //        focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
  //      };

  //  evt = evt || window.event;
  //  if (evt.type in evtMap)
  //    console.log(evtMap[evt.type]);
  //  else
  //    console.log(this[hidden] ? "hidden" : "visible");
  //  console.log(document[hidden]);
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if( document[hidden] !== undefined )
    onchange({type: document[hidden] ? "blur" : "focus"});

  check();
})();