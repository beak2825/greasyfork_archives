// ==UserScript==
// @name         wiki.gg Header and Footer Remover
// @author       yeahimliam
// @description  Removes the wiki.gg header and footer.
// @license      CC BY 4.0
// @namespace    https://greasyfork.org/users/797186
// @version      1.1.0
// @grant        GM_addStyle
// @run-at       document-end
// @match        https://*.wiki.gg/*
// @downloadURL https://update.greasyfork.org/scripts/502716/wikigg%20Header%20and%20Footer%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/502716/wikigg%20Header%20and%20Footer%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let css = `
        #mixed-content-footer,
        .wds-global-footer,
        #WikiaBarWrapper,
        .wds-global-navigation__content-bar-left,
        .global-navigation,
        .fandom-sticky-header,
        .gpt-ad,
        .ad-slot-placeholder.top-leaderboard.is-loading,
        .page__right-rail,
        .search-modal::before,
        form[class^="SearchInput-module_form__"] .wds-icon,
        .notifications-placeholder,
        .top-ads-container,
        .instant-suggestion,
        .unified-search__result.marketplace,
        #wikigg-header,
        #wikigg-footer, /* Added to hide the footer */
        .global-navigation,
        .header-container,
        .top-ads-container,
        .bottom-ads-container,
        .leaderboard-ads-container,
        .search-header,
        .site-footer {
            display: none;
        }

        .main-container {
            width: 100%;
            margin-left: 0px;
        }

        .community-header-wrapper {
            height: auto;
        }

        .search-modal {
            position: absolute;
            bottom: auto;
            left: auto;
        }

        .search-modal__content {
            width: 420px;
            top: 20px;
            right: -3px;
            min-height: auto;
            background-color: var(--theme-page-background-color--secondary);
            border: 1px solid var(--theme-border-color);
            animation: none;
        }

        form[class^="SearchInput-module_form__"] {
            border-bottom: 2px solid var(--theme-border-color);
            color: var(--theme-border-color);
        }

        form[class^="SearchInput-module_form__"] .wds-button {
            --wds-primary-button-background-color: var(--theme-accent-color);
            --wds-primary-button-background-color--hover: var(--theme-accent-color--hover);
            --wds-primary-button-label-color: var(--theme-accent-label-color);
        }

        input[class^="SearchInput-module_input__"] {
            color: var(--theme-page-text-color);
            border-left: none;
            padding: 0;
        }

        a[class^="SearchResults-module_seeAllResults"] {
            color: var(--theme-link-color) !important;
        }
    `;
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    // Remove the specific header and footer from wiki.gg sites
    const header = document.querySelector('#wikigg-header');
    if (header) {
        header.remove();
    }

    const footer = document.querySelector('#wikigg-footer'); // Remove footer
    if (footer) {
        footer.remove();
    }
})();
