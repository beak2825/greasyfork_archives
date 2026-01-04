// ==UserScript==
// @name         Jenkins - Redirect Native UI to Blue Ocean
// @namespace    https://greasyfork.org/en/scripts?by=1388261
// @version      1.1
// @description  Redirect the native Jenkins UI to Blue Ocean
// @author       nate.clark@hear.com
// @match        https://jenkins.audibene.net/job/*/job/*/job/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=audibene.net
// @tag          productivity
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514727/Jenkins%20-%20Redirect%20Native%20UI%20to%20Blue%20Ocean.user.js
// @updateURL https://update.greasyfork.org/scripts/514727/Jenkins%20-%20Redirect%20Native%20UI%20to%20Blue%20Ocean.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const shouldConfirm = (window.localStorage.getItem('AUTO_REDIRECT') ?? 'false').toLowerCase() === 'false'
    const url = window.location.href
    const parameterizedUrl = "https://jenkins.audibene.net/blue/organizations/jenkins/:organizationId%2F:repo/detail/:pr/:run/pipeline/";

    const regex = /https:\/\/jenkins\.audibene\.net\/job\/(?<organizationId>[^\/]+)\/job\/(?<repo>[^\/]+)\/job\/(?<pr>[^\/]+)\/(?<run>[^\/]+)\/pipeline-graph\//;

    const match = url.match(regex);

    if (match) {
        const { organizationId, repo, pr, run } = match.groups;

        const hydratedUrl = parameterizedUrl
        .replace(':organizationId', organizationId)
        .replace(':repo', repo)
        .replace(':pr', pr)
        .replace(':run', run);

        if (!shouldConfirm) {
            const div = document.createElement('div')

            div.style.position = 'fixed'
            div.style.backgroundColor = '#ffffffee'
            div.style.display = 'grid'
            div.style.gap = '0.5rem'
            div.style.placeContent = 'center'
            div.style.top = 0
            div.style.bottom = 0
            div.style.left = 0
            div.style.padding = '1rem'
            div.style.right = 0
            div.style.zIndex = 9999
            div.style.transition = 'all 0.3s'

            const text = document.createElement('div')

            text.innerText = 'Redirecting to Blue Ocean...'

            div.appendChild(text)

            const button = document.createElement('button')

            const timeout = setTimeout(() => {
               window.location.href = hydratedUrl
            }, 1_500)

            button.onclick = () => {
                clearTimeout(timeout)
                div.style.opacity = 0

                setTimeout(() => {
                    div.remove()
                }, 300)
            }

            button.innerText = 'Cancel'

            div.appendChild(button)
            document.body.appendChild(div)
            button.focus()
        } else if (confirm('Redirect to Blue Ocean?')) {
            window.location.href = hydratedUrl;
        }
    } else {
        console.log("No match found");
    }
})();