// ==UserScript==
// @name			Fuck Chaoxing
// @namespace		xuyiming.open@outlook.com
// @description		解除超星自动暂停播放的限制并添加自动播放下一集的功能
// @author			依然独特
// @version			1.2.4
// @grant			none
// @run-at			document-start
// @require			https://greasyfork.org/scripts/18715-hooks/code/Hooks.js?version=661566
// @require			https://greasyfork.org/scripts/29782-docsready/code/docsReady.js?version=603417
// @include			*://*.chaoxing.com/mycourse/studentstudy*
// @include			*://*.chaoxing.com/ananas/modules/video/index.html*
// @match			*://*.chaoxing.com/mycourse/studentstudy*
// @match			*://*.chaoxing.com/ananas/modules/video/index.html*
// @include			*://*.chaoxing.com/ananas/modules/work/index.html
// @include			*://*.chaoxing.com/ananas/modules/work/index.html*
// @match			*://*.chaoxing.com/ananas/modules/work/index.html
// @match			*://*.chaoxing.com/ananas/modules/work/index.html*
// @license			BSD 2-Clause
// @homepageURL		https://gist.github.com/xymopen/eb65046644ff5cb7c0668e5d4f9607d1
// @downloadURL https://update.greasyfork.org/scripts/20059/Fuck%20Chaoxing.user.js
// @updateURL https://update.greasyfork.org/scripts/20059/Fuck%20Chaoxing.meta.js
// ==/UserScript==

// TODO: CX update with an HTML5 Player. Need some time digging with it
// NOTE: I no longer have any lesson on CX. development may delayed.

( function () {
	"use strict";

	// So, let's first clarify the structure of Chaoxing Student Study Page

	// A course is made up of mulitple chapters
	// A chapter is made up of mulitple cards, saying a multi-media card and a unit test card
	// A card is made up of multiple jobs, saying two video jobs and a ppt job

	// When a video job is finished, finishJob() would be called on MoocPlayer,
	// which calls proxy_completed(),
	// whick calls ed_complete(),
	// which calls JC.completed on card iframe,
	// which emits an completed event,
	// which trigger unlock(),
	// which calls onReadComplete() on the top window

	// When a ppt job is loaded, uParse() would be called
	// which calls unlock()

	// onReadComplete() then calls onReadComplete1() to pull updated chapter list from the server
	// and calls jobflag() to figure out how many jobs remaining to finish

	// jobflag() looks in card iframe for .ans-job-icon as total jobs and .ans-job-finished as unfinished ones.
	// ppt jobs doesn't count for they don't have .ans-job-icon or .ans-job-finished

	// Generally speaking we only need to handle video jobs
	// However Chrome blocks Flash. :facepalm:

	/**
	 * @param {(config: any, createCXPlayer: Function) => any} onPlayerInit
	 * @param {Window} [contextWindow]
	 */
	function hookCXPlayer ( onPlayerInit, contextWindow ) {
		if ( undefined === contextWindow ) {
			contextWindow = window;
		}

		// CXPlayer and pauseMovie() loaded as jQuery plug-ins
		// so hook jQuery to access it.
		Hooks.set( contextWindow, "jQuery", function ( target, propertyName, ignored, jQuery ) {
			Hooks.method( jQuery.fn, "cxplayer", function ( target, methodName, method, thisArg, args ) {
				var replyArgs = arguments, $globalPlayer, $player,
					globalConfig = args[ 0 ];

				function createCXPlayer ( config ) {
					if ( undefined !== config ) {
						globalConfig = config;
						args[ 0 ] = config;
					}

					$globalPlayer = Hooks.Reply.method( replyArgs );

					return $globalPlayer;
				}

				$player = onPlayerInit( globalConfig, createCXPlayer );

				if ( undefined !== $player ) {
					$globalPlayer = $player;
				}

				return $globalPlayer;
			} );

			return Hooks.Reply.set( arguments );
		} );
	};

	var globalVideoJs;

	/**
	 * @param {Window} [contextWindow]
	 * @see {@link [videojs-ext.min.js](https://mooc1-2.chaoxing.com/ananas/videojs-ext/videojs-ext.min.js)}
	 */
	function videoJsStudyUncontrolAndTimelineNull ( contextWindow ) {
		if ( undefined === contextWindow ) {
			contextWindow = window;
		}

		Hooks.set( contextWindow, "videojs", function ( target, propertyName, ignored, videojs ) {
			globalVideoJs = videojs;

			Hooks.method( videojs, "registerPlugin", function ( target, methodName, method, thisArg, args ) {
				if ( "studyControl" === args[ 0 ] ) {
					method.call( thisArg, "studyControl", function () { } );
					return args[ 1 ]
				} else if ( "timelineObjects" === args[ 0 ] ) {
					method.call( thisArg, "timelineObjects", function () { } );
					return args[ 1 ]
				} else {
					return Hooks.Reply.method( arguments );
				}
			} );

			return Hooks.Reply.set( arguments );
		} );
	}

	/**
	 * @param {(config: any, createPlayer: Function) => any} onPlayerInit
	 * @param {Window} [contextWindow]
	 */
	function hookVideojs ( onPlayerInit, contextWindow ) {
		if ( undefined === contextWindow ) {
			contextWindow = window;
		}

		Hooks.set( contextWindow, "ans", function ( target, propertyName, ignored, ans ) {
			Hooks.method( ans, "VideoJs", function ( target, methodName, method, thisArg, args ) {
				var replyArgs = arguments, $globalPlayer, $player,
					globalConfig = args[ 0 ].params;

				function createPlayer ( config ) {
					var player;

					if ( undefined !== config ) {
						globalConfig = config;
						args[ 0 ].params = config;
					}

					// CX didn't return player instance to us
					// nail it
					Hooks.Reply.method( replyArgs );

					return globalVideoJs( args[ 0 ].videojs );
				}

				$player = onPlayerInit( globalConfig, createPlayer );

				if ( undefined !== $player ) {
					$globalPlayer = $player;
				}

				return $globalPlayer;
			} );

			return Hooks.Reply.set( arguments );
		} );
	};

	/**
	 * @param {NodeList} list
	 * @returns {number}
	 */
	function findCurIdx ( list ) {
		return Array.prototype.findIndex.call( list, function ( chapter ) {
			return chapter.classList.contains( "currents" );
		} );
	};

	function canNextCard () {
		var contextDocument = window.top.document.querySelector( "iframe" ).contentDocument;

		return Array.prototype.filter.call( contextDocument.querySelectorAll( ".ans-job-icon" ), function ( jobContainer ) {
			return !jobContainer.parentNode.classList.contains( "ans-job-finished" );
		} ).length === 0;
	}

	function nextCard () {
		var cards, nextSectionIndex;

		cards = document.querySelectorAll( "#mainid .tabtags span" );
		nextSectionIndex = findCurIdx( cards ) + 1;

		if ( nextSectionIndex < cards.length ) {
			cards[ nextSectionIndex ].click();

			return true;
		} else {
			return false;
		}
	}

	function nextChapter () {
		var document = window.top.document,
			chapters = document.querySelectorAll(
				"#coursetree .ncells h1," +
				"#coursetree .ncells h2," +
				"#coursetree .ncells h3," +
				"#coursetree .ncells h4," +
				"#coursetree .ncells h5," +
				"#coursetree .ncells h6"
			),
			curChapterIdx = findCurIdx( chapters ),
			nextChapter = Array.prototype.slice.call( chapters, curChapterIdx + 1 ).find( function ( chapter ) {
				// finished chapters are classified as blue
				// and locked chapters are classified as lock
				return !chapter.querySelector( ".blue" ) && !chapter.querySelector( ".lock" );
			} );


		// Go to the first unfinished and unlocked chapter
		if ( nextChapter ) {
			nextChapter.click();

			return true;
		} else {
			// or wait for next call when one locked chapter may be unlocked
			return false;
		}
	}

	if ( "/ananas/modules/video/index.html" === window.location.pathname ) {
		// Video Job iframe
		hookCXPlayer( function ( config, createCXPlayer ) {
			var $player;

			// https://mooc1-1.chaoxing.com/ananas/modules/video/cxplayer/moocplayer_4.0.11.js
			config.datas.enableFastForward = true;
			config.datas.enableSwitchWindow = 1;
			config.datas.errorBackTime = false;
			config.datas.isAutoPlayNext = true;
			config.datas.isDefaultPlay = true;
			config.datas.pauseAdvertList = [];
			config.datas.preAdvertList = [];

			// if ( config.events &&
			// 	config.events.onAnswerRight &&
			// 	!config.events.onAnswerRight.toString()
			// 		.replace( /(function .*?\(.*?\))/g, "" ).trim()		// remove function signifigure
			// 		.replace( /^\{|\}$/g, "" )
			// 		.replace( /\/\/.*(\r|\n|(\r\n))/g, "" )				// remove single line comment
			// 		.replace( /\/\*.*\*\//mg, "" )						// remove multiple line comment
			// 		.match( /^\s*$/ )
			// ) {
			// 	window.alert( "onAnswerRight() is not empty. It's unsafe to block the resource URL." );
			// }

			$player = createCXPlayer();

			// Remove native `onPause` listener
			// prevent pause the movie from JS side
			$player.unbind( "onPause" );

			// Unpausable playback
			// TODO: find better way handling multiple players playing at the same time
			$player.pauseMovie = function () { };
			$player.bind( "onPause", function () {
				$player.playMovie();
			} );

			$player.bind( "onError", function () {
				if ( 4 === $player.getPlayState() ) {
					window.location.reload();
				}
			} );

			window.MoocPlayer.prototype.switchWindow = function () { return this; };
			window.jQuery.fn.pauseMovie = function () { };

			// Object.keys( config.events ).forEach( e => $player.bind( e, () => {
			// 	const id = $player.find( 'object[type="application/x-shockwave-flash"]' ).attr( 'id' );
			// 	const state = [ "error", "playing", "paused", "hanging", "stop" ][ $player.getPlayState() ];

			// 	console.log( `[Fuck Chaoxing]${ e } is triggered. Player#${ id } is ${ state }.` );
			// } ) );
		} );
		videoJsStudyUncontrolAndTimelineNull();
		hookVideojs( function ( config, createPlayer ) {
			var $player;

			config.enableFastForward = 1;
			config.enableSwitchWindow = 1;

			$player = createPlayer();

			$player.on( "ready", function () {
				// immediate play video may cause DOMException
				setTimeout( function () {
					$player.play();
				}, 5000 );
			} );
		} );
	} else if ( "/mycourse/studentstudy" === window.location.pathname ) {
		// Card iframe
		domReady().then( function () {

			var hasNextCard = true,
				jobflagApplied = false,
				ajaxesPending = 0;

			function onReadComplete () {
				if ( jobflagApplied && ajaxesPending && !hasNextCard ) {
					nextChapter();
					jobflagApplied = false;
				}
			};

			window.jQuery( document ).ajaxComplete( function () {
				ajaxesPending -= 1;

				if ( ajaxesPending === 0 ) {
					onReadComplete();
				}
			} );

			Hooks.method( window.jQuery, "ajax", function ( target, methodName, method, thisArg, args ) {
				ajaxesPending += 1;

				return Hooks.Reply.method( arguments );
			} );

			Hooks.method( window, "onReadComplete1", function ( target, methodName, method, thisArg, args ) {
				var returns = Hooks.Reply.method( arguments );

				onReadComplete();

				return returns;
			} );

			Hooks.method( window, "jobflag", function ( target, methodName, method, thisArg, args ) {
				if ( canNextCard() ) {
					hasNextCard = nextCard();
				}

				jobflagApplied = true;
				onReadComplete();

				return Hooks.Reply.method( arguments );
			} );
		} );
	}
} )();
