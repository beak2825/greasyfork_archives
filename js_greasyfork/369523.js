// ==UserScript==
// @name         SSC Control Panel Button
// @namespace    el nino
// @version      1.00
// @author       el nino
// @description   Control Panel Button
// @include      *://www.skyscrapercity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369523/SSC%20Control%20Panel%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/369523/SSC%20Control%20Panel%20Button.meta.js
// ==/UserScript==

var icon_cp =   'data:image/png;base64,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';

$(function() {
    if (window.self !== window.top) return;

    $("<img>", {
        "src": icon_cp,
        "id": "control-panel",
        "style": "position: fixed; bottom: 80px; right: 30px; height: 43px; width: 43px; cursor: pointer; opacity: 0.5;",
        "width": "43px", "height": "43px"})
        .appendTo("body");

    if($(window).scrollTop() < 100){
        $('#control-panel').hide();
    }

    $(window).on("load resize scroll",function(){
        if($(window).scrollTop() > 100) $('#control-panel').fadeIn();
        else $('#control-panel').fadeOut();
    });

    $("#control-panel").click(function() {
        window.location="//www.skyscrapercity.com/usercp.php";
    });
});

