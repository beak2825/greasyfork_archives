// ==UserScript==
// @name        Button to go fullscreen on roll20.net
// @description A simple script to add a button on the Roll20 main site. Also hides player names in the map. Only intended for use on Firefox for Android.
// @match       https://roll20.net/welcome
// @match       https://app.roll20.net/editor/
// @grant       GM_addStyle
// @version     0.5
// @namespace   roll20FullscreenButton
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/466184/Button%20to%20go%20fullscreen%20on%20roll20net.user.js
// @updateURL https://update.greasyfork.org/scripts/466184/Button%20to%20go%20fullscreen%20on%20roll20net.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var sidebarClass = document.getElementsByClassName('col-md-4 logged-in-sidebar');
if(sidebarClass) {
    var sidebar = sidebarClass[0];

    var fullScreenButton       = document.createElement ('div');
    fullScreenButton.innerHTML = '<button id="myButton" type="button">'
        + 'Tap here to go full screen</button>'
    ;
    fullScreenButton.setAttribute ('id', 'myContainer');
    sidebar.insertBefore(fullScreenButton, sidebar.firstChild);

    document.getElementById ("myButton").addEventListener (
        "click", ButtonClickAction, false
    );
}

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    activateFullscreen(document.documentElement);
}

function activateFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();        // W3C spec
  }
  else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();     // Firefox
  }
  else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();  // Safari
  }
  else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();      // IE/Edge
  }
};

var playerzone = document.getElementById('playerzone');
if(playerzone) {
    playerzone.style.display = "none";
}

GM_addStyle ( `
    #myContainer {
        z-index:                0;
        background:             #f5f5f5;
        text-align:             center;
        font-family:            Nunito, sans-serif;
        font-weight:            900;
        font-size:              30px;
        margin:                 10px;
    }
    #myButton {
        cursor:                 pointer;
        background:             none;
        border:                 none;
    }
` );

