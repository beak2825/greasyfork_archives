// ==UserScript==
// @name        Coplay Mod
// @namespace   https://greasyfork.org/zh-CN/users/220174-linepro
// @match       *://*.youku.com/*
// @match       *://*.sohu.com/*
// @match       *://*.tudou.com/*
// @match       *://v.qq.com/*
// @match       *://*.iqiyi.com/*
// @match       *://*.youtube.com/*
// @match       *://*.acfun.cn/*
// @match       *://*.bilibili.com/*
// @match       *://*.mgtv.com/*
// @match       *://*.vimeo.com/*
// @match       *://*.agefans.*/*
// @match       *://*.agemys.*/*
// @grant       GM_addStyle
// @version     1.6
// @author      LinePro
// @description Coplay 用户脚本修改版
// @run-at      document-end
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyNGYxMmE4Ny0xYWI4LTRjNWYtYmI5ZS02MTFiYmJjOTI5MDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3QkYzRkMzQjU1MTFFNkI0MERDREREMkY3NkNCNEYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3QkYzRkIzQjU1MTFFNkI0MERDREREMkY3NkNCNEYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpmNDFlZDJkOS1mOWY4LTQ0NmItYTgzNi03ZTE4NThiZmY4MWUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjRmMTJhODctMWFiOC00YzVmLWJiOWUtNjExYmJiYzkyOTA1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
// @downloadURL https://update.greasyfork.org/scripts/421463/Coplay%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/421463/Coplay%20Mod.meta.js
// ==/UserScript==

(function (window) {
    var events = {};

    var vendorProps = {
        'user-select': ['-webkit-', '-moz-', '-ms-'],
        'transform': ['-webkit-', '-moz-', '-ms-'],
        'transition': ['-webkit-', '-moz-', '-ms-']
    };

    var prefixMap = {
        '-webkit-': 'webkit',
        '-moz-': 'Moz',
        '-ms-': 'ms'
    };

    for (var prop in vendorProps) {
        getSupportedAccessor(prop);
    }

    var regMatrix = /(matrix\((?:[^,]+,){4})([^,]+),([^,]+)(\))/i;
    var regMatrix3d = /(matrix3d\((?:[^,]+,){12})([^,]+),([^,]+)(,[^,]+,[^,]+\))/i;

    var translateMode = getSupportedAccessor('transform') ? 'transform' : 'offset';

    function convert(prop) {
        return prop.toLowerCase().replace(/(-\w+-)?([\w-]+)/, function (whole, prefix, standard) {
            prefix = prefix ? prefixMap[prefix] : '';
            var remain = (prefix ? '-' : '') + standard;
            return prefix + remain.replace(/-(\w)/g, function (matched, initial) {
                return initial.toUpperCase();
            });
        });
    }

    function getSupportedAccessor(prop) {
        var accessor = convert(prop);
        var prefixes = vendorProps[prop];
        if (!prefixes) {
            return prop;
        }
        if (typeof prefixes === 'string') {
            return convert(prefixes);
        }
        var elem = document.createElement('div');
        if (elem.style[accessor] !== undefined) {
            vendorProps[prop] = prop;
            return accessor;
        }
        for (var i = 0, j = prefixes.length; i < j; i++) {
            var prefix = prefixes[i];
            var prefixed = convert(prefix + prop);
            if (elem.style[prefixed] !== undefined) {
                vendorProps[prop] = prefix + prop;
                return prefixed;
            }
        }
        return null;
    }

    function getTransform(elem, isComputed) {
        var transform;
        var accessor = getSupportedAccessor('transform');
        if (isComputed) {
            transform = getComputed(elem, accessor);
        } else {
            transform = elem.style[accessor];
        }
        return transform;
    }

    function getScrollOffsets() {
        var result;
        if (window.scrollX !== undefined) {
            result = {
                x: window.scrollX,
                y: window.scrollY
            };
        } else if (window.pageXOffset !== undefined) {
            result = {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
        } else if (document.compatMode === 'CSS1Compat') {
            result = {
                x: doc.scrollLeft,
                y: doc.scrollTop
            };
        } else {
            result = {
                x: document.body.scrollLeft,
                y: document.body.scrollTop
            };
        }
        return result;
    }

    function on(elem, type, listener) {
        if (elem.addEventListener) {
            elem.addEventListener(type, listener, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent('on' + type, listener);
        }
    }

    function off(elem, type, listener) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, listener, false);
        }
        else if (elem.attachEvent) {
            elem.detachEvent('on' + type, listener);
        }
    }

    function extend(target, source) {
        for (var key in source) {
            target[key] = source[key];
        }
        return target;
    }

    function attr(elem, attr, value) {
        if (arguments.length === 2) {
            return elem.getAttribute(attr);
        }

        if (value === null) {
            elem.removeAttribute(attr);
        } else {
            elem.setAttribute(attr, value);
        }
        return value;
    }

    function getComputed(elem, prop) {
        var getter = document.defaultView && document.defaultView.getComputedStyle;
        if (getter) {
            if (prop) {
                var accessor = getSupportedAccessor(prop);
                if (accessor) {
                    return getter(elem)[accessor];
                }
                return getter(elem)[prop];
            }
            return getter(elem);
        } else if (elem.currentStyle) {
            if (prop) {
                return elem.currentStyle[prop];
            }
            return elem.currentStyle;
        }
    }

    function getCSSText(elem) {
        if (typeof elem.style.cssText !== 'undefined') {
            return elem.style.cssText;
        }
        return attr(elem, 'style');
    }

    function addStyles(elem, styles, isReplace) {
        var cssText = '';
        if (typeof styles === 'object') {
            for (var prop in styles) {
                if (prop in vendorProps) {
                    cssText += ';' + vendorProps[prop] + ':' + styles[prop];
                } else {
                    cssText += ';' + prop + ':' + styles[prop];
                }
            }
        } else if (typeof styles === 'string') {
            cssText = styles;
        }
        if (typeof elem.style.cssText !== 'undefined') {
            elem.style.cssText = (isReplace ? '' : elem.style.cssText) + cssText;
        } else {
            attr(elem, 'style', (isReplace ? '' : attr(elem, 'style')) + cssText);
        }
    }

    function removeStyles(elem) {
        if (typeof elem.style.cssText !== 'undefined') {
            elem.style.cssText = '';
        } else {
            attr(elem, 'style', '');
        }
    }

    function extractNonPxLength(value) {
        var match = value.match(/^((?:[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)))((?!px)[a-z%]+)$/i);
        if (match) {
            return {
                value: parseFloat(match[1]),
                unit: match[2].toLowerCase()
            };
        }
        return null;
    }

    function bind(fn, newThis) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return fn.apply(newThis, args.concat(slice.call(arguments)));
        };
    }

    var ID_KEY = 'data-drag-id';
    var ID_DOC = '__doc__';
    var guid = 0;
    var util = {
        guid: function () {
            return guid++;
        },

        on: function (elem, type, listener) {
            var id = attr(elem, ID_KEY) || ID_DOC;
            if (!events[id]) {
                events[id] = {};
            }

            if (!events[id][type]) {
                events[id][type] = [];
            }
            events[id][type].push(listener);
            on(elem, type, listener);
        },

        off: function (elem, type, listener) {
            var id = attr(elem, ID_KEY) || ID_DOC;
            var listeners = events[id];

            if (!type) {
                // remove all event listeners on the element
                for (var t in listeners) {
                    for (var i = 0, j = listeners[t].length; i < j; i++) {
                        off(elem, t, listeners[t][i]);
                    }
                    delete listeners[t];
                }
                delete events[id];
            } else if (!listener) {
                for (var i = 0, j = listeners[type].length; i < j; i++) {
                    off(elem, type, listeners[type][i]);
                }
                delete listeners[type];
            } else {
                for (var i = 0, j = listeners[type].length; i < j; i++) {
                    if (listeners[type][i] === listener) {
                        off(elem, type, listener);
                        listeners[type][i] = null;
                    }
                }
            }
        }
    };

    function Draggable(target, options) {
        this.target = target;

        if (options && typeof options === 'object') {
            extend(this, options);
        }
    }

    var doc = document.documentElement;
    Draggable.prototype.init = function () {
        var target = this.target;

        if (attr(target, ID_KEY)) {
            throw new Error('The element is already draggable!');
        }

        this.id = util.guid();
        attr(target, ID_KEY, this.id);

        // save current style attribute to recover later
        this.oldStyle = getCSSText(target);
        this.oldDocStyle = getCSSText(doc);

        target.style.cursor = 'default';

        this.handle = this.handle || target;
        attr(this.handle, ID_KEY, this.id);

        var startHandler = bind(start, this);
        this.__startHandler__ = startHandler;
        util.on(this.handle, 'mousedown', startHandler);
    };

    Draggable.prototype.pause = function () {
        if (this.__isPaused__) {
            return;
        }
        this.__isPaused__ = true;
        util.off(this.handle, 'mousedown', this.__startHandler__);
    };

    Draggable.prototype.resume = function () {
        if (!this.__isPaused__) {
            return;
        }
        this.__isPaused__ = false;
        util.on(this.handle, 'mousedown', this.__startHandler__);
    };

    Draggable.prototype.dispose = function () {
        util.off(this.target);
        util.off(doc);
        attr(this.target, ID_KEY, null);
        this.reset();
    };

    Draggable.prototype.reset = function () {
        addStyles(this.target, this.oldStyle, true);
    };

    function start(e) {
        var target = this.target;
        this.__starting__ = true;
        addStyles(doc, {
            'user-select': 'none'
        });
        if (getSupportedAccessor('user-select') === null) {
            this.oldSelectstart = document.onselectstart;
            document.onselectstart = function () {
                return false;
            };
        }

        // log current cursor coodinates
        this.cursor = {
            x: e.clientX,
            y: e.clientY
        };

        target.style.cursor = 'move';
        var newStyle = {};

        if (translateMode === 'transform') {
            var transform = (getTransform(target, true) || '').replace(/\s+/g, '');
            var matched;
            if ((matched = transform.match(regMatrix)) || (matched = transform.match(regMatrix3d))) {
                this.offset = {
                    x: parseFloat(matched[2]),
                    y: parseFloat(matched[3])
                };
            } else {
                this.offset = {
                    x: 0,
                    y: 0
                };

                newStyle = {
                    transform: 'translate(0, 0)'
                };
            }
        }

        addStyles(target, newStyle);

        // drag can cause scroll so scroll offsets also have to be logged
        this.scroll = getScrollOffsets();

        // lock `transition` to none to prevent lag while tracking
        var transitionAccessor = getSupportedAccessor('transition');
        if (transitionAccessor) {
            var oldTransition = this.target.style[transitionAccessor];
            this.oldTransition = oldTransition;
            var transition = getComputed(this.target, transitionAccessor);
            this.target.style[transitionAccessor] = (transition ? (transition + ',') : '') + 'transform 0s';
        }
        setTimeout(() => target.classList.add(this.class), 500);

        util.on(doc, 'mousemove', bind(track, this));
        util.on(doc, 'mouseup', bind(stop, this));
    }

    function track(e) {
        // mouse move deltas
        var dx = e.clientX - this.cursor.x;
        var dy = e.clientY - this.cursor.y;
        this.cursor.x = e.clientX;
        this.cursor.y = e.clientY;

        // scroll deltas
        var scroll = getScrollOffsets();
        var dsx = scroll.x - this.scroll.x;
        var dsy = scroll.y - this.scroll.y;
        this.scroll = scroll;

        if (this.__starting__ && typeof this.ondragstart === 'function') {
            if (this.ondragstart() === false) {
                stop.call(this);
                return;
            }
        }

        this.__starting__ = false;

        // accumulate delta values
        this.offset.x += dx + dsx;
        this.offset.y += dy + dsy;

        locate(this.target, this.offset);

        if (typeof this.ondragprogress === 'function') {
            this.ondragprogress();
        }
    }

    function stop(e) {
        this.target.style.cursor = 'default';
        var transitionAccessor = getSupportedAccessor('transition');
        if (transitionAccessor) {
            this.target.style[transitionAccessor] = this.oldTransition || '';
        }
        if (this.oldSelectstart) {
            document.onselectstart = this.oldSelectstart;
        }
        addStyles(doc, this.oldDocStyle, true);
        util.off(doc);
        if (typeof this.ondragend === 'function') {
            this.ondragend();
        }
        setTimeout(() => this.target.classList.remove(this.class), 500);
    }

    function locate(elem, offset) {
        function replaceTransform(whole, before, x, y, after) {
            return before + offset.x + ', ' + offset.y + after;
        }

        if (translateMode === 'transform') {
            var transform = getTransform(elem, true).replace(/\s+/g, '');
            var newTransform;

            if (transform.match(regMatrix)) {
                newTransform = transform.replace(regMatrix, replaceTransform);
            } else if (transform.match(regMatrix3d)) {
                newTransform = transform.replace(regMatrix3d, replaceTransform);
            }
            addStyles(elem, {
                transform: newTransform
            });
        }
    }

    var drag = function (target, options) {
        var wrapped = new Draggable(target, options);
        wrapped.init();
        return wrapped;
    };

    // Everything is ready, export the whole module
    window.coplayDrag = drag;

})(window.unsafeWindow);

(function (window) {
    GM_addStyle(`
#coplay {
    position: fixed;
    left: 2em;
    bottom: 1em;
    width: 3em;
    height: 3em;
    z-index: 2147483647; /* max integer */
    overflow: hidden;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 3px #000;
    background-color: rgba(0, 0, 0, 0.75);
    background-clip: padding-box;
    transition: width ease-in-out 0.3s;
    font-size: 12px;
    box-sizing: content-box;
}

#coplay.active {
    width: 43em;
}

#coplay.active #coplay-toggle {
    color: #c33;
    text-shadow: 0 1px 0 #333;
}

#coplay * {
    box-sizing: border-box;
}

#coplay input,
#coplay button {
    float: left;
    height: 3em;
    margin: 0;
    border: none;
    background-color: transparent;
    color: #eee;
    font-size: inherit;
    font-family: inherit;
    line-height: 3em;
    outline: none;
}
#coplay button::-moz-focus-inner {
    border-style: none;
    padding: 0;
}

#coplay input {
    width: 11em;
    padding: 0 1em;
    font-family: Consolas, monospace;
    text-align: left;
}

#coplay input + input,
#coplay input + button,
#coplay button + input,
#coplay button + button {
    border-left: none;
}

#coplay input::-moz-placeholder {
    font-family: inherit;
    color: #999;
}
#coplay input::-webkit-input-placeholder {
    font-family: inherit;
    color: #999;
}
#coplay input:focus::-moz-placeholder {
    color: #ccc;
}
#coplay input:focus::-webkit-input-placeholder {
    color: #ccc;
}

#coplay input:focus {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.3);
}

#coplay button {
    width: 3em;
    padding: 0;
    border-radius: 0;
    text-align: center;
}

#coplay button:hover:not(:disabled) {
    color: #fff;
    text-shadow: 0 1px 0 #111;
    background-color: rgba(255, 255, 255, 0.5);
}

#coplay button:active {
    background-color: rgba(255, 255, 255, 0.8) !important;
}

#coplay button:not(:disabled) {
    cursor: pointer;
}

#coplay button:disabled {
    opacity: 0.3;
}

#coplay button svg {
    display: inline-block;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
}

#coplay-fullscreen svg:last-child,
#coplay-fullscreen.active svg:first-child {
    display: none;
}

#coplay-fullscreen.active svg:last-child {
    display: inline-block;
}

@keyframes shift {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 64px 0;
    }
}
#coplay-local-video,
#coplay-remote-video {
    position: fixed;
    top: 10px;
    z-index: 2147483647;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 3px #000;
    background-size: 64px 64px;
    background-clip: padding-box;
    animation: shift 2s linear infinite;
}
#coplay-local-video {
    right: 340px;
    width: 160px;
    height: 120px;
    transform: rotateY(180deg);
}
#coplay-remote-video {
    right: 10px;
    width: 320px;
    height: 240px;
    background-image: repeating-linear-gradient(
        -45deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 25%,
        rgba(255, 255, 255, 0.4) 25%,
        rgba(255, 255, 255, 0.4) 50%
    );
}    
    `);
    class CoPlayWebSocketClient {
        constructor(options) {
            this.messageDataHandle = {};
            this.clientId = 0;
            const socket = new WebSocket(options.url);
            socket.addEventListener('open', (event) => console.log('ws open', this));
            socket.addEventListener('message', (event) => this.messageHandle(event));
            socket.addEventListener('close', (event) => this.closeHandle(event));
            socket.addEventListener('error', (event) => this.closeHandle(event));
            this.socket = socket;
            this.heartbeat = setInterval(() => {
                if (!this.peer) {
                    this.socket.send(JSON.stringify({
                        action: 'heartbeat',
                        payload: 'REQ'
                    }));
                }
            }, 10000);
        }

        messageHandle(event) {
            const pkt = JSON.parse(event.data);
            console.log('ws message handle', this, pkt);
            switch (pkt.type) {
                case 'clientId':
                    this.clientId = pkt.data;
                    if (this.messageDataHandle.open) {
                        this.messageDataHandle.open(this.clientId);
                    }
                    break;
                case 'payload':
                    if (this.messageDataHandle.data) {
                        this.messageDataHandle.data(pkt.data);
                    }
                    break;
                case 'connect':
                    this.peer = pkt.data;
                    if (this.messageDataHandle.connection) {
                        this.messageDataHandle.connection(this);
                    }
                    break;
                case 'disconnect':
                    this.peer = pkt.data;
                    if (this.messageDataHandle.close) {
                        this.messageDataHandle.close();
                    }
                    break;
                case 'heartbeat': {
                    if (pkt.data === 'REQ') {
                        this.socket.send(JSON.stringify({
                            action: 'heartbeat',
                            payload: 'ACK'
                        }));
                    }
                }
            }
        }

        closeHandle(event) {
            this.peer = null;
            clearInterval(this.heartbeat);
            console.log('ws close', this, event);
            if (this.messageDataHandle.close) {
                this.messageDataHandle.close();
            }
        }

        send(data) {
            this.socket.send(JSON.stringify({
                action: 'sendPayload',
                payload: data
            }));
        }

        connect(remote, data) {
            this.peer = remote;
            this.socket.send(JSON.stringify({
                action: 'connect',
                payload: remote
            }));
            return this;
        }

        close() {
            this.peer = null;
            this.socket.send(JSON.stringify({
                action: 'disconnect'
            }));
            if (this.messageDataHandle.close) {
                this.messageDataHandle.close();
            }
        }

        on(event, func) {
            this.messageDataHandle[event] = func;
        }
    }


    let SEQ = 0;

    const icons = {
        // call: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1792 1792\"><path d=\"M1792 352v1088q0 42-39 59-13 5-25 5-27 0-45-19l-403-403v166q0 119-84.5 203.5T992 1536H288q-119 0-203.5-84.5T0 1248V544q0-119 84.5-203.5T288 256h704q119 0 203.5 84.5T1280 544v165l403-402q18-19 45-19 12 0 25 5 39 17 39 59z\"/></svg>",
        cancel: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1408 1792\"><path d=\"M1298 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68L976 960l294 294q28 28 28 68z\"/></svg>",
        compress: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1536 1792\"><path d=\"M768 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10L23 1527q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19H832q-26 0-45-19t-19-45V384q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z\"/></svg>",
        expand: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1536 1792\"><path d=\"M755 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19H64q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10L791 759q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\"/></svg>",
        heart: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1792 1792\"><path d=\"M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26T145 952.5 77 855 23.5 734 0 596q0-220 127-344t351-124q62 0 126.5 21.5t120 58T820 276t76 68q36-36 76-68t95.5-68.5 120-58T1314 128q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z\"/></svg>",
        pause: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1536 1792\"><path d=\"M1536 192v1408q0 26-19 45t-45 19H960q-26 0-45-19t-19-45V192q0-26 19-45t45-19h512q26 0 45 19t19 45zm-896 0v1408q0 26-19 45t-45 19H64q-26 0-45-19t-19-45V192q0-26 19-45t45-19h512q26 0 45 19t19 45z\"/></svg>",
        play: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1408 1792\"><path d=\"M1384 927L56 1665q-23 13-39.5 3T0 1632V160q0-26 16.5-36t39.5 3l1328 738q23 13 23 31t-23 31z\"/></svg>",
        plug: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1792 1792\"><path d=\"M1755 453q37 38 37 90.5t-37 90.5l-401 400 150 150-160 160q-163 163-389.5 186.5T543 1430l-362 362H0v-181l362-362q-124-185-100.5-411.5T448 448l160-160 150 150 400-401q38-37 91-37t90 37 37 90.5-37 90.5L939 619l234 234 401-400q38-37 91-37t90 37z\"/></svg>",
        restart: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1024 1792\"><path d=\"M979 141q19-19 32-13t13 32v1472q0 26-13 32t-32-13L269 941q-9-9-13-19v678q0 26-19 45t-45 19H64q-26 0-45-19t-19-45V192q0-26 19-45t45-19h128q26 0 45 19t19 45v678q4-10 13-19z\"/></svg>",
        sync: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1536 1792\"><path d=\"M1511 1056q0 5-1 7-64 268-268 434.5T764 1664q-146 0-282.5-55T238 1452l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 19-45l138-138Q969 384 768 384q-134 0-250 65T332 628q-11 17-53 117-8 23-30 23H50q-13 0-22.5-9.5T18 736v-7q65-268 270-434.5T768 128q146 0 284 55.5T1297 340l130-129q19-19 45-19t45 19 19 45z\"/></svg>"
    };

    /**
     * Don't activate inside iframes
     */
    // if (window !== top) {
    //     return;
    // }

    /**
     * coplay
     * Synchronizing video play between two peers
     */
    const coplay = {};

    /**
     * Check if coplay is already started or not supported
     */
    const id = 'coplay';
    if (get(id)) {
        return;
    }

    // Supported websites: Youku, SohuTV, Tudou, TencentVideo, iQiyi, YouTube, ACFun, bilibili, MGTV, Vimeo
    let host = location.host.match(
        /(?:^|\.)(youku\.com|sohu\.com|tudou\.com|qq\.com|iqiyi\.com|youtube\.com|acfun\.cn|bilibili\.com|mgtv\.com|vimeo\.com|agefans\..*|agemys\..*)(?:\/|$)/i
    );
    if (!host) {
        return;
    }
    host = host[1].split('.')[0];

    /**
     * Common utilis
     */
    function getId(part) {
        return id + '-' + part;
    }

    function get(id) {
        return top.document.getElementById(id);
    }

    function query(selector, elem) {
        elem = elem || document;
        return elem.querySelector(selector);
    }

    function queryAll(selector, elem) {
        elem = elem || document;
        return elem.querySelectorAll(selector);
    }

    function attr(elem, name, value) {
        if (value !== undefined) {
            elem.setAttribute(name, value);
        } else {
            return elem.getAttribute(name);
        }
    }

    function create(tagName, parent, props) {
        const elem = document.createElement(tagName);
        for (const prop in props) {
            elem[prop] = props[prop];
        }
        if (parent) {
            parent.appendChild(elem);
        }
        return elem;
    }

    function getDefined(...args) {
        return args.find(val => val !== undefined);
    }

    function on(elem, type, listener, noStop) {
        const prefixes = ['', 'webkit', 'moz'];
        const prefix = prefixes.find(
            prefix => elem['on' + prefix + type] !== undefined
        );
        elem.addEventListener(
            prefix + type,
            function (e) {
                listener.call(elem, e);
                if (!noStop) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                return !!noStop;
            },
            false
        );
    }

    function off(elem, type, listener) {
        const prefixes = ['', 'webkit', 'moz'];
        const prefix = prefixes.find(
            prefix => elem['on' + prefix + type] !== undefined
        );
        elem.removeEventListener(prefix + type, listener);
    }

    function visible(elem) {
        return elem && elem.getClientRects().length !== 0;
    }

    function fullscreen() {
        return !!document.fullscreenElement;
    }

    function getFullscreenElement(doc) {
        doc = doc || document;
        return getDefined(
            doc.fullscreenElement,
            doc.webkitFullscreenElement,
            doc.mozFullScreenElement
        );
    }

    function pack(type, data) {
        const p = {
            type: type
        };
        if (data !== undefined) {
            p.data = data;
        }

        return p;
    }

    function findReactComponent(elem) {
        if (!elem) {
            return null;
        }
        for (const key in elem) {
            if (key.startsWith('__reactInternalInstance$')) {
                return elem[key]._currentElement._owner._instance;
            }
        }
        return null;
    }

    /**
     * Player adaptor layer
     */
    const playerAdaptor = {
        youku: {
            prepare() {
                this._player = window.videoPlayer;
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seek(sec);
            },
            isReady() {
                return this._player.getProcessState() === 'playstart';
            },
            getTime() {
                return this._player.getCurrentTime();
            },
            toggleFullscreen() {
                if (fullscreen()) {
                    this._player.exitFullscreen();
                } else {
                    this._player.enterFullscreen();
                }
            }
        },
        tudou: {
            prepare() {
                this._player = query('video[data-canplay="play"]');
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.currentTime = sec;
            },
            isReady() {
                return query('.adtime').textContent === '0';
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                query(
                    `.control-${fullscreen() ? 'half' : 'full'}screen-icon`,
                    this._player.parentNode
                ).click();
            }
        },
        qq: {
            prepare() {
                this._player = window.PLAYER;
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seekTo(sec);
            },
            isReady() {
                return this._player.getPlayerState() !== -1;
            },
            getTime() {
                return this._player.getCurrentTime();
            },
            toggleFullscreen() {
                if (fullscreen()) {
                    this._player.exitWindowFullscreen();
                } else {
                    this._player.enterWindowFullscreen();
                }
            }
        },
        iqiyi: {
            prepare() {
                this._player = query('.iqp-player video');
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.currentTime = sec;
            },
            isReady() {
                return !visible(query('.cd-time'));
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                query('.iqp-btn-fullscreen').click();
            }
        },
        sohu: {
            prepare() {
                this._player = window._player;
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seek(sec);
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                if (fullscreen()) {
                    this._player.exitFullscreen();
                } else {
                    this._player.requestFullscreen();
                }
            }
        },
        youtube: {
            prepare() {
                let player = get('movie_player');
                if (visible(player)) {
                    this._player = player;
                }
            },
            play() {
                this._player.playVideo();
            },
            pause() {
                this._player.pauseVideo();
            },
            seek(sec) {
                this._player.seekTo(sec, true);
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.getCurrentTime();
            },
            toggleFullscreen() {
                this._player.toggleFullscreen();
            }
        },
        acfun: {
            prepare() {
                this._player = window.player;
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seek(sec);
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                query('.fullscreen-screen').click();
            }
        },
        bilibili: {
            prepare() {
                if (window.player) {
                    this.newapi = false;
                    Object.defineProperty(this, '_player', {
                        get() {
                            return window.player;
                        }
                    });
                } else {
                    this.newapi = true;
                    this._player = query('.bpx-player-video-wrap video');
                }
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                if (this.newapi) {
                    this._player.currentTime = sec;
                } else {
                    this._player.seek(sec);
                }
            },
            isReady() {
                return true;
            },
            getTime() {
                if (this.newapi) {
                    return this._player.currentTime;
                } else {
                    return this._player.getCurrentTime();
                }
            },
            toggleFullscreen() {
                if (this.newapi) {
                    query('.squirtle-video-fullscreen').click();
                } else {
                    query('.bilibili-player-video-btn-fullscreen').click();
                }
            }
        },
        vimeo: {
            prepare() {
                let component = findReactComponent(query('[data-player="true"]'));
                if (!component) {
                    return;
                }
                if ((this._player = component.getPlayer())) {
                    create('style', document.body, {
                        textContent: `#coplay.active #coplay-toggle {
                  color: #${this._player.color} !important;
              }
              #coplay input:focus,
              #coplay button:not(:disabled):hover,
              #coplay.active #coplay-toggle:hover {
                  color: #fff !important;
                  background-color: #${this._player.color} !important;
              }`
                    });
                }
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seekTo(sec);
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                query('.fullscreen').click();
            }
        },
        mgtv: {
            prepare() {
                this._player = MGTVPlayer.getPlayer();
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.seek(sec);
            },
            isReady() {
                return this._player.state === 4;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                if (fullscreen()) {
                    this._player.exitFullscreen();
                } else {
                    this._player.fullScreen();
                }
            }
        },
        agefans: {
            prepare() {
                this._player = document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('video')[0];
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.currentTime = sec;
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                document.getElementsByTagName('iframe')[0].contentDocument.querySelector('[data-title="点击全屏"]').click();
            }
        },
      agemys: {
            prepare() {
                this._player = document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName('video')[0];
            },
            play() {
                this._player.play();
            },
            pause() {
                this._player.pause();
            },
            seek(sec) {
                this._player.currentTime = sec;
            },
            isReady() {
                return true;
            },
            getTime() {
                return this._player.currentTime;
            },
            toggleFullscreen() {
                document.getElementsByTagName('iframe')[0].contentDocument.querySelector('[data-title="点击全屏"]').click();
            }
        }
    };

    const playerBase = {
        trigger(type, ...args) {
            if (typeof this['on' + type] === 'function') {
                this['on' + type](...args);
            }
        },
        init() {
            this.prepare();
            this.initFullscreen();
        },
        initFullscreen() {
            this._fullscreenChangeHandler = () => {
                const fsc = getFullscreenElement(document);
                const isFullscreen = !!fsc;
                const container = isFullscreen ? fsc : document.body;
                container.appendChild(coplay.ui.main);
                coplay.ui.fullscreen.classList.toggle('active', isFullscreen);
                this.trigger('fullscreenchange', isFullscreen);
            };
            on(document, 'fullscreenchange', this._fullscreenChangeHandler);
            this.trigger('fullscreeninit');
        },
        disposeFullscreen() {
            off(document, 'fullscreenchange', this._fullscreenChangeHandler);
        },
        toggleFullscreen() { }
    };

    function initPlayer(done) {
        const player = Object.assign({}, playerBase, playerAdaptor[host]);

        (function init() {
            player.init();
            if (player._player) {
                coplay.player = player;
                if (typeof done === 'function') {
                    done();
                }
            } else {
                setTimeout(init, 500);
            }
        })();
    }

    /**
     * coplay UI
     */
    function initUI() {
        const main = create('article', document.body, {
            id: id,
            className: ''
        });

        const DRAGGING_CLASS = 'coplay-dragging';
        const toggle = create('button', main, {
            id: getId('toggle'),
            innerHTML: `${icons['heart']}`,
            title: 'Click to toggle, drag to move the control bar'
        });
        on(toggle, 'click', function () {
            if (!main.classList.contains(DRAGGING_CLASS)) {
                main.classList.toggle('active');
            }
        });
        coplayDrag(main, {
            handle: toggle,
            class: DRAGGING_CLASS,
        });

        const local = create('input', main, {
            id: getId('local'),
            type: 'text',
            placeholder: 'Peer ID',
            readOnly: true
        });
        on(local, 'focus', function () {
            this.select();
        });
        on(local, 'click', () => { });

        const remote = create('input', main, {
            id: getId('remote'),
            type: 'text',
            placeholder: 'Remote peer ID'
        });
        on(remote, 'click', () => { });

        const connect = create('button', main, {
            id: getId('connect'),
            innerHTML: `${icons['plug']}`
        });
        on(connect, 'click', function () {
            coplay.connect(remote.value);
        });

        const disconnect = create('button', main, {
            id: getId('disconnect'),
            hidden: true,
            innerHTML: `${icons['cancel']}`
        });
        on(disconnect, 'click', function () {
            coplay.disconnect();
        });

        const play = create('button', main, {
            id: getId('play'),
            innerHTML: `${icons['play']}`,
            title: 'Play'
        });
        on(play, 'click', function () {
            coplay.player.play();
            coplay.remote.send(pack('PLAY'));
        });

        const pause = create('button', main, {
            id: getId('pause'),
            innerHTML: `${icons['pause']}`,
            title: 'Pause'
        });
        on(pause, 'click', function () {
            coplay.player.pause();
            coplay.remote.send(pack('PAUSE'));
        });

        const sync = create('button', main, {
            id: getId('sync'),
            innerHTML: `${icons['sync']}`,
            title: 'Sync with me'
        });
        on(sync, 'click', function () {
            let time = coplay.player.getTime();
            coplay.player.seek(time);
            coplay.remote.send(pack('SEEK', time));
        });

        const restart = create('button', main, {
            id: getId('restart'),
            innerHTML: `${icons['restart']}`,
            title: 'Restart'
        });
        on(restart, 'click', function () {
            if (coplay.player.restart) {
                coplay.player.restart();
            } else {
                coplay.player.seek(0.001);
                coplay.player.play();
            }
            coplay.remote.send(pack('SEEK', 0));
        });

        const fullscreen = create('button', main, {
            id: getId('fullscreen'),
            innerHTML: `${icons['expand']}${icons['compress']}`,
            title: 'Toggle fullscreen'
        });
        on(fullscreen, 'click', function () {
            coplay.player.toggleFullscreen();
        });

        coplay.ui = {
            main,
            local,
            remote,
            connect,
            disconnect,
            toggle,
            play,
            pause,
            sync,
            restart,
            fullscreen
        };

        // enable after ad stops
        if (!coplay.player.isReady()) {
            coplay.disable();
            (function wait() {
                if (coplay.player.isReady()) {
                    coplay.enable();
                } else {
                    setTimeout(wait, 500);
                }
            })();
        }
    }

    coplay.remote = {
        send(...args) {
            const c = coplay.connection;
            if (c) {
                c.send.apply(c, args);
            }
        }
    };

    function parseURL(url) {
        const { protocol, hostname, pathname, port } = new URL(url);
        return {
            protocol,
            host: hostname,
            path: pathname,
            port
        };
    }

    function initPeer() {
        const peer = new CoPlayWebSocketClient({ url: 'wss://coplay.linepro6.com:843/' });

        peer.on('open', function (id) {
            coplay.ui.local.value = id;
        });

        peer.on('connection', connect);

        coplay.peer = peer;
    }

    function connect(c) {
        coplay.connection = c;

        const ui = coplay.ui;
        ui.remote.value = c.peer;
        ui.remote.disabled = true;
        ui.connect.hidden = true;
        ui.disconnect.hidden = false;

        let start = 0;
        let elapsed = 0;
        let round = 0;
        let count = 0;

        function heartBeat() {
            start = Date.now();
            c.send(pack('REQ', { timestamp: Date.now(), seq: SEQ }));
            ++SEQ;
        }

        function checkPath() {
            c.send(pack('CHECK'));
        }

        function getPath() {
            return location.host + location.pathname;
        }

        c.on('data', function (p) {
            const player = coplay.player;
            switch (p.type) {
                case 'REQ':
                    c.send(pack('ACK', { timestamp: Date.now(), seq: p.data.seq }));
                    break;
                case 'ACK':
                    round = Date.now() - start;
                    count++;
                    elapsed += round;
                    setTimeout(function () {
                        heartBeat(c);
                    }, 1000);
                    break;
                case 'CHECK':
                    c.send(pack('PATH', getPath()));
                    break;
                case 'PATH':
                    if (p.data !== getPath()) {
                        alert('Coplay: Not on the same page.');
                        console.error('Not on the same page.');
                        c.close();
                    }
                    break;
                case 'MSG':
                    console.log('Remote: ' + p.data);
                    break;
                case 'SEEK':
                    player.seek(parseInt(p.data, 10));
                    break;
                case 'PAUSE':
                    player.pause();
                    break;
                case 'PLAY':
                    player.play();
                    break;
            }
        });

        heartBeat();
        checkPath();

        c.on('close', function () {
            ui.remote.value = '';
            ui.remote.disabled = false;
            ui.connect.hidden = false;
            ui.disconnect.hidden = true;

            if (ui.call) {
                ui.call.disabled = true;
            }

            coplay.connection = null;
        });
    }

    coplay.init = function () {
        const main = get(id);
        if (!main) {
            initPlayer(function () {
                initUI();
                initPeer();
            });
        }
    };

    coplay.setDisabled = function (isDisabled) {
        const ui = coplay.ui;
        ui.play.disabled = isDisabled;
        ui.pause.disabled = isDisabled;
        ui.sync.disabled = isDisabled;
        ui.restart.disabled = isDisabled;
        ui.fullscreen.disabled = isDisabled;
    };

    coplay.enable = function () {
        coplay.setDisabled(false);
    };

    coplay.disable = function () {
        coplay.setDisabled(true);
    };

    coplay.connect = function (remote) {
        const c = coplay.peer.connect(remote, {
            label: 'coplay',
            serialization: 'json',
            reliable: false
        });

        connect(c);
    };

    coplay.disconnect = function () {
        const c = coplay.connection;
        if (c) {
            c.close();
        }
    };

    window.coplay = coplay;
    coplay.init();
})(window.unsafeWindow);