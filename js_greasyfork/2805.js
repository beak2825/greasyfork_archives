// ==UserScript==
// @name        Clean Up Google!
// @namespace   ic55-userscript-normalgoogle
// @description Removes doodles, ads, and many other annoyances on the Google main page
// @include     *www.google.*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2805/Clean%20Up%20Google%21.user.js
// @updateURL https://update.greasyfork.org/scripts/2805/Clean%20Up%20Google%21.meta.js
// ==/UserScript==

//define elements to be removed
var gLogo = document.getElementById('hplogo'); //any logo + share buttons
var chromeAd = document.getElementById('prt'); //advertisment for Google Chrome
var textAd = document.getElementById('prm-pt'); //text below search bar
//define required elements for logo change
var newLogo = document.createElement('img');
var logoSpace = document.getElementById('lga');

//remove elements
chromeAd.parentNode.removeChild(chromeAd);
textAd.parentNode.removeChild(textAd);
gLogo.parentNode.removeChild(gLogo);

//insert new logo
newLogo.id = 'hplogo'; //must be hplogo to hide on auto search
newLogo.src = 'http://www.google.com/images/srpr/logo9w.png';
newLogo.style = 'padding-top: 110px; height: 95px; width: 269px;';
logoSpace.insertBefore(newLogo, logoSpace.childNodes[0]);