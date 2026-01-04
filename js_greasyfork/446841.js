// ==UserScript==
// @name         Biliplus Evolved
// @version      1.0.8
// @description  简单的B+增强脚本
// @author       DeltaFlyer
// @copyright    2025, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        https://*.biliplus.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.bilibili.com
// @connect      comment.bilibili.com
// @connect      bangumi.bilibili.com
// @connect      www.bilibili.com
// @connect      delflare505.win
// @icon         https://www.biliplus.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @namespace    https://greasyfork.org/users/927887
// @downloadURL https://update.greasyfork.org/scripts/446841/Biliplus%20Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/446841/Biliplus%20Evolved.meta.js
// ==/UserScript==

'use strict';
let toastText = (function () {
    let html = `
<style>
.df-bubble-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    display: block !important;
}

.df-bubble {
    background-color: #333;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    margin-bottom: 10px;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    max-width: 300px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    display: block !important;
}

.df-show-bubble {
    opacity: 1;
}
</style>
<div class="df-bubble-container" id="bubbleContainer"></div>`
    document.body.insertAdjacentHTML("beforeend", html)
    let bubbleContainer = document.querySelector('.df-bubble-container')

    function createToast(text) {
        console.log('toast', text)
        const bubble = document.createElement('div');
        bubble.classList.add('df-bubble');
        bubble.textContent = text;

        bubbleContainer.appendChild(bubble);
        setTimeout(() => {
            bubble.classList.add('df-show-bubble');
            setTimeout(() => {
                bubble.classList.remove('df-show-bubble');
                setTimeout(() => {
                    bubbleContainer.removeChild(bubble);
                }, 500); // Remove the bubble after fade out
            }, 3000); // Show bubble for 3 seconds
        }, 100); // Delay before showing the bubble
    }

    return createToast
})();

async function sleep(time) {
    await new Promise((resolve) => setTimeout(resolve, time));
}


async function xhrGet(url) {
    function isCors(url) {
        if (url[0] === '/') return false
        // Extract the domain from the URL
        const urlDomain = new URL(url).hostname;

        // Extract the domain from the current page's URL
        const currentDomain = window.location.hostname;

        // Check if the domains are different (CORS request)
        return urlDomain !== currentDomain;
    }

    console.log('Get', url);
    if (isCors(url)) {
        // Use GM_xmlhttpRequest for cross-origin requests
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, withCredentials: true, onload: (response) => {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        resolve(null);
                    }
                }, onerror: (error) => {
                    console.error('GM_xmlhttpRequest error:', error);
                    resolve(null);
                },
            });
        });
    } else {
        // Use XMLHttpRequest for same-origin requests
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.withCredentials = true;

            xhr.send();

            xhr.onreadystatechange = async () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        resolve(null);
                    }
                }
            };
        });
    }
}

function downloadFile(fileName, content, type = 'text/plain;charset=utf-8') {
    let aLink = document.createElement('a');
    let blob = content
    if (typeof (content) == 'string') blob = new Blob([content], {'type': type})
    aLink.download = fileName;
    let url = URL.createObjectURL(blob)
    aLink.href = url
    aLink.click()
    URL.revokeObjectURL(url)
}

let bv2av = (function bv2av() {
    //https://github.com/TGSAN/bv2av.js/tree/master

    const table = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const max_avid = 1n << 51n;
    const base = 58n;
    const bvid_len = 12n;
    const xor = 23442827791579n;
    const mask = 2251799813685247n;

    let tr = [];
    for (let i = 0; i < base; i++) {
        tr[table[i]] = i;
    }

    /**
     * avid to bvid
     * @param {bigint} avid
     * @returns {string} bvid
     */
    function enc(avid) {
        let r = ['B', 'V'];
        let idx = bvid_len - 1n;
        let tmp = (max_avid | avid) ^ xor;
        while (tmp !== 0n) {
            r[idx] = table[tmp % base];
            tmp /= base;
            idx -= 1n;
        }
        [r[3], r[9]] = [r[9], r[3]];
        [r[4], r[7]] = [r[7], r[4]];
        return r.join('');
    }

    /**
     * bvid to avid
     * @param {string} bvid
     * @returns {bigint} avid
     */
    function dec(bvid) {
        let r = bvid.split('');
        [r[3], r[9]] = [r[9], r[3]];
        [r[4], r[7]] = [r[7], r[4]];
        let tmp = 0n;
        for (let char of r.slice(3)) {
            console.log(char)
            let idx = BigInt(tr[char]);
            tmp = tmp * base + idx;
        }
        let avid = (tmp & mask) ^ xor;
        return avid;
    }

    return dec
})();


function domInserted(target, handle) {
    const observer = new MutationObserver(mutationList => {
            console.log("mutationList", mutationList)
            mutationList.filter(m => m.type === 'childList').forEach(m => {
                for (let e of m.addedNodes) {
                    handle({target: e})
                }
            })
        }
    );
    observer.observe(target, {childList: true, subtree: true});
}


class CustomEventEmitter {
    constructor() {
        this.eventListeners = {};
    }

    addEventListener(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    removeEventListener(event, callback) {
        if (this.eventListeners[event]) {
            const index = this.eventListeners[event].indexOf(callback);
            if (index !== -1) {
                this.eventListeners[event].splice(index, 1);
            }
        }
    }

    postMessage(data) {
        const event = 'message'
        console.log(data)
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                callback({data: data});
            });
        }
    }
}

class ObjectRegistry {
    constructor() {
        this.registeredObjects = new Set();
    }

    register(obj) {
        if (this.registeredObjects.has(obj)) {
            throw new Error('Object is already registered.');
        }
        this.registeredObjects.add(obj);
    }
}

function xmlunEscape(content) {
    return content.replace(/, /g, ';')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
}

function validateTitle(title) {
    if (!title) return ''
    return title.replace(/[\/\\\:\*\?\"\<\>\|]/g, '_')
}

function getPartTitle(partInfo) {
    let partTitle = /^\d+$/.test(partInfo.page) ? 'p' : ''
    partTitle += partInfo.page + ' ' + validateTitle(partInfo.part) + '_' + partInfo.cid
    return partTitle
}

async function aidQuery(event, init, jump) {
    function transform(src) {
        let dst = {}
        dst.id = src.id
        dst.ver = 1
        dst.aid = src.id
        dst.lastupdatets = Math.floor(new Date().getTime() / 1000)
        dst.lastupdate = new Date().toLocaleString();
        if (src.title === "已失效视频") {
            let pic = document.querySelector('.detail_cover')
            if (pic) {
                dst.title = document.title.slice(0, document.title.indexOf(" - "))
                dst.pic = pic.src
            }
        } else {
            dst.pic = src.cover
            dst.title = src.title
        }
        dst.description = src.intro

        dst.tid = src.tid
        dst.typename = "tid_" + src.tid
        dst.created = src.pubtime
        dst.created_at = new Date(src.pubtime * 1000).toLocaleString()
        dst.author = src.upper.name
        dst.mid = src.upper.mid
        dst.play = src.cnt_info.play.toString()
        dst.coins = src.cnt_info.coin
        dst.review = src.cnt_info.reply
        dst.video_review = src.cnt_info.danmaku
        dst.favorites = src.cnt_info.collect
        dst.tag = "tag_undefined"
        let list = []
        for (let page of src.pages) {
            list.push({
                "page": page.page,
                "type": page.from,
                "cid": page.id,
                "vid": undefined,
                "part": page.title + "_时长" + page.duration + "秒",
                "duration": page.duration
            })
        }
        dst.list = list
        return dst
    }

    let aid
    let href = new URL(window.location.href)
    if (href.searchParams.has("get_info") || init) {
        aid = unsafeWindow.av
    } else {
        aid = window.prompt("请输入要查询的aid或bvid", unsafeWindow.av)
        console.log('input', aid)
        if (!/^\d+$/.exec(aid)) {
            if (/^av\d+$/.exec(aid) || /^AV\d+$/.exec(aid)) {
                aid = aid.substring(2)
            } else if (/^BV/.exec(aid)) {
                aid = bv2av(aid)
            } else {
                alert("请输入正确的视频号,bv号请以BV开头")
                return
            }
        }
        jump = true
    }
    if (jump) {
        if (href.toString().indexOf(`/all/video/av${aid}/`) === -1) {
            href = new URL(href.origin + `/all/video/av${aid}/`)
        }
        href.searchParams.set("get_info", '1')
        window.location.href = href.toString()
    }
    let url = `https://delflare505.win/getVideoInfo?aid=` + aid

    let response = await xhrGet(url)
    let body = JSON.parse(await response)
    console.log(body)
    let videoInfo = transform(body.data)
    unsafeWindow.videoInfo = videoInfo
    if (unsafeWindow.cloudmoe) {
        let cacheInfo = JSON.parse(JSON.stringify(videoInfo))
        cacheInfo.isDetailed = true
        cacheInfo.keywords = ""
        cacheInfo = {
            code: 0, data: {
                id: cacheInfo.id, info: cacheInfo, parts: cacheInfo.list,
            },
        }
        unsafeWindow.cloudmoe(cacheInfo)
    } else {
        unsafeWindow.view(videoInfo)
    }
}


function client(broadcastChannel) {
    let registeredTimestamp = new Date().getTime()


    console.log('biliplus script running')

    function getPageAid() {
        let aid
        if (/\/BV/.exec(window.location.href)) {
            aid = bv2av(/BV[a-zA-Z0-9]+/.exec(window.location.href)[0])
        } else {
            aid = /av(\d+)/.exec(window.location.href)[1]
        }
        return Number(aid)
    }


    let createElement = function (sHtml) {
        // 创建一个可复用的包装元素
        let recycled = document.createElement('div'), // 创建标签简易匹配
            reg = /^<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>$/, // 某些元素HTML标签必须插入特定的父标签内，才能产生合法元素
            // 另规避：ie7-某些元素innerHTML只读
            // 创建这些需要包装的父标签hash
            hash = {
                'colgroup': 'table',
                'col': 'colgroup',
                'thead': 'table',
                'tfoot': 'table',
                'tbody': 'table',
                'tr': 'tbody',
                'th': 'tr',
                'td': 'tr',
                'optgroup': 'select',
                'option': 'optgroup',
                'legend': 'fieldset'
            };
        // 闭包重载方法（预定义变量避免重复创建，调用执行更快，成员私有化）
        createElement = function (sHtml) {
            // 若不包含标签，调用内置方法创建并返回元素
            if (!reg.test(sHtml)) {
                return document.createElement(sHtml);
            }
            // hash中是否包含匹配的标签名
            let tagName = hash[RegExp.$1.toLowerCase()];
            // 若无，向包装元素innerHTML，创建/截取并返回元素
            if (!tagName) {
                recycled.innerHTML = sHtml;
                return recycled.removeChild(recycled.firstChild);
            }
            // 若匹配hash标签，迭代包装父标签，并保存迭代层次
            let deep = 0, element = recycled;
            do {
                sHtml = '<' + tagName + '>' + sHtml + '</' + tagName + '>';
                deep++;
            } while (tagName = hash[tagName]);
            element.innerHTML = sHtml;
            // 根据迭代层次截取被包装的子元素
            do {
                element = element.removeChild(element.firstChild);
            } while (--deep > -1);
            // 最终返回需要创建的元素
            return element;
        }
        // 执行方法并返回结果
        return createElement(sHtml);
    }

    async function parseVideoInfo(aid) {
        let videoInfo
        if (unsafeWindow.videoInfo && window.location.href.includes('/video/')) {
            return unsafeWindow.videoInfo
        }
        if (aid === undefined) {
            aid = getPageAid()
        }
        try {
            let videoPage = await xhrGet('https://www.biliplus.com/video/av' + aid + '/')
            videoInfo = JSON.parse(xmlunEscape(/({("ver":2,)?"id":.*?})\);/.exec(videoPage)[1]))
            videoInfo['aid'] = videoInfo['id']
            if (!videoInfo.list || videoInfo.list.length === 0) {
                throw ["No part found in videoInfo Normal, try cidHistory",
                    JSON.stringify(videoInfo, undefined, "\t")]
            }
        } catch (e) {
            console.log(e)
            let videoPage = await xhrGet('https://www.biliplus.com/all/video/av' + aid + '/')
            let url = /(\/api\/view_all\?.*?)'/.exec(videoPage)[1]
            url = 'https://www.biliplus.com' + url
            let data = JSON.parse(xmlunEscape(await xhrGet(url)))['data']
            videoInfo = data['info']
            videoInfo['list'] = data['parts']
        }
        if (videoInfo.created) {
            videoInfo.videoPublishDate = videoInfo.created
        }
        console.log(videoInfo)
        if (window.location.href.includes('/video/')) {
            unsafeWindow.videoInfo = videoInfo
        }
        return videoInfo
    }

    async function parseEpisodesInfo(aid) {
        if (aid === undefined) {
            aid = getPageAid()
        }
        let response = await xhrGet('https://api.bilibili.com/x/web-interface/wbi/view?aid=' + aid)
        let videoInfo = JSON.parse(response).data
        let i = 0
        videoInfo.list = []

        let episodes
        try {
            for (const season of videoInfo.ugc_season.sections) {
                for (const episode of season.episodes) {
                    if (episode.aid === aid) {
                        episodes = season.episodes
                    }
                }
            }
            console.log(episodes.length)
        } catch (e) {
            alert("未找到合集信息")
            return
        }
        for (let episode of episodes) {
            i += 1
            let partInfo = {
                page: i,
                title: episode.arc.title,
                part: episode.arc.title + "_时长" + episode.arc.duration + "秒",
                duration: episode.arc.duration,
                cid: episode.cid
            }
            videoInfo.list.push(partInfo)
        }
        console.log(videoInfo)
        return videoInfo
    }

    (function searchFix() {
        if (window.location.href.indexOf('api/do.php') === -1) return

        function searchOption() {
            let searchField = document.querySelector("#searchField > fieldset")
            let searchDiv = document.querySelector("#searchField > fieldset > div:nth-child(1)")
            searchDiv.insertAdjacentHTML('afterend', `
<style>
.dropdown {
  background-color: #f2f2f2;
  padding: 4px;
  border-radius: 2px;
  
}

.dropdown option {
  padding: 10px;
  font-size: 14px;
  color: #333;
}

.dropdown option:hover {
  background-color: #e5e5e5;
}
</style>
<select id="alive-section" class="dropdown">
    <option value="连载动画">连载动画</option>
    <option value="完结动画">完结动画</option>
    <option value="国产动画">国产动画</option>
    <option value="欧美电影">欧美电影</option>
    <option value="日本电影">日本电影</option>
    <option value="国产电影">国产电影</option>
    <option value="布袋戏">布袋戏</option>
    <option value="国产剧">国产剧</option>
    <option value="海外剧">海外剧</option>
    <option value="" selected="">视频分区</option>
</select>
<select id="dead-section" class="dropdown">
    <option value="连载剧集">连载剧集</option>
    <option value="完结剧集">完结剧集</option>
    <option value="国产">国产</option>
    <option value="日剧">日剧</option>
    <option value="美剧">美剧</option>
    <option value="其他">其他</option>
    <option value="特摄">特摄</option>
    <option value="剧场版">剧场版</option>
    <option value="" selected="">下架分区</option>
</select>
<select id="poster" class="dropdown">
    <option value="928123">哔哩哔哩番剧</option>
    <option value="11783021">哔哩哔哩番剧出差</option>
    <option value="15773384">哔哩哔哩电影</option>
    <option value="4856007">迷影社</option>
    <option value="" selected="">UP主</option>
</select>
`)
            let aliveSection = searchField.querySelector("select[id='alive-section']")
            let deadSection = searchField.querySelector("select[id='dead-section']")
            let poster = searchField.querySelector("select[id='poster']")
            let searchInput = document.querySelector("#searchField > fieldset > div:nth-child(1) > input[type=search]")

            function setSection(section) {
                let content = searchInput.value
                if (section !== "") {
                    section = ' @' + section
                }
                if (/ @\S+/.exec(content)) {
                    content = content.replace(/ @\S+/, section)
                } else content += section
                searchInput.value = content
            }

            function setPoster(uid) {
                if (uid !== "") {
                    uid = ' @m=' + uid
                }
                let content = searchInput.value
                if (/ @m=\d+/.exec(content)) {
                    content = content.replace(/ @m=\d+/, uid)
                } else content += uid
                searchInput.value = content
            }

            aliveSection.addEventListener('change', (event) => {
                if (deadSection.value !== "") {
                    deadSection.value = ""
                }
                setSection(event.target.value)
            })
            deadSection.addEventListener('change', (event) => {
                if (aliveSection.value !== "") {
                    aliveSection.value = ""
                }
                setSection(event.target.value)
            })
            poster.addEventListener('change', (event) => {
                setPoster(event.target.value)
            })
        }


        let getjson = unsafeWindow.parent.getjsonReal = unsafeWindow.parent.getjson
        let aidList = []
        let irrelevantArchive = []
        let allArchive = []

        async function joinCallback(url, callback, n) {
            console.log("joinCallback")
            if (url[0] === '/') url = 'https:' + url
            let word = /word=(.*?)(&|$)/.exec(url)[1]
            let wordList = []
            for (let keyword of decodeURIComponent(word).replace(/([^ ])@/, '$1 @').split(' ')) {
                if (keyword[0] !== '@') {
                    wordList.push(keyword)
                }
            }
            let pn = /p=(\d+)/.exec(url)
            pn = pn ? pn[1] : '1'
            if (pn === '1') {
                aidList = []
                irrelevantArchive = []
                allArchive = []
            }

            let request = xhrGet(url)
            let aidSearchUrl = '/api/search?word=' + word + '&page=' + pn
            let aid_request = xhrGet(aidSearchUrl)

            let searchResult = JSON.parse(await request)
            let archive = []
            searchResult['data']['items']['archive'].forEach(function (item) {
                if (item.goto === 'av') {
                    if (aidList.indexOf(item.param) === -1) {
                        aidList.push(item.param)
                        let isRelevant = false
                        for (let keyword of wordList) {
                            for (let key of ['title', 'desc']) {
                                if (item[key].indexOf(keyword) !== -1) {
                                    isRelevant = true
                                }
                            }
                        }
                        if (isRelevant) {
                            archive.push(item)
                        } else {
                            irrelevantArchive.push(item)
                        }
                        allArchive.push(item)
                    }
                } else {
                    archive.push(item)
                }
            })

            try {
                let aidSearchResult = JSON.parse((await aid_request))['result']
                aidSearchResult.forEach(function (video) {
                    if (aidList.indexOf(video.aid) === -1) {
                        let item = {
                            author: video.author,
                            cover: video.pic,
                            created: new Date(video.created.replace(/-/g, '/')).getTime() / 1000,
                            review: video.review,
                            desc: video.description,
                            goto: "av",
                            param: video.aid,
                            play: video.play,
                            title: video.title,
                        }

                        let isRelevant = false
                        for (let keyword of wordList) {
                            for (let key of ['title', 'desc']) {
                                if (item[key].toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
                                    isRelevant = true
                                }
                            }
                        }
                        if (isRelevant) {
                            archive.push(item)
                        } else {
                            irrelevantArchive.push(item)
                        }
                        allArchive.push(item)
                    }
                })
            } catch (e) {
                console.log(e)
            }

            if (archive.length === 0) {
                archive = irrelevantArchive
                irrelevantArchive = []
            }
            searchResult['data']['items']['archive'] = archive
            callback(searchResult, n)
            return
        }


        unsafeWindow.getjson = unsafeWindow.parent.getjson = function (url, callback, n) {
            console.log("getjson", arguments)
            if (url.indexOf("search_api") !== -1 && url.indexOf("source=biliplus") !== -1) {
                try {
                    return joinCallback(url, callback, n)
                } catch (e) {
                    console.log(e)
                    return getjson(url, callback, n)
                }
            } else return getjson(url, callback, n)

        };


        broadcastChannel.addEventListener('message', function (event) {
            console.log(event.data)
            if (event.data.type === 'aidComplete') {
                let elem = document.querySelector('[id="av' + event.data.aid + '"]')
                if (elem) elem.textContent = '下载完成'
            }
            if (event.data.type === 'aidDownloaded') {
                let elem = document.querySelector('[id="av' + event.data.aid + '"]')
                if (elem) elem.textContent = '已下载'
            }
            if (event.data.type === 'aidStart') {
                let elem = document.querySelector('[id="av' + event.data.aid + '"]')
                if (elem) elem.textContent = '开始下载'
            }
            if (event.data.type === 'cidComplete') {
                let elem = document.querySelector('[id="av' + event.data.aid + '"]')
                if (elem) elem.textContent = event.data.progress + "%"
            }
        })


        function updatePointer(pointerElem) {
            if (pointerElem.querySelector("#videoDetail")) {
                return
            }
            let aidElem = pointerElem
                .querySelector('div[class="video-card-desc"]')
            if (!aidElem) {
                return
            }
            let link = pointerElem.getAttribute("data-link")
            if (link) {
                console.log(link)
                pointerElem.removeAttribute("data-link")
                pointerElem.addEventListener('click', async function (event) {
                    console.log(event)
                    event.preventDefault()
                    if (event.target.className !== 'download') {
                        unsafeWindow.openOrigin(link)
                    }
                })
            }

            let aid = parseInt(aidElem.textContent.slice(2))
            if (!aidElem.querySelector('[class="download"]')) {
                let downloadButton = createElement('<div class="download" style="display:inline-block;float:right;border-radius:5px;border:1px solid #AAA;' + 'background:#DDD;padding:8px 20px;cursor:pointer"  id="av' + aid + '">下载弹幕</div>')

                downloadButton.addEventListener('click', async function (event) {
                    event.preventDefault()
                    console.log('download', aid)
                    if (downloadButton.textContent !== '下载弹幕') return
                    downloadButton.textContent = '等待下载'
                    let videoInfo = await parseVideoInfo(aid)
                    broadcastChannel.postMessage({
                        type: 'biliplusDownloadDanmakuVideo',
                        videoInfo: videoInfo,
                        timestamp: registeredTimestamp
                    })
                })
                aidElem.appendChild(downloadButton)
            }
            if (!pointerElem.querySelector("#videoDetail")) {
                let desc = pointerElem.querySelectorAll(".video-card-desc")
                let timeago = pointerElem.querySelector(".timeago")
                desc = desc[desc.length - 1]
                for (let video of allArchive) {
                    if (video.param === aid && video.goto === 'av') {
                        let text = '播放:' + video['play']
                        if (video['danmaku']) text += '  弹幕:' + video['danmaku']
                        if (video['review']) text += '  评论:' + video['review']

                        desc.insertAdjacentHTML('beforebegin',
                            `<div id="videoDetail" class="video-card-desc">${text}</div>
<div id="videoDetail" class="video-card-desc">${timeago.title}</div>`)
                    }
                }
            }
        }


        let jqCreateElem = unsafeWindow._

        unsafeWindow._ = function (e, t, i) {
            let result = jqCreateElem(e, t, i)
            if (t['className'] === 'pointer') {
                updatePointer(result)
            }
            return result
        }

        searchOption()
        unsafeWindow.openOrigin = unsafeWindow.open
        unsafeWindow.open = function (link) {
            console.log('window.open', link)
            if (link) {
                unsafeWindow.openOrigin(link)
            }
        }

    })();

    (function historyFix() {

        if (window.location.href.indexOf('/video/') === -1) return
        const registry = new ObjectRegistry();
        let aid = getPageAid()

        unsafeWindow.downloadVideoDanmaku = async function (aid, videoInfo) {
            registry.register('downloadVideoDanmaku')
            if (!videoInfo) {
                videoInfo = await parseVideoInfo(aid)
            }
            console.log('downloadVideoDanmaku', videoInfo)

            broadcastChannel.postMessage({
                type: 'biliplusDownloadDanmakuVideo', videoInfo: videoInfo, timestamp: registeredTimestamp
            })
        }

        function getEpisodePublishDate(episode) {
            let dateTimeString = episode.pub_real_time || episode.ctime
            if (!dateTimeString) {
                return null
            }
            const unixTimestamp = Date.parse(dateTimeString);
            return Math.floor(unixTimestamp / 1000); // Convert milliseconds to seconds
        }


        async function popupPageSelector(is_series) {
            let videoInfo
            if (!is_series) {
                videoInfo = await parseVideoInfo(aid)
            } else {
                videoInfo = await parseEpisodesInfo(aid)
            }
            console.log(videoInfo)

            function parseDuration(text) {
                if (!text) {
                    return null
                }
                if (/^\d+$/.test(text)) {
                    return parseFloat(text)
                }
                let match = /^(\d+)[:：](\d+)$/.exec(text)
                if (!match) {
                    alert(`请输入正确的时间: ${text}`)
                    throw text
                }
                return parseFloat(match[1]) * 60 + parseInt(match[2])
            }


            async function builder() {
                let partHtml = ''

                for (let partInfo of videoInfo.list) {
                    let partTitle = getPartTitle(partInfo)
                    let idPrefix = `part_cid_${partInfo.cid}`
                    partHtml += `<tr draggable="true"><td>
<input type="checkbox" checked id="${idPrefix}"></td><td>${partTitle}</td>
<td><div class="part-option front-black" style="display: none">
  <label for="${idPrefix}_front">前黑</label>
  <input type="text" class="p-number-input" name="${idPrefix}_front" id="${idPrefix}_front" />
  </div>
<div class="part-option back-black" style="display: none">
  <label for="${idPrefix}_back">后黑</label>
  <input type="text" class="p-number-input" name="${idPrefix}_back" id="${idPrefix}_back" />
  </div>
  <div class="part-option part-offset" style="display: none">
  <label for="${idPrefix}_offset">偏移</label>
  <input type="text" class="p-number-input" name="${idPrefix}_offset" id="${idPrefix}_offset" value=""/>
  </div>
  </td>
</tr>
`
                }
                let html = `

<div id="popup" class="popup" style="display: none">
<style>
.popup {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
}


.p-number-input {
    margin-left: 1px;
    width: 25px;
    border: 1px solid #aaa; /* Black solid border with 2px width */
    border-radius: 4px; /* Optional: add rounded corners */
    text-align: center; /* Center align the text */
}
.p-number-input::-webkit-outer-spin-button,
.p-number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}





#draggableTable {
  display: block; 
  max-height: 80vh; 
  overflow-y: auto; 
  border-collapse: collapse; 
  width: 100%; 
}

.popup-content {
  background-color: #fefefe; 

  display: block; 
  max-height: 90vh; 
  overflow-y: auto; 
  margin: 5vh auto; 
  padding: 20px;
  border: 1px solid #888;
  width: min(80%, 400px); 
}


.close-btn {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close-btn:hover,
.close-btn:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}


input[type="checkbox"] {
  
  transform: scale(1.5);
  
  margin-right: 10px;
  cursor: pointer; 
}

#draggableTable td {
  padding: 10px; 
}

</style>

    <div class="popup-content">
        <span class="close-btn">&times;</span>
        <div class="button-row">
            <button type="button" id="p-download">下载0项</button>
            <button type="button" id="p-reverse">反选</button>
            <button type="button" id="p-section">区间选择</button>
            <button type="button" id="p-concat">拼接</button>
            <button type="button" id="p-front-black" title="无视视频前段的时长及弹幕">前黑</button>
            <button type="button" id="p-back-black" title="无视视频后段的时长及弹幕">后黑</button>
            <button type="button" id="p-offset" title="指定分P的偏移时间">偏移</button>
        </div>

        <table id="draggableTable">
            <tbody>
                ${partHtml}
            </tbody>
        </table>
    </div>
</div>

`

                document.body.insertAdjacentHTML("beforeend", html)


                let popup = document.getElementById('popup')

                function js() {
                    document.querySelector(".close-btn").onclick = function () {
                        document.getElementById("popup").style.display = "none";
                    }

                    let dragSrcEl = null;

                    function handleDragStart(e) {
                        dragSrcEl = this;
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/html', this.innerHTML);
                    }

                    function handleDragOver(e) {
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }
                        e.dataTransfer.dropEffect = 'move';
                        return false;
                    }

                    function handleDrop(e) {
                        if (e.stopPropagation) {
                            e.stopPropagation(); // stops the browser from redirecting.
                        }
                        if (dragSrcEl !== this) {
                            dragSrcEl.innerHTML = this.innerHTML;
                            registerItem(dragSrcEl)
                            this.innerHTML = e.dataTransfer.getData('text/html');
                            registerItem(this)
                        }
                        return false;
                    }

                    function handleDragEnd(e) {
                        this.style.opacity = '1';
                    }


                    function updateSelectedCount() {
                        const selectedCount =
                            document.querySelectorAll(
                                '#draggableTable input[type="checkbox"]:checked').length;
                        document.getElementById('p-download').innerText = `下载${selectedCount}项`
                    }

                    updateSelectedCount()

                    let lastClick = null
                    let currentClick = null


                    function registerItem(item) {
                        let checkbox = item.querySelector('input[type="checkbox"]');
                        item.addEventListener('dragstart', handleDragStart, false);
                        item.addEventListener('dragover', handleDragOver, false);
                        item.addEventListener('drop', handleDrop, false);
                        item.addEventListener('dragend', handleDragEnd, false);
                        item.addEventListener('click', function (e) {
                            if (e.target.type !== 'checkbox') {
                                checkbox.checked = !checkbox.checked
                            }
                            if (checkbox.checked) {
                                lastClick = currentClick
                                currentClick = item
                                if (lastClick !== null) {
                                    document.getElementById('p-section').removeAttribute('disabled')
                                }
                            }

                            updateSelectedCount()
                        })
                    }


                    document.querySelectorAll('#draggableTable tr').forEach(registerItem)

                    document.getElementById('p-reverse').addEventListener('click', () => {
                        document.querySelectorAll('#draggableTable input[type="checkbox"]').forEach(checkbox => {
                            checkbox.checked = !checkbox.checked;
                        });
                        updateSelectedCount()
                    })
                    document.getElementById('p-section').addEventListener('click', () => {
                        let parent = lastClick.parentElement
                        let sectionStart = false
                        for (let child of parent.childNodes) {
                            if (child === lastClick || child === currentClick) {
                                if (!sectionStart) {
                                    sectionStart = true
                                } else {
                                    break
                                }
                            }
                            if (sectionStart && child.querySelector) {
                                child.querySelector("input").checked = true
                            }
                        }
                        updateSelectedCount()
                    })
                    document.getElementById('p-reverse').addEventListener('click', () => {
                    })
                    document.getElementById('p-front-black').addEventListener('click', () => {
                        checkDuration()

                        let time = parseDuration(window.prompt("请输入前黑的秒数,拼接时将无视该时段的时长及弹幕"))
                        if (isNaN(time)) {
                            alert("请输入数字")
                        } else {
                            popup.querySelectorAll(".front-black").forEach(elem => {
                                elem.style.display = 'flex'
                            })
                            popup.querySelectorAll(`input[id$="_front"]`).forEach((elem) => {
                                elem.value = time
                            })
                            toastText(`应用前黑: ${time}秒`)
                            pageSetting.frontBlack = time
                        }
                    })
                    document.getElementById('p-back-black').addEventListener('click', () => {
                        checkDuration()

                        let time = parseDuration(window.prompt("请输入后黑的秒数,拼接时将无视该时段的时长及弹幕"))
                        if (isNaN(time)) {
                            alert("请输入数字")
                        } else {
                            popup.querySelectorAll(".back-black").forEach(elem => {
                                elem.style.display = 'flex'
                            })
                            popup.querySelectorAll(`input[id$="_back"]`).forEach((elem) => {
                                elem.value = time
                            })
                            toastText(`应用后黑: ${time}秒`)
                            pageSetting.backBlack = time
                        }
                    })
                    document.getElementById('p-offset').addEventListener('click', () => {
                        popup.querySelectorAll(".part-offset").forEach(elem => {
                                elem.style.display = 'flex'
                            }
                        )
                    })
                    document.getElementById('popup').addEventListener('click', function (event) {
                        if (!event.target.closest('.popup-content')) {
                            document.getElementById('popup').style.display = 'none';
                        }
                    });
                }

                js()
                return popup
            }

            function checkDuration() {
                if (!videoInfo.list[0].duration) {
                    window.alert("该功能需要启用aid查询")
                    aidQuery(null, true, true)
                    throw "eee"
                }
            }

            let popup = document.getElementById('popup')
            if (!popup) {
                popup = await builder(aid)
            }
            if (popup.style.display === 'none') {
                popup.style.display = 'block'
            }
            popup.querySelector('#p-download').addEventListener('click', async (e) => {
                videoInfo = JSON.parse(JSON.stringify(videoInfo))
                let cidMap = {}
                videoInfo.list.forEach((partInfo) => {
                    cidMap[partInfo.cid] = partInfo
                })
                videoInfo.list = []
                for (let checkBox of document.querySelectorAll(
                    '#draggableTable input[type="checkbox"]:checked')) {
                    videoInfo.list.push(cidMap[Number(checkBox.id.substring(9))])
                }
                videoInfo.isCache = true
                await unsafeWindow.downloadVideoDanmaku(aid, videoInfo)
            })

            popup.querySelector('#p-concat').addEventListener('click', async (e) => {
                checkDuration()

                videoInfo = JSON.parse(JSON.stringify(videoInfo))
                let cidMap = {}
                videoInfo.list.forEach((partInfo) => {
                    cidMap[partInfo.cid] = partInfo
                })
                videoInfo.list = []
                for (let checkBox of document.querySelectorAll(
                    '#draggableTable input[type="checkbox"]:checked')) {
                    let partInfo = cidMap[Number(checkBox.id.substring(9))]
                    let tr = checkBox.parentNode.parentNode
                    let frontBlack = parseDuration(tr.querySelector("input[id$='_front']").value)
                    let backBlack = parseDuration(tr.querySelector("input[id$='_back']").value)
                    let partOffset = parseDuration(tr.querySelector("input[id$='_offset']").value)

                    if (frontBlack) {
                        partInfo.frontBlack = frontBlack
                    }
                    if (backBlack) {
                        partInfo.backBlack = backBlack
                    }
                    if (partOffset) {
                        partInfo.partOffset = partOffset
                    }
                    videoInfo.list.push(partInfo)
                }
                console.log("concat", videoInfo)

                if (pageSetting.frontBlack) {
                    toastText(`应用前黑: ${pageSetting.frontBlack}秒`)
                }
                if (pageSetting.backBlack) {
                    toastText(`应用后黑: ${pageSetting.backBlack}秒`)
                }

                broadcastChannel.postMessage({
                    type: 'concatDanmaku', videoInfo: videoInfo, timestamp: registeredTimestamp
                })
            })
        }

        unsafeWindow.popupPageSelector = popupPageSelector


        domInserted(document, async (msg) => {
            if (msg.target.id) {
                switch (msg.target.id) {
                    case 'danmaku_container': {
                        let historyButton = msg.target.querySelector('a[href^="/open/moepus.powered"]')
                        let cid = /#(\d+)/.exec(historyButton.getAttribute('href'))[1]
                        historyButton.onclick = async function () {

                            console.log('biliplusDownloadDanmaku', {
                                'cid': cid,
                                'title': document.querySelector('[class="videotitle"]').textContent + ' ' + document.querySelector('[id="cid_' + cid + '"]').innerText,
                                'timestamp': registeredTimestamp
                            })
                            broadcastChannel.postMessage({
                                type: 'biliplusDownloadDanmaku',
                                cid: cid,
                                title: document.querySelector('[class="videotitle"]').textContent + ' ' + document.querySelector('[id="cid_' + cid + '"]').innerText,

                                timestamp: registeredTimestamp
                            })
                        }
                        historyButton.removeAttribute('href')

                        let commentButton = msg.target.querySelector('a[href^="https://comment.bilibili.com"]')
                        commentButton.removeAttribute('href')
                        commentButton.removeAttribute('onClick')
                        commentButton.addEventListener('click', async function () {
                            registry.register('commentButton' + cid)
                            let commentText = await xhrGet("/danmaku/" + cid + ".xml")
                            if (!commentText || commentText.indexOf("<state>2</state>") !== -1) {
                                broadcastChannel.postMessage({
                                    type: 'biliplusDownloadDanmaku',
                                    ndanmu: /<maxlimit>(\d+)<\/maxlimit>/.exec(commentText)?.[1],
                                    cid: cid,
                                    title: document.querySelector('[class="videotitle"]').textContent + ' ' + document.querySelector('[id="cid_' + cid + '"]').innerText,
                                    history: false,
                                    timestamp: registeredTimestamp
                                })
                            } else {
                                downloadFile(cid + '.xml', commentText)
                            }
                        })
                        break
                    }
                    case 'favorite': {
                        console.log(msg.target, msg.target.parentElement.firstChild)
                        msg.target.parentElement.insertBefore(
                            createElement('<span id="downloadDanmaku"><a href="javascript:" ' +
                                'onclick="window.downloadVideoDanmaku()">' +
                                '<div class="solidbox pink" id="av' + getPageAid() + '">下载视频弹幕</div></a></span>'), document.querySelector('#attention'))
                        break
                    }

                    case 'bgBlur': {
                        let bangumi = unsafeWindow.bangumi
                        if (!bangumi.isBangumi) break
                        let bangumiList = document.querySelector("#bangumi_list")
                        bangumiList.insertAdjacentHTML('beforeend', '' +
                            '<div class="solidbox pointer">下载剧集弹幕</div>')
                        bangumiList.lastChild.addEventListener('click', function (event) {
                            registry.register('downloadBangumiDanmaku')
                            console.log(event.target)
                            if (event.target.textContent !== '下载中') {
                                event.target.textContent = "下载中"
                            } else {
                                return
                            }
                            let apiCache = bangumi.apiCache
                            let response = apiCache[Object.keys(apiCache)[0]].result
                            let videoInfo = {
                                aid: 'ss' + response.season_id, title: response.title, list: [], detail: response,
                            }
                            for (let episode of response.episodes) {
                                if (episode.episode_type === -1 || episode.section_type === 1 || episode.section_type === 2) continue
                                let partInfo = {
                                    page: episode.index ? episode.index : episode.title,
                                    part: episode.index_title ? episode.index_title : episode.long_title,
                                    cid: episode.cid,
                                    duration: episode.duration,
                                    videoPublishDate: getEpisodePublishDate(episode)
                                }
                                videoInfo.list.push(partInfo)
                            }
                            unsafeWindow.downloadVideoDanmaku(null, videoInfo)
                        })
                    }
                }
            }
        })
        if (unsafeWindow.cloudmoe) {
            unsafeWindow._cloudmoe = unsafeWindow.cloudmoe
            unsafeWindow.cloudmoe = function (json) {
                if (json.code !== 0 || !json.data) {
                    toastText("使用AID查询信息")
                    return aidQuery(undefined, true)
                } else {
                    let result = unsafeWindow._cloudmoe(json)
                    let container = document.getElementById("container")
                    container.querySelector("#part1").insertAdjacentHTML("beforebegin",
                        '<div class="solidbox pointer" onclick="window.downloadVideoDanmaku()">下载视频弹幕</div>' +
                        '<div class="solidbox pointer" onclick="window.popupPageSelector(false)">分P下载或拼接</div>' +
                        '<div class="solidbox pointer" onclick="window.popupPageSelector(true)">合集下载或拼接</div>'
                    )
                    return result
                }

            }
        }
    })();

    (async function mediaLinkFix() {
        function blockRefresh() {
            // Select the meta refresh tag
            let metaRefresh = document.querySelector('meta[http-equiv="refresh"]');

            // If the meta tag exists, remove it
            if (metaRefresh) {
                metaRefresh.parentNode.removeChild(metaRefresh);
                console.log('Auto-refresh blocked.');
            }
        }


        let url = window.location.href
        if (url.includes('media/md')) {
            let html = await xhrGet(url.replace("biliplus", "bilibili"))
            console.log(html)
            let seasonId = /"season_id":(\d+)/.exec(html)
            if (seasonId) {
                window.location.href = 'https://www.biliplus.com/bangumi/play/ss' + seasonId[1]
            }
        } else if (url.includes('anime/v/')
            && document.body.childNodes[0].textContent.includes('未能识别此地址')) {
            document.addEventListener("DOMContentLoaded", blockRefresh);
            blockRefresh()
            let episodeId = /\/anime\/v\/(\d+)/.exec(url)[1]
            let html = await xhrGet('https://www.bilibili.com/bangumi/play/ep' + episodeId)
            console.log(html)
            let seasonId = /"season_id":(\d+)/.exec(html)
            console.log(seasonId)
            if (seasonId) {
                window.location.href = 'https://www.biliplus.com/bangumi/play/ss' + seasonId[1]
            }
        }

    })();
}


function panel() {
    function getLocalSetting(key) {
        let value = GM_getValue(key)
        console.log('get', key, value)
        try {
            return JSON.parse(value)
        } catch (e) {
            return {}
        }
    }

    function setDefaultValue(currentSetting, settingPanelOptions) {
        for (let option of settingPanelOptions) {
            if (option.id) {
                if (!currentSetting[option.id]) {
                    currentSetting[option.id] = option.default
                }
            } else if (option.children) {
                for (let child of option.children) {
                    if (child.id) {
                        if (!currentSetting[child.id]) {
                            currentSetting[child.id] = child.default
                        }
                    }
                }
            }
        }
    }

    function saveLocalSetting(key, value) {
        console.log('save', key, value)
        GM_setValue(key, JSON.stringify(value))
    }

    let settingPanelOptions = [{type: 'section', 'label': '抓取时段:'}, {
        type: 'row', children: [{
            'type': 'numberInput',
            'id': 'capturePeriodStart',
            label: "从视频发布起第",
            default: 0,
            suffixLabel: '天开始, ',
            splitter: ' '
        }, {
            'type': 'numberInput',
            'id': 'capturePeriodEnd',
            label: "至第",
            default: -1,
            suffixLabel: '天结束',
            splitter: ' '
        },]
    }, {type: 'sectionEnd'}, {
        type: 'row', children: [{type: 'checkbox', id: 'splitFileByTime', label: '按时间段分割弹幕文件'}]
    },]

    let currentSetting = getLocalSetting("danmakuSetting")
    setDefaultValue(currentSetting, settingPanelOptions)
    let showSettingPanel = (function (settingPanelOptions, changeHandle) {
        let panelStyles = `
        <style>
        
        .section {
            font-size: 16px;
            margin-bottom: 10px;
        }
    
        .sectionEnd {
            border-top: 1px solid #ccc;
            margin-top: 10px;
        }

        #panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #333;
            color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 999999;
        }
        
        .slider-label{
            width: 12ch;
        }

        
    
        .apply-button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #555;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 10px;
            margin-left: auto;
        }

        .row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .slider {
            flex: 1;
        }

        .slider-value {
            margin-left: 10px;
            font-size: 14px;
            color: #bbb;
            width: 4ch;
        }

        .selector {
            flex: 1;
            margin-right: 10px;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
        }

        .number-input {
            width: 6ch;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-right: 10px;
            margin-left: 5px;
        }

        .text-selector {
            width: 10ch;
            padding: 5px;
            border: 1px solid #555;
            border-radius: 3px;
            background-color: #444;
            color: #fff;
            margin-left: 5px;
        }

        .equal-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .checkbox-group {
            flex: 1;
            display: flex;
            justify-content: center;
        }
    </style>
`

        // Create the setting panel HTML string based on the provided options
        function createPanelHTML(options) {
            let html = '<div id="panel" style="display: none;">'
            options.forEach(option => {
                if (option.type === 'section') {
                    html += `<div class="section">${option.label}</div>`;
                } else if (option.type === 'sectionEnd') {
                    html += `<div class="sectionEnd"></div>`;
                } else if (option.type === 'slider') {
                    html += `<div class="row">
                <label class="slider-label" for="${option.id}">${option.label}:</label>
                <input type="range" class="slider" id="${option.id}" min="${option.range[0]}" max="${option.range[1]}" step="0.01" value="${currentSetting[option.id] || option.default}">
                <span class="slider-value" id="${option.id}Value">${currentSetting[option.id] || option.default}</span>
            </div>`;
                } else if (option.type === 'equal-row' || option.type === 'row') {
                    html += `<div class="${option.type}">`;
                    option.children.forEach(child => {
                        // Handle checkboxes
                        if (child.type === 'checkbox') {
                            const checked = currentSetting[child.id] !== undefined ? currentSetting[child.id] : child.default;
                            html += `<div class="checkbox-group">
                                    <label for="${child.id}">${child.label}:</label>
                                    <input type="checkbox" id="${child.id}" ${checked ? 'checked' : ''}>
                                    </div>`;
                        }
                        // Handle number input
                        else if (child.type === 'numberInput') {
                            html += `<label for="${child.id}">${child.label}${child.splitter || ':'}</label>
                                    <input type="number" class="number-input" id="${child.id}" value="${currentSetting[child.id] || child.default}">
                                    `;
                            if (child.suffixLabel) {
                                html += `<span>${child.suffixLabel}</span>`
                            }
                        }
                        // Handle text selector
                        else if (child.type === 'textSelector') {
                            let currentValue = currentSetting[child.id] || child.default
                            html += `<label for="${child.id}">${child.label}:</label>
                                    <select class="selector text-selector" id="${child.id}">`;
                            child.optionText.forEach((text, index) => {
                                const value = child.optionValue[index];
                                const selected = currentValue === value ? 'selected' : '';
                                html += `<option value="${value}" ${selected}>${text}</option>`;
                            });
                            html += `</select>`;
                        }
                    });
                    html += `</div>`;
                }
            });
            html += '<button class="apply-button" id="applyButton">应用</button></div>';
            return html;
        }

        function handle_change(changeHandle, id) {
            if (changeHandle && changeHandle[id]) {
                return changeHandle[id];
            }
            return (value, id,) => {
                currentSetting[id] = value;
            }
        }

        function createSettingPanel(settingPanelOptions, changeHandle) {

            document.body.insertAdjacentHTML('beforeend', panelStyles);
            const panelHTML = createPanelHTML(settingPanelOptions);
            document.body.insertAdjacentHTML('beforeend', panelHTML);

            const panel = document.getElementById('panel');

            panel.querySelector('#applyButton').addEventListener('click', () => {
                panel.style.display = 'none';
                saveLocalSetting('danmakuSetting', currentSetting)
            });

            const sliders = panel.querySelectorAll('.slider');
            const sliderValues = panel.querySelectorAll('.slider-value');

            sliders.forEach((elem, index) => {
                elem.addEventListener('input', () => {
                    sliderValues[index].textContent = elem.value;
                    handle_change(changeHandle, elem.id)(parseFloat(elem.value), elem.id);
                });
            });

            // Handle checkbox changes
            const checkboxes = panel.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(elem => {
                elem.addEventListener('change', () => {
                    handle_change(changeHandle, elem.id)(Number(elem.checked), elem.id);
                });
            });

            // Handle number input changes
            const numberInputs = panel.querySelectorAll('.number-input');
            numberInputs.forEach(elem => {
                elem.addEventListener('input', () => {
                    const value = parseFloat(elem.value);
                    if (!isNaN(value)) {
                        handle_change(changeHandle, elem.id)(value, elem.id);
                    }
                });
            });

            // Handle text selector changes
            const textSelectors = panel.querySelectorAll('.text-selector');
            textSelectors.forEach(elem => {
                elem.addEventListener('change', () => {
                    handle_change(changeHandle, elem.id)(elem.value, elem.id);
                });
            });

            return panel
        }


        let panel = createSettingPanel(settingPanelOptions, changeHandle)
        panel.style.display = 'none'
        return function () {
            if (panel.style.display !== 'block') {
                panel.style.display = 'block'
            } else {
                panel.style.display = 'none'
            }
        }
    })(settingPanelOptions, {});

    async function findCidInfo() {
        let cid = window.prompt("请输入要查询的cid")
        if (!/^\d+$/.exec(cid)) {
            alert("请输入一个数字")
            return
        }
        let response = await fetch(`/api/cidinfo?cid=${cid}`)
        let body = await response.json()
        window.alert((JSON.stringify(body.data)))

    }


    (function createToolbar(config) {
        let html = `
<style>

  #triggerArea {
    position: fixed;
    top: 45%;
    left: 0;
    width: max(5%,50px);
    height: 30%;
    cursor: pointer;
    z-index: 999998;
  }

  #toolbar {
    position: fixed;
    top: 50%;
    left: -250px;
    transform: translateY(-50%);
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    cursor: grab;
    transition: left 0.3s;
    z-index: 999999;
  }

  #toolbar:active {
    cursor: grabbing;
  }

  #toolbar button {
    display: block;
    margin: 5px 0;
    padding: 8px;
    background-color: #555;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 3px;
  }
</style>
<div id="triggerArea"></div>
<div id="toolbar"></div>
`
        document.body.insertAdjacentHTML('beforeend', html)
        const triggerArea = document.getElementById('triggerArea');
        const toolbar = document.getElementById('toolbar');
        let isDragging = false;
        let isExpanded = false;
        let startY = 0;
        let initialTop = 0;
        let currentSetting = getLocalSetting('dfToolbar')
        if (currentSetting['offsetTopPercent']) {
            toolbar.setAttribute('offsetTop', currentSetting['offsetTopPercent'] * window.innerHeight)
        }
        console.log('createToolbar', config)
        for (let option of Object.keys(config.options)) {
            let button = document.createElement("button")
            button.innerText = option
            button.addEventListener('click', config.options[option])
            toolbar.appendChild(button)
        }


        function expandToolbar() {
            if (!isExpanded) {
                toolbar.style.left = '0';
                isExpanded = true;
            }
        }

        function collapseToolbar() {
            if (isExpanded) {
                toolbar.style.left = '-250px';
                isExpanded = false;
            }
        }

        triggerArea.addEventListener('mouseenter', () => {
            expandToolbar();
        });

        triggerArea.addEventListener('mouseleave', () => {
            collapseToolbar();
            if (isDragging) {
                isDragging = false
                dragEndHandle()
            }
        });

        toolbar.addEventListener('mouseenter', () => {
            expandToolbar();
        });

        toolbar.addEventListener('mouseleave', () => {
            if (!isDragging) {
                collapseToolbar();
            }
        });

        toolbar.addEventListener('mousedown', (e) => {
            if (e.target === toolbar) {
                console.log(e.type, e)
                isDragging = true;
                startY = e.clientY;
                initialTop = toolbar.offsetTop;
            }
        });


        let draggingHandle = (e) => {
            if (!isDragging) return;
            const deltaY = e.clientY - startY;
            toolbar.style.top = `${initialTop + deltaY}px`;
        }

        let dragEndHandle = (e) => {
            if (isDragging) {
                isDragging = false;
                currentSetting.offsetTopPercent = toolbar.offsetTop / window.innerHeight
                saveLocalSetting('dfToolbar', currentSetting)
            }
        }

        window.addEventListener('mousemove', draggingHandle);
        window.addEventListener('mouseup', dragEndHandle);

        expandToolbar()
        setTimeout(collapseToolbar, 3000)
    })({
        options: {
            "下载选项": showSettingPanel, "CID 反查": findCidInfo, "AID 查询": aidQuery
        }
    });
    return currentSetting
}


!function (z) {
    var y = {
        1: [function (p, w) {
            w.exports = function (h, m) {
                for (var n = Array(arguments.length - 1), e = 0, d = 2, a = !0; d < arguments.length;) n[e++] = arguments[d++];
                return new Promise(function (b, c) {
                    n[e] = function (k) {
                        if (a) if (a = !1, k) c(k); else {
                            for (var l = Array(arguments.length - 1), q = 0; q < l.length;) l[q++] = arguments[q];
                            b.apply(null, l)
                        }
                    };
                    try {
                        h.apply(m || null, n)
                    } catch (k) {
                        a && (a = !1, c(k))
                    }
                })
            }
        }, {}], 2: [function (p, w, h) {
            h.length = function (e) {
                var d = e.length;
                if (!d) return 0;
                for (var a = 0; 1 < --d % 4 && "=" === e.charAt(d);) ++a;
                return Math.ceil(3 * e.length) / 4 - a
            };
            var m = Array(64), n = Array(123);
            for (p = 0; 64 > p;) n[m[p] = 26 > p ? p + 65 : 52 > p ? p + 71 : 62 > p ? p - 4 : p - 59 | 43] = p++;
            h.encode = function (e, d, a) {
                for (var b, c = null, k = [], l = 0, q = 0; d < a;) {
                    var f = e[d++];
                    switch (q) {
                        case 0:
                            k[l++] = m[f >> 2];
                            b = (3 & f) << 4;
                            q = 1;
                            break;
                        case 1:
                            k[l++] = m[b | f >> 4];
                            b = (15 & f) << 2;
                            q = 2;
                            break;
                        case 2:
                            k[l++] = m[b | f >> 6], k[l++] = m[63 & f], q = 0
                    }
                    8191 < l && ((c || (c = [])).push(String.fromCharCode.apply(String, k)), l = 0)
                }
                return q && (k[l++] = m[b], k[l++] = 61, 1 === q && (k[l++] = 61)), c ? (l && c.push(String.fromCharCode.apply(String, k.slice(0, l))), c.join("")) : String.fromCharCode.apply(String, k.slice(0, l))
            };
            h.decode = function (e, d, a) {
                for (var b, c = a, k = 0, l = 0; l < e.length;) {
                    var q = e.charCodeAt(l++);
                    if (61 === q && 1 < k) break;
                    if ((q = n[q]) === z) throw Error("invalid encoding");
                    switch (k) {
                        case 0:
                            b = q;
                            k = 1;
                            break;
                        case 1:
                            d[a++] = b << 2 | (48 & q) >> 4;
                            b = q;
                            k = 2;
                            break;
                        case 2:
                            d[a++] = (15 & b) << 4 | (60 & q) >> 2;
                            b = q;
                            k = 3;
                            break;
                        case 3:
                            d[a++] = (3 & b) << 6 | q, k = 0
                    }
                }
                if (1 === k) throw Error("invalid encoding");
                return a - c
            };
            h.test = function (e) {
                return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)
            }
        }, {}], 3: [function (p, w) {
            function h() {
                this.t = {}
            }

            (w.exports = h).prototype.on = function (m, n, e) {
                return (this.t[m] || (this.t[m] = [])).push({fn: n, ctx: e || this}), this
            };
            h.prototype.off = function (m, n) {
                if (m === z) this.t = {}; else if (n === z) this.t[m] = []; else for (var e = this.t[m], d = 0; d < e.length;) e[d].fn === n ? e.splice(d, 1) : ++d;
                return this
            };
            h.prototype.emit = function (m) {
                var n = this.t[m];
                if (n) {
                    for (var e = [], d = 1; d < arguments.length;) e.push(arguments[d++]);
                    for (d = 0; d < n.length;) n[d].fn.apply(n[d++].ctx, e)
                }
                return this
            }
        }, {}], 4: [function (p, w) {
            function h(a) {
                return "undefined" != typeof Float32Array ? function () {
                    function b(v, g, t) {
                        q[0] = v;
                        g[t] = f[0];
                        g[t + 1] = f[1];
                        g[t + 2] = f[2];
                        g[t + 3] = f[3]
                    }

                    function c(v, g, t) {
                        q[0] = v;
                        g[t] = f[3];
                        g[t + 1] = f[2];
                        g[t + 2] = f[1];
                        g[t + 3] = f[0]
                    }

                    function k(v, g) {
                        return f[0] = v[g], f[1] = v[g + 1], f[2] = v[g + 2], f[3] = v[g + 3], q[0]
                    }

                    function l(v, g) {
                        return f[3] = v[g], f[2] = v[g + 1], f[1] = v[g + 2], f[0] = v[g + 3], q[0]
                    }

                    var q = new Float32Array([-0]), f = new Uint8Array(q.buffer), u = 128 === f[3];
                    a.writeFloatLE = u ? b : c;
                    a.writeFloatBE = u ? c : b;
                    a.readFloatLE = u ? k : l;
                    a.readFloatBE = u ? l : k
                }() : function () {
                    function b(k, l, q, f) {
                        var u = 0 > l ? 1 : 0;
                        if (u && (l = -l), 0 === l) k(0 < 1 / l ? 0 : 2147483648, q, f); else if (isNaN(l)) k(2143289344, q, f); else if (3.4028234663852886E38 < l) k((u << 31 | 2139095040) >>> 0, q, f); else if (1.1754943508222875E-38 > l) k((u << 31 | Math.round(l / 1.401298464324817E-45)) >>> 0, q, f); else {
                            var v = Math.floor(Math.log(l) / Math.LN2);
                            k((u << 31 | v + 127 << 23 | 8388607 & Math.round(l * Math.pow(2, -v) * 8388608)) >>> 0, q, f)
                        }
                    }

                    function c(k, l, q) {
                        q = k(l, q);
                        k = 2 * (q >> 31) + 1;
                        l = q >>> 23 & 255;
                        q &= 8388607;
                        return 255 === l ? q ? NaN : 1 / 0 * k : 0 === l ? 1.401298464324817E-45 * k * q : k * Math.pow(2, l - 150) * (q + 8388608)
                    }

                    a.writeFloatLE = b.bind(null, m);
                    a.writeFloatBE = b.bind(null, n);
                    a.readFloatLE = c.bind(null, e);
                    a.readFloatBE = c.bind(null, d)
                }(), "undefined" != typeof Float64Array ? function () {
                    function b(v, g, t) {
                        q[0] = v;
                        g[t] = f[0];
                        g[t + 1] = f[1];
                        g[t + 2] = f[2];
                        g[t + 3] = f[3];
                        g[t + 4] = f[4];
                        g[t + 5] = f[5];
                        g[t + 6] = f[6];
                        g[t + 7] = f[7]
                    }

                    function c(v, g, t) {
                        q[0] = v;
                        g[t] = f[7];
                        g[t + 1] = f[6];
                        g[t + 2] = f[5];
                        g[t + 3] = f[4];
                        g[t + 4] = f[3];
                        g[t + 5] = f[2];
                        g[t + 6] = f[1];
                        g[t + 7] = f[0]
                    }

                    function k(v, g) {
                        return f[0] = v[g], f[1] = v[g + 1], f[2] = v[g + 2], f[3] = v[g + 3], f[4] = v[g + 4], f[5] = v[g + 5], f[6] = v[g + 6], f[7] = v[g + 7], q[0]
                    }

                    function l(v, g) {
                        return f[7] = v[g], f[6] = v[g + 1], f[5] = v[g + 2], f[4] = v[g + 3], f[3] = v[g + 4], f[2] = v[g + 5], f[1] = v[g + 6], f[0] = v[g + 7], q[0]
                    }

                    var q = new Float64Array([-0]), f = new Uint8Array(q.buffer), u = 128 === f[7];
                    a.writeDoubleLE = u ? b : c;
                    a.writeDoubleBE = u ? c : b;
                    a.readDoubleLE = u ? k : l;
                    a.readDoubleBE = u ? l : k
                }() : function () {
                    function b(k, l, q, f, u, v) {
                        var g = 0 > f ? 1 : 0;
                        if (g && (f = -f), 0 === f) k(0, u, v + l), k(0 < 1 / f ? 0 : 2147483648, u, v + q); else if (isNaN(f)) k(0, u, v + l), k(2146959360, u, v + q); else if (1.7976931348623157E308 < f) k(0, u, v + l), k((g << 31 | 2146435072) >>> 0, u, v + q); else if (2.2250738585072014E-308 > f) k((f /= 4.9E-324) >>> 0, u, v + l), k((g << 31 | f / 4294967296) >>> 0, u, v + q); else {
                            var t = Math.floor(Math.log(f) / Math.LN2);
                            1024 === t && (t = 1023);
                            k(4503599627370496 * (f *= Math.pow(2, -t)) >>> 0, u, v + l);
                            k((g << 31 | t + 1023 << 20 | 1048576 * f & 1048575) >>> 0, u, v + q)
                        }
                    }

                    function c(k, l, q, f, u) {
                        l = k(f, u + l);
                        f = k(f, u + q);
                        k = 2 * (f >> 31) + 1;
                        q = f >>> 20 & 2047;
                        l = 4294967296 * (1048575 & f) + l;
                        return 2047 === q ? l ? NaN : 1 / 0 * k : 0 === q ? 4.9E-324 * k * l : k * Math.pow(2, q - 1075) * (l + 4503599627370496)
                    }

                    a.writeDoubleLE = b.bind(null, m, 0, 4);
                    a.writeDoubleBE = b.bind(null, n, 4, 0);
                    a.readDoubleLE = c.bind(null, e, 0, 4);
                    a.readDoubleBE = c.bind(null, d, 4, 0)
                }(), a
            }

            function m(a, b, c) {
                b[c] = 255 & a;
                b[c + 1] = a >>> 8 & 255;
                b[c + 2] = a >>> 16 & 255;
                b[c + 3] = a >>> 24
            }

            function n(a, b, c) {
                b[c] = a >>> 24;
                b[c + 1] = a >>> 16 & 255;
                b[c + 2] = a >>> 8 & 255;
                b[c + 3] = 255 & a
            }

            function e(a, b) {
                return (a[b] | a[b + 1] << 8 | a[b + 2] << 16 | a[b + 3] << 24) >>> 0
            }

            function d(a, b) {
                return (a[b] << 24 | a[b + 1] << 16 | a[b + 2] << 8 | a[b + 3]) >>> 0
            }

            w.exports = h(h)
        }, {}], 5: [function (p, w, h) {
            w.exports = function (m) {
                try {
                    var n = eval("require")(m);
                    if (n && (n.length || Object.keys(n).length)) return n
                } catch (e) {
                }
                return null
            }
        }, {}], 6: [function (p, w) {
            w.exports = function (h, m, n) {
                var e = n || 8192, d = e >>> 1, a = null, b = e;
                return function (c) {
                    if (1 > c || d < c) return h(c);
                    e < b + c && (a = h(e), b = 0);
                    c = m.call(a, b, b += c);
                    return 7 & b && (b = 1 + (7 | b)), c
                }
            }
        }, {}], 7: [function (p, w, h) {
            h.length = function (m) {
                for (var n = 0, e = 0, d = 0; d < m.length; ++d) 128 > (e = m.charCodeAt(d)) ? n += 1 : 2048 > e ? n += 2 : 55296 == (64512 & e) && 56320 == (64512 & m.charCodeAt(d + 1)) ? (++d, n += 4) : n += 3;
                return n
            };
            h.read = function (m, n, e) {
                if (1 > e - n) return "";
                for (var d, a = null, b = [], c = 0; n < e;) 128 > (d = m[n++]) ? b[c++] = d : 191 < d && 224 > d ? b[c++] = (31 & d) << 6 | 63 & m[n++] : 239 < d && 365 > d ? (d = ((7 & d) << 18 | (63 & m[n++]) << 12 | (63 & m[n++]) << 6 | 63 & m[n++]) - 65536, b[c++] = 55296 + (d >> 10), b[c++] = 56320 + (1023 & d)) : b[c++] = (15 & d) << 12 | (63 & m[n++]) << 6 | 63 & m[n++], 8191 < c && ((a || (a = [])).push(String.fromCharCode.apply(String, b)), c = 0);
                return a ? (c && a.push(String.fromCharCode.apply(String, b.slice(0, c))), a.join("")) : String.fromCharCode.apply(String, b.slice(0, c))
            };
            h.write = function (m, n, e) {
                for (var d, a, b = e, c = 0; c < m.length; ++c) 128 > (d = m.charCodeAt(c)) ? n[e++] = d : (2048 > d ? n[e++] = d >> 6 | 192 : (55296 == (64512 & d) && 56320 == (64512 & (a = m.charCodeAt(c + 1))) ? (d = 65536 + ((1023 & d) << 10) + (1023 & a), ++c, n[e++] = d >> 18 | 240, n[e++] = d >> 12 & 63 | 128) : n[e++] = d >> 12 | 224, n[e++] = d >> 6 & 63 | 128), n[e++] = 63 & d | 128);
                return e - b
            }
        }, {}], 8: [function (p, w, h) {
            function m() {
                n.Reader.n(n.BufferReader);
                n.util.n()
            }

            var n = h;
            n.build = "minimal";
            n.Writer = p(16);
            n.BufferWriter = p(17);
            n.Reader = p(9);
            n.BufferReader = p(10);
            n.util = p(15);
            n.rpc = p(12);
            n.roots = p(11);
            n.configure = m;
            n.Writer.n(n.BufferWriter);
            m()
        }, {10: 10, 11: 11, 12: 12, 15: 15, 16: 16, 17: 17, 9: 9}], 9: [function (p, w) {
            function h(f, u) {
                return RangeError("index out of range: " + f.pos + " + " + (u || 1) + " > " + f.len)
            }

            function m(f) {
                this.buf = f;
                this.pos = 0;
                this.len = f.length
            }

            function n() {
                var f = new c(0, 0), u = 0;
                if (!(4 < this.len - this.pos)) {
                    for (; 3 > u; ++u) {
                        if (this.pos >= this.len) throw h(this);
                        if (f.lo = (f.lo | (127 & this.buf[this.pos]) << 7 * u) >>> 0, 128 > this.buf[this.pos++]) return f
                    }
                    return f.lo = (f.lo | (127 & this.buf[this.pos++]) << 7 * u) >>> 0, f
                }
                for (; 4 > u; ++u) if (f.lo = (f.lo | (127 & this.buf[this.pos]) << 7 * u) >>> 0, 128 > this.buf[this.pos++]) return f;
                if (f.lo = (f.lo | (127 & this.buf[this.pos]) << 28) >>> 0, f.hi = (f.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, 128 > this.buf[this.pos++]) return f;
                if (u = 0, 4 < this.len - this.pos) for (; 5 > u; ++u) {
                    if (f.hi = (f.hi | (127 & this.buf[this.pos]) << 7 * u + 3) >>> 0, 128 > this.buf[this.pos++]) return f
                } else for (; 5 > u; ++u) {
                    if (this.pos >= this.len) throw h(this);
                    if (f.hi = (f.hi | (127 & this.buf[this.pos]) << 7 * u + 3) >>> 0, 128 > this.buf[this.pos++]) return f
                }
                throw Error("invalid varint encoding");
            }

            function e(f, u) {
                return (f[u - 4] | f[u - 3] << 8 | f[u - 2] << 16 | f[u - 1] << 24) >>> 0
            }

            function d() {
                if (this.pos + 8 > this.len) throw h(this, 8);
                return new c(e(this.buf, this.pos += 4), e(this.buf, this.pos += 4))
            }

            w.exports = m;
            var a, b = p(15), c = b.LongBits, k = b.utf8, l,
                q = "undefined" != typeof Uint8Array ? function (f) {
                    if (f instanceof Uint8Array || Array.isArray(f)) return new m(f);
                    throw Error("illegal buffer");
                } : function (f) {
                    if (Array.isArray(f)) return new m(f);
                    throw Error("illegal buffer");
                };
            m.create = b.Buffer ? function (f) {
                return (m.create = function (u) {
                    return b.Buffer.isBuffer(u) ? new a(u) : q(u)
                })(f)
            } : q;
            m.prototype.i = b.Array.prototype.subarray || b.Array.prototype.slice;
            m.prototype.uint32 = (l = 4294967295, function () {
                if ((l = (127 & this.buf[this.pos]) >>> 0, 128 > this.buf[this.pos++]) || (l = (l | (127 & this.buf[this.pos]) << 7) >>> 0, 128 > this.buf[this.pos++]) || (l = (l | (127 & this.buf[this.pos]) << 14) >>> 0, 128 > this.buf[this.pos++]) || (l = (l | (127 & this.buf[this.pos]) << 21) >>> 0, 128 > this.buf[this.pos++]) || (l = (l | (15 & this.buf[this.pos]) << 28) >>> 0, 128 > this.buf[this.pos++])) return l;
                if ((this.pos += 5) > this.len) throw this.pos = this.len, h(this, 10);
                return l
            });
            m.prototype.int32 = function () {
                return 0 | this.uint32()
            };
            m.prototype.sint32 = function () {
                var f = this.uint32();
                return f >>> 1 ^ -(1 & f) | 0
            };
            m.prototype.bool = function () {
                return 0 !== this.uint32()
            };
            m.prototype.fixed32 = function () {
                if (this.pos + 4 > this.len) throw h(this, 4);
                return e(this.buf, this.pos += 4)
            };
            m.prototype.sfixed32 = function () {
                if (this.pos + 4 > this.len) throw h(this, 4);
                return 0 | e(this.buf, this.pos += 4)
            };
            m.prototype["float"] = function () {
                if (this.pos + 4 > this.len) throw h(this, 4);
                var f = b["float"].readFloatLE(this.buf, this.pos);
                return this.pos += 4, f
            };
            m.prototype["double"] = function () {
                if (this.pos + 8 > this.len) throw h(this, 4);
                var f = b["float"].readDoubleLE(this.buf, this.pos);
                return this.pos += 8, f
            };
            m.prototype.bytes = function () {
                var f = this.uint32(), u = this.pos, v = this.pos + f;
                if (v > this.len) throw h(this, f);
                return this.pos += f, Array.isArray(this.buf) ? this.buf.slice(u, v) : u === v ? new this.buf.constructor(0) : this.i.call(this.buf, u, v)
            };
            m.prototype.string = function () {
                var f = this.bytes();
                return k.read(f, 0, f.length)
            };
            m.prototype.skip = function (f) {
                if ("number" == typeof f) {
                    if (this.pos + f > this.len) throw h(this, f);
                    this.pos += f
                } else {
                    do if (this.pos >= this.len) throw h(this); while (128 & this.buf[this.pos++])
                }
                return this
            };
            m.prototype.skipType = function (f) {
                switch (f) {
                    case 0:
                        this.skip();
                        break;
                    case 1:
                        this.skip(8);
                        break;
                    case 2:
                        this.skip(this.uint32());
                        break;
                    case 3:
                        for (; 4 != (f = 7 & this.uint32());) this.skipType(f);
                        break;
                    case 5:
                        this.skip(4);
                        break;
                    default:
                        throw Error("invalid wire type " + f + " at offset " + this.pos);
                }
                return this
            };
            m.n = function (f) {
                a = f;
                var u = b.Long ? "toLong" : "toNumber";
                b.merge(m.prototype, {
                    int64: function () {
                        return n.call(this)[u](!1)
                    }, uint64: function () {
                        return n.call(this)[u](!0)
                    }, sint64: function () {
                        return n.call(this).zzDecode()[u](!1)
                    }, fixed64: function () {
                        return d.call(this)[u](!0)
                    }, sfixed64: function () {
                        return d.call(this)[u](!1)
                    }
                })
            }
        }, {15: 15}], 10: [function (p, w) {
            function h(e) {
                m.call(this, e)
            }

            w.exports = h;
            var m = p(9);
            (h.prototype = Object.create(m.prototype)).constructor = h;
            var n = p(15);
            n.Buffer && (h.prototype.i = n.Buffer.prototype.slice);
            h.prototype.string = function () {
                var e = this.uint32();
                return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + e, this.len))
            }
        }, {15: 15, 9: 9}], 11: [function (p, w) {
            w.exports = {}
        }, {}], 12: [function (p, w, h) {
            h.Service = p(13)
        }, {13: 13}], 13: [function (p, w) {
            function h(n, e, d) {
                if ("function" != typeof n) throw TypeError("rpcImpl must be a function");
                m.EventEmitter.call(this);
                this.rpcImpl = n;
                this.requestDelimited = !!e;
                this.responseDelimited = !!d
            }

            w.exports = h;
            var m = p(15);
            ((h.prototype = Object.create(m.EventEmitter.prototype)).constructor = h).prototype.rpcCall = function k(e, d, a, b, c) {
                if (!b) throw TypeError("request must be specified");
                var l = this;
                if (!c) return m.asPromise(k, l, e, d, a, b);
                if (!l.rpcImpl) return setTimeout(function () {
                    c(Error("already ended"))
                }, 0), z;
                try {
                    return l.rpcImpl(e, d[l.requestDelimited ? "encodeDelimited" : "encode"](b).finish(), function (q, f) {
                        if (q) return l.emit("error", q, e), c(q);
                        if (null === f) return l.end(!0), z;
                        if (!(f instanceof a)) try {
                            f = a[l.responseDelimited ? "decodeDelimited" : "decode"](f)
                        } catch (u) {
                            return l.emit("error", u, e), c(u)
                        }
                        return l.emit("data", f, e), c(null, f)
                    })
                } catch (q) {
                    return l.emit("error", q, e), setTimeout(function () {
                        c(q)
                    }, 0), z
                }
            };
            h.prototype.end = function (e) {
                return this.rpcImpl && (e || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this
            }
        }, {15: 15}], 14: [function (p, w) {
            function h(a, b) {
                this.lo = a >>> 0;
                this.hi = b >>> 0
            }

            w.exports = h;
            var m = p(15), n = h.zero = new h(0, 0);
            n.toNumber = function () {
                return 0
            };
            n.zzEncode = n.zzDecode = function () {
                return this
            };
            n.length = function () {
                return 1
            };
            var e = h.zeroHash = "\x00\x00\x00\x00\x00\x00\x00\x00";
            h.fromNumber = function (a) {
                if (0 === a) return n;
                var b = 0 > a;
                b && (a = -a);
                var c = a >>> 0;
                a = (a - c) / 4294967296 >>> 0;
                return b && (a = ~a >>> 0, c = ~c >>> 0, 4294967295 < ++c && (c = 0, 4294967295 < ++a && (a = 0))), new h(c, a)
            };
            h.from = function (a) {
                if ("number" == typeof a) return h.fromNumber(a);
                if (m.isString(a)) {
                    if (!m.Long) return h.fromNumber(parseInt(a, 10));
                    a = m.Long.fromString(a)
                }
                return a.low || a.high ? new h(a.low >>> 0, a.high >>> 0) : n
            };
            h.prototype.toNumber = function (a) {
                if (!a && this.hi >>> 31) {
                    a = 1 + ~this.lo >>> 0;
                    var b = ~this.hi >>> 0;
                    return a || (b = b + 1 >>> 0), -(a + 4294967296 * b)
                }
                return this.lo + 4294967296 * this.hi
            };
            h.prototype.toLong = function (a) {
                return m.Long ? new m.Long(0 | this.lo, 0 | this.hi, !!a) : {
                    low: 0 | this.lo, high: 0 | this.hi, unsigned: !!a
                }
            };
            var d = String.prototype.charCodeAt;
            h.fromHash = function (a) {
                return a === e ? n : new h((d.call(a, 0) | d.call(a, 1) << 8 | d.call(a, 2) << 16 | d.call(a, 3) << 24) >>> 0, (d.call(a, 4) | d.call(a, 5) << 8 | d.call(a, 6) << 16 | d.call(a, 7) << 24) >>> 0)
            };
            h.prototype.toHash = function () {
                return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
            };
            h.prototype.zzEncode = function () {
                var a = this.hi >> 31;
                return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ a) >>> 0, this.lo = (this.lo << 1 ^ a) >>> 0, this
            };
            h.prototype.zzDecode = function () {
                var a = -(1 & this.lo);
                return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ a) >>> 0, this.hi = (this.hi >>> 1 ^ a) >>> 0, this
            };
            h.prototype.length = function () {
                var a = this.lo, b = (this.lo >>> 28 | this.hi << 4) >>> 0, c = this.hi >>> 24;
                return 0 === c ? 0 === b ? 16384 > a ? 128 > a ? 1 : 2 : 2097152 > a ? 3 : 4 : 16384 > b ? 128 > b ? 5 : 6 : 2097152 > b ? 7 : 8 : 128 > c ? 9 : 10
            }
        }, {15: 15}], 15: [function (p, w, h) {
            function m(e, d, a) {
                for (var b = Object.keys(d), c = 0; c < b.length; ++c) e[b[c]] !== z && a || (e[b[c]] = d[b[c]]);
                return e
            }

            function n(e) {
                function d(a, b) {
                    if (!(this instanceof d)) return new d(a, b);
                    Object.defineProperty(this, "message", {
                        get: function () {
                            return a
                        }
                    });
                    Error.captureStackTrace ? Error.captureStackTrace(this, d) : Object.defineProperty(this, "stack", {value: Error().stack || ""});
                    b && m(this, b)
                }

                return (d.prototype = Object.create(Error.prototype)).constructor = d, Object.defineProperty(d.prototype, "name", {
                    get: function () {
                        return e
                    }
                }), d.prototype.toString = function () {
                    return this.name + ": " + this.message
                }, d
            }

            h.asPromise = p(1);
            h.base64 = p(2);
            h.EventEmitter = p(3);
            h["float"] = p(4);
            h.inquire = p(5);
            h.utf8 = p(7);
            h.pool = p(6);
            h.LongBits = p(14);
            h.global = "undefined" != typeof window && window || "undefined" != typeof global && global || "undefined" != typeof self && self || this;
            h.emptyArray = Object.freeze ? Object.freeze([]) : [];
            h.emptyObject = Object.freeze ? Object.freeze({}) : {};
            h.isNode = !!(h.global.process && h.global.process.versions && h.global.process.versions.node);
            h.isInteger = Number.isInteger || function (e) {
                return "number" == typeof e && isFinite(e) && Math.floor(e) === e
            };
            h.isString = function (e) {
                return "string" == typeof e || e instanceof String
            };
            h.isObject = function (e) {
                return e && "object" == typeof e
            };
            h.isset = h.isSet = function (e, d) {
                var a = e[d];
                return !(null == a || !e.hasOwnProperty(d)) && ("object" != typeof a || 0 < (Array.isArray(a) ? a.length : Object.keys(a).length))
            };
            h.Buffer = function () {
                try {
                    var e = h.inquire("buffer").Buffer;
                    return e.prototype.utf8Write ? e : null
                } catch (d) {
                    return null
                }
            }();
            h.r = null;
            h.u = null;
            h.newBuffer = function (e) {
                return "number" == typeof e ? h.Buffer ? h.u(e) : new h.Array(e) : h.Buffer ? h.r(e) : "undefined" == typeof Uint8Array ? e : new Uint8Array(e)
            };
            h.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array;
            h.Long = h.global.dcodeIO && h.global.dcodeIO.Long || h.global.Long || h.inquire("long");
            h.key2Re = /^true|false|0|1$/;
            h.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
            h.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
            h.longToHash = function (e) {
                return e ? h.LongBits.from(e).toHash() : h.LongBits.zeroHash
            };
            h.longFromHash = function (e, d) {
                var a = h.LongBits.fromHash(e);
                return h.Long ? h.Long.fromBits(a.lo, a.hi, d) : a.toNumber(!!d)
            };
            h.merge = m;
            h.lcFirst = function (e) {
                return e.charAt(0).toLowerCase() + e.substring(1)
            };
            h.newError = n;
            h.ProtocolError = n("ProtocolError");
            h.oneOfGetter = function (e) {
                for (var d = {}, a = 0; a < e.length; ++a) d[e[a]] = 1;
                return function () {
                    for (var b = Object.keys(this), c = b.length - 1; -1 < c; --c) if (1 === d[b[c]] && this[b[c]] !== z && null !== this[b[c]]) return b[c]
                }
            };
            h.oneOfSetter = function (e) {
                return function (d) {
                    for (var a = 0; a < e.length; ++a) e[a] !== d && delete this[e[a]]
                }
            };
            h.toJSONOptions = {longs: String, enums: String, bytes: String, json: !0};
            h.n = function () {
                var e = h.Buffer;
                e ? (h.r = e.from !== Uint8Array.from && e.from || function (d, a) {
                    return new e(d, a)
                }, h.u = e.allocUnsafe || function (d) {
                    return new e(d)
                }) : h.r = h.u = null
            }
        }, {1: 1, 14: 14, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7}], 16: [function (p, w) {
            function h(g, t, x) {
                this.fn = g;
                this.len = t;
                this.next = z;
                this.val = x
            }

            function m() {
            }

            function n(g) {
                this.head = g.head;
                this.tail = g.tail;
                this.len = g.len;
                this.next = g.states
            }

            function e() {
                this.len = 0;
                this.tail = this.head = new h(m, 0, 0);
                this.states = null
            }

            function d(g, t, x) {
                t[x] = 255 & g
            }

            function a(g, t) {
                this.len = g;
                this.next = z;
                this.val = t
            }

            function b(g, t, x) {
                for (; g.hi;) t[x++] = 127 & g.lo | 128, g.lo = (g.lo >>> 7 | g.hi << 25) >>> 0, g.hi >>>= 7;
                for (; 127 < g.lo;) t[x++] = 127 & g.lo | 128, g.lo >>>= 7;
                t[x++] = g.lo
            }

            function c(g, t, x) {
                t[x] = 255 & g;
                t[x + 1] = g >>> 8 & 255;
                t[x + 2] = g >>> 16 & 255;
                t[x + 3] = g >>> 24
            }

            w.exports = e;
            var k, l = p(15), q = l.LongBits, f = l.base64, u = l.utf8;
            e.create = l.Buffer ? function () {
                return (e.create = function () {
                    return new k
                })()
            } : function () {
                return new e
            };
            e.alloc = function (g) {
                return new l.Array(g)
            };
            l.Array !== Array && (e.alloc = l.pool(e.alloc, l.Array.prototype.subarray));
            e.prototype.e = function (g, t, x) {
                return this.tail = this.tail.next = new h(g, t, x), this.len += t, this
            };
            (a.prototype = Object.create(h.prototype)).fn = function (g, t, x) {
                for (; 127 < g;) t[x++] = 127 & g | 128, g >>>= 7;
                t[x] = g
            };
            e.prototype.uint32 = function (g) {
                return this.len += (this.tail = this.tail.next = new a(128 > (g >>>= 0) ? 1 : 16384 > g ? 2 : 2097152 > g ? 3 : 268435456 > g ? 4 : 5, g)).len, this
            };
            e.prototype.int32 = function (g) {
                return 0 > g ? this.e(b, 10, q.fromNumber(g)) : this.uint32(g)
            };
            e.prototype.sint32 = function (g) {
                return this.uint32((g << 1 ^ g >> 31) >>> 0)
            };
            e.prototype.int64 = e.prototype.uint64 = function (g) {
                g = q.from(g);
                return this.e(b, g.length(), g)
            };
            e.prototype.sint64 = function (g) {
                g = q.from(g).zzEncode();
                return this.e(b, g.length(), g)
            };
            e.prototype.bool = function (g) {
                return this.e(d, 1, g ? 1 : 0)
            };
            e.prototype.sfixed32 = e.prototype.fixed32 = function (g) {
                return this.e(c, 4, g >>> 0)
            };
            e.prototype.sfixed64 = e.prototype.fixed64 = function (g) {
                g = q.from(g);
                return this.e(c, 4, g.lo).e(c, 4, g.hi)
            };
            e.prototype["float"] = function (g) {
                return this.e(l["float"].writeFloatLE, 4, g)
            };
            e.prototype["double"] = function (g) {
                return this.e(l["float"].writeDoubleLE, 8, g)
            };
            var v = l.Array.prototype.set ? function (g, t, x) {
                t.set(g, x)
            } : function (g, t, x) {
                for (var B = 0; B < g.length; ++B) t[x + B] = g[B]
            };
            e.prototype.bytes = function (g) {
                var t = g.length >>> 0;
                if (!t) return this.e(d, 1, 0);
                if (l.isString(g)) {
                    var x = e.alloc(t = f.length(g));
                    f.decode(g, x, 0);
                    g = x
                }
                return this.uint32(t).e(v, t, g)
            };
            e.prototype.string = function (g) {
                var t = u.length(g);
                return t ? this.uint32(t).e(u.write, t, g) : this.e(d, 1, 0)
            };
            e.prototype.fork = function () {
                return this.states = new n(this), this.head = this.tail = new h(m, 0, 0), this.len = 0, this
            };
            e.prototype.reset = function () {
                return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new h(m, 0, 0), this.len = 0), this
            };
            e.prototype.ldelim = function () {
                var g = this.head, t = this.tail, x = this.len;
                return this.reset().uint32(x), x && (this.tail.next = g.next, this.tail = t, this.len += x), this
            };
            e.prototype.finish = function () {
                for (var g = this.head.next, t = this.constructor.alloc(this.len), x = 0; g;) g.fn(g.val, t, x), x += g.len, g = g.next;
                return t
            };
            e.n = function (g) {
                k = g
            }
        }, {15: 15}], 17: [function (p, w) {
            function h() {
                n.call(this)
            }

            function m(b, c, k) {
                40 > b.length ? e.utf8.write(b, c, k) : c.utf8Write(b, k)
            }

            w.exports = h;
            var n = p(16);
            (h.prototype = Object.create(n.prototype)).constructor = h;
            var e = p(15), d = e.Buffer;
            h.alloc = function (b) {
                return (h.alloc = e.u)(b)
            };
            var a = d && d.prototype instanceof Uint8Array && "set" === d.prototype.set.name ? function (b, c, k) {
                c.set(b, k)
            } : function (b, c, k) {
                if (b.copy) b.copy(c, k, 0, b.length); else for (var l = 0; l < b.length;) c[k++] = b[l++]
            };
            h.prototype.bytes = function (b) {
                e.isString(b) && (b = e.r(b, "base64"));
                var c = b.length >>> 0;
                return this.uint32(c), c && this.e(a, c, b), this
            };
            h.prototype.string = function (b) {
                var c = d.byteLength(b);
                return this.uint32(c), c && this.e(m, c, b), this
            }
        }, {15: 15, 16: 16}]
    };
    var A = {};
    var r = function h(w) {
        var m = A[w];
        return m || y[w][0].call(m = A[w] = {exports: {}}, h, m, m.exports), m.exports
    }(8);
    r.util.global.protobuf = r;
    "function" == typeof define && define.amd && define(["long"], function (w) {
        return w && w.isLong && (r.util.Long = w, r.configure()), r
    });
    "object" == typeof module && module && module.exports && (module.exports = r)
}();
(function (z) {
    var y = z.Reader, A = z.Writer, r = z.util, p = z.roots["default"] || (z.roots["default"] = {});
    p.bilibili = function () {
        var w = {};
        w.community = function () {
            var h = {};
            h.service = function () {
                var m = {};
                m.dm = function () {
                    var n = {};
                    n.v1 = function () {
                        var e = {};
                        e.DmWebViewReply = function () {
                            function d(a) {
                                this.specialDms = [];
                                if (a) for (var b = Object.keys(a), c = 0; c < b.length; ++c) null != a[b[c]] && (this[b[c]] = a[b[c]])
                            }

                            d.prototype.state = 0;
                            d.prototype.text = "";
                            d.prototype.textSide = "";
                            d.prototype.dmSge = null;
                            d.prototype.flag = null;
                            d.prototype.specialDms = r.emptyArray;
                            d.create = function (a) {
                                return new d(a)
                            };
                            d.encode = function (a, b) {
                                b || (b = A.create());
                                null != a.state && Object.hasOwnProperty.call(a, "state") && b.uint32(8).int32(a.state);
                                null != a.text && Object.hasOwnProperty.call(a, "text") && b.uint32(18).string(a.text);
                                null != a.textSide && Object.hasOwnProperty.call(a, "textSide") && b.uint32(26).string(a.textSide);
                                null != a.dmSge && Object.hasOwnProperty.call(a, "dmSge") && p.bilibili.community.service.dm.v1.DmSegConfig.encode(a.dmSge, b.uint32(34).fork()).ldelim();
                                null != a.flag && Object.hasOwnProperty.call(a, "flag") && p.bilibili.community.service.dm.v1.DanmakuFlagConfig.encode(a.flag, b.uint32(42).fork()).ldelim();
                                if (null != a.specialDms && a.specialDms.length) for (var c = 0; c < a.specialDms.length; ++c) b.uint32(50).string(a.specialDms[c]);
                                return b
                            };
                            d.encodeDelimited = function (a, b) {
                                return this.encode(a, b).ldelim()
                            };
                            d.decode = function (a, b) {
                                a instanceof y || (a = y.create(a));
                                for (var c = void 0 === b ? a.len : a.pos + b, k = new p.bilibili.community.service.dm.v1.DmWebViewReply; a.pos < c;) {
                                    var l = a.uint32();
                                    switch (l >>> 3) {
                                        case 1:
                                            k.state = a.int32();
                                            break;
                                        case 2:
                                            k.text = a.string();
                                            break;
                                        case 3:
                                            k.textSide = a.string();
                                            break;
                                        case 4:
                                            k.dmSge = p.bilibili.community.service.dm.v1.DmSegConfig.decode(a, a.uint32());
                                            break;
                                        case 5:
                                            k.flag = p.bilibili.community.service.dm.v1.DanmakuFlagConfig.decode(a, a.uint32());
                                            break;
                                        case 6:
                                            k.specialDms && k.specialDms.length || (k.specialDms = []);
                                            k.specialDms.push(a.string());
                                            break;
                                        default:
                                            a.skipType(l & 7)
                                    }
                                }
                                return k
                            };
                            d.decodeDelimited = function (a) {
                                a instanceof y || (a = new y(a));
                                return this.decode(a, a.uint32())
                            };
                            d.verify = function (a) {
                                if ("object" !== typeof a || null === a) return "object expected";
                                if (null != a.state && a.hasOwnProperty("state") && !r.isInteger(a.state)) return "state: integer expected";
                                if (null != a.text && a.hasOwnProperty("text") && !r.isString(a.text)) return "text: string expected";
                                if (null != a.textSide && a.hasOwnProperty("textSide") && !r.isString(a.textSide)) return "textSide: string expected";
                                if (null != a.dmSge && a.hasOwnProperty("dmSge")) {
                                    var b = p.bilibili.community.service.dm.v1.DmSegConfig.verify(a.dmSge);
                                    if (b) return "dmSge." + b
                                }
                                if (null != a.flag && a.hasOwnProperty("flag") && (b = p.bilibili.community.service.dm.v1.DanmakuFlagConfig.verify(a.flag))) return "flag." + b;
                                if (null != a.specialDms && a.hasOwnProperty("specialDms")) {
                                    if (!Array.isArray(a.specialDms)) return "specialDms: array expected";
                                    for (b = 0; b < a.specialDms.length; ++b) if (!r.isString(a.specialDms[b])) return "specialDms: string[] expected"
                                }
                                return null
                            };
                            d.fromObject = function (a) {
                                if (a instanceof p.bilibili.community.service.dm.v1.DmWebViewReply) return a;
                                var b = new p.bilibili.community.service.dm.v1.DmWebViewReply;
                                null != a.state && (b.state = a.state | 0);
                                null != a.text && (b.text = String(a.text));
                                null != a.textSide && (b.textSide = String(a.textSide));
                                if (null != a.dmSge) {
                                    if ("object" !== typeof a.dmSge) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.dmSge: object expected");
                                    b.dmSge = p.bilibili.community.service.dm.v1.DmSegConfig.fromObject(a.dmSge)
                                }
                                if (null != a.flag) {
                                    if ("object" !== typeof a.flag) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.flag: object expected");
                                    b.flag = p.bilibili.community.service.dm.v1.DanmakuFlagConfig.fromObject(a.flag)
                                }
                                if (a.specialDms) {
                                    if (!Array.isArray(a.specialDms)) throw TypeError(".bilibili.community.service.dm.v1.DmWebViewReply.specialDms: array expected");
                                    b.specialDms = [];
                                    for (var c = 0; c < a.specialDms.length; ++c) b.specialDms[c] = String(a.specialDms[c])
                                }
                                return b
                            };
                            d.toObject = function (a, b) {
                                b || (b = {});
                                var c = {};
                                if (b.arrays || b.defaults) c.specialDms = [];
                                b.defaults && (c.state = 0, c.text = "", c.textSide = "", c.dmSge = null, c.flag = null);
                                null != a.state && a.hasOwnProperty("state") && (c.state = a.state);
                                null != a.text && a.hasOwnProperty("text") && (c.text = a.text);
                                null != a.textSide && a.hasOwnProperty("textSide") && (c.textSide = a.textSide);
                                null != a.dmSge && a.hasOwnProperty("dmSge") && (c.dmSge = p.bilibili.community.service.dm.v1.DmSegConfig.toObject(a.dmSge, b));
                                null != a.flag && a.hasOwnProperty("flag") && (c.flag = p.bilibili.community.service.dm.v1.DanmakuFlagConfig.toObject(a.flag, b));
                                if (a.specialDms && a.specialDms.length) {
                                    c.specialDms = [];
                                    for (var k = 0; k < a.specialDms.length; ++k) c.specialDms[k] = a.specialDms[k]
                                }
                                return c
                            };
                            d.prototype.toJSON = function () {
                                return this.constructor.toObject(this, z.util.toJSONOptions)
                            };
                            return d
                        }();
                        e.DmSegConfig = function () {
                            function d(a) {
                                if (a) for (var b = Object.keys(a), c = 0; c < b.length; ++c) null != a[b[c]] && (this[b[c]] = a[b[c]])
                            }

                            d.prototype.pageSize = r.Long ? r.Long.fromBits(0, 0, !1) : 0;
                            d.prototype.total = r.Long ? r.Long.fromBits(0, 0, !1) : 0;
                            d.create = function (a) {
                                return new d(a)
                            };
                            d.encode = function (a, b) {
                                b || (b = A.create());
                                null != a.pageSize && Object.hasOwnProperty.call(a, "pageSize") && b.uint32(8).int64(a.pageSize);
                                null != a.total && Object.hasOwnProperty.call(a, "total") && b.uint32(16).int64(a.total);
                                return b
                            };
                            d.encodeDelimited = function (a, b) {
                                return this.encode(a, b).ldelim()
                            };
                            d.decode = function (a, b) {
                                a instanceof y || (a = y.create(a));
                                for (var c = void 0 === b ? a.len : a.pos + b, k = new p.bilibili.community.service.dm.v1.DmSegConfig; a.pos < c;) {
                                    var l = a.uint32();
                                    switch (l >>> 3) {
                                        case 1:
                                            k.pageSize = a.int64();
                                            break;
                                        case 2:
                                            k.total = a.int64();
                                            break;
                                        default:
                                            a.skipType(l & 7)
                                    }
                                }
                                return k
                            };
                            d.decodeDelimited = function (a) {
                                a instanceof y || (a = new y(a));
                                return this.decode(a, a.uint32())
                            };
                            d.verify = function (a) {
                                return "object" !== typeof a || null === a ? "object expected" : null == a.pageSize || !a.hasOwnProperty("pageSize") || r.isInteger(a.pageSize) || a.pageSize && r.isInteger(a.pageSize.low) && r.isInteger(a.pageSize.high) ? null == a.total || !a.hasOwnProperty("total") || r.isInteger(a.total) || a.total && r.isInteger(a.total.low) && r.isInteger(a.total.high) ? null : "total: integer|Long expected" : "pageSize: integer|Long expected"
                            };
                            d.fromObject = function (a) {
                                if (a instanceof p.bilibili.community.service.dm.v1.DmSegConfig) return a;
                                var b = new p.bilibili.community.service.dm.v1.DmSegConfig;
                                null != a.pageSize && (r.Long ? (b.pageSize = r.Long.fromValue(a.pageSize)).unsigned = !1 : "string" === typeof a.pageSize ? b.pageSize = parseInt(a.pageSize, 10) : "number" === typeof a.pageSize ? b.pageSize = a.pageSize : "object" === typeof a.pageSize && (b.pageSize = (new r.LongBits(a.pageSize.low >>> 0, a.pageSize.high >>> 0)).toNumber()));
                                null != a.total && (r.Long ? (b.total = r.Long.fromValue(a.total)).unsigned = !1 : "string" === typeof a.total ? b.total = parseInt(a.total, 10) : "number" === typeof a.total ? b.total = a.total : "object" === typeof a.total && (b.total = (new r.LongBits(a.total.low >>> 0, a.total.high >>> 0)).toNumber()));
                                return b
                            };
                            d.toObject = function (a, b) {
                                b || (b = {});
                                var c = {};
                                if (b.defaults) {
                                    if (r.Long) {
                                        var k = new r.Long(0, 0, !1);
                                        c.pageSize = b.longs === String ? k.toString() : b.longs === Number ? k.toNumber() : k
                                    } else c.pageSize = b.longs === String ? "0" : 0;
                                    r.Long ? (k = new r.Long(0, 0, !1), c.total = b.longs === String ? k.toString() : b.longs === Number ? k.toNumber() : k) : c.total = b.longs === String ? "0" : 0
                                }
                                null != a.pageSize && a.hasOwnProperty("pageSize") && (c.pageSize = "number" === typeof a.pageSize ? b.longs === String ? String(a.pageSize) : a.pageSize : b.longs === String ? r.Long.prototype.toString.call(a.pageSize) : b.longs === Number ? (new r.LongBits(a.pageSize.low >>> 0, a.pageSize.high >>> 0)).toNumber() : a.pageSize);
                                null != a.total && a.hasOwnProperty("total") && (c.total = "number" === typeof a.total ? b.longs === String ? String(a.total) : a.total : b.longs === String ? r.Long.prototype.toString.call(a.total) : b.longs === Number ? (new r.LongBits(a.total.low >>> 0, a.total.high >>> 0)).toNumber() : a.total);
                                return c
                            };
                            d.prototype.toJSON = function () {
                                return this.constructor.toObject(this, z.util.toJSONOptions)
                            };
                            return d
                        }();
                        e.DanmakuFlagConfig = function () {
                            function d(a) {
                                if (a) for (var b = Object.keys(a), c = 0; c < b.length; ++c) null != a[b[c]] && (this[b[c]] = a[b[c]])
                            }

                            d.prototype.recFlag = 0;
                            d.prototype.recText = "";
                            d.prototype.recSwitch = 0;
                            d.create = function (a) {
                                return new d(a)
                            };
                            d.encode = function (a, b) {
                                b || (b = A.create());
                                null != a.recFlag && Object.hasOwnProperty.call(a, "recFlag") && b.uint32(8).int32(a.recFlag);
                                null != a.recText && Object.hasOwnProperty.call(a, "recText") && b.uint32(18).string(a.recText);
                                null != a.recSwitch && Object.hasOwnProperty.call(a, "recSwitch") && b.uint32(24).int32(a.recSwitch);
                                return b
                            };
                            d.encodeDelimited = function (a, b) {
                                return this.encode(a, b).ldelim()
                            };
                            d.decode = function (a, b) {
                                a instanceof y || (a = y.create(a));
                                for (var c = void 0 === b ? a.len : a.pos + b, k = new p.bilibili.community.service.dm.v1.DanmakuFlagConfig; a.pos < c;) {
                                    var l = a.uint32();
                                    switch (l >>> 3) {
                                        case 1:
                                            k.recFlag = a.int32();
                                            break;
                                        case 2:
                                            k.recText = a.string();
                                            break;
                                        case 3:
                                            k.recSwitch = a.int32();
                                            break;
                                        default:
                                            a.skipType(l & 7)
                                    }
                                }
                                return k
                            };
                            d.decodeDelimited = function (a) {
                                a instanceof y || (a = new y(a));
                                return this.decode(a, a.uint32())
                            };
                            d.verify = function (a) {
                                return "object" !== typeof a || null === a ? "object expected" : null != a.recFlag && a.hasOwnProperty("recFlag") && !r.isInteger(a.recFlag) ? "recFlag: integer expected" : null != a.recText && a.hasOwnProperty("recText") && !r.isString(a.recText) ? "recText: string expected" : null != a.recSwitch && a.hasOwnProperty("recSwitch") && !r.isInteger(a.recSwitch) ? "recSwitch: integer expected" : null
                            };
                            d.fromObject = function (a) {
                                if (a instanceof p.bilibili.community.service.dm.v1.DanmakuFlagConfig) return a;
                                var b = new p.bilibili.community.service.dm.v1.DanmakuFlagConfig;
                                null != a.recFlag && (b.recFlag = a.recFlag | 0);
                                null != a.recText && (b.recText = String(a.recText));
                                null != a.recSwitch && (b.recSwitch = a.recSwitch | 0);
                                return b
                            };
                            d.toObject = function (a, b) {
                                b || (b = {});
                                var c = {};
                                b.defaults && (c.recFlag = 0, c.recText = "", c.recSwitch = 0);
                                null != a.recFlag && a.hasOwnProperty("recFlag") && (c.recFlag = a.recFlag);
                                null != a.recText && a.hasOwnProperty("recText") && (c.recText = a.recText);
                                null != a.recSwitch && a.hasOwnProperty("recSwitch") && (c.recSwitch = a.recSwitch);
                                return c
                            };
                            d.prototype.toJSON = function () {
                                return this.constructor.toObject(this, z.util.toJSONOptions)
                            };
                            return d
                        }();
                        e.DmSegMobileReply = function () {
                            function d(a) {
                                this.elems = [];
                                if (a) for (var b = Object.keys(a), c = 0; c < b.length; ++c) null != a[b[c]] && (this[b[c]] = a[b[c]])
                            }

                            d.prototype.elems = r.emptyArray;
                            d.create = function (a) {
                                return new d(a)
                            };
                            d.encode = function (a, b) {
                                b || (b = A.create());
                                if (null != a.elems && a.elems.length) for (var c = 0; c < a.elems.length; ++c) p.bilibili.community.service.dm.v1.DanmakuElem.encode(a.elems[c], b.uint32(10).fork()).ldelim();
                                return b
                            };
                            d.encodeDelimited = function (a, b) {
                                return this.encode(a, b).ldelim()
                            };
                            d.decode = function (a, b) {
                                a instanceof y || (a = y.create(a));
                                for (var c = void 0 === b ? a.len : a.pos + b, k = new p.bilibili.community.service.dm.v1.DmSegMobileReply; a.pos < c;) {
                                    var l = a.uint32();
                                    switch (l >>> 3) {
                                        case 1:
                                            k.elems && k.elems.length || (k.elems = []);
                                            k.elems.push(p.bilibili.community.service.dm.v1.DanmakuElem.decode(a, a.uint32()));
                                            break;
                                        default:
                                            a.skipType(l & 7)
                                    }
                                }
                                return k
                            };
                            d.decodeDelimited = function (a) {
                                a instanceof y || (a = new y(a));
                                return this.decode(a, a.uint32())
                            };
                            d.verify = function (a) {
                                if ("object" !== typeof a || null === a) return "object expected";
                                if (null != a.elems && a.hasOwnProperty("elems")) {
                                    if (!Array.isArray(a.elems)) return "elems: array expected";
                                    for (var b = 0; b < a.elems.length; ++b) {
                                        var c = p.bilibili.community.service.dm.v1.DanmakuElem.verify(a.elems[b]);
                                        if (c) return "elems." + c
                                    }
                                }
                                return null
                            };
                            d.fromObject = function (a) {
                                if (a instanceof p.bilibili.community.service.dm.v1.DmSegMobileReply) return a;
                                var b = new p.bilibili.community.service.dm.v1.DmSegMobileReply;
                                if (a.elems) {
                                    if (!Array.isArray(a.elems)) throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.elems: array expected");
                                    b.elems = [];
                                    for (var c = 0; c < a.elems.length; ++c) {
                                        if ("object" !== typeof a.elems[c]) throw TypeError(".bilibili.community.service.dm.v1.DmSegMobileReply.elems: object expected");
                                        b.elems[c] = p.bilibili.community.service.dm.v1.DanmakuElem.fromObject(a.elems[c])
                                    }
                                }
                                return b
                            };
                            d.toObject = function (a, b) {
                                b || (b = {});
                                var c = {};
                                if (b.arrays || b.defaults) c.elems = [];
                                if (a.elems && a.elems.length) {
                                    c.elems = [];
                                    for (var k = 0; k < a.elems.length; ++k) c.elems[k] = p.bilibili.community.service.dm.v1.DanmakuElem.toObject(a.elems[k], b)
                                }
                                return c
                            };
                            d.prototype.toJSON = function () {
                                return this.constructor.toObject(this, z.util.toJSONOptions)
                            };
                            return d
                        }();
                        e.DanmakuElem = function () {
                            function d(a) {
                                if (a) for (var b = Object.keys(a), c = 0; c < b.length; ++c) null != a[b[c]] && (this[b[c]] = a[b[c]])
                            }

                            d.prototype.id = r.Long ? r.Long.fromBits(0, 0, !1) : 0;
                            d.prototype.progress = 0;
                            d.prototype.mode = 0;
                            d.prototype.fontsize = 0;
                            d.prototype.color = 0;
                            d.prototype.midHash = "";
                            d.prototype.content = "";
                            d.prototype.ctime = r.Long ? r.Long.fromBits(0, 0, !1) : 0;
                            d.prototype.weight = 0;
                            d.prototype.action = "";
                            d.prototype.pool = 0;
                            d.prototype.idStr = "";
                            d.create = function (a) {
                                return new d(a)
                            };
                            d.encode = function (a, b) {
                                b || (b = A.create());
                                null != a.id && Object.hasOwnProperty.call(a, "id") && b.uint32(8).int64(a.id);
                                null != a.progress && Object.hasOwnProperty.call(a, "progress") && b.uint32(16).int32(a.progress);
                                null != a.mode && Object.hasOwnProperty.call(a, "mode") && b.uint32(24).int32(a.mode);
                                null != a.fontsize && Object.hasOwnProperty.call(a, "fontsize") && b.uint32(32).int32(a.fontsize);
                                null != a.color && Object.hasOwnProperty.call(a, "color") && b.uint32(40).uint32(a.color);
                                null != a.midHash && Object.hasOwnProperty.call(a, "midHash") && b.uint32(50).string(a.midHash);
                                null != a.content && Object.hasOwnProperty.call(a, "content") && b.uint32(58).string(a.content);
                                null != a.ctime && Object.hasOwnProperty.call(a, "ctime") && b.uint32(64).int64(a.ctime);
                                null != a.weight && Object.hasOwnProperty.call(a, "weight") && b.uint32(72).int32(a.weight);
                                null != a.action && Object.hasOwnProperty.call(a, "action") && b.uint32(82).string(a.action);
                                null != a.pool && Object.hasOwnProperty.call(a, "pool") && b.uint32(88).int32(a.pool);
                                null != a.idStr && Object.hasOwnProperty.call(a, "idStr") && b.uint32(98).string(a.idStr);
                                return b
                            };
                            d.encodeDelimited = function (a, b) {
                                return this.encode(a, b).ldelim()
                            };
                            d.decode = function (a, b) {
                                a instanceof y || (a = y.create(a));
                                for (var c = void 0 === b ? a.len : a.pos + b, k = new p.bilibili.community.service.dm.v1.DanmakuElem; a.pos < c;) {
                                    var l = a.uint32();
                                    switch (l >>> 3) {
                                        case 1:
                                            k.id = a.int64();
                                            break;
                                        case 2:
                                            k.progress = a.int32();
                                            break;
                                        case 3:
                                            k.mode = a.int32();
                                            break;
                                        case 4:
                                            k.fontsize = a.int32();
                                            break;
                                        case 5:
                                            k.color = a.uint32();
                                            break;
                                        case 6:
                                            k.midHash = a.string();
                                            break;
                                        case 7:
                                            k.content = a.string();
                                            break;
                                        case 8:
                                            k.ctime = a.int64();
                                            break;
                                        case 9:
                                            k.weight = a.int32();
                                            break;
                                        case 10:
                                            k.action = a.string();
                                            break;
                                        case 11:
                                            k.pool = a.int32();
                                            break;
                                        case 12:
                                            k.idStr = a.string();
                                            break;
                                        default:
                                            a.skipType(l & 7)
                                    }
                                }
                                return k
                            };
                            d.decodeDelimited = function (a) {
                                a instanceof y || (a = new y(a));
                                return this.decode(a, a.uint32())
                            };
                            d.verify = function (a) {
                                return "object" !== typeof a || null === a ? "object expected" : null == a.id || !a.hasOwnProperty("id") || r.isInteger(a.id) || a.id && r.isInteger(a.id.low) && r.isInteger(a.id.high) ? null != a.progress && a.hasOwnProperty("progress") && !r.isInteger(a.progress) ? "progress: integer expected" : null != a.mode && a.hasOwnProperty("mode") && !r.isInteger(a.mode) ? "mode: integer expected" : null != a.fontsize && a.hasOwnProperty("fontsize") && !r.isInteger(a.fontsize) ? "fontsize: integer expected" : null != a.color && a.hasOwnProperty("color") && !r.isInteger(a.color) ? "color: integer expected" : null != a.midHash && a.hasOwnProperty("midHash") && !r.isString(a.midHash) ? "midHash: string expected" : null != a.content && a.hasOwnProperty("content") && !r.isString(a.content) ? "content: string expected" : null == a.ctime || !a.hasOwnProperty("ctime") || r.isInteger(a.ctime) || a.ctime && r.isInteger(a.ctime.low) && r.isInteger(a.ctime.high) ? null != a.weight && a.hasOwnProperty("weight") && !r.isInteger(a.weight) ? "weight: integer expected" : null != a.action && a.hasOwnProperty("action") && !r.isString(a.action) ? "action: string expected" : null != a.pool && a.hasOwnProperty("pool") && !r.isInteger(a.pool) ? "pool: integer expected" : null != a.idStr && a.hasOwnProperty("idStr") && !r.isString(a.idStr) ? "idStr: string expected" : null : "ctime: integer|Long expected" : "id: integer|Long expected"
                            };
                            d.fromObject = function (a) {
                                if (a instanceof p.bilibili.community.service.dm.v1.DanmakuElem) return a;
                                var b = new p.bilibili.community.service.dm.v1.DanmakuElem;
                                null != a.id && (r.Long ? (b.id = r.Long.fromValue(a.id)).unsigned = !1 : "string" === typeof a.id ? b.id = parseInt(a.id, 10) : "number" === typeof a.id ? b.id = a.id : "object" === typeof a.id && (b.id = (new r.LongBits(a.id.low >>> 0, a.id.high >>> 0)).toNumber()));
                                null != a.progress && (b.progress = a.progress | 0);
                                null != a.mode && (b.mode = a.mode | 0);
                                null != a.fontsize && (b.fontsize = a.fontsize | 0);
                                null != a.color && (b.color = a.color >>> 0);
                                null != a.midHash && (b.midHash = String(a.midHash));
                                null != a.content && (b.content = String(a.content));
                                null != a.ctime && (r.Long ? (b.ctime = r.Long.fromValue(a.ctime)).unsigned = !1 : "string" === typeof a.ctime ? b.ctime = parseInt(a.ctime, 10) : "number" === typeof a.ctime ? b.ctime = a.ctime : "object" === typeof a.ctime && (b.ctime = (new r.LongBits(a.ctime.low >>> 0, a.ctime.high >>> 0)).toNumber()));
                                null != a.weight && (b.weight = a.weight | 0);
                                null != a.action && (b.action = String(a.action));
                                null != a.pool && (b.pool = a.pool | 0);
                                null != a.idStr && (b.idStr = String(a.idStr));
                                return b
                            };
                            d.toObject = function (a, b) {
                                b || (b = {});
                                var c = {};
                                if (b.defaults) {
                                    if (r.Long) {
                                        var k = new r.Long(0, 0, !1);
                                        c.id = b.longs === String ? k.toString() : b.longs === Number ? k.toNumber() : k
                                    } else c.id = b.longs === String ? "0" : 0;
                                    c.progress = 0;
                                    c.mode = 0;
                                    c.fontsize = 0;
                                    c.color = 0;
                                    c.midHash = "";
                                    c.content = "";
                                    r.Long ? (k = new r.Long(0, 0, !1), c.ctime = b.longs === String ? k.toString() : b.longs === Number ? k.toNumber() : k) : c.ctime = b.longs === String ? "0" : 0;
                                    c.weight = 0;
                                    c.action = "";
                                    c.pool = 0;
                                    c.idStr = ""
                                }
                                null != a.id && a.hasOwnProperty("id") && (c.id = "number" === typeof a.id ? b.longs === String ? String(a.id) : a.id : b.longs === String ? r.Long.prototype.toString.call(a.id) : b.longs === Number ? (new r.LongBits(a.id.low >>> 0, a.id.high >>> 0)).toNumber() : a.id);
                                null != a.progress && a.hasOwnProperty("progress") && (c.progress = a.progress);
                                null != a.mode && a.hasOwnProperty("mode") && (c.mode = a.mode);
                                null != a.fontsize && a.hasOwnProperty("fontsize") && (c.fontsize = a.fontsize);
                                null != a.color && a.hasOwnProperty("color") && (c.color = a.color);
                                null != a.midHash && a.hasOwnProperty("midHash") && (c.midHash = a.midHash);
                                null != a.content && a.hasOwnProperty("content") && (c.content = a.content);
                                null != a.ctime && a.hasOwnProperty("ctime") && (c.ctime = "number" === typeof a.ctime ? b.longs === String ? String(a.ctime) : a.ctime : b.longs === String ? r.Long.prototype.toString.call(a.ctime) : b.longs === Number ? (new r.LongBits(a.ctime.low >>> 0, a.ctime.high >>> 0)).toNumber() : a.ctime);
                                null != a.weight && a.hasOwnProperty("weight") && (c.weight = a.weight);
                                null != a.action && a.hasOwnProperty("action") && (c.action = a.action);
                                null != a.pool && a.hasOwnProperty("pool") && (c.pool = a.pool);
                                null != a.idStr && a.hasOwnProperty("idStr") && (c.idStr = a.idStr);
                                return c
                            };
                            d.prototype.toJSON = function () {
                                return this.constructor.toObject(this, z.util.toJSONOptions)
                            };
                            return d
                        }();
                        return e
                    }();
                    return n
                }();
                return m
            }();
            return h
        }();
        return w
    }();
    return p
})(protobuf);
let proto_seg = protobuf.roots["default"].bilibili.community.service.dm.v1.DmSegMobileReply;

function server(broadcastChannel) {

    let videoPublishDate = null

    let [downloadDanmaku, downloadDanmakuToZip, allProtobufDanmu, concatDanmaku] = (function () {
        function htmlEscape(text, skipQuot) {
            if (!text) return text
            text = text.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f\ufffe\uffff]/g, ' ')

            function fn(match, pos, originalText) {
                switch (match) {
                    case "<":
                        return "&lt;";
                    case ">":
                        return "&gt;";
                    case "&":
                        return "&amp;";
                    case "\"":
                        return '"';
                }
            }

            if (!skipQuot) {
                return text.replace(/[<>"&]/g, fn);
            } else {
                return text.replace(/[<>&]/g, fn);

            }
        }


        async function loadProtoDanmu(url, timeout = null, header = null, retry = 0) {
            if (header === null) {
                header = {
                    "referer": 'https://www.bilibili.com/bangumi/play/ep790784',
                    origin: 'https://www.bilibili.com',
                    'sec-fetch-site': 'same-site'
                }
            }
            while (true) {
                try {
                    let result = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            responseType: 'arraybuffer',
                            headers: header,
                            timeout: timeout || 30000,
                            withCredentials: true,
                            onload: (response) => {
                                if (response.status === 200) {
                                    let lpdanmu;
                                    try {
                                        lpdanmu = proto_seg.decode(new Uint8Array(response.response));
                                    } catch (e) {
                                        if (response.responseText.indexOf('-101') !== -1) {
                                            alert("历史弹幕下载失败. 请检查该浏览器中B站是否未登录账号\n" + response.responseText)
                                            window.location.href = "https://space.bilibili.com/0"
                                        }
                                        console.log('XhrError=', retry);
                                        if (retry < 3) {
                                            return resolve(loadProtoDanmu(url, timeout, header, retry + 1));
                                        } else {
                                            return resolve(null);
                                        }
                                    }
                                    try {
                                        lpdanmu.elems.forEach((e) => {
                                            if (!e.progress) e.progress = 0;
                                        });
                                        resolve(lpdanmu.elems);
                                    } catch (e) {
                                        console.log(e.stack);
                                        resolve([]);
                                    }
                                } else if (response.status === 304) {
                                    resolve([]);
                                } else {
                                    console.log(response.status, response);
                                    resolve(null);
                                }
                            },
                            onerror: (error) => {
                                console.log('XhrError=', retry);
                                retry += 1;
                                if (retry > 3) {
                                    setTimeout(() => resolve(null), 10 * 1000);
                                } else {
                                    setTimeout(() => resolve(null), retry * 2 * 1000);
                                }
                            },
                        });
                    });
                    if (pageSetting.suspendDownload) {
                        return result
                    }

                    if (result === null) {
                        retry += 1;
                    } else {
                        return result;
                    }
                } catch (e) {
                    console.log('XhrError=', retry);
                    retry += 1;
                }
                await sleep(1000)
                if (retry > 3) {
                    setTimeout(() => resolve(null), 10 * 1000);
                } else {
                    setTimeout(() => resolve(null), retry * 2 * 1000);
                }
            }
        }

        function savedanmuStandalone(ldanmu, info = null) {
            var end, head;
            head = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><i><chatserver>chat.bilibili.com</chatserver><chatid>0</chatid><mission>0</mission><maxlimit>0</maxlimit><state>0</state><real_name>0</real_name><source>DF</source>"
            end = "</i>";
            if (info) {
                head += '<info>' + htmlEscape(JSON.stringify(info), true) + '</info>';
            }
            return head + ldanmu.join('') + end
        }


        function danmuObject2XML(ldanmu) {
            for (let i = 0, length = ldanmu.length; i < length; i++) {
                let danmu = ldanmu[i]
                ldanmu[i] = `<d p="${(danmu.progress ? danmu.progress : 0) / 1000},${danmu.mode},${danmu.fontsize},${danmu.color},${danmu.ctime},${0},${danmu.midHash},${danmu.id}">${htmlEscape(danmu.content)}</d>`
            }
            return ldanmu
        }


        async function moreHistory(cid) {
            let date = new Date();
            if (videoPublishDate && currentSetting.capturePeriodEnd !== -1) {
                date.setTime((videoPublishDate + currentSetting.capturePeriodEnd * 86400) * 1000)
            } else {
                date.setTime(date.getTime())
            }
            console.log('GetDanmuFor CID' + cid)
            let aldanmu = [], ldanmu = []
            let firstdate = 0;
            let ndanmu, ondanmu
            let url = 'https://comment.bilibili.com/' + cid + '.xml'
            let sdanmu = await xhrGet(url)
            ondanmu = ndanmu = Number(/<maxlimit>(.*?)</.exec(sdanmu)[1])
            while (true) {
                if (firstdate !== 0) {
                    await sleep(2000)
                }
                if (firstdate === 0 || ldanmu.length >= Math.min(ondanmu, 5000) * 0.5) {
                    let url = "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&date=" + dateObjectToDateStr(date) + "&oid=" + cid.toString();
                    console.log('ndanmu:', aldanmu.length, dateObjectToDateStr(date), url);
                    ldanmu = await loadProtoDanmu(url)

                }
                if (ldanmu !== null) {
                    aldanmu = mergeDanmu(aldanmu, ldanmu)
                }
                if (pageSetting.suspendDownload) {
                    return [aldanmu, ondanmu]
                }
                document.title = aldanmu.length.toString()
                toastText(dateObjectToDateStr(date) + '/' + aldanmu.length)
                if (ldanmu.length < Math.min(ondanmu, 5000) * 0.5) {
                    return [aldanmu, ondanmu]
                }
                if (ldanmu.length >= Math.min(ondanmu, 5000) * 0.5) {
                    let tfirstdate = getMinDate(ldanmu)
                    if (firstdate !== 0 && firstdate - tfirstdate < 86400) tfirstdate = firstdate - 86400;
                    firstdate = tfirstdate;
                    date.setTime(firstdate * 1000);
                }
                if (videoPublishDate && currentSetting.capturePeriodStart !== 0) {
                    if (videoPublishDate + currentSetting.capturePeriodStart > date.getTime() / 1000) {
                        return [aldanmu, ondanmu]
                    }
                }
            }
        }


        function timestampToFullDateStr(timestamp) {
            const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
            const day = date.getDate().toString().padStart(2, '0');
            const hour = date.getHours().toString().padStart(2, '0');
            const minute = date.getMinutes().toString().padStart(2, '0');
            const second = date.getSeconds().toString().padStart(2, '0');

            return `${year}-${month}-${day}-${hour}-${minute}-${second}`;
        }


        function dateObjectToDateStr(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed
            const day = date.getDate().toString().padStart(2, '0');

            return `${year}-${month}-${day}`;
        }


        function getMinDate(ldanmu) {
            let minDate = ldanmu[0].ctime
            for (let danmu of ldanmu) {
                if (minDate > danmu.ctime) {
                    minDate = danmu.ctime
                }
            }
            return minDate
        }

        function mergeDanmu(oldanmu, nldanmu) {
            if (oldanmu.idPool === undefined) {

                let idPool = new Set()
                for (let danmu of oldanmu) {
                    try {
                        idPool.add(danmu.progress * danmu.content.length * parseInt(danmu.midHash, 16))

                    } catch (e) {
                        console.log(danmu)
                        console.log(e)
                        throw e
                    }
                }
                oldanmu.idPool = idPool
            }
            try {
                for (let danmu of nldanmu) {
                    let ida = (danmu.progress ? danmu.progress : 1) * danmu.content.length * parseInt(danmu.midHash, 16)
                    if (!oldanmu.idPool.has(ida)) {
                        oldanmu.push(danmu)
                        oldanmu.idPool.add(ida)
                    }
                }
            } catch (e) {
                console.log()
            }

            return oldanmu
        }

        function poolSize2Duration(poolSize) {
            let lPoolSize = [[0, 100], [30, 300], [60, 500], [180, 1000], [600, 1500], [900, 3000], [1500, 4000], [2400, 6000], [3600, 8000],]

            for (let i = 0; i < lPoolSize.length; i += 1) {
                if (poolSize === lPoolSize[i][1]) {
                    return lPoolSize[i][0]
                }
            }
        }

        async function allProtobufDanmu(cid, duration) {
            toastText("实时弹幕:", cid)
            let segIndex = 0, aldanmu = []
            while (true) {
                segIndex += 1
                let tldanmu = await loadProtoDanmu('https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=' + cid + '&segment_index=' + segIndex)
                mergeDanmu(aldanmu, tldanmu)
                toastText(aldanmu.length)
                if ((!duration || segIndex * 360 > duration) && (!tldanmu || tldanmu.length === 0)) {
                    break
                }
                await sleep(500)
            }
            toastText('下载完成')
            return aldanmu
        }

        async function allProtobufDanmuXml(cid, title, ndanmu) {
            let result = new DownloadResult(await allProtobufDanmu(cid, poolSize2Duration(ndanmu)))
            downloadFile(validateTitle(title) + '.xml', result.toXml())
        }


        async function downloadDanmaku(cid, info) {
            toastText("全弹幕:" + cid)
            if (currentSetting.capturePeriodStart !== 0 || currentSetting.capturePeriodEnd !== -1) {
                toastText("下载时段:第" + currentSetting.capturePeriodStart + '-' + currentSetting.capturePeriodEnd + '天')
                toastText(videoPublishDate ? "视频发布日期:" + dateObjectToDateStr(new Date(videoPublishDate * 1000)) : "未知日期:由弹幕判断")
            }
            let [ldanmu, ndanmu] = await moreHistory(cid)
            if (!info) {
                info = {}
            }
            info.cid = cid
            info.ndanmu = ndanmu
            if (!pageSetting.suspendDownload) {
                // if (ldanmu.length > ndanmu * 2 || ((currentSetting.capturePeriodStart !== 0 || currentSetting.capturePeriodEnd !== -1) && ldanmu.length > ndanmu * 0.8)) {
                let sldanmu = await allProtobufDanmu(cid, poolSize2Duration(ndanmu))
                mergeDanmu(ldanmu, sldanmu)
                // }
                if (currentSetting.capturePeriodStart !== 0 || currentSetting.capturePeriodEnd !== -1) {
                    let publishDate = videoPublishDate || getMinDate(ldanmu)
                    let start = publishDate + currentSetting.capturePeriodStart * 86400 - 1
                    let end = currentSetting.capturePeriodEnd > 0 ? publishDate + currentSetting.capturePeriodEnd * 86400 : 1e12
                    console.log('before', ldanmu.length)
                    ldanmu = ldanmu.filter(danmu => {
                        return danmu.ctime > start && danmu.ctime < end
                    })
                    console.log('after', ldanmu.length)
                }


                toastText('下载完成')
                return new DownloadResult(ldanmu, info)
            } else {
                toastText('下载中断, 下载临时弹幕')
                info.isSuspend = true
                return new DownloadResult(ldanmu, info)
            }
        }

        class DownloadResult {
            constructor(ldanmu, info) {
                this.ldanmu = ldanmu
                this.info = info
            }

            toXml(sortByProgress = true) {
                if (sortByProgress) {
                    this.ldanmu.sort((a, b) => {
                        return a.progress - b.progress
                    })
                }
                return savedanmuStandalone(danmuObject2XML(this.ldanmu), this.info)
            }

            dumpFile(title) {
                downloadFile(validateTitle(title) + '.xml', this.toXml())
            }

            splitByTime(folder) {
                this.ldanmu.sort((a, b) => {
                    return a.ctime - b.ctime
                })

                let i = 0
                const chunkSize = 3000
                while (i * chunkSize < this.ldanmu.length) {
                    let tldanmu = this.ldanmu.slice(i * chunkSize, (i + 1) * chunkSize)
                    let lastTs = tldanmu[tldanmu.length - 1].ctime
                    let fileName = timestampToFullDateStr(lastTs) + '_' + this.info.cid + '.xml'
                    folder.file(fileName, new DownloadResult(tldanmu, this.info).toXml(false))
                    i += 1
                }
            }
        }

        async function downloadDanmakuToZip(cid, folder, partTitle, partInfo, spiltFileFlag) {
            let result = await downloadDanmaku(cid, '', partInfo)
            if (!spiltFileFlag) {
                let sdanmu = result.toXml()
                await sleep(1);
                folder.file(partTitle + '.xml', sdanmu)
                await sleep(1);
            } else {
                let partFolder = folder.folder(partTitle)
                result.splitByTime(partFolder)
            }
        }

        async function concatDanmaku(videoInfo) {
            let aldanmu = []

            let posOffset = 0
            for (let partInfo of videoInfo.list) {
                let ldanmu = await allProtobufDanmu(partInfo.cid, partInfo.duration - partInfo.backBlack ?? 0)
                if (partInfo.backBlack) {
                    ldanmu = ldanmu.filter((danmu) => {
                        return danmu.progress < (partInfo.duration - partInfo.backBlack ?? 0) * 1000
                    })
                }
                if (partInfo.frontBlack) {
                    ldanmu.forEach((danmu) => {
                        danmu.progress -= (partInfo.frontBlack ?? 0) * 1000
                    })
                    ldanmu = ldanmu.filter((danmu) => {
                        return danmu.progress > 0
                    })
                }
                if (partInfo.partOffset) {
                    posOffset = partInfo.partOffset
                }
                ldanmu.forEach((danmu) => {
                    danmu.progress = danmu.progress + posOffset * 1000
                })
                posOffset += partInfo.duration - (partInfo.backBlack ?? 0) - (partInfo.frontBlack ?? 0)
                aldanmu = aldanmu.concat(ldanmu)
            }


            let result = new DownloadResult(aldanmu, videoInfo)
            downloadFile(
                `av${videoInfo.id} ${validateTitle(videoInfo.title)} P${videoInfo.list[0].page} ${validateTitle(videoInfo.list[0].part ?? videoInfo.list[0].title ?? '')}.xml`,
                result.toXml()
            )
        }

        return [downloadDanmaku,

            downloadDanmakuToZip,

            allProtobufDanmuXml,

            concatDanmaku
        ]
    })();

    let downloadDanmakuVideo = (() => {
        return async function (videoInfo) {
            let zip = new JSZip();
            let title
            let aid
            if (typeof videoInfo['aid'] === 'number') {
                aid = videoInfo['aid']
                title = 'av' + videoInfo['aid'] + ' ' + validateTitle(videoInfo['title'])
            } else {
                title = videoInfo['aid'] + ' ' + validateTitle(videoInfo['title'])
                aid = Number(videoInfo['aid'].substring(2))
            }
            title = validateTitle(title)
            console.log('title= ' + title)
            let folder = zip.folder(title)
            folder.file('videoInfo.json', JSON.stringify(videoInfo))
            let i = 0

            if (!videoInfo.isCache && (typeof videoInfo['aid'] === 'number' || videoInfo['aid'].startsWith('av'))) {
                try {
                    let pageList = JSON.parse(await xhrGet(`https://api.bilibili.com/x/player/pagelist?aid=${aid}&jsonp=jsonp`))
                    if (pageList.code === 0) {
                        for (let page of pageList['data']) {
                            let matched = false
                            for (let part of videoInfo['list']) {
                                if (part.cid === page.cid) {
                                    part.duration = page.duration
                                    matched = true
                                    break
                                }
                            }
                            if (!matched) {
                                videoInfo['list'].push(page)
                            }
                        }
                    }
                } catch (e) {
                    console.error(e, e.stack)
                }
            }


            if (videoInfo.videoPublishDate) {
                videoPublishDate = videoInfo.videoPublishDate
            }

            for (let partInfo of videoInfo['list']) {
                i += 1
                partInfo.title = partInfo.part
                partInfo.aid = aid
                let partTitle = getPartTitle(partInfo)
                if (partInfo.videoPublishDate) {
                    videoPublishDate = partInfo.videoPublishDate
                }
                toastText(partTitle)
                let progress = (i * 100 / videoInfo['list'].length).toFixed(2)
                document.title = progress + ' %'
                await downloadDanmakuToZip(partInfo.cid, folder, partTitle, partInfo, currentSetting['splitFileByTime'])
                broadcastChannel.postMessage({
                    type: 'cidComplete', cid: partInfo.cid, aid: videoInfo.aid, progress: progress,
                }, '*');
                if (partInfo.videoPublishDate) {
                    videoPublishDate = null
                }
            }
            let result = await zip.generateAsync({
                type: "blob", compression: "DEFLATE", compressionOptions: {
                    level: 9
                }
            })
            videoPublishDate = null
            downloadFile(title + '.zip', result);
        }
    })()

    let downloadedCid = []
    let downloadedAid = []
    let downloadingVideo = []
    broadcastChannel.addEventListener('message', async (e) => {
        if (e.data.type === 'biliplusDownloadDanmaku') {
            if (e.data.history !== false) {
                if (downloadedCid.indexOf(e.data.cid) !== -1) {
                    return
                }
                downloadedCid.push(e.data.cid);
                (await downloadDanmaku(e.data.cid, e.data)).dumpFile(e.data.title)
            } else {
                await allProtobufDanmu(e.data.cid, e.data.title, e.data.ndanmu)
            }
        }
        if (e.data.type === 'biliplusDownloadDanmakuVideo') {
            if (downloadedAid.indexOf(e.data.videoInfo.aid) !== -1) {
                broadcastChannel.postMessage({type: 'aidDownloaded', aid: e.data.videoInfo.aid}, '*');
                return
            }
            downloadedAid.push(e.data.videoInfo.aid)
            if (downloadingVideo.length === 0) {
                downloadingVideo.push(e.data.videoInfo)
                while (downloadingVideo.length !== 0) {
                    let videoInfo = downloadingVideo[0]
                    console.log('start', videoInfo.aid)
                    broadcastChannel.postMessage({type: 'aidStart', aid: videoInfo.aid}, '*');
                    await new Promise((resolve) => setTimeout(resolve, 1));
                    await downloadDanmakuVideo(videoInfo)
                    document.title = '下载完成'
                    broadcastChannel.postMessage({type: 'aidComplete', aid: videoInfo.aid}, '*');
                    await sleep(1000)
                    downloadingVideo = downloadingVideo.slice(1)
                }
            } else {
                console.log('wait', e.data.videoInfo.aid)
                downloadingVideo.push(e.data.videoInfo)
            }

        }
        if (e.data.type === 'concatDanmaku') {
            await concatDanmaku(e.data.videoInfo)
        }
    });
}


sleep(200).then(() => {
    if (new URL(window.location.href).searchParams.has("get_info")) {
        aidQuery(undefined, true)
    }
})

const broadcastChannel = new CustomEventEmitter()
client(broadcastChannel)
let currentSetting = panel()
let pageSetting = {
    frontBlack: undefined,
    backBlack: undefined,
    suspendDownload: false
}
server(broadcastChannel)

