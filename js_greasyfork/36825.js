// ==UserScript==
// @name         WaniKani Unobtrusive Kanji Stroke Order
// @namespace    org.atzkey
// @version      1.4.1
// @description  An unobtrusive Kanji Stroke Order display for WaniKani
// @author       atzkey
//
// @match        https://*.wanikani.com/kanji/*
// @match        https://wanikani.com/kanji/*
//
// @match        https://*.wanikani.com/vocabulary/*
// @match        https://wanikani.com/vocabulary/*
//
// @match        https://*.wanikani.com/subjects/*/lesson*
// @match        https://wanikani.com/subjects/*/lesson*

// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36825/WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/36825/WaniKani%20Unobtrusive%20Kanji%20Stroke%20Order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ksoFont = 'KanjiStrokeOrders';
    const ksoStyle = document.createElement('style');
    ksoStyle.innerHTML = `
      .page-header__icon--kanji:hover, .page-header__icon--vocabulary:hover {
        font-family: "${ksoFont}";
        font-weight: normal;
      }

      .character-header__characters.kso {
        font-family: "${ksoFont}";
        font-weight: normal;
      }
    `;
    const lessonCharacterSelector = '.character-header__characters';

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

