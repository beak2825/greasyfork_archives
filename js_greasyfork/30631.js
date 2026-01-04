// ==UserScript==
// @name          HipChat / Jitsi Meet - Auto mute by default
// @description   Automatically mutes when joining a conference in HipChat or Jitsi Meet
// @include       https://hipchat.me/*
// @include       https://meet.jit.si/*
// @match         https://hipchat.me/*
// @match         https://meet.jit.si/*
// @version       0.2
// @namespace https://greasyfork.org/users/77886
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/30631/HipChat%20%20Jitsi%20Meet%20-%20Auto%20mute%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/30631/HipChat%20%20Jitsi%20Meet%20-%20Auto%20mute%20by%20default.meta.js
// ==/UserScript==

function clickWhenItAppears (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}

bWaitOnce = true;

$(document).ready(function() { //When document has loaded
    setTimeout(function() {
        // <a class="button icon-microphone" id="toolbar_button_mute" shortcut="mutePopover" content="Mute / Unmute" data-i18n="[content]toolbar.mute" data-container="body" data-placement="bottom" data-tooltip="n" original-title=""><ul id="micMutedPopup" class="loginmenu"><li data-i18n="[html]toolbar.micMutedPopup">Your microphone has been muted so that you<br>would fully enjoy your shared video.</li></ul><ul id="unableToUnmutePopup" class="loginmenu"><li data-i18n="[html]toolbar.unableToUnmutePopup">You cannot un-mute while the shared video is on.</li></ul><ul id="talkWhileMutedPopup" class="loginmenu"><li data-i18n="[html]toolbar.talkWhileMutedPopup">Trying to speak? You are muted.</li></ul></a>
        waitForKeyElements (
            "a[class='button icon-microphone']", clickWhenItAppears
        );
    }, 1500); //Wait 1 seconds before trying to click. This is to avoid hitting the redundant "HipChat Video needs to use your microphone and camera." dialog.
});