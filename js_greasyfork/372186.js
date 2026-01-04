// ==UserScript==
// @name         TagPro Report Submit Button
// @description  Show a submit button in the Report popup.
// @author       Ko
// @version      1.2
// @include      *.koalabeast.com:*
// @include      *.koalabeast.com/game
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/372186/TagPro%20Report%20Submit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/372186/TagPro%20Report%20Submit%20Button.meta.js
// ==/UserScript==

tagpro.ready(function() {

    // Find the existing popup, selection dropdown and cancel button.
    var player = () => $("div#kick").attr("data-id"),
        select = $("#kickSelect"),
        cancel = $("#kickCancelButton");

    // Remove the event handler that votes on selecting a reason
    select.unbind("change");

    // Clone the "Cancel" button right above it.
    var submit = cancel.clone(true).insertBefore(cancel)

    // Change the ID and text to "Submit" of the cloned button.
    submit.prop("id", "kickSubmitButton").text("Submit");

    // Make a click on the button send a report
    submit.click(function(t) {
        tagpro.socket.emit("kick", {
            playerId: parseInt(player()),
            reason: parseInt(select.val())
        });
    });
});
