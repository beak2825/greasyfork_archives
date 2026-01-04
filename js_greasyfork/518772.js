// ==UserScript==
// @name         github first commit
// @license MIT
// @namespace    http://tampermonkey.net/fuckkkkker
// @version      2024-08-16
// @description  github第一个commit
// @author       fuckkkkker
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518772/github%20first%20commit.user.js
// @updateURL https://update.greasyfork.org/scripts/518772/github%20first%20commit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function first() {
        var latestCommit = document.querySelector('[data-hovercard-url].Link--secondary[data-pjax]').href.split('/').slice(-1)[0]
        var commitTotalCount = parseInt(document.querySelector('span.fgColor-default').innerText.replace('Commits', '').replace(',', ''))
        var currentBranchName = document.querySelector('.Box-sc-g0xbh4-0.bmcJak.prc-Text-Text-0ima0').innerText.trim()

        var url = `https://github.com/${location.href.split('.com')[1]}/commits/${currentBranchName}?after=${latestCommit}+${commitTotalCount - 10}`

    var ulElement = document.querySelectorAll('.pagehead-actions.flex-shrink-0.d-none.d-md-inline')[0]

    var li = document.createElement('li')
    li.style = `
    height: 100%;
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
`

    var a1 = document.createElement('a')
    a1.innerText = '最后一个commit'
        a1.href = url
        a1.target = '_blank'

        li.appendChild(a1)
        ulElement.insertBefore(li, ulElement.firstChild)
    }

    window.onload = function () {
        setTimeout(first, 2000)
    }
})();