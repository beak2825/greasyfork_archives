// ==UserScript==
// @name            Doodle God Filter
// @author          BobTheCoolGuy
// @description     Tries to save you from Doodle God talk on Kongregate!
// @include         http://www.kongregate.com/games/*/*
// @homepage        
// @version 0.0.1.20160306135351
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17776/Doodle%20God%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/17776/Doodle%20God%20Filter.meta.js
// ==/UserScript==
if (/^\/?games\/[^\/]+\/[^\/?]+(\?.*)?$/.test(window.location.pathname))
setTimeout(function() {
var matcher = /element|do+[dle]{1,3}|(\+[\s\S]*?[?=])/i
unsafeWindow.holodeck.addIncomingMessageFilter(function(s,e){if(matcher.test(s))e("");else e(s);});
}, 1250)