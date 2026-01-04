// ==UserScript==
// @name			Anti-Adblock Caoliu
// @namespace		xuyiming.open@outlook.com
// @description		解除草榴反广告过滤限制
// @author			依然独特
// @version			1.0.0
// @grant			unsafeWindow
// @run-at			document-start
// @require			https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=661566
// @include			*://t66y.com/*
// @include			*://*.t66y.com/*
// @match			*://t66y.com/*
// @match			*://*.t66y.com/*
// @license			BSD 3-Clause
// @downloadURL https://update.greasyfork.org/scripts/396395/Anti-Adblock%20Caoliu.user.js
// @updateURL https://update.greasyfork.org/scripts/396395/Anti-Adblock%20Caoliu.meta.js
// ==/UserScript==

( function () {
	"use strict";

	Hooks.set( unsafeWindow, "jQuery", function ( target, propertyName, ignored, jQuery ) {
		Hooks.method( jQuery.fn, "ready", function ( target, methodName, method, thisArg, args ) {
			unsafeWindow[ args[ 0 ].toString().match( /^\s*(.+)\(\);?$/m )[ 1 ] ] = function () { };

			return Hooks.Reply.method( [ target, methodName, method, thisArg, args ] );
		} );

		return Hooks.Reply.set( arguments );
	} );
} )();
