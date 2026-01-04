// ==UserScript==
// @name         Default Zoom Name Override
// @namespace    Hans5958
// @version      1.0.0
// @description  Set your default name that will override your name on the Zoom aplication. Useful in some cases. Set up by going to https://zoom.us/j/ (or any join link), and click the "Default Name" on the top.
// @author       Hans5958
// @license      MIT
// @match        https://zoom.us/join
// @match        https://*.zoom.us/join
// @match        https://zoom.us/j/*
// @match        https://*.zoom.us/j/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444659/Default%20Zoom%20Name%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/444659/Default%20Zoom%20Name%20Override.meta.js
// ==/UserScript==

var frame = document.createElement('div');

function ready(fn) {
    if (document.readyState !== 'loading'){
        fn()
    } else {
        document.addEventListener('DOMContentLoaded', fn)
    }
}

GM_config.init({
    id: "default-name-zoom",
    fields: {
        name: {
            'label': 'Name',
            'type': 'text',
            'default': ''
        }
    },
    frame: frame,
	events: {
		save: () => {
            var search = new URLSearchParams(document.location.search)
            search.set('uname', GM_config.get('name'))
            if (document.location.search !== ("?" + search.toString())) document.location.search = search.toString()
        }
	}
})

ready(() => {
    document.body.appendChild(frame);

    var navItem

    if (document.querySelector('.navbar-right')) {
        navItem = document.querySelector('.navbar-right').firstElementChild.cloneNode(true)
        navItem.firstElementChild.attributes.removeNamedItem("tracking-id")
        navItem.firstElementChild.attributes.removeNamedItem("tracking-category")
        navItem.firstElementChild.href = "javascript:void"
        delete navItem.firstElementChild.dataset.onEvent
        document.querySelector('.navbar-right').prepend(navItem)
        navItem.firstElementChild.textContent = "DEFAULT NAME"
    } else {
        navItem = document.createElement('a')
        var intervalo = setInterval(() => {
            if (!document.querySelector('.action-btns')) return
            clearInterval(intervalo)
            document.querySelector('.action-btns').firstElementChild.style.marginLeft = "24px"
            document.querySelector('.action-btns').prepend(navItem)
        }, 100)
        navItem.textContent = "Default Name"
        navItem.href = "#"
    }

    navItem.addEventListener('click', event => {
        GM_config.open()
        event.preventDefault()
    })
    document.querySelector('.navbar-right').prepend(navItem)
})


var search = new URLSearchParams(document.location.search)
if (!search.get('uname') && GM_config.get('name')) {
    search.set('uname', GM_config.get('name'))
    document.location.search = search.toString()
}