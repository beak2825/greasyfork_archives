// ==UserScript==
// @name            YT音量滾輪
// @namespace       https://greasyfork.org/zh-TW/users/4839
// @version         1.2
// @author          wddd
// @license         MIT
// @icon            https://www.youtube.com/favicon.ico
// @description     YouTube用滾輪控制音量，顯示在影片左下角(原生API)Control YouTube video volume by mouse wheel.
// @match           *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/503842/YT%E9%9F%B3%E9%87%8F%E6%BB%BE%E8%BC%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/503842/YT%E9%9F%B3%E9%87%8F%E6%BB%BE%E8%BC%AA.meta.js
// ==/UserScript==

var ytb = {
    inIframe: function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    isEmbed: function() {
        return this.inIframe || window.location.href.includes('youtube.com/embed');
    },
    getPlayerElement: function() {
        if (!this.isEmbed()) {
            var ytd_player = document.getElementsByTagName("ytd-player");
            for (var player of ytd_player) {
                if (player.getPlayer() && player.className.indexOf('preview') == -1) {
                    return player;
                }
            }
        } else {
            return this.getPlayer();
        }
    },
    getVideo: function() {
        return this.getPlayerElement()?.getElementsByTagName("video")[0];
    },
    getPlayer: function() {
        if (!this.isEmbed()) {
            return this.getPlayerElement()?.getPlayer();
        } else {
            return document.getElementsByClassName("html5-video-player")[0];
        }
    },
    ready: function() {
        return this.getPlayer() && this.getVideo();
    }
}

function run() {
    if (!ytb.getPlayer()) {
        // eslint-disable-next-line no-console
        console.log("Player not found (yet).");
        return;
    }

    var timer = 0;

    // detect available wheel event
    var support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
        document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let"s assume that remaining browsers are older Firefox

    ytb.getVideo().addEventListener(support, function (event) {
        var volume = ytb.getPlayer().getVolume();
        var volumeDelta = 5;
        var deltaY = support == "mousewheel" ? event.wheelDelta : (event.deltaY || event.detail);

        // Optimize volume change for touchpad
        if (Math.abs(deltaY) < 5) {
            volumeDelta = Math.max(Math.floor(Math.abs(deltaY)), 1);
        }

        volume += (deltaY > 0 ? -volumeDelta : volumeDelta);

        // Limit the volume between 0 and 100
        volume = Math.max(0, Math.min(100, volume));

        if (volume > 0) {
            ytb.getPlayer().unMute(true);
        }
        ytb.getPlayer().setVolume(volume, true);

        timer = showSlider(timer, volume);

        // Prevent the page to scroll
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
    });
}

function showSlider(timer, volume) {
    if (timer) {
        clearTimeout(timer);
    }

    var sliderBar = appendSlideBar();

    sliderBar.style.display = "block";
    timer = setTimeout(function () {
        sliderBar.style.display = "none";
    }, 100);

    sliderBar.innerText = "Volume: " + volume;

    return timer;
}

function appendSlideBar() {
    var sliderBar = document.getElementById("sliderBar");
    if (!sliderBar) {
        var sliderBarElement = document.createElement("div");
        sliderBarElement.id = "sliderBar";

        ytb.getPlayerElement().getElementsByClassName("html5-video-container")[0].appendChild(sliderBarElement);

        sliderBar = document.getElementById("sliderBar");
        addCss(sliderBar, {
            "width": "150px",
            "height": "1em",
            "position": "absolute",
            "z-index": "9999",
            "bottom": "0px",
            "left": "10%",
            "text-align": "center",
            "color": "#fff",
            "font-size": "26px",
            "opacity": "0.9",
            "background-color": "rgba(0,0,0,0.9)",
        });
    }

    if (!ytb.isEmbed()) {
        addCss(sliderBar, {"top": getSliderBarTopProp() + "px"});
    }

    return sliderBar;
}

function addCss(element, css) {
    for (var cssAttr in css) {
        element.style[cssAttr] = css[cssAttr];
    }
}

function getSliderBarTopProp() {
    var fullScreenTitleHeight = 0;

    var fullScreenTitle = document.getElementsByClassName("ytp-title")[0];
    if (fullScreenTitle && fullScreenTitle.offsetParent) {
        fullScreenTitleHeight = fullScreenTitle.offsetHeight;
    }

    var videoTop = ytb.getVideo().getBoundingClientRect().top;
    var headerBoundingBox =
        (document.getElementById("masthead-positioner") || document.getElementById("masthead-container")).getBoundingClientRect();
    var headerTop = headerBoundingBox.top;
    var headerHeight = headerBoundingBox.height;

    var overlap = (headerHeight + headerTop > 0) ? Math.max(0, headerHeight - videoTop) : 0;

    return Math.max(fullScreenTitleHeight, overlap);
}

/**
 * YouTube use Javascript to navigate between pages. So the script will not work:
 * 1. If the script only includes/matches the sub pages (like the video page www.youtube.com/watch?v=...)
 * 2. And the user navigates to the sub page from a page which is not included/matched by the script
 *
 * In the above scenario, the script will not be executed.
 *
 * To run the script in all cases,
 * 1. Include/match the whole YouTube host
 * 2. Detect Javascript events, and run the script appropriately
 *
 * Details:
 * * https://stackoverflow.com/questions/32275387/recall-tampermonkey-script-when-page-location-changes/32277150#32277150
 * * https://stackoverflow.com/questions/34077641/how-to-detect-page-navigation-on-youtube-and-modify-html-before-page-is-rendered
 * * https://github.com/1c7/Youtube-Auto-Subtitle-Download/blob/master/Youtube-Subtitle-Downloader/Tampermonkey.js#L122-L152
 */

// trigger when navigating to new material design page
window.addEventListener("yt-navigate-finish", function () {
    if (window.location.href.includes("/watch?v=")) {
        run();
    }
});

// trigger when navigating to the old page
window.addEventListener("spfdone", function () {
    if (window.location.href.includes("/watch?v=")) {
        run();
    }
});

// trigger when directly loading the page
window.addEventListener("DOMContentLoaded", function () {
    if (window.location.href.includes("/watch?v=")) {
        run();
    }
});

/**
 * Use MutationObserver to cover all edge cases.
 * https://stackoverflow.com/a/39803618
 *
 * This is to handle the use case where navigation happens but <video> has not been loaded yet.
 * (In YouTube the contents are loaded asynchronously.)
 */
var observer = new MutationObserver(function() {
    if (ytb.ready()) {
        observer.disconnect();
        run();
    }
});

observer.observe(document.body, /* config */ {childList: true, subtree: true});
