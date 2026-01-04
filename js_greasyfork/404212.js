// ==UserScript==
// @name        CosmosisT's Black Camera Fix Script
// @version     1.1
// @description Modified TinyChat - Best Scripts; prepare to be amazed.
// @author      CosmosisT
// @url         https://gist.github.com/CosmosisT
// @license     Copyright (C) 2019-2020 CosmosisT
// @icon        https://tinychat.com/webrtc/2.0.0-81/images/favicon.png
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts*
// @grant       none
// @run-at      document-start
//              jshint esversion: 6
// @namespace https://greasyfork.org/users/395685
// @downloadURL https://update.greasyfork.org/scripts/404212/CosmosisT%27s%20Black%20Camera%20Fix%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/404212/CosmosisT%27s%20Black%20Camera%20Fix%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var e=0,
        i,
        error_code = ["Timeout"];
    var CTS = {
        Init: function() {
            e++;
            if(CTS.PageLoaded()) {
                CTS.Dispose();
                window.TinychatApp.BLL.ChatRoom.prototype.sendPushForUnreadPrivateMessage = function() {};
                window.TinychatApp.BLL.Videolist.prototype.blurOtherVids = function() {};
                window.TinychatApp.BLL.User.isSubscription = function() {return true;};
                window.TinychatApp.BLL.User.canUseFilters = function() {return true;};
                window.TinychatApp.BLL.MediaConnection.prototype.Close = function() {
                    if (this.rtc !== null) {
                        let a = this.rtc;
                        this.rtc = null;
                        if (this.mediaStream !== null) {
                            if (this.mediaStream.active && a.signalingState !== "closed" && typeof a.removeStream === "function" && a.removeStream(this.mediaStream)) {
                                this.mediaStream.stop();
                                this.mediaStream = null;
                            }
                        } else {
                            this.videolist.RemoveVideoRemote(this.handle);
                        }
                        if (a.signalingState !== "closed" && a.close()) {
                            console.log("MediaConnection.SignalingState: " + a.signalingState + " ->>> Close");
                        }
                    }
                };
            } else {
                if(e >= 20) CTS.Flag(0);
            }
        },
        PageLoaded: function() {
            console.log("Hoist Attempt: "+e);
            if (document.querySelector("tinychat-webrtc-app")) {
                if (document.querySelector("tinychat-webrtc-app").shadowRoot) return true;
            }
        },
        Dispose: function() {
            clearInterval(i);
        },
        Flag: function(err, caught) {
            CTS.Dispose();
            console.log("Error: "+error_code[err]);
        }
    };

    i = setInterval(CTS.Init, 500);
})();