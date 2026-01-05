// ==UserScript==
// @name         IN CLAN EXTENSION BY TAKEOVER
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sets show mass and dark theme to true, provides a tricksplit with E, doublesplit with D, and faster feeding with Q.
// @author       TAKEOVER
// @match        http://es.agareoz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19747/IN%20CLAN%20EXTENSION%20BY%20TAKEOVER.user.js
// @updateURL https://update.greasyfork.org/scripts/19747/IN%20CLAN%20EXTENSION%20BY%20TAKEOVER.meta.js
// ==/UserScript==
var SplitInterval;
var MacroInterval;
var SplitDebounce = false;
var MacroDebounce = false;
var speed = 25; //in ms
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
function keydown(event) {
    if (event.keyCode == 81 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
    if (event.keyCode == 69) {
        split();
        setTimeout(split, speed);
        setTimeout(split, speed*2);
        setTimeout(split, speed*3);
    } if (event.keyCode == 68) {
        split();
        setTimeout(split, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 81) { // key W
        EjectDown = false;
    }
}
function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32})); //key space
    $("body").trigger($.Event("keyup", { keyCode: 32})); //jquery is required for split to work
}
setShowMass(true);
setDarkTheme(true);
//Looking through the code now are we? ( ͡° ͜ʖ ͡°)

// ------------------------------------------------------

// Agar.io++, created by ItsVoid. http://iammichael.nl
// Thanks, mikeyk730 for creating the awesome stats and charts userscript!
// Thanks, zeach for creating this awesome game, agar.io!

// ------------------------------------------------------

// Configuration
// Auto-enabled settings

setShowMass(true); // Show your mass
setDarkTheme(true); // Enable Dark theme by default
setNames(true); // Show player names
$("#nick").val("Edit userscript to change this!"); // Set username

// ------------------------------------------------------

// Userscript code, please do not touch unless you know what you're doing.
// Add custom css function

function addStyleSheet(style){
  var getHead = document.getElementsByTagName("HEAD")[0];
  var cssNode = window.document.createElement( 'style' );
  var elementStyle= getHead.appendChild(cssNode)
  elementStyle.innerHTML = style;
  return elementStyle;
}

// Import Bootstrap Paper and Fontawesome using custom css function

addStyleSheet('@import "http://bootswatch.com/paper/bootstrap.css"; @import "http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"; html * { font-family: Raleway, sans-serif; }'); 

// At first time opening agar.io with this userscript, alert user.

        var alerted = localStorage.getItem('alerted') || '';
        if (alerted != 'yes') {
         alert("Make sure you have the Charts & Stats userscript installed for ingame statistics! Check the description on Greasyfork for more info.");
         localStorage.setItem('alerted','yes');
        }

// Connect to IP & Reconnect
$(document).ready(function() {
    var region = $("#region");
    if (region.length) {
        $("<br/><div class=\"input-group\"><div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"255.255.255.255:443\" maxlength=\"20\"><span class=\"input-group-btn\"> &<button id=\"connectBtn\" class=\"btn-needs-server btn btn-warning\" style=\"width: 80px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\">Join</button><button id=\"connectBtn\" class=\"btn-needs-server btn btn-info\" style=\"width: 80px\" onclick=\"connect('ws://' + $('#serverInput').val());\" type=\"button\"><span class=\"fa fa-lg fa-refresh\"></span></button>  </input></div>").insertAfter("#helloDialog > form > div:nth-child(3)");
    }
});

// Remove instructions text 

var elmDeleted = document.getElementById("instructions");
	elmDeleted.parentNode.removeChild(elmDeleted);


// Import Raleway font from Google Fonts

 WebFontConfig = {
    google: { families: [ 'Raleway::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })(); 

// ------------------------------------------------------
// End of userscript
// ------------------------------------------------------
