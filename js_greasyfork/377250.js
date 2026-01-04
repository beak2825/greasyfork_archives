// ==UserScript==
// @name            OpenSubtitles | Download Enabler (2019)
// @namespace       de.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/b654b054a02b4389aa91f293d08c5108/raw/
// @version         0.9.9
// @description     Reenable Subtitle downloading on OpenSubtitles.com and OpenSubtitles.org, without using the official 'OpenSubtitles PRO' extension. A requirement as of early 2019.
// @author          sidneys
// @icon            https://static.opensubtitles.org/favicon.ico
// @include         *://www.opensubtitles.com/*
// @include         *://www.opensubtitles.org/*
// @require         https://greasyfork.org/scripts/38888-greasemonkey-color-log/code/Greasemonkey%20%7C%20Color%20Log.js
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/377250/OpenSubtitles%20%7C%20Download%20Enabler%20%282019%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377250/OpenSubtitles%20%7C%20Download%20Enabler%20%282019%29.meta.js
// ==/UserScript==

/**
 * ESLint
 * @global
 */
Debug = false


/**
 * The OpenSubtitles access level, sourced from the "OpenSubtitles.com PRO" extension.
 * @global
 * @default
 * @type {String}
 * @see {@link https://addons.mozilla.org/en-US/firefox/addon/opensubtitles-pro/|OpenSubtitles Pro}
 */
const accessLevel = 'extpremium'


/**
 * Create a new <meta> Element using OpenSubtitles.com credentials.
 * @param {String} url - Target URL
 */
let renderMetaTag = (url) => {
    console.debug('renderMetaTag')

    // Create <meta> element with desired access level
    const metaElement = document.createElement('meta')
    metaElement.name = 'accesslevel'
    metaElement.id = 'extinstalled'
    metaElement.content = accessLevel

    // Append <meta> element
    document.querySelector('head').appendChild(metaElement)

    // Status
    console.info('OpenSubtitles.com Access Level set to:', accessLevel)
}


/**
 * Initializer
 */
let init = (() => {
    console.debug('init')

    // Render <meta> Tag
    renderMetaTag()
})()
