// ==UserScript==
// @name         IPv6 removal by Jojo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  IPv6 Removal
// @author       You
// @match        https://www.epikchat.com/chat
// @icon         https://www.google.com/s2/favicons?domain=epikchat.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435224/IPv6%20removal%20by%20Jojo.user.js
// @updateURL https://update.greasyfork.org/scripts/435224/IPv6%20removal%20by%20Jojo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WebSocketProxy = new Proxy(window.WebSocket, {
        construct(target, args) {
            const ws = new target(...args);

            // Configurable hooks
            ws.hooks = {
                beforeSend: e => {},
                beforeReceive: e => {}
            };

            // Intercept send
            const sendProxy = new Proxy(ws.send, {
                apply(target, thisArg, args) {
                    if (ws.hooks.beforeSend(args) === false) {
                        return;
                    }
                    try{
                        let parsedArgs = JSON.parse(args.toString().substring(args.toString().indexOf('[')));
                        if(parsedArgs[0] === "userMedia"){
                            if(parsedArgs[1].candidate.candidate.match('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))')){
                                return;
                            }

                        }
                    } catch(e){
                    }
                    return target.apply(thisArg, args);
                }
            });
            ws.send = sendProxy;

            // Save reference
            window._websockets = window._websockets || [];
            window._websockets.push(ws);

            return ws;
        }
    });

    window.WebSocket = WebSocketProxy;

    // Usage
    // After a websocket connection has been created:
    window._websockets[0].hooks = {
        // Just log the outgoing request
        beforeSend: data => {},
        // Return false to prevent the on message callback from being invoked
        beforeReceive: data => false
    };

})();