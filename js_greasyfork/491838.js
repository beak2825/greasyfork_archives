// ==UserScript==
// @name         Strudel Sounds Organizer
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Organizes the Strudel sounds panel into a list and provides a text filter
// @author       Zetaphor
// @match        https://strudel.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=strudel.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491838/Strudel%20Sounds%20Organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/491838/Strudel%20Sounds%20Organizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let listDiv = null;
    let buttonsDiv = null;
    let filterInput = null;
    let soundsTab = null
    let installed = false;

    function formatSoundList() {
        if (soundsTab) {
            const soundsItems = listDiv.querySelectorAll('#sounds-tab div:nth-of-type(2) span');

            soundsItems.forEach(span => {
                span.style.display = 'block';
            });
        }
    }

    function setup() {
        if (!soundsTab) soundsTab = document.querySelector('#sounds-tab');


        filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.id = 'spanFilterInput';
        filterInput.placeholder = 'Filter sounds...';
        filterInput.addEventListener('input', filterSounds);
        filterInput.style.color = 'black';

        listDiv = soundsTab.querySelector('#sounds-tab div:nth-of-type(2)');
        listDiv.insertBefore(filterInput, listDiv.firstChild);

        buttonsDiv = soundsTab.querySelector('#sounds-tab div:nth-of-type(1)');

        const buttons = buttonsDiv.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', buttonClick);
        });

    }

    function filterSounds() {
        const filterText = filterInput.value.toLowerCase();
        const soundsItems = listDiv.querySelectorAll('#sounds-tab div:nth-of-type(2) span');

        soundsItems.forEach(span => {
            if (span.textContent.toLowerCase().includes(filterText)) {
                span.style.display = 'block';
            } else {
                span.style.display = 'none';
            }
        });
    }

    function buttonClick() {
        setTimeout(function() {
            filterSounds();
        }, 100);
    }

    function observerCallback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && document.querySelector('#sounds-tab')) {
                if (installed) return;
                installed = true;
                setup();
                formatSoundList();
                observer.disconnect();
            }
        }
    }

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });
})();