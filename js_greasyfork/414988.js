// ==UserScript==
// @name         S4 Xero Broadcast+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes it easy to broadcast as you wish
// @author       Swaight & Johannes
// @match        https://xero.gg/neocortex/game/room/*/live
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/414988/S4%20Xero%20Broadcast%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/414988/S4%20Xero%20Broadcast%2B.meta.js
// ==/UserScript==

//// Global Properties
// Constants
const AREA_CNAME = "form-inline";
const CONTROL_CNAME = "form-control";

const VALID_SIZES = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const XERO_COLORS = [
    {R: 255, G: 255, B: 255}, // White
    {R: 0,   G: 202, B: 255}, // Xero Blue
    {R: 255, G:  40, B:  93}, // Xero Red
    {R: 255, G: 255, B:   0}, // GM Yellow
    {R: 255, G:   0, B: 255}  // Whisper Magenta
];

(function() {
    'use strict';

    //// Methods
    // Implementation
    const style = function(){

        // Breaker
        if (document.getElementById("control"));

        // Hide original input
        const input = $("#gameRoomBroadcastMessage");
        input.css("display", "none");

        const group = $(".form-inline:last .form-group:nth-last-child(2)");
        const control = document.createElement("div");
        control.id = "control";
        control.className = CONTROL_CNAME;
        group[0].insertBefore(control, group[0].lastChild);
        $(control)
            .css("display", "inherit")
            .css("text-align", "left")
            .css("padding", "1px")
            .css("height", "28px")
            .css("min-width", "500px");

        // Extra space
        const space = $(".form-inline:last").parent();
        const area = document.createElement("div");
        area.className = AREA_CNAME;
        space.append(area);

        // Size dropdown
        const dropdown = document.createElement("select");
        dropdown.className = CONTROL_CNAME;
        area.append(dropdown);
        $(dropdown)
            .css("height", "auto")
            .css("padding", "3px");

        for (const size of VALID_SIZES){
            dropdown.appendChild(
                new Option(size, `{F-2002_${size}}`)
            );
        }

        // Color boxes
        for (const color of XERO_COLORS){
            const rgb = `rgb(${color.R}, ${color.G}, ${color.B})`;
            const box = document.createElement("div");
            box.className = CONTROL_CNAME;
            area.append(box);
            $(box)
                .css("background-color", rgb)
                .css("height", "auto")
                .on("click", function(){
                    
                    const container = document.createElement("div");
                    container.value = color;
                    const input = document.createElement("input");
                    container.appendChild(input);
                    control.appendChild(container);
                    $(container)
                        .css("display", "flex")
                        .css("background-color", "#52575c")
                    $(input)
                        .css("color", rgb)
                        .css("background-color", "#52575c")
                        .css("border-style", "hidden")
                        .css("border-radius", "2px")
                        // Dynamic width text input
                        .css("width", "120px")
                        .focusout(adjust);

                    // Remove button
                    const button = document.createElement("div");
                    button.innerText = "❌";
                    container.appendChild(button);
                    $(button)
                        .on("click", function(){
                            control.removeChild(container);
                        })

                });

        }

        // Update hidden input on click
        $(".gameRoomBroadcast").click(function(){
            let result = dropdown.value;

            // Go through inputs
            for (const container of control.childNodes){

                // Build message
                const color = container.value;
                result += `{CB-${color.R},${color.G},${color.B},255}` + container.firstChild.value;
            }

            // Override hidden input value
            input.val(result);
        });

    };
    // Auxillary
    const adjust = function(){
        this.style.width = (this.value.length * 8) + "px";
    }
    // Execution
    const main = function(){
        const interval = setInterval(style, 1000);
    };

    // Run
    main();

})();