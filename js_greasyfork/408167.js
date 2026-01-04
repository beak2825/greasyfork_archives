// ==UserScript==
// @name         Gixen Nag Screen - enable bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable the 'Continue to my account' button after Gixen login without waiting 20 seconds.
// @author       Danny Smith <danny.j.smith@gmail.com>
// @match        https://www.gixen.com/home_2.php?sessionid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408167/Gixen%20Nag%20Screen%20-%20enable%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/408167/Gixen%20Nag%20Screen%20-%20enable%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('gbutton').disabled = false;

})();

