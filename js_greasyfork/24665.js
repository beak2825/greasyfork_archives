// ==UserScript==
// @name          HipChat / Jitsi Meet - Please rate your meeting experience (Click Cancel)
// @description   Automatically cancels the meeting experience rating dialog in HipChat or Jitsi Meet
// @include       https://hipchat.me/*
// @include       https://meet.jit.si/*
// @match         https://hipchat.me/*
// @match         https://meet.jit.si/*
// @version       0.2
// @namespace https://greasyfork.org/users/77886
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/24665/HipChat%20%20Jitsi%20Meet%20-%20Please%20rate%20your%20meeting%20experience%20%28Click%20Cancel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24665/HipChat%20%20Jitsi%20Meet%20-%20Please%20rate%20your%20meeting%20experience%20%28Click%20Cancel%29.meta.js
// ==/UserScript==

function clickSubmitBtnWhenItAppears (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
function clickTheCancelButton () {
    // <button class="button-control jqibutton " name="jqi_state0_buttonspandatai18ndialogCancelCancelspan" value="false"><span data-i18n="dialog.Cancel">Cancel</span></button>
    waitForKeyElements (
    	"button[name='jqi_state0_buttonspandatai18ndialogCancelCancelspan']",
	clickSubmitBtnWhenItAppears
    );
}

// <h2 class="aui-dialog2-header-main" data-i18n="dialog.rateExperience">Please rate your meeting experience.</h2>
waitForKeyElements (
    "h2[data-i18n='dialog.rateExperience']",
    clickTheCancelButton
);