// ==UserScript==
// @namespace Proofpoint_URL_decoder
// @name Proofpoint URLdefence Link Revealer
// @description When Proofpoint URLdefence redirects your email links to a "Web Site Has Been Blocked!" page, this script adds a clickable link to the original (blocked) URL to that page, permitting you to bypass the block at your own discretion.
// @version 1.0
// @icon https://www.proofpoint.com
// @match *://urldefense.proofpoint.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/370077/Proofpoint%20URLdefence%20Link%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/370077/Proofpoint%20URLdefence%20Link%20Revealer.meta.js
// ==/UserScript==


var u = /(?:\?|&)u=([^&#]*)(?:&|$)/.exec(location.search), el = document.body.firstElementChild||document.body;
if (u&&(u = u[1]))
{
/*
  // decode proofpoint's encoding of the URL:  (ALTERNATE METHOD)
  u = u.replace(/-3A/g, ":").replace(/_/g, "/").replace(/-7E/g, "~").replace(/-2560/g, "`").replace(/-21/g, "!").replace(/-40/g, "@").replace(/-23/g, "#")
       .replace(/-24/g, "$").replace(/-25/g, "%").replace(/-255E/g, "^").replace(/-26/g, "&").replace(/-2A/g, "*").replace(/-28/g, "(").replace(/-29/g, ")")
       .replace(/-5F/g, "_").replace(/-2B/g, "+").replace(/-2D/g, "-").replace(/-3D/g, "=").replace(/-257B/g, "{").replace(/257D/g, "}").replace(/-257C/g, "|")
       .replace(/-5B/g, "[").replace(/-5D/g, "]").replace(/-255C/g, "\\").replace(/-26quot-3B/g, "\"").replace(/-3B/g, ";").replace(/-26-2339-3B/g, "'").replace(/-26lt-3B/g, "<")
       .replace(/-26gt-3B/g, ">").replace(/-3F/g, "?").replace(/-2C/g, ",");
*/
  u = decodeURIComponent(u.replace(/_/g, "/").replace(/-/g, "%"));  // decode proofpoint's encoding of the URL
  u = document.createElement("div").appendChild(document.createTextNode(u)).parentNode.innerHTML.replace(/"/g,"&quot;");  // HTML encode the result
  el.style.overflow = "visible";
  el = el.appendChild(document.createElement("div"));
  el.style.margin = "-20px 40px 30px";
  el.innerHTML = '<div style="font-size:125%;font-weight:bold;color:red;float:left;padding-right:20px;margin:-2px 0 5px">CONTINUE AT YOUR OWN RISK:</div>' +
                 '<div style="display:inline-block;max-width:100%;word-wrap:break-word;position:relative;z-index:999"><a style="background-color:rgba(255,255,255,0.75)" href="'+u+'">'+u+'</a></div>';
}
