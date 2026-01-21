// ==UserScript==
// @name         YouTube hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.4.0.1
// @description  quick hotkeys for quality, speed, time jumps, subtitles and replay (for RU, UA, EN, DE, FR, SP)
// @author       Roman Sergeev aka naxombl4 aka Brutal Doomer
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @icon         https://www.youtube.com/s/desktop/78bc1359/img/logos/favicon_144x144.png
// @downloadURL https://update.greasyfork.org/scripts/434723/YouTube%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/434723/YouTube%20hotkeys.meta.js
// ==/UserScript==

/**
 * V1.4.0.1 hotfix for switch case propagation; added some naming sugar
 * v1.4   changed some functionality from div#player to video tag
 *        as a consequence, speed change is now uncapped
 *        changed speed steps to 0.0625x -> 0.125x -> 0.1875x -> 0.25x -> +0.25x per step onwards
 *        changed seek popups style (e.g. +-30s) to be independent of YouTube's
 *        fixed YT's issue of sometimes ignoring the saved timestamp when opening the video previously unfinished (t=905s in the URL for example)
 *        added a check and a forced 1x speed when having caught up watching a livestream
 *        added alt+s speed reset hotkey
 *        reworked replay call
 * v1.3.2.1 hotfix of some left logs + jump text sometimes not shown properly
 * v1.3.2 added time jumps (like +-5s, +-10s)
 *        !WARNING! this overrides browser's default execution of alt+(left/right arrow) for navigation, feel free to comment after : sign on line 248
 * v1.3.1 organized Player into a class
 *        prevented popup duplication
 *        added UA
 * v1.3   changed script from keypress emulation to direct player access (as it should have always been)
 *        added popup to indicate speed/quality change
 *        added mutation observer to track that correct player settings are loaded
 *        added some common code structure
 * v1.2   fixed wrong behavior after YT interface updates
 *        moved surveyLoadProgress to another script
 *        fixed subtitles regexp
 *        added comments
 * v1.1   x hotkey for subtitles, alt+q for 480p quality, plus some readability alignments.
 *
 * Note that speed is uncapped, and goes by 0.0625 steps below 0.25, and by 0.25 steps above 2, until it reaches browser limits.
 * Speed is altered directly in the <video> element, bypassing YT's player UI, so pressing shift + <> will change speed based on UI speed slider position.
 * Keep that in mind and use either of the methods, mixing them will result in funny behavior.
 * Hotkeys are:
 * numpad + and - for +-0.25x speed (shift = +-0.5, alt = +-1);
 * alt+s for resetting speed to 1x;
 * shift+q for 1080p quality, ctrl+q for 720p quality, alt+q for 480p quality;
 * shift+(left/right arrow) for +-30s, alt+(left/right arrow) for +-1min, alt+shift+(left/right arrow) for +-5min
 * q, s and x for quality, speed and subtitle menus (just open, no choosing);
 * r for replay when video is over (video container should be active, unreliable);
 * speed change is rounded to the nearest multiplier of 0.25 (1.4 -> "+" -> 1.5; 1.4 -> "-" -> 1.25)
 *
 * If you have feedback, post it as a comment on my channel (The Brutal Doomer) for the quickest response.
 */

(function() {
    'use strict';

    const POPUP_CN = "customPopup";
    const POPUP_ID1 = "customPopupSpeed"; // speed/quality popup copycat (at the middle top of the player)
    const POPUP_ID2 = "customPopupShift"; // time shift popup
    GM_addStyle(`
div.`+POPUP_CN+` {
  position: absolute;
  z-index: 10;
  padding: 10px 12px;
  border-radius: 3px;
  font-size: 18px;
  color: white;
  background-color: #000a;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%);
}
div#`+POPUP_ID1+` {
  top: 10%;
  left: 50%;
}
div#`+POPUP_ID2+` {
  top: 40%;
}
    `);

    const UK = { // used keys. keyCode is deprecated, but oh well, see when it breaks.
        LEFT: 37,
        RIGHT: 39,
        QUALITY: 81,
        RESTART: 82,
        SPEED: 83,
        SUBTITLES: 88,
        SPEEDUP: 107,
        SPEEDDOWN: 109
    };
    const MOD = { // key press modifiers
        ALT: 1,
        SHIFT: 2,
        CTRL: 4
    };
    const PLAYER_ID = "movie_player";
    const DISPATCH = {
        [UK.QUALITY  ]: /Качество|Якість|Quality|Qualität|Qualité|Calidad/i, // q: quality regexp
        [UK.SPEED    ]: /Скорость|Швидкість|Speed|Wiedergabegeschwindigkeit|Vitesse de lecture|Velocidad de reproducción/i, // s: speed regexp
        [UK.SUBTITLES]: /Субтитры|Субтитри|Subtitles|Untertitel|Sous-titres|Subtítulos/i // x: subtitles regexp
    };

    const CONSECUTIVE_CLICK_EMULATION_DELAY = 100; // milliseconds delay for YouTube elements to pop up (some hotkeys call the player menus)
    const SPEEDALT = 0.25; // precise binary values so no error accumulation
    const SPEEDALTSMALL = 0.0625;
    const TIMESHIFT = [
        [undefined, "error"],
        [55 , "1 minute"], // account for 5 seconds already included. Spaces in text are en spaces (U+2002)
        [25 , "30 sec"],
        [295, "5 minutes"]
    ];

    var player;

    function Player(div) {
        var videos = div.getElementsByTagName("video");
        var video = videos ? videos[0] : undefined;
        const live = div.getVideoData().isLive;
        const QUALITY = {
            large: "480p",
            medium: "360p",
            small: "240p",
            tiny: "144p",
            auto: "auto"
        }
        const POPUP_STATIC_SHOWN_FOR = 300;

        var levels = div.getAvailableQualityLevels(); // array of quality strings inside YT player: see QUALITY keys
        var qualityTexts = levels.map(x => { // corresponding array of displayed "selected quality" strings
            var m = x.match(/\d+/);
            return m ? (m[0] + "p") : (QUALITY[x] || "null");
        });

        
        var popup = false; // copycat of YT default speed/volume top player popup. Feedbacks change of speed/quality.
        var popup2 = false; // custom time shift popup
        for (const child of div.children) { // search for them to prevent duplication
            if (child.id === POPUP_ID1) popup = child;
            if (child.id === POPUP_ID2) popup2 = child;
        }
        if (!popup) {
            popup = document.createElement("div");
            popup.id = POPUP_ID1;
            popup.className = POPUP_CN;
            div.appendChild(popup);
        }
        if (!popup2) {
            popup2 = document.createElement("div");
            popup2.id = POPUP_ID2;
            popup2.className = POPUP_CN;
            div.appendChild(popup2);
        }

        var list = cn("ytp-panel-menu").children; // list of main settings items
        var sb = cn("ytp-settings-button"); // settings button - main to click on

        function cn(className) { var cns = document.getElementsByClassName(className); return cns[cns.length - 1]; } // (get by) classname
        function sopen() { const menu = cn("ytp-settings-menu"); return menu && menu.offsetParent !== null; } // whether settings window is open
        function dc(element) { element.dispatchEvent(new Event("click")); } // dispatch click
        function tev(element, show) { element.style.display = show ? "block" : "none"; } // toggle element visibility
        function dcList(regexp) {
            for (var i = 0; i < list.length; i++)
                if (regexp.test(list[i].textContent))
                    return dc(list[i]);
        }
        function seekTo(t) {
            if (div && typeof div.seekTo === "function") {
                div.seekTo(t, true);
            } else if (video) {
                video.currentTime = t;
            }
        }
        function currentTime() { return video ? video.currentTime : div.getCurrentTime(); }
        function showPopup(p, text) {
            p.textContent = text;
            p.style.transition = "none"; // a trick to show it immediately, but hide with fade-out
            p.style.opacity = 1;
            setTimeout(() => {
                p.style.transition = "opacity 0.3s ease-out";
                p.style.opacity = 0;
            }, POPUP_STATIC_SHOWN_FOR);
        }
        function bufferedEnd() {
            if (!video.buffered.length) return null;
            return video.buffered.end(video.buffered.length - 1);
        }
        function atLiveEdge() {
            return bufferedEnd() - video.currentTime < 1;
        }

        if (live && !video.__liveEdgeHooked) {
            video.__liveEdgeHooked = true;
            video.addEventListener("timeupdate", () => { if (video.playbackRate > 1 && atLiveEdge()) video.playbackRate = 1; });
        }

        this.showPopupTop = function(text) { showPopup(popup, text); }
        this.showPopupSide = function(text) { showPopup(popup2, text); }

        this.setQualityByText = function(text) {
            var index = levels.indexOf(text);
            if (index == -1) index = 0; // choose the best if selected isn't present
            div.setPlaybackQualityRange(levels[index]);
            this.showPopupTop(qualityTexts[index]);
        }

        this.shift = function(delta, text) {
            seekTo(currentTime() + delta);
            const right = delta > 0;
            popup2.style.left = right ? "90%" : "10%";
            this.showPopupSide(text);
        }

        //this.isActive = function() { return document.activeElement === div; }
        this.getSpeed = function() { return video ? video.playbackRate : div.getPlaybackRate(); }
        this.setSpeed = function(speed) { if (video) video.playbackRate = speed; else div.setPlaybackRate(speed); } // throws NotSupportedError on range violation
        this.dispatchSettingsButtonClick = function() { dc(sb); }
        this.dispatchSettingsItemClick = function(regexp) { dcList(regexp); }
        this.settingsAreOpen = function() { return sopen(); }
        this.closeSettings = function() { if (this.settingsAreOpen()) this.dispatchSettingsButtonClick(); }
        this.atTheEnd = function() { return div.getPlayerState() == 0; }
        this.restart = function() { video.currentTime = 0; div.playVideo(); video.play(); }
    }

    /***** Bugfix for the occasional ignoring of URL time parameter (video starts from zero) *****/
    // might be called as a part of callback, but I don't want to put it in front of Player declaration
    function parseStartTime() {
        const p = new URLSearchParams(location.search);
        const t = p.get("t") || p.get("start");
        if (!t) return null;

        // supports 1h2m3s, 90s, 123
        let seconds = 0;
        if (/^\d+$/.test(t)) return +t;

        const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (!m) return null;

        seconds =
            (parseInt(m[1] || 0) * 3600) +
            (parseInt(m[2] || 0) * 60) +
            (parseInt(m[3] || 0));

        return seconds || null;
    }

    function updatePlayerTimeFromURL(div) {
        var time = parseStartTime();
        if (time == null) return;
        var videos = div.getElementsByTagName("video");
        if (!videos) return;
        var video = videos[0];
        if (video.currentTime >= time - 0.5) return;
        video.currentTime = time;
    }

    // ChatGPT helped with this: observer waits for a real player (on /watch page) to load, then loads its available quality levels
    function awaitPlayerLoad(callback) {
        function isRealPlayer(div) {
            return div && typeof div.getAvailableQualityLevels === 'function' && div.getAvailableQualityLevels().length > 0;
        }

        const tryInitialize = () => {
            const div = document.getElementById(PLAYER_ID);
            if (isRealPlayer(div)) {
                updatePlayerTimeFromURL(div);
                callback(div);
                return true;
            }
            return false;
        };

        if (tryInitialize()) return;

        // Set up observer to watch for the player appearing
        const observer = new MutationObserver((mutations, obs) => {
            if (tryInitialize()) obs.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function playerLoadedCallback(div) { player = new Player(div); }

    function clickMenu(regexp) {
        player.dispatchSettingsButtonClick();
        if (player.settingsAreOpen()) setTimeout(() => player.dispatchSettingsItemClick(regexp), CONSECUTIVE_CLICK_EMULATION_DELAY);
    }

    // quality selection function: alt+click = 480p, ctrl+click = 720p, shift+click = 1080p. Highest resolution available up to desirable is selected.
    function changeQuality(asc) {
        var desiredQuality = (asc&MOD.SHIFT) ? "hd1080" : (asc&MOD.CTRL) ? "hd720" : (asc&MOD.ALT) ? "large" : -1;
        player.setQualityByText(desiredQuality);
    }

    // TODO maybe move this block to Player too
    function nextSpeedStep(currentSpeed, isIncreasing) {
        if (currentSpeed == SPEEDALTSMALL && !isIncreasing) return 0; // kinda crutchy because allowed values are (1/16...16) + {0}
        if (isIncreasing) return currentSpeed < SPEEDALT ? SPEEDALTSMALL : SPEEDALT;
        return currentSpeed > SPEEDALT ? -SPEEDALT : -SPEEDALTSMALL;
    }

    function newSpeed(currentSpeed, steps) {
        for (var i = 0; i < Math.abs(steps); ++i) {
            try {
                var intermediateSpeed = currentSpeed + nextSpeedStep(currentSpeed, steps > 0);
                player.setSpeed(intermediateSpeed);
                currentSpeed = intermediateSpeed;
            } catch (e) { // ignore the error, return the last successful increment/decrement
                return currentSpeed;
            }
        }
        return currentSpeed;
    }

    // v1.3 simplified to using player API
    // v1.4 now using steps and extended 1/16...16 scale (with error fallbacks for different browsers)
    function changeSpeed(steps) {
        var speed = newSpeed(player.getSpeed(), steps);
        player.showPopupTop(speed + "x");
    }
    function resetSpeed() {
        player.setSpeed(1);
        player.showPopupTop("1x");
    }

    function changeTime(forward, asc) {
        if (!asc || asc&MOD.CTRL) return;
        var delta = TIMESHIFT[asc][0] * (forward ? 1 : -1);
        var text = TIMESHIFT[asc][1];
        player.shift(delta, text);
    }

    function isTypingContext(elem) {
        if (!elem) return false;
        if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") { // Native text inputs
            return !elem.readOnly && !elem.disabled;
        }
        if (elem.isContentEditable) return true; // contenteditable or inside it
        return false;
    }

    // add global hotkeys
    window.addEventListener("keydown", function (event) {
        if (!player) return;
        if (isTypingContext(document.activeElement)) return; // whether writing a comment or searching

        var asc = event.altKey + (event.shiftKey << 1) + (event.ctrlKey << 2);
        var key = event.keyCode;

        switch (key) {
            case UK.LEFT: // left and right with alt/shift for advanced jumps
            case UK.RIGHT: if (asc&MOD.ALT) event.preventDefault(); // comment out after colon sign to restore browser default behavior on alt+arrow
                return changeTime(key == UK.RIGHT, asc);
            case UK.QUALITY: // q for quality
                if (asc) changeQuality(asc);
                else clickMenu(DISPATCH[key]);
                break;
            case UK.SPEED: // s for speed
                if (asc == MOD.ALT) resetSpeed();
                if (!asc) clickMenu(DISPATCH[key]);
                break;
            case UK.SUBTITLES: // x for subtitles
                return !asc && clickMenu(DISPATCH[key]);
            case UK.SPEEDUP:
            case UK.SPEEDDOWN: // + and - for speed. Default +(=) and - are untouched, because in YT they change captions size
                if (asc&MOD.CTRL) return; // do not conflict with default zoom (ctrl plus/minus)
                var shift = (key == UK.SPEEDDOWN ? -1 : 1) * Math.max(1, event.shiftKey * 2 + event.altKey * 4); // any formula you want
                changeSpeed(shift);
                player.closeSettings();
                break;
            //case 68: if(!asc) cn("html5-video-info-panel").classList.toggle("displayNone"); break; // doesn't work (stats for nerds)
            case UK.RESTART: if(!asc && player.atTheEnd()) player.restart(); // replay
        }
    });

    window.addEventListener('yt-navigate-finish', () => {
        awaitPlayerLoad(playerLoadedCallback);
    });

    awaitPlayerLoad(playerLoadedCallback);
})();