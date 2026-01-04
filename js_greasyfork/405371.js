// ==UserScript==
// @name         submenus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405371/submenus.user.js
// @updateURL https://update.greasyfork.org/scripts/405371/submenus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createMenu() {
        const h3Titles = document.querySelectorAll('h3')
        console.log('h3Titles', h3Titles)
        const titles = []
        h3Titles.forEach((element) => {
            titles.push(element.id)
        })
        console.log('h3Titles', titles)

        const fragment = document.createDocumentFragment()
        const ul = document.createElement('ol')

        ul.setAttribute('class', 'submenu')
        ul.setAttribute('style', 'position: fixed;left: 0;top: 400px;font-size: 14px;')

        titles.map((title) => {
            let li = document.createElement('li')
            let a = document.createElement('a')
            let text = document.createTextNode(title)
            let url = `#${title}`

        a.setAttribute('href', url)
            a.appendChild(text)
            li.appendChild(a)
            fragment.appendChild(li)
        })

        ul.appendChild(fragment)
        document.body.insertBefore(ul, null)
    }

    window.onload = function() {
        createMenu()
    }
    /*     document.addEventListener('DOMContentLoaded', function() {
        console.log('submenu')
        createMenu()
    }) */


})();