// ==UserScript==
// @name         替换ddys（低端影视）播放器
// @namespace    https://github.com/s0urcelab/userscripts
// @version      1.6
// @description  替换ddys播放器，移除Adblock屏蔽，修复滚轮和全屏快捷键失效bug，优化选集和线路功能，自动记忆选集
// @author       s0urce
// @match        https://ddys.art/*
// @match        https://ddys.pro/*
// @icon         https://ddys.pro/favicon-16x16.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://fastly.jsdelivr.net/npm/xgplayer@2.31.2/browser/index.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464925/%E6%9B%BF%E6%8D%A2ddys%EF%BC%88%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%EF%BC%89%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/464925/%E6%9B%BF%E6%8D%A2ddys%EF%BC%88%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%EF%BC%89%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

const QS = (q) => document.querySelector(q)
const QSA = (q) => document.querySelectorAll(q)

const domain = window.location.hostname
const src4domain = `v.ddys.pro`

const globalStyle = `
.wp-playlist-tracks {
    display: none!important;
}
.wp-video-playlist {
    display: flex;
    padding: 0!important;
    border: none!important;
    background: none!important;
}
.entry > p {
    display: none;
}
.player-sider {
    width: 220px;
    display: flex;
    flex-direction: column;
    background-color: #2e2e2e;
    border-radius: 8px;
    margin-left: 10px;
    padding: 4px;
}
.tab-item {
    cursor: pointer;
    margin-bottom: 6px;
    padding: 8px;
    color: white;
    background-color: #5a5a5a;
    border-radius: 5px;
}
.tab-item.playing {
    font-weight: bold;
    color: #3a8fb7;
    background-color: #232323;
}
.tab-item:not(.playing):hover {
    background-color: #232323;
}
.tab-item > .indicator {
    height: 14px;
    width: 14px;
    font-size: 14px;
    margin-right: 5px;
}
`
function parseResUrl(d) {
    return { ...d, url: `https://${src4domain}${d[`src${d.srctype - 1}`]}` }
}
class Tabs {
    constructor(init) {
        this.root = init.root
        this.data = init.data
        this.onSelect = init.onSelect
        this.selectedKey = init.data[0].key
    }

    render(key = this.selectedKey) {
        // update selectedKey
        this.selectedKey = key
        // render dom
        this.root.innerHTML = this.data.reduce((acc, curr) => {
            const isTarget = key === curr.key
            return `${acc}
                <div class="tab-item ${isTarget ? 'playing' : ''}" data-tab-key="${curr.key}">
                ${isTarget ? '<img class="indicator" src="//s1.hdslb.com/bfs/static/jinkela/video/asserts/playing.gif"></img>' : ''}
                ${curr.label}
            </div>
            `
        }, '')
        // bind click
        const self = this
        for (const tabElment of this.root.children) {
            tabElment.onclick = function () {
                const tabKey = tabElment.dataset.tabKey
                const record = self.data.find(v => v.key === tabKey)
                self.render(tabKey)
                self.onSelect(tabKey, record)
            }
        }
    }
}

; (async function () {
    'use strict';

    const originContainer = QS('.wp-video-playlist')
    // cannot found Player, quit
    if (!originContainer) return;

    // inject global style
    GM_addStyle(globalStyle)
    // hide origin container
    for (const item of originContainer.children) {
        item.style.display = 'none'
    }

    // append container for xgplayer
    originContainer.innerHTML += `
    <div id="xgplayer"></div>
    <div class="player-sider">
    <div class="tabs-root"></div>
    </div>
    `
    // get video resource from page data
    const res = JSON.parse(QS('.wp-playlist-script').textContent)
    const resPromise = res.tracks
        .map((track, idx) => ({ ...track, key: `${idx + 1}`, label: track.caption }))
        .map(parseResUrl)
    const resGroups = await Promise.all(resPromise)

    // init xgplayer
    const initVolume = window.localStorage['volume'] ? parseFloat(window.localStorage['volume']) : 1
    const isWatched = window.localStorage[location.pathname]
    const initEp = isWatched ? JSON.parse(isWatched).ep : '1'
    const initPlayUrl = resGroups.find(v => v.key === initEp).url

    console.warn(`当前播放资源url：${initPlayUrl}`)
    const player = new window.Player({
        id: 'xgplayer',
        url: initPlayUrl,
        volume: initVolume,
        fluid: true,
        videoInit: true,
        lastPlayTimeHideDelay: 3,
        keyShortcut: 'on',
        keyShortcutStep: {
            currentTime: 10, //播放进度调整步长，默认10秒
        },
        ...isWatched && { lastPlayTime: JSON.parse(isWatched).seek },
    })

    // init tabs
    const tabs = new Tabs({
        root: QS('.tabs-root'),
        data: resGroups,
        onSelect: (key, record) => {
            console.warn(`切换选集：【${key}】${record.label}`)
            player.src = record.url
            console.warn(`当前播放资源url：${record.url}`)
            player.play()
        }
    })
    // render tabs
    tabs.render(initEp)

    // update video progress
    player.on('timeupdate', function ({ currentTime }) {
        window.localStorage[location.pathname] = JSON.stringify({
            seek: currentTime,
            ep: tabs.selectedKey,
        })
    })
    // update volume
    player.on('volumechange', function ({ volume }) {
        window.localStorage['volume'] = volume
    })

})()