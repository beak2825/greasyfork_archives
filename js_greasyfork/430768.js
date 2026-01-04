// ==UserScript==
// @name         Upland Improver
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enables clicked outside dialogs to close them
// @author       nljuggler
// @match        https://play.upland.me/*
// @icon         https://www.google.com/s2/favicons?domain=upland.me
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/430768/Upland%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/430768/Upland%20Improver.meta.js
// ==/UserScript==

$(function(){
    // Property dialog
    $(document).on("click", ".sc-cBOTKl.kfrDeA", function() {
        console.log("clicked");
        $(".show .close-section button").click();
    });

    // Messages, Treasures or Rrofile dialog
    $(document).on("click", ".sc-iwsKbI.gHlBcE", function() {
        console.log("clicked messages, treasures or profile");
        if ($(".card .card .with-left-side-btn button")[1] !== undefined){
            $(".card .card .with-left-side-btn button")[1].click();
        }
        else {
            $(".card .card .card .sc-bdVaJa.jvDJOL button")[0].click();
        }
    });

    $(document).on("click", ".sc-dnqmqq.hbnEBx.card,.sc-dnqmqq.hbnEBx.large_modal,.sc-ifAKCX.fnJSSS", function(e) {
        e.stopPropagation();
    });

    $(document).on("click", ".sc-iwsKbI.gHlBcE", function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("clicked");
        $(".card .card .card button")[0].click();
    });

    //sc-dnqmqq hbnEBx card
});