// ==UserScript==
// @name         TheEpochTimes Fixer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Enhances TheEpochTimes website: modifies URL, closes modals, hides ads, resizes grid, fixes width, scrolls to top
// @match        *://*.theepochtimes.com/*
// @match        *://theepochtimes.com/*
// @grant        GM_addStyle
// @license      MIT
// @language     en
// @downloadURL https://update.greasyfork.org/scripts/512038/TheEpochTimes%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/512038/TheEpochTimes%20Fixer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle(`
        .post_content > :not(.shortcode) { max-width: 100% !important; }
        #ad_right_top_300x250_1, #article_ad_right_middle_300x250_1, #article_ad_right_middle_300x250_2, #article_ad_right_top_300x250_1, #article_ad_right_top_300x250_2, #in_article_ads_0, #in_article_ads_1, #in_article_ads_2, #in_article_ads_3, #in_article_ads_4, #in_article_ads_5, #in_article_ads_6, #in_article_ads_7, #in_article_ads_8, #inside_ad_336x280_1, #inside_ad_336x280_2, #landing-page, #partnership, .home-wall, .login_wrapper, .soft_stikcy, .top_ad { display: none !important; }
        #main { height: unset !important; overflow: unset !important; }
        #modal-COMMON { display: none !important; }
    `);
    const isTop = window.self === window.top;
    function appendUTM() {
        if (isTop && !location.href.includes('utm_campaign=ref_share_btn')) {
            let url = new URL(location.href);
            ['utm_campaign=ref_share_btn', 'utm_source=ref_share', 'utm_medium=email'].forEach(p => url.searchParams.append(...p.split('=')));
            history.replaceState({}, document.title, url.toString());
        }
    }
    function closeModalAndScroll() {
        const btn = document.querySelector('div.close_inline');
        if (btn && btn.textContent.trim() === "Continue Without Registration") {
            btn.click();
            try { window.top.postMessage('scrollToTop', '*'); } catch (e) {}
        }
        document.body.classList.remove("free_user", "hidden");
        document.body.style.overflow = "";
    }
    function modifyPage() {
        ['#body > main > div:nth-child(2) > aside', '#in_article_related_stories', '#uacta-target', 
         '#body > main > div.theme-app-hidden.print\\:hidden.post-main.grid.pt-4.sm\\:pt-\\[60px\\].lg\\:grid-cols-\\[minmax\\(auto\\,860px\\)_300px\\].lg\\:gap-10']
        .forEach(s => { const el = document.querySelector(s); if (el) el.style.display = 'none'; });
        const grid = document.querySelector('.post-main.grid');
        if (grid) {
            grid.classList.replace('lg:grid-cols-[minmax(auto,860px)_300px]', 'lg:grid-cols-[minmax(auto,100%)]');
            Object.assign(grid.style, {maxWidth: '1200px', margin: '0 auto'});
        }
        const content = document.querySelector('.post_content');
        if (content) Object.assign(content.style, {maxWidth: '100%', width: '100%'});
        ['in_article', 'inside_ad', 'article_ad', 'ad_'].forEach(prefix => 
            document.querySelectorAll(`[id^="${prefix}"], [class^="${prefix}"]`).forEach(el => el.style.display = 'none')
        );
    }
    isTop ? (appendUTM(), modifyPage(), window.addEventListener('message', e => e.data === 'scrollToTop' && window.scrollTo(0, 0))) : closeModalAndScroll();
    setInterval(() => isTop ? modifyPage() : closeModalAndScroll(), 1000);
})();