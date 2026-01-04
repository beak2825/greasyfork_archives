// ==UserScript==
// @name         Play Youtube playlist in reverse order
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      7.9
// @description  Adds button for loading the previous video in a YT playlist
// @author       Dragosarus
// @match        http://www.youtube.com/*
// @match        https://www.youtube.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404986/Play%20Youtube%20playlist%20in%20reverse%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/404986/Play%20Youtube%20playlist%20in%20reverse%20order.meta.js
// ==/UserScript==

// Cookies (current session):
// pytplir_playPrevious - saves the button state between loads

/* NOTES:
 *    - If the button is not displayed (but the script is running), pause and unpause the video.
 *    - If it still does not appear, reload the page.
 *    - If it *still* does not appear, let me know through Greasy Fork or GitHub.
 *    - If the button is displayed but does not work properly/consistently, increase the value of redirectWhenTimeLeft.
*/

(function() {
    'use strict';
    $(document).ready(function() {
        // Determines when to load the next video.
        // Increase these if the redirect does not work as intended (i.e. fails to override Youtube's redirect),
        // Decreasing these will let you see more of the video before it redirects, but the redirect might stop working (consistently)
        const redirectWhenTimeLeft = 0.3; // seconds before the end of the video
        const redirectWhenTimeLeft_miniplayer = 0.6;
        const skipUnplayable = true; // Skip videos that have not been premiered yet/upcoming livestreams

        const activeColor = "rgb(64,166,255)";
        const inactiveColor = "rgb(144,144,144)";
        const circleColor = "rgb(144,144,144)";
        const ttBGColor = "rgb(100,100,100)";
        const ttTextColor = "rgb(237,240,243)";

        // Logs debug messages to the console.
        const debug = false;

        const selectors = {
            "buttonLocation":            "div[id=playlist-action-menu] > .ytd-playlist-panel-renderer > div[id=top-level-buttons-computed]",
            "content":                   "#content",
            "player":                    ".html5-main-video",
            "miniplayerDiv":             "div.miniplayer",
            "playlistButtons":           ".ytd-watch-flexy #playlist #playlist-action-menu",
            "playlistButtonsMiniplayer": "ytd-playlist-panel-renderer.ytd-miniplayer #playlist-action-menu",
            "playlistCurrentVideo":      "ytd-playlist-panel-video-renderer[selected]",
            "playlistVideos":            "#publisher-container span.index-message",
            "playlistVideosMiniplayer":  "yt-formatted-string[id=owner-name] :nth-child(3)",
            "shuffleButtonActive":       "path[d='M18.51,13.29l4.21,4.21l-4.21,4.21l-1.41-1.41l1.8-1.8c-2.95-0.03-5.73-1.32-7.66-3.55l1.51-1.31 c1.54,1.79,3.77,2.82,6.13,2.85l-1.79-1.79L18.51,13.29z M18.88,7.51l-1.78,1.78l1.41,1.41l4.21-4.21l-4.21-4.21l-1.41,1.41l1.8,1.8 c-3.72,0.04-7.12,2.07-8.9,5.34l-0.73,1.34C7.81,14.85,5.03,17,2,17v2c3.76,0,7.21-2.55,9.01-5.85l0.73-1.34 C13.17,9.19,15.9,7.55,18.88,7.51z M8.21,10.31l1.5-1.32C7.77,6.77,4.95,5,2,5v2C4.38,7,6.64,8.53,8.21,10.31z']",
            "shuffleButtonInactive":     "path[d='M18.15,13.65l3.85,3.85l-3.85,3.85l-0.71-0.71L20.09,18H19c-2.84,0-5.53-1.23-7.39-3.38l0.76-0.65 C14.03,15.89,16.45,17,19,17h1.09l-2.65-2.65L18.15,13.65z M19,7h1.09l-2.65,2.65l0.71,0.71l3.85-3.85l-3.85-3.85l-0.71,0.71 L20.09,6H19c-3.58,0-6.86,1.95-8.57,5.09l-0.73,1.34C8.16,15.25,5.21,17,2,17v1c3.58,0,6.86-1.95,8.57-5.09l0.73-1.34 C12.84,8.75,15.79,7,19,7z M8.59,9.98l0.75-0.66C7.49,7.21,4.81,6,2,6v1C4.52,7,6.92,8.09,8.59,9.98z']",
            "shuffleButtonLegacy":       "path[d='M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z']",
            "timestamp":                 "span.ytd-thumbnail-overlay-time-status-renderer",
            "videoPlayer":               ".html5-video-player"
        }

        const ytdApp = $("ytd-app")[0];

        let player;
        let playPrevious;
        let redirectFlag = false;
        let shuffle;
        let miniplayerActive = false;
        let miniplayerFlag = false; // keep track of switches between miniplayer and normal mode
        let playerListenersAdded = false;

        // create button
        const svgNS = "http://www.w3.org/2000/svg";
        const btn_div = document.createElement("div");
        const bg_circle = document.createElementNS(svgNS, "circle");
        const bg_circle_anim = document.createElementNS(svgNS, "animate");
        const arrow_up = document.createElementNS(svgNS, "polygon");
        const arrow_down = document.createElementNS(svgNS, "polygon");
        const btn_svg = document.createElementNS(svgNS, "svg");
        const tt_svg = document.createElementNS(svgNS, "svg");
        const tt_svg_fadein = document.createElementNS(svgNS, "animate");
        const tt_svg_fadeout = document.createElementNS(svgNS, "animate");
        const tt_rect = document.createElementNS(svgNS, "rect");
        const tt_text = document.createElementNS(svgNS, "text");
        const tt_div = document.createElement("div");

        setAttributes(bg_circle_anim, [["attributeName", "fill-opacity"],
                                       ["values", "0;0.1;0.2;0.1;0.0"],
                                       ["dur", "0.3s"],
                                       ["restart", "always"],
                                       ["repeatCount", "1"],
                                       ["begin", "indefinite"],
                                       ["id", "pytplir_bg_circle_anim"]]);
        setAttributes(bg_circle, [["cx", "20"],
                                  ["cy", "20"],
                                  ["r", "20"],
                                  ["fill", circleColor],
                                  ["fill-opacity", "0"]]);
        setAttributes(arrow_up, [["points", "17,19 17,17 13,17 20,11 27,17 23,17 23,19"],
                                 ["id", "pytplir_arrow_up"]]);
        setAttributes(arrow_down, [["points", "17,21 17,23 13,23 20,29 27,23 23,23 23,21"],
                                   ["id", "pytplir_arrow_down"]]);
        setAttributes(btn_svg, [["xmlns", svgNS],
                                 ["viewbox", "0 0 40 40"],
                                 ["width", "40"],
                                 ["height", "40"],
                                 ["style", "cursor: pointer; margin-left: 8px;"],
                                 ["id", "pytplir_btn"]]);
        setAttributes(tt_rect, [["x", "0"],
                                ["y", "0"],
                                ["rx", "2"],
                                ["ry", "2"],
                                ["width", "110"],
                                ["height", "34"],
                                ["fill", ttBGColor],
                                ["fill-opacity", "0.9"]]);
        setAttributes(tt_text, [["x", "8"],
                                ["y", "22"],
                                ["font-family", "Roboto, Noto, sans-serif"],
                                ["font-size", "13px"],
                                ["fill", ttTextColor],
                                ["style", "user-select:none;"]]);
        setAttributes(tt_svg_fadein, [["attributeType", "CSS"],
                                      ["attributeName", "opacity"],
                                      ["values", "0;1"],
                                      ["dur", "0.1s"],
                                      ["restart", "always"],
                                      ["repeatCount", "1"],
                                      ["begin", "indefinite"],
                                      ["id", "pytplir_tt_fadein"],
                                      ["fill", "freeze"]]);
        setAttributes(tt_svg_fadeout, [["attributeType", "CSS"],
                                       ["attributeName", "opacity"],
                                       ["values", "1;0"],
                                       ["dur", "0.1s"],
                                       ["restart", "always"],
                                       ["repeatCount", "1"],
                                       ["begin", "indefinite"],
                                       ["id", "pytplir_tt_fadeout"],
                                       ["fill", "freeze"]]);
        const tt_svg_offset = "position:absolute; top:13px; left:-32px; z-index:100; opacity:0.0;";
        setAttributes(tt_svg, [["viewbox", "0 0 100 34"],
                               ["xmlns", "http://www.w3.org/2000/svg"],
                               ["width", "100"],
                               ["height", "34"],
                               ["style", "padding-left: 10px; fill:" + ttBGColor + "; " + tt_svg_offset],
                               ["id", "pytplir_tt"]]);
        setAttributes(tt_div, [["style", "position:relative; width:0; height:0;"]]);
        setAttributes(btn_div, [["id", "pytplir_div"]]);
        tt_text.innerHTML = "Autoplay order";
        bg_circle.appendChild(bg_circle_anim);
        appendChildren(btn_svg, [bg_circle, arrow_up, arrow_down]);
        appendChildren(tt_svg, [tt_rect, tt_text, tt_svg_fadein, tt_svg_fadeout]);
        tt_div.appendChild(tt_svg);
        appendChildren(btn_div, [btn_svg, tt_div]);
        $(btn_svg).on("click", onButtonClick);
        $(btn_svg).on("click", function(){$(this).parent().find("#pytplir_bg_circle_anim")[0].beginElement();});
        $(btn_svg).on("mouseenter", function(){$(this).parent().find("#pytplir_tt_fadein")[0].beginElement();});
        $(btn_svg).on("mouseleave", function(){$(this).parent().find("#pytplir_tt_fadeout")[0].beginElement();});

        init();

        function setAttributes(node, attributeValuePairs) { // [["id", "example"], ["width","20"], ...]
            for (let attVal of attributeValuePairs){
                node.setAttribute(attVal[0], attVal[1]);
            }
        }

        function appendChildren(node, childList) {
            for (let child of childList) {
                node.appendChild(child);
            }
        }

        function init() {
            // the button needs to be re-added whenever the playlist is updated (e.g when a video is loaded or removed)
            function observerCallback(mutationList, observer) {
                debugLog("Observer triggered!")
                start();
            }
            const playlistObserver = new MutationObserver(observerCallback);
            const observerOptions = {subtree:true, childList:true, characterData:true};
            initObserver(playlistObserver, observerOptions);
            playPrevious = getCookie("pytplir_playPrevious");
            if (playPrevious === "") { // cookie has not been set yet
                playPrevious = false; // inital state
                setCookie("pytplir_playPrevious", playPrevious);
            }

            start();
        }

        function initObserver(observer, options) {
            try {
                observer.observe($(selectors.playlistVideos)[0], options);
                observer.observe($(selectors.playlistVideosMiniplayer)[0], options);
            } catch (e) {
                setTimeout(function(){initObserver(observer)}, 100);
            }
        }

        function onButtonClick() { // toggle
            playPrevious = !playPrevious;
            setCookie("pytplir_playPrevious", playPrevious);
            updateButtonState();
        }

        function addButton() { // Add button(s)
            debugLog("addButton start")
            withQuery(selectors.buttonLocation, "*", function(res) {
                res.each(function() {
                    if (!$(this).find("#pytplir_div").length) {
                        this.appendChild($(btn_div).clone(true)[0]);
                        updateButtonState();
                        debugLog("button added");
                    }
                });
            });
            debugLog("addButton finish")
        }

        function updateButtonState() {
            if (playPrevious) { // play previous video
                $("polygon[id=pytplir_arrow_up]").each(function() {
                    this.setAttribute("style", "fill:" + activeColor);
                });
                $("polygon[id=pytplir_arrow_down]").each(function() {
                    this.setAttribute("style", "fill:" + inactiveColor);
                });
            } else { // play next video
                $("polygon[id=pytplir_arrow_up]").each(function() {
                    this.setAttribute("style", "fill:" + inactiveColor);
                });
                $("polygon[id=pytplir_arrow_down]").each(function() {
                    this.setAttribute("style", "fill:" + activeColor);
                });
            }
            miniplayerActive = isMiniplayerActive();
            let ctx = miniplayerActive ? selectors.miniplayerDiv : selectors.content;
            $(ctx + " #pytplir_btn")[0].setAttribute("activated", playPrevious);
            debugLog($(ctx + " #pytplir_btn"));
        }

        function start() { // Add button(s) and event listeners
            addButton();
            debugLog("playerListenersAdded = " + playerListenersAdded);
            if (!playerListenersAdded) {
                withQuery(selectors.player, ":visible", function(res) {
                    player = res[0];
                    player.addEventListener("timeupdate", checkTime);
                    player.addEventListener("play", addButton); // ensure button is added
                    playerListenersAdded = true;
                });
            }
        }

        function withQuery(query, filter="*", onSuccess = function(r){}) {
            let res;
            if (filter == "*") {
                res = $(query);
            } else {
                res = $(query).filter(filter);
            }
            if (res.length) { // >= 1 result
                onSuccess(res);
                return res;
            } else { // not loaded yet => retry
                setTimeout(function(){withQuery(query, filter, onSuccess)});
            }
        }

        function isMiniplayerActive() {
            // Youtube seems to change this quite often, and due to A/B testing all of them need to be checked
            let miniplayer_attributes = ["miniplayer-is-active", "miniplayer-active_", "miniplayer-active"];
            miniplayerActive = false;
            for (let attr of miniplayer_attributes) {
                miniplayerActive ||= ytdApp.hasAttribute(attr);
            }
            return miniplayerActive;
        }

        function checkTime() {
            let miniplayerActive = isMiniplayerActive();
            let context = miniplayerActive ? selectors.miniplayerDiv : selectors.content;
            let buttonSelector = context + " " + selectors.buttonLocation + " #pytplir_div";
            let noButton = !$(buttonSelector).length;
            let playlistHeaderQuery = miniplayerActive ? $(selectors.playlistVideosMiniplayer).parent() : $(selectors.playlistVideos).parent();
            let playlistVisible = playlistHeaderQuery.length && playlistHeaderQuery.is(":visible");

            // exit early when not watching a playlist
            if (!playlistVisible) {return;} // button not loaded
            else if (noButton) { // button was removed
                debugLog("failsafe: adding button");
                addButton();
            }

            debugLog("checkTime: miniplayer: " + miniplayerActive +
                     ", button == " + !noButton);

            let timeLeft = player.duration - player.currentTime;
            let videoPlayer = $(selectors.videoPlayer)[0];

            let redirectTime;
            let shuffleContext;
            if (miniplayerActive) {
                redirectTime = redirectWhenTimeLeft_miniplayer;
                shuffleContext = selectors.playlistButtonsMiniplayer;
            } else {
                redirectTime = redirectWhenTimeLeft;
                shuffleContext = selectors.playlistButtons;
            }

            if (!shuffle || (miniplayerActive != miniplayerFlag)) { // wysiwyg
                shuffle = $(shuffleContext + " " + selectors.shuffleButtonActive).parents("button[aria-pressed]");
                if (!shuffle.length) { // shuffle not activated or new UI has not been pushed to the user yet
                    shuffle = $(shuffleContext + " " + selectors.shuffleButtonInactive).parents("button[aria-pressed]");
                    if (!shuffle.length) { // new UI not pushed to user
                        shuffle = $(selectors.shuffleButtonLegacy).filter(":visible").parents("button[aria-pressed]");
                    }
                }
                shuffle = shuffle[0];
                miniplayerFlag = miniplayerActive;
            }
            try {videoPlayer.classList.contains("ad-showing");} // ensure it will work below
            catch (TypeError) { // video player undefined
            	return;
            }

            let shuffleEnabled;
            try {
                shuffleEnabled = strToBool(shuffle.attributes["aria-pressed"].nodeValue);
            } catch (TypeError) { // e.g. when using Queues
                shuffleEnabled = false;
            }
            if (timeLeft < redirectTime && !redirectFlag && playPrevious && !shuffleEnabled && !player.hasAttribute("loop")
                    && !videoPlayer.classList.contains("ad-showing")) {
                // attempt to prevent the default redirect from triggering
                player.pause();
                player.currentTime -= 2;

                if (getVidNum()[0] !== "1") {
                    redirectFlag = true;
                    redirect();
                    setTimeout(function() {redirectFlag = false;}, 1000);
                }
            }
        }

        function getVidNum() { // returns string array [current, total], e.g "32 / 152" => ["32", "152"]
            let vidNum;
            if (ytdApp.hasAttribute("miniplayer-active") || ytdApp.hasAttribute("miniplayer-active_")) {
                vidNum = $(selectors.playlistVideosMiniplayer);
            } else {
                vidNum = $(selectors.playlistVideos);
            }
            // the desired element is hidden; to distinguish from
            // other hidden elements, check parent's visibility
            vidNum = vidNum.filter(function(){
                return $(this).parent().is(":visible");
            })[0].innerText;

            return vidNum.split(" / ");
        }

        function redirect() {
            let previousURL = getPreviousURL();
            if (previousURL) {
                previousURL.click();
            }
        }

        function getPreviousURL(){ // returns <a> element
            let elem;
            if (ytdApp.hasAttribute("miniplayer-active") || ytdApp.hasAttribute("miniplayer-active_")) { // avoid being forced out of miniplayer mode on video load
                elem = $(selectors.miniplayerDiv).find(selectors.playlistCurrentVideo).prev();
            } else {
                elem = $(selectors.content).find(selectors.playlistCurrentVideo).prev();
            }

            let ts;
            if (skipUnplayable) {
                ts = $(elem).find(selectors.timestamp);
                if (ts.length) {ts = ts[0].innerText; }
            }
            
            while (!elem.find("#unplayableText").prop("hidden") ||
                   (skipUnplayable && typeof(ts) == "string" && !ts.includes(":"))) { // while an unplayable (e.g. private) video is selected
                elem = elem.prev();
                if (!elem.length) return null; // first video in playlist
                if (skipUnplayable) {
                    ts = $(elem).find(selectors.timestamp);
                    if (ts.length) { ts = ts[0].innerText; }
                }
            }
            return elem.children()[0];
        }

        function strToBool(str) {
            return str.toLowerCase() == "true";
        }

        function debugLog(...args) {
            if (debug) {
                args.unshift("pytplir:");
                console.log.apply(this, args);
            }
        }

        // adapted from https://www.w3schools.com/js/js_cookies.asp
        function setCookie(cname, cvalue) {
            document.cookie = cname + "=" + cvalue + ";sameSite=lax;path=www.youtube.com/watch";
        }

        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    let x = c.substring(name.length, c.length);
                    return strToBool(x);
                }
            }
            return "";
        }
    });
})();
/*eslint-env jquery*/ // stop eslint from showing "'$' is not defined" warnings
