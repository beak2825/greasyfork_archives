// ==UserScript==
// @name         XING companies parser
// @description  Works through all pages of a shown company overview page on XING and formats the copied output to be pasted into spreadsheets.
// @author       Lucas A. Metzen
// @namespace    ALMdoc
// @version      1.1
// @match        https://www.xing.com/search/companies*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/420183/XING%20companies%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/420183/XING%20companies%20parser.meta.js
// ==/UserScript==

const tab = '	';

var counter,
    textForExcel = '',
    scraperRunning = false,
    eventListenerRegistered = false;

function registerMenuCommands() { // register menu entry
    GM_registerMenuCommand("start scraping for companies", startScrapingForCompanies, "a");
    GM_registerMenuCommand("stop & copy crape result", stopScrapingForCompanies, "o");
}
registerMenuCommands(); // register menu entries for the first time



function copyToClipboard(text) {
    // based on https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery

    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var origSelectionStart, origSelectionEnd;

    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
        var target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = targetId;
        document.body.appendChild(target);
    }
    target.textContent = text;

    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    // clear temporary content
    target.textContent = "";
    return succeed;
}

function startScrapingForCompanies() {
    scraperRunning = true;
    textForExcel = '';
    counter = 0;
    alert('Scraping started. Click the "next page" arrow when it turns green.');
    scrapePageForCompanies(); // run this for the currently shown page

/*    let nextPage;
    do {
        scrapePageForCompanies(); // run this for the currently shown page
        nextPage = nextPage();
    }
    while (nextPage);*/

    //nextPage = nextPage();
//    nextPage.click();
    if (window.onurlchange === null) {
        if (eventListenerRegistered) return;

        window.addEventListener('urlchange', (info) => {
            eventListenerRegistered = true;
            if (!scraperRunning) return;

            waitUntilListHasLoadedThenScrapePage();
        });
    } else {
        alert('This browser / version is not supported. Try using Chrome, at least version 86.');
    }

}

function stopScrapingForCompanies() {
    scraperRunning = false;
    copyToClipboard(textForExcel);
    alert('Scraping result for ' + counter + ' companies copied to clipboard.');
}


function scrapePageForCompanies() {
    if (!scraperRunning) return;

    let list = $('div[role="list"]'),
        companies = $('div[class*="search-card-style-container"]');

    companies.each(function(){
        let company = $('div[class*="search-card-style-content"]', this), //.replace('&amp;', '&'),
            title = $('div[class*="search-card-style-title"]', company).text(),
            location = $('div:nth-child(2)', company).text().split(', '),
            city = location[0],
            state = location[1],
            size = $('div:nth-child(4)', company).text().replace('Unternehmensgröße: ', '').replace(' Mitarbeiter', ''),
            xingLink = company.parent().parent().parent().attr('href');
        xingLink = xingLink.replace('%C3%A4', 'ä').replace('%C3%B6', 'ö').replace('%C3%BC', 'ü').replace('%C2%AE', '®');
        textForExcel += title + tab + tab + size + tab + tab + city + tab + state + tab + tab + tab + tab + tab + tab + tab + tab + xingLink + '\n';
        counter++;
    });

    let nextPage = nextPageLink();
    if (nextPage.length == 1) {
        nextPage.css("background-color", "green");
    } else {
        stopScrapingForCompanies();
    }
}

function nextPageLink() {
    let pagination = $('div[class*="Results-Results-paginationContainer"]'),
        arrows = $('a[class*="malt-pagination-Pagination-link"]', pagination);
    if (arrows.length == 0) return false;

    let leftArrow = arrows.first(),
        rightArrow = arrows.last();
    if (rightArrow.attr('class').toString().indexOf('hideArrow')>-1) return false;

    return rightArrow;
}

function waitUntilListHasLoadedThenScrapePage() {
    setTimeout(function(){
        let list = $('div[role="list"]');
        if (list.length == 1) {
            scrapePageForCompanies();
        } else {
            waitUntilListHasLoadedThenScrapePage();
        }
    }, 200)
}
