// ==UserScript==
// @name         GGn SteamGridDB Cover Replacer
// @namespace    none
// @version      8
// @description  Easily replace cover using SteamGridDB images
// @author       ingts
// @match        https://gazellegames.net/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://update.greasyfork.org/scripts/541342/GGn%20Corner%20Button.js
// @downloadURL https://update.greasyfork.org/scripts/493556/GGn%20SteamGridDB%20Cover%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/493556/GGn%20SteamGridDB%20Cover%20Replacer.meta.js
// ==/UserScript==
if (typeof GM_getValue('API_key') === 'undefined')
    GM_setValue('API_key', '')
if (typeof GM_getValue('max_images') === 'undefined')
    GM_setValue('max_images', 9)
if (typeof GM_getValue('corner_button') === 'undefined')
    GM_setValue('corner_button', true)

const apiKey = GM_getValue('API_key')

if (groupContentDiv) {
    if (typeof GM_getValue('corner_button') === 'boolean') // backward compat
        GM_setValue('corner_button', undefined)

    createCornerButton('right-vertical', 'SGDB Cover', e => {
        if (apiKey === '') {
            alert('No API key set')
            return
        }
        e.target.remove()
        main()
    })
}

let mainContainer

function main() {
    const steamLink = document.querySelector('a[title=Steam]')
    const groupName = document.getElementById('user_script_data').dataset.groupName
    GM_xmlhttpRequest({
        url: "https://www.steamgriddb.com/api/v2/" +
            (steamLink
                ? `games/steam/${/\d+/.exec(steamLink.href)[0]}`
                : `search/autocomplete/%22${encodeURIComponent(groupName)}%22`),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        responseType: "json",
        onload: response => {
            document.getElementById('grouplinks').insertAdjacentHTML('afterend',
                // language=HTML
                `
                    <section class="box">
                        <div class="head" style="width: 100%;">SteamGridDB Cover Replacer</div>
                        <div style="display:flex;flex-wrap: wrap;gap: 5px" id="sgdb-cover"></div>
                    </section>
                `)
            mainContainer = document.getElementById('sgdb-cover')

            loadTitles(groupName, response)
        }
    })
}

function addNoResultsText() {
    mainContainer.insertAdjacentHTML('beforeend', `<h3>No results found</h3>`)
}

function loadTitles(groupName, response) {
    if (!response.response.success) alert('SteamGridDB request failed')
    const data = response.response.data

    if (data.length === 0) {
        addNoResultsText()
        return
    }

    if (!Array.isArray(data)) { // using steam ID
        getImages(data)
    } else {
        const titleMatch = data.find(item => item.name === groupName)
        if (titleMatch) {
            getImages(titleMatch)
            return
        }
        data.forEach(item => {
            const button = document.createElement('button')
            button.textContent = item.name
            button.type = 'button'
            button.style.height = 'fit-content'
            mainContainer.append(button)
            button.addEventListener('click', () => {
                mainContainer.querySelectorAll('button').forEach(button => button.remove())
                getImages(item)
            })
        })
    }
}

function getImages(item) {
    GM_xmlhttpRequest({
        url: `https://www.steamgriddb.com/api/v2/grids/game/${item.id}?types=static&nsfw=any&epilepsy=any&limit=${GM_getValue('max_images')}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        responseType: "json",
        onload: response => loadImages(response)
    })
}

function loadImages(response) {
    if (!response.response.success) alert('SteamGridDB request failed')
    if (response.response.data.length === 0) {
        addNoResultsText()
        return
    }
    const sorted = response.response.data.sort((a, b) => b.upvotes - a.upvotes)

    for (const item of sorted) {
        new Promise((resolve, reject) => {
            let img = new Image()
            img.src = item.thumb
            img.style.maxWidth = '300px'
            img.style.maxHeight = '400px'
            img.onload = () => resolve(img)
            img.onerror = () => reject()
        }).then(img => {
            const div = document.createElement('div')
            div.style.display = 'flex'
            div.style.flexDirection = 'column'
            div.style.marginLeft = '8px'
            div.style.marginBottom = '4px'
            div.style.gap = '3px'
            div.style.alignItems = 'center'

            mainContainer.append(div)
            div.insertAdjacentHTML('beforeend', `<span style="font-size: 1.4em;">${item.width} x ${item.height}</span>`)
            div.append(img)
            img.addEventListener('click', () => {
                img.style.outline = '5px solid gray'
                fetch(`https://gazellegames.net/imgup.php?img=${item.url}`)
                    .then(r => r.text())
                    .then(link => {
                        const body = new URLSearchParams(`action=takeimagesedit&groupid=${new URL(location.href).searchParams.get('id')}&categoryid=1&image=${link}`)
                        document.querySelectorAll('#group_screenshots img').forEach(img =>
                            body.append('screens[]', img.src.includes('postimg') ? new URL(img.src).searchParams.get('i') : img.src))

                        fetch('torrents.php', {
                            method: 'post',
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            body: body
                        })
                            .then(r => {
                                if (!(r.ok && r.redirected)) {
                                    throw Error
                                }
                                img.style.outlineColor = 'lightgreen'
                            })
                            .catch(() => {
                                img.style.removeProperty('border')
                                alert(`Failed to submit`)
                            })
                    })
                    .catch(() => {
                        alert('PTPimg upload failed')
                    })
            })
        })
    }
}
