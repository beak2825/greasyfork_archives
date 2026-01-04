// ==UserScript==
// @name         github-repo-info
// @name:zh-CN   github显示仓库信息
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add ⌛creation date/🍴forks/📁 repo size to repo search result page,code search page and repo detail page.
// @description:zh-cn 向仓库搜索页，代码搜索页，仓库主页添加 ⌛创建时间/🍴fork数/📁文件大小显示
// @author       CXXN008
// @match        *://github.com/*/*
// @match        *://github.com/search*
// @source       https://github.com/CXXN008/github-repo-info
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454702/github-repo-info.user.js
// @updateURL https://update.greasyfork.org/scripts/454702/github-repo-info.meta.js
// ==/UserScript==

'use strict';
// github free rates are limited to 5000 requests / hour ,if u get some errors in console , try https://github.com/settings/tokens -> Generate new token & paste here
const API_TOKEN = atob('.')
const PARAMS = {
    "headers": {
        "authorization": `token ${API_TOKEN}`,
    }
}
const FORKS_PAGESIZE = 50
const STYLE = ``
const CLICKABLESPANSTYLE = 'background-color:#000;color:#0f0;cursor:help'

const PAGE_SELECTOR = { 'search': 'li.repo-list-item> div > div> div > a.v-align-middle', 'repo': 'strong.mr-2 > a:nth-child(1)', 'code': '.Link--secondary' }

let hasLoaded = false

const appendForksList = async (href) => {

    let forksList = document.querySelector('#forks-list') 
    if (forksList ===null) {
        forksList = document.createElement('span')
        forksList.id = 'forks-list'
        forksList.style.cssText = `background-color:#0000003f;position:absolute;left:0;top:60px;color:#0f0;z-index:9999`
    }

    forksList.innerHTML = `🍴${href.slice(1)}'s forks(sorted by star counts ↓)<br>Loading ... ...`
    const forksJ = (await (await fetch(`https://api.github.com/repos${href}/forks?per_page=${FORKS_PAGESIZE}&sort=stargazers`, PARAMS)).json())
    let forksHTML = ''
    forksJ.forEach(forkJ => forksHTML += `<a href=${forkJ.html_url}>💻${forkJ.full_name}/⌛${forkJ.created_at.split('T')[0]}/⭐${forkJ.stargazers_count}/🍴${forkJ.forks_count}</a><br>`)

    forksList.innerHTML = forksList.innerHTML.replace('Loading ... ...',forksHTML)
    document.body.insertAdjacentElement('afterbegin',forksList)
}

const getPageType = (urlParams) => {
    const q = urlParams.get("q")?.toLocaleLowerCase();
    const type = urlParams.get("type")?.toLocaleLowerCase();
    if (q) {
        if (type === 'code') {
            return 'code'
        } else {
            return 'search'
        }
    } else {
        return 'repo'
    }
}

const fireUp = () => {

    //replace date
    //const engDate = document.querySelector('relative-time')
    //engDate.textContent = engDate.getAttribute('datetime')


    // console.log(c)


    const pageType = getPageType(new URLSearchParams(location.search))
    // console.log(pageType)
    document.querySelectorAll(PAGE_SELECTOR[pageType]).forEach(async e => {
        const p = e.parentElement
        let span = p.querySelector(`#my-span-tag`)
        if (span === null) {
            span = document.createElement('span')
            span.id = 'my-span-tag'
            span.style = STYLE
            span.innerText = '... ...'
            p.insertAdjacentElement('beforeend', span)


            const href = e.getAttribute('href')
            const j = (await (await fetch(`https://api.github.com/repos${href}`, PARAMS)).json())

            const date = j.created_at.split('T')[0]
            const size = (j.size / 1024).toFixed(2)
            const forks = j.forks_count
            const stars = j.stargazers_count


        // /<span style=${CLICKABLESPANSTYLE}>🍴${forks}</span>/<span style=${CLICKABLESPANSTYLE}>📁${size}MB</span>

            const textHTML = `/⌛${date}/⭐${stars}`

            span.innerText = ''
            span.insertAdjacentText('beforeend', textHTML)


            let forksBtn = document.createElement('span')
            forksBtn.style = CLICKABLESPANSTYLE
            forksBtn.innerText =`/🍴${forks}`
            forksBtn.addEventListener('click',()=>appendForksList(href))
            span.insertAdjacentElement('beforeend',forksBtn)

            let sizeBtn = document.createElement('span')
            // sizeBtn.style = CLICKABLESPANSTYLE
            sizeBtn.innerText =`/📁${size}MB`
            // sizeBtn.addEventListener('click',()=>appendForksList(href))
            span.insertAdjacentElement('beforeend',sizeBtn)


        }
    })
}



window.onurlchange = (c) => {
    if (!hasLoaded) {
        hasLoaded = !hasLoaded
        return
    }
    fireUp()
}

fireUp()

