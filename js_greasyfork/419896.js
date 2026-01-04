// ==UserScript==
// @name         Elethor WebSocket override for window hook
// @description  Overrides the WebSocket class and hooks any new instance of a WebSocket to a window.socket reference
// @namespace    https://www.elethor.com/
// @version      1.0.0
// @author       Xortrox
// @match        https://elethor.com/*
// @match        https://www.elethor.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419896/Elethor%20WebSocket%20override%20for%20window%20hook.user.js
// @updateURL https://update.greasyfork.org/scripts/419896/Elethor%20WebSocket%20override%20for%20window%20hook.meta.js
// ==/UserScript==

(function(){
    const moduleName = 'Elethor WebSocket Hook';
    console.log(`[${moduleName}] Loaded.`);

    Hook();

    /** 
     * Replaces the class reference of "WebSocket" with a function that binds any new instance to "window.socket"
     * This has no impact on the WebSocket class itself.
     */
    function Hook() {
        const OldSocket = WebSocket;

        window.WebSocket = function () {
            console.log(`[${moduleName}] WebSocket hook successful.`);
            const socket = new OldSocket(...arguments);
            window.socket = socket;

            return socket;
        }
    };
})();