// ==UserScript==
// @name           Queue loader
// @namespace      https://greasyfork.org/users/136230
// @description    Make ajax requests sequentially
// @include        *://*
// @version        0.1.1
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/382709/Queue%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/382709/Queue%20loader.meta.js
// ==/UserScript==

(function(){
    function QueueLoader({ maxActiveSize = 4, maxMaxActiveSize = 10, makeRequest } = {}) {
        this.queue = [];
        this.active = [];
        this.makeRequest = makeRequest;
        this.setMaxMaxActiveSize(maxMaxActiveSize);
        this.setMaxActiveSize(maxActiveSize);
    }
    QueueLoader.prototype.setMaxMaxActiveSize = function setMaxMaxActiveSize(maxMaxActiveSize) {
        if (maxMaxActiveSize > 0) {
            this.maxMaxActiveSize = maxMaxActiveSize;
        } else {
            this.maxMaxActiveSize = 1;
        }
    };
    QueueLoader.prototype.setMaxActiveSize = function setMaxActiveSize(maxActiveSize) {
        if (maxActiveSize > 0) {
            this.maxActiveSize = maxActiveSize <= this.maxMaxActiveSize ? maxActiveSize : this.maxMaxActiveSize;
        } else {
            this.maxActiveSize = 1;
        }
    };
    QueueLoader.prototype.isBusy = function isBusy() {
        return this.active.length >= this.maxActiveSize;
    };
    QueueLoader.defaultDetails = {
        responseType: 'arraybuffer',
        timeout: 0,
        context: null,
        callback: function(){},
    };
    QueueLoader.extendDetails = function extendDetails(details) {
        return extend({}, QueueLoader.defaultDetails, details);
    };
    QueueLoader.prototype.enqueue = function enqueue(...requests) {
        const { length: size } = requests;
        if (size) {
            this.queue.push(...requests.map(QueueLoader.extendDetails));
        }
        this.forceRun(size);
    };
    QueueLoader.prototype.stop = function stop() {
        this._stop = true;
    };
    QueueLoader.prototype.resume = function resume() {
        this._stop = false;
        this.forceRun();
    };
    QueueLoader.prototype.forceRun = function forceRun(size) {
        if (size === undefined) {
            size = this.maxMaxActiveSize;
        }
        for (var i = 0; i < size && i < this.maxActiveSize && !this.load(); ++i);
    };
    function extend(target) {
        const args = Array.prototype.slice.call(arguments, 1);
        target = target || {};
        for (const arg of args) {
            for (const key of Object.keys(arg)) {
                if (arg[key] !== undefined) {
                    target[key] = arg[key];
                }
            }
        }
        return target;
    }
    function stringToUint(string) {
        var string = btoa(unescape(encodeURIComponent(string))),
            charList = string.split(''),
            uintArray = [];
        for (var i = 0; i < charList.length; i++) {
            uintArray.push(charList[i].charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    }
    function uintToString(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(atob(encodedString)));
        return decodedString;
    }
    function isArrayBuffer(data) {
        return !!data && (data.buffer instanceof ArrayBuffer || data.byteLength !== undefined);
    }
    QueueLoader.prototype.load = function load() {
        if (!this.queue.length || this.isBusy() || this._stop) {
            return 1;
        }
        const request = this.queue.shift();
        this.active.push(request);
        const { callback, context, responseType } = request;
        const _this = this;
        this.makeRequest(request)
        .then(function({ response: data }) {
            const _isArrayBuffer = isArrayBuffer(data);
            if (responseType === 'arraybuffer' && !_isArrayBuffer) {
                const error = new Error('invalid responseType, got response type: ' + typeof data + ', but requested type: ' + responseType);
                return callback.call(context, error);
            }
            if (_isArrayBuffer) {
                data = new Uint8Array(data);
            } else if (typeof data === 'string' && responseType === 'arraybuffer') {
                data = stringToUint(data);
            }
            callback.call(context, null, data);
        })
        .catch(function(error) {
            callback.call(context, error);
        })
        .then(function(){
            const index = _this.active.indexOf(request);
            if (index !== -1) {
                _this.active.splice(index, 1);
            }
            _this.load();
        });
        return 0;
    };
    window.QueueLoader = QueueLoader;
})();