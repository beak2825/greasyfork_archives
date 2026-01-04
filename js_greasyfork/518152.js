// ==UserScript==
// @name         Greasyfork Stats
// @description  Displays total number of scripts, installs, and version numbers for users on Greasyfork/Sleazyfork.
// @icon         https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png
// @version      1.6
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://greasyfork.org/*/users/*
// @match        https://greasyfork.org/users/*
// @match        https://sleazyfork.org/*/users/*
// @match        https://sleazyfork.org/users/*
// @match        https://greasyfork.org/*/scripts*
// @match        https://greasyfork.org/scripts*
// @match        https://sleazyfork.org/*/scripts*
// @match        https://sleazyfork.org/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518152/Greasyfork%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/518152/Greasyfork%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const style = document.createElement('style');
    style.textContent = `
        .badge {
            border: 1px solid transparent;
            display: inline-block;
            font-size: 0.65em;
            font-weight: 600;
            line-height: 1;
            padding: 0.15em 0.3em;
            text-align: center;
            vertical-align: baseline;
            white-space: nowrap;
            margin-right: 0.5em;
        }
        .badge-js {
            background-color: #efd81d;
            color: #000;
        }
        .badge-css {
            background-color: #254bdd;
            color: #fff;
        }
        .script-version {
            color: #000;
        }
        
        #user-stats {
            color: inherit;
        }
        
        body.no-dark-mode-detected #user-stats,
        body.no-dark-mode-detected #user-stats .text-content,
        body.no-dark-mode-detected #user-stats h3,
        body.no-dark-mode-detected #user-stats p,
        body.no-dark-mode-detected #user-stats strong {
            color: #000 !important;
        }
    `;
    document.head.appendChild(style);
    
    function detectNoDarkModeScript() {
        let darkModeRulesRemoved = true;
        
        for (let i = 0; i < document.styleSheets.length; i++) {
            try {
                const sheet = document.styleSheets[i];
                const rules = sheet.cssRules;
                
                if (!rules) continue;
                
                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.type === CSSRule.MEDIA_RULE && 
                        rule.conditionText.includes('prefers-color-scheme: dark')) {
                        darkModeRulesRemoved = false;
                        break;
                    }
                }
                
                if (!darkModeRulesRemoved) break;
            } catch (e) {
                continue;
            }
        }
        
        if (darkModeRulesRemoved) {
            document.body.classList.add('no-dark-mode-detected');
        } else {
            document.body.classList.remove('no-dark-mode-detected');
        }
    }
    
    function isCssScript(h2Element) {
        const parentLi = h2Element.closest('li[data-script-language]');
        if (parentLi && parentLi.getAttribute('data-script-language') === 'css') {
            return true;
        }
        return h2Element.querySelector('.badge-css') !== null;
    }

    function createBadge(type) {
        const badge = document.createElement('span');
        badge.className = `badge badge-${type}`;
        badge.title = type === 'js' ? 'User script' : 'CSS script';
        badge.textContent = type.toUpperCase();
        return badge;
    }

    function createVersionSpan(version) {
        const versionSpan = document.createElement('span');
        versionSpan.textContent = `v${version}`;
        versionSpan.classList.add('script-version');
        return versionSpan;
    }

    function addBadgeAndVersion(h2Element, version) {
        if (!h2Element) return;

        const scriptLink = h2Element.querySelector('.script-link');
        if (!scriptLink) return;

        const existingVersion = h2Element.querySelector('.script-version');
        const existingBadge = h2Element.querySelector('.badge');
        if (existingVersion) existingVersion.remove();
        if (existingBadge) existingBadge.remove();

        const badgeType = isCssScript(h2Element) ? 'css' : 'js';
        const badge = createBadge(badgeType);
        scriptLink.insertAdjacentElement('afterend', badge);
        
        if (version) {
            const versionSpan = createVersionSpan(version);
            badge.insertAdjacentElement('afterend', versionSpan);
        }
    }

    function appendVersionNumbers() {
        const listItems = document.querySelectorAll('li[data-script-id]');
        if (!listItems || listItems.length === 0) return;
        
        listItems.forEach(listItem => {
            const version = listItem.getAttribute('data-script-version');
            if (!version) return;
            
            const h2 = listItem.querySelector('h2');
            if (h2) {
                addBadgeAndVersion(h2, version);
            }
        });
    }

    function displayVersionNumbers() {
        const headings = document.querySelectorAll('h2 a.script-link');
        headings.forEach(heading => {
            const version = heading.closest('li').getAttribute('data-script-version');
            if (version) {
                addBadgeAndVersion(heading.parentElement, version);
            }
        });
    }

    function displayUserStats() {
        const parseInstallCount = text => parseInt(text.replace(/,/g, '')) || 0;
        
        const scripts = [...document.querySelectorAll('.script-list-total-installs span')]
            .filter(element => !element.textContent.includes('Total installs'));
        
        if (scripts.length === 0) return;
        
        const totalInstalls = scripts.reduce((sum, element) => 
            sum + parseInstallCount(element.textContent), 0);
        
        const statsData = {
            scriptsCount: scripts.length,
            totalInstalls: totalInstalls
        };
        
        if (document.getElementById('user-stats')) return;
        
        const statsElement = document.createElement('section');
        statsElement.id = 'user-stats';
        
        const userDiscussionsElement = document.getElementById('user-discussions');
        if (!userDiscussionsElement) return;
        
        const stylesToCopy = [
            'padding',
            'border',
            'borderRadius',
            'backgroundColor',
            'fontSize',
            'fontFamily',
            'lineHeight'
        ];
        
        const computedStyle = window.getComputedStyle(userDiscussionsElement);
        stylesToCopy.forEach(property => {
            statsElement.style[property] = computedStyle.getPropertyValue(property);
        });
        
        const header = document.createElement('header');
        const headerStyle = window.getComputedStyle(userDiscussionsElement.querySelector('header'));
        header.style.padding = headerStyle.padding;
        header.style.borderBottom = headerStyle.borderBottom;
        
        const h3 = document.createElement('h3');
        h3.textContent = 'Stats';
        const originalH3Style = window.getComputedStyle(userDiscussionsElement.querySelector('h3'));
        h3.style.margin = originalH3Style.margin;
        h3.style.fontSize = originalH3Style.fontSize;
        header.appendChild(h3);
        
        const contentSection = document.createElement('section');
        contentSection.className = 'text-content';
        const originalContentStyle = window.getComputedStyle(userDiscussionsElement.querySelector('.text-content'));
        contentSection.style.padding = originalContentStyle.padding;
        
        const p = document.createElement('p');
        p.innerHTML = `This user has <strong>${statsData.scriptsCount}</strong> script${statsData.scriptsCount !== 1 ? 's' : ''} with <strong>${statsData.totalInstalls.toLocaleString()}</strong> total install${statsData.totalInstalls !== 1 ? 's' : ''}.`;
        contentSection.appendChild(p);
        
        statsElement.appendChild(header);
        statsElement.appendChild(contentSection);
        
        userDiscussionsElement.parentNode.insertBefore(statsElement, userDiscussionsElement.nextSibling);
    }

    function init() {
        detectNoDarkModeScript();
        
        const currentPath = window.location.pathname;
        if (currentPath.includes('/scripts')) {
            appendVersionNumbers();
        } else if (currentPath.includes('/users/')) {
            displayUserStats();
            displayVersionNumbers();
        }
    }

    window.addEventListener('load', () => {
        init();
        setInterval(detectNoDarkModeScript, 1000);
    });
    
    let lastUrl = location.href;
    const observer = new MutationObserver((mutations) => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
        }
        
        const hasRelevantChanges = mutations.some(mutation => 
            [...mutation.addedNodes].some(node => 
                node.nodeType === 1 &&
                (node.matches?.('li[data-script-id]') || 
                 node.querySelector?.('li[data-script-id]') ||
                 node.matches?.('h2') ||
                 node.querySelector?.('h2'))
            )
        );
        
        if (hasRelevantChanges) {
            init();
        }
    });

    function startObserver() {
        const observeTarget = document.querySelector('#browse-script-list, .script-list');
        if (observeTarget) {
            observer.observe(observeTarget, {
                childList: true,
                subtree: true
            });
        } else {
            requestAnimationFrame(startObserver);
        }
    }

    startObserver();
    
    init();
})();