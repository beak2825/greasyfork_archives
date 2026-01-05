// ==UserScript==
// @name         CSPT CrowdSurfWork extension
// @namespace    mobiusevalon.tibbius.com
// @version      0.4
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @include      /^https{0,1}:\/\/work\.crowdsurfwork\.com\/tasks\/\w{32}.*?$/
// @author       Mobius Evalon
// @description  CSPT extension for CSW.  Hide the copyright footer, automatically scroll the page down to the work frame, move the control buttons and timer to the header, job control hotkeys, etc.
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/13263/CSPT%20CrowdSurfWork%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/13263/CSPT%20CrowdSurfWork%20extension.meta.js
// ==/UserScript==

$.noConflict(true); // CrowdSurf is using jQuery as part of their platform so i have to defer to the version they loaded

function use_button(btn)
{
    switch(btn)
    {
        case "return": case "skip":
            // these buttons cannot exist at the same time so we use the same hotkey/command for both
            var $button = $("#task-detail-nav .inline-block .btn-info").first();
            if(!$button.length) $button = $("#task-detail-nav .inline-block .btn-danger").first();

            $button.get(0).click();
            break;
        case "accept":
            $("#accept-button").get(0).click();
            break;
        case "auto-accept":
            // todo: function of the auto accept switch must be an appended jquery handler -- figure out how to hook into that from here
            // $("#task-detail-nav .inline-block .auto-accept-button .bootstrap-switch .bootstrap-switch-container").first().click();
            break;
    }
}

function cspt_ext_hotkeys(event)
{
    if(event.altKey === true)
    {
        if(event.which === 8) {use_button("return"); return false;}
        else if(event.which === 13) {use_button("accept"); return false;}
        else if(event.which === 190) {use_button("auto-accept"); return false;}
    }
}

function cspt_ext_message(event)
{
    // using dom messaging in this frame throws an error every single time but it doesn't 
    // seem to affect anything
    // the only reason this is here is because the iframe that contains the actual job content
    // is considered to be its own window/tab for all intents and purposes, so the hotkeys defined
    // in this script don't work in the job frame without a completely separate keboard listener
    // and sending the data along the dom to this function
    if(event.originalEvent.origin === "https://ops.cielo24.com")
    {
        var data = event.originalEvent.data.split("-");
        if(data[0] === "cspt")
        {
            if(data[1] === "hotkey")
            {
                use_button(data[2]);
            }
            return false;
        }
    }
}

$(document).ready(function() {
    $("head").append(
        $("<style/>")
        .attr("type","text/css")
        .text("#task-detail-nav {margin: 0px !important; padding: 0px !important; color: #ffffff !important;} "+
              "#task-detail-nav a.btn {margin: 0px 10px !important; padding: 6px 15px !important;} "+
              "#task-detail-nav #Countdown h4 {margin: 0px 10px !important;} ")
    ); // these styles refine the appearance of task controls in the header, not particularly necessary

    $("footer").hide(); // footer only contains a copyright notice -- this is in our way as a worker

    var $accept_button = $("#accept-button");
    if($accept_button.length) $("#task-detail-nav .inline-block").prepend($accept_button); // move accept button before skip button

    $("header .headerwrapper .header-right").prepend($("#task-detail-nav").removeClass("pull-right")); // put task controls in the header

    $(window)
        .on("message onmessage",cspt_ext_message)
        .on("keydown onkeydown",cspt_ext_hotkeys)
        .scrollTop($("#innerframe").offset().top-$("header .headerwrapper").height()+8); // 8 pixels of margin/padding somewhere
});