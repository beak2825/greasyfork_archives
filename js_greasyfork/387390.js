// ==UserScript==
// @name         Kindle-Text
// @description  Adds live button, show a new window for copy Kindle text. CHANGE @match regarding your reader URL
// @author       obook
// @version	 2
// @licence      MIT License (MIT)
// @namespace    Violentmonkey Scripts
// @match        https://lire.amazon.fr/*
// @match        https://read.amazon.com/*
// @icon         https://m.media-amazon.com/images/G/01/kindle/dp/p2e_kcp_logo._CB494437007_.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/387390/Kindle-Text.user.js
// @updateURL https://update.greasyfork.org/scripts/387390/Kindle-Text.meta.js
// ==/UserScript==

/*
 * 
 * Sources :
 * 
 * https://stackoverflow.com/questions/11638595/how-do-i-access-an-iframes-javascript-from-a-userscript
 * https://stackoverflow.com/questions/7675909/how-to-insert-javascript-code-in-the-body-instead-of-head-in-greasemonkey
 * https://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey
 * 
 * */

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        bottom:                 0;
        left:                   0;
        font-size:              20px;
        background:             white;
        border:                 0px outset black;
        margin:                 5px;
        opacity:                0.4;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }


    #RawButton  {
        //position:               absolute;
        // position:fixed;
        top:                 0;
        background:             white;
        color:                  red;
        opacity:                0.4;
    }
` );

// Inject New Window Opener Script
var newScript = document.createElement( 'script'); //create a script tag
newScript.type = 'text/javascript'; // add type attribute
newScript.innerHTML = 'function NewTextWindow(){new_window=window.open();new_window.document.body.innerHTML = $(\'iframe\').contents().find(\'iframe\').contents().find(\'body\').get(1).innerHTML; }'; // add content i.e. function definition and a call
document.body.appendChild(newScript); // Insert it as the last child of body

function AccessToFramedJS ($) {
    $("body").prepend ('<button id="RawButton">Raw</button>');
  
    $("#RawButton").click ( function () {
      NewTextWindow (); // toucher une fonction d'une frame
    } );
    /* tests
    var zNode       = document.createElement ('div');
    zNode.innerHTML = '<button id="myButton" type="button">'
                    + 'For Pete\'s sake, don\'t click me!</button>';
    zNode.setAttribute ('id', 'myContainer');
    //$("body").appendChild(zNode);
    document.body.appendChild (zNode);
    $("#myButton").click ( function () {
      NewTextWindow (); // toucher une fonction d'une frame
    } );
    */
}

function withPages_jQuery (NAMED_FunctionToRun) {
    //--- Use named functions for clarity and debugging...
    var funcText        = NAMED_FunctionToRun.toString ();
    var funcName        = funcText.replace (/^function\s+(\w+)\s*\((.|\n|\r)+$/, "$1");
    var script          = document.createElement ("script");
    script.textContent  = funcText + "\n\n";
    script.textContent += 'jQuery(document).ready(function() {'+funcName+'(jQuery);});';
    document.body.appendChild (script);
};

if (window.top === window.self) {
    //--- To get at iFramed JS, we must inject our JS.
    withPages_jQuery (AccessToFramedJS);
}
