// ==UserScript==
// @name          Absolute Enable Right Click & Copy
// @namespace     Absolute Right Click
// @description   Force Enable Right Click & Copy & Highlight
// @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
// @author        Absolute
// @version       1.4.8
// @include       http://*
// @include       https://*
// @icon          https://i.imgur.com/Iq9LtC4.png
// @compatible    Chrome Google Chrome + Tampermonkey
// @license       BSD
// @copyright     Absolute, All Right Reserved (2016-Oct-06)
// @Exclude       /.(/(^drive|w+|docs|translate).google.[a-z]|/www\.(youtube|facebook|instagram|bing|live|ebay|dropbox).com|(github|twitter|amazon).[^]).*/
// @downloadURL https://update.greasyfork.org/scripts/36217/Absolute%20Enable%20Right%20Click%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/36217/Absolute%20Enable%20Right%20Click%20%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = document.createElement("style");
    var head = document.head;
    head.appendChild(css);

    css.type = 'text/css';

    css.innerText = `* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
         user-select: text !important;
    }`;

    var elements = document.querySelectorAll("*");

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].style.userSelect == 'none') {
            elements[i].style.userSelect = 'auto';
        }
    }

    var doc = document;
    var body = document.body;

    var docEvents = [
        doc.oncontextmenu = null,
        doc.onselectstart = null,
        doc.ondragstart = null,
        doc.onmousedown = null
    ];

    var bodyEvents = [
        body.oncontextmenu = null,
        body.onselectstart = null,
        body.ondragstart = null,
        body.onmousedown = null,
        body.oncut = null,
        body.oncopy = null,
        body.onpaste = null
    ];

    setTimeout(function() {
        document.oncontextmenu = null;
    }, 2000);

    [].forEach.call(
        ['copy', 'cut', 'paste', 'select', 'selectstart'],
        function(event) {
            document.addEventListener(event, function(e) { e.stopPropagation(); }, true);
            document.removeEventListener(event, this, true);
        }
    );

    function keyPress(event) {
        if (event.ctrlKey && event.keyCode == 192) {
            return confirm("Activate Absolute Right Click Mode!") === true ? absoluteMod() : null;
        }
    }

    function absoluteMod() {
        [].forEach.call(
            ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'],
            function(event) {
                document.addEventListener(event, function(e) { e.stopPropagation(); }, true);
                document.removeEventListener(event, this, true);
            }
        );
    }

    function alwaysAbsoluteMod() {
        let sites = ['example.com','www.example.com'];
        const list = RegExp(sites.join('|')).exec(location.hostname);
        return list ? absoluteMod() : null;
    }

    setTimeout(function() {
        alwaysAbsoluteMod();
        document.addEventListener("keydown", keyPress);
    }, 100);

    if (document.domain.match(/[^].(outlook.com|office.com|pcloud.com|box.com|sync.com|onedrive.com)/gi))
        return;

    function EventsCall(callback) {
        this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
        this.bind();
    }

    EventsCall.prototype.bind = function() {
        this.events.forEach(function (event) {
            document.addEventListener(event, this, true);
        }.bind(this));
    };

    EventsCall.prototype.handleEvent = function() {
        this.isCalled = true;
    };

    EventsCall.prototype.unbind = function() {
        this.events.forEach(function (event) {}.bind(this));
    };

    function EventHandler(event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
    }

    EventHandler.prototype.createEvent = function(type) {
        var target = this.event.target;
        var event = target.ownerDocument.createEvent('MouseEvents');
        event.initMouseEvent(
            type, this.event.bubbles, this.event.cancelable,
            target.ownerDocument.defaultView, this.event.detail,
            this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
            this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
            this.event.button, this.event.relatedTarget
        );
        return event;
    };

    EventHandler.prototype.fire = function() {
        var target = this.event.target;
        var contextmenuHandler = function(event) {
            event.preventDefault();
        }.bind(this);
        target.dispatchEvent(this.contextmenuEvent);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
    };

    window.addEventListener('contextmenu', function handleEvent(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        var handler = new EventHandler(event);
        window.removeEventListener(event.type, handleEvent, true);
        var EventsCallBback = new EventsCall(function() {});
        handler.fire();
        window.addEventListener(event.type, handleEvent, true);
        if (handler.isCanceled && (EventsCallBback.isCalled)) {
            event.preventDefault();
        }
    }, true);

})();
