// ==UserScript==
// @name         Road 2 Riches QOL
// @namespace    http://tampermonkey.net/
// @version      2024-08-10
// @description  Saves checked planets so that you don't lose your progress! Also makes checkboxes bigger.
// @author       You
// @match        https://www.spansh.co.uk/riches/results/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spansh.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503219/Road%202%20Riches%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/503219/Road%202%20Riches%20QOL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleEl = document.createElement('style')
    styleEl.innerText = `
table input[type=checkbox] {
    border-top: solid 0.2em;
    width: 1.3em;
    height: 1.6em;
    border-radius: 7px;
    overflow: hidden;
    accent-color: red;
    display: block;
}
    `
    document.head.appendChild(styleEl)

    const init = (table) => {
        console.log('Initializing table', table)
        const inputs = table.querySelectorAll("input[type=checkbox]")
        let checked_memory = JSON.parse(localStorage.getItem("checked_memory") || '[]')
        console.log('Memory:', checked_memory)
        inputs.forEach(input => {
            const planet = input.parentElement.parentElement.querySelector('td:nth-child(3)').innerText

            if (checked_memory.includes(planet) && !input.checked) {
                input.checked = true
            }

            input.addEventListener('click', e => {
                if (e.target.checked) {
                    checked_memory.push(planet)
                } else {
                    checked_memory = checked_memory.filter(p => p !== planet)
                }

                localStorage.setItem('checked_memory', JSON.stringify(checked_memory))
            })
        })

        table.classList.add('processed')
    }

    const checkForTable = () => {
        const table = document.querySelector('table')
        if (table && !table.classList.contains('processed')) {
            init(table)
        }
    }


    setInterval(checkForTable, 1000)
})();