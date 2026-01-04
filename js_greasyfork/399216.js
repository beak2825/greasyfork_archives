// ==UserScript==
// @name         WebRTC media source switcher
// @namespace    https://daniil.it
// @version      0.1.4
// @description  Forcefully chose a specific webrtc input/output audio/video device
// @author       Daniil Gentili <daniil@daniil.it>
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399216/WebRTC%20media%20source%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/399216/WebRTC%20media%20source%20switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var hidden = {
        enumerateDevices: navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices),
        getUserMedia: navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices),
    }
    navigator.mediaDevices.getUserMedia = constraints => navigator.mediaDevices.enumerateDevices().then(devices => {
        for (let x = 0; x < devices.length; x++) {
            if (devices[x].kind == "videoinput" && constraints.video) {
                if (constraints.video === true) constraints.video = {}
                constraints.video.deviceId = {exact: devices[x].deviceId}
            } else if (devices[x].kind == "audioinput" && constraints.audio) {
                if (constraints.audio === true) constraints.audio = {}
                constraints.audio.deviceId = {exact: devices[x].deviceId}
            }
        }
        return hidden.getUserMedia(constraints)
    })
    navigator.mediaDevices.enumerateDevices = () => hidden.enumerateDevices().then(res => {
        if (window.newRes) {
            return window.newRes;
        } else {
            window.newRes = [];
        }

        var temp = {};
        var tempLabels = {};
        for (var i = 0; i < res.length; i++) {
            if (!temp[res[i].kind]) {
                temp[res[i].kind] = [];
                tempLabels[res[i].kind] = "Choose a "+res[i].kind+" device:\n";
            }
            temp[res[i].kind].push(res[i])
            tempLabels[res[i].kind] += temp[res[i].kind].length+": "+res[i].label+"\n"
        }
        for (let [key, value] of Object.entries(tempLabels)) {
            var choice = prompt(value);
            window.newRes.push(temp[key][choice-1]);
        }

        return window.newRes;
    })
})();