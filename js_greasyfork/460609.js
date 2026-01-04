// ==UserScript==
// @name         Geogussr Desktop UI fixes
// @version      1.2
// @match        https://www.geoguessr.com/*
// @description  Improves user experience on the desktop version of Geoguessr
// @author       closure
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460609/Geogussr%20Desktop%20UI%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/460609/Geogussr%20Desktop%20UI%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fixRoundResults()

    if (window.location.pathname.includes('/singleplayer')) {
        fixSinglePlayerGrid()
    }

    // Fix for changing between gamemodes
    document.querySelector('[class^="game-menu-button_button__"').addEventListener('click', function() {
        var interval = setInterval(function() {
            var scrollWrapper = document.querySelector('[class^="singleplayer-nav_scrollContainer__"]')

            if (scrollWrapper) {
                fixSinglePlayerGrid()
                clearInterval(interval)
            }
        }, 100)
    })

    window.history.pushState = new Proxy(window.history.pushState, {
        apply: (target, thisArg, argArray) => {
            // trigger here what you need
            var url = argArray[2]

            target.apply(thisArg, argArray);

            if (url === '/singleplayer') {
                var interval = setInterval(function() {
                    var scrollWrapper = document.querySelector('[class^="singleplayer-nav_scrollContainer__"]')

                    if (scrollWrapper) {
                        fixSinglePlayerGrid()
                        clearInterval(interval)
                    }
                }, 100)
            }
        },
    });
})();

function fixRoundResults() {
    var css = '[class^="round-result_newDistanceIndicatorWrapper__"], [class^="round-result_newActions__"], [class^="round-result_actions__"], [class^="round-result_newPointsIndicatorWrapper__"] { animation: none; transform: none; visibility: initial; }'
    var styleElement = document.createElement('style')
    styleElement.appendChild(document.createTextNode(css))

    var head = document.getElementsByTagName('head')[0]

    if (!head) return

    head.appendChild(styleElement)
}

function fixSinglePlayerGrid() {
    var interval = setInterval(function() {
        var scrollWrapper = document.querySelector('[class^="singleplayer-nav_scrollContainer__"]')

        if (!scrollWrapper) {
            clearInterval(interval)
            return
        }

        scrollWrapper.className = ''
    }, 100)

    var tabsWrapper = document.querySelector('[class^="singleplayer-nav_root__"] > [class^="singleplayer-nav_tabsWrapper__"]')
    var scrollIndicatorWrapper = document.querySelector('[class^="singleplayer-nav_root__"] > [class^="scroll-indicator_root__"]')
    var wrappers = document.querySelectorAll('[class^="singleplayer-nav_screenWrapper__"] > [class^="dynamic-layout_container__"]')
    var wrapper1 = wrappers[0]
    var wrapper2 = wrappers[1]

    if (!wrapper2 || !wrapper1) return

    var quickPlaySection = wrapper1.children[0].children[0]
    var explorerSection = wrapper2.children[0].children[0]
    var bottomSection = wrapper2.children[1]

    quickPlaySection.style = 'flex-grow: unset; width: 50%;'
    explorerSection.style = 'flex-grow: unset; width: 50%;'
    bottomSection.dataset.rank = 'Tertiary'
    wrapper1.children[0].appendChild(explorerSection)
    wrapper1.appendChild(bottomSection)

    wrapper2.remove()
    tabsWrapper.remove()
    scrollIndicatorWrapper.remove()
}
