// ==UserScript==
// @name         Hide Github Recommended for you
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide Github Recommened Followers
// @author       Harisankar P S
// @match        https://github.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447527/Hide%20Github%20Recommended%20for%20you.user.js
// @updateURL https://update.greasyfork.org/scripts/447527/Hide%20Github%20Recommended%20for%20you.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('testing');
    setInterval(function () {
        [... document.querySelectorAll('h5')].filter(el => el.textContent.includes('Recommended based on people you follow')).forEach(function(i) { i.parentElement.parentElement.remove() });
    }, 1000);

})();