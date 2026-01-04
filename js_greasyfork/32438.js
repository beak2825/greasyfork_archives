// ==UserScript==
// @name        Storage wrapper
// @description GMStorage, localStorage, and sessionStorage wrapper
// @namespace   https://greasyfork.org/users/136230
// @include     *
// @version     1.0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32438/Storage%20wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/32438/Storage%20wrapper.meta.js
// ==/UserScript==

/* CHANGELOG

	1.0.0 (2017/08/19)
		- release
*/
(function(){
	var core = {
		'define': function(key, descriptor ){
			if( descriptor )
				Object.defineProperty( this, key, descriptor );
			else
				Object.defineProperties( this, key );
		},
		'extend': function( obj ){
			for( var key in obj )
				if( !this.hasOwnProperty(key) )
					this[key] = obj[key];
		},
		'extendNotEnum': function( obj ){
			for( var key in obj )
				if( !this.hasOwnProperty(key) )
					Object.defineProperty( this, key, {value: obj[key], configurable: true});
		},
		'indexOf': function( val, pos ){
			if( this.indexOf )
				return this.indexOf( val, (pos || 0) );
			var i, count = 0, p = pos || 0;
			for( i = p; i < this.length; ++i ){
				if( this.hasOwnProperty(i) && this[i] !== undefined ){
					if( this[i] === val )
						return (count + p);
					++count;
				}
			}
			return -1;
		},
		'last': function(){
			return this[this.length - 1];
		},
		'bytes': function(){
			return (unescape( encodeURIComponent( JSON.stringify(this)))).length;
		},
		'proto': function(){ return Object.getPrototypeOf(this);},
	};
	var GMStoragePrototype = {
		'clear': function(){
			var keys = GM_listValues();
			for( var i = 0; i < keys.length; ++i )
				GM_deleteValue( keys[i] );
		},
		'setItem': function( key, val ){
			GM_setValue( key, val );
		},
		'getItem': function( key ){
			return GM_getValue( key, '' );
		},
		'removeItem': function( key ){
			GM_deleteValue( key );
		},
		'key': function( num ){
			return GM_listValues()[num];
		},
		'byte': function( key ){
			return core.bytes.call( this.getItem(key) );
		},
	};
	var GMStorageDescriptor = {
		'length': {
			get: function(){return GM_listValues().length;},
			enumerable: true,
			configurable: true,
		},
		'keys': {
			get: function(){return GM_listValues();},
			enumerable: true,
			configurable: true,
		},
		'bytes': {
			get: function(){
				/*
				var keys = GM_listValues(), bytes = 0;
				for( var i = 0; i < keys.length; ++i )
					bytes += core.bytes.call( GM_getValue(keys[i]) );
				return bytes;
				*/
				var keys = GM_listValues(), count = 0;
				for( var i = 0; i < keys.length; ++i )
					count += core.bytes.call( GM_getValue(keys[i]) );
				return count;
			},
			enumerable: true,
			configurable: true,
		},
	};
	var GMStorage = function GMStorage(){
		if( GM_setValue && GM_getValue && GM_listValues && GM_deleteValue )
			return new GMStorage.fn.init();
		else{
			console.error("GM Values API not defined");
			return {};
		}
	};
	core.define.call( GMStorage, 'fn', {value: GMStorage.prototype, configurable: true});
	core.extendNotEnum.call( GMStorage.fn, {
		'init': function(){},
		'version': "1.0.0",
		'isGMStorage': true,
	});
	core.extend.call( GMStorage.fn, GMStoragePrototype );
	core.define.call( GMStorage.fn, GMStorageDescriptor );
	GMStorage.fn.init.prototype = GMStorage.fn;
	core.extend.call( GMStorage, GMStoragePrototype );
	core.define.call( GMStorage, GMStorageDescriptor );
	
	if( typeof window.GMStorage !== 'function' ){
		window.GMStorage = GMStorage;
	}else if( window.GMStorage.fn && window.GMStorage.fn.version ){
		if( window.GMStorage.fn.version.split('.')[0] === GMStorage.fn.version.split('.')[0] )
			window.GMStorage = GMStorage;
	}
	
	var IMStorage = function IMStorage( storage, name ){
		return new IMStorage.fn.init( storage, name );
	};
	core.define.call( IMStorage, {'fn': {value: IMStorage.prototype, configurable: true,},});
	core.define.call( IMStorage.fn, {
		'version': {value: "1.0.0",},
		'isIMStorage': {value: true,},
		'init': {
			value: function(){},
			writable: true,
			configurable: true,
		},
	});
	IMStorage.fn.init = IMStorage.init = function( storage, name ){
		if( typeof storage === 'string' )
			this.storage = getStorage(storage);
		else if( typeof storage === 'function' )
			this.storage = new storage();
		else if( typeof storage === 'object' )
			this.storage = storage;
		else
			throw new Error("invalid storage type: " + typeof storage);
		this.storename = name || 'my-storage';
		if( this.storage.keys && typeof this.storage.keys.length !== 'undefined' ){
			defineGM.call(this);
		}else{
			defineKeys.call(this);
			defineHiddenKeys.call( this );
			defineBytes.call(this);
			var that = this;
			this['byte'] = function( key ){ return core.bytes.call( that.storage.getItem(key) ); };
			defineLength.call(this);
			defineClear.call(this);
		}
	};
	function defineGM()
	{
		var that = this;
		core.define.call( this, {
			'keys': {
				get: function(){ return that.storage.keys; },
				enumerable: true,
				configurable: true,
			},
			'setKey': {value: function(key){},},
			'removeKey': { value: function(key){}, },
			'bytes': {
				get: function(){ return that.storage.bytes; },
				enumerable: true,
				configurable: true,
			},
			'byte': {value: function(key){ return that.storage.byte(key); },},
			'length': {
				get: function(){ return that.storage.length; },
				enumerable: true,
				configurable: true,
			},
			'clear': {
				value: function(){ that.storage.clear(); },
				enumerable: true,
				configurable: true,
			},
		});
	}
	function getStorage( storage )
	{
		if( storage === 'localStorage' )
			return window.localStorage;
		else if( storage === 'sessionStorage' )
			return window.sessionStorage;
		else if( storage.search(/greas/i) != -1 )
			return GMStorage();
	}
	function defineKeys()
	{
		var that = this;
		core.define.call( that, 'keys', {
			get: function(){ return JSON.parse(that.storage.getItem(that.storename) || '[]'); },
			enumerable: true,
			configurable: true,
		});
	}
	function setItemKeys( arr )
	{
		if( arr && typeof arr.length !== 'undefined' )
			this.storage.setItem( this.storename, JSON.stringify(arr) );
	}
	function defineHiddenKeys()
	{
		var that = this;
		core.define.call(this, {
			'setKey': {
				value: function(key){
					var keys = that.keys;
					if( core.indexOf.call( keys, key ) == -1 )
						keys.push( key );
					setItemKeys.call( that, keys );
				},
				configurable: true,
			},
			'removeKey': {
				value: function(key){
					var keys = that.keys, pos = core.indexOf.call( keys, key );
					if( pos != -1 )
						keys.splice(pos, 1);
					setItemKeys.call( that, keys );
				},
				configurable: true,
			},
		});
	}
	function defineBytes()
	{
		var that = this;
		core.define.call( that, 'bytes', {
			get: function(){
				var keys = that.keys, bytes = 0;
				for( var i = 0; i < keys.length; ++i )
					bytes += core.bytes.call( that.storage.getItem( keys[i] ));
				return bytes;
			},
			enumerable: true,
			configurable: true,
		});
	}
	function defineLength()
	{
		var that = this;
		core.define.call( that, 'length', {
			get: function(){ return that.keys.length;},
			enumerable: true,
			configurable: true,
		});
	}
	function defineClear()
	{
		var that = this;
		core.extend.call( this, {
			'clear': function(){
				var keys = that.keys;
				while( keys.length > 0 )
				{
					that.removeItem( core.last.call( keys ) );
					keys.length -= 1;
				}
			},
		});
	}
	IMStorage.fn.setItem = IMStorage.setItem = function( key, val ){
		this.storage.setItem(key, val);
		this.setKey(key);
	};
	IMStorage.fn.getItem = IMStorage.getItem = function( key ){
		return this.storage.getItem(key);
	};
	IMStorage.fn.removeItem = IMStorage.removeItem = function( key ){
		this.storage.removeItem( key );
		this.removeKey( key );
	};
	IMStorage.fn.clear = IMStorage.clear = function(){
		var keys = this.keys;
		while( keys.length > 0 )
		{
			this.removeItem( core.last.call( keys ) );
			keys.length -= 1;
		}
	};
	IMStorage.fn.clean = IMStorage.clean = IMStorage.fn.clear;
	IMStorage.fn.init.prototype = IMStorage.fn;
	if( typeof window.IMStorage !== 'function' ){
		window.IMStorage = IMStorage;
	}else if( window.IMStorage.fn && window.IMStorage.fn.version ){
		if( window.IMStorage.fn.version.split('.')[0] === IMStorage.fn.version.split('.')[0] )
			window.IMStorage = IMStorage;
	}
})();