// ==UserScript==
// @name        DOM Storage plugin for IML
// @description DOM Storage methods: set, get, add, remove, clean
// @namespace   https://greasyfork.org/users/136230
// @include     *
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32233/DOM%20Storage%20plugin%20for%20IML.user.js
// @updateURL https://update.greasyfork.org/scripts/32233/DOM%20Storage%20plugin%20for%20IML.meta.js
// ==/UserScript==

(function(){
    var wSessions = window.sessionStorage, wLocals = window.localStorage;
	function toStr( obj ){
		if( typeof obj === 'object' )
			return JSON.stringify( obj );
		switch( typeof obj )
		{
			case 'string':
				return obj;
			case 'number':
			case 'boolean' :
				return '' + obj;
			default:
				return '';
		}
	}
	function add_value( obj, key, val )
	{
		var tmp = obj.getItem(key);
		if( tmp )
			tmp += toStr( val );
		else
			tmp = toStr(val);
		set_value( obj, key, tmp);
	}
	function set_value( obj, key, val )
	{
		val = toStr( val );
		if( !val )
			return;
		obj.setItem(key, val);
	}
	function remove_value()
	{
		var i, size = arguments.length;
		for( i = 0; i < size; ++i )
			this.removeItem( arguments[i] );
	}
	IML.extend({
		localStorage: {
			add: function(key, val){add_value( wLocals, key, val );},
			set: function(key, val){set_value( wLocals, key, val );},
			get: function(key){ return wLocals.getItem(key); },
			remove: function(){ remove_value.apply( wLocals, arguments ); },
			clear: function(){ wLocals.clear(); },
			clean: function(){ wLocals.clear(); },
		},
		sessionStorage: {
			add: function(key, val){add_value( wSessions, key, val );},
			set: function(key, val){set_value( wSessions, key, val );},
			get: function(key){ return wSessions.getItem(key); },
			remove: function(){ remove_value.apply( wSessions, arguments ); },
			clear: function(){ wSessions.clear(); },
			clean: function(){ wSessions.clear(); },
		},
	});
})();