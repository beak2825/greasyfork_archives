// ==UserScript==
// @name           Dragoyle Finder
// @author         RealisticError
// @namespace      https://greasyfork.org/en/users/200321-realisticerror
// @version        0.6
// @description    Finds those damn dragoyles for you.
// @grant          none
// @include        http://www.neopets.com/medieval/turdleracing.phtml*
// @downloadURL https://update.greasyfork.org/scripts/370824/Dragoyle%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/370824/Dragoyle%20Finder.meta.js
// ==/UserScript==

//To change your time values: Math.floor((Math.random() * ((MAXTime - MINTime) + 1)) + MINTime);
var x = Math.floor((Math.random() * (1500 - 900) + 1) + 900); //1000 = 1 second
function timeout() {	//timeout function

    //Checks if the image is your dragoyle
    //*** Change the word plushie to the colour of your dragoyle to find the right one ***
   //dragoyle colours are: Eventide, Faerie, Fire, Ghost, Green, Mutant, Pink, Plushie, Purple, Rainbow, Yellow.
    var dragoyleColour = "plushie";

    //Gets the div around the dragoyle image.
   var dragoyle = document.getElementById("nchunt2014_postcard");
   var dragoyleFound = false;
    //Checks if the dragoyle image exists on the page.
    if(dragoyle != null) {
        //Gets the image itself
       var dragoyleImage = dragoyle.children;

       if(dragoyleImage[0].innerHTML.indexOf(dragoyleColour) !== -1) {
           dragoyleFound = true;
           alert("You've found your dragoyle!");
       }
    }

    //Refresh if it can't be found
    if(!dragoyleFound) {

        location.reload();

    }
}
window.setTimeout(timeout, x)