// ==UserScript==
// @name Fet To Discord
// @namespace FTD@fetlife.com
// @description Add new features to enhance your FetLife experience!  It's like viagra for FetLife!
// @version 1.0.0
// @author Goose
// @exclude    *://fetlife.com/events/near
// @match *://fetlife.com/events*
// @grant       GM_addStyle
// @license GPL-3.0-or-later
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/487771/Fet%20To%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/487771/Fet%20To%20Discord.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Copy Event To Clipboard</button><br />'
                ;
zNode.setAttribute ('id', 'myContainer');
    var zNode2       = document.createElement ('p');
    zNode2.innerHTML = '<a href="https://script.google.com/macros/s/AKfycbwEh0m5ZYPlpJ_1Gy6aEUBiRd_I2u8ybLRcqaJWkQh1tPySxz6tAFbX-Vi1s2tJJNlZ/exec" target="_blank">Link</a>';
    zNode.appendChild (zNode2);

document.body.appendChild (zNode);
document.getElementById ("myButton").setAttribute ('class', 'relative no-underline items-center rounded-sm select-none border link border-gray-750 bg-transparent hover:bg-transparent focus:bg-transparent text-gray-300 fill-gray-300 leading-normal text-sm py-1 px-2 hover:text-gray-300 hover:border-gray-600 light:hover:border-gray-500 font-normal text-center justify-center inline-flex');



//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */

    $.ajaxSetup({
   headers:{
       'Accept':'application/json'
   }
});

    $.get(window.location + "/discussions", (data, status) => {
        navigator.clipboard.writeText(JSON.stringify(data.stories[0].attributes.event))
});
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        bottom:                 30px;
        left:                   30px;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
    }
` );