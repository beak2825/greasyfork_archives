// ==UserScript==
// @name Cat Cleaner+++
// @namespace -
// @version 1.1.1
// @description gives user possibility to clear website data, directly from page user uses.
// @author NotYou
// @include *
// @match *://*/*
// @run-at document-body
// @license GPL-3.0-or-later
// @grant GM.registerMenuCommand
// @grant GM.notification
// @downloadURL https://update.greasyfork.org/scripts/440632/Cat%20Cleaner%2B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/440632/Cat%20Cleaner%2B%2B%2B.meta.js
// ==/UserScript==

/*

ICONS LICENSED UNDER "Linkware" LICENSE

BACKLINK: http://www.iconka.com

README FILE: https://iconarchive.com/icons/iconka/meow/meow-me.txt

*/

(function() {
    const TITLE = 'Cat Cleaner+++'

    if(!GM.registerMenuCommand) {
        warn('No GM.registerMenuCommand, initialization is aborted')

        return void 0
    }

    const REGISTER_DATA = [
        {
            label: 'Clear Cookies',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow/128/cat-clean-icon.png',
            onclick: clearCookies,
            text: 'Cookies for that website are cleared.',
        },
        {
            label: 'Clear Local Storage',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow/128/cat-walk-icon.png',
            onclick: clearLocalStorage,
            text: 'Local storage for that website is cleared.',
        },
        {
            label: 'Clear Session Storage',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow/128/cat-poo-icon.png',
            onclick: clearSessionStorage,
            text: 'Session storage for that website is cleared.',
        },
        {
            label: 'Clear Cache',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow-2/128/cat-paper-icon.png',
            onclick: clearCache,
            text: 'Cache storage for that website is cleared.',
        },
        {
            label: 'Clear IndexedDB (Chrome-based browsers only)',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow-2/128/cat-paper-icon.png',
            onclick: clearIndexedDB,
            text: 'Indexed databases for that website are cleared.',
        },
        {
            label: 'Clear Everything',
            icon: 'https://icons.iconarchive.com/icons/iconka/meow/128/cat-grumpy-icon.png',
            onclick: clearEverything,
            text: 'Cookies, local storage, session storage, cache storage, indexed db for that website are cleared.',
        }
    ]

    for (let i = 0; i < REGISTER_DATA.length; i++) {
        const currentRegisterData = REGISTER_DATA[i]
        const { label, icon, onclick, text } = currentRegisterData

        GM.registerMenuCommand(label, () => {
            let validFunctionInitialization = false

            try {
                validFunctionInitialization = onclick()
            } catch(e) {
                warn(onclick.name + ' function failed initialization, error: ' + e)
            }

            if(validFunctionInitialization) {
                if(GM.notification) {
                    GM.notification({
                        title: TITLE,
                        image: icon,
                        text
                    })
                } else {
                    warn(text)
                }
            }
        })
    }

    function clearCookies() {
        const cookieLength = document.cookie.split(';').length

        for (let i = 0; i < cookieLength; i++) {
            const cookie = document.cookie

            document.cookie = cookie + ';max-age=0'
        }

        return true
    }

    function clearLocalStorage() {
        localStorage.clear()

        return true
    }

    function clearSessionStorage() {
        sessionStorage.clear()

        return true
    }

    function clearCache() {
        caches.keys().then(keyList =>
            Promise.all(keyList.map(key =>
                caches.delete(key)
            )
        ))

        return true
    }

    function clearIndexedDB() {
        if(!indexedDB.databases) {
            warn('This function is only for Chrome-based browsers!')

            return false
        }

        indexedDB.databases().then(databases => {
            databases.forEach(database => {
                indexedDB.deleteDatabase(database)
            })
        })

        return true
    }

    function clearEverything() {
        clearCookies()
        clearLocalStorage()
        clearSessionStorage()
        clearCache()
        clearIndexedDB()

        return true
    }

    function warn(message) {
        alert(TITLE + '\n' + message)
    }
})()
