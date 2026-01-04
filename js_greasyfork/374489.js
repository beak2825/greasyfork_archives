// ==UserScript==
// @name Picarto Duo Stream Layout
// @description Changes 2-person multistream layout to be vertical instead of horizontal
// @namespace Violentmonkey Scripts
// @match https://picarto.tv/*
// @exclude-match https://picarto.tv/communities/explore                             
// @grant GM_addStyle
// @version 0.0.1.20181118115739
// @downloadURL https://update.greasyfork.org/scripts/374489/Picarto%20Duo%20Stream%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/374489/Picarto%20Duo%20Stream%20Layout.meta.js
// ==/UserScript==



// Change inner box width so that the height increases (default is 50%)
GM_addStyle(`body.channel-page .flexPlayerOuter.duo .flexPlayerInner{
              width:55% !important;
            }`);

// Wait for dom objects to be loaded, change flex direction to column
window.addEventListener('load', function () {
var elements = document.getElementsByClassName("flexPlayerOuter duo");
if(elements.length > 0)
  {    
    GM_addStyle(`body.channel-page .flexPlayerOuter
                {
                  flex-direction:column !important;
                }`);
  }

});


