// ==UserScript==
// @name         Transparent Lolz
// @name:en      Transparent Lolz
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Делает форум Lolzteam прозрачным. Степень прозрачности можно настроить с помощью аргумента transparency на 19 строке.
// @description:en Makes the Lolzteam forum transparent. The transparency level can be adjusted using the `transparency` variable on line 19.
// @author       https://lolz.live/members/157562/
// @match        *://lzt.market/*
// @match        *://lolz.guru/*
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529658/Transparent%20Lolz.user.js
// @updateURL https://update.greasyfork.org/scripts/529658/Transparent%20Lolz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1 - вообще не прозрачное, 0 - полностью прозрачное
    const transparency = 0.4;

    // список селекторов которые надо делать прозрачными
    const cssSelectors = [
        // main forum + thread
        '#header',
        '.pageNavLinkGroup',
        '.messageList .message',
        '.thread_view .titleBar',
        '.sidebar .sidebarWrapper',
        '.simpleRedactor.QuickReplyRedactor',
        '.discussionListItem',
        '.Menu',
        '.Menu.MenuOpened',
        '.Menu .secondaryContent',
        '.aboveThread-main',
        '.text_Ads-main',
        '.primaryContent, .secondaryContent',
        '.fr-box.fr-basic .fr-wrapper, .fr-toolbar.fr-top',
        '.alertNotice',
        '.sectionMain',
        '.navigation-header',
        '.tabs',
        '.forum_view .titleBar, .forum_list .titleBar',
        '.matchedThreadCount',
        '.likeNodes',
        '.titleBar',
        '.primaryContent, .secondaryContent',
        '.sectionFooter',
        '.discussionListItems',
        '.navigationSideBar>ul',
        '.hasJs .bbCodeSpoilerText',
        '.textHeading_alignElement_two_step',
        '.apiPadding20',
        '#content > div > div > div.container > div.mainContentBlock.section.sectionMain.insideSidebar > div:nth-child(1)',
        '.bdApi_Client_Item',
        '.bdApi_UserScope_Item',
        '.xenOverlay>.section, .xenOverlay>.sectionMain',
        '.xenOverlay.logoutConfirmation .sectionMain .heading',
        '.loginForm',
        '#articlesGrid',
        '.tgme_widget_message_bubble',
        '.wcommunity_colored.wcommunity_wrap',
        '.discord_vidget .users--body',
        '.guarantor_container',
        '.guarantor_block_form .textCtrl',
        '.help_terms-title',
        '.help_terms .blockrow',
        '#content > div > div > div.mainContainer > div > div > div',
        '.forum_body',

        // market
        '.searchHistoryContainer.SearchHistoryList',
        '.searchBarContainer',
        '.marketSidebarMenu',
        '.marketMyPayments',
        '.Market_Down_BG',
        '.marketIndexItem',
        '.market--titleBar',
        '.market_block_reviews',
        '.marketContainer',
        '#footer-market',
        '.fr-box.fr-basic .fr-wrapper, .fr-toolbar.fr-top',

        // chats
        '.universalSearchForm .universalSearchInput',
        '.ImDialogHeader',
        '.conversationViewContainer',
        '.conversationListFolder',
        '.conversationListWrapper',

        // profile
        '.darkBackground',
        '.profile_threads_block',
        '.messageSimple',
    ];

    const defaultRgb = '39, 39, 39';  // дефолтный цвет, не трогать
    let cssRules = '';
    cssSelectors.forEach(selector => {
        cssRules += `${selector} {
            background-color: rgba(var(--bg-rgb, ${defaultRgb}), ${transparency}) !important;
        }\n`;
    });

    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(cssRules);
    } else {
        let styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.textContent = cssRules;
        document.documentElement.appendChild(styleNode);

        const appendStyleToHead = () => {
            if (document.head) {
                document.head.appendChild(styleNode);
            } else {
                setTimeout(appendStyleToHead, 10);
            }
        };
        appendStyleToHead();
    }

    function updateDynamicElements() {
        cssSelectors.forEach(selector => {
            let elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                let currentColor = window.getComputedStyle(el).backgroundColor;
                if (currentColor && currentColor !== 'transparent' && !currentColor.includes('rgba')) {
                    let rgb = colorToRgb(currentColor);
                    el.style.setProperty('--bg-rgb', rgb);
                    el.style.backgroundColor = `rgba(${rgb}, ${transparency})`;
                }
            });
        });
    }

    function colorToRgb(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return defaultRgb;
        }

        // rgb
        let rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgbMatch) {
            return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
        }

        // rgba
        let rgbaMatch = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)$/);
        if (rgbaMatch) {
            return `${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}`;
        }

        // hex
        let hexMatch = color.match(/^#([0-9A-Fa-f]{3,6})$/);
        if (hexMatch) {
            let hex = hexMatch[1];
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }

        return defaultRgb;
    }

    document.addEventListener('DOMContentLoaded', function() {
        updateDynamicElements();

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    updateDynamicElements();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    setInterval(updateDynamicElements, 3000);

    window.addEventListener('popstate', updateDynamicElements);
    window.addEventListener('pushState', updateDynamicElements);
    window.addEventListener('replaceState', updateDynamicElements);
})();