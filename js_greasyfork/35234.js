// ==UserScript==
// @name          Absolute Enable Right Click & Copy (Beta)
// @namespace     Absolute Right Click
// @description   Force Enable Right Click & Copy & Highlight
// @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
// @author        Absolute
// @version       2.1.6
// @include       http://*
// @include       https://*
// @icon          https://i.imgur.com/Iq9LtC4.png
// @compatible    Chrome Google Chrome + Tampermonkey
// @license       BSD
// @copyright     Absolute, All Right Reserved (2016-Oct-06)
// @Exclude       /.*.(www.google.[^]|docs.google.[^]|www.bing.com|www.youtube.com|www.facebook.com|www.instagram.com|twitter.com).*/
// @downloadURL https://update.greasyfork.org/scripts/35234/Absolute%20Enable%20Right%20Click%20%20Copy%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35234/Absolute%20Enable%20Right%20Click%20%20Copy%20%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = document.createElement("style");
    var head = document.head;
    head.appendChild(css);

    css.type = 'text/css';
    css.innerText = '* { user-select: text !important; -webkit-user-select: text !important; }';

    var element = document.querySelectorAll("*");

    for (var i = 0; i < element.length; i++) {
        if (element[i].style.userSelect == 'none') {
            element[i].style.userSelect = 'auto';
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
            document.removeEventListener(event, null, true);
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
                document.removeEventListener(event, null, true);

            }
        );
    }

    setTimeout(function() {
        contextMenu();
        document.addEventListener("keydown", keyPress);
    }, 100);

    function contextMenu() {
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
        function handleEvent(event) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            var handler = new EventHandler(event);
            window.removeEventListener(event.type, handleEvent, true);
            var EventsCallBback = new EventsCall(function() {});
            handler.fire();
            window.addEventListener(event.type, handleEvent, true);
            if (handler.isCanceled && (EventsCallBback.isCalled))
                event.preventDefault();
        }

        window.addEventListener('contextmenu', handleEvent, true);
    }

})();

