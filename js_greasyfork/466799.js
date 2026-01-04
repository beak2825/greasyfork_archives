// ==UserScript==
// @name         Auto reset / start player, when delayed/paused
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  QOL cause twitch stupid
// @author       You
// @match        *://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/466799/Auto%20reset%20%20start%20player%2C%20when%20delayedpaused.user.js
// @updateURL https://update.greasyfork.org/scripts/466799/Auto%20reset%20%20start%20player%2C%20when%20delayedpaused.meta.js
// ==/UserScript==

var MaxAllowedDelay;
var CheckTimerDelay;
var AutoDelay;
var AutoUnpauser;
var AutoCompressor;
var AutoDebuffer;

GM_config.init(
{
  'id': 'TwitchConfigs', // The id used for this instance of GM_config
  'fields': // Fields object
  {
    'CheckTimerDelay': // This is the id of the field
    {
        'label': 'How often should it check?', // Appears next to field
        'type': 'int', // Makes this setting a text field
        'min': 1,
        'max': 100,
        'default': 15 // Default value if user doesn't change it
    },
    'MaxAllowedDelay': // This is the id of the field
    {
        'label': 'Max Delayed before reset', // Appears next to field
        'type': 'int', // Makes this setting a text field
        'min': 1,
        'max': 100,
        'default': 7 // Default value if user doesn't change it
    },
    'AutoDelay': // This is the id of the field
    {
      'label': 'Should it auto reset when over max allowed delay?', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': true // Default value if user doesn't change it
    },
    'AutoDebuffer': // This is the id of the field
    {
      'label': 'Should it auto reset when buffering?', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': true // Default value if user doesn't change it
    },
    'AutoUnpauser': // This is the id of the field
    {
      'label': 'Should it unpause when player is paused?', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': true // Default value if user doesn't change it
    },
    'AutoCompressor': // This is the id of the field
    {
      'label': 'Should it automatically enable compressor?', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': true // Default value if user doesn't change it
    }
  }
});


(function() {
    'use strict';
    //Check if numpad + Key is pressed to open config menu
    document.addEventListener('keydown', function(event) {
        if (event.code === 'NumpadAdd') {
            GM_config.open();
        }
    });

    //This gets the settings for the pause menu
    MaxAllowedDelay = parseInt(GM_config.get('MaxAllowedDelay'));
    CheckTimerDelay = parseInt(GM_config.get('CheckTimerDelay'));
    AutoDelay = GM_config.get('AutoDelay');
    AutoUnpauser = GM_config.get('AutoUnpauser');
    AutoCompressor = GM_config.get('AutoCompressor');
    AutoDebuffer = GM_config.get("AutoDebuffer");


setInterval(() => {
    //Every time we do through the cycle update the settings incase of it changing
    MaxAllowedDelay = parseInt(GM_config.get('MaxAllowedDelay'));
    CheckTimerDelay = parseInt(GM_config.get('CheckTimerDelay'));
    AutoDelay = GM_config.get('AutoDelay');
    AutoUnpauser = GM_config.get('AutoUnpauser');
    AutoCompressor = GM_config.get('AutoCompressor');

    //Checks if the delay is higher then settings if so reset player (IF ENABLED)
    if(AutoDelay == true){
    const statTexts = document.querySelectorAll(".ffz-stat-text");
    const statText = statTexts[1];
    const statValue = parseFloat(statText.innerText);
        if (statValue > MaxAllowedDelay) {
            resetPlayer();
        }
    }

    //Checks if the stream is paused if so, Click play button to start stream (IF ENABLED)
    if(AutoUnpauser == true){
        autoUnPauser();
    }

    //Check if compressor is turned off, if so enable it (IF ENABLED)
    if(AutoCompressor == true){
        enableCompressor()
    }

    //Check if you're buffering, if so reset player (IF ENABLED)
    if(AutoDebuffer == true){
        autoResetPlayerBuffering();
    }

}, CheckTimerDelay * 1000); //Gets how many seconds from config, then convert them to milliseconds
})();


function resetPlayer()
{
    var figure = document.querySelector(".ffz-player-icon.ffz-i-t-reset");
    var parent = figure.parentElement;

    // Find the button with aria-label "Reset Player (Double-Click)"
    while (parent != null && !parent.hasAttribute("aria-label")) {
      parent = parent.parentElement;
    }

    if (parent != null && parent.tagName === "BUTTON" && parent.getAttribute("aria-label") === "Reset Player (Double-Click)") {
      const event = new MouseEvent("dblclick", {
        bubbles: true,
        cancelable: true
      });
      parent.dispatchEvent(event);
    }
}

function enableCompressor()
{
    // Find the first <div> element with class "ffz--player-comp"
const playerComp = document.querySelector('div.ffz--player-comp');
// Get the child <button> element
const button = playerComp.querySelector('button');
// Check if the button is disabled
if (button && button.getAttribute('aria-label') !== 'Disable Audio Compressor') {
// Click the button
button.click();
}
}

function autoUnPauser()
{
    const buttons = document.querySelectorAll('button');
for (let i = 0; i < buttons.length; i++) {
  const button = buttons[i];
  if (button.getAttribute('aria-label') === 'Play') {
    button.click();
    break;
  }
}
}

function autoResetPlayerBuffering(){
    // Search for elements with the specified class
const elements = document.getElementsByClassName('Layout-sc-1xcs6mc-0 kUDtlR video-player__container video-player__container--resize-calc');

// Loop through the found elements
for (let i = 0; i < elements.length; i++) {
  const element = elements[i];

  // Check if the data-buffering attribute is true
  const isBuffering = element.getAttribute('data-buffering') === 'true';

  // Perform an action if data-buffering is true
  if (isBuffering) {
    resetPlayer();
  }
}
}