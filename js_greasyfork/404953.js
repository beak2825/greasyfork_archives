// ==UserScript==
// @name         YouTube Qualities Size
// @namespace    ytqz.smz.k
// @version      1.2.6
// @description  Shows file size for each quality in YouTube
// @author       Abdelrahman Khalil
// @match        https://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404953/YouTube%20Qualities%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/404953/YouTube%20Qualities%20Size.meta.js
// ==/UserScript==

;(() => {
    const DEFAULT_CODEC = 'vp9'
    const ALT_CODEC = 'avc1'
    const CACHE = {}

    // --------------------------------
    // API Stuff.
    // --------------------------------
    // NOT WORKING
    /*const fetchInfo = (videoId, detailpage = false) => {
        let url = `https://www.youtube.com/get_video_info?video_id=${videoId}&html5=1`

        // Retrive full info when video is copyrighted.
        if (detailpage) url += '&el=detailpage'

        return fetch(url)
    }

    // Youtube sends data as ugly ass url queries.
    // Parse it using URLSearchParams then get value of player_response which is stringified JSON.
    const parseInfo = uglyInfo =>
        JSON.parse(getQuery(uglyInfo, 'player_response')).streamingData
            .adaptiveFormats
    */
    const getFormats = async videoId => {
        /*let info = await fetchInfo(videoId).then(res => res.text())

        if (!info.includes('adaptiveFormats'))
            info = await fetchInfo(videoId, true).then(res => res.text())

        return parseInfo(info)*/

        //return ytplayer.config.args.raw_player_response.streamingData.adaptiveFormats
        console.clear()
        console.log(ytplayer)

        const body = {
            videoId,
            context: {
                client: {
                    clientName: 'WEB',
                    clientVersion: ytcfg.data_.INNERTUBE_CLIENT_VERSION
                }
            }
        }

        return await fetch("https://www.youtube.com/youtubei/v1/player?key=" + ytcfg.data_.INNERTUBE_API_KEY, {method: "POST", body: JSON.stringify(body)}).then(res => res.json()).then(data => data.streamingData
            .adaptiveFormats)
    }

    // YouTube separates audio and video.
    const getAudioContentLength = formats =>
        formats.find(
            f =>
                f.audioQuality === 'AUDIO_QUALITY_MEDIUM' &&
                f.mimeType.includes('opus')
        ).contentLength || 0

    // Filter formats per quality.
    // Returns video content Length for all codecs summed by opus medium-quality audio content length.
    const mapFormats = (formats, qualityLabel, audioCL) =>
        formats
            .filter(f => f.qualityLabel === qualityLabel && f.contentLength)
            .map(vf => ({
                [matchCodec(vf.mimeType)]: toMBytes(vf.contentLength, audioCL)
            }))
            .reduce((r, c) => Object.assign(r, c), {})

    // --------------------------------
    // DOM Stuff.
    // --------------------------------
    const createYQSNode = mappedFormats => {
        let YQSElement = document.createElement('yt-quality-size')
        let isRTL = document.body.getAttribute('dir') === 'rtl'

        YQSElement.style.float = isRTL ? 'left' : 'right'
        YQSElement.style.textAlign = 'right'
        YQSElement.style.marginRight = '8px'
        YQSElement.setAttribute('dir', 'ltr')

        YQSElement.setAttribute('title', objectStringify(mappedFormats))

        let textNode = document.createTextNode(
            mappedFormats[DEFAULT_CODEC] || mappedFormats[ALT_CODEC] || ''
        )

        YQSElement.appendChild(textNode)

        return YQSElement
    }

    // Hook YQS element to each quality.
    const hookYQS = async addedNode => {
        let doesYQMExist =
                addedNode && addedNode.classList.contains('ytp-quality-menu'),
            doesYQSNotExist = !document.querySelector('yt-quality-size')

        if (doesYQMExist && doesYQSNotExist) {
            let YQM = addedNode,
                videoId = getQuery(location.search, 'v')

            if (!CACHE[videoId]) CACHE[videoId] = await getFormats(videoId)

            let formats = CACHE[videoId],
                qualitiesNode = YQM.querySelectorAll('span'),
                audioCL = getAudioContentLength(formats)

            qualitiesNode.forEach((qualityNode, index) => {
                if (index === qualitiesNode.length - 1) return

                let qualityLabel = matchQLabel(qualityNode.textContent),
                    mappedFormats = mapFormats(formats, qualityLabel, audioCL),
                    YQSNode = createYQSNode(mappedFormats)

                qualityNode.appendChild(YQSNode)
            })
        }
    }

    // Listen to page navigation and observe settings-menu if it's /watch.
    const onPageUpdate = () => {
        let SettingsMenuElement = document.querySelector('.ytp-settings-menu')

        if (SettingsMenuElement) {
            removeEventListener('yt-page-data-updated', onPageUpdate)
            new MutationObserver(([{ addedNodes }]) => {
                hookYQS(addedNodes[0])
            }).observe(SettingsMenuElement, { childList: true })
        }
    }

    addEventListener('yt-page-data-updated', onPageUpdate)

    // --------------------------------
    // Utils
    // --------------------------------
    const getQuery = (string, query) => new URLSearchParams(string).get(query)

    const matchCodec = mimeType => mimeType.replace(/(?!=").+="|\..+|"/g, '')
    const matchQLabel = qLabel => qLabel.replace(/\s.+/, '')

    const toMBytes = (vCL, aCL) => {
        let videoAudioMB = (parseInt(vCL) + parseInt(aCL)) / 1048576
        return (Math.round(videoAudioMB) || videoAudioMB.toFixed(2)) + ' MB'
    }

    const objectStringify = obj =>
        JSON.stringify(obj, null, '‎')
            .replace(/{|}|"|,/g, '')
            .trim()
})()