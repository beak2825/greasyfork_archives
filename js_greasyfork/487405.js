// ==UserScript==
// @name         Wanikani: Show SRS Level In Reviews
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Self explanatory
// @author       Whoever can be bothered
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487405/Wanikani%3A%20Show%20SRS%20Level%20In%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/487405/Wanikani%3A%20Show%20SRS%20Level%20In%20Reviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url_array = window.location.pathname.split("/");
    const url_last = url_array[url_array.length - 1];

    if (url_last != "review") {
        return; // do not run script unless we're on the review page
    }

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
    const STAGE_CLASSNAME = "showsrs__stage";
    const SPACER_CLASSNAME = "showsrs__spacer";

    let current_srs_stage = 1;
    let current_srs_stats = 0;

    const srs_stages = {
        A1: 1,
        A2: 2,
        A3: 3,
        A4: 4,
        G1: 5,
        G2: 6,
        M: 7,
        E: 8,
        B: 9,
    };

    const spacer_positions = [4, 6, 7, 8]

    const srs_names = {
      [1]: 'Apprentice I',
      [2]: 'Apprentice II',
      [3]: 'Apprentice III',
      [4]: 'Apprentice IV',
      [5]: 'Guru I',
      [6]: 'Guru II',
      [7]: 'Master',
      [8]: 'Enlightened',
      [9]: 'Burned',
    }

    const srs_timings = {
      [1]: '4 hours',
      [2]: '8 hours',
      [3]: '1 day',
      [4]: '2 days',
      [5]: '1 week',
      [6]: '2 weeks',
      [7]: '1 month',
      [8]: '4 months',
      [9]: 'Ever',
    }

    const colours = {
        APPRENTICE: "221, 0, 147",
        GURU: "135, 45, 158",
        MASTER: "41, 77, 219",
        ENLIGHTENED: "0, 147, 221",
        BURNED: "67, 67, 67",
        DEFAULT: "255, 255, 255",
    }

    const TRANSPARENCY = 1.0;

    // Create object mapping item id to srs stage
    const id_srs_element = document.querySelector("script[data-quiz-queue-target=\"subjectIdsWithSRS\"]");
    const id_srs_array = JSON.parse(id_srs_element.innerHTML);
    const id_to_srs = Object.fromEntries(id_srs_array);

    // Create container for circle indicators
    const meaning_element = document.getElementsByClassName("quiz-input__input-wrapper");
    const container = document.createElement("div");
    container.className = CONTAINER_CLASSNAME;
    meaning_element[0].insertBefore(container, meaning_element[0].firstChild);

    append_css(`
    .${CONTAINER_CLASSNAME} {
        display: flex;
        justify-content: center;
        gap: 5px;
    }

    .${STAGE_CLASSNAME} {
        padding-top: 10px;
        text-align: center;
    }

    .${SPACER_CLASSNAME} {
        width: 0px;
    }

    .${CIRCLE_CLASSNAME} {
        width: 12px;
        height: 12px;
        border: 2px solid;
        border-radius: 50%;
        transition: 0.6s all ease;
    }`);

    // Append and create 8 circles to container

    for (const [key, value] of Object.entries(srs_stages)) {
        const circle = document.createElement("div");
        circle.className = CIRCLE_CLASSNAME;
        circle.title = `${srs_names[value]} (${srs_timings[value]})`;

        if (value <= srs_stages.A4) {
            circle.style.borderColor = `rgba(${colours.APPRENTICE}, ${TRANSPARENCY})`;
        } else if (value <= srs_stages.G2) {
            circle.style.borderColor = `rgba(${colours.GURU}, ${TRANSPARENCY})`;
        } else if (value == srs_stages.M) {
            circle.style.borderColor = `rgba(${colours.MASTER}, ${TRANSPARENCY})`;
        } else if (value == srs_stages.E) {
            circle.style.borderColor = `rgba(${colours.ENLIGHTENED}, ${TRANSPARENCY})`;
        } else if (value == srs_stages.B) {
            circle.style.borderColor = `rgba(${colours.BURNED}, ${TRANSPARENCY})`;
        }

        container.appendChild(circle);

        if (spacer_positions.includes(value)) {
          const spacer = document.createElement('div')
          spacer.className = SPACER_CLASSNAME
          container.appendChild(spacer)
        }
    }

    const stage = document.createElement("div");
    stage.className = STAGE_CLASSNAME
    stage.textContent = 'Stage'
    container.before(stage)

    const update_circle = (circle, stage) => {
        if (stage <= srs_stages.A4) {
            circle.style.backgroundColor = `rgba(${colours.APPRENTICE}, ${TRANSPARENCY})`;
        } else if (stage <= srs_stages.G2) {
            circle.style.backgroundColor = `rgba(${colours.GURU}, ${TRANSPARENCY})`;
        } else if (stage == srs_stages.M) {
            circle.style.backgroundColor = `rgba(${colours.MASTER}, ${TRANSPARENCY})`;
        } else if (stage == srs_stages.E) {
            circle.style.backgroundColor = `rgba(${colours.ENLIGHTENED}, ${TRANSPARENCY})`;
        } else if (stage == srs_stages.B) {
            circle.style.backgroundColor = `rgba(${colours.BURNED}, ${TRANSPARENCY})`;
        }
    }

    const circles = document.getElementsByClassName(CIRCLE_CLASSNAME);

    window.addEventListener("willShowNextQuestion", (e) => {
        const item_id = e.detail.subject.id;
        const srs_stage = id_to_srs[item_id];
        current_srs_stage = srs_stage;
        stage.textContent = `${srs_names[srs_stage]}`;
        for (let i = 0; i < circles.length; i++) {
            const corrected_index = i + 1;
            if (corrected_index <= srs_stage) {
                update_circle(circles[i], corrected_index);
            } else {
                circles[i].style.backgroundColor = "";
            }
        }
    });

    window.addEventListener("didAnswerQuestion", (e) => {
      const { subjectWithStats } = e.detail
      const { stats } = subjectWithStats
      current_srs_stats = stats.meaning.incorrect + stats.reading.incorrect
    })

    window.addEventListener("didChangeSRS", (e) => {
      const { wentUp } = e.detail
      if (wentUp) {
        current_srs_stage += 1
      } else {
        const e = current_srs_stage >= 5 ? 2 : 1
        current_srs_stage = Math.max(1, current_srs_stage - e * Math.round(current_srs_stats / 2))
      }

      stage.textContent = srs_names[current_srs_stage] || current_srs_stage;

      for (let i = 0; i < circles.length; i++) {
            const corrected_index = i + 1;
            if (corrected_index <= current_srs_stage) {
                update_circle(circles[i], corrected_index);
            } else {
                circles[i].style.backgroundColor = "";
            }
        }
    })

})();