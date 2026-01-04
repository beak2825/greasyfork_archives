// ==UserScript==
// @name         Twitch Tweaks
// @namespace    https://greasyfork.org/en/users/8615-joeytwiddle
// @version      0.2.4
// @description  Add clips tab, make theatre mode toggle fullscreen, hide the annoying red dot
// @author       joeytwiddle
// @license      ISC
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477510/Twitch%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/477510/Twitch%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// Options

	const quietenPrimeOffersRedDot = true;

	const makeTheatreModeButtonToggleFullscreen = true;

	const addClipsTab = true;

	//

	if (quietenPrimeOffersRedDot) {
		//GM_addStyle(`.prime-offers__pill { display: none }`);
		GM_addStyle(`.prime-offers__pill { filter: saturate(0%) brightness(250%) }`);
	}

	//

	// BUG: The first time we click this button, it does go fullscreen, but then it disappears!
	// (Presumably it's a kind of fullscreen that Twitch thinks Theatre Mode does not belong in.)
	// Then when I use Twitch's button to exit fullscreen, the Theatre button re-appears, but no longer toggles fullscreen.
	// I guess that's because it's a new button, without our event listener attached.

	if (makeTheatreModeButtonToggleFullscreen) {
		const theatreModeButtonSelector = '[data-a-target="player-theatre-mode-button"]';

		waitForElement(theatreModeButtonSelector, (element) => {
			// Actually there seem to be two of these (perhaps for different page widths?)
			Array.from(document.querySelectorAll(theatreModeButtonSelector)).forEach(element => {
				console.info("Adding event listener to", element);
				element.addEventListener('click', () => {
					console.info("Toggling fullscreen");
					// Hides the theatre button
					// Although hitting Firefox's own fullscreen button doesn't do that
					// Also this only seems to work once
					// But at least it works the first time!
					toggleFullScreen();
					//
					// Hides chat
					//const fullscreenButton = document.querySelector('[data-a-target="player-fullscreen-button"]')
					//fullscreenButton.click();
				}, true);
			});
		});
	}

	// From https://stackoverflow.com/a/19442811
	function toggleFullScreen() {
       if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {
         if (document.documentElement.requestFullscreen) {
           document.documentElement.requestFullscreen();
         } else if (document.documentElement.mozRequestFullScreen) {
           document.documentElement.mozRequestFullScreen();
         } else if (document.documentElement.webkitRequestFullscreen) {
           document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
         }
       } else {
          if (document.cancelFullScreen) {
             document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
             document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
       }
     }

	function waitForElement(selector, optionsOrCallback) {
		var callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : optionsOrCallback.callback;

		var timeoutSeconds = optionsOrCallback.timeoutSeconds || 120;
		var retrySeconds = optionsOrCallback.retrySeconds || 5;

		var startTime = Date.now();

		var tryForElement = function() {
			var element = document.querySelector(selector);
			if (element) {
				callback(element);
			} else {
				if (Date.now() < startTime + timeoutSeconds * 1000) {
					setTimeout(tryForElement, retrySeconds * 1000);
				} else {
					throw new Error('Could not find element "' + selector + '" within ' + timeoutSeconds + ' seconds');
				}
			}
		};

		tryForElement();
	}

	//

	if (addClipsTab) {
		setTimeout(checkForMissingClipsLink, 1 * 1000);
		setInterval(checkForMissingClipsLink, 15 * 1000);
		// After a click, check a few times if we need to add the link
		document.body.addEventListener('click', function(evt) {
			setTimeout(checkForMissingClipsLink, 0.1 * 1000);
			setTimeout(checkForMissingClipsLink, 0.2 * 1000);
			setTimeout(checkForMissingClipsLink, 0.5 * 1000);
			setTimeout(checkForMissingClipsLink, 1.0 * 1000);
			setTimeout(checkForMissingClipsLink, 1.5 * 1000);
		});
	}

	function checkForMissingClipsLink() {
		if (document.querySelector('a[tabname="videos"]') && !document.querySelector('a[tabname="clips"]')) {
			const videosLink = document.querySelector('a[tabname="videos"]');
			const videosNode = videosLink.parentNode; // The container li

			const streamerName = videosLink.pathname.split('/')[1];
			const range = '7d'; // or '24hr' or '30d' or 'all'
			const clipsPath = `/${streamerName}/clips?featured=false&filter=clips&range=${range}`;

			const clipsNode = videosNode.cloneNode(true);
			const clipsLink = clipsNode.querySelector('a');
			//console.log('clipsNode:', clipsNode);
			clipsLink.querySelector('p').textContent = 'Clips';
			clipsLink.setAttribute('tabname', 'clips'); // Doesn't work without setAttribute?
			clipsLink.setAttribute('data-a-target', 'channel-home-tab-Clips');
			clipsLink.href = clipsPath;

			// Add the new clips tab/link after the videos tab/link
			videosNode.parentNode.insertBefore(clipsNode, videosNode.nextSibling);

			// We may need to fix the styling which shows which tab is currently selected
			// When we are viewing videos, the URL is /videos
			// When we are viewing clips, the URL is also /videos, but with a filter param
			// In either case, we get two selectedTabMarkers, because the video node is styled as selected, and the clips node was cloned from that.
			// So we just need to decide which marker to remove..
			const onClipsTab = document.location.search.match(/\bfilter=clips\b/);
			const onVideosTab = document.location.pathname.match(/[/]videos\b/) && !onClipsTab;
			if (onVideosTab) {
				removeSelectedStyleFrom(clipsNode);
			}
			if (onClipsTab) {
				removeSelectedStyleFrom(videosNode);
			}

			// BUG TODO: Now all that works, but the style doesn't update if we navigate from Clips to Videos tab.  Not a big concern, since I rarely do that.
		}
	}

	function removeSelectedStyleFrom(node) {
		// The underline for the currently selected tab can be found at ul > li > a > div > div > .ScActiveIndicator-sc-17qqzr5-1.kAuTTn
		// Unselected tabs have the container div but not this child.
		const underlineElem = Array.from(node.querySelectorAll('*')).find(
			childNode => String(childNode.className).includes('ScActiveIndicator')
		);
		if (underlineElem) {
			underlineElem.parentNode.removeChild(underlineElem);
		} else {
			console.warn(`[Twitch Tweaks] removeSelectedStyleFrom() underlineElem not found below`, node);
		}

		const textColorElem = node.querySelector('li > a > div');
		if (textColorElem) {
			// Since the class looks variable, let's just overwrite the style directly (back to the unstyled value)
			// For some reason, when I do this on Firefox, even in the console, it often doesn't take O_o
			//textColorElem.style.color = 'inherit !important';
			// But this works
			GM_addStyle(`.color-inherit { color: inherit !important }`);
			textColorElem.classList.add('color-inherit');
		} else {
			console.warn(`[Twitch Tweaks] removeSelectedStyleFrom() textColorElem not found below`, node);
		}
	}
})();
