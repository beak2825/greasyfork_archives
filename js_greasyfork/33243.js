// ==UserScript==
// @name        Maximizer For YouTube™
// @description Maximizes the YouTube player to fill the entire browser viewport when in theater mode, plus a few other enhancements.
// @license     MIT
// @author      Rotem Dan <rotemdan@gmail.com>
// @match       https://www.youtube.com/*
// @version     0.2.9
// @run-at      document-start
// @grant       none
// @namespace   https://github.com/rotemdan
// @homepageURL https://github.com/rotemdan/MaximizerForYouTube
// @require     https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/33243/Maximizer%20For%20YouTube%E2%84%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/33243/Maximizer%20For%20YouTube%E2%84%A2.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility definitions
////////////////////////////////////////////////////////////////////////////////////////////////////////

const debugModeEnabled = false

function log(...args) {
	if (debugModeEnabled) {
		console.log('[MaximizerForYoutube]', ...args)
	}
}

// Try to emulate setImmediate() like execution:
function setImmediate(func) {
	const channel = new MessageChannel()
	channel.port1.onmessage = () => func()
	channel.port2.postMessage('')
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core script modification functions
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Install or uninstall full-size player page stylesheet if needed
function installOrUninstallPlayerModIfNeeded() {
	if (inWatchPage() && theaterModeEnabled()) {
		if ($('#MaximizerForYouTube_PlayerMod').length == 0) {
			const styleSheet = `
					<style id='MaximizerForYouTube_PlayerMod' type='text/css'>
						ytd-page-manager { margin-top: 0px !important; }

						#masthead-container { visibility: hidden; opacity: 0; transition: opacity 0.2s ease-in-out; }

						#full-bleed-container { height: 100vh !important; min-height: 0vh !important; max-height: 100vh !important; }

						:focus { outline: 0; }

						#movie_player { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

						/*
						body {
							scrollbar-width: 10px;
							scrollbar-color: #000000;
						}
						*/

						body::-webkit-scrollbar {
							width: 10px;
							background-color: #000000;
						}

						body::-webkit-scrollbar-track {
							border-radius: 10px;
							background: rgba(0,0,0,0.1);
							border: 1px solid #383838;
						}

						body::-webkit-scrollbar-thumb {
							border-radius: 10px;
							background: linear-gradient(left, #fff, #e4e4e4);
							border: 1px solid #5b5b5b;
						}

						body::-webkit-scrollbar-thumb:hover {
							background: #fff;
						}
					</style>`

			$('head').append(styleSheet)

			log('Player mod installed')
		}

		if (pageScrolledToTop()) {
			hideTopBar()
		}
	} else {
		if ($('#MaximizerForYouTube_PlayerMod').length > 0) {
			$('#MaximizerForYouTube_PlayerMod').remove()
			showTopBar()

			log('Player mod uninstalled')
		}
	}
}

// Automatically shows/hides the top bar based on different properties of the view.
function installTopBarAutohide() {
	function onPageScroll() {
		if (!inWatchPage()) {
			return
		}

		if (pageScrolledToTop() && theaterModeEnabled()) {
			hideTopBar()
		} else {
			showTopBar()
		}
	}

	function onKeyDown(e) {
		if (!inWatchPage() || !theaterModeEnabled()) {
			return
		}

		if (e.which === 27) { // Handle escape key
			log('esc')

			if (pageScrolledToTop()) {
				if (topBarIsVisible()) {
					hideTopBar()
					e.stopPropagation()
				} else {
					showTopBar()

					setTimeout(() => $('input#search').focus(), 50)
				}
			}
		}
	}

	function installEscHandlerToSearchInput() {
		let inputElement = $('input#search')

		if (inputElement.length > 0) {
			inputElement.on('keydown', onKeyDown)
			//inputElement[0].addEventListener('keydown', onKeyDown, true)
			log('Esc handler installed on search input')
		} else {
			setTimeout(() => installEscHandlerToSearchInput(), 50)
		}
	}

	installEscHandlerToSearchInput()
	$(document).on('keydown', onKeyDown)
	$(document).on('scroll', onPageScroll)
}

// Continuously auto-focus the player keyboard input when some conditions are met.
function installPlayerInputAutoFocus() {
	function autoFocusIfNeeded() {
		if (inWatchPage() && !topBarIsVisible()) {
			getVideoContainer().focus()
		}

		setTimeout(autoFocusIfNeeded, 20)
	}

	autoFocusIfNeeded()
}

function installPlayerKeyboardShortcutExtensions() {
	// Install keyboard shortcut extensions
	function onKeyDown(e) {
		if (!inWatchPage()) {
			return
		}

		if (getVideoContainer().is(':focus')) {
			if (e.ctrlKey) {
				if (e.which === 37) { // Handle ctl + left key
					const previousButton = $('a.ytp-prev-button')[0]

					if (previousButton) {
						previousButton.click()
					}
				} else if (e.which === 39) { // Handle ctl + right key
					const nextButton = $('a.ytp-next-button')[0]

					if (nextButton) {
						nextButton.click()
					}
				}
			}
		}
	}

	$(document).on('keydown', onKeyDown)
}

// Expands video description
function ensureExpandedVideoDescription() {
	setInterval(() => {
		if (!inWatchPage()) {
			return
		}

		if ($('#ytd-watch-info-text').attr('detailed') == null) {
			$('#description-inline-expander tp-yt-paper-button#expand').click()
		}
	}, 50)
}

// Expands video description
function ensureModdedTheaterModeButton() {
	setInterval(() => {
		if (!inWatchPage()) {
			return
		}

		const playerModeButton = $('button.ytp-size-button')

		if (playerModeButton.length === 0 || playerModeButton.hasClass('MaximizerForYouTube_PlayerMod_Modded')) {
			return
		}

		playerModeButton.on('click', () => {
			setTimeout(() => {
				installOrUninstallPlayerModIfNeeded()

				const resizeEvent = new Event('resize')
				window.dispatchEvent(resizeEvent)
			}, 0)
		})

		playerModeButton.addClass('MaximizerForYouTube_PlayerMod_Modded')
	}, 50)
}

function ensurePlayerIsAlwaysPaused() {
	setInterval(() => {
		const player = getVideoPlayer().get(0)

		if (player) {
			player.pause()
		}
	}, 1000)
}

function hideSPFLoadingBar() {
	$('head').append('<style>#progress, yt-page-navigation-progress {display: none !important}</style>')
}

// Pauses playing videos in other tabs when a video play event is detected (works in both watch and channel page videos)
function ensurePlayerAutoPause() {
	const videoPlayer = getVideoPlayer()

	if (videoPlayer.length > 0 &&
		!videoPlayer.hasClass('MaximizerForYouTube_Modded_Autopause') &&
		!inHomePage() &&
		!inFeedPage() &&
		!inSearchPage()) {
		// Generate a random script instance ID
		const instanceID = Math.random().toString()

		function onVideoPlay() {
			log('onVideoPlay')

			localStorage['MaximizerForYouTube_PlayingInstanceID'] = instanceID

			function pauseWhenAnotherPlayerStartsPlaying() {
				if (localStorage['MaximizerForYouTube_PlayingInstanceID'] !== instanceID) {
					videoPlayer[0].pause()
				} else {
					setTimeout(pauseWhenAnotherPlayerStartsPlaying, 20)
				}
			}

			pauseWhenAnotherPlayerStartsPlaying()
		}

		// If video isn't paused on startup, fire the handler immediately
		if (!videoPlayer[0].paused) {
			onVideoPlay()
		}

		// Add event handler for the 'play' event.
		videoPlayer.on('play', onVideoPlay)

		// Mark the player as modded to ensure the autopause mod isn't installed again
		videoPlayer.addClass('MaximizerForYouTube_Modded_Autopause')
	}

	setTimeout(ensurePlayerAutoPause, 50)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get the video player element
function getVideoContainer() {
	// Note: the channel page has another hidden video except the main one (if it exists). The hidden video doesn't have an 'src' attribute.
	return $('div.html5-video-player')
}

// Get the video player element
function getVideoPlayer() {
	// Note: the channel page has another hidden video except the main one (if it exists). The hidden video doesn't have an 'src' attribute.
	return $('.html5-main-video').filter(function (index) {
		return $(this).attr('src') !== undefined
	})
}

// Get the top bar element
function getTopBar() {
	return $('#masthead-container')
}

function showTopBar() {
	getTopBar().css('visibility', 'visible')
	getTopBar().css('opacity', '1')
}

function hideTopBar() {
	getTopBar().css('opacity', '0')
	getTopBar().css('visibility', 'hidden')
}

function pageScrolledToTop() {
	return $(document).scrollTop() === 0
}

function scrollPageToTopIfNeeded() {
	setTimeout(() => {
		if (inWatchPage() && $(document).scrollTop() > 0) {
			log('Scrolling page to top')

			$(document).scrollTop(0)
		}
	}, 20)
}

function topBarIsVisible() {
	return getTopBar().css('visibility') === 'visible'
}

function inWatchPage() {
	return locationPathname() == '/watch'
}

function inSearchPage() {
	return locationPathname().startsWith('/results')
}

function inFeedPage() {
	return locationPathname().startsWith('/feed')
}

function inHomePage() {
	return locationPathname() == '/'
}

function locationPathname() {
	return (new URL(location.href)).pathname
}

function theaterModeEnabled() {
	return Cookies.get('wide') === '1'
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event handlers
////////////////////////////////////////////////////////////////////////////////////////////////////////

let installInterval

function onDocumentStart() {
	log('onDocumentStart')

	log('Script loaded, theater mode enabled:', theaterModeEnabled())

	//installOrUninstallPlayerModIfNeeded()

	installInterval = setInterval(() => {
		installOrUninstallPlayerModIfNeeded()
		//log('Trying to install mod')
	}, 10)
}

function onDocumentEnd() {
	log('onDocumentEnd')

	clearInterval(installInterval)
	installOrUninstallPlayerModIfNeeded()

	//ensurePlayerIsAlwaysPaused()

	hideSPFLoadingBar()
	installTopBarAutohide()
	installPlayerInputAutoFocus()
	installPlayerKeyboardShortcutExtensions()
	ensureExpandedVideoDescription()
}

function onWindowLoad() {
	log('onWindowLoad')

	ensureModdedTheaterModeButton()
	ensurePlayerAutoPause()
}

function onNavigation() {
	log('onNavigation, new location:', location.href)

	//scrollPageToTopIfNeeded()
	installOrUninstallPlayerModIfNeeded()
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Install event handlers and start script
////////////////////////////////////////////////////////////////////////////////////////////////////////

function startScript() {
	document.addEventListener('DOMContentLoaded', onDocumentEnd, false)

	$(window).on('load', onWindowLoad)

	$(window).on('yt-navigate-start', () => {
		log('yt-navigate-start')
		onNavigation()
	})

	$(window).on('popstate', () => {
		log('popstate')
		onNavigation()
	})

	onDocumentStart()
}

if (window.self === window.top) {
	startScript()
}
