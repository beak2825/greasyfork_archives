// ==UserScript==
// @name         alright
// @version      1.0
// @author       noone
// @match        https://starve.io/
// @grant        GM_webRequest
// @description  This is a bot alright :)
// @webRequest   [{"selector":"https://starve.io/js/client.min.js","action":"cancel"}]
// @run-at       document-start
// @namespace https://greasyfork.org/users/329542
// @downloadURL https://update.greasyfork.org/scripts/389109/alright.user.js
// @updateURL https://update.greasyfork.org/scripts/389109/alright.meta.js
// ==/UserScript==

// thanks https://github.com/jasonkhanlar/starve-io-extensions/blob/master/starve.io-deobfuscate.user.js
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
    if (xhr.status === 200 && xhr.readyState === 4) {
        var script = document.createElement('script');
        script.text = this.responseText
            .replace(/var ..=.\[.\[[0-9]+\]\];.*=function\(\)\{\};/g, '') // remove console object clearing
            .replace(/\(function\(\)\{([\S\s]*)}\)\(\);/g, `var closure = (function(){$1;return new Proxy({}, { get(target,name) { try { return eval(name); } catch(e) { return undefined } }, set(target,name,value) { return eval(name + "=JSON.parse('" + JSON.stringify(value) + "')"); }});})();`); // expose self closure variables
        unsafeWindow.document.body.appendChild(script);
        unsafeWindow.onload();

        for (var k in unsafeWindow) {
            if(k === 'webkitStorageInfo')
            {
                continue;
            }

            var v = unsafeWindow[k];
            if(v && typeof v === 'object') {
                var proto = Object.getPrototypeOf(v);
                if(proto) {
                    var ctor = proto.constructor;
                    if(ctor && ctor.length === 0) {
                        if(ctor.toString().match(/new XMLHttpRequest/)) {
                            unsafeWindow.client = new Proxy(v, function() {});
                            unsafeWindow.client.keys = unsafeWindow.client.keys || [];
                            unsafeWindow.client.keys.client = k;
                            let index = 0;
                            for(let ck in unsafeWindow.client) {
                                function defineProperty(name, key = ck) {
                                    unsafeWindow.client.keys[name] = key;
                                    Object.defineProperty(unsafeWindow.client, name, {
                                        get() { return this[key]; },
                                        set(newValue) { this[key] = newValue; }
                                    });
                                }

                                var cv = unsafeWindow.client[ck];
                                if(cv === null && !unsafeWindow.client.hasOwnProperty("socket")) {
                                    defineProperty('socket');
                                } else if(cv !== undefined) {
                                    if(Array.isArray(cv) && cv.length == 6) {
                                        if(Array.isArray(cv[0])) {
                                            defineProperty('serversList');
                                        } else if(Number.isFinite(cv[0])) {
                                            defineProperty('selectedServer');
                                        }
                                    } else if(Number.isFinite(cv)) {
                                        if(XMLHttpRequest.prototype.isPrototypeOf(Object.values(unsafeWindow.client)[index + 1]))
                                        {
                                            defineProperty('selectedMode');
                                        }
                                    } else if(typeof cv === "function" && unsafeWindow.client.keys.selectedMode) {
                                        var match = cv.toString().match(new RegExp(`this\\.(..)=function\\(a\\){${k}\\.${unsafeWindow.client.keys.selectedMode}=a;`));
                                        if(match && match.length > 0) {
                                            defineProperty('selectMode', match[1]);
                                        }
                                    }
                                }
                                index++;
                            }
                        }
                    }
                }
            }
        }
    }

    unsafeWindow.json = function(json) {
        this.client.socket.onmessage({
            data: JSON.stringify(json)
        });
    }

    unsafeWindow.binary = function(array) {
        this.client.socket.onmessage({
            data: new Uint8Array(array)
        });
    }

    unsafeWindow.reconnect = function() {
        this.client.socket.close();
    }
};

xhr.open('GET', 'https://starve.io/js/client.min.js?', true);
xhr.send();