// ==UserScript==
// @name         alert, confirm to console.log
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  try to take over the world!
// @author       You
// @include      http://*
// @include      https://*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19982/alert%2C%20confirm%20to%20consolelog.user.js
// @updateURL https://update.greasyfork.org/scripts/19982/alert%2C%20confirm%20to%20consolelog.meta.js
// ==/UserScript==

(function() {
	/**/
	createAlertEl = function() {
		try {
			if(top.location.href){
				targetDocument = top.document;
				targetTop = top;
			}
		} catch(e) {
			targetDocument = document;
			targetTop = window;
		}
		try {
			if (targetDocument.getElementById('alertControl')) {
				return;
			}
			alertEl = targetDocument.createElement('ul');
			alertEl.id = 'alertControl';
			alertEl.onclick = function() {
				this.parentNode.removeChild(this);
			};
			alertEl.style.cssText = 'position:fixed;left:0;right:0;top:0;/*width:calc(100% - 20px);*/z-index:2147483647;cursor:pointer;';
			targetDocument.body.appendChild(alertEl);
		} catch (e) {
			console.error('createAlertEl', e);
		}
	};
	createMessageEl = function(text) {
		try {
			if(top.location.href){
				targetDocument = top.document;
				targetTop = top;
			}
		} catch(e) {
			targetDocument = document;
			targetTop = window;
		}
		if (!targetDocument.getElementById('alertControl')) {
			createAlertEl();
		}
		var messageEl = targetDocument.createElement('li');
		messageEl.style.cssText = 'display:block;width:calc(100% - 8px);padding:4px;font-size:11px;background-color:#000;color:yellow;border-bottom:1px solid rgba(255,255,255,0.3);opacity:1;';
		messageEl.innerHTML = text;
		/**
		messageEl.onclick = function(event){
			this.parentNode.removeChild(this);
			event.stopPropagation();
		};
		/**/
		//if(targetDocument.getElementById('alertControl').childNodes.length){
		targetDocument.getElementById('alertControl').insertBefore(messageEl, targetDocument.getElementById('alertControl').childNodes[0]);
		//} else {
		//   targetDocument.getElementById('alertControl').appendChild(messageEl);
		//}
		console.log(text);
		targetTop.setTimeout(function() {
			messageEl.style.cssText = 'display:block;width:calc(100% - 8px);padding:4px;font-size:11px;color:yellow;border-bottom:1px solid rgba(255,255,255,0.3);opacity:0;transition:opacity .5s linear,background .5s linear;';
			targetTop.setTimeout(function() {
				messageEl.parentNode.removeChild(messageEl);
			}, 500);
		}, 15000);
	};
	createAlertEl();
	/**/
	window.confirm = confirm = function(text) {
		createMessageEl(text);
		return true;
	};
	/**/
	window.alert = alert = function(text) {
		createMessageEl(text);
	};
	document.addEventListener('DOMNodeInserted', function() {
		window.alert = alert = function(text) {
			createMessageEl(text);
		};
	});
	/**/
	document.addEventListener('DOMContentLoaded', function() {
		if (!document.getElementById('alertControl')) {
			createAlertEl();
		}
	});
})();