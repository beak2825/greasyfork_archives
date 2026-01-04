// ==UserScript==
// @name         1C:ESB debug redirector
// @description  Replacing of 'debug-server-host' parameter in the query string to the current host address
// @version      1.1
// @author       Akpaev E.A.
// @namespace    https://github.com/akpaevj
// @license      MIT
// @match        http*://*/applications/*?debug-server-host=*&debug-server-port=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/477755/1C%3AESB%20debug%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/477755/1C%3AESB%20debug%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = new URL(window.location.href);

    if (url.hostname.toUpperCase() != 'LOCALHOST' && url.hostname != '127.0.0.1') {
        var debugServerHost = url.searchParams.get('debug-server-host');

        if (debugServerHost.search('localhost') >= 0) {
            var newDebugServerHost = url.hostname;
            url.searchParams.set('debug-server-host', newDebugServerHost);
            window.location.href = url.href;
        }
    }
})();