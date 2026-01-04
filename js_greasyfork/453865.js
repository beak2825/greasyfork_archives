// ==UserScript==
// @name         Auto change nus soc mail area to nusstu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto change nus soc mail area to student (nusstu)
// @author       You
// @license MIT
// @match        https://webmail.comp.nus.edu.sg/?_task=mail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453865/Auto%20change%20nus%20soc%20mail%20area%20to%20nusstu.user.js
// @updateURL https://update.greasyfork.org/scripts/453865/Auto%20change%20nus%20soc%20mail%20area%20to%20nusstu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#rcmloginhost").value = "tls://stuimaphost.comp.nus.edu.sg"
    // Your code here...
})();