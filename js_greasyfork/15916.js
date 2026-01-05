// ==UserScript==
// @name         YouTube Keep Video When Scrolling
// @namespace    http://skoshy.com
// @version      0.2
// @description  Keeps the video in the same place when scrolling on a YouTube page.
// @author       Stefan Koshy
// @match        https://www.youtube.com/watch?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15916/YouTube%20Keep%20Video%20When%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/15916/YouTube%20Keep%20Video%20When%20Scrolling.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var id = 'youtubeKeepVideoWhenScrolling';

var keepVideoStyle = `
    #player .player-api {
      position: fixed;
      padding-top: 12px;
      padding-bottom: 10px;
      background: #f1f1f1;
      margin-top: -1px;
    }
    .watch-non-stage-mode #player .player-api {
      box-shadow: 1px 1px rgba(241,241,241,1),-1px 1px rgba(241,241,241,1);
    }
    .watch-stage-mode #player .player-api {
      padding-top:10px;
      padding-bottom: 0;
      margin-top: 0;
    }
`;

var otherStyle = `
    #`+id+`PinButton {
      box-sizing: border-box;
      width: 32px 
    }

    #`+id+`PinButton img {
      width: 100%;
      filter: invert(1);
      -webkit-filter: invert(1);
      padding: 3px;
      box-sizing: border-box;
    }
`;


function addGlobalStyle(css, cssID) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.id = cssID;
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(keepVideoStyle, id+'CSS');
addGlobalStyle(otherStyle, id+'OtherCSS');

// add the button to the player
var ytControls = document.querySelector('.ytp-right-controls');
var ytSettingsButton = document.querySelector('.ytp-settings-button');

var pinButton = document.createElement('button');
pinButton.innerHTML = '<img src="http://i.imgur.com/m4vqtk1.png"/>';
pinButton.id = id+'PinButton';
pinButton.className = 'ytp-button';
pinButton.onclick = function() {
    var style = document.querySelector('#'+id+'CSS');
    if (style.disabled === false)
        style.disabled = true;
    else
        style.disabled = false;
};

ytControls.insertBefore(pinButton, ytSettingsButton);