// ==UserScript==
// @name         Stay Logged In
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  this keeps you logged into bamboo hr
// @author       🛠️ with ❤ by @rocketdv
// @match        *://*.bamboohr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449780/Stay%20Logged%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/449780/Stay%20Logged%20In.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const refreshSession = async () => {
        const checkSession = await Ajax.get('/auth/check_session')

        const resp = await Ajax.post('/ajax/refresh_session.php', {
            method: 'POST',
            headers: {
                'x-csrf-token': checkSession.data.CSRFToken
            }
        })
    }
    refreshSession()
    setInterval(refreshSession, 60 * 15 * 1000)
})();