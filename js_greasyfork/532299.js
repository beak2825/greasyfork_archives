// ==UserScript==
// @name         Torn - Chat 3.0 scale
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  MAKE CHAT SMALL AGAIN
// @match        *.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532299/Torn%20-%20Chat%2030%20scale.user.js
// @updateURL https://update.greasyfork.org/scripts/532299/Torn%20-%20Chat%2030%20scale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let storedScale = localStorage.getItem('tornChatScale');
    let scaleFactor = storedScale !== null ? Number(storedScale) / 100 : 0.75;

    function setupButtons() {
        const containers = document.querySelectorAll('.root___oWxEV, .root___VXwBe, .root___FmdS_');
        if (containers.length > 0) {
            containers.forEach(container => {
                const buttons = container.querySelectorAll('button');
                buttons.forEach(button => {
                    button.style.zoom = scaleFactor;
                });
            });
        }
        const settingsButton = document.getElementById('notes_settings_button');
        if (settingsButton) {
            settingsButton.style.zoom = scaleFactor;
        }
    }

    setupButtons();
    // (Optional) Periodically reapply scaling:
    // setInterval(setupButtons, 2000);

    function updateSliderBackground(slider) {
        slider.style.background = `linear-gradient(to right, var(--chat-range-progress-color-default) ${slider.value}%, var(--chat-range-range-color) ${slider.value}%, var(--chat-range-range-color) 100%)`;
    }

    function addScaleSlider() {
        const panelContainer = document.querySelector('.panelSizeContainer___GDkgR');
        if (!panelContainer) {
            return;
        }
        if (panelContainer.querySelector('.myScaleSliderContainer')) {
            return;
        }

        const div = document.createElement('div');
        div.className = 'root___LWwz7 myScaleSliderContainer';

        const label = document.createElement('label');
        label.className = 'root___xn40j subtitle___ETd9T label___m2p4Q';
        label.textContent = `Scale (${scaleFactor * 100}%)`;

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '0';
        input.max = '100';
        input.step = '1';
        input.value = (scaleFactor * 100).toString();
        input.className = 'range___Y37JR';

        const existingSlider = panelContainer.querySelector('.range___Y37JR');
        if (existingSlider) {
            const sliderStyle = existingSlider.getAttribute('style') || "";
            input.setAttribute('style', sliderStyle);
        }

        updateSliderBackground(input);
        div.appendChild(label);
        div.appendChild(input);
        panelContainer.appendChild(div);

        input.addEventListener('input', function() {
            scaleFactor = Number(input.value) / 100;
            localStorage.setItem('tornChatScale', input.value);
            updateSliderBackground(input);
            setupButtons();
            label.textContent = `Scale (${input.value}%)`;
        });
    }

    function attachObservers() {
        const containers = document.querySelectorAll('.root___oWxEV, .root___VXwBe, .root___FmdS_');
        containers.forEach(container => {
            const observer = new MutationObserver(mutations => {
                setupButtons();
            });
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true
            });
        });
    }

    attachObservers();

    function attachSettingsButtonListener() {
        const settingsButton = document.getElementById('notes_settings_button');
        if (settingsButton) {
            settingsButton.addEventListener('click', function() {
            setTimeout(addScaleSlider, 500);
            });
        }
    }

    attachSettingsButtonListener();
    setTimeout(attachSettingsButtonListener, 1000);

})();
