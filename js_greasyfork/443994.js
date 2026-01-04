// ==UserScript==
// @name         Narrow HDBits
// @namespace    club.porcupine.gm_scripts.narrow_hdbits
// @version      1
// @description  Help HDBits fit on narrower screens
// @author       Sam Birch
// @license      MIT
// @icon         https://icons.duckduckgo.com/ip2/hdbits.org.ico
// @match        https://hdbits.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443994/Narrow%20HDBits.user.js
// @updateURL https://update.greasyfork.org/scripts/443994/Narrow%20HDBits.meta.js
// ==/UserScript==
(function() {
    'use strict'

    let sidebar_container = document.querySelector('#sidebar-container')
    let headers = sidebar_container.querySelectorAll('TABLE > TBODY > TR > TD > H2')
    let bodies = sidebar_container.querySelectorAll('TABLE > TBODY > TR > TD > TABLE')

    sidebar_container.remove()

    let new_tr = document.createElement('TR')
    for (let i = 0; i < headers.length; i++) {
        let new_td = document.createElement('TD')
        new_td.className = 'embedded'
        new_td.append(headers[i])
        new_td.append(bodies[i])
        new_tr.append(new_td)
    }

    let new_tbody = document.createElement('TBODY')
    new_tbody.append(new_tr)

    let new_table = document.createElement('TABLE')
    new_table.className = 'main'
    new_table.append(new_tbody)

    let new_div = document.createElement('DIV')
    new_div.id = 'horizontal-sidebar-container'
    new_div.append(new_table)

    document.querySelector('.footer').before(new_div)

    const stylesheet = document.createElement('style')
    stylesheet.innerHTML = `
        #horizontal-sidebar-container { min-width: 800px; max-width: 1060px; margin: auto }
        #horizontal-sidebar-container > table { width: 100%; table-layout: fixed }
        #horizontal-sidebar-container > table > tbody > tr > td { vertical-align: top }
    `
    document.head.append(stylesheet)
}())
