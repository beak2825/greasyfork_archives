// ==UserScript==
// @name           Stepstone.de: Block popup and slider
// @namespace      localhost
// @description    Overwrites window.open method used for the popup so no popup will be opened. You can disable the window.open overwrite function and the popup will be closed during load thanks to the @run-at document-start property.

// @include        *.stepstone.*
// @run-at         document-end

// @author         lukie80
// @copyright      Creative Commons Attribution-ShareAlike 3.0 (CC-BY-SA 3.0)
// @license        http://creativecommons.org/licenses/by-sa/3.0/
// @version        1.2
// @lastupdated    2016.06.15
// 
// @downloadURL https://update.greasyfork.org/scripts/20612/Stepstonede%3A%20Block%20popup%20and%20slider.user.js
// @updateURL https://update.greasyfork.org/scripts/20612/Stepstonede%3A%20Block%20popup%20and%20slider.meta.js
// ==/UserScript==
//-------------------------------------------------------------------------------------------------------------------

// Overwrite window.open function on base page - prevents popup
window.open = function(){
  return;
};


// Close this window if it is a popup - not necessary, keep here for educational purposes or backup
var titles = new Array(
  "Aktuelle Jobs zu Ihrer Suche", //you can put other titles of the popup window in this array
  "Jobs per E&minus;Mail",
  "Jobs per E−Mail" //this "minus" is not the minus character
);
for (var i = 0; i < titles.length; i++){
  if (document.title == titles[i]){
    window.close();
  }
}

//delete slider
if(document.getElementById("jaSlider")){
    document.getElementById("jaSlider").remove();
}

if(document.getElementsByClassName("slider affix-top")[0]){
    document.getElementsByClassName("slider affix-top")[0].remove();
}


//-------------------------------------------------------------------------------------------------------------------