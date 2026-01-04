// ==UserScript==
// @name            BitChute: Video Download Button
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/b4783b0450e07e12942aa22b3a11bc00/raw/
// @version         30.7.7
// @description     Adds a "Download" button to the BitChute player. Also downloads thumbnails. Supports WebTorrent and native player.
// @author          sidneys
// @icon            https://i.imgur.com/4GUWzW5.png
// @noframes
// @match           *://www.bitchute.com/*
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @require         https://greasyfork.org/scripts/374849-library-onelementready-es7/code/Library%20%7C%20onElementReady%20ES7.js
// @require         https://cdn.jsdelivr.net/npm/moment@2.29.3/moment.min.js
// @connect         bitchute.com
// @grant           GM.addStyle
// @grant           GM.download
// @grant           GM.registerMenuCommand
// @grant           GM.unregisterMenuCommand
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           unsafeWindow
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/40726/BitChute%3A%20Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/40726/BitChute%3A%20Video%20Download%20Button.meta.js
// ==/UserScript==


/**
 * ESLint
 * @global
 */
/* global Debug, onElementReady, moment */
Debug = false


/**
 * Defaults
 * @constant
 * @default
 */
const timestampFormat = 'YYYY-MM-DD'
const fileTitleSeparator = ' '
// const imageExtensions = ['jpg', 'png']

/**
 * Inject Stylesheet
 */
let injectStylesheet = () => {
    console.debug('injectStylesheet')

    GM.addStyle(`
        /* ==========================================================================
           ELEMENTS
           ========================================================================== */

        /* a.plyr__control__download
           ========================================================================== */

        a.plyr__control__download,
        a.plyr__control__download:hover
        {
            color: rgb(255, 255, 255);
            display: inline-block;
            animation: fade-in 0.3s;
            pointer-events: all;
            filter: none;
            cursor: pointer;
            white-space: nowrap;
            transition: all 500ms ease-in-out;
        }

        a.plyr__control__download:not(.plyr__control__download--download-ready)
        {
            opacity: 0;
            width: 0;
            padding: 0;
        }

        a.plyr__control__download--download-error
        {
            animation: 5000ms flash-red cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s;
        }

        a.plyr__control__download--download-started
        {
            color: rgb(48, 162, 71);
            pointer-events: none;
            cursor: default;
            animation:  1000ms pulsating-opacity cubic-bezier(0.455, 0.03, 0.515, 0.955) 0s infinite alternate;
        }

        /* ==========================================================================
           ANIMATIONS
           ========================================================================== */

        @keyframes pulsating-opacity
        {
            0% { filter: opacity(1); }
            25% { filter: opacity(1); }
            50% { filter: opacity(0.75); }
            75% { filter: opacity(1); }
            100% { filter: opacity(1); }
        }

        @keyframes flash-red
        {
            0% { color: unset; }
            5% { color: rgb(239, 65, 54); }
            50% { color: rgb(239, 65, 54); }
            80% { color: rgb(239, 65, 54); }
            100% { color: unset; }
        }
    `)
}


/**
 * @callback saveAsCallback
 * @param {Error} error - Error
 * @param {Number} progress - Progress fraction
 * @param {Boolean} complete - Completion Yes/No
 */

/**
 * Download File via Greasemonkey
 * @param {String} url - Target URL
 * @param {String} fileName - Target Filename
 * @param {saveAsCallback} callback - Callback
 */
let saveAs = (url, fileName, callback = () => {}) => {
    console.debug('saveAs')

    // Parse URL
    const urlObject = new URL(url)
    const urlHref = urlObject.href

    // Download
    // noinspection JSValidateTypes
    GM.download({
        url: urlHref,
        name: fileName,
        saveAs: true,
        onerror: (download) => {
            console.debug('saveAs', 'onerror')

            callback(new Error(download.error ? download.error.toUpperCase() : 'Unknown'))
        },
        onload: () => {
            console.debug('saveAs', 'onload')

            callback(null)
        },
        ontimeout: () => {
            console.debug('saveAs', 'ontimeout')

            callback(new Error('Network timeout'))
        }
    })
}

/**
 * Sanitize file name component for safe usage ("filename:.extension" -> )
 * @param {String} fileName - File name
 * @return {String} - Safe Filename
 */
let sanitizeFileNameComponent = (fileName = '') => fileName.replace(/[^a-z0-9._-]/gi, '_')

/**
 * Parse file title ("title.extension")
 * @param {String} filePath - File path
 * @return {String} File title
 */
let parseFileTitle = (filePath = '') => filePath.split('/').pop().split('.')[0]

/**
 * Parse file extension ("title.extension")
 * @param {String} filePath - File path
 * @return {String} File extension
 */
let parseFileExtension = (filePath = '') => {
    console.debug('parseFileExtension')

    // Apply regular expression
    const resultList = /.+\.(.+)$/.exec(filePath)

    // Return
    return resultList ? resultList[1] : void 0
}


/**
 * Look up Video Timestamp
 * @return {String|void} - Video Timestamp
 */
let lookupVideoTimestamp = () => {
    console.debug('lookupVideoTimestamp')

    // Look up
    const element = document.querySelector('.video-publish-date')

    if (!element) { return }

    // Format date components
    const text = element.textContent.split('at').pop()
    const formatted = moment.utc(text, 'HH:mm UTC on MMMM Do, YYYY').format(timestampFormat)

    // Return
    return formatted
}

/**
 * Look up Video Author
 * @return {String|void} - Video Author
 */
let lookupVideoAuthor = () => {
    console.debug('lookupVideoAuthor')

    // Look up
    const element = document.querySelector('p.owner > a')

    // Return
    return element ? element.textContent.trim() : void 0
}

/**
 * Look up Video Title
 * @return {String|void} - Video Title
 */
let lookupVideoTitle = () => {
    console.debug('lookupVideoTitle')

    // Look up
    const element = document.querySelector('h1.page-title') || document.querySelector('title')

    // Return
    return element ? element.textContent.trim() : void 0
}

/**
 * Look up Video Poster Image
 * @return {String|void} - Poster Image URL
 */
let lookupPosterUrl = () => {
    console.debug('lookupVideoPoster')

    // Look up
    const url = document.querySelector('video').poster || document.querySelector('meta[name="twitter:url"]')

    // Return
    return url
}


/**
 * Generate file title for downloaded files ("title.extension")
 * @return {String} File name
 */
let generateDownloadedFileTitle = () => {
    console.debug('generateDownloadedFileTitle')

    // Lookup file title components
    const timestamp = lookupVideoTimestamp()
    const author = sanitizeFileNameComponent(lookupVideoAuthor())
    const title = sanitizeFileNameComponent(lookupVideoTitle())

    // Set file title components, removing empty components
    let fileTitleList = [ timestamp, author, title ]
    fileTitleList = fileTitleList.filter(Boolean)

    // Join file title components
    const fileTitle = fileTitleList.join(fileTitleSeparator)

    // Return
    return fileTitle
}


/**
 * Render download button
 * @param {Array} urlList - Target URLs
 */
let renderDownloadButton = (urlList) => {
    console.debug('renderDownloadButton')

    /**
     * Create Button
     */

    // Setup Button Element
    const anchorElement = document.createElement('a')
    anchorElement.className = 'plyr__control plyr__control__download'
    anchorElement.innerHTML = `
        <svg role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path>
        </svg>
        <span class="plyr__tooltip">Download Video</span>
    `
    //anchorElement.href = '#'
    anchorElement.href = urlList[0]
    anchorElement.target = '_blank'
    anchorElement.rel = 'noopener noreferrer'
    anchorElement.type = 'video/mp4'

    // Render Button Element
    const parentElement = document.querySelector('.plyr__controls')
    parentElement.appendChild(anchorElement)
    anchorElement.classList.add('plyr__control__download--download-ready')

   /**
    const thumbnail = GM_config.get('Thumbnail')
    console.warn(11111, urlList)
    console.warn(44444, thumbnail)
    /**
     * URL Filter / Restrict downloads
     */

   /** if (thumbnail) {
        urlList = urlList.filter((url) => {
            const extension = url.split('.').pop()
            console.warn(33333, extension)
            if (imageExtensions.includes(extension)) { return false }
        })
    }
    console.warn(22222, urlList)
*/
    /**
     * Download URLs
     */

    // Add Button Events
    anchorElement.onclick = (event) => {
        // Cancel regular download
        event.preventDefault()

        // Reset classes
        anchorElement.classList.remove('plyr__control__download--download-error')
        anchorElement.classList.add('plyr__control__download--download-started')

        // Download each URL
        urlList.forEach((url, urlIndex) => {
            // Parse URL
            const urlObject = new URL(url)
            const urlHref = urlObject.href
            const urlPathname = urlObject.pathname

            // Generate file name
            const fileTitle = generateDownloadedFileTitle() || parseFileTitle(urlPathname)
            const fileExtension = parseFileExtension(urlPathname)
            const fileName = fileTitle + (fileExtension ? `.${fileExtension}` : '')

            // Status
            console.info('Downloading:', urlHref, `(${urlIndex + 1} of ${urlList.length})`)

            // Start download
            saveAs(urlHref, fileName, (error) => {
                // Error
                if (error) {
                    anchorElement.classList.remove('plyr__control__download--download-started')
                    anchorElement.classList.add('plyr__control__download--download-error')

                    return
                }

                // Success
                anchorElement.classList.remove('plyr__control__download--download-started')

                // Status
                console.info('Download complete:', fileName)
            })
        })
    }

    // Status
    console.debug('Download button added for URLs:', urlList.join(', '))
}


/**
 * Init
 */
let init = () => {
    console.info('init')

    // Add Stylesheet
    injectStylesheet()

    //GM.registerMenuCommand('Download thumbnails', func)


    GM_config.init(
        {
            'id': 'MyConfig',
            'title': 'Script Settings',
            'fields':
            {
                'Thumbnails':
            {
                'label': 'Download Thumbnails',
                'type': 'checkbox',
                'default': true
            }
            }
        })
    // GM_config.open()

    // Wait for HTML video player (.plyr)
    onElementReady('.plyr', false, () => {
        // Check if BitChute is using WebTorrent Player or Native Player
        if (unsafeWindow.webtorrent) {
            console.info('Detected WebTorrent Video Player.')

            // WebTorrent: Wait for WebTorrent instance
            const torrent = unsafeWindow.webtorrent.torrents[0]
            torrent.on('ready', () => {
                // Create Download Button for Poster Image and Video
                // renderDownloadButton([ lookupPosterUrl(), torrent.urlList[0] ])
                renderDownloadButton([ torrent.urlList[0] ])
            })
        } else {
            console.info('Detected Native Video Player.')

            // Native Player: Wait for <source> element
            onElementReady('source', false, (element) => {
                // Create Download Button for Poster Image and Video
                // rrenderDownloadButton([ lookupPosterUrl(), element.src ])
                renderDownloadButton([ element.src ])
            })
        }
    })
}


/**
 * @listens document:Event#readystatechange
 */
document.addEventListener('readystatechange', () => {
    console.debug('document#readystatechange', document.readyState)

    if (document.readyState === 'interactive') { init() }
})