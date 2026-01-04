// Auto advance to next page
// Save interim data to sessionStorage
// Download CSV file at the end
// This is a test version, 20th test

// ==UserScript==
// @name		PsychologyToday Scraper
// @description		Scrapes PsychologyToday profile details
// @namespace		GauravMisraPsych
// @author		keyvez
// @version		0.28_test_20
// @license MIT
// 
// @include		https://www.psychologytoday.com/*/therapists/*
// @run-at              document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/465175/PsychologyToday%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/465175/PsychologyToday%20Scraper.meta.js
// ==/UserScript==

(async () => {
    const j2c = (json, has_header) => {
        const items = json;
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(items[0]);
        const csv = [
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t'))
        ];
        if (has_header) {
            csv.unshift(header.join('\t')); // header row first
        }

        return csv.join('\r\n');
    };

    const waitForElm = selector => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    const download = (content, fileName, contentType) => {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const rndIn = (min, max) => Math.random() * (max - min) + min;

    const ift = (e) => e?.length && e.length > 0 ? e.item(0).innerText.trim() : '';

    const close = () => { e = document.querySelector("div.details-overlay > div.details-nav-lg > div.details-nav.details-close"); e?.click(); }

    const findDetails = (details, name) => details.find(e => e.querySelector(".profile-title").innerText === name);

    var rows = [];
    // Keep only the 1st element in results
    const scrape = async () => {
        const results = Array.from(document.getElementsByClassName('results-row-info'));

        for (var i = 0; i < results.length; i++) {
            var r = results[i];
            var name = r.querySelector("div.results-row-info > a").innerText;
            close();
            await sleep(50);
            r.click();
            await sleep(rndIn(2500, 28500));
            var details = Array.from(document.querySelectorAll('.details-sections.overlay:not(.loading)'));
            var e = findDetails(details, name);
            while (e == null) {
                details = Array.from(document.querySelectorAll('.details-sections.overlay:not(.loading)'));
                e = findDetails(details, name)
                await sleep(10);
            }
            var _g = (e, s) => e.getElementsByClassName(s);
            const title = ift(_g(e, 'profile-title'));
            const fees = ift(_g(e, 'at-a-glance_row--fees'));
            const profile_suffixes = ift(_g(e, 'profile-suffixes'));
            const primary_address = ift(_g(e, 'at-a-glance_row--primary-loc'));
            const secondary_address = ift(_g(e, 'at-a-glance_row--secondary-loc'));
            const endorsement_count = ift(_g(e, 'endorsement-count'));
            const appts = ift(_g(e, 'at-a-glance_row at-a-glance_row--appointments'));
            const attrs = ift(_g(e, 'at-a-glance_row at-a-glance_row--attributes'));
            const pronouns = ift(_g(e, 'profile-pronouns'));
            const client_focus = ift(_g(e, 'at-a-glance_row at-a-glance_row--client-focus'));
            const payment_methods = ift(_g(e, 'payment-methods'));
            const qualifications = ift(_g(e, 'qualifications-list section-list'));
            const insurance = ift(_g(e, 'insurance'));
            const finance_section = ift(_g(e, 'finance-section'));
            const area_levels = ift(_g(e, 'area-levels'));
            const availability = ift(_g(e, 'at-a-glance_row at-a-glance_row--availability'));
            const specialties = ift(document.querySelector("#specialty-attributes-section > div:nth-child(2)"));
            const expertise = ift(document.querySelector("#specialty-attributes-section > div:nth-child(3)"));
            const therapies = ift(document.querySelector("#treatment-approach-attributes-section > div > ul"));

            rows.push({
                title,
                fees,
                profile_suffixes,
                endorsement_count,
                appts,
                attrs,
                client_focus,
                payment_methods,
                insurance,
                specialties,
                expertise,
                therapies,
                availability,
                primary_address,
                secondary_address,
                pronouns,
                qualifications,
                finance_section,
                area_levels
            });
            close();
        }
    }
    var previousCsvData = await window.sessionStorage.getItem('csv');
    var pageCount = await window.sessionStorage.getItem('pageCount');
    if (pageCount === null) {
        pageCount = 0;
    }
    const startOrContinueScraping = async () => {
        addPageProgress(parseInt(pageCount));
        await scrape(); // This function will scrape the data and take the longest time
        var newCsvData = '';
        if (previousCsvData === null) {
            newCsvData = j2c(rows, true);
        } else {
            // If the csvData is already present, then don't prepend a header row to it
            newCsvData = j2c(rows, false);
        }
        const csvData = previousCsvData !== null ? previousCsvData + '\n' + newCsvData : newCsvData;
        await window.sessionStorage.setItem('csv', csvData);
        goToNextPageOrEndScraping();
    }

    const addScrapeBtn = () => {
        var btn = document.createElement("BUTTON");
        btn.innerHTML = "Scrape and Download";
        btn.style = "position: fixed; top: 0; left: 0; z-index: 9999; background: #fff; border: 1px solid #000; padding: 10px;";
        btn.onclick = startOrContinueScraping;
        document.body.appendChild(btn);
    }

    const goToNextPageOrEndScraping = async () => {
        // Select the parent with class .button-element.arrow-btn.page-btn that has a child with aria-label as "Next"
        const nextButton = document.querySelector(".button-element.arrow-btn.page-btn > [aria-label='Next']");
        if (nextButton !== null) {
            pageCount = parseInt(pageCount) + 1;
            await window.sessionStorage.setItem('pageCount', pageCount);
            nextButton.parentElement.click();
        } else {
            const csvData = await window.sessionStorage.getItem('csv');
            download(csvData, 'psychology_today_therapists.csv', 'text/csv');
            addDoneGif();
            cleanup();
        }
    }

    const cleanup = () => {
        // Remove in progress element
        document.getElementById('scraping-in-progress-gif').remove();
        addPageProgress(parseInt(pageCount)+1);
        window.sessionStorage.removeItem('csv');
        window.sessionStorage.removeItem('pageCount');
    }

    const addScrapingInProgress = () => {
        // Show a loading spinner gif
        var img = document.createElement("img");
        img.id = 'scraping-in-progress-gif';
        img.src = "https://media.giphy.com/media/Bx59V7wA8ONjVYCzE8/giphy.gif";
        img.style = "position: fixed; top: 0; left: 0; z-index: 9999; background: #fff; border: 1px solid #000; padding: 10px;";
        document.body.appendChild(img);
    }

    const addPageProgress = (pageNum) => {
        // Show a loading spinner gif
        var div = document.createElement("div");
        div.innerText = `Page ${pageNum}`;
        div.id = 'scraping-status-div';
        div.src = "https://media.giphy.com/media/Bx59V7wA8ONjVYCzE8/giphy.gif";
        div.style = "position: fixed; top: 500px; left: 0; z-index: 9999; background: #fff; border: 1px solid #000; padding: 10px; font-size: 80px;";
        document.body.appendChild(div);
    }
    
    const addDoneGif = () => {
        // Show a loading spinner gif
        var img = document.createElement("img");
        img.src = "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif";
        img.style = "position: fixed; top: 0; left: 0; z-index: 9999; background: #fff; border: 1px solid #000; padding: 10px;";
        document.body.appendChild(img);
    }

    if (previousCsvData !== null) {
        // If the csvData is already present, then we are in a scraping session, so don't add a button that says "Scrape and Download" instead add an element that says "scraping in progress"
        addScrapingInProgress();
        startOrContinueScraping();
    } else {
        addScrapeBtn();
    }
})();