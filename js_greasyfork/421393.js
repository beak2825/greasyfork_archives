// ==UserScript==
// @name         Youtube Extended Controls
// @namespace    https://greasyfork.org/de/scripts/421393-youtube-extended-controls
// @version      0.3.1
// @description  Adding keyboard shortcuts for cycling playback speed setting and looping a specific time span
// @author       Guitar Hero
// @grant        none
// @include https://youtube.com/watch*
// @include https://www.youtube.com/watch*

// @downloadURL https://update.greasyfork.org/scripts/421393/Youtube%20Extended%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/421393/Youtube%20Extended%20Controls.meta.js
// ==/UserScript==

(function() {

    control = {
        messageBox: {
            lastMessage: null,
            show: function(message) {
                control.messageBox.lastMessage = message;
                document.querySelector(".ytp-bezel-text").innerText = message;
                document.querySelector(".ytp-bezel-text").parentNode.parentNode.style.display = "";
                document.querySelector(".ytp-bezel-text").parentNode.parentNode.classList.remove("ytp-bezel-text-hide");
                setTimeout(control.messageBox.hide, 1000, message);
            },
            hide: function(messageToHide) {
                console.log("message to hide: " + messageToHide);
                if (messageToHide != control.messageBox.lastMessage) {
                    console.log("but last message is: " + control.messageBox.lastMessage);
                    return;
                }
                console.log("will hide last message: " + control.messageBox.lastMessage);
                document.querySelector(".ytp-bezel-text").innerText = "";
                document.querySelector(".ytp-bezel-text").parentNode.parentNode.style.display = "none";
            }
        },
        setup: {
            init: function() {
                console.log("init");
                control.setup.enableLoopButton();
                control.setup.enableSpeedButton();
//                 registrateOnLocationChange();
                document.addEventListener("keydown", control.setup.keyWatcher, false);
            },
            registrateShortcut: function(key, functionToCall) {
                console.log("registering function for key: " + key);
                control.keyToFunctionMap[key.charCodeAt(0)] = functionToCall;
            },
            keyWatcher: function(e) {
                console.log("key pressed!");

                //check if video or "nothing" is focussed (to exclude text fields)
                if (document.activeElement.id != "" && document.activeElement.id != "movie_player") {
                    console.log("not the right focus");
                    return;
                }

                if (!e) {
                    e = window.event;
                }
                control.callFunctionByKey(e.keyCode);
            },
            registrateOnLocationChange: function() {
                var pushState = history.pushState;
                history.pushState = function () {
                    var changedUrl = arguments[2];
                    pushState.apply(history, arguments);
                    control.setup.init();
                }
            },
            enableLoopButton: function() {
                try {
                    control.setup.registrateShortcut("A", control.loop.handler);
                } catch(ex) {
                    console.log("error enabling loop button: " + ex);
                }
            },
            enableSpeedButton: function() {
                try {
                    control.speed.speedSet = control.video.playbackRate;
                    control.setup.registrateShortcut("S", control.speed.handler);
                } catch(ex) {
                    console.log("error enabling speed button: " + ex);
                }
            }
        },
        keyToFunctionMap: {},
        video: document.querySelector('.html5-main-video'),
        speed: {
            availableSpeeds: [1, 0.75, 0.5, 0.25, 0.1],
            speedSet: -1,
            handler: function() {
                var index = control.speed.availableSpeeds.indexOf(control.speed.speedSet);
                index = ++index % control.speed.availableSpeeds.length;
                control.speed.setSpeed(control.speed.availableSpeeds[index]);
                control.messageBox.show(control.speed.speedSet + "x");
            },
            setSpeed: function(speed) {
                control.speed.speedSet = speed;
                control.video.playbackRate = speed;
            }
        },
        loop: {
            begin: null,
            end: null,
            active: false,
            reset: function() {
                control.loop.begin = null;
                control.loop.end = null;
                control.loop.active = false;
            },
            worker: function() {
                console.log("loop worker");
                if (control.loop.active == false) {
                    console.log("loop worker not active, exiting");
                    return;
                }
                if (control.video.currentTime > control.loop.end) {
                    console.log("loop worker - set to beginning");
                    control.jumpToPosition(control.loop.begin);
                }
                console.log("loop worker - setting timeout");
                setTimeout(control.loop.worker, 100);
            },
            handler: function() {
                //set loop begin
                if (control.loop.begin == null) {
                    console.log("setting loop begin");
                    control.messageBox.show("loop begin");
                    control.loop.begin = control.video.currentTime;
                    return;
                }

                //set loop end
                if (control.loop.end == null) {
                    console.log("setting loop end");
                    control.messageBox.show("loop end");
                    control.loop.end = control.video.currentTime;
                    control.loop.active = true;
                    control.jumpToPosition(control.loop.begin);

                    //activate loopWorker which sets back time
                    setTimeout(control.loop.worker, 100);
                    return;
                }

                //button pressed a third time -> deactivating loop
                console.log("resetting loop");
                control.messageBox.show("loop reset");
                control.loop.reset();
            }
        },
        callFunctionByKey: function(key) {
            console.log("call function by key");
            if (control.keyToFunctionMap[key]==null) {
                return;
            }
            control.keyToFunctionMap[key]();
        },
        jumpToPosition: function(time) {
            console.log("jumping to " + time);
            control.video.currentTime = time;
        }
    };

    control.setup.init();
})();
