// ==UserScript==
// @name        kabeldeutschland.de/csc - Enable password autocompletion
// @namespace   conquerist2@gmail.com
// @include     https://www.kabeldeutschland.de/csc*
// @version     1.2
// @grant       none
// @description Enables password autocompletion by rewriting the login form to use the HTML5 input placeholder attribute.
// @downloadURL https://update.greasyfork.org/scripts/10036/kabeldeutschlanddecsc%20-%20Enable%20password%20autocompletion.user.js
// @updateURL https://update.greasyfork.org/scripts/10036/kabeldeutschlanddecsc%20-%20Enable%20password%20autocompletion.meta.js
// ==/UserScript==
// 2015 05 24 v1.2 - Fixed include
// 2015 05 24 v1.1 - Also match subpages
// 2015 05 24 v1.0 - Initial version

var dataPasswortText = document.getElementById('dataPasswortText');
var dataPasswort = document.getElementById('dataPasswort');
var dataKennung = document.getElementById('dataKennung');

dataPasswortText.parentNode.removeChild(dataPasswortText);

dataPasswort.removeAttribute('onfocus');
dataPasswort.removeAttribute('onblur');
dataPasswort.removeAttribute('value');
dataPasswort.setAttribute('placeholder','Passwort');
dataPasswort.setAttribute('style','display: block;');

dataKennung.removeAttribute('onfocus');
dataKennung.removeAttribute('onblur');
dataKennung.removeAttribute('value');
dataKennung.setAttribute('placeholder','Benutzername / E-Mail');