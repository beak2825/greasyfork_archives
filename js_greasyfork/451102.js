// ==UserScript==
// @name         Emoji button in main menu
// @namespace    incelerated
// @version      0.1
// @description  Puts the emoji button in the main buttons instead of in the 3 dot sub-menu
// @author       incelerated
// @match        https://incels.is/threads/*
// @match        https://incels.is/members/*
// @match        https://incels.is/media/*
// @match        https://incels.is/conversations/*
// @match        https://incels.is/forums/*/post-thread
// @match        https://incels.is/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451102/Emoji%20button%20in%20main%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/451102/Emoji%20button%20in%20main%20menu.meta.js
// ==/UserScript==

$(document).ready(function(){
    //$("#xfSmilie-1").prependTo(".fr-btn-grp:nth-of-type(3)");
    $(".message-editorWrapper .bbWrapper").each(function(){
        let smiley = $(this).find("#xfSmilie-1");
        let location = $(this).find(".fr-btn-grp:nth-of-type(3)");
        smiley.prependTo(location);
    });
});