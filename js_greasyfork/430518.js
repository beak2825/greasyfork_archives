// ==UserScript==
// @name         AnimeDaonload
// @namespace    http://animedao.com
// @version      0.1
// @description  Gives you buttons to download video from animedao
// @author       github.com/wiryfuture
// @license      GNU GPLv3 
// @include      /https:\/\/animedao(.*)\.(.*)\/.*/
// @include      /https:\/\/storage.googleapis.com\/*.
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/430518/AnimeDaonload.user.js
// @updateURL https://update.greasyfork.org/scripts/430518/AnimeDaonload.meta.js
// ==/UserScript==

(function() {
    // Google code (can be modified to whatever storage they use)
    if (window.location.origin === 'https://storage.googleapis.com') {
        // prevent autoplay
        const video = document.querySelector('video')
        video.autoplay = 'false'
        video.pause()
        let filename = GM_getValue('ANIME_FILE_NAME', '..U!N!A!S!S!I!G!N!E!D!')
        let noprompt = GM_getValue('ANIME_NOPROMPT', false)
        if (filename !== '..U!N!A!S!S!I!G!N!E!D!') {
            GM_deleteValue('ANIME_FILE_NAME') // delete filename so we don't get an infinite loop
            GM_deleteValue('ANIME_NOPROMPT') // we want people to be able to choose where to save next time, this has to go
            let args = {}
            let info
            if (noprompt) {
                args = {
                    url: window.location.href,
                    name: filename + '.mp4',
                    saveAs: false // DON'T prompt to download file
                }
                info = ' and will save to you default folder'
            }
            else {
                args = {
                    url: window.location.href,
                    name: filename + '.mp4',
                    saveAs: true // prompt to download file with previously saved title
                }
                info = ', you will get a prompt soon'
            }

            GM_download(args)
            document.querySelector('body').innerHTML += `
              <div class='info'>
                <h1 style='color:#32b1d1; text-align: center; font-family: default;'>Your download has begun${info} (blame tampermonkey that you can't see it yet)</h1>
                <ins style='color:#32b1d1; text-align: center; font-family: default;>You may close this tab</ins>
              </div>
            `
        }
    }
    // Animedao code
    else {
        const getVideoUrl = (provider) => {
            // (known) providers: gstor, vi, fembe, s, streamtap, mixdro
            switch (provider) {
                case 'gstor':
                    return document.querySelector('#videowrapper_gstore video source').getAttribute('src')
                    break
                case 'vi':
                    return document.querySelector('#videowrapper_vid div.jw-wrapper div.jw-media video').getAttribute('src')
                    break
                case 'fembe':
                    return document.querySelector('#videowrapper_fembed iframe').getAttribute('src')
                    break
                case 's':
                    return document.querySelector('#videowrapper_sb iframe').getAttribute('src')
                    break
                case 'streamtap':
                    return document.querySelector('#videowrapper_streamtape iframe').getAttribute('src')
                    break
                case 'mixdro':
                    return document.querySelector('#videowrapper_mixdrop iframe').getAttribute('src')
                    break
                default:
                    console.log("Provider", provider, "unsupported :'(") // or more likely, the page is scuffed and silently reloaded or smth
                    return "unsupported"
                    break
            }
        }

        const injectDownloadButton = () => {
            document.querySelector('#videocontent center .btn-group').innerHTML += `
        <a href="" target="_blank" id="downloadButton">
          <button class="btn btn-primary">
            <b>Download</b>
          </button>
        </a>`
        }
        const injectDirectDownloadButton = () => {
            document.querySelector('#videocontent center .btn-group').innerHTML += `
        <a href="" target="_blank" id="directdownloadButton">
          <button class="btn btn-primary">
            <b>Download (no prompt)</b>
          </button>
        </a>`
        }

        const updateButton = (url, id) => {
            const anchor = document.getElementById(id)
            const button = anchor.querySelector(` button`)
            if (url !== "unsupported") {
                button.style.backgroundColor = ''
                button.style.borderColor = ''
                button.style.cursor = ''
                anchor.setAttribute('href', window.location.origin + url)
                GM_setValue('ANIME_FILE_NAME', document.querySelector('h2.page_title').innerHTML) // update varname with anime title
            }
            else {
                button.style.backgroundColor = '#e86161'
                button.style.borderColor = '#c63b3b'
                button.style.cursor = 'not-allowed'
                anchor.removeAttribute('href')
            }
        }

        const updateButtons = (url) => {
            updateButton(url, 'downloadButton')
            updateButton(url, 'directdownloadButton')
        }

        const handleSourceChange = () => {
            try {
                // Get video provider (href from button anchors)
                const provider = document.querySelector('#videocontent .nav .active a').getAttribute('href').slice(1, -1)
                // try get video url
                const url = getVideoUrl(provider)
                // Replace button url with new url and modify style accordingly
                updateButtons(url)
            } catch(err) {
                console.log("Error when getting provider, probably the scuffed (re)loading, just press the source button a couple more times")
            }
        }

        // Event listener for clicking a source
        document.getElementById('videocontent').addEventListener('click',( () => { // This sometimes fires three or four times because of phantom clicks??? what??
            handleSourceChange()
        }))
        // Event listener for when the page first loads
        document.getElementById('videocontent').addEventListener('loadstart',( () => { // Their javascript is super cursed and starts loading it twice on dom load?
            handleSourceChange()
        }))
        injectDownloadButton()
        injectDirectDownloadButton()
        // Event listener for direct download button
        document.getElementById('directdownloadButton').addEventListener('click', ( () => {
            GM_setValue('ANIME_NOPROMPT', true)
        }))
    }
})();
