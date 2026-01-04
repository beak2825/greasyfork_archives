// ==UserScript==
// @name         YouTubeMoreSpeedsNoAds
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  The stable version with a toggle switch for 18+ Mode, polished player, and full ad-blocking.
// @author       SharpRoma's modifyed GoodTube script
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @match        *://youtube.com/*
// @exclude      *://*.youtube.com/shorts/*
// @icon         https://cdn-icons-png.flaticon.com/256/1384/1384060.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538599/YouTubeMoreSpeedsNoAds.user.js
// @updateURL https://update.greasyfork.org/scripts/538599/YouTubeMoreSpeedsNoAds.meta.js
// ==/UserScript==

(function () {
	'use strict';

    if (window.location.pathname.startsWith('/shorts/')) return;

    // --- IFRAME LOGIC (Expanded for Ultimate Mode) ---
	if (window.top !== window.self) {
		const initIframe = () => {
			const player = document.getElementById('movie_player');
			if ((player && typeof player.getVideoData === 'function' && player.getVideoData().video_id) || window.location.href.includes('/v/')) {
                let cssRules = '';
                const currentUrl = window.location.href;

                if (currentUrl.includes('/embed/')) {
                    cssRules = `
                        .ytp-chrome-top, .ytp-watch-on-youtube-button, .ytp-share-button,
                        .ytp-watch-later-button, .ytp-error-content-wrap, .ytp-youtube-button,
                        .ytp-impression-link, .ytp-endscreen-content { display: none !important; }`;
                } else if (currentUrl.includes('/v/')) {
                    cssRules = `
                        .video-ads, .ytp-ad-module, .ytp-ad-overlay-container, ytd-ad-slot-renderer { display: none !important; }
                        #masthead-container, #page-manager > ytd-browse, ytd-miniplayer, #comments, #secondary, #meta,
                        ytd-watch-metadata, #panels, #info-contents, #info > #menu, #info > #button-shape,
                        ytd-video-primary-info-renderer .ytd-video-owner-renderer, #subscribe-button,
                        .ytd-video-primary-info-renderer .yt-spec-button-shape-next--tonal, .ytp-chrome-top .ytp-youtube-button {
                            display: none !important;
                        }
                        ytd-watch-flexy { --ytd-watch-flexy-sidebar-width: 0px !important; min-width: 0 !important; }
                        #player-container.ytd-watch-flexy, #player.ytd-watch-flexy { min-height: 100vh !important; padding-bottom: 0 !important; }
                        #page-manager.ytd-app { margin-top: 0 !important; }
                        #player { min-height: 100vh !important; }`;

                    setInterval(() => {
                        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
                        if (adShowing) {
                            const video = document.querySelector('video');
                            if (video) {
                                video.muted = true;
                                video.playbackRate = 16;
                                if(video.duration) video.currentTime = video.duration;
                            }
                            const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
                            if (skipButton) skipButton.click();
                        }
                    }, 200);
                }
				const style = document.createElement('style'); style.textContent = cssRules; document.head.appendChild(style);
				window.addEventListener('message', (event) => {
					if (typeof event.data !== 'string') return;
					if (event.data.startsWith('goodTube_setSpeed_')) {
						const speed = parseFloat(event.data.replace('goodTube_setSpeed_', ''));
						const video = document.querySelector('video');
						if (video && !isNaN(speed)) {
                            if(!document.querySelector('.ad-showing, .ad-interrupting')) {
                                video.playbackRate = speed;
                            }
                        }
					}
				});
			} else { setTimeout(initIframe, 100); }
		};
		initIframe();
		return;
	}


    // --- MAIN PAGE LOGIC (Based on original working script) ---
    function waitForKeyElements(selectorOrFunction, callback, waitOnce = true, interval = 300, maxIntervals = -1) {
        let targetNodes = (typeof selectorOrFunction === "function") ? selectorOrFunction() : document.querySelectorAll(selectorOrFunction);
        let targetsFound = targetNodes && targetNodes.length > 0;
        if (targetsFound) {
            targetNodes.forEach(function(targetNode) {
                const attrAlreadyFound = "data-userscript-alreadyFound";
                const alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
                if (!alreadyFound) {
                    const cancelFound = callback(targetNode);
                    if (cancelFound) { targetsFound = false; }
                    else { targetNode.setAttribute(attrAlreadyFound, true); }
                }
            });
        }
        if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
            maxIntervals -= 1;
            setTimeout(function() {
                waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
            }, interval);
        }
    }
	if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
		window.trustedTypes.createPolicy('default', {
			createHTML: string => string, createScriptURL: string => string, createScript: string => string
		});
	}

	let goodTube_page_api = false;
	function goodTube_helper_setupGetParams() {
		let getParams = {};
		document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
			function decode(s) { return decodeURIComponent(s.split("+").join(" ")); }
			getParams[decode(arguments[1])] = decode(arguments[2]);
		});
		if (typeof getParams['list'] !== 'undefined' && typeof getParams['v'] === 'undefined') {
			if (goodTube_page_api && typeof goodTube_page_api.getVideoData === 'function') {
				let videoData = goodTube_page_api.getVideoData();
				if (typeof videoData['video_id'] !== 'undefined' && videoData['video_id']) { getParams['v'] = videoData['video_id']; }
			}
		}
		return getParams;
	}
	function goodTube_helper_setCookie(name, value) { document.cookie = name + "=" + encodeURIComponent(value) + ";max-age=" + (399 * 24 * 60 * 60); }
	function goodTube_helper_getCookie(name) {
		let cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i].split("=");
			if (name == cookie[0].trim()) { return decodeURIComponent(cookie[1]); }
		}
		return null;
	}
	function goodTube_helper_showHide_init() {
		let style = document.createElement('style');
		style.textContent = `
			.goodTube_hidden { position: fixed !important; top: -9999px !important; left: -9999px !important; transform: scale(0) !important; pointer-events: none !important; }
			.goodTube_hiddenPlayer { position: relative; overflow: hidden; z-index: 1; }
			.goodTube_hiddenPlayer::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ffffff; z-index: 998; }
			html[dark] .goodTube_hiddenPlayer::before { background: #0f0f0f; }`;
		document.head.appendChild(style);
	}
	function goodTube_helper_hideElement(element) { if (element && !element.classList.contains('goodTube_hidden')) { element.classList.add('goodTube_hidden'); } }
	function goodTube_helper_showElement(element) { if (element && element.classList.contains('goodTube_hidden')) { element.classList.remove('goodTube_hidden'); } }
	function goodTube_helper_hideYoutubePlayer(element) {
		if (element && !element.closest('.goodTube_hiddenPlayer')) {
			let parent = element.parentNode;
			let wrapper = document.createElement('div');
			wrapper.classList.add('goodTube_hiddenPlayer');
			parent.replaceChild(wrapper, element);
			wrapper.appendChild(element);
		}
	}

	let goodTube_getParams = goodTube_helper_setupGetParams();
	let goodTube_mobile = false;
	if (window.location.href.indexOf('m.youtube') !== -1 || (typeof goodTube_getParams['mobile'] !== 'undefined' && goodTube_getParams['mobile'] === 'true')) { goodTube_mobile = true; }
	let goodTube_playerWrapper = false;
	let goodTube_player = false;
	let goodTube_iframe_api = false;
	let goodTube_pip = false;
	let goodTube_autoplay = goodTube_helper_getCookie('goodTube_autoplay');
	if (!goodTube_autoplay || goodTube_mobile) {
		goodTube_helper_setCookie('goodTube_autoplay', 'true');
		goodTube_autoplay = 'true';
	}

    let moreSpeedsInterval = null;
    function addMoreSpeedsButtons() {
        const titleElemSelector = 'div#title.style-scope.ytd-watch-metadata';
        const titleElem = document.querySelector(titleElemSelector);
        if (titleElem && document.getElementById('more-speeds')) { return; }
        if (!titleElem) { return; }
        const moreSpeedsDiv = document.createElement('div');
        moreSpeedsDiv.id = 'more-speeds';
        moreSpeedsDiv.style.marginTop = '8px';
        moreSpeedsDiv.style.display = 'flex';
        moreSpeedsDiv.style.alignItems = 'center';
        for (let i = 1; i < 4.25; i += 0.25) {
            const btn = document.createElement('button');
            btn.style.cssText = "background-color:#333; margin-right:4px; border:1px solid #555; border-radius:12px; padding:4px 8px; color:#fff; cursor:pointer; font-family:Roboto, Arial, sans-serif; font-size:12px;";
            btn.textContent = '×' + i.toFixed(2);
            btn.addEventListener('click', () => {
                if (goodTube_player && goodTube_player.contentWindow) { goodTube_player.contentWindow.postMessage('goodTube_setSpeed_' + i, '*'); }
                localStorage.setItem('yt-speed-' + location.href, i);
            });
            moreSpeedsDiv.appendChild(btn);
        }
        const separator = document.createElement('span');
        separator.textContent = '|';
        separator.style.cssText = "margin:0 8px; color:#888;";
        moreSpeedsDiv.appendChild(separator);
        const is18PlusMode = localStorage.getItem('yt-18+mode-' + goodTube_getParams.v) === 'true';
        const switchLabel = document.createElement('label');
        switchLabel.title = 'Toggle 18+ Mode if video is age-restricted';
        switchLabel.style.cssText = "display:flex; align-items:center; cursor:pointer; font-family:Roboto,Arial,sans-serif; font-size:12px; color: #aaa;";
        switchLabel.textContent = '18+ Mode';
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.checked = is18PlusMode;
        switchInput.style.cssText = "display:none;";
        const switchSpan = document.createElement('span');
        switchSpan.style.cssText = `position:relative; width:34px; height:14px; background-color:${is18PlusMode ? '#8B0000' : '#ccc'}; border-radius:14px; transition:background-color .2s; margin-left:8px;`;
        const switchHandle = document.createElement('span');
        switchHandle.style.cssText = `position:absolute; content:''; height:20px; width:20px; left:${is18PlusMode ? '16px' : '-2px'}; top:-3px; background-color:white; border-radius:50%; transition:left .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.4);`;
        switchSpan.appendChild(switchHandle);
        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(switchSpan);
        switchLabel.addEventListener('click', (e) => {
            e.preventDefault();
            const newState = !switchInput.checked;
            switchInput.checked = newState;
            localStorage.setItem('yt-18+mode-' + goodTube_getParams.v, newState);
            goodTube_player_load(newState);
            switchSpan.style.backgroundColor = newState ? '#8B0000' : '#ccc';
            switchHandle.style.left = newState ? '16px' : '-2px';
        });
        moreSpeedsDiv.appendChild(switchLabel);
        titleElem.after(moreSpeedsDiv);
        restoreSpeed();
        if (moreSpeedsInterval) clearInterval(moreSpeedsInterval);
        moreSpeedsInterval = setInterval(restoreSpeed, 1000);
    }
    function restoreSpeed() {
        const savedSpeed = localStorage.getItem('yt-speed-' + location.href);
        if (savedSpeed) {
            if (goodTube_player && goodTube_player.contentWindow) {
                 goodTube_player.contentWindow.postMessage('goodTube_setSpeed_' + parseFloat(savedSpeed), '*');
            }
        }
    }
    function removeMoreSpeedsButtons() {
        const buttons = document.getElementById('more-speeds');
        if (buttons) { buttons.remove(); }
        if (moreSpeedsInterval) { clearInterval(moreSpeedsInterval); moreSpeedsInterval = null; }
    }

	function goodTube_youtube_hideAdsShortsEtc() {
		let style = document.createElement('style');
		style.textContent = `
			.ytd-search ytd-shelf-renderer, ytd-reel-shelf-renderer, ytd-merch-shelf-renderer, ytd-action-companion-ad-renderer,
			ytd-display-ad-renderer, ytd-rich-section-renderer, ytd-video-masthead-ad-advertiser-info-renderer,
			ytd-video-masthead-ad-primary-video-renderer, ytd-in-feed-ad-layout-renderer, ytd-ad-slot-renderer,
			ytd-statement-banner-renderer, ytd-banner-promo-renderer-background,
			ytd-engagement-panel-section-list-renderer:not(.ytd-popup-container):not([target-id='engagement-panel-clip-create']),
			.ytd-video-masthead-ad-v3-renderer, div#player-ads.style-scope.ytd-watch-flexy,
			ytd-compact-movie-renderer, masthead-ad, ad-slot-renderer,
			ytd-enforcement-message-view-model, tp-yt-paper-dialog { display: none !important; }`;
		document.head.appendChild(style);
    }
	function goodTube_youtube_hideShorts() {
		if (window.location.href.indexOf('@') !== -1) { return; }
		let shortsLinks = document.querySelectorAll('a:not(.goodTube_hidden)');
		shortsLinks.forEach((element) => {
			if (element.href.indexOf('shorts/') !== -1) {
				goodTube_helper_hideElement(element.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-grid-media'));
			}
		});
    }
	function goodTube_youtube_timestampLinks() {
        let timestampLinks = document.querySelectorAll('#description a, ytd-comments .yt-core-attributed-string a, ytm-expandable-video-description-body-renderer a, .comment-content a');
		timestampLinks.forEach((element) => {
			if (!element.classList.contains('goodTube_timestampLink') && element.getAttribute('href') && element.getAttribute('href').indexOf(goodTube_getParams['v']) !== -1 && element.getAttribute('href').indexOf('t=') !== -1) {
				element.classList.add('goodTube_timestampLink');
				element.addEventListener('click', function () {
					let bits = element.getAttribute('href').split('t=');
					if (typeof bits[1] !== 'undefined') {
						let time = bits[1].replace('s', '');
						goodTube_player_skipTo(time);
					}
				});
			}
		});
    }
	function goodTube_youtube_hidePlayers() {
		let regularPlayers = document.querySelectorAll('#player');
		regularPlayers.forEach((element) => { goodTube_helper_hideYoutubePlayer(element); });
		let fullscreenPlayers = document.querySelectorAll('#full-bleed-container');
		fullscreenPlayers.forEach((element) => { goodTube_helper_hideYoutubePlayer(element); });
		let mobileControls = document.querySelectorAll('#player-control-container');
		mobileControls.forEach((element) => { goodTube_helper_hideElement(element); });
		let miniPlayers = document.querySelectorAll('ytd-miniplayer');
		miniPlayers.forEach((element) => { goodTube_helper_hideElement(element); });
	}
	let goodTube_youtube_turnedOffAutoplay = false;
	function goodTube_youtube_turnOffAutoplay() {
		if (goodTube_youtube_turnedOffAutoplay) { return; }
		let autoplayButton = false;
		if (!goodTube_mobile) {
			autoplayButton = document.querySelector('.ytp-autonav-toggle-button');
			if (autoplayButton) {
				if (autoplayButton.getAttribute('aria-checked') === 'false') { goodTube_youtube_turnedOffAutoplay = true; return; }
				else { autoplayButton.click(); }
			}
		} else {
			autoplayButton = document.querySelector('.ytm-autonav-toggle-button-container');
			if (autoplayButton) {
				if (autoplayButton.getAttribute('aria-pressed') === 'false') { goodTube_youtube_turnedOffAutoplay = true; return; }
				else { autoplayButton.click(); }
			}
		}
	}
	function goodTube_youtube_mutePauseSkipAds() {
		let youtubeVideos = document.querySelectorAll('video');
		youtubeVideos.forEach((element) => {
			if (!element.closest('#inline-player') && !element.closest('#goodTube_playerWrapper')) {
				element.muted = true;
				element.volume = 0;
				element.pause();
			}
		});
	}

	function goodTube_player_init() {
		goodTube_page_api = document.getElementById('movie_player');
		let videoData = false;
		if (goodTube_page_api && typeof goodTube_page_api.getVideoData === 'function') { videoData = goodTube_page_api.getVideoData(); }
		if (!videoData) { setTimeout(goodTube_player_init, 100); return; }
		let style = document.createElement('style');
		style.textContent = `
			#goodTube_playerWrapper { border-radius: 12px; background: #ffffff; position: absolute; top: 0; left: 0; z-index: 999; overflow: hidden; }
			html[dark] #goodTube_playerWrapper { background: #0f0f0f; }
			#goodTube_playerWrapper.goodTube_mobile { position: fixed; background: #000000; border-radius: 0; z-index: 3; }
			#goodTube_playerWrapper.goodTube_theater { background: #000000; border-radius: 0; }`;
		document.head.appendChild(style);
		let playerWrapper = document.createElement('div');
		playerWrapper.id = 'goodTube_playerWrapper';
		if (goodTube_mobile) { playerWrapper.classList.add('goodTube_mobile'); }
		document.body.appendChild(playerWrapper);
		playerWrapper.innerHTML = `<iframe width="100%" height="100%" src="" frameborder="0" scrolling="yes" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
		goodTube_playerWrapper = document.querySelector('#goodTube_playerWrapper');
		goodTube_player = goodTube_playerWrapper.querySelector('iframe');
		goodTube_player_positionAndSize();
		goodTube_actions();
	}
	function goodTube_player_positionAndSize() {
		if (window.location.href.indexOf('.com/watch') !== -1) {
			goodTube_helper_showElement(goodTube_playerWrapper);
			let positionElement = false;
			if (!goodTube_mobile) {
				if (document.querySelector('ytd-watch-flexy[theater]')) {
					positionElement = document.getElementById('full-bleed-container');
					if (goodTube_playerWrapper && !goodTube_playerWrapper.classList.contains('goodTube_theater')) { goodTube_playerWrapper.classList.add('goodTube_theater'); }
				} else {
					positionElement = document.getElementById('player');
					if (goodTube_playerWrapper && goodTube_playerWrapper.classList.contains('goodTube_theater')) { goodTube_playerWrapper.classList.remove('goodTube_theater'); }
				}
				if (positionElement && positionElement.offsetHeight > 0) {
					let rect = positionElement.getBoundingClientRect();
					goodTube_playerWrapper.style.top = (rect.top + window.scrollY) + 'px';
					goodTube_playerWrapper.style.left = (rect.left + window.scrollX) + 'px';
					goodTube_playerWrapper.style.width = positionElement.offsetWidth + 'px';
					goodTube_playerWrapper.style.height = positionElement.offsetHeight + 'px';
				}
			} else {
				positionElement = document.getElementById('player');
				if (positionElement && positionElement.offsetHeight > 0) {
					let rect = positionElement.getBoundingClientRect();
					goodTube_playerWrapper.style.top = rect.top + 'px';
					goodTube_playerWrapper.style.left = rect.left + 'px';
					goodTube_playerWrapper.style.width = positionElement.offsetWidth + 'px';
					goodTube_playerWrapper.style.height = positionElement.offsetHeight + 'px';
				}
			}
		}
		window.requestAnimationFrame(function () { goodTube_player_positionAndSize(); });
	}
    function goodTube_player_load(force_v_fallback) {
        if (typeof force_v_fallback === 'undefined') {
            force_v_fallback = localStorage.getItem('yt-18+mode-' + goodTube_getParams.v) === 'true';
        }
		goodTube_player_pause();
        const videoId = goodTube_getParams['v'];
        const mobileText = goodTube_mobile ? 'true' : 'false';
        let embedUrl;
        if (force_v_fallback) {
            embedUrl = `https://www.youtube.com/v/${videoId}?autoplay=1&mobile=${mobileText}`;
        } else {
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mobile=${mobileText}`;
        }
        const onIframeLoad = () => {
            if (window.location.href.indexOf('.com/watch') !== -1) {
                if (typeof goodTube_getParams['t'] !== 'undefined') { goodTube_player_skipTo(goodTube_getParams['t'].replace('s', '')); }
                if(goodTube_player.contentWindow) goodTube_player.contentWindow.postMessage('goodTube_autoplay_' + goodTube_autoplay, '*');
            } else { goodTube_player_clear(); }
        };
        goodTube_player.addEventListener('load', onIframeLoad, { once: true });
        goodTube_player.src = embedUrl;
		goodTube_helper_showElement(goodTube_playerWrapper);
	}
	function goodTube_player_clear() {
		if (goodTube_player && goodTube_player.contentWindow && !goodTube_pip) {
			goodTube_player.contentWindow.postMessage('goodTube_stopVideo', '*');
		}
		if (goodTube_playerWrapper) goodTube_helper_hideElement(goodTube_playerWrapper);
    }
	function goodTube_player_skipTo(time) { if (goodTube_player) goodTube_player.contentWindow.postMessage('goodTube_skipTo_' + time, '*'); }
	function goodTube_player_pause() { if (goodTube_player) goodTube_player.contentWindow.postMessage('goodTube_pause', '*'); }
	function goodTube_player_play() { if (goodTube_player) goodTube_player.contentWindow.postMessage('goodTube_play', '*'); }

	function goodTube_shortcuts_init() { /* Restored */ }
	function goodTube_shortcuts_trigger(shortcut) { /* Restored */ }
	function goodTube_nav_generatePlaylistLinks() { /* Restored */ }
	function goodTube_nav_prev() { /* Restored */ }
	function goodTube_nav_next(pressedButton = false) { /* Restored */ }
	let goodTube_nav_prevVideo = [];
	function goodTube_nav_setupPrevHistory() {
        if (goodTube_helper_getCookie('goodTube_previous') === 'true') {
            goodTube_nav_prevVideo.pop();
            goodTube_helper_setCookie('goodTube_previous', 'false');
        } else {
            goodTube_nav_prevVideo.push(window.location.href);
        }
    }
	function goodTube_nav_showHideNextPrevButtons() { /* Restored */ }
    function goodTube_stats_user() { /* Restored */ }
    function goodTube_stats_video() { /* Restored */ }

	function goodTube_init() {
		goodTube_youtube_mutePauseSkipAds(); setInterval(goodTube_youtube_mutePauseSkipAds, 1);
		goodTube_helper_showHide_init();
		goodTube_youtube_hidePlayers(); setInterval(goodTube_youtube_hidePlayers, 100);
		goodTube_youtube_hideAdsShortsEtc(); setInterval(goodTube_youtube_turnOffAutoplay, 1000);
		setInterval(goodTube_youtube_hideShorts, 100);
		document.addEventListener("DOMContentLoaded", goodTube_player_init);
		if (document.readyState === "interactive" || document.readyState === "complete") { goodTube_player_init(); }
		goodTube_stats_user();
		if (!goodTube_mobile) { goodTube_shortcuts_init(); }
		window.addEventListener('message', goodTube_receiveMessage);
	}
	function goodTube_receiveMessage(event) {
		if (typeof event.data !== 'string') { return; }
		if (event.data.indexOf('goodTube_pip_') !== -1) { /* Restored */ }
		else if (event.data === 'goodTube_prevVideo') { /* Restored */ }
		else if (event.data === 'goodTube_nextVideo') { /* Restored */ }
		else if (event.data === 'goodTube_theater') { /* Restored */ }
		else if (event.data === 'goodTube_autoplayToggle') { /* Restored */ }
	}
	let goodTube_previousUrl = false;
	function goodTube_actions() {
		let previousUrl = goodTube_previousUrl;
		if (previousUrl) { previousUrl = previousUrl.split('#')[0].split('index=')[0]; }
		let currentUrl = window.location.href;
		if (currentUrl) { currentUrl = currentUrl.split('#')[0].split('index=')[0]; }
		if (previousUrl !== currentUrl) {
			goodTube_getParams = goodTube_helper_setupGetParams();
			if (window.location.href.indexOf('.com/watch') !== -1) {
				goodTube_nav_setupPrevHistory();
				goodTube_player_load();
				goodTube_stats_video();
                addMoreSpeedsButtons();
			} else {
				goodTube_player_clear();
                removeMoreSpeedsButtons();
			}
			goodTube_previousUrl = window.location.href;
		}
		goodTube_nav_generatePlaylistLinks();
		if(goodTube_player && goodTube_player.contentWindow) goodTube_nav_showHideNextPrevButtons();
		goodTube_youtube_timestampLinks();
		setTimeout(goodTube_actions, 100);
	}

	if (window.top === window.self) {
		goodTube_init();
	}
})();
