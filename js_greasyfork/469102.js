// ==UserScript==
// @name         Jira comments sort order switcher
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Ensures natural (i.e. Oldest first) sort order of comments in Jira (v9+) issues
// @author       pk
// @match        https://jira.lgi.io/browse/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469102/Jira%20comments%20sort%20order%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/469102/Jira%20comments%20sort%20order%20switcher.meta.js
// ==/UserScript==

const { setImmediate, clearImmediate } = window;

function correctSortOrder(expectedOrder = 'desc') {
    const sortButton = document.getElementById('sort-button');
    if (!sortButton) {
        console.warn('[order-switcher] cannot correct sort order, no sort button found!');
        return;
    }
    // console.log('[order-switcher] sortButton:', sortButton);

    const currentOrder = sortButton.getAttribute('data-order');
    if (currentOrder !== expectedOrder) {
        console.info(`[order-switcher] correcting sort order '${currentOrder}' -> '${expectedOrder}' ...`);
        sortButton.click();
    } else {
        console.info(`[order-switcher] sort order is already '${expectedOrder}', no need to correct it now`);
    }
}

function correctCommentsBlocksOrder() {
    const sortButton = document.getElementById('sort-button');
    if (!sortButton) return; // no sort button, nothing to do yet
    const currentOrder = sortButton.getAttribute('data-order');

    const commentsContainer = document.getElementById('threaded-comments-page-container');
    if (!commentsContainer) return; // no comments container, some exotic view
    const divs = commentsContainer.getElementsByClassName('threaded-comments-wrapper')[0];
    if (!divs) return; // no divs in comments container, some exotic view

    const filterWrapper = divs.getElementsByClassName('filter-wrapper')[0];
    const filterDiv = filterWrapper && filterWrapper.parentNode;
    if (!filterDiv) return; // no filter div, some exotic view

    const loadMoreButton = divs.getElementsByClassName('btn-load-more')[0];

    const commentDivs = [...divs.childNodes]
        .filter(child => (child !== filterDiv) && (child !== loadMoreButton));

    let expectedChildNodes;
    if (currentOrder === 'asc') {
        expectedChildNodes = [filterDiv, ...commentDivs, ...(loadMoreButton ? [loadMoreButton] : [])];
    } else if (currentOrder === 'desc') {
        expectedChildNodes = [...(loadMoreButton ? [loadMoreButton] : []), ...commentDivs, filterDiv];
    } else {
        return; // unknown current order
    }

    let sameCount = 0;
    for (const node of divs.childNodes) {
        if (node !== expectedChildNodes[sameCount]) break;
        ++sameCount;
    }
    if (sameCount === expectedChildNodes.length) return; // nothing to do, order is as expected already

    console.log('[order-switcher] correcting blocks order ...');

    for (let i = expectedChildNodes.length - 1; i > 0; --i) {
        divs.insertBefore(expectedChildNodes[i - 1], expectedChildNodes[i]);
    }
}

(() => {
    console.log('[order-switcher] Jira comments sort order switcher started');

    document.addEventListener('readystatechange', (event) => {
        if (event.target.readyState === 'complete') {
            correctSortOrder();
        }
    });

    let activeCorrector;
    const observer = new MutationObserver(() => {
        // console.log('[order-switcher] document has changed');
        clearImmediate(activeCorrector);
        activeCorrector = setImmediate(correctCommentsBlocksOrder);
    });

    observer.observe(document, { subtree: true, childList: true });

    // just for testing purposes...
    /* document.$ext = {
        correctSortOrder,
        correctCommentsBlocksOrder,
    }; */
})();