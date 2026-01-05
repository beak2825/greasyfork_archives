// ==UserScript==
// @name          TINYpulse top cheers
// @namespace     http://userscripts.org/users/20715
// @description   Puts the cheers to the top of the screen
// @include       https://www.dropcam.com/watch/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/3476/TINYpulse%20top%20cheers.user.js
// @updateURL https://update.greasyfork.org/scripts/3476/TINYpulse%20top%20cheers.meta.js
// ==/UserScript==

GM_addStyle('#tinypulse { position: fixed; left: 0; right: 0; top: 0; width: 100%; height: 50%; z-index: 200; }');

window.addEventListener ("load", function() {
  var
    doc = document,
    iframe = doc.createElement('iframe');

  iframe.id = 'tinypulse';
  iframe.src = 'https://www.tinypulse.com/api/cheers?api_token=7ec8d8d6786db9f7c60b54';

  doc.body.appendChild(iframe);
}, false);
