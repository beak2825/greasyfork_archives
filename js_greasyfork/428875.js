// ==UserScript==
// @name         Prolific Filter and Sorter
// @namespace    https://gist.github.com/Kadauchi
// @version      0.1.0
// @description  Allows users to sort studies.
// @author       Kadauchi
// @include      https://app.prolific.co/*
// @downloadURL https://update.greasyfork.org/scripts/428875/Prolific%20Filter%20and%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/428875/Prolific%20Filter%20and%20Sorter.meta.js
// ==/UserScript==

const options = {
    peripheral_requirements: [], // audio, camera, download, microphone
    sort: 'average_reward_per_hour', // average_reward_per_hour, average_completion_time, reward
};

let results = {};

function handleSorting() {
    const sorted = results.sort((a, b) => {
        return b[options.sort] - a[options.sort];
    });

    const list = document.querySelector('.list');

    sorted.forEach((result) => {
        const study = document.querySelector(`[data-testid="study-${result.id}"]`);
        list.append(study);
    });
}

function handleFiltering() {
    results.forEach((result) => {
        const studyFiltered = options.peripheral_requirements.some((requirement) => result.peripheral_requirements.includes(requirement));

        if (studyFiltered) {
            const study = document.querySelector(`[data-testid="study-${result.id}"]`);
            study.style.opacity = '0.25';
        }
    });
}

function initListener() {
    const open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', () => {
            try {
                const json = JSON.parse(this.responseText);

                if (json.results && json.results.length > 0) {
                    results = json.results;
                }
            } catch {}
        });

        open.apply(this, arguments);
    };
}

function initObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes) {
                const studyAdded = [...mutation.addedNodes].some((node) => node.className === 'list');

                if (studyAdded) {
                    handleSorting();
                    handleFiltering();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}


initListener();
initObserver();
