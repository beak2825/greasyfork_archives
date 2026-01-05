// ==UserScript==
// @name         Absolute Enable Right Click & Copy 1.2.5
// @namespace    Absolute Right Click
// @description  Force Enable Right Click & Copy & Highlight
// @author       Absolute
// @version      1.2.5
// @include      http*://*
// @icon         https://cdn3.iconfinder.com/data/icons/communication-130/63/cursor-128.png
// @license      BSD
// @copyright    Absolute, All Right Reserved (2016)
// @grant        GM_addStyle
// @Exclude      /.*(JPG|PNG|GIF|JPEG|ico|google.[^/]|bing.com|facebook.com|pixiv.net).*/

// @downloadURL https://update.greasyfork.org/scripts/24476/Absolute%20Enable%20Right%20Click%20%20Copy%20125.user.js
// @updateURL https://update.greasyfork.org/scripts/24476/Absolute%20Enable%20Right%20Click%20%20Copy%20125.meta.js
// ==/UserScript==

    var Sites_List =  ['163.com','www.site.com','www.site.com','www.site.com'];

    (function GetSelection () {
		var style  = document.createElement('style');
		var iStyle = '*{user-select:text!important;-webkit-user-select:text!important;}';
		style.type = 'text/css';
     	if (style.styleSheet) { style.styleSheet.cssText = iStyle; }
		else { style.appendChild(document.createTextNode(iStyle)); }
		window.getSelection = null;
	 	document.oncontextmenu = null;
		document.getElementsByTagName('head')[0].appendChild(style);
		document.getElementsByTagName('body')[0].appendChild(style);
        })();

    (function CheckEvents () {
        var events = ['oncut','oncopy','ondragstart','onselectstart','oncontextmenu'];
        for (var i = 0; i < events.length; i++) 
        document.body.setAttribute(events[i],'null');
        })();

    (function FixEvents () {
		var events = ['contextmenu'];
		for (var i = 0; i < events.length; i++) {
        document.addEventListener(events[i],function(e){e.stopImmediatePropagation();});
		document.addEventListener(events[i],function(e){e.stopPropagation();});
		}})();
		
    (function RightClickButton() {
        function Mutation (callback) {
        this.isCalled = false;
        this.isUnbound = false;
        this.callback = callback;
        this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
        this.bind();
		}
    Mutation.prototype.bind = function () {
        this.events.forEach(function (event) {
        document.addEventListener(event, this, true);
		}.bind(this));
        };
    Mutation.prototype.handleEvent = function () {
        this.isCalled = true;
        this.unbind();
        };
    Mutation.prototype.unbind = function () {
		if (this.isUnbound) {
        return;
        }
    this.events.forEach(function (event) {
		document.removeEventListener(event, this, true);
        }.bind(this));
		this.isUnbound = true;
        };
    function Synchronizetion () {
		window.Promise = function () {
        };}
    Synchronizetion.prototype.restore = function () {
        this.isRestoration = true;
        };
    function EventHandler (event) {
        this.event = event;
        this.contextmenuEvent = this.createEvent(this.event.type);
        this.mouseupEvent = this.createEvent('mouseup');
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
		window.addEventListener(this.event.type, contextmenuHandler, false);
        target.dispatchEvent(this.contextmenuEvent);
		window.removeEventListener(this.event.type, contextmenuHandler, false);
        this.isCanceled = this.contextmenuEvent.defaultPrevented;
        target.dispatchEvent(this.mouseupEvent);
        };
        window.addEventListener('contextmenu', handleEvent, true);
    function handleEvent (event) {
		event.stopPropagation();
        event.stopImmediatePropagation();
        var handler = new EventHandler(event);
		window.removeEventListener(event.type, handleEvent, true);
        var sync = new Synchronizetion();
    var mutation = new Mutation(function () {
	    sync.restore(); 
		});
        handler.fire();
        window.addEventListener(event.type, handleEvent, true);
        if (handler.isCanceled && (mutation.isCalled)) {
        event.preventDefault();
		}}})();

    (function CheckIncludeSites () {
		var Check = window.location.href;
		var Match = RegExp(Sites_List.join('|')).exec(Check);
		if (Match) { Absolute_Mod(); }
        })();

    function KeyPress (e) {
		if (e.altKey && e.ctrlKey) {
	    alert("Absolute Right Click Mod Activate !!!");
		Absolute_Mod();}}
        document.addEventListener("keydown", KeyPress);

    function Absolute_Mod () {
		var events = ['contextmenu','copy','mouseup','mousedown','keyup','keydown','dragstart','selectstart'];
		for (var i = 0; i < events.length; i++) {
		document.addEventListener(events[i],function(e){e.stopPropagation();},true);
		}}


