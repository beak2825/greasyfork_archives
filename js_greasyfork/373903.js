// ==UserScript==
// @name         EME Logger
// @namespace    http://greasyfork.org/
// @version      2.0
// @description  Inject EME interface and log its function calls.
// @author       cramer
// @match        *://*/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/373903/EME%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/373903/EME%20Logger.meta.js
// ==/UserScript==

(async () => {
    const disabledKeySystems = GM_getValue('disabledKeySystems', []);

    const commonKeySystems = {
        'Widevine': /widevine/i,
        'PlayReady': /playready/i,
        'FairPlay': /fairplay|fps/i,
        'ClearKey': /clearkey/i,
    };
    for (const [keySystem, rule] of Object.entries(commonKeySystems)) {
        if (disabledKeySystems.indexOf(keySystem) >= 0) {
            GM_registerMenuCommand(`Enable ${keySystem} (and refresh)`, function() {
                GM_setValue('disabledKeySystems', disabledKeySystems.filter(k => k !== keySystem));
                location.reload();
            });
        } else {
            GM_registerMenuCommand(`Disable ${keySystem} (and refresh)`, function() {
                GM_setValue('disabledKeySystems', [...disabledKeySystems, keySystem]);
                location.reload();
            });
        }
    }

    function isKeySystemDisabled(keySystem) {
        for (const disabledKeySystem of disabledKeySystems) {
            if (keySystem.match(commonKeySystems[disabledKeySystem])) return true;
        }
        return false
    }

    // Color constants
    const $ = {
        INFO: '#66d9ef',
        VALUE: '#4ec9a4',
        METHOD: '#569cd6',
        SUCCESS: '#a6e22e',
        FAILURE: '#6d1212',
        WARNING: '#fd971f',
    };

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
        console.groupCollapsed(
            `%c[EME] (EVENT)%c MediaKeySession::message%c\n` +
            `Session ID: %c%s%c\n` +
            `Message Type: %c%s%c\n` +
            `Message: %c%s%c\n` +
            `Listeners:`,

            `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
            `color: ${$.VALUE}; font-weight: bold;`, sessionId || '(not available)', `color: inherit; font-weight: normal;`,
            `color: ${$.VALUE}; font-weight: bold;`, messageType, `color: inherit; font-weight: normal;`,
            `font-weight: bold;`, b64.encode(message), `font-weight: normal;`,
            listeners,
        );
        console.trace();
        console.groupEnd();
    }

    function keyStatusColor(status) {
        switch(status.toLowerCase()) {
            case 'usable':
                return $.SUCCESS;
            case 'output-restricted':
            case 'output-downscaled':
            case 'usable-in-future':
            case 'status-pending':
                return $.WARNING;
            case 'expired':
            case 'released':
            case 'internal-error':
            default:
                return $.FAILURE;
        }

    }

    function keystatuseschangeHandler(event) {
        const keySession = event.target;
        const {sessionId} = keySession;
        const listeners = keySession.getEventListeners('keystatuseschange').filter(l => l !== keystatuseschangeHandler);
        let keysFmt = '';
        const keysText = [];
        keySession.keyStatuses.forEach((status, keyId) => {
            keysFmt += `    %c[%s]%c %s%c\n`;
            keysText.push(
                `color: ${keyStatusColor(status)}; font-weight: bold;`,
                status.toUpperCase(),
                `color: ${$.VALUE};`,
                b64.encode(keyId),
                `color: inherit; font-weight: normal;`,
            );
        });
        console.groupCollapsed(
            `%c[EME] (EVENT)%c MediaKeySession::keystatuseschange%c\n` +
            `Session ID: %c%s%c\n` +
            `Key Statuses:\n` + keysFmt +
            'Listeners:',

            `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
            `color: ${$.VALUE}; font-weight: bold;`, sessionId || '(not available)', `color: inherit; font-weight: normal;`,
            ...keysText,
            listeners,
        );
        console.trace();
        console.groupEnd();
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
        const enterMessage = [
            `%c[EME] (CALL)%c Navigator::requestMediaKeySystemAccess%c\n` +
            `Key System: %c%s%c\n` +
            `Supported Configurations:\n`,

            `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
            `color: ${$.VALUE}; font-weight: bold;`, keySystem, `color: inherit; font-weight: normal;`,
            indent(JSON.stringify(supportedConfigurations, null, '    ')),
        ];
        let result, err;
        try {
            if (isKeySystemDisabled(keySystem)) {
                throw new DOMException(`Unsupported keySystem or supportedConfigurations.`, `NotSupportedError`);
            }
            result = await _target.apply(_this, _args);
            return result;
        } catch(e) {
            err = e;
            throw e;
        } finally {
            console.groupCollapsed(...enterMessage);
            if (err) {
                console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
            } else {
                console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, result);
            }
            console.trace();
            console.groupEnd();
        }
    });

    typeof MediaKeySystemAccess !== 'undefined' && proxy(MediaKeySystemAccess.prototype, 'createMediaKeys', async (_target, _this, _args) => {
        const enterMessage = [
            `%c[EME] (CALL)%c MediaKeySystemAccess::createMediaKeys%c\n` +
            `Key System: %c%s%c\n` +
            `Configurations:\n`,

            `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
            `color: ${$.VALUE}; font-weight: bold;`, _this.keySystem, `color: inherit; font-weight: normal;`,
            indent(JSON.stringify(_this.getConfiguration(), null, '    ')),
        ];
        let result, err;
        try {
            result = await _target.apply(_this, _args);
            return result;
        } catch(e) {
            err = e;
            throw e;
        } finally {
            console.groupCollapsed(...enterMessage);
            if (err) {
                console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
            } else {
                console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, result);
            }
            console.trace();
            console.groupEnd();
        }
    });

    if (typeof MediaKeys !== 'undefined') {
        proxy(MediaKeys.prototype, 'setServerCertificate', async (_target, _this, _args) => {
            const [serverCertificate] = _args;
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeys::setServerCertificate%c\n` +
                `Server Certificate:`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                b64.encode(serverCertificate),
            ];
            let result, err;
            try {
                result = await _target.apply(_this, _args);
                return result;
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, result);
                }
                console.trace();
                console.groupEnd();
            }
        });

        proxy(MediaKeys.prototype, 'createSession', (_target, _this, _args) => {
            const [sessionType] = _args;
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeys::createSession%c\n` +
                `Session Type: %c%s`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, sessionType || 'temporary (default)',
            ];
            let session, err;
            try {
                session = _target.apply(_this, _args);
                session.addEventListener('message', messageHandler);
                session.addEventListener('keystatuseschange', keystatuseschangeHandler);
                return session;
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, session);
                }
                console.trace();
                console.groupEnd();
            }
        });
    }

    if (typeof EventTarget !== 'undefined') {
        proxy(EventTarget.prototype, 'addEventListener', async (_target, _this, _args) => {
            if (_this != null) {
                const [type, listener] = _args;
                const storeKey = Symbol.for(getEventListeners);
                if (!(storeKey in _this)) _this[storeKey] = {};
                const store = _this[storeKey];
                if (!(type in store)) store[type] = [];
                const listeners = store[type];
                if (listeners.indexOf(listener) < 0) {
                    listeners.push(listener);
                }
            }
            return _target.apply(_this, _args);
        });

        proxy(EventTarget.prototype, 'removeEventListener', async (_target, _this, _args) => {
            if (_this != null) {
                const [type, listener] = _args;
                const storeKey = Symbol.for(getEventListeners);
                if (!(storeKey in _this)) return;
                const store = _this[storeKey];
                if (!(type in store)) return;
                const listeners = store[type];
                const index = listeners.indexOf(listener);
                if (index >= 0) {
                    if (listeners.length === 1) {
                        delete store[type];
                    } else {
                        listeners.splice(index, 1);
                    }
                }
            }
            return _target.apply(_this, _args);
        });
    }

    if (typeof MediaKeySession !== 'undefined') {
        proxy(MediaKeySession.prototype, 'generateRequest', async (_target, _this, _args) => {
            const [initDataType, initData] = _args;
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeySession::generateRequest%c\n` +
                `Session ID: %c%s%c\n` +
                `Init Data Type: %c%s%c\n` +
                `Init Data:`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, _this.sessionId || '(not available)', `color: inherit; font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, initDataType, `color: inherit; font-weight: normal;`,
                b64.encode(initData),
            ];
            let result, err;
            try {
                result = await _target.apply(_this, _args);
                return result;
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, result);
                }
                console.trace();
                console.groupEnd();
            }
        });

        proxy(MediaKeySession.prototype, 'load', async (_target, _this, _args) => {
            const [sessionId] = _args;
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeySession::load%c\n` +
                `Session ID: %c%s`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, _this.sessionId || '(not available)',
            ];
            let result, err;
            try {
                result = await _target.apply(_this, _args);
                return result;
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`, result);
                }
                console.trace();
                console.groupEnd();
            }
        });

        proxy(MediaKeySession.prototype, 'update', async (_target, _this, _args) => {
            const [response] = _args;
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeySession::update%c\n` +
                `Session ID: %c%s%c\n` +
                `Response:`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, _this.sessionId || '(not available)', `color: inherit; font-weight: normal;`,
                b64.encode(response),
            ];
            let err;
            try {
                return await _target.apply(_this, _args);
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`);
                }
                console.trace();
                console.groupEnd();
            }
        });

        proxy(MediaKeySession.prototype, 'close', async (_target, _this, _args) => {
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeySession::close%c\n` +
                `Session ID: %c%s`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, _this.sessionId || '(not available)',
            ];
            let err;
            try {
                return await _target.apply(_this, _args);
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`);
                }
                console.trace();
                console.groupEnd();
            }
        });

        proxy(MediaKeySession.prototype, 'remove', async (_target, _this, _args) => {
            const enterMessage = [
                `%c[EME] (CALL)%c MediaKeySession::remove%c\n` +
                `Session ID: %c%s`,

                `color: ${$.INFO}; font-weight: bold;`, `color: ${$.METHOD};`, `font-weight: normal;`,
                `color: ${$.VALUE}; font-weight: bold;`, _this.sessionId || '(not available)',
            ];
            let err;
            try {
                return await _target.apply(_this, _args);
            } catch(e) {
                err = e;
                throw e;
            } finally {
                console.groupCollapsed(...enterMessage);
                if (err) {
                    console.error(`%c[FAILURE]`, `color: ${$.FAILURE}; font-weight: bold;`, err);
                } else {
                    console.log(`%c[SUCCESS]`, `color: ${$.SUCCESS}; font-weight: bold;`);
                }
                console.trace();
                console.groupEnd();
            }
        });
    }
})();