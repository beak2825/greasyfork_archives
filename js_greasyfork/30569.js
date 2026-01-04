// ==UserScript==
// @name         Hack Forums Multiquote
// @namespace    Text
// @version      0.1
// @description  Allows you to quote multiple posts at a time.
// @author       DisturbedNut
// @include      *hackforums.net/showthread.php?tid=*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30569/Hack%20Forums%20Multiquote.user.js
// @updateURL https://update.greasyfork.org/scripts/30569/Hack%20Forums%20Multiquote.meta.js
// ==/UserScript==

$(document).ready(function() {
    $(".post_management_buttons").each(function() {
        var button = $("<a>", { id: "multiquote_" + $(this).closest("table").attr("id").split("_")[1], "class": "bitButton" });
        button.text("Multiquote");
        button.css("cursor", "pointer");
        button.click(function() {
            var current = $(this);
            current.text("Loading quote...");

            $.get('/newreply.php?tid=' + $('[name="tid"]').val() + '&replyto=' + $(this).attr("id").split("_")[1], function(data) {
                $("#message").val($("#message").val() + $("#message", data).text());
                current.text("Post quoted");
                current.css("color", "#7fff63");
                current.off("click");
            });
        });

        $(this).append(button);
    });
});