// ==UserScript==
// @name         Pawoo batch follow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pawoo.net/users/*/following*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373062/Pawoo%20batch%20follow.user.js
// @updateURL https://update.greasyfork.org/scripts/373062/Pawoo%20batch%20follow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let FollowAll = async () => {
        const userNodes = document.querySelectorAll('.pawoo-follow__button__link')
        const userLinks = []
        userNodes.forEach(x => {
            const link = x.getAttribute('href')
            userLinks.push(link)
        })
        const notflows = userLinks.filter(x => x.endsWith('/follow'))
        const csrfToken = document.querySelector('meta[name=csrf-token]').getAttribute('content')
        const q = notflows.map(url => {
            return fetch(url, {
                method: 'POST',
                body: `_method=post&authenticity_token=${encodeURIComponent(csrfToken)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
        })
        await Promise.all(q)
        alert('batch follow finish')
        return false
    }

    const AppendBtn = () => {
        const dropDown = document.querySelector('.pawoo-follow__dropdown')
        const li = document.createElement('li')
        li.setAttribute('class', 'dropdown-menu__item')

        const a = document.createElement('a')
        a.addEventListener('click', FollowAll)
        a.innerText = 'Follow this page'
        li.appendChild(a)
        dropDown.appendChild(li)

    }
    AppendBtn()
})();