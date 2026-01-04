// ==UserScript==
// @name            Itchio Show Categories
// @version         0.0.3
// @author          Dillon Regimbal
// @namespace       https://dillonr.com
// @description     Displays tag categories of games on itch.io
// @match           *://itch.io/*
// @match           *://*.itch.io/*
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @icon            https://itch.io/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/405228/Itchio%20Show%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/405228/Itchio%20Show%20Categories.meta.js
// ==/UserScript==

// Since 2020-06-12
// https://greasyfork.org/en/users/420789-dillon-regimbal
// https://greasyfork.org/en/scripts/405228-itchio-show-categories
// https://github.com/dregimbal/UserScripts/blob/master/ItchioShowCategories.user.js

(function () {
    'use strict'
    if (window !== window.parent) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/parent
        // Don't run inside of a frame
    }

    // #region Config and Variables

    let btn_category_class = 'dr_category_button'
    let btn_category_id = 'dr_markCategory'
    let btn_category_text = 'Checked 0/0'
    let game_store_link_selector = '.game_cell_data a.game_link, .bundle_game_grid_widget .game_cell a.title'
    let category_text_class = 'dr_category_text'
    let meta_tag_class = 'meta_tag'
    let game_cell_class = 'game_cell'
    let game_cell_data_class = 'game_cell_data'

    let categoryMap = [
        {
            container: '#wrapper',
            categories: [
                {
                    title: 'Co-op',
                    searchStrings: ['co-op', ' coop ']
                }
            ]
        },
        {
            container: '.game_info_panel_widget',
            categories: [
                {
                    title: 'Local Multiplayer',
                    searchStrings: ['Local Multiplayer']

                },
                {
                    title: 'Networked',
                    searchStrings: ['Networked Multiplayer']

                },
                {
                    title: 'Controller',
                    searchStrings: ['Gamepad', 'Xbox Controller', 'Joystick', 'Playstation Controller', 'Joy-Con', 'Wiimote']

                },
                {
                    title: 'Phone Control',
                    searchStrings: ['Smartphone']

                },
                {
                    title: 'Physical',
                    searchStrings: ['Physical Game', 'Tabletop']

                }
            ]
        }
    ]

    let gamesToCheck = new Map()

    // #endregion

    // #region Create button and styles

    let divButton = document.createElement('div')
    divButton.classList.add(btn_category_class)
    divButton.id = btn_category_id

    let eleA = document.createElement('a')
    eleA.setAttribute('onclick', 'return false;')
    eleA.textContent = btn_category_text

    divButton.appendChild(eleA)

    GM_addStyle(`
    .${btn_category_class} {
        border-radius: 2px;
        border: medium none;
        padding: 10px;
        display: inline-block;
        cursor: pointer;
        background: #67C1F5 none repeat scroll 0% 0%;
        width: 120px;
        text-align: center;
    }

    .${btn_category_class} a {
        text-decoration: none !important;
        color: #FFF !important;
        padding: 0px 2px;
    }

    .${btn_category_class}:hover a {
        color: #0079BF !important;
    }

    .${btn_category_class}, .${btn_category_class} a {
        font-family: Verdana;
        font-size: 12px;
        line-height: 16px;
    }

    .${game_cell_class} .${game_cell_data_class} a.${category_text_class}.${meta_tag_class}, .${game_cell_class} a.${category_text_class}.${meta_tag_class}  {
        padding: 3px;
        margin: 2px;
        font-size: 14px;
        color: #ffffff;
        background-color: #17199d;
    }

    #${btn_category_id} {
        position: fixed;
        right: 20px;
        bottom: 65px;
        z-index: 33;
    }
    .scrolling_outer {
        height: auto !important;
    }
    `)

    // #endregion

    function queueCheckingGames() {
        let storePageLinkElements = document.querySelectorAll(game_store_link_selector)
        for (let storelink of storePageLinkElements) {
            // Don't search bundle pages for game details
            if (!storelink.href.includes('/b/')) {
                if (!gamesToCheck.has(storelink.href)) {
                    // New link
                    gamesToCheck.set(storelink.href,
                        {
                            link: storelink.href,
                            elements: new Set([storelink.parentElement]),
                            checked: false,
                            categories: new Set()
                        })
                } else {
                    // Existing link
                    gamesToCheck.get(storelink.href).elements.add(storelink.parentElement)
                }
                // Update the count on the button
                eleA.innerText = getNumberOfCheckedGames()
            }
        }
        return
    }

    async function checkGameLinks() {
        for (let game of gamesToCheck.values()) {
            await fetchGameCategories(game.link)
                .then(() => {
                    for (let element of game.elements) {
                        let nextSibling = element.nextElementSibling
                        if (nextSibling !== null && nextSibling.classList.contains(category_text_class)) {
                            // console.log('Categories already added')
                        } else {
                            for (let category of game.categories) {
                                addCategoryText(element, category)
                            }
                        }
                    }
                })
            eleA.innerText = getNumberOfCheckedGames()
        }
        return
    }

    function getNumberOfCheckedGames() {
        return `Checked ${Array.from(gamesToCheck.values()).reduce((acc, game) => {
            if (game.checked) {
                // eslint-disable-next-line no-param-reassign
                acc++
            }
            return acc
        }, 0)}/${gamesToCheck.size}`
    }

    /**
     * Checks a page for game categories
     * @param {string} storePageUrl The store page that contains the categories
     * @returns {Promise} The categories of the game
     */
    function fetchGameCategories(storePageUrl) {
        return new Promise((resolve, reject) => {
            let game = gamesToCheck.get(storePageUrl)
            if (game.checked) {
                resolve(game.categories)
            } else {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: game.link,
                    onload: function (response) {
                        console.assert(response.status === 200, [
                            response.status,
                            response.statusText,
                            response.readyState,
                            response.responseHeaders,
                            response.responseText,
                            response.finalUrl
                        ].join(' - '))

                        let parser = new DOMParser()
                        let storePage = parser.parseFromString(response.responseText, 'text/html')
                        let validCategories = new Set()
                        for (let scope of categoryMap) {
                            let scopedElements = storePage.querySelectorAll(scope.container)
                            console.assert(scopedElements.length > 0, `No elements matching "${scope.container}" found on ${game.link}`)
                            for (let scopedElement of scopedElements) {
                                for (let category of scope.categories) {
                                    for (let searchString of category.searchStrings) {
                                        if (scopedElement.textContent.toLowerCase().includes(searchString.toLowerCase())) {
                                            validCategories.add(category.title)
                                        }
                                    }
                                }
                            }
                        }
                        game.checked = true
                        game.categories = validCategories
                        resolve(validCategories)
                    }
                })
            }
        })
    }

    /**
     * @description Add text after an element
     * @param {HTMLElement} element the element to add the text to
     * @param {string} text the contents of the text
     * @returns {undefined}
     */
    function addCategoryText(element, text) {
        if (typeof element !== 'undefined' && element !== null) {
            let categoryText = document.createElement('a')
            categoryText.classList.add(meta_tag_class)
            categoryText.classList.add(category_text_class)
            categoryText.innerText = text
            element.parentNode.insertBefore(categoryText, element.nextSibling)
            // console.log(`Adding ${text}`)
        } else {
            console.log(`Element null, cannot add: ${text}`)
        }
        return
    }

    let url = document.documentURI
    let checking = false

    if (url.includes('/my-collections') || url.includes('/my-purchases') || url.includes('/games') || url.includes('/s/') || url.includes('/c/') || url.includes('/b/')) {
        divButton.addEventListener('click', async () => {
            if (!checking) {
                checking = true
                queueCheckingGames()
                await checkGameLinks()
                checking = false
            } else {
                console.log('Wait a second, eh')
            }
        })
        document.body.appendChild(divButton)
        queueCheckingGames()
    }
}())
