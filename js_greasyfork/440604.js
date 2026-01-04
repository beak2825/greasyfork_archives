// ==UserScript==
// @name         JIRA Board Epic Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Helper functions to only see one epic at a time on the board
// @author       cartok
// @match        https://*.atlassian.net/*/boards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440604/JIRA%20Board%20Epic%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/440604/JIRA%20Board%20Epic%20Filter.meta.js
// ==/UserScript==

// TODOs:
// * feature: pulling instead of waiting for the installation
// * feature: better ux, toggleable buttons / radios
// * fix: standalone subtasks are hidden, can epic get detected?

(function() {

    function installEpicToolbar () {
        const toolbar = document.getElementById('epicToolbar')
        if (toolbar) {
            toolbar.remove()
        }

        createEpicToolbar()
    }

    function createEpicToolbar () {
        const container = document.getElementById('ghx-rabid')
        const toolbar = container.querySelector('#ghx-operations')
        const range = document.createRange()

        //   * create styles and container div
        const epicToolbar = range.createContextualFragment(`
            <style>
                #epic-ghx-operations {
                    display: flex;
                    flex-direction: row;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }

                .epic-ghx-button {
                    border: none;
                    padding: 0.5rem;
                    font-weight: 500;
                    background-color: rgba(9, 30, 66, 0.04);
                    color: rgb(66, 82, 110);
                }

                .epic-ghx-button-reset {
                    background-color: #0052cc;
                    color: #fff;
                }
            </style>
            <div id="epic-ghx-operations" />
        `)
        const epicToolbarContainer = epicToolbar.getElementById('epic-ghx-operations')

        //  * get all information required for button rendering
        const epicTasks = getTasks().filter(i => i.querySelector('.ghx-highlighted-field'))
        const visibleEpics = [...new Set(epicTasks.map(i => i.querySelector('.ghx-highlighted-field').textContent))]

        //  * add epic buttons
        visibleEpics.forEach(epic => {
            const buttonFragment = range.createContextualFragment(`
                <button class="epic-ghx-button">${epic}</button>
            `)
            buttonFragment.querySelector('.epic-ghx-button').addEventListener('click', () => setEpicFilter(epic))
            epicToolbarContainer.appendChild(buttonFragment)
        })

        //  * add reset button
        const resetButtonFragment = range.createContextualFragment(`
            <button class="epic-ghx-button epic-ghx-button-reset">Reset</button>
        `)
        resetButtonFragment.querySelector('.epic-ghx-button').addEventListener('click', resetEpicFilter)
        epicToolbarContainer.appendChild(resetButtonFragment)

        container.insertBefore(epicToolbar, toolbar.nextSibling)
    }

    function setEpicFilter (epic) {
        resetEpicFilter()

        //  * filter out all tasks that aren't epic!
        //  * filter out all tasks from epics that are not enabled
        getTasks()
            .filter(i => {
                const epicElement = i.querySelector('.ghx-highlighted-field')
                return !epicElement || epicElement.textContent !== epic
            })
            .forEach(i => {
                i.style.display = 'none'
            })
    }

    function resetEpicFilter () {
        getTasks().forEach(i => {
            i.style.display = null
        })
    }

    function getTasks () {
        return [...document.querySelectorAll('.ghx-wrap-issue > *')]
            .filter(i => !i.classList.contains('ghx-show-old'))
    }

    setTimeout(installEpicToolbar, 1000 * 10)
})();