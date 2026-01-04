// ==UserScript==
// @name         ReCaptchas
// @namespace    http://tampermonkey.net/
// @version      v.3
// @description   https://www.facebook.com/kolotibablagregar un exclude a los domios malos
// @author       Antony https://www.facebook.com/kolotibabl
// @noframes                      


// @include      http://*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388322/ReCaptchas.user.js
// @updateURL https://update.greasyfork.org/scripts/388322/ReCaptchas.meta.js
// ==/UserScript==


document.documentElement.innerHTML += ("<embed src=''</embed>");