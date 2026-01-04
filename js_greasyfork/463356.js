// ==UserScript==
// @name		1_RollTide.com
// @description		hide header ad & fix layout
// @match		*://*.rolltide.com/*
// @match		*://rolltide.com/*
// @match		https://rolltide.com/*
// @match		https://*.rolltide.com/*
// @grant		GM_addStyle
// @namespace		https://greasyfork.org/en/scripts/463356-1_rolltide-com
// @author		sports_wook
// @version		2025.08.26
// @downloadURL https://update.greasyfork.org/scripts/463356/1_RollTidecom.user.js
// @updateURL https://update.greasyfork.org/scripts/463356/1_RollTidecom.meta.js
// ==/UserScript==


GM_addStyle (`

.ua-story .ua-story__header {
    background: none !important;
}

.ua-story .ua-story__header-bg {
    display: none !important;
}

html.headroom--not-top .c-navigation--main .c-navigation-desktop .c-navigation__level-2-inner {
    height: auto !important;
}

#_story_news_bottom, #_story_videos_bottom, #b_container, #consentManagerMainDialog, #container .hide-acc.skip-link, #ctl00_upperRotator .row, #divSatisfiChat, #global-top-ad, #google_ads_iframe, #mainHeaderWrapper > div:first-child:not(.main-header), #quicklinks-section, #sidearm-adblock, #sportcountdownmobile .row.row--narrow, #ssRosterDonation, #ssRosterNews, #ssRosterVideos, #transcend-consent-manager, .ad, .ad.html-a, .ad-leaderboard .dfp-ad, .ad-lower-leaderboard, .ad-rotator.ad-rotator--lower .row, .ad-rotator--lower .ads-container, .ads, .ads-container, .ad-video-leaderboard, .article-social-media.noprint, .atf__secondary-ad, .c-ads, .c-advert, .c-common-footer.component, .c-common-footer--learfield, .c-countdown--horizontal .c-countdown__sponsor, .c-navigation__ad, .c-navigation__social-container, .c-nav-mobile__sponsor, .common-footer-wrapper, .common-top-ad, .component.c-sticky-leaderboard, .c-shop, .c-sticky-leaderboard, .c-stories__ad, .c-story-page__custom-ad, .dfp-2, .dfp-ad, .dfp-container, .empty\:hidden, .flex:has(div[id^="_story_videos_bottom"]), .flex-justify-center.sidearm_schedule-ticket-text, .grecaptcha-badge, .hide, .main-footer__bottom, .main-footer__common, .main-footer__common .row, .main-header__ad, .main-header__notsticky, .main-header__top-ad, .main-header__top-ad-inner, .main-header__top-ad-inner.row.pad, .promotion__container, .right-column-top-ads, .s-advert, .s-awards, .s-game-card__header-inner-bottom, .sidearm-ad-state, .sidearm-aria-labelledby-fixed, .sidearm-common-promotion, .sidearm-story-custom-share-links, .sidearm-story-image-align-center, .sidearm-story-image-align-right, .sidearm-story-template-share, .single-ad.ad, .s-paciolan, .s-parallax, .sportfile-content > p > iframe[src^="http://tunein.com"], .s-sponsors, .s-stories-module--wrapper, .s-people, .stickybar, .s-videos-module--wrapper, .ua-story__ad, .ua-story__ad--lower, .ua-story__related-video, .ua-story__sidebar, ads-component, app-game-dfp-ad, body > div:last-of-type:not(#app), body > div[class][aria-label="Ad Blocker Detected"], button.satisfi_chat-button, div[class*="-ads-"], div[class*="-advert-"], div[class*="-promotion"], div[class^="lg:sidearm-rail"]:has(#_story_news_rail), div[class^="s-share"], div[class="my-4 print:hidden lg:my-8"], div[pos="outstream"], footer > .pb-2 > a, next-event-component, p:has(a):has(picture):has(source[srcset*="_ad"]), script[src*="cdn.transcend.io"], tr.s-table-body__row--ad, ul.s-common-footer__links {
    display: none !important;
}

.ua-story .ua-story__header {
    background: none !important;
}

.ua-story .ua-story__header-bg {
    display: none !important;
}

html.headroom--not-top .c-navigation--main .c-navigation-desktop .c-navigation__level-2-inner {
    height: auto !important;
}

.common-top-ad ~ .sidearm-wrapper {
    padding-top: 0rem !important;
}

.sidearm-common-page {
    padding-top: 1rem !important;
    padding-bottom: 0rem !important;
}

.common-top-ad ~ .sidearm-wrapper > #main-content > .c-story-page {
    padding-bottom: 0px !important;
}

.sidearm-wrapper .c-story-page__content > div > div:has(>div[class*="--sidearm-gutter"]) {
    margin-block-end: 0rem !important;
}

.sidearm-wrapper .c-story-page__content > div > div:has(>div[class*="--sidearm-gutter"]) > div[class*="sidearm-rail"] > div[class*="sidearm-rail"] div[class*="flex"][class*="print"] > :last-child {
    margin-bottom: unset !important;
}

.sidearm-common-page > :first-child {
    padding-top: 1px !important;
    padding-bottom: 1px !important;
}

.sidearm-common-page .mb-\[32px\] {
    padding-bottom: 1rem !important;
}

.sidearm-common-page > div:has(div[class*="header"]) > div[class*="header"] {
    padding-bottom: 1rem !important;
}

.sidearm-common-page div[class="pb-8"] {
    padding-bottom: 0rem !important;
}

div[class="sportfile__header sportfile-header pb-8"] {
    padding-bottom: 1rem !important;
}

.sidearm-common-page .lg\:mt-8 {
    padding-top: 0rem !important;
    margin-top: 1rem !important;
}

.sidearm-common-page .pb-4 {
    padding-bottom: 1rem !important;
}

.md\:space-y-reverse > :not([hidden]) ~ :not([hidden]) {
    padding-top: 0px !important;
    padding-bottom: 0px !important;
}

.my-4 {
    margin-top: 0rem !important;
}

.c-schedulepage__next-game-event {
    margin-bottom: 1rem !important;
}

.c-story-page__content {
    margin-bottom: 0px !important;
}

.s-people {
    margin-bottom: 1rem !important;
}

.mb-\[32px\] {
    margin-bottom: 0px !important;
}

.my-2 {
    margin-top: 0rem !important;
    margin-bottom: 1rem !important;
}

.prose :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] h2 )) {
    margin-top: 1rem !important;
}

.md\:-mx-\[32px\] {
    margin-bottom: -16px !important;
}

.prose :where(.prose > :first-child):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
    margin-top: 0 !important;
}

.prose :where(h2):not(:where([class~="not-prose"], [class~="not-prose"] *)) {
    margin-top: 2rem;
    margin-bottom: 0.5rem !important;
}

.pt-\[16px\] {
    padding-top: 1rem !important;
    padding-bottom:2rem !important;
}

.s-common__header {
    padding-top: 1rem !important;
}

@media (min-width: 1024px) {
    .lg\:mt-0 {
      margin-top: 0 !important;
  }
}

@media (min-width: 768px) {
    .md\:mt-8 {
      margin-top: 1rem !important;
  }
}

@media (min-width: 1024px) {
    .lg\:justify-end {
      justify-content: center !important;
  }
}

@media (min-width: 1024px) {
    .lg\:mt-8 {
      margin-top: 1rem !important;
  }
}

.sidearm-common-page > div > div[class*="header"] > .mt-4 {
    margin-top: 1rem !important;
}

.s-pagination-group {
    justify-content: center !important;
}

.lg\:sidearm-rail section, .lg\:sidearm-rail section > div {
    margin-top: 0px !important;
}

.c-rosterpage__content section {
    padding: 0 0 !important;
}

.c-staff-directory-page__content-wrapper > div > div:nth-of-type(2) {
    margin-top: -1rem !important;
}

.space-y-\[16px\] > :not([hidden]) ~ :not([hidden])  {
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
}
.lg\:sidearm-rail > div > div[class*="p-8"] {
    margin-bottom: -1rem !important;
}

.s-tray__aside {
    align-self: initial !important;
}

#@layer utilities {
#  div[class*="min-h"] {
#    min-height: unset !important;
#  }
#}

.story-page__content__title-box {
    padding-bottom: 1rem !important;
}

.story-page__content-inner > :last-child > :last-child {
    padding-top: 1.5rem !important;
}

.c-story-page__content .h-full:has(>div[class*="h-full"]) > div[class^="mt-"]:has(>div[class^="s-"]) {
    margin-top: 0px !important;
}

.story-page__content-inner > :last-child {
    padding-bottom: 0.5rem !important;
}

.c-events--list .c-events__logo {
    overflow: unset !important;
}

`);