// ==UserScript==
// @name           IronMan's Library
// @description    Library base used by Iron Man
// @namespace      https://greasyfork.org/users/136230
// @description:ru Базис библиотеки от Iron Man
// @include        *
// @author         Iron_man
// @date           2018.02.04
// @version        1.0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/32157/IronMan%27s%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/32157/IronMan%27s%20Library.meta.js
// ==/UserScript==
(function(){
	var IML = function IML(){
		return new IML.fn.init();
	};
	IML.fn = IML.prototype = {
		constructor: IML,
		isIML: true,
		version: "1.0.0",
	};
	IML.fn.init = function(){};
	IML.fn.init.prototype = IML.fn;
	IML.fn.extend = IML.extend = function( obj ){
		var key, val;
		for( key in obj )
		{
			val = obj[key];
			if( !this.hasOwnProperty( key ) && typeof val !== 'undefined' )
				this[key] = val;
		}
	};
	if( typeof window.IML !== 'function' )
		window.IML = IML;
	else if( window.IML.fn && window.IML.fn.version )
		if( window.IML.fn.version.split('.')[0] ===  IML.fn.version.split('.')[0] )
			window.IML = IML;
})();