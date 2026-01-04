// ==UserScript==
// @name         Playground Links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds links to our playgrounds and jira tickets to the PR title.
// @author       https://github.com/cgriebel
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448062/Playground%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/448062/Playground%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function onLocationChange() {
        initPr();
        initCompare();
        initCreatePr();
    }

    function initCompare() {
        if (!/RogerAI\/.*\/compare\//.test(window.location.pathname)) return;
        compare.addJiraLinks();
    }

    function initPr() {
        if (!/RogerAI\/.*\/pull\/\d/.test(window.location.pathname)) return;
        pr.addJiraLink();
        pr.addPlaygroundLink();
        pr.addPlaygroundTicketLinks();
    }

    function initCreatePr() {
        if (!/RogerAI\/.*\/compare\//.test(window.location.pathname)) return;
        const header = document.querySelector('.compare-pr-header.Subhead h1')
        if (header?.textContent !== 'Open a pull request' || header.getAttribute('data-cg-init')) return;
        createPr.addJiraTag();
        createPr.assignSelf();
        header.setAttribute('data-cg-init', true)
    }

    const jiraRegex = /\[([A-Za-z]+\-\d+)\]/;
    const matchToJiraLink = match => `https://roger-team.atlassian.net/browse/${match[1]}`;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const compare = {
        addJiraLinks() {
            var loading = document.querySelector('[aria-label="Loading Commits"]');
            if (loading) {
                setTimeout(compare.addJiraLinks, 20);
                return;
            }

            const rowNodes = [...document.querySelectorAll('.js-commits-list-item')]
            rowNodes.forEach(row => {
                const titleElem = row.querySelector('.js-details-container.Details > p');

                console.log(titleElem)
                const title = titleElem.textContent;
                const match = title.match(jiraRegex);
                if (!match) return;
                const link = matchToJiraLink(match);
                console.log(link)
                const button = document.createElement('div');
                button.setAttribute("class", "d-inline-block")
                button.innerHTML = `<a href="${link}" target="_blank">Jira</a>`

                const actions = row.children[1];
                actions.insertBefore(button, actions.children[0])
            })
        }
    }

    const pr = {
        replaceSegment(reg, buildLink) {
            const titleElement = document.querySelector('.gh-header-title .js-issue-title');
            if (!titleElement) return;
            const titleNodes = [...titleElement.childNodes];

            const sanitizedText = titleNodes
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent)
                .join(" ");

            if (!sanitizedText.match(reg)?.length) return;

            const newNodes = titleNodes.reduce((acc, n) => {
                const titleText = n.textContent;
                const match = titleText.match(reg);
                if (n.nodeType === Node.TEXT_NODE && match?.length) {
                    var parts = titleText.split(match[0]);
                    acc.push(document.createTextNode(parts[0]))
                    var link = document.createElement('a');
                    link.setAttribute("target", "_blank")
                    link.text = match[0]
                    link.setAttribute("href", buildLink(match));
                    acc.push(link);
                    if (parts[1]) {
                        acc.push(document.createTextNode(parts[1]))
                    }
                } else {
                    acc.push(n);
                }
                return acc;
            }, [])

            titleNodes.forEach(n => titleElement.removeChild(n));
            newNodes.forEach(n => titleElement.appendChild(n));
        },
        addPlaygroundLink() {
            const prNumber = document.querySelector('.gh-header-title .f1-light').textContent.replace('#', '');
            pr.replaceSegment(/\[playground\]/i, match => {
                let site = "";
                if(window.location.pathname.includes("roger-admin"))
                {
                    site = "-admin";
                }
                return `https://pr-${prNumber}${site}.playgrounds.corpayone.com`
            });
        },
        addJiraLink() {
            pr.replaceSegment(jiraRegex, matchToJiraLink);
        },
        addPlaygroundTicketLinks() {
            const prefixes = {
                "admin": "roger-admin",
                "api": "Roger-Backend",
                "data-entry": "roger-data-entry",
                "economic": "roger-apps-economic",
                "identity": "roger-identity",
                "ripe": "ripe",
                "web": "Roger-Web",
            };

            const prefixReg = Object.keys(prefixes).join("|");
            const regex = new RegExp(`\\[((${prefixReg}):pull\\-(\\d+))\\]`);
            pr.replaceSegment(regex, match => `https://github.com/RogerAI/${prefixes[match[2]]}/pull/${match[3]}`);
        }
    }

    const createPr = {
        addJiraTag() {
            const sourceBranch = document.querySelector('#head-ref-selector .Button-label span').textContent;
            const match = sourceBranch.match(/([a-zA-Z]+)\/([A-Z]+\-\d+)/);;
            if (!match) return;
            console.log("Add Jira Tag")
            const branchType = match[1];
            const ticketId = match[2];
            const ticketTag = `[${ticketId}]`;
            const titleElem = document.querySelector('#pull_request_title');
            const title = titleElem.value;
            const titleTicketId = ticketId.replace('-', ' ');
            let titleMsg = title.replace(RegExp(`${branchType}/${titleTicketId} `, 'i'), '');

            // avoid duplicates from a refresh
            titleMsg = titleMsg.replaceAll(`${ticketTag} `, '');
            titleMsg = capitalizeFirstLetter(titleMsg);
            titleElem.value = `${ticketTag} ${titleMsg}`;
        },
        assignSelf() {
            var assignSelfBtn = document.querySelector('.js-issue-assign-self')
            assignSelfBtn?.click()
        }
    }

    function initialize() {
        console.log("Initializing Playground Link Script");
        let oldPushState = history.pushState;
        history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        let oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', function () {
            onLocationChange();
        });

        initPr();
        setInterval(() => initPr(), 250);
        setInterval(() => initCreatePr(), 250);
    }

    initialize();
})();