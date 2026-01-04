// ==UserScript==
// @name         Quizlet Login Bypass 2024
// @description  Unblur text, Remove ads, Clean UI
// @match        *://quizlet.com/*
// @author       daijro
// @version      1.7.2
// @icon         https://assets.quizlet.com/a/j/dist/i/favicon.6e263725c926227.ico
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    https://greasyfork.org/users/795282
// @downloadURL https://update.greasyfork.org/scripts/465546/Quizlet%20Login%20Bypass%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/465546/Quizlet%20Login%20Bypass%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML =
        // Unblur text
        '.SetPageTerm-side, .b1sa2ccx, .b1xkd811 {filter: none !important;} ' +
        // Hide ads
        '.sdnrmc1, .SiteAd, .SetPageEmbeddedAd-wrapper, .bx-slab, .SetPageTerms-embeddedDesktopAdz, .SetPageTerms-embeddedMobileAdz, .OutOfPageAdContainer, .SetPageTermsStickyBanner.SetPageTermsStickyBanner--hasAdz, [data-testid=ExplanationsLayoutSidebarAd], ' +
        // Hide the sign up box, user info, footer, popups, nav bar, & more
        '.TopNavigationWrapper, #credential_picker_iframe, #credential_picker_container, .TextbookRecommendations, .SetPageStudyModesBanner-body, .credentials-picker-container, footer, .SetPage-flickrAttributions, .LoginBottomBar, .bb8jmnf, .c1vv5ssw, .SetPageWall.SetPageWall--normal, .SetPage-setDetailsInfoWrapper, .wugyavo, .SetPage-setLinksWrapper, [data-testid=PayWallOverlay] {display: none !important;} ' +
        // Force text cursor over flashcard text
        '.hcszxtp, .h3797oo {cursor: text !important;} ' +
        // Fix margin between flashcards
        '.SetPageTerms-term {margin-top: 0.625rem;} ' +
        // Disable the 12.5em max height on explanations
        '.hnqbbas {max-height: none !important;}'
    ;
    document.head.appendChild(style);

    // Kill TTS
    window.addEventListener('load', function killtts() {
        document.querySelectorAll("[data-testid='set-page-card-side']").forEach(function(el) {
          el.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();
          });
        });
        window.removeEventListener('load', killtts);
    });

    // Dark Mode
    let isDark = () => GM_getValue('darkMode', 'Disabled') === 'Enabled';
    let setDark = (dark) => {
        dark ? document.body.classList.replace('theme-default', 'theme-night') :
               document.body.classList.replace('theme-night', 'theme-default');
    }
    let menuId = GM_registerMenuCommand(
        'Force night theme: ' + GM_getValue('darkMode', 'Disabled'),
        function toggleDark() {
            GM_setValue('darkMode', isDark() ? 'Disabled' : 'Enabled');
            setDark(isDark());
            GM_unregisterMenuCommand(menuId);
            menuId = GM_registerMenuCommand('Force night theme: ' + GM_getValue('darkMode'), toggleDark);
        }
    );
    // Apply dark mode when body is added
    if (!isDark()) return
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.target.nodeName === 'BODY') setDark(isDark())
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributeFilter: ['class'] });
})();