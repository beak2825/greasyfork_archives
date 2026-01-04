// ==UserScript==
// @name         Indeed UX+
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Reveals hidden reviews, Removes Archived, Saved & Applied Job Posts from showing up & Allows select Job Posts via Arrow Keys
// @author       TigerYT
// @include      *://*.indeed.tld/*
// @icon         https://uk.indeed.com/images/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/516891/Indeed%20UX%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/516891/Indeed%20UX%2B.meta.js
// ==/UserScript==

(function checkDocumentReady() { document.readyState === 'complete' ? executeUsercript() : setTimeout(checkDocumentReady, 0); })();

function executeUsercript() {
    'use strict';

    const customCSS = `
#reviewDescription {
    :is(&, & + div) {
        :is([itemprop="reviewBody"] > span, h2 + div) {
            &, * {
                background-color: rgba(0, 0, 0, 0) !important;
                color: rgb(89, 89, 89) !important;
                font-weight: 400 !important;
                text-shadow: none !important;
                -webkit-user-select: auto !important;
                user-select: auto !important;
            }
        }
    }

    & ~ button {
        display: none !important;
    }
}
    `;
    GM_addStyle(customCSS);

    let getViewJobPanelElem = () => document.getElementById('jobsearch-JobFullDetailsTitle')?.parentElement.querySelector('.fastviewjob');
    let getJobResultsPanelElem = () => document.getElementById('mosaic-provider-jobcards')?.firstElementChild;
    let allPosts = Array.from(getJobResultsPanelElem()?.children ?? []);
    let getJobPosts = () => allPosts.filter((jobPost) => jobPost.firstElementChild.classList.contains('tapItem')).map((({firstElementChild}) => firstElementChild));
    let getVisiblePosts = () => getJobPosts().filter((jobPostElem) => !jobPostElem.classList.contains('disliked'));
    let getCurrentJobPostId = () => getViewJobPanelElem()?.querySelector('.jobsearch-HeaderContainer a')?.href.split("&fromjk=")[1];
    let getCurrentJobPostElem = () => getVisiblePosts().find((jobPostElem) => getCurrentJobPostId() == getjobPostId(jobPostElem));
    let getCurrentJobPostElemIndex = () => getVisiblePosts().findIndex((jobPostElem) => getCurrentJobPostId() == getjobPostId(jobPostElem));
    let getjobPostId = (jobPostElem) => jobPostElem.className.split(' ').find((classStr) => classStr.startsWith('job_'))?.slice(4);

    /* Hide All Saved Job Posts */
    getJobPosts().forEach((jobPostElem) => {
        let jobPostId = getjobPostId(jobPostElem);

        if ((jobPostElem.querySelector('div.underShelfFooter span')?.textContent.startsWith('Saved ') || jobPostElem.querySelector('div.underShelfFooter span')?.textContent.startsWith('Archived ') || jobPostElem.querySelector('.mainContentTable div[data-testid="appliedSnippet"]')?.textContent == 'Applied') && !jobPostElem.classList.contains('disliked')) {
            jobPostElem.classList.add('disliked');
            if (jobPostId == getCurrentJobPostId() || !getCurrentJobPostElem()) getViewJobPanelElem()?.firstElementChild?.click();
        } else if (jobPostId == getCurrentJobPostId()) getCurrentJobPostElem().classList.add('vjs-highlight');

    });

    /* Allow Arrow Keys to Select Job Posts */

    let newJobPostElemIndex, currentJobPostElemIndex
    newJobPostElemIndex = currentJobPostElemIndex = getCurrentJobPostElemIndex();

    let jobPostSelector = (e) => {
        let upKey = ['ArrowUp', 'ArrowLeft'].includes(e.key);
        let downKey = ['ArrowDown', 'ArrowRight'].includes(e.key);

        if (!getCurrentJobPostElem()) getViewJobPanelElem()?.firstElementChild?.click();

        if (currentJobPostElemIndex > 0 && upKey) newJobPostElemIndex--;
        else if (currentJobPostElemIndex < (getVisiblePosts().length - 1) && downKey) newJobPostElemIndex++;
        else return;

        let newJobPostElem = getVisiblePosts()[newJobPostElemIndex];
        let newJobPostId = getjobPostId(newJobPostElem);

        newJobPostElem.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        document.querySelector(`#sj_${newJobPostId}, #job_${newJobPostId}`).click();

        currentJobPostElemIndex = newJobPostElemIndex;
    }

    window.addEventListener('keydown', (e) => jobPostSelector(e));
}

// Register context menu option
GM_registerMenuCommand("Execute", executeUsercript);