// ==UserScript==
// @name         Wykop Ukrywaczka
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ułatwia korzystanie z wykop.pl poprzez ukrywanie wpisów na głównej
// @author       Seduxisti
// @match        https://www.wykop.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wykop.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442042/Wykop%20Ukrywaczka.user.js
// @updateURL https://update.greasyfork.org/scripts/442042/Wykop%20Ukrywaczka.meta.js
// ==/UserScript==

/*global $*/
/*jshint esversion: 6 */
(function() {
    'use strict';

    // save ids to localStorage
    const save = (ids) => {
        const stringifiedIds = JSON.stringify(ids)
        localStorage.setItem('hidden', stringifiedIds)
    }

    // creates a Set of hidden ids from the localStorage
    const hidden = (function() {
        const hiddenStringified = localStorage.getItem('hidden')
        if (!hiddenStringified) return new Set()

        // number[]
        let ids = JSON.parse(hiddenStringified).map(Number)

        // shrink the number of saved ids if it exceeds the limit
        if (ids.length > 100000) { // limit
            ids = ids.sort().slice(-10000) // save the latest (bigger id means newer article)
            save(ids)
        }

        return new Set(ids)
    })()

    const setHidden = (id) => {
        hidden.add(id)
        save([...hidden.values()])
    }

    const unsetHidden = (id) => {
        hidden.delete(id)
        save([...hidden.values()])
    }

    const linkItems = document.querySelectorAll('#itemsStream > .link')

    const createButton = (text, callback, css = {}) =>
        $('<span></span>')
            .text(text)
            .addClass("button submit")
            .css(css)
            .click(callback)[0]

    const createThinBar = (title, callback) => {
        const div = document.createElement('div')
        const btn = createButton('pokaż', callback, {
            fontSize: '1.1rem',
            fontWight: 'normal',
            margin: '2px 8px'
        })
        div.appendChild(btn)

        const h2 = $('<h2></h2>')
            .text(title)
            .css({
                display: 'inline',
                fontSize: '1.6rem',
                verticalAlign: 'middle'
            })[0]
        div.appendChild(h2)
        return div
    }

    linkItems.forEach(link => {
        const article = link.firstElementChild
        const id = +article.dataset.id
        const title = link.querySelector('h2 a').text

        const thinbar = createThinBar(title, () => {
            unsetHidden(id)
            $(thinbar).toggle()
            $(article).slideDown("fast")
        });
        $(thinbar).hide()
        link.appendChild(thinbar)

        const diggbox = link.querySelector('.diggbox')
        const ukryjBtn = createButton('ukryj', () => {
            setHidden(id)
            $(article).slideUp('fast', () => $(thinbar).toggle())
        });
        const zakop = diggbox.querySelector('.diggbox > a:nth-of-type(2)')
        diggbox.insertBefore(ukryjBtn, zakop)

        if (hidden.has(id)) {
            $(article).hide()
            $(thinbar).show()
        }
    })

    // fix lazy loading
    document.querySelectorAll('img.lazy').forEach(img => {
        if (!img.dataset.original) return
        img.loading = "lazy"
        img.src = img.dataset.original
    })

    console.log("( ͡° ͜ʖ ͡° )つ──☆*:・ﾟ Wykop Ukrywaczka");
})();