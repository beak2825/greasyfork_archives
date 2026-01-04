// ==UserScript==
// @name         Init Data
// @namespace    http://greasyfork.org/
// @version      1.0
// @description  Get the Init Data you need.
// @author       X34Bruh
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465535/Init%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/465535/Init%20Data.meta.js
// ==/UserScript==

(async () => {
    const indent = (s,n=4) => s.split('\n').map(l=>Array(n).fill(' ').join('')+l).join('\n');

    const b64 = {
        decode: s => Uint8Array.from(atob(s), c => c.charCodeAt(0)),
        encode: b => btoa(String.fromCharCode(...new Uint8Array(b)))
    };

    const fnproxy = (object, func) => new Proxy(object, { apply: func });

    const proxy = (object, key, func) => Object.hasOwnProperty.call(object, key) && Object.defineProperty(object, key, {
        value: fnproxy(object[key], func)
    });

    function messageHandler(event) {
        const keySession = event.target;
        const {sessionId} = keySession;
        const {message, messageType} = event;
        const listeners = keySession.getEventListeners('message').filter(l => l !== messageHandler);
    }

    function keystatuseschangeHandler(event) {
        const keySession = event.target;
        const {sessionId} = keySession;
        const listeners = keySession.getEventListeners('keystatuseschange').filter(l => l !== keystatuseschangeHandler);
    }

    function getEventListeners(type) {
        if (this == null) return [];
        const store = this[Symbol.for(getEventListeners)];
        if (store == null || store[type] == null) return [];
        return store[type];
    }

    EventTarget.prototype.getEventListeners = getEventListeners;

    typeof Navigator !== 'undefined' && proxy(Navigator.prototype, 'requestMediaKeySystemAccess', async (_target, _this, _args) => {
        const [keySystem, supportedConfigurations] = _args;
        return _target.apply(_this, _args);
    });

    typeof MediaKeySystemAccess !== 'undefined' && proxy(MediaKeySystemAccess.prototype, 'createMediaKeys', async (_target, _this, _args) => {
        return _target.apply(_this, _args);
    });


    if (typeof MediaKeySession !== 'undefined') {
        proxy(MediaKeySession.prototype, 'generateRequest', async (_target, _this, _args) => {
            const [initDataType, initData] = _args;
            console.groupCollapsed(
                `[EME] MediaKeySession::generateRequest\n` +
                `    Session ID: ${_this.sessionId || '(not available)'}\n` +
                `    Init Data Type: ${initDataType}\n` +
                `    Init Data: ${b64.encode(initData)}`
            );
            console.trace();
            console.groupEnd();
            return _target.apply(_this, _args);
        });

    }
})();