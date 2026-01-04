// ==UserScript==
// @name            Custom Playback Speed
// @description     Load more results automatically and endlessly.
// @author          tumpio
// @namespace       tumpio@sci.fi
// @homepageURL     https://openuserjs.org/scripts/tumpio/Endless_Google
// @supportURL      https://github.com/tumpio/gmscripts/issues
// @icon            https://github.com/tumpio/gmscripts/raw/master/Endless_Google/large.png
// @include         http://www.youtube.*
// @include         https://www.youtube.*
// @run-at          document-start
// @version         0.0.7
// @license         MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440638/Custom%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/440638/Custom%20Playback%20Speed.meta.js
// ==/UserScript==

function checkLocalData() {
    if (localStorage.getItem("speeds") == null) {

    }
}

function setCustomSpeed() {
    var channelId = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")[0].href.substring(32)
    //TODO jsonpath yapmaya calis
    var speeds = JSON.parse(localStorage.getItem("speeds"));
    for (var i = 0; i < speeds.length; i++) {
        console.log(channelId)
        console.log(speeds[i])
        if (channelId == speeds[i].channelId) {
            document.getElementsByTagName('video')[0].playbackRate = speeds[i].speed;
        }
    }
}

// get channel name = document.getElementById('channel-name').innerText

setTimeout(function () {
    setCustomSpeed();
}, 3000);