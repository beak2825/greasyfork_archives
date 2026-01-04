// ==UserScript==
// @name         cs.rin Steam Info in Topics List
// @namespace    none
// @version      1
// @description  Adds steam info to games in the topics list
// @author       odusi
// @match        https://cs.rin.ru/forum/viewforum.php?f=10
// @match        https://cs.rin.ru/forum/viewforum.php?f=10&start=*
// @match        https://cs.rin.ru/forum/viewforum.php?f=22
// @match        https://cs.rin.ru/forum/viewforum.php?f=22&start=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/485636/csrin%20Steam%20Info%20in%20Topics%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/485636/csrin%20Steam%20Info%20in%20Topics%20List.meta.js
// ==/UserScript==
const max_tags = 6

function promiseXHR(url, options) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url,
            ...options,
            onabort: (response) => {
                reject(response);
            },
            onerror: (response) => {
                reject(response);
            },
            ontimeout: (response) => {
                reject(response);
            },
            onload: (response) => {
                resolve(response.responseText);
            },
        })
    })
}


GM_addStyle( //language=css
    ` .steaminfo-description {
    font-size: 0.6rem;
    color: #8dc1c1;
    width: max-content
}

.steaminfo-tags {
    font-size: 0.65rem;
    color: #efb970;
}
`)

let errorTitles = GM_getValue('errorTitles', [])
const topicHeader = document.querySelectorAll("b.genmed")[location.href.includes('start=') && !location.href.endsWith('start=0') ? 2 : 3].closest('tr')
let curRow = topicHeader.nextElementSibling
const parser = new DOMParser()
const inMainForum = location.href.includes('f=10')

function errTitle(descElement, title) {
    descElement.textContent = 'Failed to get steam info'
    descElement.style.color = 'red'
    errorTitles.push(title)
    GM_setValue('errorTitles', errorTitles)
}

function setElementsProperties(id, description, tags, descElement, tagsElement) {
    descElement.classList.add('steaminfo-description')
    descElement.style.cursor = 'pointer'
    descElement.textContent = 'Show Description'
    descElement.addEventListener("click", () => {
        descElement.style.width = '60%'
        descElement.textContent = description + ' '
        descElement.style.cursor = 'initial'
        descElement.insertAdjacentHTML('beforeend', `<a href=https://store.steampowered.com/app/${id} style="color:#5093cf;">Steam</a>`)
    })
    tagsElement.classList.add('steaminfo-tags')
    tagsElement.textContent = tags
}

while (curRow && !curRow.align) {
    const topicRow = curRow.querySelector(':nth-child(2)')
    let title
    if (inMainForum) {
        const titleQ = topicRow.querySelector('.topictitle :nth-child(3)') ?? topicRow.querySelector('.topictitle') //  2nd is for untagged topics
        title = titleQ.tagName === 'SPAN' ? titleQ.nextSibling.nodeValue.replace(/[\[(].*?[\])]/g, '') /* remove brackets and their text */ .trim() : titleQ.innerText.trim()
    } else {
        title = topicRow.querySelector('.topictitle :nth-child(2)').nextSibling.nodeValue.replace(/[\[(].*?[\])]/g, '').replace('Series', '').trim()
    }
    curRow = curRow.nextElementSibling
    if (errorTitles.includes(title)) continue

    let {id, description, tags} = GM_getValue(title, {})
    const descElement = document.createElement('p')
    const tagsElement = document.createElement('p')
    if (id) {
        setElementsProperties(id, description, tags, descElement, tagsElement)
        topicRow.append(descElement)
        topicRow.append(tagsElement)
    } else {
        descElement.textContent = 'Getting steam info'
        descElement.style.color = '#d6fd0f'
        topicRow.append(descElement)
        promiseXHR(`https://store.steampowered.com/search/?sort_by=_ASC&term=${title}`, {})
            .then(text => {
                const searchPage = parser.parseFromString(text, "text/html")
                const firstResultLink = searchPage.querySelector("#search_resultsRows > a:nth-child(1)").href
                promiseXHR(firstResultLink, {})
                    .then(text => {
                        const appPage = parser.parseFromString(text, "text/html")
                        try {
                            description = appPage.querySelector(".game_description_snippet").innerText.trim()
                        } catch (e) {
                            errTitle(descElement, title)
                        }
                        let tagList = []
                        appPage.querySelectorAll('.glance_tags a').forEach(tag => {
                            if (!tag.innerText.includes('Indie') && tagList.length < max_tags) tagList.push(tag.innerText.toLowerCase().trim())
                        })
                        tags = tagList.join(', ')
                        const id = /\d+/.exec(firstResultLink)[0]
                        GM_setValue(title, {id, description, tags})
                        setElementsProperties(id, description, tags, descElement, tagsElement)
                        descElement.style.removeProperty('color')
                        topicRow.append(tagsElement)
                    })
            })
            .catch(() => {
                errTitle(descElement, title)
            })
    }
}
