// ==UserScript==
// @name         YouTube hotkeys
// @namespace    http://tampermonkey.net/
// @version      1.3.2
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
 * Happy 20 years of YouTube!
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
 * Hotkeys are:
 * numpad + and - for +-0.25x speed (shift = +-0.5, alt = +-1);
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

    // speed/quality popup copycat (at the middle top of the player)
    const POPUP_ID = "customPopup";
    GM_addStyle(`
div#`+POPUP_ID+` {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translatex(-50%);
  z-index: 10;
  padding: 10px 12px;
  border-radius: 3px;
  font-size: 18px;
  color: white;
  background-color: #000a;
  pointer-events: none;
  opacity: 0;
}
    `);

    const PLAYER_ID = "movie_player";
    const REGEXP_R = /Повтор|Повторити|Replay|Nochmal|Revoir|Ver de nuevo/i;
    const DISPATCH = {
        "81": /Качество|Якість|Quality|Qualität|Qualité|Calidad/i, // q: quality regexp
        "83": /Скорость|Швидкість|Speed|Wiedergabegeschwindigkeit|Vitesse de lecture|Velocidad de reproducción/i, // s: speed regexp
        "88": /Субтитры|Субтитри|Subtitles|Untertitel|Sous-titres|Subtítulos/i // x: subtitles regexp
    }

    const CONSECUTIVE_CLICK_EMULATION_DELAY = 100; // milliseconds delay for YouTube elements to pop up (some hotkeys call the player menus)
    const SPEEDMIN = 0.25;
    const SPEEDMAX = 2;
    const SPEEDALT = 0.25;
    const TIMESHIFT = [
        [undefined, "error"],
        [55 , " 1 minute"], // account for 5 seconds already included. Spaces in text are en spaces (U+2002)
        [25 , "30 seconds"],
        [295, " 5 minutes"]
    ];

    var player;

    function Player(div) {
        const QUALITY = {
            large: "480p",
            medium: "360p",
            small: "240p",
            tiny: "144p",
            auto: "auto"
        }
        const POPUP_STATIC_SHOWN_FOR = 300;
        const TIME_SHIFT_SHOWN_FOR = 700;
        const ALIGN_TOP = h => h/2 + 5; // time shift bubble positioning functions depending on player scroll width and height
        const ALIGN_LEFT_LEFT = w => w * 0.1 - 15; // reverse ingeneered (linearly interpolated)
        const ALIGN_LEFT_RIGHT = w => w * 0.8 - 30;

        var levels = div.getAvailableQualityLevels(); // array of quality strings inside YT player: see QUALITY keys
        var qualityTexts = levels.map(x => { // corresponding array of displayed "selected quality" strings
            var m = x.match(/\d+/);
            return m ? (m[0] + "p") : (QUALITY[x] || "null");
        });

        // copycat of YT default speed/volume top player popup. Feedbacks change of speed/quality.
        var popup = false;
        var popupHidingTimeout;
        for (const child of div.children) // search for it to prevent duplication
            if (child.id === POPUP_ID) {
                popup = child;
                break;
            }
        if (!popup) {
            popup = document.createElement("div");
            popup.id = POPUP_ID;
            div.appendChild(popup);
        }

        var list = cn("ytp-panel-menu").children; // list of main settings items
        var sb = cn("ytp-settings-button"); // settings button - main to click on
        var rebtn = cn("ytp-play-button"); // replay button
        var jumpBubbleHolder = cn("ytp-doubletap-ui-legacy");
        var jumpBubble = cn("ytp-doubletap-static-circle");
        var jumpText = cn("ytp-doubletap-tooltip-label");

        function cn(className) { var cns = document.getElementsByClassName(className); return cns[cns.length - 1]; } // (get by) classname
        function sopen() { return cn("ytp-settings-menu").style.display != "none"; } // whether settings window is open
        function dc(element) { element.dispatchEvent(new Event("click")); } // dispatch click
        function tev(element, show) { element.style.display = show ? "block" : "none"; } // toggle element visibility
        function dcList(regexp) {
            for (var i = 0; i < list.length; i++)
                if (regexp.test(list[i].textContent))
                    return dc(list[i]);
        }

        this.showPopup = function(text) {
            popup.textContent = text;
            popup.style.transition = "none"; // a trick to show it immediately, but hide with fade-out
            popup.style.opacity = 1;
            setTimeout(() => {
                popup.style.transition = "opacity 0.3s ease-out";
                popup.style.opacity = 0;
            }, POPUP_STATIC_SHOWN_FOR);
        }

        this.setQualityByText = function(text) {
            var index = levels.indexOf(text);
            if (index == -1) index = 0; // choose the best if selected isn't present
            div.setPlaybackQualityRange(levels[index]);
            this.showPopup(qualityTexts[index]);
        }

        this.shift = function(delta, text) {
            div.seekTo(div.getCurrentTime() + delta, true);
            const right = delta > 0;
            const w = div.scrollWidth, h = div.scrollHeight;
            tev(jumpBubbleHolder, true);
            jumpBubbleHolder.setAttribute("data-side", right ? "forward" : "back");
            jumpBubble.style.top = ALIGN_TOP(h) + "px"; // for some reason, is set on YT in absolute numbers
            jumpBubble.style.left = (right ? ALIGN_LEFT_RIGHT(w) : ALIGN_LEFT_LEFT(w)) + "px";
            jumpText.textContent = text;
            clearTimeout(popupHidingTimeout);
            popupHidingTimeout = setTimeout(() => tev(jumpBubbleHolder, false), TIME_SHIFT_SHOWN_FOR);
        }

        this.isActive = function() { return document.activeElement === div; }
        this.getSpeed = function() { return div.getPlaybackRate(); }
        this.setSpeed = function(speed) { div.setPlaybackRate(speed); }
        this.dispatchReplayButtonClick = function() { if (REGEXP_R.test(rebtn.title)) dc(rebtn); }
        this.dispatchSettingsButtonClick = function() { dc(sb); }
        this.dispatchSettingsItemClick = function(regexp) { dcList(regexp); }
        this.settingsAreOpen = function() { return sopen(); }
        this.closeSettings = function() { if (this.settingsAreOpen()) this.dispatchSettingsButtonClick(); }

        return this;
    }

    // floor1 and ceil1 are internal for round1 - round playback speed to nearest multiplier of SPEEDALT
    function floor1(x, step) { return Math.floor(x / step) * step; }
    function ceil1(x, step) { return Math.ceil (x / step) * step; }
    function round1(x, delta) { return (delta > 0) ? Math.min(SPEEDMAX, floor1(x + delta, SPEEDALT)) : Math.max(SPEEDMIN, ceil1(x + delta, SPEEDALT)); }

    // ChatGPT helped with this: observer waits for a real player (on /watch page) to load, then loads its available quality levels
    function awaitPlayerLoad(callback) {
        function isRealPlayer(div) {
            return div && typeof div.getAvailableQualityLevels === 'function' && div.getAvailableQualityLevels().length > 0;
        }

        const tryInitialize = () => {
            const div = document.getElementById(PLAYER_ID);
            if (isRealPlayer(div)) {
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
        var desiredQuality = (asc&2) ? "hd1080" : (asc&4) ? "hd720" : (asc&1) ? "large" : -1;
        player.setQualityByText(desiredQuality);
    }

    // v1.3 simplified to using player API
    function changeSpeed(shift) {
        var oldSpeed = player.getSpeed();
        var newSpeed = round1(oldSpeed, shift);
        player.setSpeed(newSpeed);
        player.showPopup(newSpeed + "x");
    }

    function changeTime(forward, asc) {
        if (!asc || asc&4) return;
        var delta = TIMESHIFT[asc][0] * (forward ? 1 : -1);
        var text = TIMESHIFT[asc][1];
        console.log(delta);
        console.log(text);
        player.shift(delta, text);
    }

    // add global hotkeys
    window.addEventListener("keydown", function (event) {
        if (!player) return;
        if (document.activeElement.id == "contenteditable-root" ||
            document.activeElement.id == "search") return; // whether writing a comment or searching

        var asc = event.altKey + (event.shiftKey << 1) + (event.ctrlKey << 2);
        var key = event.keyCode;

        switch (key) {
            case 37: // left and right with alt/ctrl/shift for advanced jumps
            case 39: if (asc&1) event.preventDefault(); // comment out after colon sign to restore browser default behavior on alt+arrow
                return changeTime(key == 39, asc);
            case 81: // q for quality
                if (asc) changeQuality(asc);
            case 83: // s for speed
            case 88: // x for subtitles
                return !asc && clickMenu(DISPATCH[key]);
            case 107:
            case 109: // + and - for speed. Default +(=) and - are untouched, because in YT they change captions size
                if (asc&4) return; // do not conflict with default zoom (ctrl plus/minus)
                var shift = (key == 109 ? -SPEEDALT : SPEEDALT) * Math.max(1, event.shiftKey * 2 + event.altKey * 4); // any formula you want
                changeSpeed(shift);
                player.closeSettings();
                break;
            //case 68: if(!acs) cn("html5-video-info-panel").classList.toggle("displayNone"); break; // doesn't work (stats for nerds)
            case 82: if(!asc && player.isActive()) player.dispatchReplayButtonClick(); // replay (sometimes works)
        }
    });

    window.addEventListener('yt-navigate-finish', () => {
        awaitPlayerLoad(playerLoadedCallback);
    });

    awaitPlayerLoad(playerLoadedCallback);
})();