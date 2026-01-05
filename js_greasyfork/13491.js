// ==UserScript==
// @name			Fuck Erya
// @name:zh-CN		Fuck Erya
// @namespace		xuyiming.open@outlook.com
// @description		解除尔雅通识课在自动暂停播放的限制并添加自动播放下一集的功能
// @description:zh-CN		解除尔雅通识课在自动暂停播放的限制并添加自动播放下一集的功能
// @author			依然独特
// @version			1.0.7
// @grant			none
// @run-at			document-start
// @require			https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=126794
// @include			*://tsk.erya100.com/courseAction!toCourseVideo*
// @include			*://*tsk.erya100.com/courseAction!toCourseVideo*
// @include			*://tsk*.erya100.com/courseAction!toCourseVideo*
// @include			*://*tsk*.erya100.com/courseAction!toCourseVideo*
// @match			*://tsk.erya100.com/courseAction!toCourseVideo*
// @match			*://*tsk.erya100.com/courseAction!toCourseVideo*
// @match			*://tsk*.erya100.com/courseAction!toCourseVideo*
// @include			*://*tsk*.erya100.com/courseAction!toCourseVideo*
// @license			BSD 2-Clause
// @homepageURL		https://gist.github.com/xymopen/79e80a9322d7a1f35f16
// @downloadURL https://update.greasyfork.org/scripts/13491/Fuck%20Erya.user.js
// @updateURL https://update.greasyfork.org/scripts/13491/Fuck%20Erya.meta.js
// ==/UserScript==

( function() {
	"use strict";

	function hookJQuery( onPlayerInit, contextWindow ) {
		contextWindow = contextWindow || window;

		// CXPlayer extends jQuery for its own APIs
		// so hook jQuery to modify these APIs.
		Hooks.set( contextWindow, "jQuery", function( target, propertyName, ignored, jQuery ) {
			Hooks.set( jQuery.fn, "cxplayer", function( target, propertyName, oldValue, newValue ) {
				return Hooks.apply( newValue, function( target, thisArg, argv ) {
					var config = argv[ 0 ], $player;

					config.datas.isAutoPlayNext = true;
					config.datas.isDefaultPlay = true;

					$player = Hooks.Reply.apply( arguments );

					if ( config.events &&
						config.events.onAnswerRight &&
						!config.events.onAnswerRight.toString()
							.replace( /(function .*?\(.*?\))/g, "" ).trim()		// remove function signifigure
							.replace( /^\{|\}$/g, "" )
							.replace( /\/\/.*(\r|\n|(\r\n))/g,"" )				// remove single line comment
							.replace( /\/\*.*\*\//mg,"" )						// remove multiple line comment
							.match( /^\s*$/ )
					) {
						contextWindow.alert( "onAnswerRight() is not empty. It's unsafe to block the resource URL." );
					}

					$player.bind( "onPause", function() {
						$player.playMovie();
					} );

					onPlayerInit( $player, config );

					return $player;
				} );
			} );

			Hooks.set( jQuery.fn, "pauseMovie", function( target, methodName, oldValue, newValue ) {
				return Hooks.apply( newValue, function ( target, thisArg, argv ) {
					/* empty */
				} );
			} );

			return Hooks.Reply.set( arguments );
		} );
	};

	hookJQuery( function( $player, config ) {
		// Automatically play the next episode
		$player.bind( "onEnd", function( event, index, config ) {
			// Wait for the player to synchronize your playback progress
			$player.bind( "onSendProgressSuccess", function go() {
			$player.unbind( "onSendProgressSuccess", go );
				$player.goPlay( index + 1 );
			} );
		} );
	} );
} )();
