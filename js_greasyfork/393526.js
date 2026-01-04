// ==UserScript==
// @name         Social Club Custom Crew Color
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a text box for creating custom crew colors easily.
// @author       Illusive
// @match        https://socialclub.rockstargames.com/crew/*/manage/edit
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393526/Social%20Club%20Custom%20Crew%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/393526/Social%20Club%20Custom%20Crew%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".createCrewFormColor").parent().append(`<div id="customColForm"></div>`)
    $("#customColForm").append(`<h3>Custom Crew Color</h3>`);
    $("#customColForm").append(`<input type="text" placeholder="#ff0000" id="customColor" name="customColor" size="10" maxlength="9" value="#ff0000">`);
    $("#customColForm").append(`<input id="createCrewFormBtn" type="submit" value="Quick Save" data-ga="savecrew" class="btn btmMedium btnOrange btnRounded" onclick="return false;">`)

	

    $("#customColor").attr("value", $("#createCrewFormColor").attr("value"))
    $("#customColor").keyup(() => {
        let CustomColor = $("#customColor").val()
        $("#createCrewFormColor").attr("value", CustomColor)
        $("#crewColor").attr("value", CustomColor)
    })
})();