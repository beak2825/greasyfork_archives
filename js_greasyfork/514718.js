// ==UserScript==
// @name         GitHub - Pull Request - Open external status links externally
// @namespace    http://hear.com
// @version      1.10
// @description  Open external links in the "Checks" section in a new tab 
// @author       nate.clark@hear.com
// @match        https://github.com/*/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @tag          productivity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514718/GitHub%20-%20Pull%20Request%20-%20Open%20external%20status%20links%20externally.user.js
// @updateURL https://update.greasyfork.org/scripts/514718/GitHub%20-%20Pull%20Request%20-%20Open%20external%20status%20links%20externally.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nonGitHubTextKeys = ['sonarqube']
    const getRowText = (link) => link.parentNode.closest('.merge-status-item')?.innerText ?? link.parentNode.closest('.Box-row')?.innerText ?? ''

    const isSonarQubeLink = (link) => {
        const text = getRowText(link)

        return text.toLowerCase().indexOf('sonarqube') > -1
    }

    const isNotGitHubLink = (link) => {
        const href = link.getAttribute('href')
        const text = getRowText(link)
        const isNonGitHub = href.startsWith('/') === false || nonGitHubTextKeys.some((key) => text.toLowerCase().indexOf(key.toLowerCase()) > -1)

        isNotGitHubLink && console.log('isNotGitHubLink', { link, href, text, isNonGitHub })

        return isNonGitHub
    }

    const hasNoTarget = (link) => link.hasAttribute('target') === false
    const hasDetailsText = (link) => link.textContent === 'Details'

    const updateSonarQubeLink = (link) => {
        const pathnameParts = window.location.pathname.split('/')
        const repo = pathnameParts.at(2)
        const pullRequest = pathnameParts.at(4)
        const url = new URL('https://sonarqube.service-production.audibene.net/dashboard')

        url.searchParams.set('id', repo)
        url.searchParams.set('pullRequest', pullRequest)
        link.setAttribute('href', url.href)
    }

    const makeLinkExternal = (link) => {
        link.setAttribute('target', '_blank')
        link.innerHTML = `<span>Details</span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2m6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03L9.28 7.78a.75.75 0 0 1-1.042-.018a.75.75 0 0 1-.018-1.042l3.75-3.75l-1.543-1.543A.25.25 0 0 1 10.604 1"/></svg>`
        link.style.display = 'grid'
        link.style.alignItems = 'center'
        link.style.gap = '0.25rem'
        link.style.gridAutoFlow = 'column'

        if (isSonarQubeLink(link)) {
            updateSonarQubeLink(link)
        }
    }

    const setLinkTargets = () => {
        const allLinks = [...document.querySelectorAll('.merge-status-item a'), ...document.querySelectorAll('.Details-content--hidden * a')]
        const links = [...allLinks].filter(hasNoTarget).filter(hasDetailsText).filter(isNotGitHubLink)

        links.forEach(makeLinkExternal)
    }

    // Because when a build is running, these links are constantly updated/refreshed
    setInterval(setLinkTargets, 500)
})();