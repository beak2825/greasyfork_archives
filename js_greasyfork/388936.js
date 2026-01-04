// ==UserScript==
// @name         YouTube touch skip with two fingers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Youtube skip video in seconds by using two fingers
// @author       Brunkage
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388936/YouTube%20touch%20skip%20with%20two%20fingers.user.js
// @updateURL https://update.greasyfork.org/scripts/388936/YouTube%20touch%20skip%20with%20two%20fingers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window===window.top) {
        waitForSelector("ytd-player", (container) => {

            var started = false;
            var startPos = null;
            var displayEle = null;
            var stepsPrPx = 20;
            var moved = 0;

            container.addEventListener("touchstart", (evt) => {
                var fingerAmount = evt.touches.length;

                if (!started && fingerAmount === 2) {
                    started = true;
                    startPos = getTouchMin(evt.touches);
                    moved = movedInSecs(evt.touches);
                    preventAndStop(evt);
                    addDisplay(container);
                    updateDisplay(getTouchAvg(evt.touches), moved);
                }
            });

            document.body.addEventListener("touchmove", (evt) => {
                if (started) {
                    preventAndStop(evt);
                    moved = movedInSecs(evt.touches);
                    updateDisplay(getTouchAvg(evt.touches), moved);
                }
            });

            document.body.addEventListener("touchend", (evt) => {
                var fingerAmount = evt.touches.length;

                if (started && fingerAmount === 0) {
                    getYTPlayer((player) => {
                        player.seekBy(moved);
                    });
                    removeDisplay();
                    started = false;
                    startPos = null;
                    preventAndStop(evt);
                }
            });

            function movedInSecs(touches) {
                return Math.floor(getMoved(getTouchMin(touches)).x / stepsPrPx);
            }

            function getMoved(endPos) {
                return {
                    x: endPos.x - startPos.x,
                    y: endPos.y - startPos.y
                }
            }

            function getTouchMin(touches) {
                var min = {
                    x: Infinity,
                    y: Infinity
                }

                for (let touch of touches) {
                    if (min.x > touch.pageX) {
                        min.x = Math.floor(touch.pageX);
                    }
                    if (min.y > touch.pageY) {
                        min.y = Math.floor(touch.pageY);
                    }
                }

                return min;
            }

            function getTouchAvg(touches) {
                var avg = {
                    x: 0,
                    y: 0
                }

                for (let touch of touches) {
                    avg.x += touch.pageX;
                    avg.y += touch.pageY;
                }

                avg.x = avg.x / touches.length;
                avg.y = avg.y / touches.length;

                return avg;
            }

            function preventAndStop(evt) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                }

                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
            }

            function removeDisplay() {
                document.body.removeChild(displayEle);
            }

            function updateDisplay(coords, seekTo) {
                displayEle.style.top = coords.y + "px";
                displayEle.style.left = coords.x + "px";
                displayEle.getElementsByTagName("skip-display-seek-to")[0].innerText = seekTo + "s";
            }

            function addDisplay() {
                displayEle = document.createElement("skip-display");
                displayEle.style.transform = "translate(-120%, -120%)";
                displayEle.style.display = "block";
                displayEle.style.pointerEvents = "none";
                displayEle.style.position = "fixed"
                displayEle.style.width = "100px";
                displayEle.style.height = "100px";

                var bg = document.createElement("skip-display-bg");
                bg.style.width = "100%";
                bg.style.position = "absolute";
                bg.style.left = "0";
                bg.style.height = "100%";
                bg.style.display = "block";
                bg.style.background = "black";
                bg.style.borderRadius = "50%";
                bg.style.filter = "blur(42px)";

                var seekTo = document.createElement("skip-display-seek-to");
                seekTo.style.transform = "translateY(-50%)";
                seekTo.style.textAlign = "center";
                seekTo.style.display = "block";
                seekTo.style.position = "absolute";
                seekTo.style.width = "100%";
                seekTo.style.top = "50%";
                seekTo.style.fontSize = "42px";
                seekTo.style.color = "white"

                displayEle.appendChild(bg);
                displayEle.appendChild(seekTo);
                document.body.appendChild(displayEle);
            }
        });
    }


    function waitForSelector(selector, onPresent) {
        var result = document.querySelector(selector);
        if (result) {
            onPresent(result);
        }
        else {
            setTimeout(() => {
                waitForSelector(selector, onPresent);
            }, 80);
        }
    }

    function getYTPlayer(onDone) {
        document.querySelector("ytd-player").getPlayerPromise().then(function(player) { onDone(player) });
    }
})();