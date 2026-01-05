// ==UserScript==
// @name        Wanikani Review SRS/Level Indicator
// @namespace   mempo
// @author      Megamind
// @description Show current SRS level of the item you are reviewing
// @run-at      document-end
// @match       https://www.wanikani.com/subjects/review*
// @match       http://www.wanikani.com/subjects/review*
// @version     2.2
// @run-at      document-end
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/15582/Wanikani%20Review%20SRSLevel%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/15582/Wanikani%20Review%20SRSLevel%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const append_css = (css) => {
        const head_element = document.getElementsByTagName("head")[0];
        const style_element = document.createElement("style");
        style_element.setAttribute("type", "text/css");
        style_element.setAttribute("id", "showsrs_css");
        style_element.appendChild(document.createTextNode(css));
        head_element.appendChild(style_element);
    }

    const CONTAINER_CLASSNAME = "showsrs__container";
    const CIRCLE_CLASSNAME = "showsrs__circle";

    const srs_stages = {
        A1: 1,
        A2: 2,
        A3: 3,
        A4: 4,
        G1: 5,
        G2: 6,
        M: 7,
        E: 8,
    };

    const colours = {
        APPRENTICE: "221, 0, 147",
        GURU: "135, 45, 158",
        MASTER: "41, 77, 219",
        ENLIGHTENED: "0, 147, 221",
        DEFAULT: "255, 255, 255",
    }

    const TRANSPARENCY = 1.0;

    // Declare id_to_srs in the broader scope
    let id_to_srs = {};

    // Create object mapping item id to srs stage
    const id_srs_element = document.querySelector("script[data-quiz-queue-target=\"subjectIdsWithSRS\"]");

    if (!id_srs_element) {
        console.error("Failed to find the expected script element with data-quiz-queue-target=\"subjectIdsWithSRS\"");
        return;
    }

    try {
        const id_srs_data = JSON.parse(id_srs_element.innerHTML);

        // Extract the relevant part of the data
        const id_srs_array = id_srs_data.subject_ids_with_srs_info;

        if (Array.isArray(id_srs_array)) {
            // Convert to a mapping of id => srs stage
            id_to_srs = Object.fromEntries(id_srs_array.map(item => [item[0], item[1]]));
        } else {
            console.error("Parsed data is not in the expected format:", id_srs_data);
            return;
        }

    } catch (error) {
        console.error("Error parsing JSON or converting entries:", error);
        return;
    }

    // Create container for circle indicators
    const meaning_element = document.getElementsByClassName("quiz-input__input-wrapper");
    if (meaning_element[0]) {
        const container = document.createElement("div");
        container.className = CONTAINER_CLASSNAME;
        meaning_element[0].insertBefore(container, meaning_element[0].firstChild);

        append_css(`
        .${CONTAINER_CLASSNAME} {
            display: flex;
            justify-content: center;
            gap: 5px;
            padding-top: 10px;
        }

        .${CIRCLE_CLASSNAME} {
            width: 10px;
            height: 10px;
            border: 2px solid;
            border-radius: 50%;
        }`);

        // Append and create 8 circles to container
        for (const [key, value] of Object.entries(srs_stages)) {
            const circle = document.createElement("div");
            circle.className = CIRCLE_CLASSNAME;

            if (value <= srs_stages.A4) {
                circle.style.borderColor = `rgba(${colours.APPRENTICE}, ${TRANSPARENCY})`;
            } else if (value <= srs_stages.G2) {
                circle.style.borderColor = `rgba(${colours.GURU}, ${TRANSPARENCY})`;
            } else if (value == srs_stages.M) {
                circle.style.borderColor = `rgba(${colours.MASTER}, ${TRANSPARENCY})`;
            } else if (value == srs_stages.E) {
                circle.style.borderColor = `rgba(${colours.ENLIGHTENED}, ${TRANSPARENCY})`;
            }

            container.appendChild(circle);
        }

        const update_circle = (circle, stage) => {
            if (stage <= srs_stages.A4) {
                circle.style.backgroundColor = `rgba(${colours.APPRENTICE}, ${TRANSPARENCY})`;
            } else if (stage <= srs_stages.G2) {
                circle.style.backgroundColor = `rgba(${colours.GURU}, ${TRANSPARENCY})`;
            } else if (stage == srs_stages.M) {
                circle.style.backgroundColor = `rgba(${colours.MASTER}, ${TRANSPARENCY})`;
            } else if (stage == srs_stages.E) {
                circle.style.backgroundColor = `rgba(${colours.ENLIGHTENED}, ${TRANSPARENCY})`;
            }
        }

        const circles = document.getElementsByClassName(CIRCLE_CLASSNAME);

        window.addEventListener("willShowNextQuestion", (e) => {
            if (e.detail && e.detail.subject && e.detail.subject.id) {
                const item_id = e.detail.subject.id;

                if (id_to_srs.hasOwnProperty(item_id)) {
                    const srs_stage = id_to_srs[item_id];
                    for (let i = 0; i < circles.length; i++) {
                        const corrected_index = i + 1;
                        if (corrected_index <= srs_stage) {
                            update_circle(circles[i], corrected_index);
                        } else {
                            circles[i].style.backgroundColor = "";
                        }
                    }
                } else {
                    console.error("SRS stage not found for item ID:", item_id);
                }
            } else {
                console.error("Invalid event detail structure:", e.detail);
            }
        });
    } else {
        console.error("Meaning element not found.");
    }

})();