// ==UserScript==
// @name         WebSuckIt!
// @namespace    lainscripts_websuckit
// @version      2016-09-28:1
// @description  WebSocket wrapper designed to block some edgy scripts from loading ads. OUTDATED SCRIPT! Adblock Plus and uBlock Origin are perfectly capable to block such ads in modern versions of Firefox and Chrome. Feel free to remove it.
// @author       lainverse
// @match        *://*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19144/WebSuckIt%21.user.js
// @updateURL https://update.greasyfork.org/scripts/19144/WebSuckIt%21.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // check does browser support Proxy and WebSocket
    if (typeof Proxy !== 'function' ||
        typeof WebSocket !== 'function') {
        return;
    }

    function getWrappedCode(removeSelf) {
        var text = getWrappedCode.toString()+WSI.toString();
        text = (
            '(function(){"use strict";'+
            text.replace(/\/\/[^\r\n]*/g,'').replace(/[\s\r\n]+/g,' ')+
            '(new WSI(self||window)).init();'+
            '})();'+
            (removeSelf?'var s = document.currentScript; if (s) {s.parentNode.removeChild(s);}':'')
        );
        return text;
    }

    function WSI(win, safeWin) {
        safeWin = safeWin || win;
        var masks = [], filter;
        for (filter of [// blacklist
            '||24video.xxx^',
            '||adlabs.ru^',
            '||bgrndi.com^',
            '||brokeloy.com^',
            '||cnamerutor.ru^',
            '||docfilms.info^',
            '||dreadfula.ru^',
            '||et-code.ru^',
            '||free-torrent.org^',
            '||free-torrent.pw^',
            '||free-torrents.org^',
            '||free-torrents.pw^',
            '||game-torrent.info^',
            '||gocdn.ru^',
            '||hdkinoshka.com^',
            '||hghit.com^',
            '||kinotochka.net^',
            '||kuveres.com^',
            '||lepubs.com^',
            '||luxadv.com^',
            '||luxup.ru^',
            '||mail.ru^',
            '||marketgid.com^',
            '||mxtads.com^',
            '||oconner.biz^',
            '||abbp1.website',
            '||psma01.com^',
            '||psma02.com^',
            '||psma03.com^',
            '||recreativ.ru^',
            '||regpole.com^',
            '||ruttwind.com^',
            '||skidl.ru^',
            '||torvind.com^',
            '||trafmag.com^',
            '||xxuhter.ru^',
            '||yuiout.online^',
            '||zoom-film.ru^'
        ]) {
            masks.push(new RegExp(
                filter.replace(/([\\\/\[\].*+?(){}$])/g, '\\$1')
                .replace(/\^(?!$)/g,'\\.?[^\\w%._-]')
                .replace(/\^$/,'\\.?([^\\w%._-]|$)')
                .replace(/^\|\|/,'^wss?:\\/+([^\/.]+\\.)*'),
                'i'));
        }

        function isBlocked(url) {
            for (var mask of masks) {
                if (mask.test(url)) {
                    return true;
                }
            }
            return false;
        }

        function wsGetter (target, name) {
            try {
                if (typeof realWebSocket.prototype[name] === 'function') {
                    if (name === 'close' || name === 'send') { // send also closes connection
                        target.readyState = realWebSocket.CLOSED;
                    }
                    return (
                        function () {
                            console.log('[WSI] Invoked function "'+name+'"', '| Tracing', (new Error()));
                            return;
                        }
                    );
                }
                if (typeof realWebSocket.prototype[name] === 'number') {
                    return realWebSocket[name];
                }
            } catch(ignore) {}
            return target[name];
        }

        function createWebSocketWrapper(target) {
            var realWebSocket = win.WebSocket;

            return new Proxy(realWebSocket, {
                construct: function (target, args) {
                    var url = args[0];
                    console.log('[WSI] Opening socket on ' + url + ' \u2026');
                    if (isBlocked(url)) {
                        console.log("[WSI] Blocked.");
                        return new Proxy({url: url, readyState: realWebSocket.OPEN}, {
                            get: wsGetter
                        });
                    }
                    return new target(args[0], args[1]);
                }
            });
        }

        function WorkerWrapper() {
            var realWorker = win.Worker;
            function wrappedWorker(resourceURI) {
                var _worker = null,
                    _terminate = false,
                    _onerror = null,
                    _onmessage = null,
                    _messages = [],
                    _events = [],
                    _self = this;

                (new Promise(function(resolve,reject){
                    var xhrLoadEnd = function() {
                        resolve(new realWorker(URL.createObjectURL(
                            new Blob([getWrappedCode(false)+this.result])
                        )));
                    };
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', resourceURI, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function(){
                        if (this.status === 200) {
                            var reader = new FileReader();
                            reader.addEventListener("loadend", xhrLoadEnd);
                            reader.readAsText(this.response);
                        }
                    };
                    xhr.send();
                })).then(function(val) {
                    _worker = val;
                    _worker.onerror = _onerror;
                    _worker.onmessage = _onmessage;
                    var _e;
                    while(_events.length) {
                        _e = _events.shift();
                        _worker[_e[0]].apply(_worker, _e[1]);
                    }
                    while(_messages.length) {
                        _worker.postMessage(_messages.shift());
                    }
                    if (_terminate) {
                        _worker.terminate();
                    }
                });

                _self.terminate = function(){
                    _terminate = true;
                    if (_worker) {
                        _worker.terminate();
                    }
                };
                Object.defineProperty(_self, 'onmessage', {
                    get:function(){
                        return _onmessage;
                    },
                    set:function(val){
                        _onmessage = val;
                        if (_worker) {
                            _worker.onmessage = val;
                        }
                    }
                });
                Object.defineProperty(_self, 'onerror', {
                    get:function(){
                        return _onerror;
                    },
                    set:function(val){
                        _onerror = val;
                        if (_worker) {
                            _worker.onmessage = val;
                        }
                    }
                });
                _self.postMessage = function(message){
                    if (_worker) {
                        _worker.postMessage(message);
                    } else {
                        _messages.push(message);
                    }
                };
                _self.terminate = function() {
                    _terminate = true;
                    if (_worker) {
                        _worker.terminate();
                    }
                };
                _self.addEventListener = function(){
                    if (_worker) {
                        _worker.addEventListener.apply(_worker, arguments);
                    } else {
                        _events.push(['addEventListener',arguments]);
                    }
                };
                _self.removeEventListener = function(){
                    if (_worker) {
                        _worker.removeEventListener.apply(_worker, arguments);
                    } else {
                        _events.push(['removeEventListener',arguments]);
                    }
                };
            }
            win.Worker = wrappedWorker.bind(safeWin);
        }

        function CreateElementWrapper() {
            var realCreateElement = document.createElement.bind(document),
                code = escape('<scr'+'ipt>'+getWrappedCode(true)+'</scr'+'ipt>'),
                isDataURL = /^data:/i,
                isBlobURL = /^blob:/i;

            function frameRewrite(e) {
                var f = e.target,
                    w = f.contentWindow;
                if (!f.src) {
                    return; // nothing to do here if source is unknown
                }
                if (isDataURL.test(f.src) && f.src.indexOf(code) < 0) {
                    f.src = f.src.replace(',',',' + code);
                }
                if (w && isBlobURL.test(f.src)) {
                    w.WebSocket = createWebSocketWrapper();
                }
            }

            function wrappedCreateElement(name) {
                if (name && name.toUpperCase &&
                    name.toUpperCase() === 'IFRAME') {
                    var ifr = realCreateElement.apply(document, arguments);
                    ifr.addEventListener('load', frameRewrite, false);
                    return ifr;
                }
                return realCreateElement.apply(document, arguments);
            }
            document.createElement = wrappedCreateElement.bind(document);

            document.addEventListener('DOMContentLoaded', function(){
                for (var ifr of document.querySelectorAll('IFRAME')) {
                    ifr.addEventListener('load', frameRewrite, false);
                }
            }, false);
        }

        this.init = function() {
            win.WebSocket = createWebSocketWrapper();
            WorkerWrapper();
            if (typeof document !== 'undefined') {
                CreateElementWrapper();
            }
        };
    }

    if (/firefox/i.test(navigator.userAgent)) {
        var script = document.createElement('script');
        script.appendChild(document.createTextNode(getWrappedCode()));
        document.head.insertBefore(script, document.head.firstChild);
        return; //we don't want to call functions on page from here in Fx, so exit
    }

    (new WSI((unsafeWindow||self||window),(self||window))).init();
})();