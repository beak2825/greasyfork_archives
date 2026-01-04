// ==UserScript==
// @name         JIRA Create Branch Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a shortcut to create a branch name from a ticket and adds it to the clipboard. Usage: [Control] + [Alt] + Click on a ticket on the board.
// @author       cartok
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/440605/JIRA%20Create%20Branch%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/440605/JIRA%20Create%20Branch%20Name.meta.js
// ==/UserScript==
(function() {
    const DELIMITER = '-'

    const itemQueries = {
        sprintItem: target => {
            const wrapper = target.closest('.ghx-issue')
            if(!wrapper){
                console.warn('[user-script] Could not find ticket wrapper on sprint board')
                return
            }

            const prefix = (() => {
                const element = wrapper.querySelector('.ghx-highlighted-field')
                // not every task is related to an epic
                if(!element) return 'feature'
                return element.textContent.trim().toLowerCase().replace(/\s+/g, '-')
            })()

            const id = (() => {
                const element = wrapper.querySelector('a.ghx-key')
                if(!element) console.warn(`[user-script] Could not find ticket's issue key element`)
                return wrapper.querySelector('a.ghx-key').href.replace(/.*\/(.*)$/, '$1')
            })()

            const name = (() => {
                const element = wrapper.querySelector('.ghx-summary')
                if(!element) console.warn(`[user-script] Could not find ticket's summary element`)
                return element.textContent.trim().toLowerCase()
            })()

            return { prefix, id, name }
        },
        backglogItem: target => {
            const wrapper = target.closest('.js-issue')
            if(!wrapper){
                console.warn('[user-script] Could not find ticket wrapper on backlog')
                return
            }

            const prefix = (() => {
                const element = wrapper.querySelector('.ghx-label[data-epickey]')
                // not every task is related to an epic
                if(!element) return 'feature'
                return element.textContent.trim().toLowerCase().replace(/\s+/g, '-')
            })()

            const id = (() => {
                const element = wrapper.querySelector('a.ghx-key')
                if(!element) console.warn(`[user-script] Could not find ticket's issue key element`)
                return element.href.replace(/.*\/(.*)$/, '$1')
            })()

            const name = (() => {
                const element = wrapper.querySelector('.ghx-summary')
                if(!element) console.warn(`[user-script] Could not find ticket's summary element`)
                return element.textContent.trim().toLowerCase()
            })()

            return { prefix, id, name }
        }
    }

    function toBranchName ({ prefix, id, name }) {
        name = name
            .replace(/^(\[.*?\])/m, '')
            .replace(/^[^\w]+/, '')
            .replace(/[^\w]+$/, '')
            .replace(/[^\w]+/g, DELIMITER)

        return `${prefix}/${id}-${name}`
    }

    document.addEventListener('click', async event => {
        event.stopPropagation()
        if(event.ctrlKey && event.altKey){
            event.preventDefault()
        }


        // first check targets, do not override any other possible bindings
        const queryResults = Object.values(itemQueries).map(query => query(event.target)).find(Boolean)
        if(!queryResults || !event.ctrlKey || !event.altKey) return

        // do not open the ticket in a new tab when clicking on the link
        event.preventDefault()

        const branchName = toBranchName(queryResults)
        await navigator.clipboard.writeText(branchName)
        console.log(`[user-script] Branchname '${branchName}' copied to clipboard`)
    }, false)
})();

