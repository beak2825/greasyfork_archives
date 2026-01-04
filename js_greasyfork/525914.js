// ==UserScript==
// @name         Twitter Görünümünü Düzeltenatör
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Twitter'ın karmaşık tasarımını basitleştirir ve gereksiz öğeleri kaldırır
// @author       dursunator
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @grant        GM_addStyle
// @icon          https://i0.wp.com/electionacademy.lib.umn.edu/wp-content/uploads/2012/06/angry-twitter-bird-thumb-600x400-127203.jpg?resize=600%2C400
// @downloadURL https://update.greasyfork.org/scripts/525914/Twitter%20G%C3%B6r%C3%BCn%C3%BCm%C3%BCn%C3%BC%20D%C3%BCzeltenat%C3%B6r.user.js
// @updateURL https://update.greasyfork.org/scripts/525914/Twitter%20G%C3%B6r%C3%BCn%C3%BCm%C3%BCn%C3%BC%20D%C3%BCzeltenat%C3%B6r.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com')) {
        GM_addStyle(`

            [data-testid="AppTabBar_Home_Link"] ~ a:is(
                [href="/i/grok"],
                [href="/i/premium_sign_up"],
                [href="/i/verified-orgs-signup"],
                [href="/i/communitynotes"],
                [href="/jobs"],
                [href^="https://ads.x.com"]
            ) {
                display: none !important;
            }


            div:has(> div > a[href="/settings"]) a:is(
                [href="/i/grok"],
                [href="/i/premium_sign_up"],
                [href="/i/verified-orgs-signup"],
                [href="/i/communitynotes"],
                [href="/jobs"],
                [href^="https://ads.x.com"]
            ) {
                display: none !important;
            }


            div:has(> aside > a[href="/i/verified-choose"]),
            div[data-testid="sidebarColumn"] div:has(> div > aside[role="complementary"]:has(a[href="/i/premium_sign_up"])),
            nav + div:has(div[aria-live="polite"] a[href="/i/premium_sign_up"]) {
                display: none !important;
            }


            article[data-testid="tweet"] a[href$="quick_promote_web/intro"] {
                display: none !important;
            }


            [data-testid="ScrollSnap-List"] > div:has([data-testid="grokImgGen"]),
            [data-testid="tweet"] div:has(> button[aria-label*="Grok"]),
            [data-testid="tweet"] div:has(> div[data-testid^="followups_"]),
            #layers div[style]:has([data-testid="GrokDrawer"]) {
                display: none !important;
            }


            [data-testid="HoverCard"] div:has(> button:has(svg):has(svg + span:has-text(Profile Summary))),
            [data-testid^="UserAvatar-Container-"] + div button[aria-label="Profile Summary"] {
                display: none !important;
            }


            [data-testid="sidebarColumn"],
            [data-testid="primaryColumn"] + div > div > div:nth-child(2),
            div[role="complementary"][aria-label="Timeline: Trending now"],
            div[role="complementary"][aria-label*="Who to follow"] {
                display: none !important;
            }

            /
            [data-testid="primaryColumn"] + div > div > div:first-child > div:nth-child(2),
            [role="complementary"] > div > div:first-child > div:nth-child(2),
            [data-testid="sidebarColumn"] > div > div:first-child > div:nth-child(2) {
                display: none !important;
            }


            [data-testid="sidebarColumn"] > div > div > div:nth-child(4),
            [data-testid="sidebarColumn"] > div > div > div:nth-child(5),
            [data-testid="primaryColumn"] + div > div > div:nth-child(2) > div:nth-child(4),
            [data-testid="primaryColumn"] + div > div > div:nth-child(2) > div:nth-child(5) {
                display: none !important;
            }
        `);


        const updateTwitterLogos = () => {
            const twitterLogoPath = 'M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z';
            const birdHousePath = 'M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z';
            const activeBirdHousePath = 'M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z';


            document.querySelectorAll(':is(header h1, #placeholder) svg path').forEach(path => {
                path.setAttribute('d', twitterLogoPath);
            });


            document.querySelectorAll('[data-testid="AppTabBar_Home_Link"] svg path').forEach(path => {
                const parentLink = path.closest('[data-testid="AppTabBar_Home_Link"]');
                const isActive = parentLink && parentLink.querySelector('span:matches-css(font-weight: 700)');
                path.setAttribute('d', isActive ? activeBirdHousePath : birdHousePath);
            });
        };


        const observer = new MutationObserver(updateTwitterLogos);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('load', updateTwitterLogos);
        setTimeout(updateTwitterLogos, 1000);
    }
})();