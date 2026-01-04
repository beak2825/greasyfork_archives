// ==UserScript==
// @name         Text Mechanic unlocker
// @description  Locks `uses` at 0 on textmechanic.com
// @version      0.1
// @author       LuK1337
// @match        *://textmechanic.com/*
// @grant        none
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @run-at       document-start
// @namespace    https://greasyfork.org/users/721956
// @downloadURL https://update.greasyfork.org/scripts/419316/Text%20Mechanic%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/419316/Text%20Mechanic%20unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    xhook.after(function(request, response) {
        if (request.url === '/wp-admin/admin-ajax.php') {
            response.text = '{"uses":"0","status":"SUCCESS"}';
        }
    });
})();