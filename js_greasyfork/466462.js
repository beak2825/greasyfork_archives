// ==UserScript==
// @namespace       https://greasyfork.org/fr/users/868328-invincible812
// @name            Uptobox Redirect
// @name:fr         Uptobox Redirect
// @match           *://uptobox.com/**
// @match           *://uptostream.com/**
// @grant           none
// @version         1.0
// @author          Invincible812
// @description     Redirect uptobox.com and uptostream.com urls to uptobox.fr
// @description:fr  Redirection de liens uptobox.com et uptostream.com vers uptobox.fr
// @supportURL      https://greasyfork.org/fr/users/868328-invincible812
// @icon            https://i.ibb.co/V3ZpCgs/uptobox-redirector.png
// @license         MIT
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/466462/Uptobox%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/466462/Uptobox%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname === 'uptobox.com') {
        window.location.replace('https://uptobox.fr' + window.location.pathname);
    }
    if (window.location.hostname === 'uptostream.com') {
        window.location.replace('https://uptostream.fr' + window.location.pathname);
    }
})();