// ==UserScript==
// @name         jQuery-loadedNode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  检测节点是否完全加载
// @author       YiJie
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	try{
		if(typeof jQuery=="undefined") return;
	}catch{return;}
	jQuery.fn.loadedNode = function (selector, func, times, interval) {
		var _times = times || -1,
		_interval = interval || 100,
		_self = $(_selector),
		_selector = selector,
		_iIntervalID;
		if( _self.length ){
			func && func.call(_self);
		} else {
			_iIntervalID = setInterval(function() {
				if(!_times) {
					clearInterval(_iIntervalID);
				}
				_times <= 0 || _times--;
				_self = $(_selector);
				if( _self.length ) {
					func && func.call(_self);
					clearInterval(_iIntervalID);
				}
			}, _interval);
		}
		return this;
	}
})();