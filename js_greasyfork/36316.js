// ==UserScript==
// @name          HipChat / Jitsi Meet - Auto disabled webcam by default
// @description   Automatically turns off webcam when joining a conference in HipChat or Jitsi Meet
// @include       https://hipchat.me/*
// @include       https://meet.jit.si/*
// @match         https://hipchat.me/*
// @match         https://meet.jit.si/*
// @version       0.2
// @namespace https://greasyfork.org/users/77886
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/36316/HipChat%20%20Jitsi%20Meet%20-%20Auto%20disabled%20webcam%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/36316/HipChat%20%20Jitsi%20Meet%20-%20Auto%20disabled%20webcam%20by%20default.meta.js
// ==/UserScript==

function clickWhenItAppears (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}

bWaitOnce = true;

$(document).ready(function() { //When document has loaded
    setTimeout(function() {
        waitForKeyElements (
            "a[class='button icon-camera']", clickWhenItAppears
        );
    }, 1500); //Wait 1 seconds before trying to click. This is to avoid hitting the redundant "HipChat Video needs to use your microphone and camera." dialog.
});