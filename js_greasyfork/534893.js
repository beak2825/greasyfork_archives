// ==UserScript==
// @name         Safari Bar Color Theme
// @version      1
// @description  Sets the safari top bar to constant color. Good for distinct different safari profiles
// @license      MIT    
// @author       @tomereliel0
// @include      *
// @grant        none
// @namespace https://greasyfork.org/users/1465491
// @downloadURL https://update.greasyfork.org/scripts/534893/Safari%20Bar%20Color%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/534893/Safari%20Bar%20Color%20Theme.meta.js
// ==/UserScript==

const theme = document.querySelector('meta[name="theme-color"]');
if (theme) theme.remove();
const meta = document.createElement('meta');
meta.name = 'theme-color';
meta.content = '#DABF74'; //Desired Theme Color
document.head.appendChild(meta);