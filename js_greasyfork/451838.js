// ==UserScript==
// @name         AutoEZProxy
// @match        *://ieeexplore.ieee.org/*
// @run-at       document-start
// @grant        none
// @version      0.1
// @namespace    3van0.autoezproxy
// @license      MIT
// @description  Automatically add the url prefix for EZProxy of the University of Alberta
// @author       3van0
// @icon         https://www.ualberta.ca/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/451838/AutoEZProxy.user.js
// @updateURL https://update.greasyfork.org/scripts/451838/AutoEZProxy.meta.js
// ==/UserScript==


// See https://www.library.ualberta.ca/services/off-campus-access
// Currently only works on IEEE Xplore
// More sites are to be added

var proxyPrefix = "https://login.ezproxy.library.ualberta.ca/login?url=";

var newURL = (proxyPrefix
              + window.location.protocol + "//"
              + window.location.host
              + window.location.pathname
              + window.location.search
              + window.location.hash
             );
window.location.replace (newURL);