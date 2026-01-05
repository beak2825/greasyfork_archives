// ==UserScript==
// @name          001 Absolute Enable Right Click & Copy
// @namespace     Absolute Right Click
// @description   Force Enable Right Click & Copy & Highlight
// @shortcutKeys  [Ctrl + `] Activate Absolute Right Click Mode To Force Remove Any Type Of Protection
// @author        Absolute.
// @version       1.4.2vddaa
// @include       *://*
// @icon          https://image.ibb.co/jXPFd5/cursor_128.png
// @homepageURL   https://greasyfork.org/en/scripts/23772-absolute-enable-right-click-copy
// @compatible    Chrome Google Chrome + Tampermonkey
///@compatible    
// @license       BSD
// @copyright     Absolute, All Right Reserved (2016)
// @Exclude       /.*.(www.google.[^]|www.bing.com|www.youtube.com|www.facebook.com|www.instagram.com|twitter.com).*/

// @downloadURL https://update.greasyfork.org/scripts/29146/001%20Absolute%20Enable%20Right%20Click%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/29146/001%20Absolute%20Enable%20Right%20Click%20%20Copy.meta.js
// ==/UserScript==

    var Sites_List = ['163.com','www.site.com','www.site.com'];

    (function GetSelection () {
		var Style  = document.createElement('style');
		Style.type = 'text/css';
 		var TextNode = '*{user-select:text!important;-webkit-user-select:text!important;}';
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
//  Disable Redirect in Greasemonkey ( window.onload = function {}; )
	window.onload = function () {
		document.oncontextmenu = true;
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
        event.preventDefault();}
		};
		})();

    (function IncludesSites () {
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




