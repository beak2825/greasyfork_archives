// ==UserScript==
// @name         TM - FM skills color scheme
// @version      1.3
// @license MIT
// @description  Football Manager 2007 colors
// @author       Haydar - FC Marcimenium
// @match        https://trophymanager.com/players/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1392085
// @downloadURL https://update.greasyfork.org/scripts/516072/TM%20-%20FM%20skills%20color%20scheme.user.js
// @updateURL https://update.greasyfork.org/scripts/516072/TM%20-%20FM%20skills%20color%20scheme.meta.js
// ==/UserScript==

// it works on single player page

(function() {
    'use strict';

    // Add styles using GM_addStyle
    GM_addStyle(`
        .skill {
            max-width: 30px;
        }
        div.skill {
            padding-left: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        div.skill > span {
            display: block;
        }
        td.align_center, td.skill > div {
            font-weight: bold;
            text-shadow: 0 0 1px #000;
        }
        svg.drop-shadow {
            filter: drop-shadow(0 0 0.5px #000);
            vertical-align: middle;
        }

        .training.one_up, .training.one_down
        {
            font-size: unset;
            padding: 0 0 0 2px;
            border-color: #FFF;
        }
    `);

    // Main script logic
    setInterval(function(){
        $('.skill_table img[src$="/pics/star_silver.png"]').replaceWith('19');
        $('.skill_table img[src$="/pics/star.png"]').replaceWith('20');

        $('.hover img[src$="/pics/star_silver.png"]').replaceWith('19');
        $('.hover img[src$="/pics/star.png"]').replaceWith('20');

        function find_color(br){
            switch(br){
                case 1:
                case 2:
                case 3:
                    return "grey";
                case 4:
                case 5:
                case 6:
                    return "darkgrey";
                case 7:
                case 8:
                case 9:
                    return "lightgrey";
                case 10:
                case 11:
                case 12:
                    return "#f7fca3";
                case 13:
                case 14:
                case 15:
                    return "yellow";
                case 16:
                case 17:
                    return "#fea12a";
                case 18:
                case 19:
                    return "#ff7f24";
                case 20:
                    return "#ff6615";
                default:
                    return "";
            }
        }

        // Get the Table cells for the skills in both pages
        const td = $("td.align_center, td.skill > div");

        td.each(function() {
            const $this = $(this);
            const originalText = $this.text();
            const color = find_color(parseInt(originalText));

            // Apply the color from find_color function
            $this.css("color", color).removeClass("subtle");

            // Define SVG properties based on the class
            let svgColor, newClass;

            if ($this.hasClass("one_up") || $this.hasClass("d_arrow_up")) {
                svgColor = "white";
                newClass = "d_arrow_up";
                $this.css("color", "white");
            } else if ($this.hasClass("part_up") || $this.hasClass("s_arrow_up")) {
                svgColor = "#309430";
                newClass = "s_arrow_up";
            } else if ($this.hasClass("part_down") || $this.hasClass("s_arrow_down")) {
                svgColor = "#BB3030";
                newClass = "s_arrow_down";
            } else if ($this.hasClass("one_down") || $this.hasClass("d_arrow_down")) {
                svgColor = "white";
                newClass = "d_arrow_down";
                $this.css("color", "white");
            } else {
                svgColor = "transparent";
                newClass = ""; // No additional class
            }

            // Create the SVG element with appropriate color and add drop-shadow class
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="drop-shadow" viewBox="2 7 20 16" width="10" height="15">
                <path fill-rule="evenodd" clip-rule="evenodd" stroke="${svgColor}" stroke-linejoin="round"
                d="${newClass === "d_arrow_up" ? "M4 23L12 17L20 23 M4 13L12 7L20 13" :
                    newClass === "s_arrow_up" ? "M4 18L12 12L20 18" :
                    newClass === "s_arrow_down" ? "M4 12L12 18L20 12" :
                    newClass === "d_arrow_down" ? "M4 17L12 23L20 17 M4 7L12 13L20 7" : ""}" stroke-width="3"></path>
            </svg>`;

            // Update HTML and apply new classes
            $this.html("<span>" + originalText + "</span>" + svg).removeClass("part_up part_down");
            if (newClass) $this.addClass(newClass);
        });

    }, 500);
})();