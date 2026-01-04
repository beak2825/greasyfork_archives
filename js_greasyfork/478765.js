// ==UserScript==
// @name         Github notion task id detector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Detect notion task id from default name by git branch
// @author       Yes
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478765/Github%20notion%20task%20id%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/478765/Github%20notion%20task%20id%20detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPrTitleEl() {
        return document.getElementById('pull_request_title')
    }

    setInterval(function() {
        const prTitle = getPrTitleEl()

        if (!prTitle) return

        const prTitleText = prTitle.value

        const match = prTitleText.match(/(Tas \d+?) (.*)/i)
        if (match) {
            let notionId = match[1].split(' ')

            notionId = `[${notionId[0].toUpperCase()}-${notionId[1]}]`

            prTitle.value = `${notionId} ${match[2]}`
        }
    }, 1000);

    setInterval(function() {
        const prTitleHeader = document.getElementById('pull_request_title_header')

        if (!prTitleHeader) return

        if (prTitleHeader.querySelector('.add-prefix-btn')) return

        const branch = document.getElementById('head-ref-selector')?.querySelector('.css-truncate')?.innerText

        if (!branch) return

        const match = branch.match(/tas-(\d+?)-/i)

        if (match) {
            const addPrefixBtn = document.createElement("button");
            const prefix = `[TAS-${match[1]}]`
            addPrefixBtn.innerText = `Add ${prefix}`
            addPrefixBtn.setAttribute('type', 'button')
            addPrefixBtn.classList.value = 'add-prefix-btn Button Button--secondary Button--small'
            addPrefixBtn.style.marginLeft = '10px'
            addPrefixBtn.addEventListener('click', () => {
                const el = getPrTitleEl()
                el.value = `${prefix} ${el.value}`
            })
            prTitleHeader.appendChild(addPrefixBtn)
        }
    }, 1000);
})();
