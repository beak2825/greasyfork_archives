// ==UserScript==
// @name         F95 Redesign
// @namespace    https://github.com/wandersons13/F95-Redesign
// @version      0.5
// @description  F95Zone Redesign
// @author       wandersons13
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @license      GNU
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521672/F95%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/521672/F95%20Redesign.meta.js
// ==/UserScript==

(function () {
    const windowWidth = screen.width;

    const style = document.createElement('style');
    style.innerHTML = `
        .pageContent {
            max-width: ${windowWidth * 0.95}px !important;
            max-height: 360px !important;
            transition: none !important;
            top: 110px !important;
        }
        .p-body-inner, .p-nav-inner {
            max-width: ${windowWidth * 0.95}px !important;
            transition: none !important;
        }
        .cover-hasImage {
            height: 360px !important;
            transition: none !important;
        }
        .highlight-unread {
            color: cyan;
            font-weight: bold;
            text-shadow: 1px 1px 2px black;
        }
        .p-sectionLinks,
        .uix_extendedFooter,
        .p-footer-inner,
        .view-thread.block--similarContents.block-container,
        .js-notices.notices--block.notices {
            display: none !important;
        }
        @media screen and (min-width: 1369px) {
            div#latest-page_items-wrap_inner.resource-wrap-game.grid-normal {
                grid-template-columns: repeat(5, 25%) !important;
            }
            div#latest-page_items-wrap {
                margin-left: -312px !important;
            }
            #latest-page_filter-wrap {
                margin-right: -312px !important;
            }
        }
        @media screen and (min-width: 1301px) and (max-width: 1366px) {
            div#latest-page_items-wrap_inner.resource-wrap-game.grid-normal {
                grid-template-columns: repeat(4, 20%) !important;
            }
            div#latest-page_items-wrap {
                margin-left: -45px !important;
            }
            #latest-page_filter-wrap {
                margin-left: -155px !important;
            }
        }
    `;
    document.documentElement.appendChild(style);

    const highlightUnreadLinks=()=> {
        const links=document.querySelectorAll('a');

        for (const link of links) {
            const text=link.textContent.trim().toLowerCase();
            const buttonText=link.querySelector('.button-text');

            if (link.href.includes('/unread?new=1') || text==='jump to new' || (buttonText && buttonText.textContent.trim().toLowerCase()==='jump to new')) {
                link.classList.add('highlight-unread');
                if (buttonText) buttonText.classList.add('highlight-unread');
            }
        }
    }

    ;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', highlightUnreadLinks, { once: true });
    } else {
        highlightUnreadLinks();
    }
})();
