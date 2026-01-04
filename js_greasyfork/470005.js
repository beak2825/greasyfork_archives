// ==UserScript==
// @name         9anime Hide Title Spoilers
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically hide titles for current & future episodes (shows past episode titles)
// @author       Discord: @nvllptr
// @match        https://9anime.to/*
// @match        https://9anime.pl/*
// @match        https://9anime.gs/*
// @match        https://9anime.id/*
// @match        https://9anime.ph/*
// @match        https://aniwave.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aniwave.to
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470005/9anime%20Hide%20Title%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/470005/9anime%20Hide%20Title%20Spoilers.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    
    function observeUntilCondition(conditionCallback) {
        return new Promise(resolve => {
            const observer = new MutationObserver(async mutations => {
                if (!(await conditionCallback(mutations))) {
                    return;
                }
                
                resolve();
                observer.disconnect();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForElement(selector) {
        return new Promise(async resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            
            await observeUntilCondition(() => document.querySelector(selector));
            resolve(document.querySelector(selector));
        });
    }

    const listElementToMeta = item => item.firstElementChild;
    const metaToEpisodeNumber = meta => Number(meta.dataset.num);
    
    async function updateTitles() {
        const episodeListSelector = '.ep-range';
        const episodeList = await waitForElement(episodeListSelector);
        
        const listElements = episodeList.children;
        
        //const currentEpisodeNumber = metaToEpisodeNumber(Array.from(listElements, listElementToMeta)
        //    .find(item => item.classList.contains('active')));
        const titleEpisodeMatches = window.location.href.match(/(?<=.*ep-)\d+/);
        if (titleEpisodeMatches === null || titleEpisodeMatches.length === 0) {
            console.error('[Userscript 9anime Hide title spoilers] could not find current episode number');
            return;
        }
        
        const currentEpisodeNumber = Number(titleEpisodeMatches[0]);

        for (const listElement of listElements) {
            const episodeMetaElement = listElementToMeta(listElement);
            const titleElement = listElement.querySelector('.d-title');
            if (!episodeMetaElement || !titleElement)
                continue;

            const episodeNumber = metaToEpisodeNumber(episodeMetaElement);
            const shouldHideTitle = (episodeNumber >= currentEpisodeNumber);
            
            if (!episodeMetaElement.dataset.title) {
                episodeMetaElement.dataset.title = titleElement.innerHTML;
            }
            
            const realTitle = episodeMetaElement.dataset.title;
            const fakeTitle = `Episode ${episodeNumber}`;
            const desiredTitle = shouldHideTitle ? fakeTitle : realTitle;
            const undesiredTitle = shouldHideTitle ? realTitle : fakeTitle;
            titleElement.innerHTML = desiredTitle;
            listElement.title = listElement.title.replace(undesiredTitle, desiredTitle);
        }
    }
    
    // Wait for the episode list to populate
    await waitForElement('.ep-range > li > a > .d-title');
    // Update the titles on load
    await updateTitles();
    // Update the tiles every time the href changes (new episode)
    let oldHref = window.location.href;
    await observeUntilCondition(async () => {
        if (window.location.href === oldHref) {
            return false;
        }
        oldHref = window.location.href;
        
        await updateTitles();
        return false;
    });
})();
