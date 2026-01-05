// ==UserScript==
// @name          HipChat / Jitsi Meet - Camera was not found (Click OK)
// @description   Automatically confirms that you do not have a camera in a HipChat or Jitsi Meet
// @include       https://hipchat.me/*
// @include       https://meet.jit.si/*
// @match         https://hipchat.me/*
// @match         https://meet.jit.si/*
// @version       0.2
// @namespace https://greasyfork.org/users/77886
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/24564/HipChat%20%20Jitsi%20Meet%20-%20Camera%20was%20not%20found%20%28Click%20OK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/24564/HipChat%20%20Jitsi%20Meet%20-%20Camera%20was%20not%20found%20%28Click%20OK%29.meta.js
// ==/UserScript==

function clickSubmitBtnWhenItAppears (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}
function clickTheOkButton () {
    waitForKeyElements (
    	"button[class='button-control jqibutton jqidefaultbutton button-control_primary'][name*='jqi_state0_buttonOk']",
	clickSubmitBtnWhenItAppears
    );
}

// <h4 data-i18n="dialog.cameraNotFoundError">Camera was not found.</h4>
waitForKeyElements (
    "h4[data-i18n='dialog.cameraNotFoundError']",
    clickTheOkButton
);