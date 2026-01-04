
// ==UserScript==
// @name          Запрет от копирования
// @namespace     Absolute Right Click
// @description   Force Enable Right Click & Copy & Highlight
// @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
// @author        Absolute
// @version       1.12
// @include       http*://topcinema.tv/*
// @icon          https://image.ibb.co/jXPFd5/cursor_128.png

// @compatible    Chrome Google Chrome + Tampermonkey
// @license       BSD
// @copyright     Absolute, All Right Reserved (2016-Oct-06)


// @downloadURL https://update.greasyfork.org/scripts/35640/%D0%97%D0%B0%D0%BF%D1%80%D0%B5%D1%82%20%D0%BE%D1%82%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/35640/%D0%97%D0%B0%D0%BF%D1%80%D0%B5%D1%82%20%D0%BE%D1%82%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

    (function GetSelection () {
		var Style  = document.createElement('style');
		Style.type = 'text/css';
 		var TextNode = '*{user-select:text!important; -webkit-user-select:text!important;}';
      	if (Style.styleSheet) Style.styleSheet.cssText = TextNode;
 		else Style.appendChild(document.createTextNode(TextNode));
  		document.getElementsByTagName('head')[0].appendChild(Style);
        })();

    (function SetEvents () {
		var events = ['copy','cut','paste','select','selectstart'];
        for (var i = 0; i < events.length; i++)
		document.addEventListener(events[i],function(e){e.stopPropagation();},true);
        })();

    (function RestoreEvents () {
		var n = null;
		var d = document;
		var b = document.body;
		var SetEvents = [d.oncontextmenu=n,d.onselectstart=n,d.ondragstart=n,d.onmousedown=n];
		var GetEvents = [b.oncontextmenu=n,b.onselectstart=n,b.ondragstart=n,b.onmousedown=n,b.oncut=n,b.oncopy=n,b.onpaste=n];
		})();

    (function RightClickButton () {
		setTimeout(function() {
		document.oncontextmenu = null;
		},2000);
    function EventsCall (callback) {
        this.events = ['DOMAttrModified','DOMNodeInserted','DOMNodeRemoved','DOMCharacterDataModified','DOMSubtreeModified'];
        this.bind();
		}
    EventsCall.prototype.bind = function () {
        this.events.forEach(function (event) {
        document.addEventListener(event, this, true);
		}.bind(this));
        };
    EventsCall.prototype.handleEvent = function () {
        this.isCalled = true;
        };
    EventsCall.prototype.unbind = function () {
        this.events.forEach(function (event) {
        }.bind(this));
        };
    function EventHandler (event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
        }
    EventHandler.prototype.createEvent = function (type) {
		var target = this.event.target;
		var event = target.ownerDocument.createEvent('MouseEvents');
		event.initMouseEvent(type, this.event.bubbles, this.event.cancelable,
        target.ownerDocument.defaultView, this.event.detail,
   	    this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
        this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
        this.event.button, this.event.relatedTarget);
		return event;
        };
    EventHandler.prototype.fire = function () {
        var target = this.event.target;
        var contextmenuHandler = function (event) {
        event.preventDefault();
        }.bind(this);
        target.dispatchEvent(this.contextmenuEvent);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
        };
        window.addEventListener('contextmenu', handleEvent, true);
    function handleEvent (event) {
		event.stopPropagation();
        event.stopImmediatePropagation();
        var handler = new EventHandler(event);
		window.removeEventListener(event.type, handleEvent, true);
    var EventsCallBback = new EventsCall(function () {
		});
        handler.fire();
        window.addEventListener(event.type, handleEvent, true);
        if (handler.isCanceled && (EventsCallBback.isCalled))
        event.preventDefault();
	    }})();

    (function IncludesSites () {
		var Sites_List = [' ',' ',' '];
		var Check = window.location.href;
		var Match = RegExp(Sites_List.join('|')).exec(Check);
		if (Match) { Absolute_Mod(); }
        })();

    function KeyPress (event) {
		if (event.ctrlKey && event.keyCode == 192) {
		if (confirm("Activate Absolute Right Click Mode!") === true)
        Absolute_Mod();
		}}
	    document.addEventListener("keydown", KeyPress);

    function Absolute_Mod () {
		var events = ['contextmenu','copy','cut','paste','mouseup','mousedown','keyup','keydown','drag','dragstart','select','selectstart'];
		for (var i = 0; i < events.length; i++) {
		document.addEventListener(events[i],function(e){e.stopPropagation();},true);
		}}


