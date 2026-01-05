// ==UserScript==
// @name         Gamekit SeeAll
// @namespace    fr.mrcraftcod
// @version      0.9
// @description  Add a button to reveal all quests in GameKit
// @author       MrCraftCod
// @match        https://gamekit.com/*/*
// @match        https://dogry.pl/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20337/Gamekit%20SeeAll.user.js
// @updateURL https://update.greasyfork.org/scripts/20337/Gamekit%20SeeAll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        $("#others-tab-basic").append('<a href="javascript:void(0);" id="revealAll" done="false">Reveal quests</a>');
        $('#revealAll').click(function(){
            revealAll();
        });
    });
})();

function revealAll(){
    if($('#revealAll').attr("done") === "true")
        return;
    $(".item").each(function(){
        var active = $(this).hasClass("active");
        $(this).find(".pad").each(function(){
            $(this).find("p:not([style],[class])").each(function(){
                appendText($(this).clone().children().remove().end().text(), active);
                $('#revealAll').attr("done", true);
                $('#revealAll').hide();
            });
        });
    });
}

function appendText(text, active){
    $("article>.game>.row>ul").append("<li" + (active ? ' style="color:green;"' : "") + ">" + text + "</li>");
}
