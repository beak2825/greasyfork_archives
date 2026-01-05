// ==UserScript==
// @name         Reddit remove np.
// @namespace    http://kmcdeals.com
// @version      1
// @description  redirects np.reddit.com links to regular reddit
// @author       kmc - admin@kmcdeals.com
// @match        *://np.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15600/Reddit%20remove%20np.user.js
// @updateURL https://update.greasyfork.org/scripts/15600/Reddit%20remove%20np.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.location.host = 'reddit.com';