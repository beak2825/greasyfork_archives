// ==UserScript==
// @name         Jenkins - Compare Before Promoting
// @namespace    https://greasyfork.org/en/scripts?by=1388261
// @version      2.2
// @description  Jenkins proceed button gated by branch comparison
// @author       barry.bankhead@hear.com
// @match        https://jenkins.audibene.net/blue/organizations/jenkins/*/detail/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audibene.net
// @tag          productivity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514729/Jenkins%20-%20Compare%20Before%20Promoting.user.js
// @updateURL https://update.greasyfork.org/scripts/514729/Jenkins%20-%20Compare%20Before%20Promoting.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isDebug = Boolean(sessionStorage.getItem('debug'))
    let hasCompared = false
    let interval = undefined

    const nextEnvironmentMap = {
        develop: 'candidate',
        candidate: 'master'
    }

    const log = (...args) => {
        if (!isDebug) {
            return
        }

        console.log(...args)
    }

    const getRouteParams = () => {
        const regex = /\/jenkins\/(?<organizationId>[^%]+)%2F(?<repo>[^\/]+)\/detail\/(?<lowerEnvironment>[^\/]+)\//iug;
        const match = regex.exec(window.location.href);

        if (!match?.groups) {
            log('Href does not match regex', window.location.href)
            return undefined
        }

        const routeParams = {...match.groups};

        log('Current route params...', routeParams)

        return routeParams
    }

    const openComparisonTab = ({ lowerEnvironment, organizationId, repo, run }) => {
        const targetUrl = new URL('https://github.com/:organizationId/:repo/compare/:nextEnvironment...:lowerEnvironment')

        const href = targetUrl
        .href
        .replace(':lowerEnvironment', lowerEnvironment)
        .replace(':organizationId', organizationId)
        .replace(':nextEnvironment', nextEnvironmentMap[lowerEnvironment])
        .replace(':repo', repo)

        window.open(href, '_compare');
    }

    const addMiscStyles = () => {
        const content = document.querySelector('.inputBody')

        if (!content) {
            log('.inputBody not found', `document.querySelector('.inputBody')`)
            return
        }

        content.style.textAlign = 'center';

        [...(content.querySelectorAll('button') ?? [])].forEach((button) => {
            button.style.marginTop = 0
        })
    }

    const main = () => {
        if (hasCompared) {
            clearInterval(interval)
            return
        }

        const isPromotionSelected = Boolean(document.querySelector('[title="Approval: Code Promotion"]')?.classList?.contains('selected'))

        if (!isPromotionSelected) {
            log('Code promotion approval not found', `document.querySelector('[title="Approval: Code Promotion"]')?.classList?.contains('selected')`)
            return
        }

        const containerEl = document.querySelector('.inputControl')

        if (!containerEl) {
            log('Call to action section not found', `document.querySelector('.inputControl')`)
            return
        }

        const proceedButtonEnablement = (isEnabled) => {
            const proceedButton = containerEl.querySelector('.inputStepSubmit')

            if (!proceedButton) {
                log('Proceed button not found', `document.querySelector('.inputStepSubmit')`)
                return
            }

            if (isEnabled) {
                proceedButton.style.removeProperty('display')
            } else {
                proceedButton.style.display = 'none'
            }
        }

        const compareButtonEnablement = (isEnabled) => {
            const existingButton = containerEl.querySelector('button[data-x="compare"]')
            const routeParams = getRouteParams()

            if (existingButton) {
                log('Compare button found, nothing to do')

                if (!isEnabled) {
                    containerEl.removeChild(existingButton)
                }

                return
            }

            const button = document.createElement('button')

            button.textContent = `Compare to ${nextEnvironmentMap[getRouteParams()?.lowerEnvironment]}`
            button.dataset.x = 'compare'
            button.classList.add('btn', 'result-bg', 'success')
            button.style.border = '1px solid #8cc04f'

            button.addEventListener('click', () => {
                const params = getRouteParams()

                if (!params) {
                    return
                }

                openComparisonTab(params)
                hasCompared = true
                compareButtonEnablement(false)
                proceedButtonEnablement(true)
            })

            containerEl.prepend(button)
        }

        addMiscStyles()
        compareButtonEnablement(true)
        proceedButtonEnablement(false)
    }

    try {
        main()
    } catch {}
    interval = setInterval(main, 100)
})();
