// ==UserScript==
// @name         Github Markdown 文件内容导航（fork）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Provide directory navigation of the markdown file content of the github website.
// @author       rod
// @match        http*://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418647/Github%20Markdown%20%E6%96%87%E4%BB%B6%E5%86%85%E5%AE%B9%E5%AF%BC%E8%88%AA%EF%BC%88fork%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/418647/Github%20Markdown%20%E6%96%87%E4%BB%B6%E5%86%85%E5%AE%B9%E5%AF%BC%E8%88%AA%EF%BC%88fork%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const log = console.log

    /* ------------------------------- Init ----------------------------- */

    const href = location.href
    const matchRepository = /https?:\/\/github.com\/.+\/.+/

    const isRepositoryPage = !!href.match(matchRepository)

    /* ------------------------------- Parse MarkDown file content navigation ----------------------------- */

    function updateMarkdownFileContentNavigation() {
        let navBarElem = document.querySelector('.wang1212_md-content-nav')

        // Remove existing
        navBarElem && navBarElem.remove()

        const rootElem = document.querySelector('.markdown-body')
        if (!isRepositoryPage || !rootElem) return

        // navBar button
        navBarElem = document.createElement('div')
        navBarElem.classList.add('wang1212_md-content-nav')
        navBarElem.title = 'Markdown 文件内容导航'

        navBarElem.innerText = 'N'

        // Panel
        const navBarPanelElem = document.createElement('div')
        navBarPanelElem.classList.add('wang1212_md-content-nav_panel')

        navBarPanelElem.innerHTML = ''

        // titles
        const titles = getMarkDownContentTitles(rootElem)
        if (!titles.length) return

        titles.forEach(title => {
            const level = +title.tagName.substr(-1)
            navBarPanelElem.innerHTML += `
<p class="wang1212_md-content-nav_to-anchor" style="font-size: ${1 - ((level - 1) * 0).toFixed(2)}rem; margin: 0; padding-left: ${((level - 1) * 0.5).toFixed(2)}rem" data-anchor="${title.anchorId}">
${title.text}
</p>
`
        })

        // --- CSS Style ---
        const styleElem = document.createElement('style')
        styleElem.type = 'text/css'
        styleElem.innerHTML = `
.wang1212_md-content-nav {
position: fixed;
right: 1rem;
bottom: 3.5rem;
z-index: 999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
.wang1212_md-content-nav_panel {
position: absolute;
right: 0;
bottom: 2rem;
display: block;
width: 20rem;
height: 75vh;
padding: 0.5rem;
overflow: auto;
color: #666666;
text-align: left;
background: white;
box-shadow: rgba(0, 0, 0, 0.25) 0 0 0.5rem 0;
}
.wang1212_md-content-nav_to-anchor:hover {
	color: rgb(0, 0, 0);
}
`

        navBarElem.appendChild(navBarPanelElem)
        document.body.appendChild(navBarElem)
        document.head.appendChild(styleElem)

        // --- Event ---
        // Show/Hide
        navBarElem.addEventListener("click", (e) => {
            if (e.target !== navBarElem) return

            if (navBarPanelElem.style.display === 'none') {
                navBarPanelElem.style.display = 'block'
            } else {
                navBarPanelElem.style.display = 'none'
            }
        }, false)

        // fly to view
        navBarPanelElem.addEventListener("click", (e) => {
            if (!e.target.classList.contains('wang1212_md-content-nav_to-anchor')) return

            const anchorElem = document.getElementById(e.target.dataset.anchor)
            if (!anchorElem) return

            anchorElem.scrollIntoView({ behavior: "smooth" })
        }, false)
    }

    /* ------------------------------- To Top ----------------------------- */

    // to top button
    function updateGoToTopButton() {
        let toTopElem = document.querySelector('.wang1212_to-top')

        // Remove existing
        toTopElem && toTopElem.remove()

        // toTop button
        toTopElem = document.createElement('div')
        toTopElem.classList.add('wang1212_to-top')
        toTopElem.title = '回到顶部'

        toTopElem.innerText = '↑'


        // --- CSS Style ---
        const styleElem = document.createElement('style')
        styleElem.type = 'text/css'
        styleElem.innerHTML = `
.wang1212_to-top {
position: fixed;
right: 1rem;
bottom: 1rem;
z-index: 999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
`

        document.body.appendChild(toTopElem)
        document.head.appendChild(styleElem)

        // --- Event ---
        // fly to view
        toTopElem.addEventListener("click", () => {
            document.body.scrollIntoView({ behavior: "smooth" })
        }, false)
    }

    /* ------------------------------- Utils ----------------------------- */

    // parse titles
    function getMarkDownContentTitles(rootElem) {
        const anchors = rootElem.querySelectorAll('a.anchor')

        if (!anchors.length) return

        const titles = []

        anchors.forEach((elem) => {
            const parentElem = elem.parentElement

            titles.push({
                tagName: parentElem.tagName,
                text: parentElem.textContent,
                anchorId: elem.id,
            })
        })

        return titles
    }

    /* ------------------------------- Load ----------------------------- */

    function load() {
        updateMarkdownFileContentNavigation()
        updateGoToTopButton()
    }

    // Monitor page reload
    document.addEventListener("pjax:end", load, false)

    //
    load()

})();