// ==UserScript==
// @name        D&D Beyond fixed sidebar
// @namespace   dndbeyond-fixed-sidebar
// @description This script sets the sidebar fixed to the left side, and opens the profile upon launch.
// @version     3
// @grant       none
// @include     /^(https://www.dndbeyond.com/profile/[^/]*/characters/.*|https://www.dndbeyond.com/characters/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/411198/DD%20Beyond%20fixed%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/411198/DD%20Beyond%20fixed%20sidebar.meta.js
// ==/UserScript==
const clickElement = (query) => {
    let element = document.querySelector(query)

    if (element) {
        element.click()
    }

    return element
}

const keepTrying = (
    fn, {
        checkEvery = 500,
        stopAfter = 5000,
        delayBy = 0
    } = {}
) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const timeout = setTimeout(() => {
            clearInterval(interval)

            return reject(new Error('Timeout after ${stopAfter}ms.'))
        }, stopAfter)

        const interval = setInterval(() => {
            const result = fn()

            if (!result) return

            clearInterval(interval)
            clearTimeout(timeout)

            return resolve(result)
        }, checkEvery)
    }, delayBy)
})

const expandPromise = async (promise) => {
    let data = null
    let error = null

    try {
        data = await promise
    } catch (err) {
        error = err
    }

    return [ error, data ]
}

const logError = (error, message) => {
    if (!error) return

    console.error(message)
}

const pageClickOptions = { delayBy: 2000 }

const onLoad = async () => {
    console.log('Optimizing D&D Beyond...')

    const clickBannerDismiss = () => clickElement('.ddb-site-banner--dismiss')
    keepTrying(clickBannerDismiss)

    const setSidebar = async () => {
        // await keepTrying(() => clickElement('.ct-sidebar__control--unlock'), pageClickOptions)
        await keepTrying(() => clickElement('.ct-sidebar__control--expand'))

        clickElement('.ct-sidebar__control--left')
        clickElement('.ct-sidebar__control--fixed')
        clickElement('.ct-sidebar__control-group--lock')
    }

    console.log("Expanding sidebar")
    const willSetSidebar = setSidebar()

    const tryToClickProfile = () => clickElement('.ddbc-character-avatar__portrait')
    const willKeepClickingProfile = keepTrying(tryToClickProfile, pageClickOptions)

    const [ sidebarTimeout ] = await expandPromise(willSetSidebar)
    const [ profileTimeout ] = await expandPromise(willKeepClickingProfile)

    logError(sidebarTimeout, 'Timed out while waiting on sidebar controls')
    logError(profileTimeout, 'Timed out while waiting on portrait')
}

window.addEventListener('load', async () => {
    try {
        await onLoad()
    }
    catch (error) {
        console.error(error)
    }
}, false)
