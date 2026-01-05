// ==UserScript==
// @name			Hooks
// @namespace		xuyiming.open@outlook.com
// @description		A JavaScript hook/reply ultility
// @author			xymopen
// @version			1.1.5
// @grant			none
// @license			BSD 2-Clause
// ==/UserScript==

// @updateURL		https://raw.githubusercontent.com/xymopen/JS_Misc/master/Hooks.js

// I was finishing unit test and found there are some bugs about the logic

/**
 * Hooks functions or properties, getters/setters
 * and methods of an object you are intrested in
 */

var Hooks = ( function () {
	"use strict";

	var Functions = {
		/**
		 * wrapper a function
		 * @param {Function} target
		 * @param {(Function, Object?, Arguments) => void} onApply
		 */
		apply: function apply( target, onApply ) {
			if ( "function" === typeof target && "function" === typeof onApply ) {
				var fn = function () {
					return onApply.call( this, target, this, arguments );
				};

				fn.prototype = target.prototype;

				return fn;
			} else {
				throw new TypeError();
			}
		}
	};

	/**
	 * Hooks functions or properties, getters/setters
	 * and methods of an object you are intrested in
	 */
	var Hooks = {
		/**
		 * hook a property of an object
		 * @param {Object} target				- an object having or to have the property to be hooked
		 * @param {String} propertyName			- the name of the property to be hooked
		 * @param {Function} onGet					- the hook call when about to get the property
		 * @param {Function} onSet					- the hook call when about to set the property
		 */
		property: function property( target, propertyName, onGet, onSet ) {
			var descriptor, oldValue;

			if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
				descriptor = Object.getOwnPropertyDescriptor( target, propertyName );

				if ( Object.prototype.hasOwnProperty.call( descriptor, "value" ) ) {
					oldValue = descriptor.value;

					delete descriptor.value;
					delete descriptor.writable;
				} else if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) ) {
					oldValue = descriptor.get.call( target );
				} else {
					oldValue = undefined;
				}
			} else {
				descriptor = {
					configurable: true,
					enumerable: true,
				};

				oldValue = undefined;
			}

			descriptor.get = function get() {
				return onGet.call( this, target, propertyName, oldValue );
			};

			descriptor.set = function set( newValue ) {
				oldValue = onSet.call( this, target, propertyName, oldValue, newValue );
			};

			Object.defineProperty( target, propertyName, descriptor );
		},
		/**
		 * the hook call when about to get the property
		 * @callback onGet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- the name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 */

		/**
		 * the hook call when about to set the property
		 * @callback onSet
		 * @param {object} target				- the object having the property hooked
		 * @param {string} propertyName			- the name of the property hooked
		 * @param {any} oldValue				- the current value of the property
		 * @param {any} newValue				- the value about to be set to the property
		 */

		/**
		 * alias of #property but fill the #onSet automatically
		 * @function get
		 * @param {Object} target				- an object having or to have the property to be hooked
		 * @param {String} propertyName			- he name of the property to be hooked
		 * @param {onGet} onGet					- the hook call when about to get the property
		 */
		get: function get( target, propertyName, onGet ) {
			return Hooks.property( target, propertyName, onGet, function ( target, propertyName, oldValue, newValue ) {
				return Hooks.Reply.set( arguments );
			} );
		},

		/**
		 * alias of #property but fill the #onGet automatically
		 * @function set
		 * @param {Object} target				- an object having or to have the property to be hooked
		 * @param {String} propertyName			- the name of the property to be hooked
		 * @param {onSet} onSet					- the hook call when about to set the property
		 */
		set: function set( target, propertyName, onSet ) {
			return Hooks.property( target, propertyName, function ( target, propertyName, oldValue ) {
				return Hooks.Reply.get( arguments );
			}, onSet );
		},

		/**
		 * hook a getter property of an object
		 * @function getter
		 * @param {object} target				- an object having the getter property to be hooked
		 * @param {string} propertyName			- the name of the getter property to be hooked
		 * @param {onGetter} onGetter				- the hook replace the getter
		 */
		getter: function getter( target, propertyName, onGetter ) {
			var descriptor;

			if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
				descriptor = Object.getOwnPropertyDescriptor( target, propertyName );

				if ( Object.prototype.hasOwnProperty.call( descriptor, "get" ) ) {
					descriptor.get = Functions.apply( descriptor.get, function ( getter, thisArg, args ) {
						return onGetter.call( this, target, propertyName, getter, thisArg, args );
					} );

					Object.defineProperty( target, propertyName, descriptor );
				}
			}
		},
		/**
		 * the hook replace the getter
		 * @callback onSetter
		 * @param {object} target				- the object having the getter property hooked
		 * @param {string} propertyName			- he name of the getter property hooked
		 * @param {function} getter				- the getter replaced
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} args				- the arguments pass to the getter, should be #undefined
		 */

		/**
		 * hook a setter property of an object
		 * @function setter
		 * @param {object} target				- an object having the setter property to be hooked
		 * @param {string} propertyName			- the name of the setter property to be hooked
		 * @param {onSetter} onSetter				- the hook replace the setter
		 */
		setter: function setter( target, propertyName, onSetter ) {
			var descriptor;

			if ( Object.prototype.hasOwnProperty.call( target, propertyName ) ) {
				descriptor = Object.getOwnPropertyDescriptor( target, propertyName );

				if ( Object.prototype.hasOwnProperty.call( descriptor, "set" ) ) {
					descriptor.set = Functions.apply( descriptor.set, function ( setter, thisArg, args ) {
						onSetter.call( this, target, propertyName, setter, thisArg, args );
					} );

					Object.defineProperty( target, propertyName, descriptor );
				}
			}
		},
		/**
		 * the hook replace the setter
		 * @callback onSetter
		 * @param {object} target				- the object having the setter property hooked
		 * @param {string} propertyName			- he name of the setter property hooked
		 * @param {function} setter				- the setter replaced
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} args				- the arguments pass to the setter, should be a right value
		 */

		/**
		 * hook a method of an object
		 * @function method
		 * @param {object} target				- an object having or to have the method to be hooked
		 * @param {string} methodName			- the name of the method to be hooked
		 * @param {onApply} onApply				- the hook replace the method
		 */
		method: function method( target, methodName, onApply ) {
			var method = target[ methodName ];

			function hook( method ) {
				return Functions.apply( method, function ( method, thisArg, args ) {
					return onApply.call( this, target, methodName, method, thisArg, args );
				} );
			};

			if ( "function" === typeof method ) {
				target[ methodName ] = hook( method );
			} else if ( !Object.prototype.hasOwnProperty.call( target, methodName ) ) {
				Object.defineProperty( target, methodName, {
					configurable: true,
					enumerable: true,
					set: function ( value ) {
						Object.defineProperty( target, methodName, {
							configurable: true,
							enumerable: true,
							value: typeof value === "function" ? hook( value ) : value,
							writable: true
						} );
					},
					get: function () {
						return undefined;
					}
				} );
			}
		},
		/**
		 * the hook replace the method
		 * @callback onApply
		 * @param {object} target				- the object having the method hooked
		 * @param {string} methodName			- the name of the method hooked
		 * @param {object|undefined} thisArg	- #this reference
		 * @param {arguments} args				- the arguments pass to the method
		 */
	};

	Hooks.Reply = {
		get: function ( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				oldValue = param[ 2 ];

			return oldValue;
		},

		set: function ( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				oldValue = param[ 2 ],
				newValue = param[ 3 ];

			return newValue;
		},

		getter: function ( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				getter = param[ 2 ],
				thisArg = param[ 3 ],
				args = param[ 4 ];

			return getter.apply( thisArg, args );
		},

		setter: function ( param ) {
			var target = param[ 0 ],
				propertyName = param[ 1 ],
				setter = param[ 2 ],
				thisArg = param[ 3 ],
				args = param[ 4 ];

			setter.apply( thisArg, args );
		},

		method: function method( param ) {
			var target = param[ 0 ],
				methodName = param[ 1 ],
				method = param[ 2 ],
				thisArg = param[ 3 ],
				args = param[ 4 ];

			return method.apply( thisArg, args );
		},
	};

	return Hooks;
} )();