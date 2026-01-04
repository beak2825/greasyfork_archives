// Auto advance to next page
// Save interim data to sessionStorage
// Download CSV file at the end
// This is a test version, test 3
 
// ==UserScript==
// @name		Zillow Scraper
// @description		Scrapes Zillow home details
// @namespace		KeyvezZillow
// @author		keyvez
// @version		0.1_test_3
// @license MIT
// 
// @include		https://www.zillow.com/homes/*
// @run-at              document-idle
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/465545/Zillow%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/465545/Zillow%20Scraper.meta.js
// ==/UserScript==
 
(async () => {
    const articleQuery = '[data-test=property-card]:not(.nav-ad-empty)';
    const closeArticleQuery = '.sc-gsDKAQ.hDhDYS.sc-pVTFL.ekvCE';
    const detailQuery = '.layout-container';
    const nextButtonQuery = '.PaginationNumberItem-c11n-8-85-1__sc-bnmlxt-0.eKbbwc';
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
 
    const close = () => { e = document.querySelector(closeArticleQuery); e?.click(); }
 
    var rows = [];
    // Keep only the 1st element in results
    const scrape = async () => {
        const results = Array.from(document.querySelectorAll(articleQuery));
 
        for (var i = results.length - 1; i < results.length; i++) {
            var r = results[i];
            close();
            await sleep(50);
            r.querySelector('[data-test=property-card-price]').click();
            await sleep(rndIn(2500, 28500));
            var _d = (e, s) => e.querySelector(`[data-test='${s}']`);
            var e = document.querySelector(detailQuery);
            const addr = ift(_d(r, 'property-card-addr'));
            const price = ift(_d(e, 'price'));
            const bed_bath = ift(_d(e, 'bed-bath-item'));
            const desc = ift(e.querySelector('.Text-c11n-8-84-0__sc-aiai24-0.sc-cZMNgc.fsXIkY.fvaIwQ'));
            const type = ift(e.querySelector('.Text-c11n-8-84-0__sc-aiai24-0.dpf__sc-2arhs5-3.fsXIkY.btxEYg'));
            const tags = Array.from(e.querySelectorAll('.StyledTag-c11n-8-84-0__sc-1945joc-0.fqXOne.hdp__sc-ld4j6f-1.WDKcH')).map(e => e.innerText).join('\n');
            const listed_days = ift(e.querySelector('div > div > div > div > div > div > dl > dt:nth-child(1) > strong'));
            const property_details = e.querySelectorAll('.Spacer-c11n-8-84-0__sc-17suqs2-0.cOwviX').map(e => e.innerText).join('\n');
 
            rows.push({
                addr,
                price,
                bed_bath,
                desc,
                type,
                tags,
                listed_days,
                property_details
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
        const nextButton = document.querySelector(nextButtonQuery);
        if (nextButton !== null) {
            pageCount = parseInt(pageCount) + 1;
            await window.sessionStorage.setItem('pageCount', pageCount);
            nextButton.parentElement.click();
        } else {
            const csvData = await window.sessionStorage.getItem('csv');
            download(csvData, 'zillow_homes.csv', 'text/csv');
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