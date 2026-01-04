// ==UserScript==
// @name         Animego x uvuvu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Search HD anime on uvuvu.ru with animego.org
// @author       z4okolatka
// @match        https://animego.org/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animego.org
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/479325/Animego%20x%20uvuvu.user.js
// @updateURL https://update.greasyfork.org/scripts/479325/Animego%20x%20uvuvu.meta.js
// ==/UserScript==

const title = document.querySelector('.anime-title').querySelector('h1').textContent
const wrapper = document.querySelector('.c-image.media-left.mr-md-4')
const frame = createDownloadFrame()
wrapper.appendChild(frame)

function rawSearch(text) {
    var uri = encodeURI(`http://uvuvu.ru/search/autocomplete/all/${text}`)
    GM.xmlHttpRequest({
        method: "GET",
        url: uri,
        onload: (response) => {
            parseSearchResults(JSON.parse(response.responseText))
        }
    })
}

function parseSearchResults(
    /** @type {Object} */ a
    ) {
    var results = a["1"]
    var length = Object.keys(results).length
    var parsedResults = []
    console.log(results)
    for (let i = 1; i <= length; i++) {
        parsedResults.push({
            "name": results[i].value,
            "eng_name": results[i].slug,
            "url": "http://uvuvu.ru" + results[i].href
        })
    }
    console.log("Parsed results", parsedResults)
    insertResults(parsedResults)
}

function insertResults(
    /** @type {Array<Object>} */ results
    ) {
    console.log(results)
    results.forEach((result) => {
        frame.appendChild(createLink(result))
    })
    if (results.length == 0) {
        var p = document.createElement('p')
        p.textContent = 'Аниме не найдено'
        p.style.marginBottom = '0px'
        p.style.textAlign = 'center'
        frame.appendChild(p)
    }
}

function createDownloadFrame() {
    var frame = document.createElement('div')
    frame.classList.add('mt-3', 'p-3', 'bo-1', 'br-2')
    var text = document.createElement('h5')
    text.classList.add('text-center')
    text.innerHTML = 'Скачать с <a href="http://uvuvu.ru">uvuvu.ru</a>'
    text.style.marginBottom = '1rem'
    frame.appendChild(text)
    return frame
}

function createLink(data) {
    var p = document.createElement('p')
    p.style.marginBottom = '0px'
    p.style.marginTop = '.6rem'
    var link = document.createElement('a')
    link.href = data.url
    link.text = data.name
    link.target = "_blank"
    p.appendChild(link)
    return p
}

rawSearch(title)