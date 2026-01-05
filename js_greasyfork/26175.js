// ==UserScript==
// @name        Unfix Fixed Position Element on Firefox Context Menu
// @description Add new item to top of right-click context menu to override position:fixed on elements in a page.
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     *
// @version     0.5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26175/Unfix%20Fixed%20Position%20Element%20on%20Firefox%20Context%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/26175/Unfix%20Fixed%20Position%20Element%20on%20Firefox%20Context%20Menu.meta.js
// ==/UserScript==

// Context menu options -- Firefox only, and do not replace any existing context menu! Also, do not run in iframes
if (!document.body.hasAttribute("contextmenu") && "contextMenu" in document.documentElement && (window.self == window.top)) {
  var cmenu = document.createElement("menu");
  cmenu.id = "UFPEcontext";
  cmenu.setAttribute("type", "context");
  cmenu.innerHTML = '<menu id="UFPEFlyout" label="Unfix Fixed Element" ufpeundolist="">' +
    '<menuitem id="UFPEStatic" label="Make Static"></menuitem>' +
    '<menuitem id="UFPEHide" label="Hide"></menuitem>' +
    '<menuitem id="UFPEUnHide" label="UnHide"></menuitem>' +
    '</menu>';
  document.body.appendChild(cmenu);
  document.getElementById("UFPEStatic").addEventListener("click", UFPE_doStyle, false);
  document.getElementById("UFPEHide").addEventListener("click", UFPE_doStyle, false);
  document.getElementById("UFPEUnHide").addEventListener("click", UFPE_dispUnHide, false);
  // attach menu and create event for filtering
  document.body.setAttribute("contextmenu", "UFPEcontext");
  document.body.addEventListener("contextmenu", UFPE_cmenuFilter, false);
} else {
  console.log("DIDN'T ADD CONTEXT MENU!");
}
function UFPE_cmenuFilter(e){
  // Mark the right-clicked element for later reference (is there an easier way?)
  var tgt = e.target;
  // Compute and store a highly unique element based on the current time
  var dNew = new Date();
  tgt.setAttribute('unfixtime', dNew.getTime());
  // Store that same time on the first context menu item for each of reference
  document.getElementById('UFPEFlyout').setAttribute('unfixtgt', tgt.getAttribute('unfixtime'));
}
function UFPE_doStyle(e){
  // What is the action?
  var axn = e.target.id.substr(4); // Static or Hide
  // Find the right-clicked element using the stored timestamp -- should be unique
  var tgtval = document.getElementById('UFPEFlyout').getAttribute('unfixtgt');
  var tgt = document.querySelector('[unfixtime="'+tgtval+'"]');
  if (!tgt){
    // Oh crap, something went wrong
    alert('Unable to find my target!');
    return;
  }
  // Find the position:fixed element -- it could be the right-clicked element or an ancestor containing it
  while (tgt.nodeName != 'BODY') {
    var posval = window.getComputedStyle(tgt,null).getPropertyValue('position');
    // For debugging purposes
    // console.log('tgt.nodeName='+tgt.nodeName+' has '+posval);
    if (posval=='fixed' || (posval=='static' && tgt.hasAttribute('ufpestatic') && axn=='Hide')){
      // This is the nearest ancestor with position:fixed
      switch (axn){
        case 'Static':
          // Set position:static and store a timestamp for reference
          tgt.style.position = 'static';
          tgt.setAttribute('ufpestatic', tgtval);
          return;
        case 'Hide':
          // Set a timestamp for reference and add it to the undo list
          tgt.setAttribute('ufpehidden', tgtval);
          tgt.setAttribute('ufpedisplay', window.getComputedStyle(tgt,null).getPropertyValue('display'));
          var hidden = document.getElementById('UFPEFlyout').getAttribute('ufpeundolist');
          if (hidden.length === 0) hidden = tgtval;
          else hidden += ',' + tgtval;
          document.getElementById('UFPEFlyout').setAttribute('ufpeundolist', hidden);
          // Set display:none to hide the element
          tgt.style.display = 'none';
          return;
      }
      console.log('Value for axn is corrupted!');
      break;
    } else {
      // Check the next higher ancestor
      tgt = tgt.parentNode;
    }
  }
}
function UFPE_dispUnHide(e){
  // Retrieve undo list
  var hidden = document.getElementById('UFPEFlyout').getAttribute('ufpeundolist');
  if (hidden.length === 0){
    alert('Nothing is hidden right now');
    return;
  }
  // Split off the last timestamp in the list
  var cpos = hidden.lastIndexOf(',');
  if (cpos === -1){
    tgtval = hidden;
    hidden = '';
  } else {
    tgtval = hidden.substr(cpos+1);
    hidden = hidden.substr(0, cpos);
  }
  // Update the undo list
  document.getElementById('UFPEFlyout').setAttribute('ufpeundolist', hidden);
  // Seek the hidden element
  var tgt = document.querySelector('[ufpehidden="'+tgtval+'"]');
  if (!tgt){
    // Oh crap, something went wrong
    alert('The hidden item seems to be gone. Maybe try again?');
    return;
  } else {
    // Restore the previous value of the display property
    tgt.style.display = tgt.getAttribute('ufpedisplay');
  }
}