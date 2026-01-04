// ==UserScript==
// @name		1_Tuscaloosa-News
// @description		hide ads & fix layout
// @match		*://*.tuscaloosanews.com/*
// @match		*://*.tidesports.com/*
// @match		https://www.tuscaloosanews.com/*
// @match		https://www.tidesports.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463351-1_tuscaloosa-news
// @author		sports_wook
// @version		2025.05.15
// @downloadURL https://update.greasyfork.org/scripts/463351/1_Tuscaloosa-News.user.js
// @updateURL https://update.greasyfork.org/scripts/463351/1_Tuscaloosa-News.meta.js
// ==/UserScript==


GM_addStyle (`

main > div:first-of-type, main > div:first-of-type > a {
    width: 100% !important;
}

@media (min-width: 1200px) {
    .gnt_m_ht::after {
      content: none !important;
  }
}

main > :first-child > :first-child > a:first-child > img, main > div:first-of-type > a > img {
    place-self: center !important;
}

.gnt_em_img_i {
    background: transparent !important;
}

div[class$="_fg"] {
    display: flex !important;
    justify-content: center !important;
}

figure[class*="img"] {
    display: inline-grid !important;
}

figure[class*="img"] {
    width: auto !important;
}

div:not([class*="_sl"]) > a[data-t-l*="list"] {
    width: auto !important;
}

main > :first-child > :first-child {
    display: inline-flex !important;
    flex-wrap: wrap !important;
}

main > :first-child > :first-child > a:first-child {
    width: 100% !important;
}

div[class^="gnt_"]:has(main), article > div[class^="gnt_"]:has(p[class^="gnt_"]), footer[class="gnt_ft"] {
    width: auto !important;
    height: auto !important;
}

footer[class="gnt_ft"] {
    padding-bottom: 10px !important;
    width: auto !important;
    height: auto !important;
}

html .page-main-content-container {
    flex-direction: column !important;
}

html .page-main-content-container > .primary {
    width: auto !important;
    max-width: 100% !important;
}

svg[class="gnt_ft_lg"], footer[class="gnt_ft"] {
    position: relative !important;
    display: grid !important;
    max-width: max-content !important;
    padding-bottom: 30px !important;
}

figure[class*="em_img"] > img {
    margin: auto !important;
    width: auto !important;
}

article {
    width: auto !important;
    margin: auto !important;
    display: table !important;
}

h1[elementtiming="ar-headline"] {
    margin: revert !important;
    width: auto !important;
}

html[class^="gnt_"] {
    pointer-events: auto !important;
}

footer div[elementtiming="footer-cr"] {
    padding: 0px !important;
    display: none !important;
}

div[data-g-s="vp_dk"] {
    position: initial !important;
}

*[class*="gnt_x"], .modal-fade-screen, .sign-up-banner[class^="jsx-"], a[aria-label^="Share"], a[aria-label*="always working"], a[rel="sponsored"], article > div[class^="gnt_"]:last-of-type, aside[aria-label^="Video"], aside[aria-label="advertisement"], aside[data-g-r="lazy"], button[aria-label="Share natively"], div > aside[aria-label="advertisement"], div:has(> [class*="tbl"]), div:has(> a[data-t-l^=":contest"]), div:has(> div > a[data-t-l*="table"][data-t-l*="stack"]), div[aria-label^="Extra,"], div[aria-label="More Stories"], div[aria-label="Must Read"], div[aria-label="Watch Now"], div[aria-live="assertive"], div[class="gnt_flp"]:has(div[aria-label="Featured Weekly Ad"]), div[elementtiming="footer-cr"], div[id^="ad-slot"], footer div[aria-label="About"], footer div:has([aria-label="Support"]), footer div[aria-label="Our Partners"], footer div[aria-label="Stay Connected"], footer div[aria-label="Support"], main > div:has(a[aria-label*="always working"]), main > div:last-of-type, p:has(a[data-t-l*="click"]), p:has(> strong ~ a[target="_blank"]) {
    display: none !important;
    width: 0px !important;
    height: 0px !important;
}

`);