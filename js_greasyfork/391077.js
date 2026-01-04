// ==UserScript==
// @name         Ultimate Toggle
// @namespace    http://localhost/
// @version      0.1.2.4
// @description  Toggle 'n flash certain fields.
// @author       Mizhi Yikai
// @match        file:///*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/391077/Ultimate%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/391077/Ultimate%20Toggle.meta.js
// ==/UserScript==

(function() {
    //Inject style for TextMarker marked texts
    var ultimate_toggle_css_id = "ultimate_toggle_css"
    var ultimate_toggle_css = document.querySelector("#" + ultimate_toggle_css_id);
    var clip_token = "e1APq7JTeY8tUUZeGwH9SN2P9eqr9cYx";
    if (!ultimate_toggle_css) {
        var sheet = document.createElement('style')
        sheet.id = ultimate_toggle_css_id;
        sheet.innerHTML = `
            .covered {
                filter: invert(50%) !important;
            }

            *[data-reviewed]::after {
                content: "★";
                color: #FF0000;
                font-size: 0.5rem;
                top: -16px;
                position: relative;
            }

            u {
                text-decoration: none;
            }

            p {
                line-height: 2.5;
            }

            `;
        document.head.appendChild(sheet);
    }

    'use strict';
    var toggle = function() {
        var on = true;
        return function() {
            if (!on) {
                on = true;
                //reveal("rgb(165, 0, 33)");
                //revealElementByColor("red");
                revealAnswers(50);
                revealTextMarkerTexts(0);
                return;
            }
            reveal("transparent");
            revealElementByColor("transparent");
            revealAnswers(0);
            revealTextMarkerTexts(1);
            on = false;
        }
    }();

    toggle(); //Set OFF as default

    var keyTimes = {};

    document.addEventListener('keydown', function(e) {
        removeFilter();
        var key = e.keyCode || e.which;
        if (!keyTimes["key" + e.which]) {
            keyTimes["key" + e.which] = new Date().getTime();
        }
        var state = "flash";
        switch (key) {
            case 45: //Insert
                toggle();
                break;
            case 19: //Pause
                reveal("transparent");
                revealElementByColor("transparent");
                revealAnswers(0);
                revealTextMarkerTexts(1);
                break;
            case 145: //ScrollLock
                update_local_file();

                break;
        }
    }, false);

    document.addEventListener('keyup', function(e) {
        var key = e.keyCode || e.which;
        if (keyTimes["key" + e.which] && key === 19) {
            var x = new Date().getTime() - keyTimes["key" + e.which];
            delete keyTimes["key" + e.which];
            var time = 200;
            if (x < time) {
                setTimeout(function() {
                    //reveal("rgb(165, 0, 33)");
                    //revealElementByColor("red");
                    revealAnswers(50);
                    revealTextMarkerTexts(0);
                }, (time - x));
            } else {
                //reveal("rgb(165, 0, 33)");
                //revealElementByColor("red");
                revealAnswers(50);
                revealTextMarkerTexts(0);
            }
        }
    }, false);

    function reveal(c) {
        var underline = document.querySelectorAll("u");
        for (var i = 0; i < underline.length; i++) {
            underline[i].style = "background-color: " + c + " !important";
        }
    }

    function revealElementByColor(c) {

        // Get all elements that have a style attribute
        var elms = document.querySelectorAll("*[style]");

        // Loop through them
        Array.prototype.forEach.call(elms, function(elm) {
            // Get the color value
            var clr = elm.style.color || "";

            // Remove all whitespace, make it all lower case
            clr = clr.replace(/\s/g, "").toLowerCase();

            // Switch on the possible values we know of
            switch (clr) {
                case "red":
                    elm.style = "color: red; background-color: " + c + " !important";
                    break;
            }
        });
    }

    function revealAnswers(i32) {
        for (const a of document.querySelectorAll("p")) {
            if (a.textContent.includes("答案") || a.textContent.includes("解析")) {
                a.style = "background-color: white;filter:invert(" + i32 + "%) !important";
            }
        }
    }

    function revealTextMarkerTexts(bool) {
        for (const b of document.querySelectorAll(".textmarker-highlight")) {
            if (bool == 0) {
                //b.style.setProperty('filter','brightness('+ bool +')',"");
                b.classList.add("covered");
            } else {
                b.classList.remove("covered");
            }
        }
    }


    function removeFilter() {
        for (const c of document.querySelectorAll(".textmarker-highlight")) {
            c.addEventListener("click", remove);
            function remove() {
                c.setAttribute("data-reviewed", 1);
                console.log(c.getAttribute("data-reviewed"));
                c.classList.remove("covered");
                c.classList.remove("textmarker-highlight");
                c.removeEventListener("click", remove);
            }
        }
    }
    function update_local_file() {
        GM_setClipboard(`${clip_token}|${document.location.pathname.substring(1)}|${document.documentElement.innerHTML.toString()}`);
        /*
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:24363/update_file?filepath=" + document.location.pathname.substring(1),
            data: document.documentElement.innerHTML.toString(),
            onload: function(response) {
                //alert(response.responseText);
            }
        });
        */
    }
})();