// ==UserScript==
// @name            YouTube: Expand All Video Comments
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/6756166a781bd76b97eeeda9fb0bc0c1/raw/
// @version         4.7.8
// @description     Adds a "Expand all" button to video comments which expands every comment and replies - no more clicking "Read more".
// @author          sidneys
// @icon            https://www.youtube.com/favicon.ico
// @noframes
// @match           http*://www.youtube.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es7/code/Library%20%7C%20onElementReady%20ES7.js
// @run-at          document-end
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39719/YouTube%3A%20Expand%20All%20Video%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/39719/YouTube%3A%20Expand%20All%20Video%20Comments.meta.js
// ==/UserScript==


/* global Debug, onElementReady */

/**
 * ESLint
 * @global
 */
Debug = false


/**
 * Applicable URL paths
 * @default
 * @constant
 */
const urlPathList = [
    '/watch'
]


/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM_addStyle(`
        /* =======================================
           ELEMENTS
           ======================================= */

        /* Button: Expand all Comments
           --------------------------------------- */

        .expand-all-comments-button
        {
            padding: 0;
            align-self: start;
            margin-left: var(--ytd-margin-4x, 8px);
            margin-top: 0;
        }


        .expand-all-comments-button #checkboxLabel
        {
            margin-left: var(--ytd-margin-2x, 8px);
            padding-left: 0;
            display: inline-flex;
        }

        .busy .expand-all-comments-button #checkboxContainer,
        .busy .expand-all-comments-button #checkboxLabel
        {
            animation: var(--animation-busy-on);
        }

        /* Button: Expand all Comments
           Spinner
           --------------------------------------- */

        .expand-all-comments-button #checkboxLabel::after
        {
            background-image: url("https://i.imgur.com/z4V4Os8.png");
            content: "";
            background-size: 100%;
            background-repeat: no-repeat;
            margin-left: var(--ytd-margin-2x, 8px);
            height: var(--ytd-margin-4x, 16px);
            width: var(--ytd-margin-4x, 16px);
        }

        .expand-all-comments-button #checkboxLabel,
        .expand-all-comments-button #checkboxLabel::after
        {
            transition: filter 1000ms ease-in-out;
        }

        :not(.busy) .expand-all-comments-button #checkboxLabel::after
        {

            filter: opacity(0);
        }

        .busy .expand-all-comments-button #checkboxLabel::after
        {

            filter: opacity(1);
        }


        /* =======================================
           ANIMATIONS
           ======================================= */

        :root
        {
            --animation-busy-on: 'busy-on' 500ms ease-in-out 1000ms 1 normal forwards running;
        }

        @keyframes busy-on {
            from {
                pointer-events: none;
                cursor: default;
            }
            to {
                filter: saturate(0.1);
                color: hsla(0deg, 0%, 100%, 0.5);
            }
        }
    `)
}

/**
 * Set global busy mode
 * @param {Boolean} isBusy - Yes/No
 * @param {String=} selector - Contextual element selector
 */
let setBusy = (isBusy, selector = 'ytd-comments') => {
    // console.debug('setBusy', 'isBusy:', isBusy)

    let element = document.querySelector(selector)

    if (isBusy === true) {
        element.classList.add('busy')
        return
    } else {
        element.classList.remove('busy')
    }
}

/**
 * Get Button element
 * @returns {Boolean} - On/Off
 */
let getButtonElement = () => document.querySelector('.expand-all-comments-button')

/**
 * Get Toggle state
 * @returns {Boolean} - On/Off
 */
let getToggleState = () => Boolean(getButtonElement() && getButtonElement().checked)


/**
 * Expand all comments
 */
let expandAllComments = () => {
    console.debug('expandAllComments')

    // Look for "View X replies" buttons in comment section
    onElementReady('ytd-comment-replies-renderer #more-replies.ytd-comment-replies-renderer', false, (buttonElement) => {
        // Abort if toggle disabled
        if (!getToggleState()) { return }

        /** @listens buttonElement:Event#click */
        // buttonElement.addEventListener('click', () => setBusy(false), { once: true, passive: true })

        // Busy = yes
        // setBusy(true)

        //  Click button
        buttonElement.click()
    })

    // Look for "Read More" buttons in comment section
    onElementReady('ytd-comments tp-yt-paper-button.ytd-expander#more:not([hidden])', false, (buttonElement) => {
        // Abort if toggle disabled
        if (!getToggleState()) { return }

        /** @listens buttonElement:Event#click */
        // buttonElement.addEventListener('click', () => setBusy(false), { once: true, passive: true })

        // Busy = yes
        // setBusy(true)

        //  Click button
        buttonElement.click()
    })
}


/**
 * Check if the toggle is enabled, if yes, start expanding
 */
let tryExpandAllComments = () => {
    console.debug('tryExpandAllComments')

    const toggleState = getToggleState()

    console.debug('toggle state:', toggleState)

    // Abort if toggle disabled
    if (!toggleState) { return }

    expandAllComments()
}


/**
 * Render button: 'Expand all Comments'
 * @param {Element} element - Container element
 */
let renderButton = (element) => {
    console.debug('renderButton')

    const buttonElement = document.createElement('tp-yt-paper-checkbox')
    buttonElement.className = 'expand-all-comments-button'
    buttonElement.innerHTML = `
    <div id="icon-label" class="yt-dropdown-menu">
        Expand all Comments
    </div>
    `

    // Add button
    element.appendChild(buttonElement)

    // Handle button toggle
    buttonElement.onchange = tryExpandAllComments

    // Status
    console.debug('rendered button')
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Verify URL path
    if (!urlPathList.some(urlPath => window.location.pathname.startsWith(urlPath))) { return }

    // Add Stylesheet
    injectStylesheet()

    // Wait for menu container
    onElementReady('ytd-comments ytd-comments-header-renderer > #title', false, (element) => {
        console.debug('onElementReady', 'ytd-comments ytd-comments-header-renderer > #title')

        // Render button
        renderButton(element)
    })

    // // Wait for variable section container
    // onElementReady('ytd-item-section-renderer#sections.style-scope.ytd-comments > #contents', false, (element) => {
    //     console.debug('onElementReady', 'element:',  '#contents')
    //
    //     /**
    //      * YouTube: Detect "Load More" stuff
    //      * @listens ytd-item-section-rendere:Event#yt-load-next-continuation
    //      */
    //     element.parentElement.addEventListener('yt-load-next-continuation', (event) => {
    //         console.debug('ytd-item-section-renderer#yt-load-next-continuation')
    // 
    //         const currentTarget = event.currentTarget
    //         const shownItems = currentTarget && currentTarget.__data && currentTarget.__data.shownItems || []
    //         const shownItemsCount = shownItems.length
    //
    //         // DEBUG
    //         // console.debug('currentTarget.__data:')
    //         // console.dir(currentTarget.__data)
    //
    //         // Probe whether this is still the initial item batch, if yes, skip
    //         if (shownItemsCount === 0) { return }
    //
    //         tryExpandAllComments()
    //     })
    // })
}


/**
 * YouTube: Detect in-page navigation
 * @listens window:Event#yt-navigate-finish
 */
window.addEventListener('yt-navigate-finish', () => {
    console.debug('window#yt-navigate-finish')

    init()
})
