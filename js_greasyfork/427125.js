// ==UserScript==
// @name         Updated WaniKani Unobtrusive Kanji Stroke Order
// @namespace    joshuacancellier
// @version      1.3.0
// @description  An unobtrusive Kanji Stroke Order display for WaniKani
// @author       atzkey
// @include      /^https://((www|preview)\.)?wanikani\.com/(kanji|vocabulary)/.+$/
// @include      /^https://((www|preview)\.)?wanikani\.com/(lesson|review)/session/
// @include
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427125/Updated%20WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/427125/Updated%20WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ksoFont = 'KanjiStrokeOrders';
    const ksoStyle = document.createElement('style');
    ksoStyle.innerHTML = `
      .kanji-icon.enlarge-hover, .vocabulary-icon.enlarge-hover {
        font-family: "${ksoFont}";
        font-weight: normal;
      }

      #main-info.vocabulary #character.kso, #main-info.kanji #character.kso{
        font-family: "${ksoFont}";
        font-size: 8em !important;
        font-weight: normal;
      }

      #character > span.kso {
        font-family: "${ksoFont}";
        font-size: 2em !important;
        font-weight: normal;
      }
    `;
    const lessonCharacterSelector = '#main-info.vocabulary #character, #main-info.kanji #character, #character > span';

    function wkAlert(text) {
        const search = document.getElementById('search');
        const anchor = search.parentNode;

        let alert = document.createElement('div');
        alert.className = 'alert alert-error fade in';
        alert.innerHTML = `
          <a class="close" data-dismiss="alert" href="#">x</a>
          <i class="icon-exclamation-sign"></i>
          ${text}
        `;

        anchor.insertBefore(alert, search);
    }

    function isFontAvailable(fontName) {
        let canvas = document.createElement("canvas");
        canvas.width = 1000;

        let context = canvas.getContext("2d");

        // the text whose final pixel size I want to measure
        let text = "Font availability detection, 0123456789!?.";

        let checks = ['monospace', 'sans-serif', 'serif'].map((fontFamily) => {
            // specifying the baseline font
            context.font = "72px " + fontFamily;

            // checking the size of the baseline text
            let baselineSize = context.measureText(text).width;

            // specifying the font whose existence we want to check
            context.font = "72px '" + fontName + "', " + fontFamily;

            // checking the size of the font we want to check
            let newSize = context.measureText(text).width;

            return newSize !== baselineSize;
        });

        return checks.find((x) => x);
    }

    function handleLessonKsoToggle(e) {
        e.target.classList.toggle('kso');
    }

    if (isFontAvailable(ksoFont)) {
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(ksoStyle);

        let observer = new MutationObserver(function(mutations) {
            const character = document.querySelector(lessonCharacterSelector);
            if (character) {
                character.addEventListener('click', handleLessonKsoToggle);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        wkAlert(`Download and install <a href="http://www.nihilist.org.uk/">Kanji Stroke Order font</a>.`);
    }
})();
