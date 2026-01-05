// ==UserScript==
// @name        Simple Redirecter| Karzz
// @namespace   Simple redirector
// @description On any web page it will check if the clicked links and can be redirected to proxy site etc
// @match       *://extratorrent.cc/*
// @match       *://infosec.usaa.com/*
// @match       *://www.extratorrent.cc/*
// @version     2025.10.18
// @grant       none
// @author      Karthik (@skarthik345)
// @license     GNU LGPL v3 (https://www.gnu.org/licenses/lgpl-3.0.html)
// @downloadURL https://update.greasyfork.org/scripts/22874/Simple%20Redirecter%7C%20Karzz.user.js
// @updateURL https://update.greasyfork.org/scripts/22874/Simple%20Redirecter%7C%20Karzz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace((document.location + "").replace("extratorrent.cc", "extratorrent.unblockall.xyz"));
    window.location.replace((document.location + "").replace("https://infosec.usaa.com/permchecker/SecurityGroupResults.aspx?group=", "https://apps.usaa.com/internal/paws/group/"));
})();