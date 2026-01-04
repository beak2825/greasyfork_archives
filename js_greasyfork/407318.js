// ==UserScript==
// @id             entOSTung
// @name           entOSTung
// @version        1.4
// @author         Pascal B
// @description    Remove Ost Branding
// @include        https://moodle.rj.ost.ch/*
// @exclude
// @run-at         document-start
// @namespace https://greasyfork.org/users/667965
// @downloadURL https://update.greasyfork.org/scripts/407318/entOSTung.user.js
// @updateURL https://update.greasyfork.org/scripts/407318/entOSTung.meta.js
// ==/UserScript==
(function () {
/***************************************************************************************************/
    function removeOst() { // Function for modifying the color background

        function changeBackgroundColor(x) { // change Ost background color to blue
            var backgroundColorRGB=window.getComputedStyle(x,null).backgroundColor; // get background-color
            if(backgroundColorRGB!="transparent") { // convert hex color to rgb color to compare
                var RGBValuesArray = backgroundColorRGB.match(/\d+/g); //get rgb values
                var red = RGBValuesArray[0];
                var green = RGBValuesArray[1];
                var blue = RGBValuesArray[2];

                if (red==140&&green==25&&blue==95) { // Ost detection
                    x.style.setProperty("background-color", "#0065a3", "important");
                   }
                }
            }
        var allElements=document.getElementsByTagName("*"); // get all elements on a page
        for(var i=0; i<allElements.length; i++) {
            changeBackgroundColor(allElements[i]);}
    }
    window.addEventListener("DOMContentLoaded",removeOst, false);

/***************************************************************************************************/
function addGlobalStyle(css) { // Function for CSS modification
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
    addGlobalStyle('a { color: #0065a3; }'); //Change Link color to blue
    addGlobalStyle('a:visited { color: #8512CC; }'); //Colorize visited Links
    addGlobalStyle('nav.navbar .logo img { max-height: 0; }'); //Logo ausblenden
    addGlobalStyle('.aalink.focus, #page-footer a:not([class]).focus, .arrow_link.focus, a:not([class]).focus, .activityinstance>a.focus, .aalink:focus, #page-footer a:not([class]):focus, .arrow_link:focus, a:not([class]):focus, .activityinstance>a:focus { background-color: #3C83C3; box-shadow:0 -0.2rem #3C83C3, 0 0.2rem #343a40 }'); //Change Item focus color
    addGlobalStyle('.dropdown-item.active, .dropdown-item:active { background-color:#0065a3; }'); //Change Dropdown Item Color
/***************************************************************************************************/
})() ;