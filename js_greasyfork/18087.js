// ==UserScript==
// @name         Block MML Commercials
// @namespace    http://www.tedweatherly.com/
// @version      2016_v1.0
// @description  Mutes and hides all the ANNOYING commercials presented from NCAA's march madness web site
// @author       Ted Weatherly
// @match        http://www.ncaa.com/march-madness-live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18087/Block%20MML%20Commercials.user.js
// @updateURL https://update.greasyfork.org/scripts/18087/Block%20MML%20Commercials.meta.js
// ==/UserScript==

$(function() {
	var _DEBUG_MODE = true;

	var _jqBody;
	var _oldHref;
	var _mmlObjectElem;
	var _jqCommercialIndicatorElem;
	var _jqGameVideoCover;
	var _jqPlayerContainer;
	var _jqMainPlayer;
	var _lastVolume;
	var _commercialCheckTimeoutId;
	var _isCommercialBlocked;
	var _bListeningForCommercialEvents;
	var _bCommercialActive = true;


	function _init() {
		_jqBody = $('body');
		_oldHref = null;
		_jqCommercialIndicatorElem = null;
		_lastVolume = 0.5; // default
		_commercialCheckTimeoutId = null;
		_isCommercialBlocked = false;
		_bListeningForCommercialEvents = false;
		_bCommercialActive = false;

		_detectAppLoaded();
	}

	function _detectAppLoaded() {
		if (_DEBUG_MODE) console.log("Block MML: _detectAppLoaded()");
		if (_isAppLoading()) {
			// App still loading -> check again after 2 seconds
			window.setTimeout(_detectAppLoaded, 2000);
		} else {
			// App loaded -> do page specific functionality
			if (_DEBUG_MODE) console.log("Block MML: app loaded");
			_detectPageChanges();
		}
	}

	function _detectPageChanges() {
		if (location.href != _oldHref) {
			var currentHref = location.href;
			if (_DEBUG_MODE) console.log("Block MML: Current href " + currentHref);
			if (currentHref.indexOf("/march-madness-live/game/") > 0) {
				if (_DEBUG_MODE) console.log("Block MML: on game page");
				_performGamePageActions();
			} else {
				if (_DEBUG_MODE) console.log("Block MML: not on game page");
				window.clearTimeout(_commercialCheckTimeoutId);
			}
			_oldHref = location.href;
		}
		window.setTimeout(_detectPageChanges, 1000); // check every second
	}

	function _performGamePageActions() {
		// Store page elements
		try {
			_mmlObjectElem = _jqBody.find('object#mml_falcon_swf')[0];
			if (_DEBUG_MODE) console.log("Block MML: _mmlObjectElem found");
		} catch(ex) {
			window.setTimeout(_performGamePageActions, 1000);
		}

		// Define some divs
		_jqPlayerContainer = _jqBody.find('div#player-container');
		_jqMainPlayer = _jqPlayerContainer.children('div.main-player');

		// Create cover divs
		_createCoverDivs();

		// React to resize
		$(window).resize(function() {
			_onResize();
		});
		_onResize();

		// Do stuff
		_hideGamePageCrap();
		_alwaysEnableNavLinks();
		_detectCommercialStartStop();
	}

	function _createCoverDivs() {
		// Video cover
		_createVideoCover();
	}

	/* **************************************************** */
	/* ***  PAGE CRAP FUNCTIONS *************************** */
	/* **************************************************** */

	function _hideGamePageCrap() {
		var customStylesArray = [];

		// Always hide cardstrip, game buttons, and footer
		////customStylesArray.push('.body-game div.player-container-wrapper > div.player-container { max-height: none !important; }');
		customStylesArray.push('.body-game div.player-container-wrapper > div.player-cardstrip { display: none !important; }');
		customStylesArray.push('aside.player-sidebar > ul#gamecenter-buttons { display: none !important; }');
		customStylesArray.push('div.app-container > div.footer-container-swf { display: none !important; }');

		_addPermanentStyles("block_mml_styles", customStylesArray);
	}

	/* **************************************************** */
	/* ***  COMMERCIAL FUNCTIONS ************************** */
	/* **************************************************** */

	function _createVideoCover() {
		if (_jqBody.find('div#mml_video_cover').length === 0) {
			if (_DEBUG_MODE) console.log("Block MML: creating mml_video_cover div");
			_jqGameVideoCover = _jqPlayerContainer.append('<div id="mml_video_cover"></div>').find('div#mml_video_cover');
			_jqGameVideoCover.css({"background-color": "#000", "opacity": 0.9899995, "position": "absolute", "left": "0", "top": "0" }).width("100%").height("105%").hide();
			if (_DEBUG_MODE) console.log("Block MML: Video cover added");
		}
	}

	// -- Detect when commercial starts/ends --------------

	// Check based on events from their falcon object
	function _detectCommercialStartStop() {
		if (_bListeningForCommercialEvents) {
			if (_bCommercialActive) _onCommercialStart();
			else _onCommercialEnd();
		} else {
			window.mmlFalcon.radio.swf.on("mmlPlayer:prerollStart", function(eventObj) {
				if (_DEBUG_MODE) console.log("Block MML: mmlPlayer:prerollStart");
				_onCommercialStart();
			});

			window.mmlFalcon.radio.swf.on("mmlPlayer:prerollEnd", function(eventObj) {
				if (_DEBUG_MODE) console.log("Block MML: mmlPlayer:prerollEnd");
				_onCommercialEnd();
			});

			window.mmlFalcon.radio.swf.on("mmlPlayer:midroll", function(eventObj) {
				if (_DEBUG_MODE) console.log("Block MML: mmlPlayer:midroll, eventObj.type = " + eventObj.type, ", eventObj.adSpec = " + eventObj.adSpec);
				if (eventObj.type === "ADPLAY") {
					_onCommercialStart();
				} else {
					if (!eventObj.hasOwnProperty("ignoreThisShit")) {
						_onCommercialEnd();
					}
				}
			});

			_bListeningForCommercialEvents = true;
		}
	}

	// Check based on an element on the page (less reliable)
	/*
	function _checkForCommercial2() {
		var isCommercialShowing = _isCommercialShowing();
		if (_DEBUG_MODE) console.log("Block MML: isCommercialShowing = " + isCommercialShowing + ", _isCommercialBlocked = " + _isCommercialBlocked);
		if (isCommercialShowing && !_isCommercialBlocked) {
			_onCommercialStart();
		} else if (!isCommercialShowing && _isCommercialBlocked) {
			_onCommercialEnd();
		}
		_commercialCheckTimeoutId = window.setTimeout(_checkForCommercial, 2000); // check every 2 seconds
	}
	function _isCommercialShowing() {
		if (_jqCommercialIndicatorElem === null) _jqCommercialIndicatorElem = _jqBody.find('div#mml-ad-lock');
		return (_jqCommercialIndicatorElem.attr('style') === "display: block;");
	}
	*/

	function _onCommercialStart() {
		_bCommercialActive = true;
		if (!_isCommercialBlocked) {
			if (_DEBUG_MODE) console.log("Block MML: Commercial showing -> blocking");
			_muteVideo(_mmlObjectElem.getVolume()); // mute
			_hideVideo(); // hide
			//_enableNavLinksAfterCommercialStart(); // enable navigation links...assholes don't let you change pages even when the nav is visible during a commercial
			_isCommercialBlocked = true;
		}
		// Send a non-ADPLAY midroll event to re-enable navigation
		////window.mmlFalcon.radio.swf.trigger("mmlPlayer:midroll", { type: "PODEND", adSpec: "ignoreThisShit", ignoreThisShit: true });
	}

	function _onCommercialEnd() {
		_bCommercialActive = false;
		if (_isCommercialBlocked) {
			if (_DEBUG_MODE) console.log("Block MML: Commercial not showing -> unblocking");
			_unmuteVideo(); // unmute
			_showVideo(); // show
			_isCommercialBlocked = false;
		}
	}

	// -- Hide/show commercial video ----------------------

	function _hideVideo() { _jqGameVideoCover.show(); }

	function _showVideo() { _jqGameVideoCover.hide(); }


	// -- Mute/unmute commercial volume -------------------

	function _muteVideo(volume) {
		_lastVolume = volume; // save volume
		_mmlObjectElem.setVolume(0); // mute
	}

	function _unmuteVideo() {
		_mmlObjectElem.setVolume(_lastVolume); // restore volume
	}

	/* **************************************************** */
	/* *** NAV LINK FUNCTIONS ***************************** */
	/* **************************************************** */

	function _alwaysEnableNavLinks() {
		// Always show navigation
		_addPermanentStyles("fix_mml_nav_styles", ['nav.nav > div#mml-ad-lock { display: none !important; }']);

		// During "ads" mode the navigation doesn't get disabled
		window.mmlFalcon.util.urlParams.mode = "ads";
	}

	function _enableNavLinksAfterCommercialStart() {
		window.setTimeout(function() {
			if (_DEBUG_MODE) console.log("Block MML: Enabling navigation links");
			window.mmlFalcon.service.ads.adLocked = false;
			window.mmlFalcon.region.global.nav.adUnlock();
			window.mmlFalcon.router.start();
		}, 500);
	}

	/* **************************************************** */
	/* *** MISC FUNCTIONS ********************************* */
	/* **************************************************** */

	function _isAppLoading() {
		return _jqBody.hasClass("mml-loading")
	}

	function _addPermanentStyles(id, styleStrArray) {
		// Join styles and add to head tag
		if ($('head > style#'+id).length === 0) {
			if (_DEBUG_MODE) console.log("Block MML: Adding permanent styles ("+id+")");
			var htmlStr = '';
			htmlStr += '<style id="'+id+'" type="text/css">';
			htmlStr += styleStrArray.join(" \n");
			htmlStr += '</style>';
			$(htmlStr).appendTo("head");
		}
	}

	function _onResize() {
		if (_DEBUG_MODE) console.log("Block MML: _onResize()");
		_jqGameVideoCover.width(_jqMainPlayer.width()+"px");
		_jqGameVideoCover.height(_jqMainPlayer.height()+"px");
	}

	$(document).ready(function() {
		_init();
	});

});

/*
 DIV.footer-container-swf { display: none !important; }
 ul#gamecenter-buttons { display: none !important; }
 div#mml-cardstrip { display: none !important; }
 div#mml-ad-lock.always-hide-cover { display: none !important; }
 */