// ==UserScript==
// @name         LinkedIn filter
// @description  Filter jobs based on title, company and places
// @version      1.0
// @license      MIT
// @author       robertozanaboni
// @match        *://www.linkedin.com/*
// @grant        none
// @namespace https://greasyfork.org/users/99415
// @downloadURL https://update.greasyfork.org/scripts/418405/LinkedIn%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/418405/LinkedIn%20filter.meta.js
// ==/UserScript==
(function () {
    // Configuration starts
    var desiredTitles = []; // e.g. ['front end', 'ui engineer']
    var undesiredTitles = []; // e.g. ['full stack', 'manager']
    var desiredCompanies = []; // e.g. ['Tesla', 'SpaceX']
    var undesiredCompanies = []; // e.g. ['Facebook', 'Amazon']
    var undesideredPlaces = []; // e.g. ['Roma', 'Milano']
    // Configuration ends
    var debugMode = false;
    var desiredTitlesRegEx = new RegExp(desiredTitles.join('|'), 'i');
    var undesiredTitlesRegEx = new RegExp(undesiredTitles.join('|'), 'i');
    var desiredCompaniesRegEx = new RegExp(desiredCompanies.join('|'), 'i');
    var undesiredCompaniesRegEx = new RegExp(undesiredCompanies.join('|'), 'i');
    var undesiredLuogoRegEx = new RegExp(undesideredPlaces.join('|'), 'i');
    var jobTileSelector = 'li.artdeco-list__item';
    var jobTileTitleSelector = '.job-card-list__title';
    var jobCompanySelector = '.job-card-container__company-name';
    var jobCardSelector = 'li.card-list__item';
    var jobLuogoSelector = 'li.job-card-container__metadata-item';
        var jobCarouselCardSelector = 'li.jobs-search-results__list-item';
    var jobCardTitleSelector = '.job-card-square__title';
    var ghostCompanySelector = '.ghost-company';
    new MutationObserver(function (mutationRecords) {
        setTimeout(function () {
            mutationRecords.forEach(function (_a) {
                var addedNodes = _a.addedNodes;
                addedNodes.forEach(function (_a) {
                    var nodeType = _a.nodeType;
                    if (nodeType === Node.ELEMENT_NODE) {
                        document
                            .querySelectorAll(jobCardSelector + ", " + jobCarouselCardSelector + ", " + jobTileSelector)
                            .forEach(function (job) {
                            var title = job.querySelector(jobCardTitleSelector + ", " + jobTileTitleSelector);
                            var company = job.querySelector("" + jobCompanySelector);
                            var luogo = job.querySelector("" + jobLuogoSelector);

                            var ghostCompany = !!job.querySelector(ghostCompanySelector);
                            if (title &&
                                company &&
                                luogo &&
                                (ghostCompany ||
                                    (desiredTitles.length &&
                                        !desiredTitlesRegEx.test(title.textContent)) ||
                                    (undesiredTitles.length &&
                                        undesiredTitlesRegEx.test(title.textContent)) ||
                                 (undesideredPlaces.length &&
                                        undesiredLuogoRegEx.test(luogo.textContent)) ||
                                    (desiredCompanies.length &&
                                        !desiredCompaniesRegEx.test(company.textContent)) ||
                                    (undesiredCompanies.length &&
                                        undesiredCompaniesRegEx.test(company.textContent)))) {
                                if (debugMode) {
                                    job.style.border = 'solid red';
                                }
                                else {
                                    job.remove();
                                }
                            }
                        });
                    }
                });
            });
        });
    }).observe(document.body, { childList: true, subtree: true });
})();
