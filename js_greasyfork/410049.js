// ==UserScript==
// @name         Who is Hiring? jobs filter
// @description  Filter jobs based on title and location
// @namespace    https://greasyfork.org/en/users/673321-christianmemije
// @version      0.1.0
// @license      MIT
// @author       christianmemije
// @match        *://whoishiring.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410049/Who%20is%20Hiring%20jobs%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/410049/Who%20is%20Hiring%20jobs%20filter.meta.js
// ==/UserScript==
(function () {
    // Configuration starts
    var desiredTitles = []; // e.g. ['front end', 'ui engineer']
    var undesiredTitles = []; // e.g. ['full stack', 'manager']
    var desiredLocations = []; // e.g. ['San Francisco', 'remote']
    var undesiredLocations = []; // e.g. ['Canada', 'remote']
    // Configuration ends
    var debugMode = false;
    var desiredTitlesRegEx = new RegExp(desiredTitles.join('|'), 'i');
    var undesiredTitlesRegEx = new RegExp(undesiredTitles.join('|'), 'i');
    var desiredLocationsRegEx = new RegExp(desiredLocations.join('|'), 'i');
    var undesiredLocationsRegEx = new RegExp(undesiredLocations.join('|'), 'i');
    var jobSelector = '.ItemHeader';
    var jobTitleSelector = 'h1';
    var jobLocationSelector = '.address';
    var scrollWindowSelector = '.ItemsList';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    var checkboxId = 'whoIsHiringJobsFilterToggle';
    checkbox.id = checkboxId;
    var label = document.createElement('label');
    label.htmlFor = checkboxId;
    label.appendChild(document.createTextNode('Who is Hiring? jobs filter'));
    var wrapper = document.createElement('div');
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '8px';
    wrapper.style.left = '8px';
    wrapper.style.background = 'white';
    document.body.appendChild(wrapper);
    new MutationObserver(function (mutationRecords) {
        setTimeout(function () {
            mutationRecords.forEach(function (_a) {
                var addedNodes = _a.addedNodes;
                addedNodes.forEach(function (_a) {
                    var nodeType = _a.nodeType;
                    if (nodeType === Node.ELEMENT_NODE) {
                        document
                            .querySelectorAll(jobSelector)
                            .forEach(function (job) {
                            var title = job.querySelector(jobTitleSelector);
                            var location = job.querySelector(jobLocationSelector);
                            if (title &&
                                location &&
                                ((desiredTitles.length &&
                                    !desiredTitlesRegEx.test(title.textContent)) ||
                                    (undesiredTitles.length &&
                                        undesiredTitlesRegEx.test(title.textContent)) ||
                                    (desiredLocations.length &&
                                        !desiredLocationsRegEx.test(location.textContent)) ||
                                    (undesiredLocations.length &&
                                        undesiredLocationsRegEx.test(location.textContent)))) {
                                if (debugMode) {
                                    job.style.border = 'solid red';
                                    job.style.overflow = 'hidden';
                                    job.style.height = '1em';
                                }
                                else {
                                    job.remove();
                                }
                            }
                            var enabled = checkbox.checked;
                            if (enabled) {
                                var scrollWindow = document.querySelector(scrollWindowSelector);
                                scrollWindow.scrollTop = scrollWindow.scrollHeight;
                            }
                        });
                    }
                });
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
})();
