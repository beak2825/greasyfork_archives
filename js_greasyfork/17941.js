// ==UserScript==
// @name         Civilized Twitch Chat
// @description  Turns the Twitch chat into a civilized chat room by removing spam, all caps messages, repeated phrases, repeated messages, banned messages, repeated letters and more.
// @version      0.2.1
// @author       Sewil
// @match        *://*.twitch.tv/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/14470
// @downloadURL https://update.greasyfork.org/scripts/17941/Civilized%20Twitch%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/17941/Civilized%20Twitch%20Chat.meta.js
// ==/UserScript==


/*
 * arrive.js
 * v2.2.0
 * https://github.com/uzairfarooq/arrive
 * MIT licensed
 *
 * Copyright (c) 2014-2015 Uzair Farooq
 */

(function(n,q,v){function r(a,b,c){if(e.matchesSelector(a,b.selector)&&(a._id===v&&(a._id=w++),-1==b.firedElems.indexOf(a._id))){if(b.options.onceOnly)if(0===b.firedElems.length)b.me.unbindEventWithSelectorAndCallback.call(b.target,b.selector,b.callback);else return;b.firedElems.push(a._id);c.push({callback:b.callback,elem:a})}}function p(a,b,c){for(var d=0,f;f=a[d];d++)r(f,b,c),0<f.childNodes.length&&p(f.childNodes,b,c)}function t(a){for(var b=0,c;c=a[b];b++)c.callback.call(c.elem)}function x(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   b){a.forEach(function(a){var d=a.addedNodes,f=a.target,e=[];null!==d&&0<d.length?p(d,b,e):"attributes"===a.type&&r(f,b,e);t(e)})}function y(a,b){a.forEach(function(a){a=a.removedNodes;var d=[];null!==a&&0<a.length&&p(a,b,d);t(d)})}function z(a){var b={attributes:!1,childList:!0,subtree:!0};a.fireOnAttributesModification&&(b.attributes=!0);return b}function A(a){return{childList:!0,subtree:!0}}function k(a){a.arrive=l.bindEvent;e.addMethod(a,"unbindArrive",l.unbindEvent);e.addMethod(a,"unbindArrive",
	l.unbindEventWithSelectorOrCallback);e.addMethod(a,"unbindArrive",l.unbindEventWithSelectorAndCallback);a.leave=m.bindEvent;e.addMethod(a,"unbindLeave",m.unbindEvent);e.addMethod(a,"unbindLeave",m.unbindEventWithSelectorOrCallback);e.addMethod(a,"unbindLeave",m.unbindEventWithSelectorAndCallback)}if(n.MutationObserver&&"undefined"!==typeof HTMLElement){var w=0,e=function(){var a=HTMLElement.prototype.matches||HTMLElement.prototype.webkitMatchesSelector||HTMLElement.prototype.mozMatchesSelector||HTMLElement.prototype.msMatchesSelector;
		return{matchesSelector:function(b,c){return b instanceof HTMLElement&&a.call(b,c)},addMethod:function(a,c,d){var f=a[c];a[c]=function(){if(d.length==arguments.length)return d.apply(this,arguments);if("function"==typeof f)return f.apply(this,arguments)}}}}(),B=function(){var a=function(){this._eventsBucket=[];this._beforeRemoving=this._beforeAdding=null};a.prototype.addEvent=function(a,c,d,f){a={target:a,selector:c,options:d,callback:f,firedElems:[]};this._beforeAdding&&this._beforeAdding(a);this._eventsBucket.push(a);
		return a};a.prototype.removeEvent=function(a){for(var c=this._eventsBucket.length-1,d;d=this._eventsBucket[c];c--)a(d)&&(this._beforeRemoving&&this._beforeRemoving(d),this._eventsBucket.splice(c,1))};a.prototype.beforeAdding=function(a){this._beforeAdding=a};a.prototype.beforeRemoving=function(a){this._beforeRemoving=a};return a}(),u=function(a,b,c){function d(a){"number"!==typeof a.length&&(a=[a]);return a}var f=new B,e=this;f.beforeAdding(function(b){var d=b.target,h;if(d===n.document||d===n)d=
		document.getElementsByTagName("html")[0];h=new MutationObserver(function(a){c.call(this,a,b)});var g=a(b.options);h.observe(d,g);b.observer=h;b.me=e});f.beforeRemoving(function(a){a.observer.disconnect()});this.bindEvent=function(a,c,h){if("undefined"===typeof h)h=c,c=b;else{var g={},e;for(e in b)g[e]=b[e];for(e in c)g[e]=c[e];c=g}e=d(this);for(g=0;g<e.length;g++)f.addEvent(e[g],a,c,h)};this.unbindEvent=function(){var a=d(this);f.removeEvent(function(b){for(var c=0;c<a.length;c++)if(b.target===a[c])return!0;
		return!1})};this.unbindEventWithSelectorOrCallback=function(a){var b=d(this);f.removeEvent("function"===typeof a?function(c){for(var d=0;d<b.length;d++)if(c.target===b[d]&&c.callback===a)return!0;return!1}:function(c){for(var d=0;d<b.length;d++)if(c.target===b[d]&&c.selector===a)return!0;return!1})};this.unbindEventWithSelectorAndCallback=function(a,b){var c=d(this);f.removeEvent(function(d){for(var e=0;e<c.length;e++)if(d.target===c[e]&&d.selector===a&&d.callback===b)return!0;return!1})};return this},
	l=new u(z,{fireOnAttributesModification:!1,onceOnly:!1},x),m=new u(A,{},y);q&&k(q.fn);k(HTMLElement.prototype);k(NodeList.prototype);k(HTMLCollection.prototype);k(HTMLDocument.prototype);k(Window.prototype)}})(this,"undefined"===typeof jQuery?null:jQuery,void 0);

/* */

var bannedMessages = [ 'LUL' ];
var bannedPhrases =  [ '୧༼ಠ益ಠ༽୨' ];
var messages = {};
var allowedEmoticons = {':D':true, ':)':true};
var capsLimit = 0.5;
var capsOffset = 5;
var r9kcooldown = 120000; // ms
var r9klimit = 5;
var r9koffset = 0;
var repeatedPhrasesOffset = 0;
var repeatedPhrasesLimit = 5;
var repeatedLettersLimit = 5;

$(document).ready(function() {
    $(document).arrive('.chat-line, .rechat-chat-line', function() {
        removeEmoticons($(this).find('span.message'));
		if($(this).find('span.message').html() !== undefined) {
			var html = $(this).find('span.message').html().trim();
			var lowerHtml = html.toLowerCase();
			
			if(!html || bannedPhrase(lowerHtml) || bannedMessage(lowerHtml) || allCaps(html) || repeatedLetters(html) || repeatedPhrases(html) || repeatedMessage(html)) {
				$(this).remove();
			} else {
				$(this).find('span.message').html(html);
			}
		} else {
			$(this).remove();
		}
    });
});

function bannedPhrase(str) {
	for(var i = 0; i < bannedPhrases.length; i++) {
		var phrase = bannedPhrases[i];
		if(str.indexOf(phrase) > -1) {
			return true;
		}
	}
	
	return false;
}

function bannedMessage(str) {
    for(var i = 0; i < bannedMessages.length; i++) {
        var message = bannedMessages[i];
        if(str == message.toLowerCase()) {
            return true;
        }
    }
    
    return false;
}

function repeatedMessage(str) {
	if(str.length >= r9koffset) {
		var lowerStr = str.toLowerCase();
		if(messages[lowerStr] === undefined) {
			messages[lowerStr] = 1;
		}
		
		var timeNow = new Date().getTime();
		var notRepeated = messages[lowerStr] < r9klimit;
		var cooledDown = r9kcooldown < timeNow - messages[lowerStr];
		
		if(notRepeated || cooledDown) {
			if(notRepeated) {
				messages[lowerStr]++;
				if(messages[lowerStr] == r9klimit) {
					messages[lowerStr] = timeNow;
				}
			} else {
				messages[lowerStr] = 1;
			}
		} else {
			return true;
		}
	}
	
	return false;
}

function repeatedPhrases(str) {
	var phrases = str.split(" ");
	var arr = {};
	for(var i = 0; i < phrases.length; i++) {
		var lowerPhrase = phrases[i].toLowerCase();
		if(lowerPhrase.length >= repeatedPhrasesOffset) {
			if(arr[lowerPhrase] === undefined) {
				arr[lowerPhrase] = 1;
			} else if(arr[lowerPhrase] < repeatedPhrasesLimit) {
				arr[lowerPhrase]++;
			} else {
				return true;
			}
		}
	}
	
	return false;
}

function repeatedLetters(str) {
	var pattern = "(.)";
	for(var i = 1; i < repeatedLettersLimit;i++) {
		pattern += "\\1";
	}
	var patt = new RegExp(pattern);
    return patt.test(str);
}

function allCaps(str) {
	var caps = str.replace(/[^A-Z]/g, "").length;
	var percentage = caps / str.length;
	return str.length >= capsOffset && percentage >= capsLimit;
}

function removeEmoticons($message) {
	var $emoticons = $message.find('img');
	$.each($emoticons, function() {
		var alt = decodeURIComponent($(this).attr('alt'));
		var dr = decodeURIComponent($(this).attr('data-regex'));
		if(allowedEmoticons[alt] !== true && allowedEmoticons[dr] !== true) {
			$(this).remove();
		}
	});
}