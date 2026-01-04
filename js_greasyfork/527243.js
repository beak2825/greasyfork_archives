// ==UserScript==
// @name         LinkedIn Job Skills Highlighter
// @namespace    http://github.com/ArmanJR
// @version      1.3
// @description  Highlight skills in LinkedIn job postings with color groups
// @author       Arman JR.
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527243/LinkedIn%20Job%20Skills%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/527243/LinkedIn%20Job%20Skills%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const skillsHighlight = {
        'strong': {
            color: '#0fe800',
            skills: ['go', 'golang', 'java']
        },
        'intermediate': {
            color: '#f5ed00',
            skills: ['spring']
        },
        'weak': {
            color: '#ff7f6b',
            skills: ['typescript', 'Node.js', 'JavaScript']
        }
    };

    let lastURL = location.href;

    // Wait for element to appear
    function waitFor(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 200;
            let elapsed = 0;

            const checkExist = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkExist);
                    resolve(element);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(checkExist);
                    reject(`Timeout: ${selector} not found`);
                }
            }, interval);
        });
    }

    // Click "Show more" if available
    async function clickShowMore() {
        console.log('Fired clickShowMore');
        try {
            const showMoreBtn = await waitFor('.feed-shared-inline-show-more-text__see-more-less-toggle', 1000);
            if (showMoreBtn.textContent.toLowerCase().includes('show more')) {
                console.log('Clicking "Show more" button');
                showMoreBtn.click();
            }
        } catch (e) {
            console.log('No "Show more" button found or timeout reached.');
        }
    }

    // Highlight skills in job description
    function highlightSkills() {
        console.log('Fired highlightSkills()');

        const contentDiv = document.querySelector('#job-details');
        if (!contentDiv) {
            console.log('Job description not found yet.');
            return;
        }

        //if (contentDiv.getAttribute('data-processed')) {
        //    console.log('Already processed, skipping.');
        //    return;
        //}

        const walker = document.createTreeWalker(contentDiv, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;

        while ((node = walker.nextNode())) {
            textNodes.push(node);
        }

        let highlightCount = 0;
        textNodes.forEach(textNode => {
            let text = textNode.textContent;
            let modified = false;

            for (const group of Object.values(skillsHighlight)) {
                group.skills.forEach(skill => {
                    const regex = new RegExp(`(^|\\W)(${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=\\W|$)`, 'gi');
                    if (regex.test(text)) {
                        modified = true;
                        highlightCount++;
                        text = text.replace(regex, `$1<span style="background-color:${group.color};padding:0 2px;border-radius:2px;font-size:1.1em;font-weight:500;">$2</span>`);
                    }
                });
            }

            if (modified) {
                const span = document.createElement('span');
                span.innerHTML = text;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });

        contentDiv.setAttribute('data-processed', 'true');
        console.log(`Highlighted ${highlightCount} skills.`);
    }

    async function processJobDescription() {
        await clickShowMore();
        highlightSkills();
    }

    // Observe URL changes (LinkedIn dynamically loads content without page reloads)
    function observeUrlChanges() {
        new MutationObserver(() => {
            if (location.href !== lastURL) {
                lastURL = location.href;
                console.log('Detected URL change, processing new job...');
                setTimeout(processJobDescription, 100); // Slight delay to allow content to load
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // Initial Run
    processJobDescription();
    observeUrlChanges();
})();
