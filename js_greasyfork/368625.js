// ==UserScript==
// @name            Ulepszenia dla domyślnego odtwarzacza wideo HTML5
// @name:en         Video Player Enhancements
// @namespace       http://tampermonkey.net/
// @version         0.4.6
// @description     Skrypt zawiera kilka ulepszeń dla domyślnego odtwarzacza HTML5.
// @description:en  Script contains some enhancements for default HTML5 player.
// @author          DaveIt
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/368625/Ulepszenia%20dla%20domy%C5%9Blnego%20odtwarzacza%20wideo%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/368625/Ulepszenia%20dla%20domy%C5%9Blnego%20odtwarzacza%20wideo%20HTML5.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var settings = {
        autoGoto: false,
        muted: false,
        volume: 0,
        fullScreen: false,
        active: false,
        doubleClicked: false,
    };

    var VIDEO = document.getElementsByTagName('meta')[0];
    if (VIDEO && VIDEO.name == 'viewport' && VIDEO.content == 'width=device-width') {
        var mouseHideTimeout = 4;

        var vid = document.getElementsByTagName('video')[0];
        var vol = 0,
            mov = 0,
            url = document.location.href,
            param = '?goto=';
        var n;
        if (vid) {
            window.addEventListener('keydown', function(event) {
                switch (event.keyCode) {
                    case 16: // Shift
                        vid.currentTime += 70;
                    break;

                    case 37: // Left
                        vid.currentTime -= 5;
                        break;

                    case 38: // Up
                        if (vid.volume <= 0.95) vid.volume += 0.05;
                        else vid.volume = 1;
                        break;

                    case 39: // Right
                        vid.currentTime += 5;
                        break;

                    case 40: // Down
                        if (vid.volume >= 0.05) vid.volume -= 0.05;
                        else vid.volume = 0;
                        break;

                    case 48: // 0-10
                    case 49:
                    case 50:
                    case 51:
                    case 52:
                    case 53:
                    case 54:
                    case 55:
                    case 56:
                    case 57:
                        vid.currentTime = Math.floor(vid.duration * (9 - (57 - event.keyCode)) / 10); // Sorry, I'm not good at math ;)
                        break;

                    case 70: // F
                        makeFullScreen(vid);
                        break;

                    case 77: // M
                        if (vid.volume > 0) {
                            vol = vid.volume;
                            vid.volume = 0;
                        } else vid.volume = vol;
                        break;

                    case 82:
                        if (vid.loop) vid.loop = false;
                        else vid.loop = true;
                        break;
                }
            }, false);

            if (mov < mouseHideTimeout) {
                setInterval(function() {
                    cursorTimer();
                }, 1000);
            }

            var cursorTimer = function() {
                if (mov < mouseHideTimeout) mov += 1;
                if (mov == mouseHideTimeout) {
                    vid.style.cursor = 'none';
                }
            };

            vid.onmousemove = function(e) {
                mov = 0;
                vid.style.cursor = 'auto';
            };

            vid.ondblclick = function(e) {
                settings.doubleClicked = true;
                makeFullScreen(vid);
            };

            vid.onmousewheel = function(e) {
                if (e.wheelDelta / 120 > 0) {
                    if (vid.volume <= 0.95) vid.volume += 0.05;
                    else vid.volume = 1;
                } else {
                    if (vid.volume >= 0.05) vid.volume -= 0.05;
                    else vid.volume = 0;
                }
            };

            if (settings.autoGoto) { // experimental option (in bad condition ;p)
                if (url.indexOf("?") != -1 && url.indexOf("?goto=") == -1) param = '&goto=';
                n = url.indexOf(param);
                switch (n) {
                    case -1:
                        break;
                    default:
                        vid.currentTime = url.substr(n + 6);
                        url = url.substr(0, n);
                        break;
                }

                setInterval(() => {
                    window.history.pushState('', '', url + param + Math.floor(vid.currentTime));
                }, 1000);
            }
        }
    }

    function makeFullScreen(divObj) {
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (divObj.requestFullscreen) {
                divObj.requestFullscreen();
            } else if (divObj.msRequestFullscreen) {
                divObj.msRequestFullscreen();
            } else if (divObj.mozRequestFullScreen) {
                divObj.mozRequestFullScreen();
            } else if (divObj.webkitRequestFullscreen) {
                divObj.webkitRequestFullscreen();
            } else {
                console.log("Fullscreen API is not supported");
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

        }
    }
})();