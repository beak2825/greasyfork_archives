// ==UserScript==
// @name         Youtube auto skip
// @namespace    Youtube auto skip
// @version      1.22
// @description  Skip the first x seconds of any youtube video
// @author       xtrars
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404966/Youtube%20auto%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/404966/Youtube%20auto%20skip.meta.js
// ==/UserScript==






//User variables - change it if you want
var timeToSkip = 17; //seconds
var useFullscreen = true; //switch to fullscreen every new video






insertParam('t', timeToSkip);
var wasFullscreen = false;
function toggleFullscreen() {
    clearInterval(interval);
    if (!document.fullscreenElement) {
        document.querySelector('video').requestFullscreen().catch(() => {
            video.style.width = "100%";
            video.style.height = "100%";
            document.body.style.margin = "0px";
        });
    } else {
        document.exitFullscreen();
    }
}

//function from https://stackoverflow.com/a/1917916
//(little things adapted)
function insertParam(key, value) {
    key = escape(key); value = escape(value);

    var isKeyExist = false;
    var kvp = document.location.search.substr(1).split('&');
    if (kvp == '') {
        document.location.search = '?' + key + '=' + value + 's';
    }
    else {

        var i = kvp.length; var x; while (i--) {
            x = kvp[i].split('=');
            isKeyExist = kvp[i] ==  key + '=' + value + 's';
            if (x[0] == key) {
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }

        if (i < 0) { kvp[kvp.length] = [key, value].join('='); }

        //only reload if key dont exist
        if (isKeyExist == false) {
            //this will reload the page, it's likely better to store this until finished
            document.location.search = kvp.join('&');
        }
    }
}

//detect if URL change
var currentPage = location.href;
let interval = null;
interval = setInterval(function() {
    if (currentPage != location.href)
    {
        insertParam('t', timeToSkip);
        wasFullscreen = false;
        currentPage = location.href;
    }
    if (useFullscreen)
    {
        toggleFullscreen();
    }
}, 888);