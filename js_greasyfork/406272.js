// ==UserScript==
// @name Fetch Variables Tab
// @version 1.0
// @description Fetches information from Variables Tab in SN, and copies it to the clipboard
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/sc_task.do?*
// @match https://aut.service-now.com/*
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant GM_notification
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/406272/Fetch%20Variables%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/406272/Fetch%20Variables%20Tab.meta.js
// ==/UserScript==


function addVariablesToClipboard () {
  let labels = document.getElementsByClassName('sn-tooltip-basic');
  let values = document.getElementsByClassName('cat_item_option');

  // Grabbing only the needed elements of the labels
  let strippedLabels = [];

  for (var i = 0, label; label = labels[i]; i++) {
    
    if(label.outerHTML.indexOf('<span class="sn-tooltip-basic "') !== -1) {
      strippedLabels.push(label.innerText)
    }
  }

  
  // Getting only the needed elements of the values
  let strippedValues = [];

  for (var i = 0, data; data = values[i]; i++) {
    if (data.outerHTML.indexOf('<input') !== -1) {
      // console.log(data);
      if(data.outerHTML.indexOf('type="text"') === -1) {
        strippedValues.push(data.value);
      }

    }
  }

  
  // Structure the data for copying to the clipboard
  let objList = [];

  for (var i = 0; i < strippedLabels.length; i++) {
      objList.push( { [strippedLabels[i]] : strippedValues[i] } );
  }
  
  objString = "";
  
  // objList structure is [{key: val}, {key: val}, ...] 
  // May be a better way to structure it so looping over doesn't look so messy but *shrug*
  for (var i = 0; i < objList.length; i++) {
    Object.keys(objList[i]).forEach( key => {
      objString = `${objString}${key}: ${objList[i][key]}\n`;
    })
  }
  
  // Copying objString to clipboard
  
  //// Could replace this with GM_setClipboard??
  // const el = document.createElement('textarea');
  // el.value = objString;
  // document.body.appendChild(el);
  // el.select();
  // document.execCommand('copy');
  // document.body.removeChild(el);
  
  GM_setClipboard(objString, 'text/plain');
  
  
  
  // Create a non-intrusive notification to advise that the details have been copied
  GM_notification( { title: 'Copied!', text: 'Variables copied to clipboard!'});
  
}

var fetch_button = document.createElement("button");
fetch_button.style = "white-space: nowrap";
fetch_button.innerHTML = "Copy Variables";
fetch_button.id = "fetch_variables";
fetch_button.onClick = "addVariablesToClipboard()";
fetch_button.type='button';

document.getElementsByClassName("icon-stream-one-input btn-default btn")[0].insertAdjacentElement("afterend", fetch_button);

button = document.getElementById("fetch_variables");
button.addEventListener("click", addVariablesToClipboard, false);
