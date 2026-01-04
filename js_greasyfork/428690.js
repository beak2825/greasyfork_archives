// ==UserScript==
// @name         Get CanvasID
// @namespace    https://greasyfork.org/es/scripts/428690-get-canvasid
// @version      1.0
// @description  Tested on udp.instructure.com
// @author       Nicolás Boettcher
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://*.instructure.com/profile
// @match        https://*.instructure.com/courses/*/users/
// @icon         https://img2.freepng.es/20180404/isq/kisspng-computer-software-logo-id-software-clip-art-software-5ac4ea201ecfa4.8470427715228544321262.jpg
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#sha512=E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428690/Get%20CanvasID.user.js
// @updateURL https://update.greasyfork.org/scripts/428690/Get%20CanvasID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var key=CryptoJS.SHA256(Object.values(ENV.current_user_id).join('')).toString(); //hashing the ID using SHA256
    var start=9;
    var shift=10;
    var range=3;
    var key1=key.substring(start,start+range);
    var key2=key.substring(start+shift,start+shift+range);
    console.log("Your CanvasID is: "+Object.values(ENV.current_user_id).join('')); // return a SHA256 based hash with length equal to range*2
    console.log("Your HashID is: "+key1.concat(key2))
})();