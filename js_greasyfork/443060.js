// ==UserScript==
// @name     Hide Status button on whatsapp web
// @version  1
// @match    https://web.whatsapp.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @license GPL-v3
// @namespace https://github.com/philippludwig
// @description Hides the Status/Stories button in WhatsApp Web
// @downloadURL https://update.greasyfork.org/scripts/443060/Hide%20Status%20button%20on%20whatsapp%20web.user.js
// @updateURL https://update.greasyfork.org/scripts/443060/Hide%20Status%20button%20on%20whatsapp%20web.meta.js
// ==/UserScript==


setInterval(function () {
  var element = $("[aria-label='Status']");  
  element.remove();
}, 1000); 
