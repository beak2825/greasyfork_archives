// ==UserScript==
// @name           time
// @namespace      https://greasyfork.org/users/237458
// @version        10.3
// @description    ora-data
// @author         figuccio
// @match          *://*/*
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @noframes
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @grant          GM_registerMenuCommand
// @require        http://code.jquery.com/jquery-latest.js
// @require        https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/404536/time.user.js
// @updateURL https://update.greasyfork.org/scripts/404536/time.meta.js
// ==/UserScript==
(function() {
    'use strict';
var $ = window.jQuery;
$(document).ready(function() {
    // Recupera la posizione salvata del box
    var boxPosition = GM_getValue("boxPosition");
    var box = $("<div class='timebox' title='Sposta col mouse' id='testtimebox'><div class='day' id='day'></div><div class='time' id='time'></div></div>").css({
        "position": "fixed",
        "top": boxPosition ? boxPosition.top : "0px",
        "left": boxPosition ? boxPosition.left : "930px",
        "z-index": "99999999999",
        "width": "90px",
        "height": "auto",
        "margin": "0px",
        "text-align": "center",
        "background-color": "gold",
        "border-radius": "10px",
        "border": "2px solid red",
        "font-size":"15px",
        "color":"red"
    }).draggable({
        containment: "window", // Limita il movimento all'interno della finestra del browser
        // Salva la posizione del box quando viene rilasciato
        stop: function(event, ui) {
            GM_setValue("boxPosition", {
                top: ui.position.top + "px",
                left: ui.position.left + "px"
            });
        }
    });

    $("body").append(box);

    function updateTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        var hour = date.getHours().toString().padStart(2, '0');
        var min = date.getMinutes().toString().padStart(2, '0');
        var sec = date.getSeconds().toString().padStart(2, '0');
        var millisec = date.getMilliseconds().toString().padStart(3, '0');

        $("#day").text(`${day}-${month}-${year}`);
        $("#time").text(`${hour}:${min}:${sec}:${millisec}`);
    }

    updateTime();
    setInterval(updateTime, 80); // Aggiorna ogni millisecondo
});

function toggleTimeBox() {
    $(".timebox").toggle();
}
GM_registerMenuCommand("Mostra/Nascondi Box", toggleTimeBox);
})();