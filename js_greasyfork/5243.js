// ==UserScript==
// @name                        Livemixtape Show Captcha
// @version                     0.0.4
// @grant                       none
// @description                 Removes the layer which hides the captcha and shows the captcha instead.
// @include                     http://*.livemixtapes.com/download/*
// @author                      Jimmy
// @homepage                    http://81.4.109.233/public/greasyfork/livemixtape/
// @namespace                   https://greasyfork.org/users/5561
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/5243/Livemixtape%20Show%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/5243/Livemixtape%20Show%20Captcha.meta.js
// ==/UserScript==
document.getElementById("captcha").style.display='';