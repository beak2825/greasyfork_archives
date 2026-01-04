// ==UserScript==
// @name         Facebook no ads
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Makes sponsored feeds invisible on facebook.com
// @author       Darmikon
// @match        https://www.facebook.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/375671/Facebook%20no%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/375671/Facebook%20no%20ads.meta.js
// ==/UserScript==

(function() {
    let rootEl = null;
    let intervalId = null;
    let prevUrl = null;
    let page = null;

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        }
    }

    const onUrlChange = (cb) => {
      setInterval(() => {
         if(location.href !== prevUrl) {
           prevUrl = location.href;
           cb();
         }
      }, 50);
    }

    const doHack = (feed) => {
         // 0. Alternatively find a block with aria-label
        const aWithLabel = feed.querySelector('[aria-label="Sponsored"]');


        if(aWithLabel) {
            return true;
        }


        // 1. Find this unique block inside the feed
        const spanWithId = feed.querySelector('span[id]');


        if(!spanWithId) return;

        const link = spanWithId.querySelector('a');

        const spanWithSponsoredText = link?.firstElementChild?.firstElementChild?.firstElementChild;
        let isSponsored = false;

        if(spanWithSponsoredText) {
           let labels = [].slice.call(spanWithSponsoredText.querySelectorAll('span')).filter(el => {
              const styles = getComputedStyle(el);
              return styles.position === 'relative' && styles.display !== 'none';
           }).map(el => el.innerText);
           let word = labels.join('');
            // console.log(word);
           if(word.includes('ponsored')) {
              isSponsored = true;
           }
        }

        return isSponsored;
    }

    const trimAds = () => {
        let feeds;

        if(page === 'home') {
            feeds = [].slice.call(rootEl.children || []).filter(child => {
            return child.hasAttribute('data-pagelet');
        });
        }
        if(page === 'watch') {
            feeds = [].slice.call((((rootEl.firstElementChild || {}).firstElementChild || {}).firstElementChild || {}).children || []);
        }
        
        feeds.forEach((feed, i) => {
            try {
                if(doHack(feed)) {
                    // console.log('killed', feed.querySelector('h4'));
                    feed.style.display = "none";
                }
            } catch (e) {}
        });
    }

    const trimAdsForRoot = () => {
        rootEl = null;
        if(intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            if(!rootEl) {
                const home = document.querySelector('[role="feed"]');
                const watch = document.querySelector('[data-pagelet="MainFeed"]');
                if(home) {
                    page = 'home';
                }
                if(watch) {
                    page = 'watch';
                }
                rootEl = home || watch;
            } else {
                clearInterval(intervalId);
                trimAds();
            }
        }, 50);
    }

    const runAdsKiller = () => {
        const throttleKill = throttle(trimAdsForRoot, 50);
        trimAdsForRoot();
        window.addEventListener('scroll', trimAdsForRoot);
        window.addEventListener('resize', trimAdsForRoot);
        onUrlChange(trimAdsForRoot);
    }

    const init = () => {
        runAdsKiller();
    }

    init();
})();
