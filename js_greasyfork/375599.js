// ==UserScript==
// @name         Reddit remove np.
// @namespace    http://kmcgurty.com
// @version      1
// @description  Redirects np. to www.
// @author       kmcgurty
// @match        *://np.reddit.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/375599/Reddit%20remove%20np.user.js
// @updateURL https://update.greasyfork.org/scripts/375599/Reddit%20remove%20np.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.location.host = 'reddit.com';