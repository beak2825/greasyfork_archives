// ==UserScript==
// @name         LastPass password generation config
// @namespace    http://popeen.com
// @version      0.1
// @description  My LastPass password generation config for quickly generating strong passwords
// @author       Popeen
// @include      https://lastpass.com/generatepassword.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10463/LastPass%20password%20generation%20config.user.js
// @updateURL https://update.greasyfork.org/scripts/10463/LastPass%20password%20generation%20config.meta.js
// ==/UserScript==

document.getElementById('length').value = '128';
document.getElementById('mindigits').value = '15';
document.getElementById('special').checked = true;
dogenerate();