// ==UserScript==
// @name Youtube player keyboard controls
// @description Use play/pause/ArrowRight/ArrowLeft keyboard btns anywhere, but not only when youtube player is in focus. Additionaly use '[' and ']' keys to change playbackRate.
// @description set config.defaultPlaybackRate to your preferred youtube PlaybackRate (1.5 by default).
// @description set config.customStyles = true, to hide search bar by default. It will appear by mouse hover.
// @description set config.customStylesDarkTheme = true, to boost Youtube dark theme. You should turn on Dark Theme in Youtube settings first!
// @author termi1uc1@gmail.com
// @license MIT
// @version 0.13
// @include https://www.youtube.com/*
// @namespace https://greasyfork.org/users/174246
// @downloadURL https://update.greasyfork.org/scripts/39372/Youtube%20player%20keyboard%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/39372/Youtube%20player%20keyboard%20controls.meta.js
// ==/UserScript==
// https://greasyfork.org/ru/scripts/39372-youtube-player-keyboard-controls
/* globals AudioContext, ytplayer, KeyboardEvent, HTMLMediaElement, unescape, decodeURIComponent */
;(function(window) {
    const config = {// Set your preferred value. It will be saved in localStorage.
        playbackRateControls: undefined,// boolean, [default = true]
        defaultPlaybackRate: 2,// number, [default = 1.5]
        // Some custom styles to Youtube, including hiding search bar (It will appear by mouse hover).
        // Set it to true, to turn it on.
        customStyles: true,// boolean, [default = false]
        // Boost Youtube Dark Theme. Set it to true, to turn it on.
        customStylesDarkTheme: true,// boolean, [default = false]
        customStylesDarkTheme_bottomContentOpacity: 0,// number, [default = 0.1]
    };

    append(config, _loadConfigLS('youtube_player_keyboard_controls_config'));

    _saveConfigLS('youtube_player_keyboard_controls_config', config);

    append(config, {// Default config
        playbackRateControls: true,
        defaultPlaybackRate: 1.5,
        // Some custom styles to Youtube, including hiding search bar (It will appear by mouse hover).
        customStyles: false,
        // Boost Youtube Dark Theme
        customStylesDarkTheme: false,
        customStylesDarkTheme_bottomContentOpacity: 0.1,
        // download doesn't work, after the latest youtube changes
        downloadLinks: false,
    });

    if (config.defaultPlaybackRate) {
        if (config.defaultPlaybackRate === 1) {
            sessionStorage.removeItem("yt-player-playback-rate");
            localStorage.removeItem("yt-player-playback-rate");
        }
        else {
            const now = Date.now();
            sessionStorage["yt-player-playback-rate"] = `{"data":"${config.defaultPlaybackRate}","creation":${now}}`;
            localStorage["yt-player-playback-rate"] = `{"data":"${config.defaultPlaybackRate}","creation":${now}}`;
        }
    }

    const defaultYoutubeMoviePlayerId = 'movie_player';
    let youtubeMoviePlayerId;

    /* TODO:: Volume more then 100%
    let audioContext;
    let audioContextSource;
    let audioContextGain;

    function getVolumeMoreThen100(videoElement, volumeValue) {
        // TODO:: доделать
        volumeValue = Math.max(10, volumeValue);

        if (!audioContext) {
            audioContext = new AudioContext();
        }

        audioContextSource = audioContext.createMediaElementSource(videoElement);

        // create a gain node
        audioContextGain = audioContext.createGain();
        audioContextGain.gain.value = volumeValue; // double the volume
        audioContextSource.connect(audioContextGain);

        // connect the gain node to an output destination
        audioContextGain.connect(audioContext.destination);
    }
    */
	const randStr = () => (Math.random() * 9e7 | 0).toString(36);
    const getYoutubeMoviePlayerId = () => {
        let youtubeMoviePlayerId = defaultYoutubeMoviePlayerId;

        try {
            if ( typeof ytplayer !== 'undefined' ) {
                youtubeMoviePlayerId = ytplayer.config.attrs.id || defaultYoutubeMoviePlayerId;
            }
        }
        catch(e) {
            youtubeMoviePlayerId = defaultYoutubeMoviePlayerId;
        }

        return youtubeMoviePlayerId;
    };
	const isElemVisible = function($el) {
		if (!$el) {
			return false;
		}
		
		// check element visibility
		if (typeof $el.getClientRects === 'function') {
			const res = $el.getClientRects();

			return !!(res && res.length);
		}
		
		// maybe visible
		return true;
	};
	
	const detectYoutubePlayer = function() {
		const visiblePlayersContainers = Array.from(document.querySelectorAll('#player')).filter(isElemVisible);
		
		for (const $container of visiblePlayersContainers) {
			const $player = $container.querySelector('[aria-label="YouTube Video Player"]');
			
			if (isElemVisible($player)) {
				return $player;
			}
		}
	};
	const checkAndResetMoviePlayer = function($moviePlayer) {
		if (!$moviePlayer) {
			youtubeMoviePlayerId = defaultYoutubeMoviePlayerId;
			
			return document.getElementById(youtubeMoviePlayerId);
		}
		else if (!isElemVisible($moviePlayer)) {
			if (youtubeMoviePlayerId === defaultYoutubeMoviePlayerId) {
				$moviePlayer = detectYoutubePlayer();
				
				if ($moviePlayer && $moviePlayer.id) {
					youtubeMoviePlayerId = $moviePlayer.id;
				}
			}
			else {
				youtubeMoviePlayerId = defaultYoutubeMoviePlayerId;	
			
				return document.getElementById(youtubeMoviePlayerId);
			}
		}
		
		return $moviePlayer;
	};

    const getYoutubePlayer = (getVideoEl = true) => {
        if ( youtubeMoviePlayerId === void 0 ) {
            youtubeMoviePlayerId = getYoutubeMoviePlayerId();
        }
		
		let $moviePlayer = checkAndResetMoviePlayer(document.getElementById(youtubeMoviePlayerId));
		if ( !$moviePlayer ) {
			if ( youtubeMoviePlayerId !== defaultYoutubeMoviePlayerId ) {
				$moviePlayer = document.getElementById(defaultYoutubeMoviePlayerId);
			}

			if ( !$moviePlayer ) {
				return null;
			}
		}        

        return getVideoEl
            ? $moviePlayer.querySelector('video')
            : $moviePlayer
            ;
    };

    const getParrentByClassName = ($el, className, maxTopEls = 15) => {
        if ( !$el ) {
            return null;
        }

        let i = 0;
        let child = $el;

        for ( ; i < maxTopEls ; i++ ) {
            if ( child.classList.contains(className) ) {
                return child;
            }

            if ( !child.parentElement ) {
                return null;
            }

            child = child.parentElement;
        }

        return null;
    };

    const isAdvVideoPlayer = $moviePlayer => {
        if ( !$moviePlayer ) {
            return false;
        }

        const $moviePlayerWrapper = getParrentByClassName($moviePlayer, 'html5-video-player', 5);

        if ( $moviePlayerWrapper ) {
            return $moviePlayerWrapper.classList.contains('ad-showing');
        }

        return false;
    };

    const isEditable = $el => {
        return $el.tagName === 'INPUT'
            || $el.tagName === 'TEXTAREA'
            || ($el.hasAttribute('contenteditable') && $el.contentEditable !== 'false' && $el.contentEditable !== 'inherit');
    };

    const isVideoFullscreenElement = $el => {
        const fullScreenElement = document["mozFullScreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"] || document.fullscreenElement;
        const videoEl = fullScreenElement && fullScreenElement.querySelector('video');

        return videoEl && $el.querySelector('video') !== videoEl && videoEl.tagName === 'VIDEO';
    };

    const removeElement = htmlElement => {
        if (!htmlElement) {
            return;
        }

        if (typeof htmlElement.remove === 'function') {
            htmlElement.remove();

            return;
        }

        if (htmlElement.parentNode) {
            htmlElement.parentNode.removeChild(htmlElement);
        }
    };

    const _checkParent = $el => {
        if ( !$el ) {
            return false;
        }

        let i = 0;
        let hasParent = true;
        let child = $el;

        for ( ; i < 20 ; i++ ) {
            if ( !child.parentElement ) {
                hasParent = false;
                break;
            }

            child = child.parentElement;
        }

        return hasParent;
    };

    let playbackTimer;
    let playbackRateElId;
    let $elPlaybackRate;
    let playbackRateOnKeyDown = event => {
        if (!config.playbackRateControls) {
            return false;
        }

        const $moviePlayer = getYoutubePlayer(false);
        if ( !$moviePlayer ) {
            return false;
        }
        const {code, target} = event;

        if ( code === 'BracketRight' || code === 'BracketLeft' ) {
            if ( isEditable(target)  ) {
                return;
            }
            /*if ( !isVideoFullscreenElement(target) && (target == $moviePlayer || isEditable(target)) ) {
                //console.log(' return ', 1)
                return;
            }
            */

            if ( !playbackRateElId && $moviePlayer ) {
                /*jshint bitwise: false*/
                playbackRateElId = 'playbackRateText' + randStr();
                /*jshint bitwise: true*/

                $moviePlayer.insertAdjacentHTML('afterbegin', `<div id="${playbackRateElId}" style="position: absolute;
z-index: 9999999;
right: 20px;
top: 20px;
pointer-events: none;
display: block;
transition: opacity .5s;
opacity: 0;
color: yellow;
width: auto;
height: 48px;
line-height: 48px;
font-size: 48px;
text-align: center;
text-shadow: 1px 1px 4px #000;"></div>`);

                $elPlaybackRate = document.getElementById(playbackRateElId);
            }
            else if ( !_checkParent($elPlaybackRate) ) {
                // Unattachment element
                $moviePlayer.insertAdjacentElement('afterbegin', $elPlaybackRate);
            }

            const $video = $moviePlayer.querySelector('video');
            const {playbackRate} = $video;
            let newPlaybackRate;

            {
                let delta = code === 'BracketLeft' ? -0.25 : 0.25;

                if ( delta < 0 ) {
                    if ( playbackRate > 2 || playbackRate <= 1 ) {
                        delta = -0.1;
                    }
                }
                else {
                    if ( playbackRate >= 2 || playbackRate < 1 ) {
                        delta = 0.1;
                    }
                }

                newPlaybackRate = playbackRate + delta;

                if ( newPlaybackRate < 0.5 ) {
                    newPlaybackRate = 0.5;
                }
                else if ( newPlaybackRate > 3.5 ) {
                    newPlaybackRate = 3.5;
                }

                // Округление до 2го знака после запятой
                newPlaybackRate = parseFloat(newPlaybackRate.toFixed(2));
            }

            $video.playbackRate = newPlaybackRate;
            $elPlaybackRate.textContent = 'x' + newPlaybackRate;
            $elPlaybackRate.style.opacity = 1;


            if ( playbackTimer ) {
                clearTimeout(playbackTimer);
            }
            playbackTimer = setTimeout(() => {
                playbackTimer = void 0;
                $elPlaybackRate.style.opacity = 0;
            }, 500);

            return true;
        }
    };

    if ( window.__onKey__ ) {
        document.removeEventListener('keyup', window.__onKey__, true);
        document.removeEventListener('keydown', window.__onKey__, true);
        window.__onKey__ = void 0;
    }

    const isNeedMagicActionsForYoutubeFix = () => {
        return String(HTMLMediaElement.prototype.play).indexOf('pauseVideo') !== -1;
    };

    let prevVideoElementUrl;
    const fixPauseVideo = ($moviePlayer, $videoElement) => {
        const youtubePlayerControls = $moviePlayer.querySelector('.ytp-chrome-controls');

        if ( youtubePlayerControls && prevVideoElementUrl !== $videoElement.src ) {
            prevVideoElementUrl = $videoElement.src;
            youtubePlayerControls.click();
        }
    };

    const sDoNotHandle = typeof Symbol === 'undefined' ? '__sDoNotHandle__' : Symbol('sDoNotHandle');

    const onKey = event => {
        if ( event[sDoNotHandle] ) {
            return;
        }

        const $moviePlayer = getYoutubePlayer(false);
        if ( !$moviePlayer ) {
            return;
        }

        const {code, target, keyCode, charCode, which} = event;

        if ( code === 'Space' || code === 'ArrowRight' || code === 'ArrowLeft' ) {
            if ( !isVideoFullscreenElement(target) && (/*target == $moviePlayer || */isEditable(target)) ) {
                //console.log(' return ', 1)
                return;
            }

            const $videoElement = getYoutubePlayer(true);
            if ( !$videoElement ) {
                // something went wrong
                console.warn('onKey: cant find youtube video element');
                return;
            }

            if ( isAdvVideoPlayer($moviePlayer) ) {
                // Проигрывается реклама
                // TODO:: нужно сделать кастомную перемотку вперёд-назад и кнопку "Пропустить"
                console.log('Youtube Adw mode');
            }

            const newEvent = new KeyboardEvent(event.type, event);
            try {
                if ( newEvent.keyCode !== keyCode ) {
                    Object.defineProperty(newEvent, 'keyCode', {value: keyCode, configurable: true, enumerable: true, writable: false});
                }
            }
            catch(e){}
            try {
                if ( newEvent.charCode !== charCode ) {
                    Object.defineProperty(newEvent, 'charCode', {value: charCode, configurable: true, enumerable: true, writable: false});
                }
            }
            catch(e){}
            try {
                if ( newEvent.which !== which ) {
                    Object.defineProperty(newEvent, 'which', {value: which, configurable: true, enumerable: true, writable: false});
                }
            }
            catch(e){}

            if ( $videoElement.paused && isNeedMagicActionsForYoutubeFix() ) {
                fixPauseVideo($moviePlayer, $videoElement);
            }

            newEvent[sDoNotHandle] = true;

            //console.log(' dispatchEvent ', 2, newEvent, event);
            $videoElement.dispatchEvent(newEvent);

            event.stopPropagation();
            event.preventDefault();
        }
        else if ( event.type === 'keydown' ) {
            if ( playbackRateOnKeyDown(event) ) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };
    document.addEventListener('keyup', onKey, true);
    document.addEventListener('keydown', onKey, true);

    window.__onKey__ = onKey;

    if (config.customStyles) {
        if (config.customStylesDarkTheme) {
			const autoBottomContentOpacityClassName = 'custom_abco_' + randStr();
            const {customStylesDarkTheme_bottomContentOpacity = 1} = config;
			
			if (customStylesDarkTheme_bottomContentOpacity !== 1) {
				const toggleDocClass = () => {
					document.documentElement.classList.toggle(autoBottomContentOpacityClassName, document.documentElement.scrollTop <= 0);
				};
				
				toggleDocClass();
				document.addEventListener('scroll', toggleDocClass, { passive: true });
			}
			
            const styleText = `html, body, #content {
    background: black !important;
}
ytd-app {
    --yt-app-background: black !important;
    --yt-spec-general-background-a: black !important;
}
#masthead-container.ytd-app {
    background: black !important;
}
#container.ytd-masthead {
    background: black !important;
}
#primary, #columns {
    background: black !important;

    --yt-endpoint-visited-color: #9c9c9c;
    --yt-spec-call-to-action: #9c9c9c;
    --ytd-video-primary-info-renderer-title-color: #9c9c9c;
    --ytd-comment-text-color: #9c9c9c;
    --yt-spec-text-primary: #9c9c9c;
    
    --yt-spec-general-background-b: #1a1a1a !important;
    --yt-spec-text-primary: #9c9c9c !important;
}
ytd-toggle-button-renderer.style-default-active[is-icon-button] {
    color: #34624b;
}
#guide {
    --app-drawer-content-container_-_background-color: #1a1a1a;
    --yt-spec-brand-background-solid: #1a1a1a;
    --yt-spec-text-primary: #9c9c9c;
}

.ytp-gradient-bottom,
.ytp-large-play-button {
    display: none;
}
.ytp-cued-thumbnail-overlay {
    display: none;
}
#watch-action-panels {
    display: none;
}
.ytp-chrome-bottom {
    opacity: 0;
    transition: opacity .5s;
}
.ytp-chrome-bottom:hover {
    opacity: 1;
}

ytd-watch-flexy[theater] #columns {
    opacity: 1;
    transition: opacity .5s;
}
.${autoBottomContentOpacityClassName} ytd-watch-flexy[theater] #columns {
    opacity: ${customStylesDarkTheme_bottomContentOpacity};
}
.${autoBottomContentOpacityClassName} ytd-watch-flexy[theater] #columns:hover {
    opacity: 1;
}
ytd-masthead {
    opacity: 0;
    transition: opacity .5s;
}
ytd-masthead:hover {
    opacity: 1;
}

#masthead-positioner {
    opacity: 0;
    position: fixed;
    z-index: 9999;
}
#masthead-positioner:hover {
    opacity: 1;
}`;
            const $parentEl = document.head || document.body || document.documentElement;

            if ($parentEl) {
                $parentEl.insertAdjacentHTML('afterbegin', `<style name="youtube-player-keyboard-controls_custom-styles">${styleText}</style>`);
            }
        }
        else {
            const styleText = `#watch-action-panels {
    display: none;
}
.ytp-chrome-bottom {
    opacity: 0;
}
.ytp-chrome-bottom:hover {
    opacity: 1;
}
ytd-masthead {
    opacity: 0;
}
ytd-masthead:hover {
    opacity: 1;
    transition: opacity .5s;
}

#masthead-positioner {
    opacity: 0;
    position: fixed;
    z-index: 9999;
}
#masthead-positioner:hover {
    opacity: 1;
}
`;
            const $parentEl = document.head || document.body || document.documentElement;

            if ($parentEl) {
                $parentEl.insertAdjacentHTML('afterbegin', `<style name="youtube-player-keyboard-controls_custom-styles-simple">${styleText}</style>`);
            }
        }
    }

    function initDownloadLinks() {
        let youTuubeDownloadInterval;
        function setIntervalYD(interval = 5000) {
            if (youTuubeDownloadInterval) {
                clearInterval(youTuubeDownloadInterval);
            }

            youTuubeDownloadInterval = setInterval(function() {
                const $moreActionsBtn = getMoreActionsBtn();

                if ($moreActionsBtn) {
                    clearInterval(youTuubeDownloadInterval);
                    youTuubeDownloadInterval = void 0;

                    $moreActionsBtn.addEventListener('click', function() {
                        setTimeout(function() {
                            youtubedownloader_main(true);
                        }, 500);

                        setTimeout(function() {
                            youtubedownloader_main(true);
                        }, 5000);
                    }, false);
                }
                else {
                    youtubedownloader_main();
                }
            }, interval);
        }

        function getMoreActionsBtn() {
            const $menuContainer = document.querySelector('#menu-container');
            let $moreActionsBtn = null;

            if ($menuContainer) {
                $moreActionsBtn = $menuContainer.querySelector('[aria-label="More actions"]')
                    || $menuContainer.querySelector('yt-icon-button > button')
                    || $menuContainer.querySelector('#button')
                    || $menuContainer.querySelector('.yt-icon-button')
                    || null
                ;
            }

            return $moreActionsBtn;
        }

        let $historyManager;
        let $dataHost;

        function getYoutubeplayerConfig() {
            let ytplayerConfig = null;
            const historyState = history.state;
            const historyEntryTime = historyState && historyState.entryTime;

            if (!$historyManager) {
                $historyManager = document.querySelector('#historyManager') || document.querySelector('yt-history-manager');
            }
            if (!$dataHost) {
                $dataHost = $historyManager && $historyManager.dataHost || document.querySelector('ytd-app[is-watch-page]');
            }

            if ($dataHost && $dataHost.data) {
                ytplayerConfig = $dataHost.data.player;
            }

            if (!ytplayerConfig) {
                if ($historyManager && historyEntryTime && $historyManager["historySnapshotCache_"]) {
                    try {
                        const current_ytplayerConfig = $historyManager["USE_HISTORY_SNAPSHOT_CACHE_"]
                            ? $historyManager["historySnapshotCache_"].get(historyEntryTime)
                            : $historyManager["historyEntryTimeToDataMap_"][a.entryTime]
                        ;

                        if (current_ytplayerConfig) {
                            ytplayerConfig = current_ytplayerConfig;
                        }
                    }
                    catch(err) {
                        console.error(err);
                    }
                }
            }


            return ytplayerConfig
                || (typeof ytplayer !== 'undefined'
                        ? ((ytplayer || {})["config"] || {})
                        : { "args": {} }
                )
                ;
        }

        function getListElement() {
            return document.querySelector('paper-listbox#items');
        }

        function createElement(tagName, attributes, append) {
            const element = document.createElement(tagName);

            for (const attributeName in attributes) {
                if (attributes.hasOwnProperty(attributeName)) {
                    if (typeof element[attributeName] !== 'undefined' && attributeName !== 'style' && attributeName !== 'type'/*FIX IE*/) {
                        element[attributeName] = attributes[attributeName];
                    }
                    else {
                        element.setAttribute(attributeName, attributes[attributeName]);
                    }
                }
            }

            if (append && append.nodeType === 1/*append instanceof Element*/) {
                append.appendChild(element);
            }

            return element;
        }

        function youtubedownloader_main(forceAttacheToMoreActionsBtn = false) {
            const ytplayerConfig = getYoutubeplayerConfig();
            const ytplayerVideoId = ytplayerConfig["args"] && ytplayerConfig["args"]["video_id"];

            if (ytplayerVideoId) {
                console.log("YouTube Downloader: Start");

                const title = ytplayerConfig["args"]["title"];
                const video = {
                    title,
                    title_encoded: encodeURIComponent(title.replace(/[\\~#%&*{}\/:<>?|"-]/g, "_")),
                    fmt: ytplayerConfig["args"]["url_encoded_fmt_stream_map"] + "," + ytplayerConfig["args"]["adaptive_fmts"],
                    id: ytplayerVideoId,
                };
                const textlang = {
                    button_text: "Download",
                    button_hover_text: "Download this video!",
                };

                removeElement(document.getElementById('watch-download-links'));

                const linksContainer = createElement("div", { id: "watch-download-links" });
                const links = video.fmt.split(",");
                let useSignature = false;

                console.log("YouTube Downloader: " + (links.length) + " links collected");

                const parseParamFromLink = function(link, re) {
                    return (link.match(re) || [, ''])[1];
                };

                for (let i = 0 ; i < links.length ; i++) {
                    const link = links[i];

                    if (!link || link === 'undefined') {
                        continue;
                    }

                    const itag = parseInt(parseParamFromLink(link, /itag=([0-9]*)(?:&|$)/) || '0', 10) || void 0;
                    // TODO:: use signature instead of sig? // const signature = parseParamFromLink(link, /(?:^|&)signature=(.*?)(?:&|$)/);
                    const sig = parseParamFromLink(link, /(?:^|&)s=(.*?)(?:&|$)/);
                    const quality_label = parseParamFromLink(link, /quality_label=(.*?)(?:&|$)/) || parseParamFromLink(link, /(?:^|&)quality=(.*?)(?:&|$)/);
                    const size = parseParamFromLink(link, /(?:^|&)size=(.*?)(&|$)/);
                    const projection_type = parseParamFromLink(link, /(?:^|&)projection_type=(.*?)(&|$)/);
                    const url = /*unescape*/decodeURIComponent(parseParamFromLink(link, /url=(.*?)(?:&|$)/)) + (sig ? "&signature=" + sig : "") + "&title=" + video.title_encoded;

                    /*
    (ytplayerConfig = ytplayer.config),(ytplayerConfig["args"]["url_encoded_fmt_stream_map"] + "," + ytplayerConfig["args"]["adaptive_fmts"]).split(",").map(link => { const parse = re=>(link.match(re)||[,''])[1];  let itag = parseInt(parse(/itag=([0-9]*)(?:&|$)/)||'0');let sig = parse(/(?:^|&)s=(.*?)(?:&|$)/);let type = decodeURIComponent(parse(/(?:^|&)type=(.*?)(&|$)/)); let mime = decodeURIComponent(parse(/(?:^|&)mime=(.*?)(&|$)/)); let quality_label = parse(/quality_label=(.*?)(?:&|$)/) || parse(/(?:^|&)quality=(.*?)(?:&|$)/); let size = parse(/(?:^|&)size=(.*?)(&|$)/); let projection_type = parse(/(?:^|&)projection_type=(.*?)(&|$)/); return {itag, sig, type, mime, quality_label, size, projection_type}; });
                    */

                    if (sig) {
                        console.log("YouTube Downloader: Signature detected; aborting!", sig);

                        useSignature = true;
                        //linksContainer.innerHTML = "";
                    }

                    //console.log("links[" + i + "]: itag=" + itag + ";sig=" + sig + ';url=' + url);

                    let nAtext = "";

                    switch (itag) {
                        case 38: nAtext = "2160p(4K,MP4)"; break;
                        case 46: nAtext = "1080p(WebM)"; break;
                        case 37: nAtext = "1080p(MP4)"; break;
                        case 45: nAtext = "720p (WebM)"; break;
                        case 102: /*nAtext = "720p (WebM,3D)";*/ break;
                        case 22: nAtext = "720p (MP4)"; break;
                        case 84: /*nAtext = "720p (MP4,3D)";*/ break;
                        case 85: /*nAtext = "520p (MP4,3D)";*/ break;
                        case 35: nAtext = "480p (FLV)"; break;
                        case 44: nAtext = "480p (WebM)"; break;
                        case 34: nAtext = "360p (FLV)"; break;
                        case 18: nAtext = "360p (MP4)"; break;
                        case 82: /*nAtext = "360p (MP4,3D)";*/ break;
                        case 100: /*nAtext = "360p (WebM,3D)";*/ break;
                        case 101: /*nAtext = "360p (WebM,3D)";*/ break;
                        case 43: nAtext = "360p (WebM)"; break;
                        case 6: nAtext = "270p (FLV)"; break;
                        case 83: /*nAtext = "240p (MP4,3D)";*/ break;
                        case 36: nAtext = "240p (3GP)"; break;
                        case 5: nAtext = "240p (FLV)"; break;
                        case 395: /*nAtext = "240p (MP4, Video only)";*/ break;
                        case 17: nAtext = "144p (3GP)"; break;
                        case 278: /*nAtext = "144p (WebM,Video only)";*/ break;
                        case 264: /*nAtext = "4k(MP4,Video only)";*/ break;
                        case 138: /*nAtext = "4k+(MP4,Video only)";*/ break;
                        case 137: /*nAtext = "1080p(MP4,Video only)";*/ break;
                        case 136: /*nAtext = "720p(MP4,Video only)";*/ break;
                        case 135: /*nAtext = "480p(MP4,Video only)";*/ break;
                        case 134: /*nAtext = "360p(MP4,Video only)";*/ break;
                        case 133: /*nAtext = "240p(MP4,Video only)";*/ break;
                        case 160: /*nAtext = "144p(MP4,Video only)";*/ break;
                        case 394: /*nAtext = "144p(MP4,Video only ?)";*/ break;
                        case 248: /*nAtext = "1080p(WemM,Video only)";*/ break;
                        case 247: /*nAtext = "720p(WemM,Video only)";*/ break;
                        case 397: /*nAtext = "480p(?)";*/ break;
                        case 244: /*nAtext = "480p(WemM,Video only)";*/ break;
                        case 243: /*nAtext = "360p(WemM,Video only)";*/ break;
                        case 396: /*nAtext = "360p(?)";*/ break;
                        case 242: /*nAtext = "240p(WemM,Video only)";*/ break;
                        case 140: nAtext = "Audio(M4A)"; break;
                        case 249: /*nAtext = "Audio(WebM ?)";*/ break;
                        case 250: /*nAtext = "Audio(WebM ?)";*/ break;
                        case 251: /*nAtext = "Audio(WebM ?)";*/ break;
                        case 171: /*nAtext = "Audio(OGG)";*/ break;
                        case 298: /*nAtext = "720p60(MP4,Video only)";*/ break;
                        case 398: /*nAtext = "720p50(?)";*/ break;
                        case 299: /*nAtext = "1080p60(MP4,Video only)";*/ break;
                        case 302: /*nAtext = "720p60(WemM,Video only)";*/ break;
                        case 303: /*nAtext = "1080p60(WemM,Video only)";*/ break;
                        case 266: /*nAtext = "2160p(4K,MP4,Video only)";*/ break;
                        case 271: /*nAtext = "1440p(WemM,Video only)";*/ break;
                        case 272: /*nAtext = "2160p(4K,WemM,Video only)";*/ break;
                        case 313: /*nAtext = "2160p(4K,WemM,Video only)";*/ break;
                        default: {
                            console.warn("YouTube Downloader: Unknown itag: " + itag);

                            if (!itag) {
                                console.warn("YouTube Downloader: link: " + link);
                            }

                            break;
                        }

                    }

                    if (nAtext && !sig) {
                        createElement("a", {
                            href: url,
                            target: '_blank',
                            download: video.title_encoded,
                            innerHTML: nAtext,
                        }, linksContainer);
                    }
                }


                if(linksContainer.childNodes.length === 0){
                    createElement("a", {
                        href: "javascript:alert('This video cannot be downloaded')",
                        innerHTML: "Video download unavailable"
                    }, linksContainer);
                }

                let renderArea;

                if (!forceAttacheToMoreActionsBtn && (renderArea = document.getElementById("watch7-secondary-actions"))) {//document.cookie="VISITOR_INFO1_LIVE=jZNC3DCddAk; path=/; domain=.youtube.com";window.location.reload();
                    createElement("div", { id: "action-panel-download" }, document.getElementById("watch7-action-panels"));

                    const dlb = createElement("button", {
                        className: "action-panel-trigger yt-uix-button",
                        type: "button",
                        onclick(e) {
                            const wdl = document.getElementById("watch-download-links").style;

                            if (wdl.display !== "block") {
                                wdl.display = "block";
                                this.classList.add("yt-uix-button-toggled");
                            }
                            else {
                                wdl.display = "none";
                                this.classList.remove("yt-uix-button-toggled");
                            }

                            wdl.top = (this.offsetTop + this.clientHeight + 7) + "px";
                            wdl.left = (this.offsetLeft + 1) + "px";

                            e.stopPropagation();
                        },
                        innerHTML: `<span class="yt-uix-button-content">${textlang.button_text}</span>`
                    });

                    const W7B0 = document.querySelector('#watch7-secondary-actions button:first-child');

                    W7B0.parentNode.insertBefore(dlb, W7B0.nextSibling);
                    document.getElementById("watch7-content").appendChild(linksContainer);
                }
                else if (!forceAttacheToMoreActionsBtn && (renderArea = document.getElementById("watch8-secondary-actions"))) {
                    createElement("div", { id: "action-panel-download" }, renderArea.parentNode);

                    const dls = createElement("span", { className : "ytd-dls" });
                    createElement("button", {
                        className: "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger yt-uix-tooltip",
                        type: "button",
                        title: textlang.button_hover_text,
                        "data-tooltip-text": textlang.button_hover_text,
                        onclick(e) {
                            const wdl = document.getElementById("watch-download-links").style;
                            if (wdl.display !== "block") {
                                wdl.display = "block";
                                this.classList.add("yt-uix-button-toggled");
                            }
                            else {
                                wdl.display = "none";
                                this.classList.remove("yt-uix-button-toggled");
                            }

                            wdl.top = (this.offsetTop + this.clientHeight + 7) + "px";
                            wdl.left = (this.offsetLeft + 1) + "px";

                            e.stopPropagation();
                        },
                        innerHTML: `<span class="yt-uix-button-content">${textlang.button_text}</span>`
                    }, dls);

                    const W7B0 = document.querySelector('#watch8-secondary-actions .yt-uix-menu');

                    W7B0.parentNode.insertBefore(dls, W7B0);
                    renderArea.appendChild(linksContainer);
                }
                else if (renderArea = getListElement()) {
                    renderArea.appendChild(linksContainer);
                    linksContainer.style.display = 'block';

                    linksContainer.childNodes.forEach(el => el.style.display = 'block');
                }
                else {
                    console.log("YouTube Downloader: Sem renderArea");
                }

                /*
                //insert css
                var ncss = document.createElement("style");
                ncss.appendChild(document.createTextNode("#watch-download-links{width:90px;box-shadow:#999 0px 0px 3px 0px; border-bottom-left-radius:2px; border-bottom-right-radius:2px; background:#EBEBEB; overflow:hidden}#watch-download-links a{height:25px; width:82px;background:#FFF!important; line-height:25px; font-size:12px; padding:0 0 0 8px!important; display:inline-block; color:#000!important; text-decoration:none!important;}#watch-download-links a:hover{background:#EBEBEB!important;}#dl{float:left; padding:4px}#wdl{background:#FFF;border-radius:5px; border:1px solid #EAEAEA; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:14px; margin:0px auto 10px auto; overflow:hidden; display:none; height:auto}#wdl a{padding:5px; color:#000; text-decoration:none; display:inline-block}#wdl a:hover{background:#333; color:#FFF}#watch-actions{height:auto!important}#watch-sidebar iframe{width:234px; height:60px; margin:10px 25px; border-radius:2px; box-shadow:0 0 20px rgba(0,0,0,.2)}"));
                document.head.appendChild(ncss);
                */
            }
        }

        setIntervalYD();
    }

    if (config.downloadLinks) {
        initDownloadLinks();
    }

    function _loadConfigLS(key) {
        const value = localStorage.getItem(key);

        if (value) {
            try {
                return JSON.parse(value);
            }
            catch(e) {
                //
            }
        }

        return void 0;
    }

    function _saveConfigLS(key, value) {
        if (value && typeof value === 'object') {
            const _value = append({}, value);

            if (Object.keys(_value).length > 0) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        }
    }

    function append(target, ...sources) {
        if (target === void 0 || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        const _target = Object(target);

        for (let j = 0, len2 = sources.length ; j < len2 ; j++ ) {
            const source = sources[j];

            if (!source) {
                continue;
            }

            const keys = Object.keys(source);

            for (let i = 0, len = keys.length ; i < len ; i++) {
                const key = keys[i];
                const sourceValue = source[key];

                if (_target[key] === void 0 && sourceValue !== void 0) {
                    _target[key] = sourceValue;
                }
            }
        }

        return _target;
    }
})(window);
