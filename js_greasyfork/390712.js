// ==UserScript==
// @name         CMCC-WEB login script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Screw CMCC's login website, this is the audologin scrip for JXUST
// @author       HuangCan
// @match        http://211.138.211.1:8080/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390712/CMCC-WEB%20login%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/390712/CMCC-WEB%20login%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('bpssUSERNAME').value='phonenumber';
    document.getElementById('bpssBUSPWD').value='password';
    document.getElementById('button2').click();
})();