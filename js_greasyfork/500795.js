// ==UserScript==
// @name         fancaps 图片批量导出
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  批量选择 fancaps 的图片并导出图片链接
// @author       ctrn43062
// @match        https://fancaps.net/anime/episodeimages.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fancaps.net
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500795/fancaps%20%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/500795/fancaps%20%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

const constants = {
    checkboxClassName: 'fan-checkbox'
}

const states = {
    selectedCount: 0,
}

GM_addStyle(`
.image-selected {
  position: relative;
}

.image-selected .${constants.checkboxClassName} {
  position: absolute;
  top:10px;
  left: 10px;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
}

.side-operation {
 position: fixed;
 right: 2rem;
 top: 45%;
 font-size: 2rem;
 cursor: pointer;
}
`)

function download(blob, name) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.download = name
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
    // a.remove()
    //document.body.appendChild(a)
}

function addSelectionListener(img) {
    img.addEventListener('click', e => {
        e.preventDefault()

        const p = img.parentElement
        p.classList.toggle('image-selected')
        if(p.classList.contains('image-selected')) {
            states.selectedCount += 1

            const checkbox = document.createElement('div')
            checkbox.className = constants.checkboxClassName
            checkbox.innerText = '☑️'
            checkbox.setAttribute('data-id', img.href.split('/').slice(-1)[0])

            p.appendChild(checkbox)
        } else {
            states.selectedCount -= 1
            p.removeChild(p.querySelector(`.${constants.checkboxClassName}`))
        }

        document.querySelector('.selected-count').innerText = ` (${states.selectedCount})`
    })
}

function addDownloadButton() {
    const sideEl = document.createElement('div')
    sideEl.className = 'side-operation'
    sideEl.innerHTML = `
    <span class="download-btn">🔽<span class="selected-count"></span></span>
  `

    sideEl.querySelector('.download-btn').addEventListener('click', e => {
        const selectedImageEls = document.querySelectorAll(`.${constants.checkboxClassName}`)

        if(!selectedImageEls) {
            return
        }
        // el.href like: https://fancaps.net/anime/picture.php?/3335084
        // urlslike: https://cdni.fancaps.net/file/fancaps-animeimages/3335084.jpg
        const oriURL = 'https://cdni.fancaps.net/file/fancaps-animeimages'
        const urls = Array.from(selectedImageEls).map(el => `${oriURL}/${el.getAttribute('data-id')}.jpg`)
        let filename = document.title.replace(/[ |]/, '_')
        try {
            // href like: https://fancaps.net/anime/episodeimages.php?4963-Yuruyuri___Happy_Go_Lily/Episode_1&page=2
            filename = location.href.split('?')[1].split('/') // [4963-Yuruyuri___Happy_Go_Lily, Episode_1&page=2]
            filename = filename[0] + '_' + filename[1].split('&')[0] // 963-Yuruyuri___Happy_Go_Lily_Episode_1
        } catch (e) {}

        download(new Blob([urls.join('\n')], {type: 'text/plain'}), `${filename}.txt`)
    })

    document.body.appendChild(sideEl)
}

(function() {
    'use strict';
    const contentBodyEl = document.querySelector('#contentbody')

    const obs = new MutationObserver((mutationList) => {
        const nodes = []
        for(const mutation of mutationList) {
            let { addedNodes } = mutation

            if(!addedNodes || addedNodes.length != 1 || !addedNodes[0].classList.contains('single_post_area')) {
                continue
            }
            const post_area = addedNodes[0]
            const rows = post_area.querySelectorAll('.row:has( img)')
            nodes.push(...(rows || []))
            console.log(rows)
        }

        // nodes'length should be always eq 2
        nodes.forEach(node => {
            const imageEls = node.querySelectorAll('a')
            for(const img of imageEls) {
                addSelectionListener(img)
            }
        })
    })

    obs.observe(contentBodyEl, { childList: true, subtree: true })

    contentBodyEl.querySelectorAll('.row a:has(>.imageFade)').forEach(img => {
        addSelectionListener(img)
    })

    addDownloadButton()
})();