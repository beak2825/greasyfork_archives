// ==UserScript==
// @name        PoEPoBCopyPaste
// @namespace   lel
// @include     https://www.pathofexile.com/*
// @include     http://www.pathofexile.com/*
// @version     1.0.1
// @grant       none
// @description copy items from poe website into PoB
// @downloadURL https://update.greasyfork.org/scripts/32459/PoEPoBCopyPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/32459/PoEPoBCopyPaste.meta.js
// ==/UserScript==
console.log("PoEPoBCopyPaste loaded")

var itemJs = [...document.querySelectorAll("script")]
             .map(n => n.innerText)
             .filter(t => t.indexOf("DeferredItemRenderer") !== -1 );

if(itemJs.length !== 1) {
  console.log("No item definitions found, aborting.");
  return;
}
itemJs = itemJs[0];
console.log("Found item definition JS, parsing...")

console.log(itemJs);


//professionally extracting json with regexp, i think I flamed pete at one point for doing this :3
//but you know, with the new speed code meta...
var regexp = /[\s\S.]]*?\(new R\((.*?)\)\)\.run\(\)\; \}\)\;/;
var match = regexp.exec(itemJs);
console.log(match[1]); // abc
var itemJSON = JSON.parse(match[1]);
window.poepobItems = itemJSON;
console.log("Parsed JSON")
console.log(itemJSON);


document.querySelectorAll(".itemContentLayout").forEach(function(el){
  el.addEventListener('click',
   function(){
    var itemIndex = el.id.replace("item-fragment-",'');
    console.log(itemJSON[itemIndex]);
    var itemText = objToText(itemJSON[itemIndex]);
    copyTextToClipboard(itemText);
    alert(itemText);

   }
  );
});

function objToText(o){
  var str = "";
  str += "Rarity: " + frameTypeToRarity(o[1].frameType);
  str += "\n";
  if(o[1].name){
    str += (cleanseTypeLine(o[1].name));
    str += "\n";
    str += (cleanseTypeLine(o[1].typeLine));
  } else {
    str += (cleanseTypeLine(o[1].typeLine));
  }
  str += "\n";
  if(o[1].properties){
    str += "--------";
    str += "\n";
    str += buildProperties(o[1].properties);
  }
  if(o[1].requirements){
    str += "--------";
    str += "\n";
    str += "Requirements:\n";
    str += buildProperties(o[1].requirements);
  }
  if(o[1].enchantMods){
    str += "--------";
    str += "\n";
    str += buildMods(o[1].enchantMods);
  }
  if(o[1].implicitMods){
    str += "--------";
    str += "\n";
    str += buildMods(o[1].implicitMods);
  }
  if(o[1].explicitMods){
    str += "--------";
    str += "\n";
    str += buildMods(o[1].explicitMods);
  }
  if(o[1].craftedMods){
    str += buildMods(o[1].craftedMods);
  }
  return str;
}

function frameTypeToRarity(ft){
  //Stolen from https://github.com/fikal/PoeTradeItemCopy
  var item_rarities = ["Normal", "Magic", "Rare", "Unique", "Gem", "Currency", "", "", "", "Relic"];
  
  return item_rarities[ft];
}

function cleanseTypeLine(typeLine){
  return typeLine.replace(/<<[^>]+>>/g,'');
};

function buildProperties(o){
  var str = '';
  
  for(prop of o) {
    if(prop.name.indexOf("%0") !== -1) {
      var tmpstr = prop.name;
      var n=0;
      for(val of prop.values)  {
       tmpstr = tmpstr.replace("%"+n,val[0])
       n++;
      }
      str += tmpstr;
    } else {
     str += prop.name;
      if(prop.values && prop.values[0]){
        str += ": " + prop.values[0][0];
      }
    }
    str += "\n";
  }
    
  return str;
}

function buildMods(m){
  var str = '';
  for(mod of m) {
    str += mod + "\n";
  }
  return str;
}

//Stolen from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}