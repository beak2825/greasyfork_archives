// ==UserScript==
// @name         Localized map and map labels for Geoguessr
// @namespace    geoguessr_anon
// @version      1.5.0
// @description  Replaces default map and map labels on Geoguessr with localized ones.
// @author       Anon
// @license      WTFPL
// @match        https://*.geoguessr.com/*
// @match        https://maps.googleapis.com/maps/api/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.webRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/445347/Localized%20map%20and%20map%20labels%20for%20Geoguessr.user.js
// @updateURL https://update.greasyfork.org/scripts/445347/Localized%20map%20and%20map%20labels%20for%20Geoguessr.meta.js
// ==/UserScript==
var address = (window.location.href);
var valid_address = RegExp('https://www.geoguessr\.com[^.].*');
//console.log(valid_address.test(address));
//console.log(valid_address);
//console.log(address);
//--- Abort the script if top-level page isn't geoguessr.
if (!valid_address.test(address)) {
    return
    };

var langcodes = document.createElement('a');
langcodes.textContent = 'Language Code';
langcodes.href = 'https://developers.google.com/maps/faq#languagesupport';
langcodes.target = 'blank';
var regioncodes = document.createElement('a');
regioncodes.textContent = "Region Code (use the tags with type 'region')";
regioncodes.href = 'https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry';
regioncodes.target = 'blank';
//--- Initialize our config menu.
GM_config.init(
{
  'id': 'geo_mapconfig',
  'title': 'Geoguessr Language/Region Settings',
  'fields':
  {
    'Language':
    {
      'label': langcodes,
      'type': 'text',
      'title': 'Enter a two-letter language code.',
      'default': 'en'
    },
    'Region':
    {
      'label': regioncodes,
      'type': 'text',
      'title': 'Enter a two-letter region code.',
      'default': 'us'
    },
    'Show':
    {
      'label': 'Start with config open',
      'type': 'checkbox',
      'title': 'Uncheck this to hide the config window on startup',
      'default': 'true'
    },
  }
});

'use strict';
var map_lang = GM_config.get('Language');
var map_reg = GM_config.get('Region');
//--- Intercept the google maps API request and change the language and region codes to what was configured.
GM.webRequest([
  { selector: 'https://maps.googleapis.com/maps/api/js?key=*&v=*&libraries=places,drawing&language=*&region=*', action: { redirect: { from: "(.+)([A-Za-z0-9_]{39})(&v=)([0-9.]{1,4})(&libraries=places,drawing)(&language=)(?:..)(&region=)(?:..)", to: "$1$2$3$4$5$6" + map_lang + "$7" + map_reg } } },
]//, function(info, message, details) {
     //console.log(info, message, details);
//}
);
//--- Open the config on first launch.
if (GM_config.get('Show') == true) {
  GM_config.open('geo_mapconfig');
}

//--- Wait for page to be fully loaded before adding our config button.
window.addEventListener ("load", pageFullyLoaded);
function pageFullyLoaded () {
  var zNode = document.createElement ('div');
  zNode.innerHTML = '<button id="myButton" type="button">Map Language</button>';
  zNode.setAttribute ('id', 'myContainer');
  document.body.appendChild (zNode);

  //--- Activate the newly added button.
  document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
  );

  function ButtonClickAction (zEvent) {
  //--- Open the config when it's clicked.
    GM_config.open('geo_mapconfig')
  }

  //--- Style the button. It's not perfect but it's good enough, feel free to fix it if you're good at this kind of stuff.
  GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    19px;
        left:                   32px;
        opacity:                1.0;
        z-index:                1100;
    }
    #myButton {
        cursor:                 pointer;
        background:             #6cb928;
        font-family:            neo-sans;
        font-size:              0.75rem;
        font-style:             italic;
        font-weight:            700;
        padding:                0.4rem 1rem;
        color:                  white;
        border:                 0px;
        margin:                 0px;
        opacity:                1.0;
        border-radius:          3.75rem;
        align-items:            center;
        justify-content:        center;
        text-transform:         uppercase;
        transition-duration:    0s;
    }
    #myButton:hover {
        transform: scale(1.06);
    }
` );
}

//USEFUL LINKS//
// List of Google Maps API language codes can be found here (determines the language of labels on your map):
// https://developers.google.com/maps/faq#languagesupport

// List of Google Maps API region codes can be found here (determines the regional variation of your map):
// https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
// Note: Use the tags with type 'region'

//NOTES//
// If you change language settings during a game, you'll need to refresh the page before the changes show.
// If you're playing competitive or something, this could potentially be seen as cheating, so keep that in mind, and okay it with whomever beforehand. :)
// I've only tested this using Firefox/Tampermonkey, YMMV with other browsers/userscript engines (GM_webRequest is not amazingly documented).

//CHANGELOG//
// 1.4:
// Should now work on all gamemodes.
// Should now work with all geoguessr UI languages (though I think they might have removed the option entirely as I can't find it to test).
// Simplified configuration somewhat.

// 1.4.1:
// Works with the new map version (coulda had the new version the entire time, now I think about it).
// Should now work without needing to F5 after entering a game from some pages.

// 1.5.0:
// No longer requires an API key to be supplied by the user.
// Now has a configuration mechanism.
// Now has a fancy button in the top-left (I know it's not completely identical to the native buttons, but I'm a novice and it's close enough).
// Uploaded to Greasy Fork, no more ugly pastebins!

// To-do:
// More elegant way to restrict it to GeoGuessr.
// It might run on other pages that have google maps iframes due to the @match for the google maps API, which seems to be required to get GM_webRequest to work.
// Right now it aborts the script if it detects the page it's running on isn't GeoGuessr, but the script still technically ran something.
