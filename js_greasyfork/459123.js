// ==UserScript==
// @name         Spooks custom nickname
// @namespace    sdfksdfkdsfkdl;s
// @version      1.0.0
// @description  The name says it all.
// @author       KKosty4ka
// @license MIT
// @match        https://spooks.me/
// @icon         https://icons.duckduckgo.com/ip2/spooks.me.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459123/Spooks%20custom%20nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/459123/Spooks%20custom%20nickname.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    WebSocket.prototype.send = new Proxy(WebSocket.prototype.send,
    {
        apply: (target, thisArg, argumentsList) =>
        {
            var data = JSON.parse(argumentsList[0]);

            if (data.type === "connect")
            {
                data.nickname = prompt("Custom Nickname") || null;
            }

            argumentsList[0] = JSON.stringify(data);
            Reflect.apply(target, thisArg, argumentsList);
        }
    });
})();