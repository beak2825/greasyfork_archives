// ==UserScript==
// @name         CUNYFirst login error redirector
// @namespace    Soon
// @version      0.1
// @description  automatically redirects to CUNYFirst when you get login error page (https://i.imgur.com/6t3Tq4p.png)
// @author       Creami#1234
// @license      MIT
// @run-at       document-start
// @match        https://home.cunyfirst.cuny.edu/psc/cnyihprd/EMPLOYEE/EMPL/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL?cmd=login&errorCode=105&languageCd=ENG
// @icon         https://seeklogo.com/images/C/cuny-logo-E85957DB00-seeklogo.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449077/CUNYFirst%20login%20error%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/449077/CUNYFirst%20login%20error%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.location.href = 'https://home.cunyfirst.cuny.edu/psc/cnyihprd/EMPLOYEE/EMPL/c/NUI_FRAMEWORK.PT_LANDINGPAGE.GBL';
})();