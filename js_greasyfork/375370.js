// ==UserScript==
// @name         JokerBetter
// @namespace    http://tampermonkey.net/
// @version      3.32
// @author       You
// @match        *://gamdom.com/hilo
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @description  Wow nice better such joker
// @downloadURL https://update.greasyfork.org/scripts/375370/JokerBetter.user.js
// @updateURL https://update.greasyfork.org/scripts/375370/JokerBetter.meta.js
// ==/UserScript==

setTimeout(function(){
	Object.defineProperty(document, "hidden", { value : false});
	let bettedred = undefined;
	let quick = $(".quick-ops");
	let lastcard = $(".history-cards").children(0);
	let jokerreq = 0;
	let x2times = 1;
	let betsize = 1;
	let jokerdropped = false;
	let timesupped = 0;
	let timesuppedjoker = 0;
	let timesbetafterjoker = 0;

	var Arrive=function(e,t,n){"use strict";function r(e,t,n){l.addMethod(t,n,e.unbindEvent),l.addMethod(t,n,e.unbindEventWithSelectorOrCallback),l.addMethod(t,n,e.unbindEventWithSelectorAndCallback)}function i(e){e.arrive=f.bindEvent,r(f,e,"unbindArrive"),e.leave=d.bindEvent,r(d,e,"unbindLeave")}if(e.MutationObserver&&"undefined"!=typeof HTMLElement){var o=0,l=function(){var t=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;return{matchesSelector:function(e,n){return e instanceof HTMLElement&&t.call(e,n)},addMethod:function(e,t,r){var i=e[t];e[t]=function(){return r.length==arguments.length?r.apply(this,arguments):"function"==typeof i?i.apply(this,arguments):n}},callCallbacks:function(e,t){t&&t.options.onceOnly&&1==t.firedElems.length&&(e=[e[0]]);for(var n,r=0;n=e[r];r++)n&&n.callback&&n.callback.call(n.elem,n.elem);t&&t.options.onceOnly&&1==t.firedElems.length&&t.me.unbindEventWithSelectorAndCallback.call(t.target,t.selector,t.callback)},checkChildNodesRecursively:function(e,t,n,r){for(var i,o=0;i=e[o];o++)n(i,t,r)&&r.push({callback:t.callback,elem:i}),i.childNodes.length>0&&l.checkChildNodesRecursively(i.childNodes,t,n,r)},mergeArrays:function(e,t){var n,r={};for(n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);for(n in t)t.hasOwnProperty(n)&&(r[n]=t[n]);return r},toElementsArray:function(t){return n===t||"number"==typeof t.length&&t!==e||(t=[t]),t}}}(),c=function(){var e=function(){this._eventsBucket=[],this._beforeAdding=null,this._beforeRemoving=null};return e.prototype.addEvent=function(e,t,n,r){var i={target:e,selector:t,options:n,callback:r,firedElems:[]};return this._beforeAdding&&this._beforeAdding(i),this._eventsBucket.push(i),i},e.prototype.removeEvent=function(e){for(var t,n=this._eventsBucket.length-1;t=this._eventsBucket[n];n--)if(e(t)){this._beforeRemoving&&this._beforeRemoving(t);var r=this._eventsBucket.splice(n,1);r&&r.length&&(r[0].callback=null)}},e.prototype.beforeAdding=function(e){this._beforeAdding=e},e.prototype.beforeRemoving=function(e){this._beforeRemoving=e},e}(),a=function(t,r){var i=new c,o=this,a={fireOnAttributesModification:!1};return i.beforeAdding(function(n){var i,l=n.target;(l===e.document||l===e)&&(l=document.getElementsByTagName("html")[0]),i=new MutationObserver(function(e){r.call(this,e,n)});var c=t(n.options);i.observe(l,c),n.observer=i,n.me=o}),i.beforeRemoving(function(e){e.observer.disconnect()}),this.bindEvent=function(e,t,n){t=l.mergeArrays(a,t);for(var r=l.toElementsArray(this),o=0;o<r.length;o++)i.addEvent(r[o],e,t,n)},this.unbindEvent=function(){var e=l.toElementsArray(this);i.removeEvent(function(t){for(var r=0;r<e.length;r++)if(this===n||t.target===e[r])return!0;return!1})},this.unbindEventWithSelectorOrCallback=function(e){var t,r=l.toElementsArray(this),o=e;t="function"==typeof e?function(e){for(var t=0;t<r.length;t++)if((this===n||e.target===r[t])&&e.callback===o)return!0;return!1}:function(t){for(var i=0;i<r.length;i++)if((this===n||t.target===r[i])&&t.selector===e)return!0;return!1},i.removeEvent(t)},this.unbindEventWithSelectorAndCallback=function(e,t){var r=l.toElementsArray(this);i.removeEvent(function(i){for(var o=0;o<r.length;o++)if((this===n||i.target===r[o])&&i.selector===e&&i.callback===t)return!0;return!1})},this},s=function(){function e(e){var t={attributes:!1,childList:!0,subtree:!0};return e.fireOnAttributesModification&&(t.attributes=!0),t}function t(e,t){e.forEach(function(e){var n=e.addedNodes,i=e.target,o=[];null!==n&&n.length>0?l.checkChildNodesRecursively(n,t,r,o):"attributes"===e.type&&r(i,t,o)&&o.push({callback:t.callback,elem:i}),l.callCallbacks(o,t)})}function r(e,t){return l.matchesSelector(e,t.selector)&&(e._id===n&&(e._id=o++),-1==t.firedElems.indexOf(e._id))?(t.firedElems.push(e._id),!0):!1}var i={fireOnAttributesModification:!1,onceOnly:!1,existing:!1};f=new a(e,t);var c=f.bindEvent;return f.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t);var o=l.toElementsArray(this);if(t.existing){for(var a=[],s=0;s<o.length;s++)for(var u=o[s].querySelectorAll(e),f=0;f<u.length;f++)a.push({callback:r,elem:u[f]});if(t.onceOnly&&a.length)return r.call(a[0].elem,a[0].elem);setTimeout(l.callCallbacks,1,a)}c.call(this,e,t,r)},f},u=function(){function e(){var e={childList:!0,subtree:!0};return e}function t(e,t){e.forEach(function(e){var n=e.removedNodes,i=[];null!==n&&n.length>0&&l.checkChildNodesRecursively(n,t,r,i),l.callCallbacks(i,t)})}function r(e,t){return l.matchesSelector(e,t.selector)}var i={};d=new a(e,t);var o=d.bindEvent;return d.bindEvent=function(e,t,r){n===r?(r=t,t=i):t=l.mergeArrays(i,t),o.call(this,e,t,r)},d},f=new s,d=new u;t&&i(t.fn),i(HTMLElement.prototype),i(NodeList.prototype),i(HTMLCollection.prototype),i(HTMLDocument.prototype),i(Window.prototype);var h={};return r(f,h,"unbindAllArrive"),r(d,h,"unbindAllLeave"),h}}(window,"undefined"==typeof jQuery?null:jQuery,void 0);

	function randomInteger(min, max) {
	    var rand = min - 0.5 + Math.random() * (max - min + 1);
	    rand = Math.round(rand);
	    return rand;
	}	

	function resetbet(flag){

		if(true)
		{
			for(let i = 0;i<4;i++){
				setTimeout(function(){
					quick.contents()[3].click();
				},10+i*10)
			}
		}
		else
		{
			for(let i = 0;i<timesupped;i++){
				setTimeout(function(){
					quick.contents()[3].click();
				},10+i*10)
			}
		}
		betsize = 1;
		x2times = 0;
		jokerreq=0;
		timesupped=0;
	}

	function resetbetjoker(){

		for(let i = 0;i<timesupped;i++){
			setTimeout(function(){
				quick.contents()[3].click();
			},10+i*10)
		}
		betsize = 16;
		x2times = 0;
		timesbetafterjoker = 0;
		timesuppedjoker=0;
		timesupped=0;
		for(let i=0;i<4;i++){
			setTimeout(function(){
				quick.contents()[4].click();
			},250+i*10)
		}
	}

	document.arrive(".history-cards .history-animation-enter-active",function(){
		
		setTimeout(function(){
			lastcard = $(".history-cards").children().first();
			// lastcard.attr('id', 'divId');
			// var classList = document.getElementById('divId').className.split(/\s+/);
			// for (var i = 0; i < classList.length; i++) {
			//    console.log(classList[i]);
			// }
			//console.log(lastcard.hasClass("red"));
			if(lastcard.hasClass("red")){
				jokerreq++;
				//console.log("red card");
				if(x2times%10==0 && jokerreq>=99)
				{
					quick.contents()[4].click();
					betsize*=2;
					x2times = 0;
					timesupped++;
				}
			}
			else if(lastcard.hasClass("black")){
				//console.log("black card");
				jokerreq++;
				if(x2times%10==0 && jokerreq>=99)
				{
					quick.contents()[4].click();
					betsize*=2;
					x2times = 0;
					timesupped++;
				}
			}
			else{
				jokerreq = 0;
				timesbetafterjoker= 0;
				if(jokerdropped==false)
				{
					resetbetjoker();
					jokerdropped = true;
					timesbetafterjoker = 0;
					console.log("joker dropped 1");
				}
				// else if(jokerdropped==false && timesbetafterjoker>=10)
				// {
				// 	resetbet();
				// 	console.log("joker dropped 2");
				// }
			}

			if(timesbetafterjoker>=10)
			{
				timesbetafterjoker=0;
				jokerdropped=false;
				resetbet(true);
				console.log("resetted after 10");
			}
			console.log("Джокера не было " + jokerreq + " роллов.");
			console.log("timesbetafterjoker " + timesbetafterjoker);
			if(jokerdropped==true && timesbetafterjoker<10)
			{
				console.log("Сумма ставки = " + betsize + ".");
			}
			if(jokerreq>=99)
			{
				console.log("Сумма ставки = " + betsize + ".");
			}
		},1000);

		setTimeout(function(){
			let randbet = randomInteger(1,2);

			if(jokerreq>=99 || jokerdropped==true)
			{
				document.getElementsByClassName("bet-button joker-bet")[0].click();
				if (jokerreq>=99) {
					x2times++;
				}
				if(jokerdropped)
				{
					timesbetafterjoker++;
				}
			}
		},6000)
	});
},5000)
