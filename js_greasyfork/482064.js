// ==UserScript==
// @name         NowLearning Improver
// @namespace    http://tampermonkey.net/
// @version      2023-12-13
// @description  Makes the conten modal taller
// @author       jgriffithSN
// @match        https://nowlearning.servicenow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=servicenow.com
// @grant        GM_addStyle
// @license      GNU GPLv3
// @namespace    https://greasyfork.org/users/387107
// @downloadURL https://update.greasyfork.org/scripts/482064/NowLearning%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/482064/NowLearning%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const style = `
        .scorm-iframe { height: 80vh !important; }
`;

    (function() {
        GM_addStyle(style);
    })();

})();