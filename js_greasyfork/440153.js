// ==UserScript==
// @name           YouTube Ctrl+F support
// @include        https://*youtube.com/*
// @author         lucasew
// @version        v0.2
// @namespace      youtube-ctrl-f
// @license        GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @grant GM_xmlhttpRequest
// @description   Show video generated subtitles as clickable buttons that jump straight to the subtitle initial position
// @downloadURL https://update.greasyfork.org/scripts/440153/YouTube%20Ctrl%2BF%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/440153/YouTube%20Ctrl%2BF%20support.meta.js
// ==/UserScript==
 
(async function () {
    function awaitElement(query) {
        return new Promise((res, rej) => {
            let interval;
            interval = setInterval(() => {
                try {
                    const elem = document.querySelector(query)
                    if (!!elem) {
                        clearInterval(interval)
                        res(elem)
                    }
                } catch (e) {
                    clearInterval(interval)
                    rej(e)
                }
            }, 500)
        })
    }
    const player = await awaitElement('.video-stream')
    const sidebar = await awaitElement('#secondary')
    async function get_auto_subtitle() {
        var url = get_auto_subtitle_xml_url();
        if (url == false) {
        return false;
        }
        var result = await fetch(url)
        return await result.text()
    }
    // return URL or null;
    // later we can send a AJAX and get XML subtitle
    function get_auto_subtitle_xml_url() {
        try {
            var captionTracks = get_captionTracks()
            for (var index in captionTracks) {
                var caption = captionTracks[index];
                if (caption.kind === 'asr') {
                    return captionTracks[index].baseUrl;
                }
                // ASR – A caption track generated using automatic speech recognition.
                // https://developers.google.com/youtube/v3/docs/captions
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    function get_youtube_data(){
        return document.getElementsByTagName("ytd-app")[0].data.playerResponse
    }
    function get_captionTracks() {
        let data = get_youtube_data();
        var captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks
        return captionTracks
    }
    function zeropad(num, size) {
        let ret = String(num)
        while (ret.length < size) {
            ret = "0" + ret
        }
        return ret
    }
    async function handle() {
        const text = await get_auto_subtitle();
        let parser = new DOMParser();
        const doc = await parser.parseFromString(text, 'text/xml')
        sidebar.innerHTML = ""
        sidebar.style.maxHeight = '80vh'
        sidebar.style.overflowY = 'scroll'
        const updateBtn = document.createElement('button')
        updateBtn.innerHTML = "🔁 Update subtitles"
        updateBtn.addEventListener('click', handle)
        updateBtn.style.width = '100%'
        sidebar.appendChild(updateBtn)
        let items = []
        doc.childNodes[0].childNodes.forEach(node => {
            const text = node.innerHTML;
            const start = node.getAttribute("start")
            const duration = node.getAttribute("dur")
            const startSecs = parseInt(start)
            const hrs = Math.floor(startSecs / 3600)
            const mins = Math.floor(startSecs / 60)
            const secs = Math.round(startSecs % 60)
            let btn = document.createElement('button')
            btn.innerHTML = text.replaceAll('&amp;#39;', "'")
            btn.addEventListener('click', () => {
                player.currentTime = start
                console.log("Jump", start)
            })
            btn.style.width = '100%'
            btn.title = `${hrs}:${zeropad(mins, 2)}:${zeropad(secs, 2)}`
            items.push({text, start, duration})
            sidebar.appendChild(btn)
        });
        console.log(doc)
        console.log(items)
    }
    await handle()
})().catch(console.error)
