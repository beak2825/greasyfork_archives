// ==UserScript==
// @name         Mturk Submit Button
// @namespace    https://greasyfork.org/en/scripts/458265-mturk-submit-button
// @version      0.1
// @description  adds a submit button for broken hits
// @author       Elias041
// @license      none
// @match        https://worker.mturk.com/projects/*/tasks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mturk.com
// @require      http://code.jquery.com/jquery-1.9.1.js
// @require      https://code.jquery.com/ui/1.9.2/jquery-ui.js
// @resource     https://code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458265/Mturk%20Submit%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/458265/Mturk%20Submit%20Button.meta.js
// ==/UserScript==

window.onload = function () {
    let t = document.getElementsByClassName("col-xs-5 col-md-3 text-xs-right p-l-0")[0],
        e = t.parentNode,
        o = document.createElement("button");
    (o.style.background = "#D0342C"),
        (o.style.border = "none"),
        (o.style.padding = "0px 14px"),
        (o.style.fontSize = "15px"),
        (o.style.color = "#fff"),
        (o.id = "button"),
        (o.innerHTML = "Force&nbspSubmit"),
        e.insertBefore(o, t),
        document.getElementById("button").addEventListener("click", function e() {
            if (t) {
                var o = document.getElementsByTagName("form")[0];
                $("<p>Attempt to submit a broken HIT?</p>").dialog({
                    position: { my: "left top", at: "left bottom", of: button },
                    width: "auto",
                    modal: !0,
                    buttons: {
                        Ok: function () {
                            console.log(o.id), document.getElementById(o.id).submit();
                        },
                        Cancel: function () {
                            console.log("Cancelled"), $(this).dialog("close");
                        },
                    },
                });
            }
        });
};