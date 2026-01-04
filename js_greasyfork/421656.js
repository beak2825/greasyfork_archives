// ==UserScript==
// @name            BitChute: Add-to-Playlist-Button for all Videos
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/23018bf607466ebeb5b11c7889774665/raw/
// @version         0.9.7
// @description     Adds the BitChute playlist button to every video thumbnail, right next to the 'Watch Later' button.
// @author          sidneys
// @icon            https://i.imgur.com/4GUWzW5.png
// @noframes
// @match           *://*.bitchute.com/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es7/code/Library%20%7C%20onElementReady%20ES7.js
// @connect         bitchute.com
// @grant           GM.addStyle
// @grant           GM.download
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/421656/BitChute%3A%20Add-to-Playlist-Button%20for%20all%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/421656/BitChute%3A%20Add-to-Playlist-Button%20for%20all%20Videos.meta.js
// ==/UserScript==


/**
 * ESLint
 * @global
 */
/* global Debug, onElementReady */
Debug = false


/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM.addStyle(`
        /* ==========================================================================
           ELEMENTS
           ========================================================================== */

        /* .show-playlist-modal
           ========================================================================== */

        .action-button.show-playlist-modal
        {
            top: 30px;
            font-size: 24px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .action-button.show-playlist-modal > svg.action-icon:hover
        {
            transform: unset;
        }

        .action-button
        {
            cursor: pointer;
        }
    `)
}


/**
 * Monkey Patch History.pushState() to emit a 'pushstate' event on <window>.
 * @see {@link https://stackoverflow.com/a/4585031/1327892}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/History/pushState}
 */
const originalPushState = unsafeWindow.history.pushState
unsafeWindow.history.pushState = (state, title = '', url) => {
    console.debug('history.pushState()', 'state:', JSON.stringify(state), 'title:', title, 'url:', url)

    // Create event
    const event = new CustomEvent('pushstate', { 'detail': state, 'bubbles': true, 'cancelable': false })

    // Emit event
    unsafeWindow.dispatchEvent(event)

    // Call original
    originalPushState.call(unsafeWindow.history, state, title, url)
}


/**
 * Register Event Handlers
 */
let registerEventHandlers = () => {
    console.debug('registerEventHandlers')

    // Add BitChute's internal event handlers
    unsafeWindow.playlistAttachEvents()
    unsafeWindow.playlistAttachModalEvents()
    unsafeWindow.spaAttachEvents()
    unsafeWindow.scrollerAttachEvents()

    // Log message after Playlist shown
    unsafeWindow.jQuery('.playlist-modal')
        .off('shown.bs.modal')
        .on('shown.bs.modal', (event) => {
            console.debug('.playlist-modal#shown.bs.modal')

            console.info('Shown', 'Playlist')
        })

    // Log message after Playlist hidden
    unsafeWindow.jQuery('.playlist-modal')
        .off('hidden.bs.modal')
        .on('hidden.bs.modal', (event) => {
            console.debug('.playlist-modal#hidden.bs.modal')

            console.info('Hidden', 'Playlist')
        })
}


/**
 * Render Button 'Add to Playlist'
 * @param {Element} element - Target Element
 */
let renderButtonElement = (element) => {
    console.debug('renderButtonElement')

    // Create Element
    const buttonElement = document.createElement('span')
    buttonElement.className = 'show-playlist-modal'
    buttonElement.innerHTML = `
        <i class="action-icon fas fa-list fa-fw"></i>
    `
    buttonElement.title = 'Add to Playlist'
    buttonElement.dataset.toggle = 'tooltip'
    buttonElement.dataset.placement = 'bottom'
    unsafeWindow.jQuery(buttonElement).data('video', unsafeWindow.jQuery(element).data('video'))

    if (element.classList.contains('action-button')) {
        buttonElement.classList.add('action-button')
    }

    if (element.classList.contains('toolbox-button')) {
        buttonElement.classList.add('toolbox-button')
    }

    // Render Element
    element.after(buttonElement)

    // Status
    console.debug('Rendered', 'Button Element')
}

/**
 * Render Modal 'Playlist'
 * @param {Element} element - Target Element
 */
let renderPlaylistElement = (element) => {
    console.debug('renderPlaylistElement')

    // Abort if exists
    if (document.querySelector('.playlist-modal')) { return }

    // Create Element
    const playlistElement = document.createElement('div')
    playlistElement.setAttribute('role', 'dialog')
    playlistElement.className = 'modal fade playlist-modal'
    playlistElement.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                    <i class="fas fa-times fa-fw"></i>
                </button>
                <a href="/" class="spa">
                    <img class="modal-logo logo-full" src="/static/v130/images/logo-full-day.png" alt="BitChute">
                </a>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <div class="create-playlist-entry-error alert alert-danger hidden"></div>
                    <label>Add to Playlist</label>
                    <span class="options"></span>
                </div>
                <div class="create-playlist-error alert alert-danger hidden"></div>
                <div class="form-group">
                    <form method="post" id="create-playlist-form">
                        <input type="hidden" name="csrfmiddlewaretoken" value="XA3zoHAEsntOaFTteSV3rhIVboyJf5P5HeYjAioyqn2hKQ8IXcBOcKZCTduYIVc4">
                        <label>Create a New Playlist</label>
                        <div class="create-playlist-error-playlist alert alert-danger hidden"></div>
                        <div class="name">
                            <input type="text" name="playlist" class="form-control" autocomplete="off" placeholder="My Playlist" maxlength="100" id="id_playlist">
                            <span class="toolbox-button create" data-video="UkfyMnll0o9O" data-toggle="tooltip" data-placement="bottom" title="Create Playlist">
                                <span class="fa-layers">
                                    <i class="fal fa-square"></i>
                                    <i class="far fa-plus" data-fa-transform="shrink-7"></i>
                                </span>
                            </span>
                        </div>
                        <p class="help">This must be unique. Maximum 100 characters.</p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `

    // Render Element
    element.before(playlistElement)

    // Status
    console.debug('Rendered', 'Playlist Element')
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Add Stylesheet
    injectStylesheet()

    // Add Playlist
    onElementReady('.container', true, (element) => {
        renderPlaylistElement(element)
    })

    // Add Buttons
    onElementReady('.playlist-watch-later', false, (element) => {
        // Render Element
        renderButtonElement(element)

        // Attach Events
        registerEventHandlers()
    })
}


/**
 * @listens document:Event#readystatechange
 */
document.addEventListener('readystatechange', () => {
    console.debug('document#readystatechange', document.readyState)

    if (document.readyState !== 'interactive') { return }

    /**
     * @listens window:Event#jQuery(document).ready
     */
    unsafeWindow.jQuery(document).ready(() => {
        console.debug('window#jQuery(document).ready')

        init()
    })
})

/**
 * Handle in-page navigation on BitChute
 * @listens window:Event#pushstate
 */
unsafeWindow.addEventListener('pushstate', (event) => {
    console.debug('window#pushstate', 'event.detail:', JSON.stringify(event.detail))

    init()
})
