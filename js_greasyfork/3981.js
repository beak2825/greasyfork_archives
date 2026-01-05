// ==UserScript==
// @name         Easy To See - Greasy Fork Errors
// @namespace    http://www.diamonaddownload.weebly.com
// @version      1.1
// @description  Makes errors more visible
// @include      *greasyfork.org/scripts/*/versions
// @copyright    2014+, RGSoftware
// @run-at       document-body
// @author       R.F Geraci
// @icon64       http://icons.iconarchive.com/icons/icons8/android/64/Food-Fork-icon.png
// @downloadURL https://update.greasyfork.org/scripts/3981/Easy%20To%20See%20-%20Greasy%20Fork%20Errors.user.js
// @updateURL https://update.greasyfork.org/scripts/3981/Easy%20To%20See%20-%20Greasy%20Fork%20Errors.meta.js
// ==/UserScript==

//====CUSTOM====

var Interval = 250;
var AmountOfFades = 6; //Choose only even numbers
var FadeHighestOpacity = "100";
var FadeLowestOpacity = "0";

var BoxColour = "#039CCC";
var BoxPadding = "5px";
var BoxMargin = "5px";
var BoxBorder = "1px dashed black";
var BoxBorderRadius = "2px";
var BoxTransitionSpeed = "0.25s";

//Good idea to set the interval the same as the BoxTransitionSpeed

//==============


window.onload = function(){
    
    var On = false;
    var Fcount = 0;
    var errors = document.getElementsByClassName('errors')[0];
    
    if (errors){
        errors.setAttribute('style', 'background: ' + BoxColour + ';' 
                            + ' padding: ' + BoxPadding + ';' + ' margin: ' + BoxMargin + ';' + ' border: ' 
                            + BoxBorder + ';' + ' border-radius: ' + BoxBorderRadius + ';' + ' -webkit-transition: opacity ' 
                            + BoxTransitionSpeed + ';' + ' opacity: 0');  
    }
    
    function Animate(){
        
        On = !On;
        
        if (Fcount <= AmountOfFades){
            if (On){
                errors.style.opacity = FadeHighestOpacity;
            }else{
                errors.style.opacity = FadeLowestOpacity;
            }
            Fcount += 1;
        }
    }
    
    window.setInterval(Animate, Interval);
    
};


