// ==UserScript==
// @name         N School Auto Redirect
// @namespace    me.nzws.us.nnn_ed_nico_redirect
// @version      1.0.0
// @description  N予備校でログイン中はホームに自動リダイレクト
// @author       nzws
// @match        https://www.nnn.ed.nico/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387813/N%20School%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/387813/N%20School%20Auto%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://api.nnn.ed.nico/v1/users', {
        method: 'GET',
        credentials: 'include'
    }).then(response => {
        if (response.ok) location.href = '/home';
    })
})();