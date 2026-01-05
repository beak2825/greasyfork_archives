// ==UserScript==
// @name         frisch's UserScript Extender
// @namespace    http://null.frisch-live.de/
// @version      0.76
// @description  Extends the document with a new namespace for user script crosswide functions to utilize. Has no use alone but can be accessed by other scripts using document.fExt
// @author       frisch
// @include      *
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/24896/frisch%27s%20UserScript%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/24896/frisch%27s%20UserScript%20Extender.meta.js
// ==/UserScript==
if(document.fExt === undefined) {
	console.log("Initializing frisch's UserScript Extender...");

	// Initialization
	fExt = {};
	fExt.jq = $.noConflict();
	// Overwrites the contains expression to be case-insensitive
	fExt.jq.expr[':'].contains = function(a, i, m) {
		return fExt.jq(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};
	fExt.settings = {
		minShowTime: 3000, // in milliseconds
		maxShowTime: 7000, // in milliseconds
		position: "BottomRight", // Position for the popup menu: TopRight, TopLeft, BottomRight, BottomLeft
		animationType: "fade", // Animation for the popup menu: slide, fade, none
		animationSpeed: 750,
		customContextMenu: true,
		hideContextMenuOnLeave: true, // automatically fades out the custom context menu when it loses focus, otherwhise only hides when you click somewhere
		hideContextMenuDistance: 50, // the distance the cursor has to travel outside of the context menu to hide it
		progressType: "progressbar", // Possible values: hourglass, progressbar
		toleranceX: 20, // pixels as tolerance for the context menu, adjust the position slightly
		toleranceY: 30, // pixels as tolerance for the context menu, adjust the position slightly
		ctxActorMark: true, // set to true to highlight the actor of the context menu when active
		ctxActorMarkThickness: 2, // set the thickness of the highlighting border as pixel
	};
	fExt.popupQueue = [];
	fExt.popping = false;

	var hourGlass0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAhkICgkAYfvBAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKpJREFUSMetlcEOwyAMQ+39/z97h0nrOkjihPZAAYlXVPALcPgQgE7WEzhA8LODKYLfZoTg7dVGcOm0ENx2bQTDgYVgOiwRLCdSBK2pEEHAB6wI2pvaIgj0AReC87SpOtbXEz5Ivq97Zrs/UWvsO8eovTnci6RYPs5VVu6vKkyqFZjFWZ5FI6EYOkiEIlNIgdLUUOJGqmpK+U/rGpSFn8KiYWHiA8X1NM14AxEBKx1JZtGVAAAAAElFTkSuQmCC";
	var hourGlass25 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAhkICgR+0Id8AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKhJREFUSMetlUkOxCAMBLv4/589h5koG3hjckgAydVtR8bS5oMk24lH+iKsoSx+3zqC++tA1C1cAQ0LT0AewXSZRrDcpBC42xBBeOAiSB0tEUh5wBtB2tQUgVQHnAj63WbRbx3/uA8cfbv3bLWIlxJQT+FQDy4LInUFLkYUHl1ZI6PuIciGrxIZidxdF+TV5y6GH05YC2rqbxc0p8JjsFi/k7aH62436wPGSjUSU11z+AAAAABJRU5ErkJggg==";
	var hourGlass50 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAhkICTqUnMkUAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKpJREFUSMe1lMsOgzAMBHfy///sHopEQsGv0BxAMtpZJ8ErbS4k2Y4e6YuwhrM43nUE66OKmJVM9SRiNWb5lkBc+r4ACi08AZIteAAfQVhwEaRKjwikPOAXQbqpWwRSHXAi6E+bRdc63sgDx9/Wma0e4nQE1LdwyAlmjMhdQRcjkkeRRcbd62L48jhvRuzupx7lPHIizTo/IC35Taxbdwxoy6d7tb8NY2Z9AJxfMxVU9/UgAAAAAElFTkSuQmCC";
	var hourGlass75 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAhkICTPtQHGwAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAK1JREFUSMetlUkSgzAMBKf5/5/FIUnFG9ZiOEAVaHqE8Qjp8ECSneiRPggrOIvvNY+gP2URrZLmfhDRG9M9CyCGvgeAi2DSMNVsECwULOoeECzrWVptW4gANi1EATOCcFNLBFIe8EdQT5t5O+t6Yx5s/K3PbHYRmyUg/wo/dycgeO5yurh8+b4LEkkIhsly342k3Bkolt89FOQPQ9Vqe5iifJhxVk/S8c/1NM26AScHLxnJI48dAAAAAElFTkSuQmCC";
	var hourGlass100 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgAhkICSxgSHxFAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKpJREFUSMetlUsShDAIBem5/52ZxbhIIhA+40Kr9L0GCSEiwwsR0YkfkR9CG5GF51lHsN+qiNXJ8j6J2AOzfUsgjrwPwBXBy8NLEyAwHBg6B4GpxwxlIHDUONkeCFwtbr0WBIGSoOQPglBHuOiaUl0Ql876/GMejH6BhL1ZRM0pSdqLjaT5fCnYk5tJa+tG0X4ZKFrvHhp2Z6hqr4dp2o8xof2dND5cp7tZvgvYKh27llJDAAAAAElFTkSuQmCC";

	var pbar0 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkTCSsaEe8UvgAAALZJREFUSMfdll0OxCAIhAfDjfT+J5Az0adumo1FUXSTnacmVj8ZflpSVQAAEaGlnPPnWUTg1X0+v73wBFjro/C0AvGIIwAj0bF1yHNjD+KKqAWZsam1h98gMwDrYrya7BF7Tes8kJGLpRMQACBVBREpNkpVKeGQvhuWIqtQRHQ5R16FgXrDNQzUs/aYdf9X3nR/akspZqJnh2yt9UflPfPj4Sl59vTCSl/xzii29ZHlSIoaMb31C3teW2ty8diEAAAAAElFTkSuQmCC";
	var pbar25 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkTCSsrQDEUhAAAALZJREFUSMfdlssNxCAMRMfIHUH/FcQ1zZ6yyoEYzG+lnVMkAg+PP4mQBACICGrKOX+fzQxR3efr2wtPgLfeC08zkIh0BaAnOvUOeW5sQUIR1SAjNtX26BtkBOBdTGeT3WOva10E0nOxdAICAEISIkJsFElJOCTtqCIZrUIz43SOoloGag3XZaCWtces+7/ylvtTW0pxEz06ZK/r+lF5j/x4REpeI70w01e6M4ptfeQ5klaNmNb6B29WW2uHr2HMAAAAAElFTkSuQmCC";
	var pbar50 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkTCSs7XYYE4AAAALVJREFUSMfdlssNxCAMRMfIHZn+Kwg1zZ6yyoEYzG+lnVMkAg+PP4mQBACICGoys+9zKQVR3efr2wtPgLfeC08zkIh0BaAnOvUOeW5sQUIR1SAjNtX26BtkBOBdTGeT3WOva10E0nOxdAICAEISIkJsFElJOKThHJmZdNjL6RxFtQzUGq7LQK3qO2bd/5W33J/anLOb6NEhe13Xj8p75McjUvIa6YWZvtKdUWzrI8+RtGrEtNY/mktYa4XsqhcAAAAASUVORK5CYII=";
	var pbar75 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkTCSwJ2hDDpwAAAK1JREFUSMftllEOAyEIRAfDjfD+J9AzsV/bbBpFQWuTpvNlgvJwNCipKgCAiNCSiLzGtVZ4defn3oQnwIrPwtMKxCPeAZjZHVtJngtHENeOWpCITa013INEAFZhvHrYM/aa1nkgM4WlExAAIFUFESk+KFWlhEPinclEhN7s1eUz8uoPCuv3rjfdT23O2ewC0SZbSvnSZYh8PDydnXuBnZDtLcgqNp2AuEAjW0fxC+YyVWuwau4lAAAAAElFTkSuQmCC";
	var pbar100 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkTCTAYVte+CAAAAKJJREFUSMftllEOxCAIRAfDjfT+J9AzzX510w+loLabbDpfJigPR4MKSQCAiKCnnPN33FpDVEd+HU04A6y4F55WIBHpDoBnd2olOS+8goR21IPM2NRboyPIDMAqTFcP22OvaV0E4iksPQEBACEJESFuFElJeEgv6AX9MUiOp7aUYnaB2SZba/2RdTMfj0hn11FgJ2T5mfAAbrl1liNpRxJP/APHYkptRNVvhwAAAABJRU5ErkJggg==";

	var loader0, loader25, loader50, loader75, loader100;

	switch(fExt.settings.progressType){
		case "progressbar":
			loader0 = pbar0;
			loader25 = pbar25;
			loader50 = pbar50;
			loader75 = pbar75;
			loader100 = pbar100;
			break;
		case "hourglass":
			loader0 = hourGlass0;
			loader25 = hourGlass25;
			loader50 = hourGlass50;
			loader75 = hourGlass75;
			loader100 = hourGlass100;
			break;
		default:
			loader0 = hourGlass0;
			loader25 = hourGlass25;
			loader50 = hourGlass50;
			loader75 = hourGlass75;
			loader100 = hourGlass100;
			break;
	}

	var topZIndex = 0;
	fExt.TopZIndex = function() {
		return topZIndex;
	};
	fExt.jq("*").each(function(){
		var thisZIndex = parseInt(fExt.jq(this).css('z-index'));
		if(!isNaN(thisZIndex) && thisZIndex > topZIndex)
			topZIndex = thisZIndex + 1;
	});

	// Custom Elements
	fExt.fExtPopup = fExt.jq('<div id="fExtPopup" class="fExtElement" style="display:none; position:fixed; width:auto; height:auto; background-color:#545454; padding:10px; border-color:white; border-style:groove; color:white; z-index: ' + topZIndex + '; text-align:center; font-size:12px;"></div>');
	fExt.jq("body").append(fExt.fExtPopup);

	fExt.fExtMessage = fExt.jq('<div id="fExtMessage" class="fExtElement" style="display:none; position:fixed; width:auto; height:auto; background-color:#545454; padding:25px; border-color:white; border-style:groove; color:white; z-index: ' + topZIndex + '; text-align:center; font-size:large; padding:20px;"></div>');
	fExt.fExtMessageText = fExt.jq('<span style="display: inline-block;"></span>');
	fExt.fExtMessageText.appendTo(fExt.fExtMessage);
	fExt.fExtMessage.appendTo("body");

	// Functions
	fExt.setLoading = function(percentage){
		if(percentage >= 100){
			fExt.jq("link[rel='icon']").attr("href", loader100);
			fExt.jq("link[rel='shortcut icon']").attr("href", loader100);

			setTimeout(function(){ fExt.setLoading(-1); },fExt.settings.minShowTime);
		}
		else if(percentage >= 75){
			fExt.jq("link[rel='icon']").attr("href", loader75);
			fExt.jq("link[rel='shortcut icon']").attr("href", loader75);
		}
		else if(percentage >= 50){
			fExt.jq("link[rel='icon']").attr("href", loader50);
			fExt.jq("link[rel='shortcut icon']").attr("href", loader50);
		}
		else if(percentage >= 25){
			fExt.jq("link[rel='icon']").attr("href", loader25);
			fExt.jq("link[rel='shortcut icon']").attr("href", loader25);
		}
		else if(percentage >= 0){
			fExt.jq("link[rel='icon']").attr("href", loader0);
			fExt.jq("link[rel='shortcut icon']").attr("href", loader0);
		}
		else {
			fExt.jq("link[rel='icon']").attr("href", siteFavIconHref);
			fExt.jq("link[rel='shortcut icon']").attr("href", siteFavIconHref);
		}
	};

	fExt.enqueuePopup = function(msg) {
		fExt.popupQueue.push(msg);
	};

	fExt.dequeuePopup = function() {
		var rv;
		if(fExt.popupQueue.length > 0){
			rv = fExt.popupQueue[0];
			fExt.popupQueue.splice(0, 1);
		}
		return rv;
	};

	var ignoreZIndexelementIDs = ["fExtPopup","fExtMessage","fExtContextMenu","fExtUtilSelectorBox"];
	fExt.reassignZIndex = function(){
		fExt.jq("*").each(function(){
			var jqElement = fExt.jq(this);
			if(jqElement.css('z-index') >= topZIndex && fExt.jq.inArray(this.id, ignoreZIndexelementIDs) < 0) {
				jqElement.css("z-index", topZIndex - 1);
			}
		});
	};

	fExt.createStyle = function(newClass) {
		fExt.jq( "<style>" + newClass + "</style>" ).appendTo("head");
	};

	fExt.center = function (element,w) {
		if(w !== undefined)
			element.width(w);

		element.css("position", "fixed")
			.css("top", ((fExt.jq(window).height() - fExt.jq(element).outerHeight()) / 2) + "px")
			.css("left", ((fExt.jq(window).width() - fExt.jq(element).outerWidth()) / 2) + "px");
	};

	fExt.popup = function(msg) {
		if(msg !== undefined){
			if(fExt.popping){
				fExt.enqueuePopup(msg);
				return;
			}
			fExt.popping = true;
			fExt.fExtPopup.html(msg);

			fExt.show(fExt.fExtPopup);

			var showTime = msg.length * 50;

			if(showTime < fExt.settings.minShowTime)
				showTime = fExt.settings.minShowTime;
			else if(showTime > fExt.settings.maxShowTime)
				shotTime = fExt.settings.maxShowTime;

			setTimeout(function(){
				fExt.hide(fExt.fExtPopup);
				setTimeout(function(){
					fExt.fExtPopup.text('');
					fExt.popping = false;
					fExt.popup(fExt.dequeuePopup());
				},fExt.settings.animationSpeed);
			},showTime);
		}
	};

	fExt.clipboard = function(action, text) {
		var clipboardCopy, retVal;
		action = action.toLowerCase();

		if(action === "copy") {
			GM_setClipboard(text);
			return true;
		}

		clipboardCopy = document.createElement('textarea');
		document.body.appendChild(clipboardCopy);
		clipboardCopy.value = text;
		clipboardCopy.select();

		var msg;
		try {
			var successful = document.execCommand(action);
			if(successful)
				msg = action + " successful";
			else
				msg = "Could not perform Clipboard-Action " + action;

			if(clipboardCopy.value.length <= 50)
				msg += " (" + clipboardCopy.value + ")";

			document.fExt.popup(msg);
		}
		catch (err) {
			document.fExt.popup("Error on Clipboard-Action " + action +": " + err);
		}

		if(clipboardCopy)
			clipboardCopy.remove();
	};

	fExt.message = function(msg) {
		if(msg !== undefined && msg.length > 0){
			fExt.fExtMessageText.text(msg);

			if(!fExt.fExtMessage.is(":visible"))
				fExt.show(fExt.fExtMessage);

			fExt.center(fExt.jq("div#fExtMessage"));
		}
		else {
			fExt.hide(fExt.fExtMessage);
			setTimeout(function(){
				fExt.fExtMessageText.text('');
			},fExt.settings.animationSpeed);
		}
	};

	fExt.rotate = function(element, rotation) {
		var jqEl = fExt.jq(element);
		var degree = jqEl.data('rotation');

		if (!degree)
			degree = 0;

		degree += rotation;

		jqEl.css('-webkit-transform','rotate(' + degree + 'deg)');
		jqEl.data('rotation',degree);
	};

	fExt.zoom = function(element, zoom){
		var jqEl = fExt.jq(element);
		var zValue = parseFloat(jqEl.css('zoom'));
		var zAdd = parseFloat(zoom) / 100;

		if(!zValue)
			zValue = 1.0;

		var zNew = zValue + zAdd;
		jqEl.css('zoom', zNew);
	};

	fExt.zoomIn = function(element, zoom){
		fExt.zoom(element, zoom);
	};

	fExt.zoomOut = function(element, zoom){
		fExt.zoom(element, zoom * -1);
	};

	switch(fExt.settings.animationType) {
		case "fade":
			fExt.show = function(element, speed, callback) {
				fExt.jq(element).fadeIn(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			fExt.hide = function(element, speed, callback) {
				fExt.jq(element).fadeOut(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			break;
		case "slide":
			fExt.show = function(element, speed, callback) {
				fExt.jq(element).slideDown(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			fExt.hide = function(element, speed, callback) {
				fExt.jq(element).slideUp(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			break;
		default:
			fExt.show = function(element, speed, callback) {
				fExt.jq(element).show(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			fExt.hide = function(element, speed, callback) {
				fExt.jq(element).hide(speed >= 0 ? speed : fExt.settings.animationSpeed, callback);
			};
			break;
	}

	switch(fExt.settings.position) {
		case "TopRight":
			fExt.fExtPopup.attr("style", fExt.fExtPopup.attr("style") + "top:50px; right:50px;");
			break;
		case "TopLeft":
			fExt.fExtPopup.attr("style", fExt.fExtPopup.attr("style") + "top:50px; left:50px;");
			break;
		case "BottomRight":
			fExt.fExtPopup.attr("style", fExt.fExtPopup.attr("style") + "bottom:50px; right:50px;");
			break;
		case "BottomLeft":
			fExt.fExtPopup.attr("style", fExt.fExtPopup.attr("style") + "bottom:50px; left:50px;");
			break;
		default:
			break;
	}

	var siteFavIcon = fExt.jq("link[rel='icon']");
	if(siteFavIcon === undefined) {
		fExt.jq("head").append('<link id="favIcon" rel="icon" href="');
		siteFavIcon = fExt.jq("link[rel='icon']");
	}
	else {
		siteFavIcon.attr("id","favIcon");
	}
	var siteFavIconHref = siteFavIcon.attr("href");

	fExt.getSelection = function() {
		return window.getSelection().toString();
	};

	fExt.getSource = function(element) {
		var retVal;

		var jqTarget = fExt.jq(element);
		var ucTagName = element.tagName.toUpperCase();

		switch(ucTagName) {
			case "IMG":
				retVal = element.src;
				break;
			case "A":
				retVal = element.href;
				break;
			case "VIDEO":
				var videoSource = jqTarget.find("source");
				retVal = (videoSource.length > 0) ? videoSource.get(0).src : undefined;
				break;
			case "INPUT":
				return jqTarget.val();
			default:
				jqTarget = fExt.jq(element).closest("a");
				if(jqTarget.length > 0)
					retVal = jqTarget.attr("href");
				break;
		}

		if(retVal) {
			if(!retVal.match("http.*")) {
				retVal = window.location.origin + retVal;
			}
		}
		else {
			retVal = fExt.jq(element).text();
		}

		return retVal;
	};

	fExt.createStyle(".fExtLoader { background:url('" + loader50 + "')  #EFF7FF no-repeat top center; }");

	// ContextMenu
	if(fExt.settings.customContextMenu) {
		fExt.ctxMenu = [];

		// Styles
		fExt.createStyle("#fExtContextMenu,#fExtContextMenu * { text-align: left !important; text-decoration: none !important; color: #fff; z-index: " + (topZIndex + 10) + "; }");
		fExt.createStyle("#fExtContextMenu { position: fixed; }");
		fExt.createStyle("#fExtContextMenu,.ctxSubList { font-size: 14px; background-color: #263238; width: 300px; height: auto; padding: 0;}");
		fExt.createStyle("#fExtContextMenu a,#fExtContextMenu hr,#fExtContextMenu li { width: 100%;}");
		fExt.createStyle("#fExtContextMenu .ctxElement { float: left; clear: left;}");
		fExt.createStyle("#fExtContextMenu li>a,#fExtContextMenu li>div,.ctxSubList li>a,.ctxSubList li>div { padding: 8px;}");
		fExt.createStyle("#fExtContextMenu li hr { margin: 0; border-style: solid; border-color: #666; border-width: 1px 0 0 0;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub { cursor: default; font-weight: bold;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub * { cursor: pointer; font-weight: normal;}");
		fExt.createStyle("#fExtContextMenu li { list-style-type: none; margin: 0 !important;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub:hover>div.ctxSubLabel,");
		fExt.createStyle("#fExtContextMenu li.ctxSub:hover>div.ctxArrow {}");
		fExt.createStyle("#fExtContextMenu li.ctxItem { padding-left: 5px;}");
		fExt.createStyle("#fExtContextMenu li.ctxItem { border: none; position: initial; box-sizing: border-box; transition: all 250ms ease; }");
		fExt.createStyle("#fExtContextMenu li.ctxItem:hover { background: #3a7999; color: #3a7999; box-shadow: inset 0 0 0 3px #3a7999; }");
		fExt.createStyle("#fExtContextMenu li.ctxSub.disabled div.ctxSubLabel:hover,");
		fExt.createStyle("#fExtContextMenu li.ctxItem.disabled:hover a,#fExtContextMenu li.disabled div.ctxSubLabel,#fExtContextMenu li.disabled a { opacity: 0.70; font-style: italic; padding-left: 7px !important;}");
		fExt.createStyle("#fExtContextMenu li.ctxSeparator { display: inline-block;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub div.ctxSubLabel { padding-left: 10px !important; float: left; clear: left;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub div.ctxArrow { float: right; clear: right;}");
		fExt.createStyle("#fExtContextMenu li.ctxSub ul.ctxSubList { position: absolute; height: auto;}");
		fExt.createStyle(".fExtCtxHighlighter { position: absolute; background-color: red; display: block;}");

		// Default variables
		fExt.ctxMenu.uniqueID = 1;
		fExt.ctxMenu.allItems = [];
		fExt.ctxMenu.actor = undefined;
		fExt.ctxMenu.actorStyles = '';
		fExt.ctxMenu.html = fExt.jq('<ul id="fExtContextMenu" class="ctxElement" style="display: none;"></ul>');
		fExt.ctxMenu.html.appendTo("body");
		fExt.ctxMenu.Show = function() { fExt.show(fExt.ctxMenu.html, 0); };
		fExt.ctxMenu.Hide = function(speed) {
			fExt.hide(fExt.ctxMenu.html, speed, function(){
				if(fExt.ctxMenu.actor) {
					if (fExt.settings.ctxActorMark)
						fExt.jq(".fExtCtxHighlighter").remove();
				}
			});
		};

		// Private Methods
		ctxCtor = function(ret) {
			ret.ItemText = function(value) {
				if(value === undefined)
					return this.label.text();

				this.label.text(value);
			};
			ret.Toggle = function(enabled) {
				if(enabled === true || (enabled === undefined && this.hasClass("disabled")))
					this.removeClass("disabled");
				else
					this.addClass("disabled");
			};
			ret.IsDisabled = function() {
				return this.hasClass("disabled");
			};
			ret.ID = function() {
				return this.itemId;
			};
			ret.Remove = function() {
				if(ret.hasClass("ctxSub")) {
					ret.Clear();
				}
				else if(ret.sub) {
					ret.sub.Items.splice(ret.sub.Items.indexOf(ret),1);
				}
				ret.remove();
			};
			ret.ClickCloses = true;
		};

		getParentFrom = function(sub) {
			if(sub !== undefined)
				return fExt.jq(sub).find("ul:first");
			else
				return fExt.ctxMenu.html;
		};

		setZIndex = function(item, parent) {
			var parentzIndex = parent.css("z-index");
			parentzIndex++;
			item.css("z-index", parentzIndex);
			item.children().each(function() { fExt.jq(this).css("z-index", parentzIndex); });
		};

		// Public Methods
		fExt.ctxMenu.addItem = function(label, unused, sub) {
			console.log("The method 'addItem' is obsolete, please use 'addCtxItem(label, sub)'!");
			return fExt.ctxMenu.addCtxItem(label, sub);
		};

		fExt.ctxMenu.addCtxItem = function(label, sub) {
			var ret = fExt.jq('<li class="ctxItem ctxElement"></li>');
			var retObj = fExt.jq('<a href="#" class="ctxElement">' + label + '</a>');
			retObj.appendTo(ret);
			ret.label = retObj;

			if(sub) {
				sub.Add(ret);
				ret.sub = sub;
			}
			else {
				ret.appendTo(fExt.ctxMenu.html);
				setZIndex(ret, fExt.ctxMenu.html);
			}

			ctxCtor(ret);

			ret.Attribute = function(attribute, value) {
				if(value === undefined)
					return ret.attr(attribute);
				else
					ret.attr(attribute, value);
			};

			ret.Trigger = function(){
				fExt.ctxMenu.actor = ret;
				if(ret.Action)
					ret.Action(undefined, ret, fExt.ctxMenu.actor);
			};

			ret.Action = undefined;
			fExt.ctxMenu.assignID(ret);
			return ret;
		};

		fExt.ctxMenu.addSub = function(label, orientation, sub) {
			console.log("The method 'addSub' is obsolete, please use 'addCtxSub(label, sub, orientation)'!");
			return fExt.ctxMenu.addCtxSub(label, sub, orientation);
		};

		fExt.ctxMenu.addCtxSub = function(label, sub, orientation) {
			if(orientation !== undefined)
				console.log("The orientation parameter is obsolete, please use addCtxSub(label, sub).");

			var ret = fExt.jq('<li class="ctxElement ctxSub"><div class="ctxElement ctxArrow">&gt;</div></li>');
			var list = fExt.jq('<ul class="ctxElement ctxSubList" style="display: none"></ul>');
			list.appendTo(ret);
			ret.list = list;
			var element = fExt.jq('<div class="ctxElement ctxSubLabel">' + label + ' </div>');
			element.appendTo(ret);
			ret.label = element;

			ctxCtor(ret);

			ret.Items = [];

			var parentMenu = getParentFrom(sub);

			if(sub)
				sub.Add(ret);
			else {
				ret.appendTo(parentMenu);
				setZIndex(ret, parentMenu);
			}

			ret.Add = function(item) {
				ret.Items.push(item);
				item.appendTo(ret.list);
				setZIndex(item, parentMenu);
			};

			ret.Clear = function() {
				while(ret.Items.length > 0) {
					ret.Items[0].remove();
					ret.Items.splice(0, 1);
				}
			};

			return ret;
		};

		fExt.ctxMenu.addSeparator = function(sub) {
			var ret = fExt.jq('<li class="ctxElement ctxSeparator"><hr/></li>');

			sub.Add(ret);

			return ret;
		};

		fExt.ctxMenu.assignID = function(item) {
			if(item.ID() !== undefined)
				console.log("Item already has an ID: " + item.ID());

			item.itemId = fExt.ctxMenu.uniqueID;
			item.data("Item-ID", item.itemId);
			fExt.ctxMenu.uniqueID++;
			fExt.ctxMenu.allItems.push(item);
		};

		fExt.ctxMenu.getItem = function(id) {
			if(id !== undefined) {
				for(i = 0;i < fExt.ctxMenu.allItems.length; i++) {
					var item = fExt.ctxMenu.allItems[i];
					if(id === item.ID())
						return item;
				}
			}

			return undefined;
		};

		// Events
		fExt.ctxMenu.html.on("click", "li", function( event ) {
			var sender = fExt.ctxMenu.getItem(fExt.jq(this).data("Item-ID"));
			if(sender === undefined || sender.Action === undefined)
				return true;

			event.preventDefault();
			if(!sender.IsDisabled())
				sender.Action(event, sender, fExt.ctxMenu.actor);

			if(sender.ClickCloses)
				fExt.ctxMenu.Hide(0);

			return false;
		});

		fExt.ctxMenu.html.on("mouseenter", "li.ctxSub", function(event) {
			var sub = fExt.jq(this);
			var subOffs = sub.offset();
			var ul = sub.children("ul.ctxSubList:first");

			if(ul.children("li.ctxItem, li.ctxSub").length === 0)
				return;

			fExt.show(ul, 0);

			var height = ul.height();
			var width = ul.width();
			var y = subOffs.top;
			var x = subOffs.left + sub.width();
			if ((x + width) >= window.screen.availWidth)
				x = subOffs.left - ul.width();
			if ((y + height + 100 - window.scrollY) >= window.screen.availHeight)
				y = y - height + fExt.settings.toleranceY;

			if ((y - window.scrollY) < 0)
				y = window.scrollY;
			if ((x  - window.scrollX) < 0)
				x = window.scrollX;

			if (y < event.clientY && (y + height) <= event.clientY)
				y += fExt.settings.toleranceY;

			ul.offset({ top: y, left: x});
		});

		fExt.ctxMenu.html.on("mouseleave", "li.ctxSub", function(event) {
			var ul = fExt.jq(this).children("ul.ctxSubList:first");
			fExt.hide(ul, fExt.settings.animationSpeed);
		});

		fExt.ctxMenu.html.on("mouseenter", "li.ctxSub", function(event) {
			var ul = fExt.jq(this).children("ul.ctxSubList:first");

			if(fExt.jq(this).find("li.ctxItem").length > 0)
				fExt.show(ul, 0);
		});

		fExt.customContextMenuHandler = function (event) {
			fExt.ctxMenu.actor = fExt.jq(event.target);

			fExt.ctxMenu.html.trigger("fExtContextMenuOpening", [fExt.ctxMenu.actor, event]);

			if(event.isDefaultPrevented())
				return true;

			event.preventDefault();

			if (fExt.settings.ctxActorMark) {
				fExt.jq(".fExtCtxHighlighter").remove();

				var offs = fExt.ctxMenu.actor.offset();
				var coords = [{
					name: "top",
					x: offs.left,
					y: offs.top - fExt.settings.ctxActorMarkThickness,
					height: fExt.settings.ctxActorMarkThickness,
					width: fExt.ctxMenu.actor.width(),
				},{
					name: "left",
					x: offs.left - fExt.settings.ctxActorMarkThickness,
					y: offs.top,
					height: fExt.ctxMenu.actor.height(),
					width: fExt.settings.ctxActorMarkThickness,
				},{
					name: "bottom",
					x: offs.left,
					y: offs.top + fExt.ctxMenu.actor.height() + fExt.settings.ctxActorMarkThickness,
					height: fExt.settings.ctxActorMarkThickness,
					width: fExt.ctxMenu.actor.width(),
				},{
					name: "right",
					x: offs.left + fExt.ctxMenu.actor.width() + fExt.settings.ctxActorMarkThickness,
					y: offs.top,
					height: fExt.ctxMenu.actor.height(),
					width: fExt.settings.ctxActorMarkThickness,
				},];

				var zIndex = fExt.ctxMenu.actor.css("z-index");
				if(zIndex != "auto")
					zIndex++;

				for(var ind in coords){
					fExt.jq("<div class='fExtCtxHighlighter' style='position: absolute; z-index: " + zIndex + "; width: " + coords[ind].width + "px; height: " + coords[ind].height + "px; left: " + coords[ind].x + "px; top: " + coords[ind].y + "px;'></div>").appendTo("body");
				}
			}

			var y = event.clientY - fExt.settings.toleranceY,
				x = event.clientX - fExt.settings.toleranceX;
			if ((x + fExt.ctxMenu.html.width()) >= window.screen.availWidth)
				x = x - fExt.ctxMenu.html.width() + (fExt.settings.toleranceX * 1.5);
			if ((y + fExt.ctxMenu.html.height() + 100) >= window.screen.availHeight)
				y = y - fExt.ctxMenu.html.height() + (fExt.settings.toleranceY * 1.5);

			if (y < 0)
				y = 0;
			if (x < 0)
				x = 0;

			fExt.ctxMenu.html.css({
				top: y,
				left: x
			});

			fExt.reassignZIndex();

			fExt.ctxMenu.Show();

			return false;
		};

		if(fExt.settings.hideContextMenuOnLeave) {
			var ctxLeaveCheck = {
				distance: 0,
				x: null,
				y: null,
				detectDistance: false
			};
			ctxLeaveCheck.reset = function(){
				this.distance = 0;
				this.x = null;
				this.y = null;
				this.detectDistance = false;
			};

			fExt.jq(document).mousemove(function(event) {
				if(!ctxLeaveCheck.detectDistance)
					return true;


				if(!ctxLeaveCheck.x) {
					ctxLeaveCheck.x = event.clientX;
					ctxLeaveCheck.y = event.clientY;
					return;
				}

				ctxLeaveCheck.distance += Math.sqrt(Math.pow(ctxLeaveCheck.y - event.clientY, 2) + Math.pow(ctxLeaveCheck.x - event.clientX, 2));

				if(ctxLeaveCheck.distance > fExt.settings.hideContextMenuDistance) {
					ctxLeaveCheck.reset();
					fExt.ctxMenu.html.trigger("fExtContextMenuClosing", [fExt.ctxMenu.actor, event]);
					fExt.ctxMenu.Hide();
				}
				else {
					ctxLeaveCheck.x = event.clientX;
					ctxLeaveCheck.y = event.clientY;
				}
			});

			fExt.ctxMenu.html.mouseleave(function(event) {
				ctxLeaveCheck.detectDistance = true;
			});
			fExt.ctxMenu.html.mouseenter(function() {
				ctxLeaveCheck.reset();
				fExt.ctxMenu.html.finish();
				fExt.ctxMenu.Show(0);
			});
		}
		else {
			fExt.jq("body").click(function(event) {
				if(!fExt.jq(this).hasClass("ctxElement") && fExt.ctxMenu.html.is(":visible")) {
					fExt.ctxMenu.html.trigger("fExtContextMenuClosing", [fExt.ctxMenu.actor, event]);

					if(event.isDefaultPrevented())
						return true;

					fExt.ctxMenu.Hide();
				}
			});
		}

		fExt.jq(document).on('contextmenu', function(event) {
			if(!fExt.jq(event.target).hasClass("ctxElement")) {
				if(!event.shiftKey) {
					fExt.customContextMenuHandler(event);
				}
			}
			else
				fExt.ctxMenu.Hide();
		});
	}
	else {
		fExt.ctxMenu.uniqueID = 1;
		fExt.ctxMenu.allItems = [];
		fExt.ctxMenu.actor = undefined;
		fExt.ctxMenu.Show = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.Hide = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.addItem = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.addCtxItem = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.addSub = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.addCtxSub = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.addSeparator = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.assignID = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.ctxMenu.getItem = function() {
			console.log("ContextMenu is turned off");
		};
		fExt.customContextMenuHandler = function () {
			console.log("ContextMenu is turned off");
		};
	}


	// Finalize
	document.fExt = fExt;

	fExt.fExtPopup.click(function(e){
		fExt.popupQueue = [];
		fExt.hide(fExt.jq(this));
	});

	fExt.fExtMessage.click(function(e){
		fExt.hide(fExt.jq(this));
	});

	console.log("frisch's UserScript Extender initialized!");
}