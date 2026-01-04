// ==UserScript==
// @name         Manga size Adjuster for Proxer
// @name:de      Manga größen Anpasser für Proxer
// @namespace    https://greasyfork.org/en/users/1200276-awesome4
// @author       Awesome
// @version      1
// @license      MIT
// @description  slider to adjust manga pages on Proxer.
// @description:de  Slider zum Anpassend der manga-seiten auf Proxer
// @match        *://proxer.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480882/Manga%20size%20Adjuster%20for%20Proxer.user.js
// @updateURL https://update.greasyfork.org/scripts/480882/Manga%20size%20Adjuster%20for%20Proxer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var siteConfig = {
        'proxer.me': {
            readerSelector: "#reader",
            imageSelector: "[id^='chapterImage']",
            wrapperSelector: "#wrapper",
            navigationSelector: "#readers"
        }
    };

    function createSlider(chapterImages, reader, navigationElement) {
        var sliderContainer = document.getElementById('mangaReaderSlider-proxer');
        if (!sliderContainer) {
            var slider = document.createElement("input");
            slider.id = 'mangaReaderAdjusterSlider';
            slider.type = "range";
            slider.min = "0";
            slider.max = "100";
            slider.value = localStorage.getItem("mangaWidth") || "100";
            slider.style.width = "250px";
            slider.style.display = "inline-block"; // Adjust style as needed
            slider.style.margin = "0 10px"; // Spacing around the slider

            slider.addEventListener("input", function() {
                updateImageSizes(chapterImages, reader, slider.value);
            });

            sliderContainer = document.createElement("div");
            sliderContainer.id = 'mangaReaderSlider-proxer';
            sliderContainer.style.display = "inline-block"; // Align with navigation items
            sliderContainer.appendChild(slider);

            navigationElement.insertBefore(sliderContainer, navigationElement.firstChild);
        }
        return sliderContainer;
    }

    function updateImageSizes(chapterImages, reader, value) {
        var sliderValue = parseInt(value) / 100;
        chapterImages.forEach(function(image) {
            image.style.maxWidth = "100%";
            image.style.height = "auto";
            image.style.width = (sliderValue * 100) + "%";
        });
        if (reader) {
            reader.style.width = (sliderValue * 100) + "%";
        }
        localStorage.setItem("mangaWidth", value);
    }

    function adjustWrapperMaxWidth(wrapperSelector) {
        var wrapper = document.querySelector(wrapperSelector);
        if (wrapper) {
            wrapper.style.maxWidth = 'none';
        }
    }

    function applyInitialSizeAdjustment(chapterImages, reader) {
        var savedValue = localStorage.getItem("mangaWidth") || "100";
        updateImageSizes(chapterImages, reader, savedValue);
    }

    window.addEventListener('load', function() {
        var config = siteConfig['proxer.me'];
        if (!config) return;

        var reader = document.querySelector(config.readerSelector);
        var chapterImages = document.querySelectorAll(config.imageSelector);
        var navigationElement = document.querySelector(config.navigationSelector);

        if (navigationElement) {
            var sliderContainer = createSlider(chapterImages, reader, navigationElement);
            applyInitialSizeAdjustment(chapterImages, reader);
        }

        adjustWrapperMaxWidth(config.wrapperSelector);
    });
})();