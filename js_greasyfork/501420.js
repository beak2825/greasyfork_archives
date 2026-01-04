// ==UserScript==
// @name            Unity|Discourse Enhancer
// @namespace       http://tampermonkey.net/
// @version         0.29
// @description     Enhances Unity Discourse!
// @license         MIT
// @author          Player7 | ReplyQuote Author: Kumirei (https://github.com/Kumirei/Userscripts/blob/main/Discourse/Quote%20Whole%20Post/userscript.js)
// @match           https://discussions.unity.com/*
// @require         https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @icon            https://www.google.com/s2/favicons?sz=64&domain=unity.com
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/501420/Unity%7CDiscourse%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/501420/Unity%7CDiscourse%20Enhancer.meta.js
// ==/UserScript==

// Change Log
// 0.29 (28/05/2025)
// - Topic page goes to first page instead of last page option
// 0.28 (28/05/2021)
// - Light And Dark theme switching
// 0.27 (22/05/2021)
// - Option: First Post Button
// 0.26 (22/05/2021)
// - Option: Last Page short ||>>  links added to topics listings
// 0.25 (22/05/2021)
// - Option: Move original poster avatar next to topic title
// 0.24 (21/05/2021)
// - Option: Last Post Button
// 0.23 (21/05/2021)
// - Wait For Select embedded without jQuery
// 0.22 (21/05/2021)
// - Add !important to css rules
// 0.21 (21/05/2021)
// - Version check script url added
// 0.20 (21/05/2021)
// - Removed jQuery requires
// 0.10 (20/07/2024)
// - Reply and Quote Post Icon Shortcut

(function () {
    //'use strict'; //let interface not allowed with strict
    const noiseList = ['- Select Noise Background -', 'Type1', 'Type2', 'Type3'];

    const scriptUrl = 'https://greasyfork.org/en/scripts/501420-unity-discourse-enhancer';
    const regexScriptVersion = /version=\"(\d*\.?\d*)\"/;
    let versionChecked = false;
    let firstRunComplete = false;
    let configHeadOrig;
    const blackBgNoise1 = 'data:image/png;base64,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';
    const blackBgNoise2 = 'data:image/png;base64,UklGRh4EAABXRUJQVlA4TBEEAAAvH8AHAM1kRP8D1AUAINVcT3DN2WbuNMUxDdVsL8+27YWp2Taq2bb1mb+u73tERFRuTOYi8CQbi17e6/SWIwzNMfxkjEcHhYf73jph7LbvcTg3nbxSeRzX2oHBHp9qd0wAIHUlz84nXpt4cuLbkImOfruiwjHlxp6TzkaIapZmKwhbASIAKb4xKVFXVf4XjSOgokGRAlPC7e3q0qVRPJIBYvTGYNOWz/uZ6ezZQC0HrAMZxX3b3ilZI9Gi+oEEr/GqK5pRl7Hxq47RhBRgARXChvG1w/RSBgyhcUo7RzyOe6hV01jvQiwxVJbweog9d1bYUjYsE4yMyKTH26JWjsc99cmky2E9zHLVPaalrQ4N8BcqZmt+mxB0rDws7CToGKlPMERGUPfX0TzgDNlUPtyfjuOzWL+n229esnGeDhAVBHOyCgMqsCxk3vzQCVVGg/TzmUzxH73su1hJczSM+jpgTP5zOODiE4QlcsCopDn+zKABsRTNfSl2DGbnEhAvhfDWbhBRUD4zscAJWVl34mpLia9LbIUu7j6lB1SkKJ3MBnfH0fmE+gGAdU0UCf9XoBV82036xh9gmyNJe6xdvs8uP4ZIjd101QGjgremVQlZ/h958QEEhq+9nqrqaKekWGnSFxZ3Wn4cQKJEWjyUVdwKyQLXusXB9fIy0zcd+xUJc+AAwJtlz6X6FKv4F4dvCoGHHFQJtmH+vf1lAyqVQeEE1AyyN4mV8sw1SVjmmVjKsSdG2jXnow9fScSZiJk3PeuiklnDuIsCo+zXvGDrKpmjYDGjtmlV2Dq1VAk3SySj+NqF1gq0JOW2bgXHho2Jo9ddll3NxGYTES6LjiVF4Y5v9iOkN/LM+dqDXzPCZYK27SuUD7pVtxU6HSGXtIyUnLnW6LL9k1uaF5rE4k7H7kOOVuK6yCBFsDQo3A96FMIGdqpr/uJLuO9dGu5qLm6kHN+qjo77pjNmUeXKQOXhVwOxaQoD/5B8+msm3Jweam1JcXKNUGXuPg3Pes+7YZUqf3Ejevxe1ruRi6UpFHw7mhZmFqKUbRm0dsohdlRZQBQFKz3inkB1a1SZSiHdSS2EYRcMyppcC8ktEL0q69LQG+jeHxEZI/Dnk35ylUSVFLjbL/byxK2nnrGotkzwK3HPYtJwd0vTzZisoyk2u+e3BJ4ZzDYbbXIdRYlZ9noHMumsiDofjwDxetdV6mWi7botASxVtk0+ADKUwkd+1vBfpWr83tq22CyTqPM83hUijbMn5HEOwsH764F8neIqI2nwXU5bWqPYOddDxY9JZaPf8JheKceZPUp+5zSIFDpdUSSTBqP5ktsP5SfCWBMtyOwvOC+e1kIwCpxTravogs+N0GwkuttVD84epQ9oMk4fWPPurwE=';
    let blackBgNoise = blackBgNoise1;
    const lightThemeId = 'light-theme';
    const darkThemeId = 'dark-theme';
    const baseThemeId = 'base-theme';

    let lastPostLabel = "Last Post";
    let versionInfo = GM_info.script.version;
    let scriptVersion = versionInfo;
    let linkColor = "#999";

    // backgroundNoise: {
    //     section: ['Background Noise List', 'Choose which one default is Type1'],
    //     type: 'select',
    //     options: noiseList,
    //     default: 'Type1'
    // },

    //https://github.com/sizzlemctwizzle/GM_config/wiki/Fields
    GM_config.init("Unity|Discourse Enhancer", {
        stylingEnable: {
            label: "Custom CSS styling",
            type: "checkbox",
            default: true
        },
        replyQuoteEnable: {
            label: "Show reply quote button",
            type: "checkbox",
            default: true
        },
        lastPageTopicLinks: {
            label: "Show shortcut link >> to last page of the topic",
            type: "checkbox",
            default: true
        },
        firstPageTopicLinks: {
            label: "Topic links goto the first page",
            type: "checkbox",
            default: true
        },
        moveOriginalPostersAvatar: {
            label: "Move original poster avatar next to topic title",
            type: "checkbox",
            default: true
        },
        firstPostButton: {
            label: "Show 'first post' button on infinity bar",
            type: "checkbox",
            default: true
        },
        lastPostButton: {
            label: "Show 'last post' button on infinity bar",
            type: "checkbox",
            default: true
        },
        wallpaperEnable: {
            label: "Custom background wallpaper URL",
            type: "checkbox",
            default: false
        },
        /*wallpaperUrl:
        {
            label: 'Wallpaper Url',
            type: 'text',
            default: 'https://images2.alphacoders.com/238/238870.jpg'
        },*/
        psuedoPaginationEnable: {
            label: "Enable pseudo pagination",
            type: "checkbox",
            default: true
        },
        paginationPostsPerPage: {
            label: "Posts per pagination link",
            type: "checkbox",
            default: 50
        },
        paginationLinksOnTopicsPage: {
            label: "Show paginated links on topic listings",
            type: "checkbox",
            default: true
        },
        updateCheck: {
            label: "Check for updated script version",
            type: "checkbox",
            default: false
        }
    });

    // Initial setup
    // document.addEventListener('DOMContentLoaded', () => {

    // });

    window.addEventListener('load', () => {
        console.log('load: Unity|Discourse Enhancer');
        setTimeout(configSetup, 600);
        // setupThemeToggleListener();
        checkSetTheme();

        // const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
        // mediaQueryList.addListener(checkSetTheme);
        //navigation.addEventListener('navigatesuccess', (event) => { initPagination() });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Original JQuery script of this from Kumirei
    ///  https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974318
    // Create new observer on body to monitor all DOM changes
    let observer = new MutationObserver(mutationHandler);
    observer.observe(document.body, { childList: true, subtree: true });

    // Interface for interacting with the library
    let interface = {
        version: GM_info.script.version,
        observer: observer,
        wait: waitForSelector,
        unwait: unwaitID,
        waits: {},
        waitsByID: {},
        nextID: 0
    };

    // Start
    installInterface();

    // Creates a new entry to search for whenever a new element is added to the DOM
    function waitForSelector(selector, callback) {
        if (!interface.waits[selector]) interface.waits[selector] = {};
        interface.waits[selector][interface.nextID] = callback;
        interface.waitsByID[interface.nextID] = selector;
        search(selector, true);
        return interface.nextID++;
    }

    // Deletes a previously registered selector
    function unwaitID(ID) {
        delete interface.waits[interface.waitsByID[ID]][ID];
        delete interface.waitsByID[ID];
    }

    // Makes sure that the public interface is the newest version and the same as the local one
    function installInterface() {
        if (!window.wfs) window.wfs = interface;
        else if (window.wfs.version < interface.version) {
            window.wfs.version = interface.version;
            window.wfs.observer.disconnect();
            window.wfs.observer = interface.observer;
            window.wfs.wait = interface.wait;
            window.wfs.unwait = interface.unwait;
        }
        interface = window.wfs || interface;
    }

    // Waits until there has been more than 100 ms between mutations and then checks for new elements
    let lastMutationDate = 0; // Epoch of last mutation event
    function mutationHandler(mutations) {
        let duration = Date.now() - lastMutationDate;
        lastMutationDate = Date.now();
        if (duration > 100) {
            for (let selector in interface.waits) search(selector);
        }
    }

    // Searches for the selector and calls the callback on the found elements
    function search(selector, ignoreFound = false) {
        let elements = document.querySelectorAll(selector);
        elements.forEach((e) => {
            let callbacks = Object.values(interface.waits[selector]);
            if (ignoreFound || !e.WFSFound || e.WFSFound == lastMutationDate) {
                callbacks.forEach((callback) => callback(e));
                e.WFSFound = lastMutationDate;
            }
        });
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function addReplyQuotes() {
        if (GM_config.get().replyQuoteEnable) {
            // Utility to wait for a selector to appear in the DOM;
            window.wfs.wait('.topic-post > article', addQuoteButton);
            console.log('replyQuote: Unity|Discourse Enhancer');

            let style = document.createElement('style');
            style.id = 'QuoteWholePostCSS';
            style.textContent = `
                .quote-whole-post {
                    order: 0;
                    padding: 8px 10px;
                    margin: 1px 0;
                }
                .quote-whole-post.d-hover {
                    background-color: rgba(122, 122, 122, 0.17);
                }
                .post-controls {
                    justify-content: flex-end !important;
                }
                .post-controls .actions {
                    margin: 0 !important;
                    order: 99;
                }
                .post-controls .show-replies {
                    position: absolute;
                    left: 0;
                    margin-left: 0px !important;
                }
            `;
            document.head.appendChild(style);
            //console.log('Styles added.');
        }
    }

    function addQuoteButton(element) {
        //console.log('Found a matching article node:' + element);

        let btn = document.createElement('button');
        btn.className = 'widget-button btn-flat no-text btn-icon quote-whole-post';
        btn.title = 'Click to quote whole post';
        btn.innerHTML = `
            <svg class="fa d-icon d-icon-comment-o svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                <use xlink:href="#far-comment"></use>
            </svg>
            <span class="d-button-label" style="padding:0px 7px">Quote</span>
        `;

        btn.onclick = function () {
            let replyButton = element.querySelector('.widget-button.reply');
            if (replyButton) {
                replyButton.click();
                let interval = setInterval(() => {
                    let quoteButton = document.querySelector('button.quote');
                    if (quoteButton) {
                        quoteButton.click();
                        clearInterval(interval);
                    }
                }, 100);
            }
        };

        let oldBtn = element.querySelector('button[title="Click to quote whole post"]');
        if (oldBtn) {
            oldBtn.remove();
        }

        let actionsElement = element.querySelector('.post-controls .actions');
        if (actionsElement) {
            actionsElement.appendChild(btn);
            //console.log('Quote button appended successfully:' + btn);
        } else {
            //console.error('Could not find actions element in:' + element);
        }
    }

    // var interval = setInterval(function() {
    //     if(document.readyState === 'complete') {
    //         clearInterval(interval);
    //         console.log('Loading: Unity|Discourse Enhancer (local)');
    //     }
    // }, 100);
// /* https://css-tricks.com/more-control-over-css-borders-with-background-image/*/
    const baseStyleTheme = `

    /*/////////////// Topic View  ///////////////*/
    .topic-list-item {
        border-left: 3px solid #0000;
    }

    /*/////////////// Infinity Bar ///////////////*/

    .btn-lastpost {
        width: 75px;
        padding: 7px 5px;
    }

    .btn-firstpost {
        margin-top: 5px;
        padding: 7px 5px;
    }

    .fancyBorder { background-image: repeating-linear-gradient(-60deg, #703191, #703191 1.84px, transparent 4px, transparent 10.440000000000001px, #703191 18px), repeating-linear-gradient(30deg, #703191, #703191 1.84px, transparent 4px, transparent 10.440000000000001px, #703191 18px), repeating-linear-gradient(120deg, #703191, #703191 1.84px, transparent 4px, transparent 10.440000000000001px, #703191 18px), repeating-linear-gradient(210deg, #703191, #703191 1.84px, transparent 4px, transparent 10.440000000000001px, #703191 18px); background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px; background-position: 0 0, 0 0, 100% 0, 0 100%; background-repeat: no-repeat; }
    .fancyBorder2 { background-image: repeating-linear-gradient(-60deg, #5e249d, #5e249d 2.52px, transparent 3px, transparent 8.04px, #5e249d 9px), repeating-linear-gradient(30deg, #5e249d, #5e249d 2.52px, transparent 3px, transparent 8.04px, #5e249d 9px), repeating-linear-gradient(120deg, #5e249d, #5e249d 2.52px, transparent 3px, transparent 8.04px, #5e249d 9px), repeating-linear-gradient(210deg, #5e249d, #5e249d 2.52px, transparent 3px, transparent 8.04px, #5e249d 9px); background-size: 1px 100%, 100% 1px, 1px 100% , 100% 1px; background-position: 0 0, 0 0, 100% 0, 0 100%; background-repeat: no-repeat; }

    .last-page-link {
        font-size: 15px;
    }
    `;

    const baseStyleLightTheme = `
    /*/////////////// Topic View  ///////////////*/

    .topic-list-item:hover {
        border-left: 3px solid #84127b;
        background-color: #47145959;
    }
    `;

    const baseStyleDarkTheme = `
    :root {
        --d-topic-post-background-color: unset;
        --d-zebra-topic-list: unset;

        --d-topic-post-background: linear-gradient(-45deg, rgba(73, 73, 73, .32) 0%, rgba(66, 69, 73, .19) 20%, rgba(75, 75, 75, .35) 60%, rgba(0, 0, 0, .16) 100%);
        --d-topic-post-background2: linear-gradient(-90deg, rgba(160, 160, 160, .45) 0%, rgba(139, 139, 139, .26) 20%, rgba(145, 145, 145, .6) 80%, rgba(71, 71, 71, .69) 100%);
        --d-border-radius: 10px;
        /*--secondary: #00000059;*/
        /*--secondary: #111111ed;*/
        /*--secondary: #0909099e;*/
        --secondary: #0e0e0f;
        --primary-very-low:  #00000059;
        --topic-board-background: linear-gradient(-45deg, rgba(150, 150, 150, .72) 0%, rgba(156, 156, 156, .56) 20%, rgba(75, 75, 75, .61) 60%, rgba(173, 173, 173, .41) 100%);
        --topic-board-background2: linear-gradient(-45deg, rgba(165, 165, 165, .72) 0%, rgba(146, 146, 146, .56) 20%, rgba(97, 97, 97, .61) 60%, rgba(173, 173, 173, .41) 100%);
        --d-pinned-topic-list: #323d5b33;
        --primary-100: #2d2e3080;
        --d-zebra-topic-list: #00000059;
        --d-background-alpha1: #0006;
        --d-sidebar-background: #00000057;
        --d-sidebar-background:  linear-gradient(-45deg, rgba(41, 41, 41, .5) 0%,  rgba(0, 0, 0, .5) 100%);


        --d-actions-background: #4a4a4a;
        --noise: url(`+ blackBgNoise + `);
        --noise2: url(`+ blackBgNoise2 + `);
    }

    .reply-area {
        background: #070707f7;
    }

    .panel-body {
        background: #070707ed;
    }

    .select-kit-body {
        background: #070707ed;
    }

    #main {

        background-size: unset;
        background-repeat:  unset;

        &:before {
            content: "";
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            height: 100%;
            background-position: top, top;
            background-color: unset;
            background9: radial-gradient(circle, rgba(14, 19, 27, .71) 0%, rgb(0, 0, 0)  100%) no-repeat border-box, var(--noise2);


            background: radial-gradient(circle, rgba(7, 10, 15, .76) 0%, rgb(0, 0, 0)  100%) no-repeat border-box, var(--noise);
            /* background-size: 1px 4px, 32px;*/
            background-size: 100%, 32px;
            background-repeat: unset;
            background-attachment: unset;
            z-index: -1;
        }
    }



    .post-avatar {
        margin-top: -4px;
        padding-block: unset;
        backdrop-filter: unset;
    }
    .avatar {
        background: #0000006e;
        box-shadow:  1px 1px 5px #262626;
    }
    .topic-body {
        background: var(--d-topic-post-background);
        border-radius: var(--d-border-radius) var(--d-border-radius) var(--d-border-radius) var(--d-border-radius);
        margin-top: 10px;
        padding: 0px;
    }

    /* Action Bar of article post */
    .topic-post .post-controls .actions {
        align-items: center;
        box-shadow:  1px 1px 10px #0000004d;
        margin-right: -15px;
        /*background: var(--d-background-alpha1);*/
        background: var(--d-actions-background);
        border-radius: var(--d-border-radius) var(--d-border-radius) var(--d-border-radius) var(--d-border-radius);
    }

    .discourse-no-touch .btn-flat:hover {
        /*background: rgb(39 41 46 / 81%);*/
        margin-top: 1px;
        margin-bottom: 1px;
        border-radius: var(--d-border-radius);
        /*box-shadow: inset 1px 1px 7px #161616;*/
    }


    /* Also used in article top header */
    .topic-meta-data{
        background: var(--d-topic-post-background2);
        /*background-color: #00000045 !important;*/
        height: 5px;
        margin-left: -15px;
    }

    .map.map-collapsed {
        background-color: var(--d-background-alpha1);
        border: 1px solid #0000003b;
        border-radius: var(--d-border-radius) 0px 0px var(--d-border-radius);
    }

/* ///////////// Article replies  ///////////////*/
    /* Top header of article post */

    .topic-post .topic-meta-data{
        border-radius: var(--d-border-radius) var(--d-border-radius)  var(--d-border-radius) var(--d-border-radius);
        /*border-top: 4px solid #0000004f;*/
    }


    .post-avatar img {
        background: black;
    }

    .small-action.topic-post-visited .topic-post-visited-line {
        line-height: unset;
        width: calc(var(--topic-body-width) + var(--topic-avatar-width) + var(--topic-body-width-padding)*4);
    }

    /*/////////////// Infinity Bar ///////////////*/


    /*/////////////// Topic View  ///////////////*/

    .discourse-tag.simple:hover {
        background: #120513d1;
        color: white;
    }

    .discourse-no-touch .btn:hover, .discourse-no-touch .btn.btn-hover {
        background-color: #1a1a1a;
    }

    .topic-list-data {
        padding: 6px 15px;
    }

    .topic-list-item-separator {
        background: #000000ab;
        border: 1px solid #914c0f00;
    }

    .topic-list-item:hover {
        border-left: 3px solid #84127b;
        background-color: #47145959;
    }

    .main-link .avatar:first-child {
        width: 24px;
        height: 24px;
        margin: -6px 0px -5px -1px;
    }

    a.group-Unity-Technologies img {
        width: 20px;
        height: 20px;
        border: 1px solid var(--avatar-flair-color);
        box-shadow: 0px 0px 9px var(--avatar-flair-color);
    }

    .topic-list-item:nth-child(2n+1) {
        /*background-color: var(--d-zebra-topic-list);*/
        /*background: var(--d-topic-post-background2);*/
        /*background: var(--topic-board-background2);*/

    .topic-list {
        /*margin-top: 0;
        background-color: var(--d-topic-post-background-color);
        background: var(--topic-board-background);
        border-radius: calc(var(--d-border-radius)*2);
        overflow: hidden;*/
    }

    .topic-list-header {
        background: var(--d-topic-post-background2);
    }

    a.last-page-link {
        font-size: smaller;
    }

    .moved-original-poster-avatar {
        width: 24px;
        height: 24px;
        margin: -6px 0px -5px -1px;
    }
    `;

    const configStyle = `
    body {
        display: inline-block;
        padding: 29px;
        overflow: hidden;
        font-size: 16px;
        font-family: "Helvetica Neue",Helvetica,Arial,"微軟正黑體",sans-serif;
        color: #d0d0d0;
        border-radius: 4px;
        border: 1px solid #b1b1b1;
        background: linear-gradient(-220deg, rgb(6 6 6) 0%, rgb(33 33 33) 90%);
        margin: 0;
        line-height: 1;
    }

    body.config-dialog-open {
        padding-right: 0;
    }

    #config-update-button{
        //background-color: #233894;
        padding: 0px 5px;
        color: #fff;
        margin: 0px 5px;
    }
    .config-dialog-content{
        color: #d0d0d0;
        background: linear-gradient(180deg, rgb(47 47 47 / 79%) 0%, rgb(29 29 29 / 58%) 74%, rgb(70 70 70 / 8%) 100%);
    }

    .config-dialog{
        background: rgb(0 0 0 / 14%);
    }
    .config-dialog-head:after {
        content: " // version: `+ versionInfo + `";
        font-size: 0.58rem;
    }

    .form-control:focus {
        border-color: #0a53f8;
        color: #ffffff;
    }
`;



    function configSetup() {
        if (firstRunComplete) return;
        addReplyQuotes();
        configRecheck();
        // initPagination();
        addCss(baseStyleTheme, baseThemeId);

        setupThemeToggleListener();

/////////////////////
        // // Select the SVG element using your existing query
        // const svgElement = document.querySelector(".interface-color-selector-trigger > svg");

        // // Create an observer to watch for class changes on the SVG
        // const observer = new MutationObserver((mutationsList) => {
        // // Check if a mutation occurred specifically in the 'class' attribute
        // const hasClassChange = mutationsList.some(mutation =>
        //     mutation.type === "attributes" && mutation.attributeName === "class"
        // );

        // // If class changed, trigger your theme check function
        // if (hasClassChange) {
        //     console.log("Icon class changed!");
        //     checkSetTheme(svgElement); // Pass the element to the function for further checks
        // }
        // });

        // // Start observing the SVG for attribute changes (specifically 'class')
        // observer.observe(svgElement, {
        // attributes: true,
        // attributeOldValue: true, // To track old values if needed
        // });
//////////////////////
        GM_config.onclose = configRecheck;

        const navList = document.querySelector('.icons.d-header-icons');
        const optionLi = document.createElement('li');
        optionLi.className = 'nav-item';
        optionLi.innerHTML = `<span class="icon"><svg class="fa d-icon d-icon-bars svg-icon prefix-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#ph-bars"></use></svg></span>`;
        optionLi.style = 'cursor: pointer;';
        optionLi.onclick = function () {
            GM_config.open();
            if (GM_config.get().updateCheck) {
                versionCheck();
            }
            configLoad();
        };

        if (navList.firstChild) {
            navList.insertBefore(optionLi, navList.firstChild);
        } else {
            navList.appendChild(optionLi);
        }

        firstRunComplete = true;
    }

    function addLastPostButton(element) {
        console.log('lastPostButton: Unity|Discourse Enhancer ')
        //element = typeof element !== "undefined" ? element : document.querySelector('.timeline-date-wrapper .now-date');
        var existingButton = document.querySelector('.btn-lastpost');

        if (!existingButton) {
            // Create the button element
            var button = document.createElement('button');
            button.classList.add('btn', 'btn-default', 'btn-lastpost');
            button.title = lastPostLabel;
            button.type = 'button';
            button.textContent = lastPostLabel;

            // Append the button to the .now-date element
            element.appendChild(button);
        }
    }

    function addFirstPostButton(element) {
        console.log('addFirstPostButton: Unity|Discourse Enhancer ')
        //element = typeof element !== "undefined" ? element : document.querySelector('.timeline-date-wrapper');
        var existingButton = document.querySelector('.btn-firstpost');

        if (!existingButton) {
            // Create the button element
            var button = document.createElement('button');
            button.classList.add('btn', 'btn-default', 'btn-firstpost');
            button.title = 'First Post';
            button.type = 'button';
            button.textContent = 'First Post';

            // Add click event listener
            button.addEventListener('click', function () {
                const currentUrl = window.location.href;
                const firstPageUrl = currentUrl.replace(/\/\d+(\?[^#]*)?(#.*)?$/, '/1$1$2');
                window.location.href = firstPageUrl;
                //Not working
                // gotoFirstPost();
            });

            element.appendChild(button);
        }
    }

    //Not working
    function gotoFirstPost() {
        // Find the Discourse router
        const discourseApp = require('discourse/app').default;
        const router = discourseApp.__container__.lookup('router:main');

        // Get the current topic ID
        const topicId = router.currentRoute.attributes.topic.id;

        // Transition to the first post of the topic
        router.transitionTo('topic', topicId, { queryParams: { page: 1 } });
    }

    function setupThemeToggleListener() {
        const themeToggleButton = document.querySelector('.color-scheme-toggler')
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', checkSetTheme);
            // console.log('setupThemeToggleListener:' + themeToggleButton);
        }
    }

    function checkTheme() {
        // Get computed styles for the <html> element (root)
        const rootComputedStyle = window.getComputedStyle(document.documentElement);

        // Extract the color-scheme value from CSS
        const currentColorScheme = rootComputedStyle.getPropertyValue('color-scheme');
        //dark or light usually
        return currentColorScheme.trim();
    }

    function checkSetTheme() {
        const stylingEnabled = GM_config.get().stylingEnable;

        const currentLightTheme = document.getElementById(lightThemeId);
        const currentDarkTheme = document.getElementById(darkThemeId);

        if (!stylingEnabled) {
            if (currentLightTheme) { removeCss(lightThemeId); }
            if (currentDarkTheme) { removeCss(darkThemeId); }
            // console.log('checkSetTheme stylingEnabled:' + stylingEnabled);
            return;
        }

        if (checkTheme() === 'dark') {
            if (currentLightTheme) { removeCss(lightThemeId); }
            if (currentDarkTheme === null || !currentDarkTheme) { addCss(baseStyleDarkTheme, darkThemeId); }
        } else {
            if (currentDarkTheme) { removeCss(darkThemeId); }
            if (currentLightTheme === null || !currentLightTheme) { addCss(baseStyleLightTheme, lightThemeId); }
        }


    }

    function addCss(cssString, themeId) {
        const head = document.head || document.getElementsByTagName('head')[0];
        const newCss = document.createElement('style');
        newCss.id = themeId;
        newCss.type = 'text/css';
        newCss.innerHTML = cssString.replaceAll(";", "!important;");
        head.appendChild(newCss);
        // console.log("adding css");
        // console.log(newCss.innerHTML);
    }

    function removeCss(themeId) {
        const newCss = document.getElementById(themeId);
        if (newCss) {
            newCss.remove();
        }
        document.body.style.background = '';
    }

    function configLoad() {
        const addStyle = document.createElement('style');
        addStyle.innerHTML = configStyle;
        document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('head').appendChild(addStyle);
        document.querySelector('.config-dialog').onclick = function () {
            GM_config.close(true);
        };
        versionButtonUpdate();
    }

    function addTopicListItems(topicItem) {
        console.log('addLastPageTopicLinks: Unity|Discourse Enhancer');
        //const topicListItems = document.querySelectorAll('.topic-list-item');
        // topicListItems.forEach((topicItem) => {

        if (GM_config.get().moveOriginalPostersAvatar) {
            const alreadyMovedAvatar = topicItem.querySelector('.moved-original-poster-avatar');
            if (!alreadyMovedAvatar) {
                const originalPosterLink = topicItem.querySelector('.posters.topic-list-data > a:first-child');
                const mainLinkSection = topicItem.querySelector('.main-link.clearfix.topic-list-data');


                if (originalPosterLink && mainLinkSection) {
                    // Add a class to the original poster link to prevent moving it multiple times
                    originalPosterLink.classList.add('moved-original-poster-avatar');

                    // Move the original poster link to the main link section
                    mainLinkSection.insertBefore(originalPosterLink, mainLinkSection.firstChild);
                }
            }
        }


        const alreadyAddedLastPage = topicItem.querySelector('.last-page-link');
        if (GM_config.get().lastPageTopicLinks) {
            if (!alreadyAddedLastPage) {
                const rawLink = topicItem.querySelector('a.raw-link');
                if (rawLink) {
                    const urlMatch = rawLink.href.match(/\/(\d+)(?:\/(\d+))?$/);
                    console.log('addLastPageTopicLinks: Unity|Discourse Enhancer', urlMatch);
                    if (urlMatch) {
                        let newHref;
                        //const topicId = parseInt(urlMatch[1], 10);
                        if (urlMatch[2]) {
                            // URL format: /t/topic-name/topic-id/post-id
                            // newHref = rawLink.href.replace(`/${urlMatch[2]}`, '/999999');
                            // New update seems to have the topic link goto the last page already now
                            newHref = rawLink.href;
                        } else {
                            // URL format: /t/topic-name/topic-id
                            newHref = `${rawLink.href}/999999`;
                        }

                        const lastPageButton = document.createElement('a');
                        lastPageButton.href = newHref;
                        lastPageButton.textContent = 'Last Page';

                        lastPageButton.className = 'last-page-link';
                        lastPageButton.innerHTML = `<svg class="fa d-icon d-icon-fast-forward svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
                                <use href="#ph-fast-forward"></use></svg>`;

                        rawLink.parentNode.appendChild(lastPageButton);
                    }
                }
            }
        }


        const alreadyAddedFirstPage = topicItem.querySelector('.first-page-link');
        if (GM_config.get().firstPageTopicLinks) {
            const rawLink = topicItem.querySelector('a.raw-link');
            if (rawLink) {
                const urlMatch = rawLink.href.match(/\/(\d+)(?:\/(\d+))?$/);
                if (urlMatch) {
                    let newHref;
                    if (urlMatch[2]) {
                        // URL format: /t/topic-name/topic-id/post-id
                        newHref = rawLink.href.replace(`/${urlMatch[2]}`, '/1');
                    } else {
                        // URL format: /t/topic-name/topic-id
                        newHref = `${rawLink.href}/1`;
                    }
                    // Replace the existing href
                    rawLink.href = newHref;
                }
            }
        }
    }

    function versionCheck() {
        if (versionChecked) { return; }
        fetch(scriptUrl)
            .then(response => response.text())
            .then(html => {
                const scriptVersion = html.match(regexScriptVersion)[1];
                console.log(GM_info.script.version);
                versionButtonUpdate(scriptVersion);
            })
            .catch(err => {
                console.warn('versionCheck went wrong.', err);
            });
        versionChecked = true;
    }

    function versionButtonUpdate(scriptVersion) {
        const configHead = document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('.config-dialog-head').innerHTML;
        if (configHead) {
            if (configHeadOrig == null) {
                configHeadOrig = configHead;
                document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('.config-dialog-head').innerHTML = configHeadOrig + `<a href="${scriptUrl}" target='_blank'><button id='config-update-button' class='btn-sm'>Unity Discourse Enhancer Script Homepage</button></a>`;
            } else {
                if (GM_info.script.version <= scriptVersion) {
                    document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('.config-dialog-head').innerHTML = configHeadOrig + `<a href="${scriptUrl}" target='_blank'><button id='config-update-button' style='background-color: #ececec;color: #000' class='btn-sm'>Update Available! (v${scriptVersion})</button></a>`;
                } else {
                    document.querySelector('iframe.config-dialog-content').contentDocument.querySelector('.config-dialog-head').innerHTML = configHeadOrig + `<a href="${scriptUrl}" target='_blank'><button id='config-update-button' class='btn-sm'>UDE Script Homepage</button></a>`;
                }
            }
        }
    }

    function configRecheck() {
        console.log('configRecheck: Unity|Discourse Enhancer');

        checkSetTheme();
        //initPagination();

        if (GM_config.get().lastPostButton) {
            window.wfs.wait('.timeline-date-wrapper .now-date', addLastPostButton);
            // addLastPostButton();
        }

        if (GM_config.get().firstPostButton) {
            window.wfs.wait('.timeline-date-wrapper', addFirstPostButton);
            // addFirstPostButton();
        }

        if ((GM_config.get().lastPageTopicLinks) || (GM_config.get().moveOriginalPostersAvatar)) {
            window.wfs.wait('.topic-list-item', addTopicListItems);
        }
        // if(GM_config.get().backgroundNoise2){
        //     blackBgNoise = blackBgNoise2;
        //     removeCss();
        // }
        // if(GM_config.get().backgroundNoise1){
        //     blackBgNoise = blackBgNoise1;
        //     removeCss();
        // }
    }




    ////////////////////////////////////////
   /// https://github.com/meredoth/Unity-Discourse-Pagination/blob/main/scripts/pagination.js


// let postsPerPage = 20;
// const paginationStyle = "display:flex; justify-content:center; flex-direction:column; padding-top:5rem";
// const buttonStyle = "width:2rem; height:2rem; margin: 0.2rem;";

// function getCurrentURL() {
//     return window.location.href;
// }

// function createPagination(numberOfPosts, url){
//     const main = document.getElementsByClassName("timeline-container")[0];

//     function getNumPages() {
//         return Math.ceil(numberOfPosts / postsPerPage);
//     }

//     function getCurrentPost() {
//         let currentPost = getCurrentURL().replace(url, '');
//         return currentPost.replace('/','');
//     }

//     function getCurrentPage() {
//         let currentPage = Math.ceil(getCurrentPost() / postsPerPage);
//         if(isNaN(currentPage)) currentPage = 0;
//         return currentPage == 0 ? 1 : currentPage;
//     }

//     function prevPage() {
//         let currentPage = getCurrentPage();
//         return currentPage <= 1 ? 1 : ((currentPage - 2) * postsPerPage + 1);
//     }

//     function nextPage() {
//         let currentPage = getCurrentPage();
//         return currentPage < getNumPages() ? (currentPage * postsPerPage + 1) : (getNumPages() - 1) * postsPerPage + 1;
//     }

//     function createButton(description, urlFunc) {
//         let button = document.createElement('button');
//         button.style = buttonStyle;
//         button.type = "button";

//         let textField = document.createTextNode(description);
//         button.appendChild(textField);
//         button.addEventListener("click", urlFunc);

//         return button;
//     }

//     if(main){

//         if(!GM_config.get().psuedoPaginationEnable){
//             return;
//         }
//         postsPerPage = GM_config.get().paginationPostsPerPage;

//         let pagination = document.createElement('div');
//         pagination.style = paginationStyle;
//         pagination.id = 'pagination';

//         let firstButton = createButton("1", ()=>{ window.location.href = url + '/1'});
//         let prevButton = createButton("-1", ()=>{ window.location.href = url + '/' + prevPage()});
//         let currentButton = createButton(getCurrentPage(), ()=>{window.location.href = url + '/' + (getCurrentPage()-1) * postsPerPage + 1});
//         let nextButton = createButton("+1", ()=>{ window.location.href = url + '/' + nextPage()});
//         let lastButton = createButton(getNumPages(), () => { window.location.href = url + '/' + ((getNumPages()-1) * postsPerPage + 1)});

//         pagination.appendChild(firstButton);
//         pagination.appendChild(prevButton);
//         pagination.appendChild(currentButton);
//         pagination.appendChild(nextButton);
//         pagination.appendChild(lastButton);

//         let buttons = [firstButton, prevButton, currentButton, nextButton, lastButton];

//         buttons.forEach(button => {
//             button.style.visibility = 'visible';
//         });

//         if(getCurrentPage() == 1) {
//             firstButton.style.visibility = 'hidden';
//             prevButton.style.visibility = 'hidden';
//         }

//         if (getCurrentPage() == getNumPages()) {
//             lastButton.style.visibility = 'hidden';
//             nextButton.style.visibility = 'hidden';
//         }

//         let oldPagination = document.getElementById('pagination')
//         oldPagination != null ? oldPagination.replaceWith(pagination) : main.appendChild(pagination);
//     }
// }

// function initPagination() {
//     let topicData = getCurrentURL() + ".json";

//     fetch(topicData)
//     .then((response) => response.json())
//     .then((json) => {
//         let topicUrl = 'https://discussions.unity.com/t/' + json.slug + '/' + json.id;
//         createPagination(json.posts_count, topicUrl);
//     });
// }



})();
