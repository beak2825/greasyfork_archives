// ==UserScript==
// @name         SelectMyWorkspace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://efs-my.uspto.gov/EFSWebUIRegistered/EFSWebRegistered
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380694/SelectMyWorkspace.user.js
// @updateURL https://update.greasyfork.org/scripts/380694/SelectMyWorkspace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('My workplace').checked = true;
    document.getElementById('My workplace').click();
    saveLinkFun('saved');
    document.getElementById('pkiSaveType_1').checked = true;
    document.getElementById('pkiSaveType_1').click();
    document.getElementById('PKIadminList').selectedIndex = 1;
    document.getElementById('retrievepract').click();


})();