// ==UserScript==
// @name         Custom Config Example
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Configurable form based on current domain
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/514790/Custom%20Config%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/514790/Custom%20Config%20Example.meta.js
// ==/UserScript==
//TODO: hide if target has words less than
//TODO: hide if target has words more than

/*
##GROUP:Auction
##GROUP:UI Improvements
*/

/**
 * @typedef {Object} ConfigProperty
 * @property {string} group - Group category for the configuration (e.g., 'Reddit Posts', 'UI Improvements').
 * @property {string} description - Description of what this config property controls.
 * @property {string} [hint] - Hint text for user guidance.
 * @property {boolean} isEnabledDefault - Default enabled status.
 * @property {'input' | 'textarea' | 'select' | 'checkbox'} formInput - Type of form input.
 * @property {string | boolean} formInputDefaultValue - Default value for form input (text, number, boolean).
 * @property {string[]} [formSelectOptions] - Options for select inputs, separated by "|".
 * @property {'filterWordsToHide' | 'hideLessThan' | 'hideMoreThan' | 'sortByCount' | 'addCss' | 'hide' | 'mustExist' | 'mustNotExist'} functionType - The function this config property will trigger.
 * @property {string[]} blockSelector - Array of CSS selectors to identify the main blocks for applying this config.
 * @property {string[]} [targetSelector] - CSS selectors for specific elements within the blocks.
 * @property {boolean} [targetMustExists=false] - Whether the targetSelector must exist for the function to run.
 * @property {string[]} [ignoreUrl] - URLs or patterns to ignore.
 * @property {string} [cssStyle] - CSS styles to apply when functionType is 'addCss'.
 * @property {string} [targetString] - Specific string to find in target when `mustExist` or `mustNotExist` is the functionType.
 */

/**
 * @typedef {Object} DomainConfig
 * @property {string} domain - The domain this configuration applies to.
 * @property {boolean} [observer=false] - Whether to enable observer mode.
 * @property {ConfigProperty[]} properties - List of properties for specific configurations.
 */

/**
 * Example configuration structure.
 * @type {DomainConfig[]}
 */
(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `

#searchFilters{margin-left: 8pt;padding:4pt;}

    .toggleButton123 {
    padding:4pt !important;
    }

    .formContainer123{
    padding:8pt !important;
    min-width:320px;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    }
    .globalOverrideContainer123{margin-bottom:8pt;  padding: 4pt 8pt !important;}

    .groupTitle123{margin-top:16pt !important;margin-bottom:4pt !important;  padding: 4pt 4pt 4pt 0 !important;}
    .container123{padding:4pt 8pt !important;margin-bottom:4pt!important;}

.inputElement123{margin-top:4pt !important;padding:4pt;}

.label123{cursor:pointer}
.descriptionText123{margin-right:8pt !important}
.editButton123{margin-left:8pt !important;padding:4pt !important}

.modal123{padding:8pt !important}
.modal123 textarea{width:auto !important}

.jsonTextarea123{background-color:#181a1b;color:#eee}



`;
    document.head.appendChild(style);

    // Get current domain
    const currentDomain = window.location.hostname.replace(/^www\./, '');

    // Configuration object

    const sampleConfig = [
        {
            domain: currentDomain,
            observer: false,
            properties: [
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide bids less than',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item'],
                    targetSelector: ['.s-item__bidCount.s-item__bids'],
                    targetMustExists: false,
                },
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide bids more than',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideMoreThan',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: ['.s-item__bidCount.s-item__bids'],
                    targetMustExists: false,
                },

                {
                    page: 'search results',
                    group: 'Search results',
                    description: 'Add notes to each item',
                    functionType: 'addNotes',
                    blockSelector: [
                        'ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item',
                    ],
                    targetSelector: ['.s-item__itemID.s-item__item-id', '.s-item'],
                    targetIdSelector: ['a']
                },
                {
                    page: 'search results',
                    group: 'Search results',
                    description: 'Hide individual items',
                    functionType: 'addHideButtons',
                    formInput: 'textarea',
                    blockSelector: [
                        'ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item',
                    ],
                    targetSelector: ['.s-item__itemID.s-item__item-id', '.s-item'],
                    targetIdSelector: ['a']
                },
                {
                    page: 'search results',
                    group: 'UI Improvements',
                    description: 'Sort by most sold',
                    isEnabledDefault: true,
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: ['.s-item__quantitySold.s-item__dynamic'],
                    targetMustExists: true,
                },


                {
                    page: 'search results',
                    group: 'UI Improvements',
                    description: 'Hide junk',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: [
                        '.x-footer',
                        '.s-feedback',
                        '.srp-refinements-guidance--gray-pills.srp-refinements-guidance',//related searches
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },

            ]
        },
    ];


    let config = [
        {
            domain: 'steampeek.hu',
            observer: true,
            properties: [
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out games.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['article.lister_item_cont'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    blockSelector: [
                        'article.lister_item_cont'// list
                    ],
                    targetSelector: ['.jump_to_store'],
                    targetIdSelector: ['.jump_to_store']
                },
            ]
        },
        {
            domain: 'themeforest.net',
            observer: true,
            properties: [
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out games.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['div.shared-item_cards-card_component__root', 'category-items_block_component__itemCard'],
                    targetSelector: [],
                    targetMustExists: false,
                },
            ]
        },
        {
            domain: 'temu.com',
            observer: true,
            properties: [
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.item-1mFcE'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Show anything containing',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToShow',
                    blockSelector: ['.item-1mFcE'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide Sold less than',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['.item-1mFcE'],
                    targetSelector: ['.desc-1M4Bq > span:nth-child(1)'],
                },
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide Sold more than',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideMoreThan',
                    blockSelector: ['.item-1mFcE'],
                    targetSelector: ['.desc-1M4Bq > span:nth-child(1)'],
                },


                {
                    page: 'Search',
                    group: 'UI Improvements',
                    description: 'Hide Get App and Promos',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['.downloadsWithBottomBorder-3-05y.downloadsWrapper-RLshn', '.topBar-3MwzH.cycleWrap-2ucEY', '#modal_id_wcfj1e04eg', '.topBar-1DqfX', 'div.buttonWrap-2P91L:nth-of-type(1)'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search',
                    group: 'UI Improvements',
                    description: 'Hide related keywords',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['.recommendCardItem-3TC7j'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Item Info',
                    group: 'UI Improvements',
                    description: 'Hide item noise',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['.wrap-gqA4H', '.businessEntityWrap-2ILD3', 'div.policyGroup-1GB_o', '.snsLinks-2Z8lE', '#C2980BE8EBC356BF'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Item Info',
                    group: 'UI Improvements',
                    description: 'Hide suggestions',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['.wrap-189WA'],
                    targetSelector: [],
                    targetMustExists: false,
                },

            ]
        },
        {
            domain: 'slickdeals.net',
            observer: true,
            properties: [
                {
                    page: 'Global page',
                    group: 'Deals',
                    description: 'Hide any deals containing',
                    hint: 'Enter keywords to filter out posts.',
                    formInput: 'textarea',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.frontpageGrid__feedItem', '.bp-c-card', '.resultRow'],
                    targetSelector: [],
                },

                {
                    page: 'Global page',
                    group: 'Deals',
                    description: 'Show deals with a minimum thumbs up',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['.frontpageGrid__feedItem', '.bp-c-card'],
                    targetSelector: ['.dealCardSocialControls__voteCount', '.bp-p-votingThumbsPopup_voteCount'],
                },
                {
                    page: 'Global page',
                    group: 'Deals',
                    description: 'Minimum number of comments',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['.frontpageGrid__feedItem', '.bp-c-card'],
                    targetSelector: ['.dealCardSocialControls__commentsCount', '.bp-p-socialDealCard_comments'],
                },


                {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Minimum number of ratings',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['div.resultRow'],
                    targetSelector: ['.ratingNum'],
                },
                {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Minimum number of views',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['div.resultRow'],
                    targetSelector: ['div.text:nth-of-type(1)'],
                },
                {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Minimum number of comments',
                    isEnabledDefault: false,
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['div.resultRow'],
                    targetSelector: ['div.text:nth-of-type(2)'],
                }, {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Sort posts by highest..',
                    functionType: 'sortByCount',
                    formInputDefaultValue: 'Ratings',
                    formSelectOptions: 'Ratings|Views|Comments',

                    blockSelector: ['div.resultRow'],
                    targetSelector: ['.ratingNum']
                },
                {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Sort posts by most views',
                    functionType: 'sortByCount',
                    blockSelector: ['div.resultRow'],
                    targetSelector: ['div.text:nth-of-type(1)']
                },
                {
                    page: 'Search results',
                    group: 'Deals',
                    description: 'Sort posts by most comments',
                    functionType: 'sortByCount',
                    blockSelector: ['div.resultRow'],
                    targetSelector: ['div.text:nth-of-type(2)']
                },


                {
                    page: 'Global page',
                    group: 'UI Improvements',
                    description: 'Hide Featured Coupons',
                    functionType: 'hide',
                    blockSelector: ['.bp-p-sidebarCoupons']
                },
                {
                    page: 'Global page',
                    group: 'UI Improvements',
                    description: 'Hide Trending Deals',
                    functionType: 'hide',
                    blockSelector: ['.bp-p-sidebarDeals', '#fpMainContent > .blueprint', '.topCategories'],
                },
                {
                    page: 'Global page',
                    group: 'UI Improvements',
                    description: 'Hide sidebar Deals',
                    functionType: 'hide',
                    blockSelector: ['.bp-p-sidebarDeals', 'div.sidebarDeals', 'us-button', '.dealDetailsPage__sidebar.dealDetailsSidebar', '#stickyRightRailWrapper'],
                },


                {
                    page: 'Deal page',
                    group: 'Comments',
                    description: 'Hide comments containing',
                    formInput: 'textarea',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.commentsThreadedCommentV2', '.commentsHiddenCommentV2'],
                },
                {
                    page: 'Deal page',
                    group: 'Comments',
                    description: 'Hide comments with words less than',
                    formInput: 'input',
                    functionType: 'filterWordsLessThanToHide',
                    blockSelector: ['.commentsThreadedCommentV2'],
                    targetSelector: ['.commentContentHtmlBlock'],
                },
                {
                    page: 'Deal page',
                    group: 'UI Improvements',
                    description: 'Hide unhelpful comments',
                    functionType: 'mustNotExist',
                    blockSelector: ['.commentsThreadedCommentV2', '.commentsHiddenCommentV2'],
                    targetString: [' rated as unhelpful'],
                },


            ]
        },
        {
            domain: 'youtube.com',
            observer: true,
            properties: [
                {
                    group: 'Search results',
                    description: 'Hide anything containing',
                    isEnabledDefault: false,
                    formInput: 'textarea',
                    formInputDefaultValue: 'Some default text',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ytd-video-renderer.ytd-item-section-renderer.style-scope'],
                    targetSelector: [],
                },
                {
                    group: 'Search results',
                    description: 'Hide titles containing',
                    isEnabledDefault: false,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ytd-video-renderer.ytd-item-section-renderer.style-scope'],
                    targetSelector: ['#video-title'],
                },
                {
                    group: 'Search results',
                    description: 'Hide subscribers containing',
                    isEnabledDefault: false,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ytd-video-renderer.ytd-item-section-renderer.style-scope'],
                    targetSelector: ['.yt-formatted-string.style-scope.yt-simple-endpoint'],
                },
            ]
        },

        {
            domain: 'amazon.com',
            observer: true,
            properties: [
                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: [
                        'div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'// list
                        , 'div.gsx-ies-anchor.sg-col-4-of-20.s-widget-spacing-small.sg-col.sg-col-4-of-16.s-asin.s-result-item.sg-col-4-of-12.sg-col-4-of-24 '//grid
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },


                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Add notes to each item',
                    functionType: 'addNotes',
                    blockSelector: [
                        'div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'// list
                        , 'div.gsx-ies-anchor.sg-col-4-of-20.s-widget-spacing-small.sg-col.sg-col-4-of-16.s-asin.s-result-item.sg-col-4-of-12.sg-col-4-of-24 '//grid
                    ],
                    targetSelector: ['h2'],
                    targetIdSelector: ['a']
                },
                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    blockSelector: [
                        'div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'// list
                        , 'div.gsx-ies-anchor.sg-col-4-of-20.s-widget-spacing-small.sg-col.sg-col-4-of-16.s-asin.s-result-item.sg-col-4-of-12.sg-col-4-of-24 '//grid
                    ],
                    targetSelector: ['h2'],
                    targetIdSelector: ['a']
                },

                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Min number of reviews',
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: [
                        'div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'// list
                        , 'div.gsx-ies-anchor.sg-col-4-of-20.s-widget-spacing-small.sg-col.sg-col-4-of-16.s-asin.s-result-item.sg-col-4-of-12.sg-col-4-of-24 '//grid
                    ],
                    targetSelector: ['.s-underline-text.a-size-base'],
                },

                {
                    page: 'Search results',
                    group: 'items',
                    description: 'Max number of reviews',
                    formInput: 'input',
                    functionType: 'hideMoreThan',
                    blockSelector: [
                        'div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'// list
                        , 'div.gsx-ies-anchor.sg-col-4-of-20.s-widget-spacing-small.sg-col.sg-col-4-of-16.s-asin.s-result-item.sg-col-4-of-12.sg-col-4-of-24 '//grid
                    ],
                    targetSelector: ['.s-underline-text.a-size-base'],
                },

                {
                    page: 'item review',
                    group: 'User reviews',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out reviews.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.a-spacing-none.a-row'],
                    targetSelector: [],
                    targetMustExists: false,
                },

                {
                    page: 'item page',
                    group: 'UI Improvements',
                    description: 'Frequently bought together',
                    isEnabledDefault: true,
                    functionType: 'hide',
                    blockSelector: ['.bucket.cardRoot'],

                },


                {
                    page: 'Cart',
                    group: 'items',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out items.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: [
                        '.sc-list-item.a-row'// list
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Cart',
                    group: 'items',
                    description: 'Only show items containing',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToShow',
                    blockSelector: [
                        '.sc-list-item.a-row'// list
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },

            ]
        },

        {
            domain: 'airbnb.com',
            observer: true,
            properties: [
                {
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: [
                        '.dir-ltr.dir.atm_dz_1osqo2v.atm_9s_11p5wf0.c4mnd7m',
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },


                {
                    group: 'Search results',
                    description: 'Add notes to each item',
                    functionType: 'addNotes',
                    blockSelector: [
                        '.dir-ltr.dir.atm_dz_1osqo2v.atm_9s_11p5wf0.c4mnd7m',
                    ],
                    targetSelector: ['._11jcbg2'],
                    targetIdSelector: ['a']
                },
                {
                    group: 'Search results',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    blockSelector: [
                        '.dir-ltr.dir.atm_dz_1osqo2v.atm_9s_11p5wf0.c4mnd7m',
                    ],
                    targetSelector: ['._11jcbg2'],
                    targetIdSelector: ['a']
                },

                {
                    group: 'Search results',
                    description: 'Min number of reviews',
                    formInput: 'input',
                    functionType: 'hideLessThan',
                    blockSelector: ['div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'],
                    targetSelector: ['.s-underline-text.a-size-base'],
                },

                {
                    group: 'Search results',
                    description: 'Max number of reviews',
                    formInput: 'input',
                    functionType: 'hideMoreThan',
                    blockSelector: ['div.sg-col-12-of-16.gsx-ies-anchor.s-widget-spacing-small.sg-col.sg-col-16-of-20.sg-col-0-of-12.s-asin.s-result-item.sg-col-20-of-24 > .sg-col-inner'],
                    targetSelector: ['.s-underline-text.a-size-base'],
                },

                {
                    group: 'User reviews',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out reviews.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: '',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.a-spacing-none.a-row'],
                    targetSelector: [],
                    targetMustExists: false,
                },

                {
                    group: 'UI Improvements',
                    description: 'Frequently bought together',
                    isEnabledDefault: true,
                    functionType: 'hide',
                    blockSelector: ['.bucket.cardRoot'],

                },

            ]
        },
        {
            domain: 'reddit.com',
            observer: true,
            properties: [
                {
                    page: 'Posts',
                    group: 'Reddit Posts',
                    description: 'Hide anything containing',
                    isEnabledDefault: false,
                    formInput: 'textarea',
                    formInputDefaultValue: 'Some default text',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['article',//posts
                        'faceplate-tracker' // search results
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Posts',
                    group: 'Reddit Posts',
                    description: 'Hide posts with less than # comments',
                    isEnabledDefault: false,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['article'],
                    targetSelector: ['comment-count'],
                    targetMustExists: false,
                },
                {
                    page: 'Whole site',
                    group: 'UI Improvements',
                    description: 'Hide right sidebar posts',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['#right-sidebar-container'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Whole site',
                    group: 'UI Improvements',
                    description: 'Hide community content',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['[aria-label="Community information"]'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Whole site',
                    group: 'UI Improvements',
                    description: 'Hide left sidebar',
                    functionType: 'hide',
                    blockSelector: ['#left-sidebar-container']
                },

            ]
        },
        {
            domain: 'old.reddit.com',
            properties: [
                {
                    group: 'Reddit Posts',
                    description: 'Hide anything containing',
                    isEnabledDefault: false,
                    formInput: 'textarea',
                    formInputDefaultValue: 'Some default text',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.thing'],
                    targetSelector: [],
                },
                {
                    group: 'Reddit Posts',
                    description: 'Hide posts with less than X comments',
                    isEnabledDefault: false,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['.thing'],
                    targetSelector: ['.comments']
                },
                {
                    group: 'Reddit Posts',
                    description: 'Hide posts with less than X upvotes',
                    isEnabledDefault: false,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['.thing'],
                    targetSelector: ['.score.unvoted']
                },
                {
                    group: 'Reddit Posts',
                    description: 'Sort posts by',
                    isEnabledDefault: false,
                    formInput: 'select',
                    formInputDefaultValue: 'Most upvotes',
                    formSelectOptions: 'Most upvotes|Least upvotes',
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['.thing'],
                    targetSelector: ['.score.unvoted']
                },

                {
                    group: 'UI Improvements',
                    description: 'Hide Reddit Premium',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['#redesign-beta-optin-btn', '.premium-banner-outer'],
                    targetSelector: ['.title']
                },
                {
                    group: 'UI Improvements',
                    description: 'Hide footer',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: '.footer-parent',
                },
                {
                    group: 'UI Improvements',
                    description: 'Make post width readable',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    formInputDefaultValue: true,
                    functionType: 'addCss',
                    blockSelector: ['#siteTable', '.content'],
                    cssStyle: '  max-width: 800px;  margin: auto;'
                },
            ]
        },
        {
            domain: 'worldstarhiphop.com',
            observer: false,
            properties: [
                {
                    page: 'Results',
                    group: 'Videos',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['section.box.col-3'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Results',
                    group: 'Search results',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    formInput: 'textarea',
                    blockSelector: ['section.box.col-3'],
                    targetSelector: ['.comments'],
                    targetIdSelector: ['a']
                },

                {
                    page: 'Results',
                    group: 'UI Improvements',
                    description: 'Sort posts by views',
                    hint: 'Choose how to sort the posts.',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    formInputDefaultValue: 'Most upvotes',
                    formSelectOptions: 'Most upvotes|Least upvotes',
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['section.box.col-3'],
                    targetSelector: ['.views'],
                    targetMustExists: false,
                },
                {
                    page: 'Results',
                    group: 'UI Improvements',
                    description: 'Hide junk',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['.tag-scroll', 'section > .heading', '.w-full > .text-center.w-full.justify-center.flex', '.justify-items-stretch.hidden', 'footer', '#main > section > .heading > h1'],
                    targetSelector: [],
                    targetMustExists: false,
                },
            ]
        },
        {
            domain: 'offerup.com',
            observer: true,
            properties: [
                {
                    page: 'Search',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ul > li'],
                    targetSelector: [],
                    targetMustExists: false,
                },

                {
                    page: 'Search',
                    group: 'UI Improvements',
                    description: 'Block ads from search results',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['ul > a',],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search',
                    group: 'UI Improvements',
                    description: 'Hide footer',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: ['[data-testid="Footer"]',],
                    targetSelector: [],
                    targetMustExists: false,
                },

            ]
        },
        {
            domain: 'ebay.com',
            observer: false,
            properties: [
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide bids less than',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item'],
                    targetSelector: ['.s-item__bidCount.s-item__bids'],
                    targetMustExists: false,
                },
                {
                    page: 'search results',
                    group: 'auction',
                    description: 'Hide bids more than',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideMoreThan',
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: ['.s-item__bidCount.s-item__bids'],
                    targetMustExists: false,
                },

                {
                    page: 'search results',
                    group: 'Search results',
                    description: 'Add notes to each item',
                    functionType: 'addNotes',
                    blockSelector: [
                        'ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item',
                    ],
                    targetSelector: ['.s-item__itemID.s-item__item-id', '.s-item'],
                    targetIdSelector: ['a']
                },
                {
                    page: 'search results',
                    group: 'Search results',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    formInput: 'textarea',
                    blockSelector: [
                        'ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item',
                    ],
                    targetSelector: ['.s-item__itemID.s-item__item-id', '.s-item'],
                    targetIdSelector: ['a']
                },
                {
                    page: 'search results',
                    group: 'UI Improvements',
                    description: 'Sort by most bid count',
                    isEnabledDefault: true,
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: ['.s-item__bidCount.s-item__bids'],
                    targetMustExists: false,
                },
                {
                    page: 'search results',
                    group: 'UI Improvements',
                    description: 'Sort by most sold',
                    isEnabledDefault: true,
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['ul.srp-results li.s-item, ul#ListViewInner li[listingid]', '.s-item__pl-on-bottom.s-item', '.s-item'],
                    targetSelector: ['.s-item__quantitySold.s-item__dynamic'],
                    targetMustExists: true,
                },


                {
                    page: 'search results',
                    group: 'UI Improvements',
                    description: 'Hide junk',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    functionType: 'hide',
                    blockSelector: [
                        '.x-footer',
                        '.s-feedback',
                        '.srp-refinements-guidance--gray-pills.srp-refinements-guidance',//related searches
                    ],
                    targetSelector: [],
                    targetMustExists: false,
                },
            ]
        },

        {
            domain: 'greasyfork.org',
            observer: false,
            properties: [


                {
                    page: 'scripts',
                    group: 'list',
                    description: 'Hide indivdual items',
                    functionType: 'addHideButtons',
                    formInput: 'textarea',
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: ['.script-meta-block'],
                    targetIdSelector: ['.script-link']
                },
                {
                    page: 'scripts',
                    group: 'list',
                    description: 'Add notes to each item',
                    functionType: 'addNotes',
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: ['.script-meta-block'],
                    targetIdSelector: ['.script-link']
                },

                {
                    page: 'scripts',
                    group: 'list',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'scripts',
                    group: 'list',
                    description: 'Hide daily installs less than',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: ['dd.script-list-daily-installs > span'],
                    targetMustExists: false,
                },
                {
                    page: 'scripts',
                    group: 'list',
                    description: 'Hide total installs less than',
                    isEnabledDefault: true,
                    formInput: 'input',
                    formInputDefaultValue: '',
                    functionType: 'hideLessThan',
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: ['dd.script-list-total-installs > span'],
                    targetMustExists: false,
                },
                {
                    page: 'scripts',
                    group: 'UI Improvements',
                    description: 'Sort by most installs',
                    isEnabledDefault: true,
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['#browse-script-list > li'],
                    targetSelector: ['dd.script-list-total-installs > span'],
                    targetMustExists: false,
                },
            ]
        },
        {
            domain: 'erome.com',
            observer: true,
            properties: [
                {
                    page: 'Search results',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['.album'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search results',
                    group: 'UI Improvements',
                    description: 'Sort posts by views',
                    isEnabledDefault: true,
                    formInputDefaultValue: 'Most upvotes',
                    formSelectOptions: 'Most upvotes|Least upvotes',
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['.album'],
                    targetSelector: ['.album-bottom-views'],
                    targetMustExists: true,
                },
                {
                    page: 'Search results',
                    group: 'UI Improvements',
                    description: 'Hide photos only',
                    isEnabledDefault: true,
                    formInput: 'checkbox',
                    functionType: 'mustExist',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['.album'],
                    targetString: ['fa-video'],
                    targetMustExists: true,
                },
                {
                    page: 'Detail',
                    group: 'UI Improvements',
                    description: 'Hide full images from loading',
                    isEnabledDefault: true,
                    functionType: 'mustNotExist',
                    formInput: 'checkbox',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['.media-group'],
                    targetString: ['img-front'],
                    targetMustExists: true,
                },
                {
                    page: 'Search results',
                    group: 'UI Improvements',
                    description: 'Auto click explore button',
                    isEnabledDefault: true,
                    functionType: 'autoClick',
                    ignoreUrl: ['/comments/'],
                    targetSelector: ['.home-explore', '.enter']
                },
                {
                    page: 'Search results',
                    group: 'UI Improvements',
                    description: 'Hide junk',
                    isEnabledDefault: true,
                    formInputDefaultValue: true,
                    formInput: 'checkbox',
                    functionType: 'hide',
                    blockSelector: ['.suggested-users', '#bubble', '.hidden-lg.hidden-md.hidden-sm.sp-mob', '.bubble-mobile'],
                    targetSelector: [],
                    targetMustExists: false,
                },
            ]
        },

        {
            domain: 'jav.guru',
            observer: true,
            properties: [
                {
                    page: 'Search results',
                    group: 'Search results',
                    description: 'Hide anything containing',
                    hint: 'Enter keywords to filter out posts.',
                    isEnabledDefault: true,
                    formInput: 'textarea',
                    formInputDefaultValue: 'heated',
                    functionType: 'filterWordsToHide',
                    blockSelector: ['div.row'],
                    targetSelector: [],
                    targetMustExists: false,
                },
                {
                    page: 'Search results',
                    group: 'UI Improvements',
                    description: 'Sort posts by views',
                    isEnabledDefault: true,
                    formInputDefaultValue: 'Most upvotes',
                    formSelectOptions: 'Most upvotes|Least upvotes',
                    functionType: 'sortByCount',
                    ignoreUrl: ['/comments/'],
                    blockSelector: ['div.row'],
                    targetSelector: ['.javstats'],
                    targetMustExists: true,
                },
            ]
        },
    ];


    /*
    Global functions
    */

    const storageType = 'gm';

    // Function to retrieve an item from storage by its name.
    async function getCustomConfig(currentDomain) {
        const key = 'customConfig';
        //console.log('getItem', key);
        if (storageType === 'localStorage') {
            return localStorage.getItem(key) || '';
        } else {
            return await GM_getValue(key, '');
        }
    }

    // Function to retrieve an item from storage by its name.
    async function getItem(itemName) {
        const key = currentDomain + '_' + itemName;
        //console.log('getItem', key);
        if (storageType === 'localStorage') {
            return localStorage.getItem(key) || '';
        } else {
            return await GM_getValue(key, '');
        }
    }

    async function saveItem(itemName, saveValue) {
        const key = currentDomain + '_' + itemName;

        //console.log('saveItem', key, saveValue);
        if (storageType === 'localStorage') {
            localStorage.setItem(key, saveValue);
        } else {
            await GM_setValue(key, saveValue);
        }
    }

    async function appendItem(itemName, saveValue) {
        const key = currentDomain + '_' + itemName;

        // Retrieve the existing value
        let existingValue;
        if (storageType === 'localStorage') {
            existingValue = localStorage.getItem(key) || '';
        } else {
            existingValue = await GM_getValue(key, '');
        }

        // Append the new value to the existing value with a newline
        const newValue = existingValue ? existingValue + '\n' + saveValue : saveValue;

        //console.log('appendItem', key, saveValue);

        // Save the updated value
        if (storageType === 'localStorage') {
            localStorage.setItem(key, newValue);
        } else {
            await GM_setValue(key, newValue);
        }
    }


    // Find matching config
    let currentConfig = config.find(c => c.domain === currentDomain);

    getItem('customConfig').then(configString => {
        // Convert string to object safely
        let customConfig;
        try {
            customConfig = JSON.parse(configString);
            if (typeof customConfig !== 'object' || customConfig === null) {
                customConfig = {};
            }
        } catch (e) {
            console.warn('Invalid JSON format, using default config.');
            customConfig = {};
        }

        // Override currentConfig only if customConfig is valid for this domain
        if (customConfig[currentDomain]) {
            currentConfig = customConfig[currentDomain];
        }



        // Call functions that depend on currentConfig here
        initializeUI(currentConfig);
    });

    // Example function that depends on currentConfig
    function initializeUI(currentConfig) {

        if (!currentConfig) {
            // return;
        }

        // Create and show the form if there is a matching config


        function injectEarlyStyles() {
            const styleId = 'dynamicStyles'; // Unique ID for the style element
            let style = document.getElementById(styleId);

            // If style element with the ID doesn't exist, create it
            if (!style) {
                style = document.createElement('style');
                style.type = 'text/css';
                style.id = styleId;
                document.head.appendChild(style);
            }

            // Initialize CSS rules as an array to collect individual rule strings
            let cssRules = [];

            // Ensure currentConfig and properties are defined
            if (currentConfig && currentConfig.properties) {

                // Collect all promises for displayType values
                const promises = currentConfig.properties.map(property => {
                    const uniqueClassName = `hide_${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;
                    const displayTypeKey = `displayType_${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;

                    // Return the getItem promise with logic to add CSS rules based on displayType
                    return getItem(displayTypeKey).then(displayType => {
                        if (displayType === 'highlight') {
                            cssRules.push(`.${uniqueClassName} {
                        background-color: #e48585 !important;
                        outline: 1px solid #e48585 !important;
                    }`);
                        } else if (displayType === 'blur') {
                            //cssRules.push(`.${uniqueClassName} { filter: blur(10px) !important; }.${uniqueClassName}:hover { filter: none !important; }`);
                            cssRules.push(`.${uniqueClassName} { opacity: 0.3 !important; }.${uniqueClassName}:hover {opacity:1 !important; }`);
                        } else {
                            cssRules.push(`.${uniqueClassName} { display: none !important; }`);
                        }
                    });
                });

                // Wait for all getItem promises to complete
                Promise.all(promises).then(() => {
                    // Combine cssRules array into a single string
                    const cssContent = cssRules.join('\n');

                    // Update the style element's content
                    style.textContent = cssContent;
                });
            }
        }


        if (document.readyState === 'loading') {
            // Add styles immediately if DOM is still loading
            injectEarlyStyles();
            // Execute on form load
            evaluateAndExecuteFunctions();
        } else {
            // Add styles right away if DOM is already loaded
            injectEarlyStyles();
            // Execute on form load
            evaluateAndExecuteFunctions();
        }


        // Create a global override checkbox
        const globalOverrideContainer = document.createElement('div');
        globalOverrideContainer.classList.add('globalOverrideContainer123');

        globalOverrideContainer.style.color = '#fff';
        globalOverrideContainer.style.display = 'flex';
        globalOverrideContainer.style.alignItems = 'center';
        globalOverrideContainer.style.borderRadius = '10px';

        const globalOverrideCheckbox = document.createElement('input');
        globalOverrideCheckbox.type = 'checkbox';
        globalOverrideCheckbox.id = 'globalOverrideIsEnabled';
        globalOverrideCheckbox.style.marginRight = '8pt';
        globalOverrideCheckbox.checked = false;

        const globalOverrideLabel = document.createElement('label');
        globalOverrideLabel.htmlFor = 'globalOverrideIsEnabled';
        globalOverrideLabel.innerText = 'Enable';

        globalOverrideContainer.appendChild(globalOverrideCheckbox);
        globalOverrideContainer.appendChild(globalOverrideLabel);


        // Create the searchFilters input
        const searchFiltersInput = document.createElement('input');
        searchFiltersInput.type = 'text';
        searchFiltersInput.id = 'searchFilters';
        searchFiltersInput.name = 'searchFilters';
        searchFiltersInput.placeholder = 'Enter search filters';
        searchFiltersInput.style.border = '1px solid #222222';
        searchFiltersInput.style.borderRadius = '5px';
        searchFiltersInput.style.backgroundColor = '#eeeeee';
        searchFiltersInput.style.color = '#000';


        globalOverrideContainer.appendChild(searchFiltersInput);
        // Function to filter elements based on search input
        searchFiltersInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const contentContainers = document.querySelectorAll('.container123');

            contentContainers.forEach(container => {
                const textContent = container.textContent.toLowerCase();
                if (textContent.includes(searchTerm)) {
                    container.style.display = 'flex'; // Show the element
                } else {
                    container.style.display = 'none'; // Hide the element
                }
            });
        });


        // Load the global override value
        getItem('globalOverrideIsEnabled').then(savedValue => {
            if (savedValue) {
                globalOverrideCheckbox.checked = true;
            } else {
                globalOverrideCheckbox.checked = false;
            }
        });

        globalOverrideCheckbox.oninput = () => {
            saveItem(globalOverrideCheckbox.id, globalOverrideCheckbox.checked);
            evaluateAndExecuteFunctions();
        };


        const formContainer = document.createElement('div');
        formContainer.classList.add('formContainer123');
        formContainer.style.position = 'fixed';
        //formContainer.style.bottom = '50px';
        //formContainer.style.left = '20px';
        formContainer.style.backgroundColor = '#181a1b';
        formContainer.style.border = '1px solid #000';
        formContainer.style.color = '#e8e6e3';
        formContainer.style.borderRadius = '10px';

        formContainer.style.zIndex = '9999';
        formContainer.style.maxWidth = '420px'; // Max width
        formContainer.style.maxHeight = '80vh'; // Max height
        //formContainer.style.height = '90%'; // Max height
        formContainer.style.overflowY = 'auto'; // Enable scrolling

        //formContainer.style.maxWidth = '400px';

        formContainer.appendChild(globalOverrideContainer);




        config.push(currentConfig);


        if(config){
            config = removeLowestDuplicateDomainConfig(config);
        }
        // Group properties by page, then by group, and description
        const groupedProperties = config.reduce((acc, configItem) => {
            if(!configItem)return;

            const {domain, properties} = configItem;

            // Only proceed if the domain exactly matches the currentDomain
            if (currentDomain === domain) {
                currentConfig.properties.forEach(property => {
                    const {page, group} = property;

                    // Initialize nested structure if it doesn't exist
                    if (!acc[domain]) acc[domain] = {};
                    if (!acc[domain][page]) acc[domain][page] = {};
                    if (!acc[domain][page][group]) acc[domain][page][group] = [];

                    // Push property to the correct place
                    acc[domain][page][group].push(property);
                });
            }


            return acc;
        }, {});


        let isFirstPage = true;
        for (const domain in groupedProperties) {

            const domainPages = Object.keys(groupedProperties[domain]);

            for (const page in groupedProperties[domain]) {

                // Check if there's more than one page before adding the pageTitle
                if (domainPages.length > 1) {
                    const pageTitle = document.createElement('div');
                    pageTitle.classList.add('pageTitle123');
                    pageTitle.innerText = page;
                    pageTitle.style.marginBottom = '8pt';
                    pageTitle.style.fontWeight = 'bold';
                    pageTitle.style.color = '#00cc66';
                    pageTitle.style.marginTop = isFirstPage ? '0px' : '20px';
                    isFirstPage = false;
                    formContainer.appendChild(pageTitle);
                }

                // Loop through groups within the page
                for (const group in groupedProperties[domain][page]) {
                    const groupTitle = document.createElement('div');
                    groupTitle.classList.add('groupTitle123');
                    groupTitle.innerText = group;
                    groupTitle.style.color = '#00aaff';
                    formContainer.appendChild(groupTitle);

                    // Loop through properties in each group
                    groupedProperties[domain][page][group].forEach(property => {

                        const container = document.createElement('div');
                        container.classList.add('container123');
                        container.style.display = 'flex';
                        container.style.alignItems = 'baseline';
                        container.style.borderRadius = '10px';
                        container.style.backgroundColor = '#2e2e2e';

                        // Create checkbox for isEnabled
                        const isEnabledCheckbox = document.createElement('input');
                        isEnabledCheckbox.classList.add('isEnabledCheckbox123');
                        isEnabledCheckbox.type = 'checkbox';
                        isEnabledCheckbox.checked = property.isEnabledDefault;
                        isEnabledCheckbox.style.marginRight = '8pt';
                        isEnabledCheckbox.id = `isEnabled_${page.replace(/\s+/g, '_')}_${group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;

                        getItem(isEnabledCheckbox.id).then(savedValue => {
                            if (savedValue) {
                                isEnabledCheckbox.checked = savedValue;
                            } else {
                                isEnabledCheckbox.checked = false;
                            }
                        });

                        // Content container for labels and input elements
                        const contentContainer = document.createElement('div');
                        contentContainer.classList.add('contentContainer123');
                        contentContainer.style.display = 'flex';
                        contentContainer.style.flexDirection = 'column';
                        contentContainer.style.width = '100%';

                        // Description label with 'edit' button
                        const label = document.createElement('label');
                        label.classList.add('label123');
                        label.htmlFor = isEnabledCheckbox.id;
                        label.style.marginBottom = '0px';
                        label.style.color = '#e8e6e3';
                        label.style.display = 'flex';
                        label.style.justifyContent = 'space-between';
                        label.style.alignItems = 'center';
                        label.style.fontWeight = 'normal';
                        label.style.maxWidth = '300px';

                        // Description text
                        const descriptionText = document.createElement('span');
                        descriptionText.classList.add('descriptionText123');
                        descriptionText.innerText = property.description;
                        label.appendChild(descriptionText);

                        // Edit button
                        const editButton = document.createElement('button');
                        editButton.classList.add('editButton123');
                        editButton.innerText = '⋮';
                        editButton.style.backgroundColor = '#181a1b';
                        editButton.style.color = '#fff';
                        editButton.style.border = 'none';
                        editButton.style.borderRadius = '5px';
                        editButton.style.cursor = 'pointer';


                        contentContainer.appendChild(label);

                        // Input field creation based on formInput type
                        let inputElement;
                        switch (property.formInput) {
                            case 'textarea':
                                inputElement = document.createElement('textarea');
                                inputElement.classList.add('inputElement123');
                                inputElement.value = property.formInputDefaultValue || '';
                                inputElement.style.width = '100%';
                                inputElement.style.height = '150px';
                                inputElement.style.color = '#cccccc';
                                inputElement.style.border = '1px solid #222222';
                                inputElement.style.borderRadius = '5px';
                                inputElement.style.backgroundColor = '#121212';
                                inputElement.id = `${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;

                                getItem(inputElement.id).then(savedTextValue => {
                                    if (savedTextValue !== null) {
                                        inputElement.value = savedTextValue;
                                    }
                                });

                                inputElement.onblur = () => {
                                    saveItem(inputElement.id, inputElement.value);
                                    executeFunction(property);
                                };

                                break;
                            case 'input':
                                inputElement = document.createElement('input');
                                inputElement.classList.add('inputElement123');
                                inputElement.type = 'text';
                                inputElement.value = property.formInputDefaultValue || '';
                                inputElement.style.width = '100%';
                                //inputElement.style.marginTop = '10px';
                                inputElement.style.color = '#cccccc';
                                inputElement.style.border = '1px solid #222222';
                                inputElement.style.borderRadius = '5px';
                                inputElement.style.maxWidth = '50px';
                                inputElement.style.marginLeft = 'auto';
                                inputElement.style.backgroundColor = '#121212';
                                inputElement.id = `${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;

                                getItem(inputElement.id).then(savedInputValue => {
                                    if (savedInputValue !== null) {
                                        inputElement.value = savedInputValue;
                                    }
                                });

                                inputElement.oninput = () => {
                                    saveItem(inputElement.id, inputElement.value);
                                    executeFunction(property);
                                };
                                break;

                            case 'checkbox':
                                getItem(`isEnabled_${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`).then(isEnabled => {
                                    if (isEnabled || isEnabledCheckbox.checked) {
                                        executeFunction(property);
                                    }
                                });
                                break;
                        }


                        // global options for each filter
                        // Create a container for the radio buttons
                        const radioElement = document.createElement('div');
                        radioElement.classList.add('radioElement123');
                        radioElement.style.display = 'flex';
                        radioElement.style.gap = '10px';
                        radioElement.style.marginTop = '10px';
                        radioElement.style.alignItems = 'center';

                        // Assign an ID to the radio container based on the dynamic `displayType.id`
                        radioElement.id = `displayType_${page.replace(/\s+/g, '_')}_${group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`;

                        // Options for the inline radio form
                        const options = [
                            {value: 'hide', label: 'Hide'},
                            {value: 'blur', label: 'Blur'},
                            {value: 'highlight', label: 'Highlight'},
                        ];

                        // Bind the edit button
                        editButton.onclick = () => {
                            // Toggle the visibility of the input element
                            if (inputElement && property.formInput !== 'input') {
                                inputElement.style.display = (inputElement.style.display === 'none' || inputElement.style.display === '') ? 'block' : 'none';
                            }

                            // Toggle the visibility of the radio container if it exists
                            if (radioElement) {
                                radioElement.style.display = (radioElement.style.display === 'none' || radioElement.style.display === '') ? 'block' : 'none';
                            }


                            // Activate selection mode
                            toggleSelectionMode();

                        };


                        // Loop to create each radio button
                        options.forEach(option => {
                            // Create the radio button input
                            const radioInput = document.createElement('input');
                            radioInput.classList.add('radioInput123');
                            radioInput.type = 'radio';
                            radioInput.name = radioElement.id; // Ensures all options belong to the same group
                            radioInput.value = option.value;
                            radioInput.id = `${radioElement.id}_${option.value}`;
                            radioInput.style.marginRight = '4pt';

                            // Create the label for the radio button
                            const radioLabel = document.createElement('label');
                            radioLabel.classList.add('radioLabel123');
                            radioLabel.htmlFor = radioInput.id;
                            radioLabel.innerText = option.label;
                            radioLabel.style.marginRight = '8pt';

                            // Load the saved radio selection if it exists
                            getItem(radioElement.id).then(savedValue => {
                                if (savedValue === option.value) {
                                    radioInput.checked = true;
                                }
                            });

                            // Save the selected option when the radio button is clicked
                            radioInput.onchange = () => {
                                if (radioInput.checked) {
                                    saveItem(radioElement.id, radioInput.value); // Save the selected value
                                    executeFunction(property); // Call your function to apply the setting

                                    injectEarlyStyles();// update the style
                                }
                            };

                            // Append each radio button and its label to the container
                            radioElement.appendChild(radioInput);
                            radioElement.appendChild(radioLabel);
                        });


                        // Append the input,textarea,select
                        if (property.formInput === 'input') {
                            label.appendChild(inputElement);
                        }
                        // Initially hide the textarea element
                        else if (inputElement) {
                            inputElement.style.display = 'none';
                            contentContainer.appendChild(inputElement);

                        }
                        // Append the container to your form or parent container
                        radioElement.style.display = 'none';
                        contentContainer.appendChild(radioElement);

                        // Add edit button if form exists
                        if (property.formInput) {
                            label.appendChild(editButton);
                        }


                        // Hide edit if no input

                        // Append checkbox and content to the container

                        container.appendChild(isEnabledCheckbox);
                        container.appendChild(contentContainer);


                        // Append the container to the form container
                        formContainer.appendChild(container);


                        // Change handler for the checkbox to show/hide input fields
                        isEnabledCheckbox.onchange = () => {
                            if (inputElement && property.formInput !== 'input') {
                                inputElement.style.display = isEnabledCheckbox.checked ? 'block' : 'none';
                            }

                            saveItem(isEnabledCheckbox.id, isEnabledCheckbox.checked);
                            executeFunction(property);
                        };
                    });
                }
            }
        }

        document.body.appendChild(formContainer);


        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('toggleButton123');
        toggleButton.innerText = 'Filter';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '30%';
        toggleButton.style.left = '15px';
        toggleButton.style.backgroundColor = '#2b2a33';
        toggleButton.style.color = 'white';
        toggleButton.style.border = '1px solid #000';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '9999999';

        // Add click event to toggle the formContainer visibility
        let isFormContainerVisible = false; // Track visibility state
        toggleButton.addEventListener('click', () => {
            isFormContainerVisible = !isFormContainerVisible; // Toggle state
            formContainer.style.display = isFormContainerVisible ? 'block' : 'none'; // Show or hide formContainer
        });

        // Set initial display to 'none' to keep it hidden on load
        formContainer.style.display = 'none';


        // Create the edit button
        const editButton = document.createElement('button');
        editButton.classList.add('editButton123');
        editButton.innerText = 'Edit';
        editButton.style.display = 'block';
        editButton.style.marginTop = '10px';
        editButton.style.backgroundColor = '#2b2a33';
        editButton.style.color = 'white';
        editButton.style.border = '1px solid #000';
        editButton.style.borderRadius = '5px';
        editButton.style.cursor = 'pointer';

        // Create the textarea (initially hidden)
        const jsonTextarea = document.createElement('textarea');
        jsonTextarea.classList.add('jsonTextarea123');
        jsonTextarea.style.width = '100%';
        jsonTextarea.style.height = '150px';
        jsonTextarea.style.display = 'none'; // Initially hidden
        jsonTextarea.style.marginTop = '10px';

        // Create the save button (initially hidden)
        const saveButton = document.createElement('button');
        saveButton.classList.add('saveButton123');
        saveButton.innerText = 'Save';
        saveButton.style.display = 'none'; // Initially hidden
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = '1px solid #000';
        saveButton.style.borderRadius = '5px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.marginTop = '5px';

        // Append the textarea and save button inside formContainer
        formContainer.appendChild(editButton);
        formContainer.appendChild(jsonTextarea);
        formContainer.appendChild(saveButton);


        // Add event listener to toggle the textarea and load JSON config
        editButton.addEventListener('click', () => {
            const isHidden = jsonTextarea.style.display === 'none';

            if (isHidden && currentConfig) {
                jsonTextarea.value = JSON.stringify(currentConfig, null, 4); // Pretty-print JSON
            }

            if(!jsonTextarea.value){
                jsonTextarea.value = JSON.stringify(sampleConfig[0], null, 4); // Pretty-print JSON
            }

            jsonTextarea.style.display = isHidden ? 'block' : 'none';
            saveButton.style.display = isHidden ? 'block' : 'none';
        });

        // Event listener for save button

        saveButton.addEventListener('click', async () => {
            try {
                // Trim and parse the JSON from textarea
                const updatedConfig = JSON.parse(jsonTextarea.value.trim());

                // Log parsed JSON to confirm validity
                console.log('Parsed JSON:', updatedConfig);

                // Retrieve stored config and ensure it's an object
                let storedConfig = await getItem('customConfig');

                // Ensure storedConfig is valid JSON or initialize it as an empty object
                try {
                    storedConfig = JSON.parse(storedConfig);
                    if (typeof storedConfig !== 'object' || storedConfig === null) {
                        storedConfig = {};
                    }
                } catch (e) {
                    console.warn('Stored config was not valid JSON, resetting.');
                    storedConfig = {};
                }

                // Update only the current domain's config
                storedConfig[currentDomain] = updatedConfig;
                // Save updated config to storage
                await saveItem('customConfig', JSON.stringify(storedConfig, null, 4));

                alert('Config saved successfully!');
            } catch (error) {
                alert('Error: Invalid JSON format');
                console.error('Invalid JSON:', jsonTextarea.value);
            }
        });


        // Append the toggle button and form container to the document body
        document.body.appendChild(toggleButton);
        document.body.appendChild(formContainer);


        // Function to evaluate which settings are enabled and execute the function
        function evaluateAndExecuteFunctions() {
            if(!currentConfig || !currentConfig.properties){return;}
            for (const property of currentConfig.properties) {

                getItem(`isEnabled_${property.page.replace(/\s+/g, '_')}_${property.group.replace(/\s+/g, '_')}_${property.description.replace(/\s+/g, '_')}`).then(isEnabled => {

                    executeFunction(property);
                });

            }
        }


        // Function to execute based on functionType
        function executeFunction(property) {
            console.log(`Executing function for: ${property.description}`);


            switch (property.functionType) {
                case 'hide':
                    hide(property);
                    break;
                case 'filterWordsToHide':
                    filterWordsToHide(property);
                    break;

                case 'filterWordsToShow':
                    filterWordsToShow(property);
                    break;

                case 'filterWordsLessThanToHide':
                    filterWordsLessThanToHide(property);
                    break;


                case 'hideLessThan':
                    hideLessThan(property);
                    break;
                case 'hideMoreThan':
                    hideMoreThan(property);
                    break;
                case 'sortByCount':
                    sortByCount(property);
                    break;
                case 'addCss':
                    addCss(property);
                    break;
                case 'addHideButtons':
                    addHideButtons(property);
                    break;
                case 'addNotes':
                    addNotes(property);
                    break;


                case 'mustExist':
                    mustExist(property);
                    break;
                case 'mustNotExist':
                    mustNotExist(property);
                    break;

                case 'autoClick':
                    autoClick(property);
                    break;


            }


        }

        // Function to hide elements based on the property settings
        function hide(property) {
            // Cache the formatted unique identifier and `isEnabled` key to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;


            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([isEnabled, isGlobalOverrideIsEnabled]) => {
                if (!isGlobalOverrideIsEnabled) {
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }

                document.querySelectorAll(property.blockSelector).forEach(el => {
                    if (isEnabled === true) {
                        el.classList.add(uniqueClassName); // Add class to hide element
                    } else {
                        el.classList.remove(uniqueClassName); // Remove class to show element
                    }
                });
            });

        }


        function autoClick(property) {
            // Cache the formatted unique identifier and `isEnabled` key to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Get the `isEnabled` value asynchronously, but only once
            getItem(isEnabledKey).then(isEnabled => {
                if (isEnabled === true) {
                    // Select all elements based on targetSelector
                    const elements = document.querySelectorAll(property.targetSelector);

                    // Iterate over each element and click it if it's not already clicked
                    elements.forEach(el => {
                        // If the element is clickable and exists, click it
                        if (el) {
                            el.click();
                        }
                    });
                }
            });
        }


        function mustExist(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;


            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([isEnabled, isGlobalOverrideIsEnabled]) => {
                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }

                // Cache elements once
                const elements = document.querySelectorAll(property.blockSelector);

                elements.forEach(el => {
                    // Check if the target string exists in the element's innerHTML
                    const targetStringExists = property.targetString && el.innerHTML.includes(property.targetString);

                    // Add or remove the class based on the existence of the target string
                    if (targetStringExists) {
                        console.log(`The target string "${property.targetString}" exists in the element.`);
                        if (el.classList.contains(uniqueClassName)) {
                            el.classList.remove(uniqueClassName); // Show element
                        }
                    } else {
                        console.log(`The target string "${property.targetString}" does not exist in the element.`);
                        if (!el.classList.contains(uniqueClassName)) {
                            el.classList.add(uniqueClassName); // Hide element
                        }
                    }
                });
            });


        }


        function mustNotExist(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;


            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([isEnabled, isGlobalOverrideIsEnabled]) => {
                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }

                // Cache elements once
                const elements = document.querySelectorAll(property.blockSelector);

                elements.forEach(el => {
                    // Check if the target string exists in the element's innerHTML
                    const targetStringExists = property.targetString && el.innerHTML.includes(property.targetString);

                    // Add or remove the class based on the existence of the target string
                    if (targetStringExists) {
                        console.log(`The target string "${property.targetString}" exists in the element.`);
                        if (!el.classList.contains(uniqueClassName)) {
                            el.classList.add(uniqueClassName); // Hide element
                        }
                    } else {
                        console.log(`The target string "${property.targetString}" does not exist in the element.`);
                        el.classList.remove(uniqueClassName); // Show element
                    }
                });
            });


        }


        // Function to filter words from elements based on targetSelector

        function filterWordsToHide(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([keywordsValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const keywords = keywordsValue || '';

                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    // If `isEnabled` is false, remove the class from all elements with the uniqueClassName
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }


                // Use a Set for fast keyword lookup
                const keywordSet = new Set(keywords.split('\n').map(keyword => keyword.trim().toLowerCase()).filter(Boolean));

                // Cache elements
                document.querySelectorAll(property.blockSelector).forEach(el => {
                    // Determine the `title` based on `targetSelector`
                    const title = (property.targetSelector && property.targetSelector.length > 0
                        ? el.querySelector(property.targetSelector)?.innerText
                        : el.innerText)?.toLowerCase();

                    // Check if any keyword is in the title
                    const shouldHide = title && Array.from(keywordSet).some(keyword => title.includes(keyword));

                    // Add the class only if needed
                    if (shouldHide) {
                        el.classList.add(uniqueClassName);
                    } else {
                        el.classList.remove(uniqueClassName);
                    }
                });
            });
        }


        function filterWordsToShow(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([keywordsValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const keywords = keywordsValue || '';

                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    // If `isEnabled` is false, remove the class from all elements with the uniqueClassName
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }


                // Use a Set for fast keyword lookup
                const keywordSet = new Set(keywords.split('\n').map(keyword => keyword.trim().toLowerCase()).filter(Boolean));

                // Cache elements
                document.querySelectorAll(property.blockSelector).forEach(el => {
                    // Determine the `title` based on `targetSelector`
                    const title = (property.targetSelector && property.targetSelector.length > 0
                        ? el.querySelector(property.targetSelector)?.innerText
                        : el.innerText)?.toLowerCase();

                    // Check if any keyword is in the title
                    const shouldHide = title && Array.from(keywordSet).some(keyword => title.includes(keyword));

                    // Add the class only if needed
                    if (shouldHide) {
                        el.classList.remove(uniqueClassName);
                    } else {
                        el.classList.add(uniqueClassName);
                    }
                });
            });
        }


        function filterWordsLessThanToHide(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(userSettingUid), // Get the minimum number of words
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([minNumberValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const minNumber = parseInt(minNumberValue || '0', 10);

                // Early return if isEnabled is false
                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    // If `isEnabled` is false, remove the class from all elements with the uniqueClassName
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }

                // Cache the elements once
                const elements = document.querySelectorAll(property.blockSelector);

                elements.forEach(el => {
                    let title;

                    // Determine the `title` based on `targetSelector`
                    if (property.targetSelector && property.targetSelector.length > 0) {
                        title = el.querySelector(property.targetSelector)?.innerText.toLowerCase();
                    } else {
                        title = el.innerText.toLowerCase(); // Use entire blockSelector as title
                    }

                    if (!title) return;

                    // Count total words in the title
                    const wordCount = title.split(/\s+/).length;

                    // Add or remove the class based on word count comparison
                    if (wordCount < minNumber) {
                        el.classList.add(uniqueClassName);
                    } else {
                        el.classList.remove(uniqueClassName);
                    }
                });
            });
        }


        function hideLessThan(property) {
            // Cache the formatted unique identifiers to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;


            // Get both `minNumber` and `isEnabled` values asynchronously
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([minNumberValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const minNumber = parseInt(minNumberValue || '0', 10);

                if (!minNumber) return; // Exit early if no minimum number is set

                // Loop through the elements and apply class based on conditions
                document.querySelectorAll(property.blockSelector).forEach(el => {
                    const targetElement = el.querySelector(property.targetSelector);

                    // Early exit if target element is missing and `targetMustExists` is true
                    if (property.targetMustExists && !targetElement) {
                        el.classList.add(uniqueClassName);
                        return;
                    }

                    // Skip further processing if target element is missing
                    if (!targetElement) return;

                    // Extract the number from the target element's inner text
                    let extractedText = targetElement.innerText.trim().toLowerCase();
                    //replace + from 1k+
                    extractedText = extractedText.replace(/([km])\+/gi, "$1");

                    let extractedCount = 0;

                    // Check for 'k' or 'm' and convert accordingly
                    if (extractedText.endsWith('k')) {
                        extractedCount = parseFloat(extractedText.replace(/k$/i, '').trim()) * 1000;
                    } else if (extractedText.endsWith('m')) {
                        extractedCount = parseFloat(extractedText.replace(/m$/i, '').trim()) * 1000000;
                    } else {
                        extractedCount = parseInt(extractedText.replace(/[^\d]/g, ''), 10) || 0; // Remove non-digit characters
                    }

                    // Add or remove the class based on `extractedCount` and `minNumber`
                    if (isGlobalOverrideIsEnabled && isEnabled && extractedCount < minNumber) {
                        el.classList.add(uniqueClassName); // Hide element

                    } else {
                        el.classList.remove(uniqueClassName); // Show element
                    }


                });
            });
        }

        function hideMoreThan(property) {
            // Cache formatted values to avoid recalculating them multiple times
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Fetch both `minNumber` and `isEnabled` values asynchronously
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([minNumberValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const minNumber = parseInt(minNumberValue || '0', 10);

                if (!minNumber) return; // Exit early if no minimum number is set

                // Loop through the elements and apply class based on conditions
                document.querySelectorAll(property.blockSelector).forEach(el => {
                    const targetElement = el.querySelector(property.targetSelector);

                    // Early exit if target element is missing and `targetMustExists` is true
                    if (property.targetMustExists && !targetElement) {
                        el.classList.add(uniqueClassName);
                        return;
                    }

                    // Skip further processing if target element is missing
                    if (!targetElement) return;

                    // Extract the number from the target element's inner text
                    let extractedText = targetElement.innerText.trim().toLowerCase();
                    let extractedCount = 0;

                    // Check for 'k' or 'm' and convert accordingly
                    if (extractedText.endsWith('k')) {
                        extractedCount = parseFloat(extractedText.replace(/k$/i, '').trim()) * 1000;
                    } else if (extractedText.endsWith('m')) {
                        extractedCount = parseFloat(extractedText.replace(/m$/i, '').trim()) * 1000000;
                    } else {
                        extractedCount = parseInt(extractedText.replace(/[^\d]/g, ''), 10) || 0; // Remove non-digit characters
                    }

                    // Add or remove the class based on `extractedCount` and `minNumber`
                    if (isGlobalOverrideIsEnabled && isEnabled && extractedCount >= minNumber) {
                        el.classList.add(uniqueClassName); // Hide element
                    } else {
                        el.classList.remove(uniqueClassName); // Show element
                    }
                });
            });
        }

        function sortByCount(property) {
            // Cache formatted keys to avoid recalculating them
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Fetch both sorting option and isEnabled values asynchronously
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([sortingOptionValue, isEnabled,isGlobalOverrideIsEnabled]) => {

                // Exit if sorting is disabled
                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    console.log('dontsort');
                    return;
                }

                console.log('sortit');

                const sortingOption = sortingOptionValue || 'default';
                const posts = document.querySelectorAll(property.blockSelector[0]);

                // Exit if no posts are found
                if (!posts.length) return;

                // Convert the NodeList to an array for sorting
                const postsArray = Array.from(posts);

                // Function to convert the count from the target element's text
                const convertToCount = (el) => {
                    const targetElement = el.querySelector(property.targetSelector[0]);

                    // If target element is not found, return 0
                    if (!targetElement) return 0;

                    let extractedText = targetElement.innerText.trim().replace(/,/g, '.');
                    let extractedCount = 0;

                    // Handle 'k' and 'm' suffixes
                    if (/k$/i.test(extractedText)) {
                        extractedCount = parseFloat(extractedText.replace(/k$/i, '').trim()) * 1000;
                    } else if (/m$/i.test(extractedText)) {
                        extractedCount = parseFloat(extractedText.replace(/m$/i, '').trim()) * 1000000;
                    } else {
                        extractedCount = parseInt(extractedText.replace(/[^0-9.]/g, '').trim()) || 0;
                    }

                    return extractedCount;
                };

                // Sort the posts by count in descending order
                postsArray.sort((a, b) => {
                    const countA = convertToCount(a);
                    const countB = convertToCount(b);
                    return countB - countA; // Sort by highest count first
                });

                // Append the sorted posts back to the parent container
                const parentContainer = posts[0].parentNode;

                // Only clear and append posts if the order has changed
                const currentPostOrder = Array.from(parentContainer.children);
                const isReordered = !currentPostOrder.every((post, index) => post === postsArray[index]);

                if (isReordered) {
                    parentContainer.innerHTML = ''; // Clear existing posts

                    // Append sorted posts if the order has changed
                    postsArray.forEach(post => {
                        parentContainer.appendChild(post);
                    });
                }
            });
        }

        function addCss(property) {
            // Cache formatted keys for efficiency
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Fetch the isEnabled value asynchronously
            getItem(isEnabledKey).then(isEnabled => {
                // Get the styles to add/remove
                const stylesToApply = property.cssStyle.split(';').filter(Boolean).map(rule => {
                    const [propertyName, propertyValue] = rule.split(':').map(str => str.trim());
                    return {propertyName, propertyValue};
                });

                document.querySelectorAll(property.blockSelector).forEach(el => {
                    if (isEnabled) {
                        // Add the CSS properties if enabled
                        stylesToApply.forEach(({propertyName, propertyValue}) => {
                            el.style.setProperty(propertyName, propertyValue);
                        });
                    } else {
                        // Remove the CSS properties if disabled
                        stylesToApply.forEach(({propertyName}) => {
                            el.style.removeProperty(propertyName);
                        });
                    }
                });
            });
        }

        function addNotes(property) {
            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Get both isEnabled and saved note asynchronously
            Promise.all([
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([isEnabled, isGlobalOverrideIsEnabled]) => {

                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    removeButtons();
                    return;
                }

                // Handle the note button and display for each element
                document.querySelectorAll(property.blockSelector).forEach(el => {
                    const uidElement = el.querySelector(property.targetIdSelector);
                    const whereToAppend = el.querySelector(property.targetSelector);

                    if (uidElement && whereToAppend) {
                        const uid = uidElement.pathname;

                        // Fetch the saved note using the UID
                        const noteKey = `note_${uid}`;
                        getItem(noteKey).then(savedNote => {
                            if (!el.querySelector('.note-button')) {
                                createButton(whereToAppend, uid, savedNote);
                            }
                        });
                    }
                });

                // Helper to create and append the button and note display
                function createButton(whereToAppend, uid, savedNote) {
                    console.log('savedNote', savedNote);  // Check the value of savedNote

                    if (!whereToAppend) {
                        return false;
                    }

                    const button = document.createElement('button');
                    button.textContent = 'Add Note';
                    button.className = 'note-button';
                    button.style.borderRadius = '5px';
                    button.style.fontSize = '10px';

                    const noteDisplay = document.createElement('span');
                    noteDisplay.className = 'note-display';
                    noteDisplay.style.marginLeft = '10px';
                    noteDisplay.style.fontStyle = 'italic';
                    button.style.fontSize = '10px';

                    // Set the initial note display text (if there is a saved note)
                    noteDisplay.textContent = savedNote ? `Note: ${savedNote}` : 'No note added';

                    // Event listener to open modal for adding/editing note
                    button.addEventListener('click', () => openModal(uid, savedNote, noteDisplay));

                    whereToAppend.insertAdjacentElement('afterend', noteDisplay);
                    whereToAppend.insertAdjacentElement('afterend', button);
                }

                // Helper to remove buttons and note displays
                function removeButtons() {
                    document.querySelectorAll('.note-button').forEach(button => button.remove());
                    document.querySelectorAll('.note-display').forEach(noteDisplay => noteDisplay.remove());
                }

                // Open a modal for note editing
                function openModal(uid, savedNote, noteDisplay) {
                    const modal = document.createElement('div');
                    modal.className = 'modal123';
                    modal.style.position = 'fixed';
                    modal.style.top = '50%';
                    modal.style.left = '50%';
                    modal.style.transform = 'translate(-50%, -50%)';
                    modal.style.backgroundColor = '#fff';
                    modal.style.border = '1px solid #ccc';
                    modal.style.zIndex = 1000;

                    // Create textarea
                    const textarea = document.createElement('textarea');
                    textarea.placeholder = 'Enter your note here...';
                    textarea.style.width = '100%';
                    textarea.style.height = '200px';
                    textarea.value = savedNote || '';  // Set the saved note or empty string if none exists

                    // Create buttons
                    const saveButton = document.createElement('button');
                    saveButton.textContent = 'Save';
                    saveButton.style.display = 'block';
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.style.display = 'block';

                    // Event listener for cancel button to close modal
                    cancelButton.onclick = () => document.body.removeChild(modal);

                    // Event listener for save button to save the note
                    saveButton.onclick = () => {
                        const note = textarea.value;
                        saveItem(`note_${uid}`, note);  // Save the note using the UID
                        noteDisplay.textContent = `Note: ${note}`;  // Update the display with the saved note
                        document.body.removeChild(modal);  // Close the modal
                    };

                    // Append the textarea and buttons below it
                    modal.appendChild(textarea);
                    modal.appendChild(saveButton);
                    modal.appendChild(cancelButton);

                    // Add the modal to the body
                    document.body.appendChild(modal);
                }
            });
        }


        function addHideButtons(property) {

            const formattedDescription = property.description.replace(/\s+/g, '_');
            const formattedPage = property.page.replace(/\s+/g, '_');
            const formattedGroup = property.group.replace(/\s+/g, '_');
            const uniqueClassName = `hide_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const isEnabledKey = `isEnabled_${formattedPage}_${formattedGroup}_${formattedDescription}`;
            const userSettingUid = `${formattedPage}_${formattedGroup}_${formattedDescription}`;

            // Run both `getItem` calls in parallel for efficiency
            Promise.all([
                getItem(userSettingUid),
                getItem(isEnabledKey),
                getItem('globalOverrideIsEnabled')
            ]).then(([keywordsValue, isEnabled, isGlobalOverrideIsEnabled]) => {
                const keywords = keywordsValue || '';

                if (!isEnabled || !isGlobalOverrideIsEnabled) {
                    // If `isEnabled` is false, remove the class from all elements with the uniqueClassName
                    document.querySelectorAll(`.${uniqueClassName}`).forEach(el => el.classList.remove(uniqueClassName));
                    return;
                }


                // Use a Set for fast keyword lookup
                const keywordSet = new Set(keywords.split('\n').map(keyword => keyword.trim().toLowerCase()).filter(Boolean));

                // Cache elements
                document.querySelectorAll(property.blockSelector).forEach(el => {


                    const uidElement = el.querySelector(property.targetIdSelector);
                    const whereToAppend = el.querySelector(property.targetSelector);

                    if (isEnabled) {
                        if (uidElement) {

                            const uid = uidElement.pathname;
                            const normalizedUid = decodeURIComponent(uid).trim().toLowerCase();


                            //const shouldHide = uid && Array.from(keywordSet).some(keyword => decodeURIComponent(uid) === decodeURIComponent(keyword));
                            const shouldHide = uid && Array.from(keywordSet).some(keyword => {
                                const normalizedKeyword = decodeURIComponent(keyword).trim().toLowerCase();
                                return normalizedUid === normalizedKeyword;
                            });

                            if (shouldHide) {
                                el.classList.add(uniqueClassName);
                            } else {

                                el.classList.remove(uniqueClassName);
                                if (!el.querySelector('.Xhide-buttonX')) {
                                    createHideButton(whereToAppend, uid, el, userSettingUid);
                                }
                            }
                        }
                    } else {
                        // Remove buttons and class if isEnabled is false
                        removeButtons();
                        el.classList.remove(uniqueClassName); // Show the element
                    }

                });
            });


            // Helper to create the hide button
            function createHideButton(whereToAppend, uid, el, userSettingUid) {
                if (!whereToAppend) {
                    return false;
                }
                const button = document.createElement('button');
                button.textContent = 'Hide';
                button.className = 'Xhide-buttonX';
                button.style.borderRadius = '5px';
                button.style.fontSize = '10px';

                // Event listener to hide the block and save the hidden state
                button.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    // hide the item by adding class
                    el.classList.add(uniqueClassName);
                    appendItem(`${userSettingUid}`, uid); // Save hidden state in localStorage
                    refreshTextarea(userSettingUid);
                });


                // Only insert the button if `whereToAppend` is valid
                whereToAppend.insertAdjacentElement('afterend', button);

                // Update the textarea
            }

            // Display newly added data in textarea
            //TODO: first new line doesnt get added
            function refreshTextarea(userSettingUid) {

                getItem(userSettingUid).then(savedTextValue => {
                    if (savedTextValue) {
                        const selectedTextarea = document.getElementById(userSettingUid);
                        if (selectedTextarea) {
                            selectedTextarea.value = savedTextValue;
                        }
                    }
                });
            }


            // Helper to remove hide buttons
            function removeButtons() {
                document.querySelectorAll('.Xhide-buttonX').forEach(button => button.remove());
            }
        }


        // Throttle function to limit execution to once per specified interval (1 second in this case)
        function throttle(func, limit) {
            let lastFunc;
            let lastRan;
            return function (...args) {
                const context = this;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function () {
                        if (Date.now() - lastRan >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            };
        }


        // Observer configuration: specify what types of mutations to observe
        if (currentConfig && currentConfig.observer) {

            // Throttled version of evaluateAndExecuteFunctions to execute at most once every second
            const throttledEvaluateAndExecuteFunctions = throttle(evaluateAndExecuteFunctions, 500);

            // Observer configuration: specify what types of mutations to observe
            if (currentConfig.observer) {
                const observerConfig = {childList: true, subtree: true};

                // Callback function executed on each mutation
                const observerCallback = function (mutationsList) {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            // Execute throttled function
                            throttledEvaluateAndExecuteFunctions();
                            break; // Exit loop once throttled function is called
                        }
                    }
                };

                // Create an observer instance
                const observer = new MutationObserver(observerCallback);

                // Start observing the document body
                observer.observe(document.body, observerConfig);
            }


        }


    }


    function removeLowestDuplicateDomainConfig(arr) {
        if (!Array.isArray(arr)) {
            console.error("Expected an array but received:", arr);
            return [];
        }

        let domainMap = new Map();

        arr.forEach(obj => {
            if (!obj || typeof obj !== 'object' || !obj.domain || !Array.isArray(obj.properties)) {
                console.warn("Skipping invalid object:", obj);
                return;
            }

            const domain = obj.domain;
            const count = obj.properties.length;

            // Store only the object with the highest properties count
            if (!domainMap.has(domain) || domainMap.get(domain).properties.length < count) {
                domainMap.set(domain, obj);
            }
        });

        return Array.from(domainMap.values());
    }



    function setupAccordion(triggerClass, contentClass) {
        document.querySelectorAll("." + triggerClass).forEach(header => {
            header.addEventListener("click", function () {
                let content = this.nextElementSibling;

                if (content && content.classList.contains(contentClass)) {
                    content.style.display = content.style.display === "none" ? "block" : "none";
                }
            });
        });
    }

    // Call the function after the DOM is loaded
    document.addEventListener("DOMContentLoaded", function () {
        setupAccordion("groupTitle123", "accordion-content");
    });


})();