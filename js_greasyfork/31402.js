// ==UserScript==
// @name         Duelyst on Any Browser
// @namespace    Violentmonkey
// @author       Luiz Fernando Romanini
// @description  Allows you to play Duelyst game ( https://play.duelyst.com/ ) on Opera or Firefox, pretending to be on Chrome
// @match        https://play.duelyst.com/*
// @run-at       document-start
// @grant        none
// @version      1.2
// @downloadURL https://update.greasyfork.org/scripts/31402/Duelyst%20on%20Any%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/31402/Duelyst%20on%20Any%20Browser.meta.js
// ==/UserScript==

var v = navigator.platform;

if( v.startsWith( "Win" ) )
{
  Object.defineProperty( navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
  } );
}
else
{
  Object.defineProperty( navigator, 'userAgent', {
    value: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36'
  } );
}
