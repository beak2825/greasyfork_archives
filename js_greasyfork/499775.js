// ==UserScript==
// @name         Bitchute video fix + better download
// @namespace    http://tampermonkey.net/
// @version      2024-07-05
// @description  fixes videos not playing and also makes it so download button
// @author       PsychopathicKiller77
// @match        https://www.bitchute.com/api/beta9/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitchute.com
// @grant        unsafeWindow
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499775/Bitchute%20video%20fix%20%2B%20better%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/499775/Bitchute%20video%20fix%20%2B%20better%20download.meta.js
// ==/UserScript==

var setevents = false;

function check() {
    if (!setevents && document.getElementById("player_one_html5_api")) {
        document.getElementById("player_one_html5_api").addEventListener("stalled", function() {
            console.log("Media data is not available");
            fixvideo();
        });
        document.getElementById("player_one_html5_api").addEventListener("error", function() {
            console.log("Error! Something went wrong");
            fixvideo();
        });
        //download fix start, remove this part if u dont want better?(in my opinion its better but i guess its subjective) download
        document.getElementById("player_one_html5_api").addEventListener('loadedmetadata', function() {
            var old_element = document.getElementsByClassName("vjs-download-control vjs-control vjs-button")[0];
            var new_element = old_element.cloneNode(true);
            new_element.addEventListener("click", downloadVideo)
            old_element.parentNode.replaceChild(new_element, old_element);
        });
        document.getElementById("player_one_html5_api").addEventListener('play', function() {
            var old_element = document.getElementsByClassName("vjs-download-control vjs-control vjs-button")[0];
            var new_element = old_element.cloneNode(true);
            new_element.addEventListener("click", downloadVideo)
            old_element.parentNode.replaceChild(new_element, old_element);
        });
        if (document.getElementsByClassName("vjs-download-control vjs-control vjs-button")) {
            var old_element = document.getElementsByClassName("vjs-download-control vjs-control vjs-button")[0];
            var new_element = old_element.cloneNode(true);
            new_element.addEventListener("click", downloadVideo)
            old_element.parentNode.replaceChild(new_element, old_element);
        }
        //download fix end
        setevents = true;
    }
}
setInterval(check, 100);

function fixvideo() {
    var lastKnownCurrentTime = document.getElementById("player_one_html5_api").currentTime;

    function setHtmlPageSeed(seedLink) {
        document.getElementById("player_one_html5_api").src = seedLink;
        unsafeWindow.media_url = seedLink;
        document.getElementById("player_one_html5_api").currentTime = lastKnownCurrentTime
        var old_element = document.getElementsByClassName("vjs-download-control vjs-control vjs-button")[0];
        var new_element = old_element.cloneNode(true);
        new_element.addEventListener("click", downloadVideo)
        old_element.parentNode.replaceChild(new_element, old_element);
    };
    var availableSeedArray = ['seed111', 'seed132', 'seed122', 'seed167', 'seed126', 'seed171', 'seedp29xb', 'seed305', 'seed307', 'seed128', 'seed125', 'seed177', 'zb10-7gsop1v78'];
    var seedArrayCurrentPosition = 1;

    function getNewRandomSeed() {
        var _tempPosition = Math.floor(Math.random(availableSeedArray.length - 1) * 10);
        if (_tempPosition == seedArrayCurrentPosition) {
            if ((_tempPosition + 1) > (availableSeedArray.length - 1)) {
                _tempPosition = 0
            } else {
                _tempPosition += 1
            }
        }
        seedArrayCurrentPosition = _tempPosition;
        return seedArrayCurrentPosition
    };
    var newSeedVidLink = '';

    function getSeedSourceFromSeedNo(seedNo, vidLink) {
        if (!vidLink) {
            vidLink = document.getElementById("player_one_html5_api").src.split('.bitchute.com/')[1]
        }
        if (!seedNo) {
            seedNo = availableSeedArray[getNewRandomSeed()]
        }
        newSeedVidLink = 'https://' + seedNo + '.bitchute.com/' + vidLink;
        setHtmlPageSeed(newSeedVidLink);
        return newSeedVidLink
    };
    getSeedSourceFromSeedNo();
}
function downloadVideo() {
    GM_download({
        url: document.getElementById("player_one_html5_api").src,
        name: document.getElementById("player_one_html5_api").src.split(/(\\|\/)/g).pop(),
        saveAs: false,
        conflictAction: "prompt"
    });
}