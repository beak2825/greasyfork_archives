// ==UserScript==
// @name               Google Additional Search Filters
// @namespace          https://greasyfork.org/en/users/10118-drhouse
// @version            9.0
// @description        This script shows a bunch filters above the default Google search filters that helps you easily search sites (directly or with Google) and subreddits
// @run-at             document-start
// @include            https://*.google.*/*
// @include            https://www.google.*/search*
// @exclude            https://www.google.com/maps/*
// @exclude            https://www.google.com/flights/*
// @require            http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require            https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @grant              GM_info
// @grant              GM_registerMenuCommand
// @author             drhouse (updated by Gemini AI & User)
// @license            CC-BY-NC-SA-4.0
// @icon               https://www.google.com/s2/favicons?domain=google.com
// @downloadURL https://update.greasyfork.org/scripts/543216/Google%20Additional%20Search%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/543216/Google%20Additional%20Search%20Filters.meta.js
// ==/UserScript==
/* global jQuery, MonkeyConfig, $ */

$(document).ready(function () {
    // --- SVG Icon Definitions ---
    const searchIconSvg = '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:16px; height:16px; fill:currentColor;"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>';
    const clearIconSvg = '<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor;"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>';

    // --- Configuration (Simplified) ---
    var cfg = new MonkeyConfig({
        title: 'Configure Additional Search Filters',
        menuCommand: true,
        params: {
            'YouTube': { type: 'checkbox', default: true, label: 'Enable YouTube Filter (Main)' },
            'Marginalia': { type: 'checkbox', default: true, label: 'Enable Marginalia Filter (Main)' },
            'Yandex': { type: 'checkbox', default: true, label: 'Enable Yandex Filter (Main)' },
            'Bing': { type: 'checkbox', default: true, label: 'Enable Bing Filter (Main)' },
            'ChatGPT': { type: 'checkbox', default: true, label: 'Enable ChatGPT Filter (Main)' },
            'Perplexity': { type: 'checkbox', default: true, label: 'Enable Perplexity Filter (Main)' },
            'Google News': { type: 'checkbox', default: true, label: 'Enable Google News Filter (Main)' },
            'Wikipedia': { type: 'checkbox', default: true, label: 'Enable Wikipedia Filter (Main)' },
            'StackExchange': { type: 'checkbox', default: true, label: 'Enable StackExchange Filter (Main)' },
            'Substack': { type: 'checkbox', default: true, label: 'Enable Substack Filter (Main)' },
            'Reddit_Enable': { type: 'checkbox', default: true, label: 'Enable Reddit Filter (Main, with Subreddits)'},
            'Reddit_Subreddits': {
                type: 'text',
                default: 'explainlikeimfive,askscience,NoStupidQuestions,techsupport,LifeProTips',
                label: 'Subreddits for Dropdown (comma-separated, Google search)'
            },
            'CustomSites_Enable': { type: 'checkbox', default: true, label: 'Enable Custom Site Filters (in "More")'},
            'CustomSites_List': {
                type: 'text',
                default: 'medium.com,quora.com,github.com,dev.to',
                label: 'Custom Site Domains (comma-separated, Google search)'
            },
            'OpenInNewTab': {
                type: 'checkbox',
                default: false,
                label: 'Open filter links in a new tab'
            }
        },
    });

    // --- Helper Functions ---
    function getCleanQuery() {
        let currentQuery = '';
        const queryInputs = ["input[name='q'][type='text']", "textarea[name='q']", "textarea[aria-label='Search']", "textarea[title='Search']"];
        for (const selector of queryInputs) {
            const inputElement = $(selector);
            if (inputElement.length > 0 && inputElement.val() && inputElement.val().trim() !== '') {
                currentQuery = inputElement.val();
                break;
            }
        }
        if (!currentQuery && window.location.search.includes("q=")) {
            try {
                const params = new URLSearchParams(window.location.search);
                currentQuery = params.get('q') || '';
            } catch (e) {
                const match = window.location.search.match(/[?&]q=([^&]+)/);
                if (match) currentQuery = decodeURIComponent(match[1].replace(/\+/g, ' '));
            }
        }
        const siteFilterRegex = /\b(site:\S+|inurl:\S+|-site:\S+)\s*/gi;
        let cleaned = (currentQuery || '').replace(siteFilterRegex, ' ').trim();
        cleaned = cleaned.replace(/\s\s+/g, ' ');
        return cleaned;
    }

    const cleanQuery = getCleanQuery();
    if (!cleanQuery) { return; }

    const googleHostname = $(location).attr('hostname');
    const openInNewTab = cfg.get('OpenInNewTab');
    const linkTarget = openInNewTab ? '_blank' : '_self';

    // --- Container & Placement ---
    let customFiltersMainContainer = $('#gm-custom-filters-main-container');
    if (customFiltersMainContainer.length > 0) { customFiltersMainContainer.empty(); }
    else { customFiltersMainContainer = $('<div id="gm-custom-filters-main-container" style="display: inline-flex; align-items: center; white-space: nowrap; vertical-align: top;"></div>'); }

    const placementTarget = $('.rfiSsc.YNk70c').first();
    if (placementTarget.length > 0) {
        placementTarget.after(customFiltersMainContainer);
        customFiltersMainContainer.css({ 'margin-top': '1px', 'padding': '0 106px' });
    } else {
        let googleFiltersBar = $('#hdtb-msb').first();
        if (googleFiltersBar.length > 0) { googleFiltersBar.append(customFiltersMainContainer); }
        else {
             let lastGoogleTab = $('.hdtb-mitem').last();
             if(lastGoogleTab.length === 0) lastGoogleTab = $('[role="tablist"] a').last();
             if (lastGoogleTab.length > 0) { customFiltersMainContainer.insertAfter(lastGoogleTab); }
             else {
                 const fallbackTarget = $(".crJ18e, #searchform").first();
                 if (fallbackTarget.length > 0) { customFiltersMainContainer.insertAfter(fallbackTarget); }
                 else { console.error("Google ASF: Cannot find any insertion point."); return; }
             }
        }
    }

    // --- Element Creation Helpers ---
    function createSimpleFilterLinkElement(siteName, siteUrl, iconDomain) {
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(iconDomain)}&sz=16`;
        const linkElement = $(`<a class="gm-custom-filter-link LatpMc nPDzT T3FoJb" href="${siteUrl}" target="${linkTarget}"></a>`);
        if(openInNewTab) linkElement.attr('rel', 'noopener noreferrer');
        linkElement.append(`<img src="${faviconUrl}" class="gm-filter-icon" alt="" onerror="this.style.display='none'">`);
        linkElement.append(`<div class="gm-filter-label">${siteName}</div>`);
        return linkElement;
    }

    function createMagnifierFilterElement(siteDef, mainUrl, altUrl, altTitle) {
        const element = $('<div class="gm-filter-item LatpMc nPDzT T3FoJb"></div>');
        const mainLink = $(`<a class="gm-main-action" href="${mainUrl}" target="${linkTarget}"></a>`);
        if (openInNewTab) mainLink.attr('rel', 'noopener noreferrer');
        mainLink.append(`<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(siteDef.iconDomain)}&sz=16" class="gm-filter-icon" alt="" onerror="this.style.display='none'">`);
        mainLink.append(`<div class="gm-filter-label">${siteDef.displayName}</div>`);
        element.append(mainLink);

        const altLink = $(`<a class="gm-alt-search-action" href="${altUrl}" target="${linkTarget}" title="${altTitle}"></a>`);
        if (openInNewTab) altLink.attr('rel', 'noopener noreferrer');
        altLink.html(searchIconSvg);
        element.append(altLink);
        return element;
    }

    // --- Clear Filter Button ---
    const clearFilterUrl = `https://${googleHostname}/search?q=${encodeURIComponent(cleanQuery)}`;
    const clearButton = $(`<a class="gm-clear-filter-button LatpMc nPDzT T3FoJb" href="${clearFilterUrl}" target="${linkTarget}" title="Clear filters and search Google"></a>`);
    if(openInNewTab) clearButton.attr('rel', 'noopener noreferrer');
    clearButton.html(clearIconSvg);
    customFiltersMainContainer.append(clearButton);

    // --- Site Definitions with Fixed Behavior ---
    const siteDefinitions = [
        // Group 1: Google Primary, Direct via Magnifier
        { configKey: 'YouTube',       displayName: 'YT',       iconDomain: 'youtube.com',       directBaseUrl: 'https://www.youtube.com/results?search_query=', siteSearchTerm: 'youtube.com',       searchType: 'google_primary' },
        { configKey: 'Wikipedia',     displayName: 'Wiki',     iconDomain: 'wikipedia.org',     directBaseUrl: 'https://en.wikipedia.org/wiki/Special:Search?search=', siteSearchTerm: 'wikipedia.org',   searchType: 'google_primary' },
        { configKey: 'StackExchange', displayName: 'SE',       iconDomain: 'stackexchange.com', directBaseUrl: 'https://stackexchange.com/search?q=', siteSearchTerm: 'stackexchange.com', searchType: 'google_primary' },
        { configKey: 'Substack',      displayName: 'Substack', iconDomain: 'substack.com',      directBaseUrl: 'https://substack.com/search/', siteSearchTerm: 'substack.com',      searchType: 'google_primary' }, // No reliable direct search, so magnifier won't be created

        // Group 2: Always Direct, No Magnifier
        { configKey: 'Google News',   displayName: 'GN',       iconDomain: 'news.google.com',   directBaseUrl: 'https://news.google.com/search?q=', siteSearchTerm: null, searchType: 'direct_only' },
        { configKey: 'ChatGPT',       displayName: 'CG',       iconDomain: 'chatgpt.com',       directBaseUrl: 'https://chatgpt.com/?q=', siteSearchTerm: null, searchType: 'direct_only' },
        { configKey: 'Marginalia',    displayName: 'MR',       iconDomain: 'marginalia.nu',     directBaseUrl: 'https://marginalia-search.com/search?query=', siteSearchTerm: null, searchType: 'direct_only' },
        { configKey: 'Yandex',        displayName: 'YD',       iconDomain: 'yandex.com',        directBaseUrl: 'https://yandex.com/search/?text=', siteSearchTerm: null, searchType: 'direct_only' },
        { configKey: 'Bing',          displayName: 'BG',       iconDomain: 'bing.com',          directBaseUrl: 'https://www.bing.com/search?q=', siteSearchTerm: null, searchType: 'direct_only' },
        { configKey: 'Perplexity',    displayName: 'PR',       iconDomain: 'perplexity.ai',     directBaseUrl: 'https://www.perplexity.ai/search?q=', siteSearchTerm: null, searchType: 'direct_only' },
    ];

    const mainDisplayKeys = ['YouTube', 'Google News', 'Wikipedia', 'ChatGPT', 'Marginalia', 'Yandex', 'Bing', 'Perplexity', 'StackExchange', 'Substack'];
    const overflowLinkElements = [];

    // --- Generate Filter Links/Items ---
    siteDefinitions.forEach(siteDef => {
        if (!cfg.get(siteDef.configKey)) { return; }

        let element;
        switch(siteDef.searchType) {
            case 'google_primary':
                let googleSearchUrl = `https://${googleHostname}/search?q=site%3A${encodeURIComponent(siteDef.siteSearchTerm)}+${encodeURIComponent(cleanQuery)}`;
                if (siteDef.configKey === 'YouTube') { googleSearchUrl += '&tbm=vid'; }
                const directSearchUrl = siteDef.directBaseUrl ? siteDef.directBaseUrl + encodeURIComponent(cleanQuery) : null;
                if (directSearchUrl) {
                    element = createMagnifierFilterElement(siteDef, googleSearchUrl, directSearchUrl, `Search directly on ${siteDef.iconDomain}`);
                } else { // Fallback for sites like Substack with no reliable direct search
                    element = createSimpleFilterLinkElement(siteDef.displayName, googleSearchUrl, siteDef.iconDomain);
                }
                break;
            case 'direct_only':
                const directUrl = siteDef.directBaseUrl + encodeURIComponent(cleanQuery);
                element = createSimpleFilterLinkElement(siteDef.displayName, directUrl, siteDef.iconDomain);
                break;
        }

        if (element) {
            if (mainDisplayKeys.includes(siteDef.configKey)) {
                customFiltersMainContainer.append(element);
            } else {
                overflowLinkElements.push(element);
            }
        }
    });

    // --- Reddit Special Handling (Group 1 Behavior) ---
    if (cfg.get('Reddit_Enable')) {
        const mainRedditUrl = `https://${googleHostname}/search?q=${encodeURIComponent(`site:reddit.com ${cleanQuery}`)}`;
        const altRedditUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(cleanQuery)}`;
        const redditElement = createMagnifierFilterElement({displayName: 'RT', iconDomain: 'reddit.com'}, mainRedditUrl, altRedditUrl, 'Search directly on Reddit');
        redditElement.addClass('gm-reddit-main-container');

        let subredditsString = cfg.get('Reddit_Subreddits') || '';
        if (subredditsString.trim() !== '') {
            const subreddits = subredditsString.split(',').map(sr => sr.trim().replace(/^(r\/)/i, '')).filter(Boolean);
            if (subreddits.length > 0) {
                const redditDropdown = $('<div class="gm-reddit-dropdown"></div>');
                subreddits.forEach(srName => {
                    const subredditUrl = `https://${googleHostname}/search?q=${encodeURIComponent(`site:reddit.com/r/${srName} ${cleanQuery}`)}`;
                    const subredditLinkEl = $(`<a href="${subredditUrl}" class="gm-more-dropdown-item" target="${linkTarget}">r/${srName}</a>`);
                    if(openInNewTab) subredditLinkEl.attr('rel', 'noopener noreferrer');
                    redditDropdown.append(subredditLinkEl);
                });
                redditElement.append(redditDropdown);
                redditElement.find('.gm-main-action').on('mouseenter', () => redditDropdown.stop(true, true).fadeIn(100));
                redditElement.on('mouseleave', () => redditDropdown.stop(true, true).fadeOut(200));
                redditDropdown.on('mouseenter', function() { $(this).stop(true, true).show(); });
            }
        }
        customFiltersMainContainer.append(redditElement);
    }

    // --- Custom Site Filters (Group 3 Behavior: Always Google) ---
    if (cfg.get('CustomSites_Enable')) {
        let customSitesRaw = cfg.get('CustomSites_List') || '';
        if (customSitesRaw.trim() !== '') {
            customSitesRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).forEach(domain => {
                const name = (domain.split('.')[0] || domain).replace(/^\w/, c => c.toUpperCase());
                const searchUrl = `https://${googleHostname}/search?q=site%3A${encodeURIComponent(domain)}+${encodeURIComponent(cleanQuery)}`;
                overflowLinkElements.push(createSimpleFilterLinkElement(name, searchUrl, domain));
            });
        }
    }

    // --- "More" Dropdown ---
    if (overflowLinkElements.length > 0) {
        const moreBtnContainer = $('<div id="gm-more-filters-btn-container" class="LatpMc nPDzT T3FoJb" style="position:relative; cursor:default; padding: 0 8px;"></div>');
        moreBtnContainer.append(`<svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="gm-filter-icon" style="fill:currentColor; width:20px; height:20px; margin:0;"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>`);
        const moreDropdown = $('<div id="gm-more-filters-dropdown"></div>');
        overflowLinkElements.forEach(el => {
            el.removeClass('LatpMc nPDzT T3FoJb');
            if (el.hasClass('gm-filter-item')) { // Complex item with magnifier
                 el.addClass('gm-more-dropdown-item').find('.gm-alt-search-action').hide(); // Hide magnifier in dropdown
                 el.find('.gm-main-action').css({'padding':'8px 16px', 'width':'100%'});
            } else { // Simple link
                 el.addClass('gm-more-dropdown-item');
            }
            moreDropdown.append(el);
        });
        moreBtnContainer.append(moreDropdown);
        customFiltersMainContainer.append(moreBtnContainer);
        moreBtnContainer.on('mouseenter', () => moreDropdown.stop(true, true).fadeIn(100)).on('mouseleave', () => moreDropdown.stop(true, true).fadeOut(200));
    }

    // --- Cleanup ---
    if (customFiltersMainContainer.children('.LatpMc').length <= 1) { customFiltersMainContainer.remove(); }

    // --- Styles ---
    GM_addStyle(`
        #gm-custom-filters-main-container { margin-left: 8px; }
        .gm-filter-item.LatpMc, .gm-custom-filter-link.LatpMc, .gm-clear-filter-button.LatpMc {
            margin-left: 1px; margin-right: 1px; padding: 0 10px; height: 36px;
            display: inline-flex !important; align-items: center; text-decoration: none; position: relative;
        }
        .gm-clear-filter-button.LatpMc { padding: 0 8px; margin-right: 5px; }
        .gm-filter-icon { width: 16px; height: 16px; margin-right: 5px; border-radius: 2px; }
        .gm-filter-label { vertical-align: middle; }
        .gm-main-action { display: flex; align-items: center; text-decoration: none; color: inherit; height: 100%; flex-grow: 1; }
        .gm-alt-search-action { display: inline-flex; align-items: center; justify-content: center; margin-left: 6px; padding: 3px; border-radius: 50%; cursor: pointer; width: 22px; height: 22px; color: inherit; }
        .gm-alt-search-action:hover { background-color: rgba(0,0,0,0.08); }
        .gm-alt-search-action svg { width: 15px; height: 15px; fill: currentColor; }
        #gm-more-filters-dropdown, .gm-reddit-dropdown {
            display: none; position: absolute; top: 100%; left: 0; background-color: white; border: 1px solid #dadce0;
            border-radius: 6px; z-index: 1005; min-width: 180px; max-width: 280px; max-height: 600px;
            overflow-y: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 6px 0; margin-top: 2px;
        }
        .gm-more-dropdown-item, .gm-reddit-dropdown > .gm-more-dropdown-item {
            display: flex !important; align-items: center; padding: 8px 16px !important; text-decoration: none !important;
            color: #202124 !important; font-size: 14px !important; white-space: nowrap !important;
            background-color: transparent !important; margin: 0 !important; height: auto !important;
        }
        .gm-more-dropdown-item:hover { background-color: #f1f3f4 !important; }
        .gm-more-dropdown-item .gm-filter-icon { margin-right: 8px !important; }
        .gm-reddit-dropdown a.gm-more-dropdown-item { padding-left: 24px !important; color: #202124 !important; }
    `);
});