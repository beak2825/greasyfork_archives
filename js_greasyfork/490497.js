// ==UserScript==
// @name         Allegro Lokalnie Pagination Remover
// @namespace    Allegro Lokalnie
// @version      0.3
// @license      MIT
// @description  Remove pagination on seller panel - current + finished auctions
// @author       Saymonn
// @match        https://allegrolokalnie.pl/konto/oferty/zakonczone*
// @match        https://allegrolokalnie.pl/konto/oferty/aktywne*
// @icon         https://lokalnie-prod-assets.storage.googleapis.com/ui/versions/f63b18f1/images/favicon-android-chrome-192x192-1202c51ba7dbf5e1e6a2b61c5cbdae04.png?vsn=d
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490497/Allegro%20Lokalnie%20Pagination%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/490497/Allegro%20Lokalnie%20Pagination%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict'

    let currentPage = 1
    const maxPages = 20
    const container = document.querySelector('.listing__body')
    const observedItems = new Map()

    const loaderWrapper = document.createElement('div')
    loaderWrapper.setAttribute('id', 'customLoaderWrapper')
    loaderWrapper.style =
        'position: fixed; right: 4vh; top: 20vh; width: 200px; height: 50px; background: #FFF; border-radius: 15px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); overflow: hidden;'
    document.body.appendChild(loaderWrapper)

    const loaderBar = document.createElement('div')
    loaderBar.setAttribute('id', 'customLoaderBar')
    loaderBar.style = 'height: 100%; width: 0%; background-color: #6256b1; transition: width 0.5s;'
    loaderWrapper.appendChild(loaderBar)

    const loaderText = document.createElement('div')
    loaderText.setAttribute('id', 'customLoaderText')
    loaderText.style =
        'position: absolute; width: 100%; height: 100%; top: 0; left: 0; color: #FF5A00; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;'
    loaderText.innerText = '0%'
    loaderWrapper.appendChild(loaderText)

    function updateLoader(progress) {
        loaderBar.style.width = progress + '%'
        loaderText.innerText = progress + '%'
    }

    function loadNextPage() {
        if (currentPage > maxPages) {
            updateDOMWithUniqueItems()
            updateLoader(100)
            setTimeout(() => {
                loaderWrapper.style.display = 'none'
                removePagination()
            }, 1000)
            return
        }

        const nextPageUrl = document.location.href + `?page=${currentPage}`
        fetch(nextPageUrl)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser()
                const doc = parser.parseFromString(html, 'text/html')
                const newItems = doc.querySelectorAll('.offer-card-container')
                newItems.forEach(item => {
                    const offerLink = item.querySelector('a[itemprop="url"]').getAttribute('href')
                    if (!observedItems.has(offerLink)) {
                        observedItems.set(offerLink, item.cloneNode(true))
                    }
                })
                currentPage++
                updateLoader(Math.floor((currentPage / maxPages) * 100))
                loadNextPage()
            })
    }

    function updateDOMWithUniqueItems() {
        container.innerHTML = ''
        observedItems.forEach(item => {
            container.appendChild(item)
        })
    }

    function removePagination() {
        const paginationElement = document.querySelector('nav.pagination')
        if (paginationElement) {
            paginationElement.remove()
        }
    }

    if (document.location.href.includes('/konto/oferty/zakonczone') || document.location.href.includes('/konto/oferty/aktywne')) {
        loadNextPage()
    }
})();
