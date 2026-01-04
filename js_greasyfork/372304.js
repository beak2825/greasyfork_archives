// ==UserScript==
// @name         Nonogram tweaker
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  A script for listing unsolved nonograms of a category
// @author       myklosbotond
// @match        http://www.nonograms.org/
// @match        http://www.nonograms.org/nonograms*
// @match        http://www.nonograms.org/nonograms2*
// @exclude      http://www.nonograms.org/nonograms/i/*
// @exclude      http://www.nonograms.org/nonograms2/i/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/372304/Nonogram%20tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/372304/Nonogram%20tweaker.meta.js
// ==/UserScript==

/*
 * jshint esversion: 6
 * jshint esnext: true
*/

const DEVELOPEMENT = false;
/*
FIXME: fix loading:
    - implement a hasChanged(): compare last page contents with cahce for last page
    - always parse current page to update array
    - on load all, query categories separately and update them on return
*/

const STAT_KEY = "ng_stats";

const TIME_LIMIT_IN_DAYS = 2;

(function () {
    'use strict';
    if (isFrontPage()) {
        runFrontPage();
    } else {
        runNonogramList();
    }

})();

function runFrontPage() {
    setupFrontHtml();

    const stats = getStatsFromStorage();
    updateUi(stats);
}

function runNonogramList() {
    setupListHtml();

    populateNonogramList();
}

//color in just the curs / laboratory column on unselected

function setupCss() {
    'use strict';

    //Insert the styles from the css:
    GM_addStyle(`
        .dashboard-item {
            border: 1px solid #b6b6b6;
            display: inline-block;
            padding: 5px;
            border-radius: 5px;
            min-width: 60px;
            text-align: center;
        }
        
        .dash-data {
            position: relative;
        }
        
        #dash-spinner {
            --size: 8px;
            --border: 3px;
            --inner-size: calc(var(--size) - 2 * var(--border));
            --color: #6d844f;
            --spin-dur: 1.5s;
            display: inline-block;
            position: absolute;
            left: 0;
            width: var(--size);
            height: var(--size);
            border: solid;
            border-color: var(--color) var(--color) transparent var(--color);
            border-width: var(--border);
            border-radius: 50%;
            animation: spin var(--spin-dur) infinite linear;
        }
        
        #dash-spinner::after {
            content: "";
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            width: var(--inner-size);
            height: var(--inner-size);
            border: solid;
            border-color: transparent var(--color) var(--color) var(--color);
            border-width: var(--border);
            border-radius: 50%;
            animation: spin calc(var(--spin-dur) / 2) infinite reverse linear;
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
        
            to {
                transform: rotate(360deg);
            }
        }
        
        .rel {
            position: relative;
        }
        
        #dashboard-header {
            margin-bottom: 10px;
        }
        
        #spinner-wrapper {
            position: relative;
            display: inline-block;
            width: 10px;
            height: 10px;
        }
        
        .faded {
            opacity: 0.5;
            filter: saturate(42%);
        }
        
        /*
        
        
        
        
        
        
        
        */
        
        :root {
            --transition-s: .3s;
        }
        
        #unsolved-list-wrapper {
            position: absolute;
            top: 275px;
            right: 50px;
        }
        
        #unsolved-list {
            list-style-type: none;
            padding: 0;
            max-height: 500px;
            overflow: auto;
        }
        
        #unsolved-counter {
            position: relative;
            display: inline-block;
            text-align: center;
            height: 11px;
            min-width: 17px;
        }
        
        
        @media (max-width: 1200px) {
            #unsolved-list-wrapper {
                position: relative;
                top: 0;
                right: 0;
                max-width: 500px;
            }
        
            #unsolved-list {
                max-height: 210px;
                margin-bottom: 14px;
                border-bottom: 1px solid;
            }
        }
        
        #unsolved-list li {
            text-align: center;
            border-bottom: 1px solid #eeeeee;
        }
        
        #unsolved-list li a {
            padding: 3px;
            display: block;
            transition-duration: var(--transition-s);
        }
        
        #unsolved-list li a:hover {
            background: #f4f4f4;
        }
        
        #unsolved-list li .page-link {
            padding: 6px 0;
        }
        
        li.page-link-li {
            border-bottom: 1px solid #9e9e9e !important;
        }
        
        a.page-link {
            color: #04259a;
            font-weight: bold;
        }
        
        #unsolved-list li:not(:last-child) {
            border-bottom: 1px solid #eeeeee;
        }
        
        .begun {
            position: relative;
        }
        
        .begun::after {
            content: "";
            display: inline-block;
            --size: 5px;
            width: var(--size);
            height: var(--size);
            background-color: #efc447;
            border-radius: 50%;
            position: absolute;
            top: 7px;
            margin-left: 4px;
            border: 1px solid #c4891d;
            transition-duration: var(--transition-s);
        }
        
        .begun:hover::after {
            background-color: #fad059;
            border-color: #dbc34e;
        }
    `);

}

if (!Array.prototype.last) {
    Array.prototype.last = function () {
        return this[this.length - 1];
    };
};

function toHex(num) {
    let hexString = num.toString(16);
    if (hexString.length % 2) {
        hexString = '0' + hexString;
    }

    return hexString;
}

/**
 * 
 * @param {*} url 
 * @returns { {type: string, size: string} } 
 * type and size information from url
 * or `null` if url is not of correct format
 */
function dataFromUrl(url) {
    const urlRegex = /(nonograms2?)\/size\/([a-z]*)(?:.*)?/;
    const matched = url.match(urlRegex);

    if (!matched) {
        return null;
    }

    return {
        type: matched[1],
        size: matched[2]
    };
}

function isFrontPage() {
    return window.location.pathname === "/";
}

function getCurrentBase() {
    'use strict';

    const regex = /\/p\/[0-9]+$/;
    return window.location.href.replace(regex, '');
}

function queryDatePassedLimit(date) {
    if (!date) {
        return true;
    }

    const ONE_DAY = 1000 * 60 * 60 * 24;
    const diff = (new Date() - new Date(date)) / ONE_DAY;

    return diff > TIME_LIMIT_IN_DAYS;
}

async function refreshStats() {
    startPending();

    const list = [...$(".dashboard-item")];
    const listDetails = await Promise.all(list.map(toDetailed));

    const detailsWithList = await fetchPagesForAll(listDetails);

    const finalDetails = await Promise.all(detailsWithList);
    saveStats(finalDetails);
    stopPending();
}

async function fetchPagesForAll(listDetails) {
    return listDetails.map(async details => await fetchPagesFor(details));
}

async function getFirstPageHtml(url) {
    const resp = await fetch(url);
    return await resp.text();
}

async function fetchAll(details) {
    return [...Array(details.lastPage).keys()]
        .map(async i => ({
            html: await fetch(`${details.href}/p/${i + 1}`)
                .then(resp => resp.text()),
            page: i + 1
        }));
}

async function toDetailed(item) {
    const $item = $(item);
    const href = $item.find("a").attr("href");

    const firstPageHtml = await getFirstPageHtml(href);
    const $html = $(firstPageHtml);

    const lastPage = getLastPage($html);
    const urldata = dataFromUrl(href);

    return {
        href,
        lastPage,
        type: urldata.type,
        size: urldata.size
    };
}

function extractList(pageData) {
    const $page = $(pageData.html);
    return [...$page.find(".nonogram_title")]
        .map(a => a.id)
        .map(id => parseInt(id.replace(/[^0-9]/g, ""), 10))
        .map(id => ({ page: pageData.page, id }));
}

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function populateNonogramList() {
    const stats = getStatsFromStorage();
    const data = dataFromUrl(location.href);
    const pageStats = stats[data.type][data.size];

    if (queryDatePassedLimit(pageStats.queried)) {
        startPageSpin();

        fetchCategoryDetails(data)
            .then(newPageStats => {
                saveSingleStat(newPageStats, data);

                const stats1 = getStatsFromStorage();
                const pageStats1 = stats1[data.type][data.size];

                refreshListUi(pageStats1, data);
            });
    } else {
        const currentPage = getCurrentPageList();
        const newIds = mergeIdList(pageStats.ids, currentPage);

        saveSingleStat_page(newIds, data);
        const stats1 = getStatsFromStorage();
        const pageStats1 = stats1[data.type][data.size];

        console.log("from cache");
        refreshListUi(pageStats1, data);
    }
}

async function fetchCategoryDetails(data) {
    const detail = {
        href: location.href,
        lastPage: getLastPage(),
        type: data.type,
        size: data.size
    };

    const detailPromise = await fetchPagesFor(detail);
    return await detailPromise;
}

async function fetchPagesFor(details) {
    const promises = await fetchAll(details);
    const pages = await Promise.all(promises);

    const puzzleList = pages
        .map(extractList)
        .reduce((acc, cur) => [...acc, ...cur], []);

    return {
        puzzleList,
        ...details
    };
}

function getLastPage($dom) {
    'use strict';

    return getPagingData($dom).total;


    // const navWrapper = $dom.find('.pager div');
    // const navLinks = navWrapper.children();
    // const lastLink = navLinks.last();
    // const lastText = lastLink.text();

    // const nextRegex = /Next/;

    // if (nextRegex.test(lastText)) {
    //     const lastNumber = navLinks.eq(-2);
    //     const lastNumText = lastNumber.text();
    //     if (lastNumText == '...') {
    //         const sPageNum = lastNumber.attr('href').match(/[0-9]+$/)[0];
    //         return parseInt(sPageNum, 10);
    //     }
    //     else {
    //         return parseInt(lastNumText, 10);
    //     }
    // } else {
    //     const sPageNum = lastText.replace(/[\[\]]/g, '');
    //     return parseInt(sPageNum, 10);
    // }
}

function getPagingData($dom) {
    'use strict';

    if (!$dom) {
        $dom = $("body");
    }

    const navSpan = $dom.find('.pager > span').eq(0);
    const navText = navSpan.text();
    const match = navText.match(/[^0-9]*([0-9]+)[^0-9]*([0-9]+)/);

    return {
        current: parseInt(match[1], 10),
        total: parseInt(match[2], 10)
    }
}

function getCurrentPageList() {
    'use strict';

    const pageData = {
        html: $('body').html(),
        page: getPagingData().current
    }

    return extractList(pageData);
}

function mergeIdList(original, newData) {
    const ids = newData.map(data => data.id);
    const pruned = original.filter(idEntry => !ids.includes(idEntry.id));

    const curPage = newData[0].page;
    let index = 0;
    while (index < pruned.length && pruned[index].page < curPage) {
        ++index;
    }

    pruned.splice(index, 0, ...newData);
    return pruned;
}

function refreshStatsAndUi() {
    refreshStats()
        .then(() => {
            updateUi(getStatsFromStorage());
        });
}

function getStatsFromStorage() {
    const base = getBaseStats();
    const stored = _getStatsFromStorage();

    if (!stored.v || stored.v != base.v) {
        return base;
    }

    return { ...base, ...stored };
}

function _getStatsFromStorage() {
    try {
        const savedStats = GM_getValue(STAT_KEY, "{}");
        return JSON.parse(savedStats);
    }
    catch (err) {
        return {};
    }
}

function getBaseStats() {
    return {
        v: 1,
        nonograms: {
            small: {
                queried: null,
                ids: []
            },
            medium: {
                queried: null,
                ids: []
            },
            large: {
                queried: null,
                ids: []
            }
        },
        nonograms2: {
            small: {
                queried: null,
                ids: []
            },
            medium: {
                queried: null,
                ids: []
            },
            large: {
                queried: null,
                ids: []
            }
        }
    };
}

function saveStats(details) {
    const stats = getBaseStats();
    const time = new Date();

    details.forEach(stat => {
        stats[stat.type][stat.size] = setDataForCategory(time, stat.puzzleList);
    });

    GM_setValue(STAT_KEY, JSON.stringify(stats));
}


function saveSingleStat(newPageStats, data) {
    const stats = getStatsFromStorage();
    stats[data.type][data.size] = setDataForCategory(new Date(), newPageStats.puzzleList)

    GM_setValue(STAT_KEY, JSON.stringify(stats));
}


function saveSingleStat_page(modifiedIds, data) {
    const stats = getStatsFromStorage();
    stats[data.type][data.size].ids = modifiedIds;

    GM_setValue(STAT_KEY, JSON.stringify(stats));
}

function setDataForCategory(queried, ids) {
    return {
        queried: queried,
        ids: ids
    };
}

function clearStats() {
    GM_setValue(STAT_KEY, "{}");
}


function setupFrontHtml() {
    const pages = [...$(".menu .menu_sub2")];
    const pageData = pages.map(li => {
        const $li = $(li);
        const $a = $li.find("a");

        const url = new URL($a.attr("href"));


        const data = dataFromUrl(url.href);

        return {
            href: url.href,
            path: url.pathname,
            title: $a.text().replace(/[^a-zA-Z]/g, ""),
            ...data
        }
    });

    setupCss();

    const html = `
        <div id="dashboard-wrapper">
            <div id="dashboard-header">
                <span>
                    Last updated: <span id="dashboard-updated"/> 
                </span>
                <button id="dash-refresh">Refresh</button>
                <span id="spinner-wrapper">
                    <span id="dash-spinner" />
                </span>
            </div>
            <div id="dashboard-items">
            ${pageData.map(page => `
                <div class="dashboard-item" id="item-${page.type}-${page.size}">
                    <a href="${page.href}">${page.title}</a>
                    <div class="dash-data">
                        <span>Solved: </span>
                        <br/>
                        <span class="dash-counter">?</span>
                    </div>
                </div>
                `).join("")}
            </div>
        </div>
    `;

    $(html).insertAfter(".content h1");
    $("#dash-spinner").hide();

    $("body").on("click", "#dash-refresh", () => refreshStatsAndUi());
}

function updateUi(stats) {
    const queried = stats.queried ? new Date(stats.queried) : null;

    $("#dashboard-updated")
        .text(queried ?
            `${queried.toLocaleDateString()} - ${queried.toLocaleTimeString()}`
            : "never");

    const types = ["nonograms", "nonograms2"];
    for (let type of types) {
        const sizes = stats[type];
        for (let size in sizes) {
            const currentSize = sizes[size];
            if (!currentSize.queried) {
                continue;
            }
            const list = currentSize.ids.map(item => item.id);

            const $item = $(`#item-${type}-${size}`);
            const solved = list.filter(id => usrsvl.includes(id));

            const solvedNo = solved.length;
            const totalNo = list.length;

            const colorModifier = Math.floor(255 * solvedNo / totalNo);
            const color = `#${toHex(255 - colorModifier)}${toHex(colorModifier)}00`;

            $item
                .find(".dash-counter")
                .html(`<span style="color: ${color}; font-weight:bold;">${solvedNo}</span>/${totalNo}`);
        }
    }
}

function startPending() {
    $("#dash-spinner").show();
    $("#dash-refresh").prop("disabled", true);
    $("#dashboard-items").addClass("faded");
}

function stopPending() {
    $("#dash-spinner").hide();
    $("#dash-refresh").prop("disabled", false);
    $("#dashboard-items").removeClass("faded");
}

function setupListHtml() {
    setupCss();

    const html = `
        <div id="unsolved-list-wrapper">
            <section id="unsolved-header">
                <h2>List of unsolved puzzles (<span id="unsolved-counter">0</span>):</h2>
            </section>
            <ul id="unsolved-list">
            </ul>
        </div>
    `;
    $('.content').prepend(html);
}

function refreshListUi(details, data) {
    const unsolved = details.ids
        .filter(idObj => !usrsvl.includes(idObj.id));

    const listHtml = unsolved
        .map(idObj => ({ url: `/${data.type}/i/${idObj.id}`, page: idObj.page }))
        .map(item => toLiFromUrl(item.url, item.page));

    const $list = $('#unsolved-list');
    $list.html(listHtml);
    $("#unsolved-counter").text(unsolved.length);

    addPageEntries(data);
}

function toLiFromUrl(url, pageNo) {
    const sId = url.match(/[0-9]+$/)[0];
    const begun = usrbgl.includes(parseInt(sId, 10));
    const clazz = begun ? 'begun' : '';

    return `<li data-page="${pageNo}">
            <a href="${url}" class="${clazz}">#${sId}</a>
        </li>`;
}

function addPageEntries(data) {
    const $list = $('#unsolved-list');
    const items = [...$list.find("li")];

    let processedPages = [];
    items.forEach(item => {
        const $item = $(item);
        const page = $item.attr("data-page");

        if (!processedPages.includes(page)) {
            processedPages.push(page);

            pageLi(data, page).insertBefore($item);
        }
    });
}

function pageLi(data, pageNo) {
    const pageUrl = `/${data.type}/size/${data.size}/p/${pageNo}`;
    return $(`<li class="page-link-li" data-page="${pageNo}">
            <a href="${pageUrl}" class="page-link">Page ${pageNo}:</a>
        </li>`);
}


function startPageSpin() {
    const counter = $("#unsolved-counter");
    counter.html('<span id="dash-spinner" />');
    counter.find("#dash-spinner").show();
}

