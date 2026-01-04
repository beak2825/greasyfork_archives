// ==UserScript==
// @name         Zyxel Redirect Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Blocks Zyxel redirecting to HTTPS
// @author       JxxIT
// @match        http://192.168.0.1/*
// @icon         https://info.zyxel.com/hubfs/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532703/Zyxel%20Redirect%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/532703/Zyxel%20Redirect%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalOpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('load', function() {
            if (url.includes("getWebGuiFlag")) {
                try {
                    const json = JSON.parse(this.responseText);

                    json.HTTP_Redirect_HTTPS = false;
                    json.ABPY_GUI_Customization = false;
                    json.ZYXEL_TT_CUSTOMIZATION = false;

                    const modifiedResponse = JSON.stringify(json);

                    Object.defineProperty(this, 'responseText', {
                        value: modifiedResponse,
                        writable: false,
                        configurable: false,
                        enumerable: false
                    });
                } catch (error) {
                    console.error('Error modifying response:', error);
                }
            }
        });

        return originalOpen.apply(this, arguments);
    };
})();
