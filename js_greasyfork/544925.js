// ==UserScript==
// @name         低端影视DDYS优化
// @namespace    https://github.com/zjjscwt/tampermonkey-script
// @version      1.2.2
// @description  替换为artplayer播放器，增加下一集和小窗功能。自动跳转至上次观看集数及时间。优化选集界面。
// @author       Ryan_CC
// @match        https://ddys.art/*
// @match        https://ddys.pro/*
// @match        https://ddys.mov/*
// @icon         https://ddys.pro/favicon-16x16.png
// @grant        GM_addStyle
// @require      https://fastly.jsdelivr.net/npm/artplayer@5.2.5/dist/artplayer.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544925/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86DDYS%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/544925/%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86DDYS%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 常量定义
    const $ = (q) => document.querySelector(q)
    const SRC_DOMAIN = 'v.ddys.pro'
    const STORAGE_KEY = location.pathname

    // 样式注入
    GM_addStyle(`
        .wp-playlist-tracks { display: none!important; }
        .wp-video-playlist { display: flex; flex-direction: column; padding: 0!important; border: none!important; background: none!important; }
        .entry > p { display: none; }
        #artplayer { width: 100%; height: 550px; margin-bottom: 15px; }
        .player-episodes { background-color: #2e2e2e; border-radius: 8px; padding: 15px; }
        .episodes-title { color: #fff; font-size: 16px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #3a8fb7; padding-bottom: 8px; }
        .tabs-root { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; max-height: 300px; overflow-y: auto; }
        .tabs-root::-webkit-scrollbar { width: 6px; }
        .tabs-root::-webkit-scrollbar-track { background: #1a1a1a; border-radius: 3px; }
        .tabs-root::-webkit-scrollbar-thumb { background: #5a5a5a; border-radius: 3px; }
        .tabs-root::-webkit-scrollbar-thumb:hover { background: #6a6a6a; }
        .tab-item { cursor: pointer; padding: 10px 12px; color: white; background-color: #5a5a5a; border-radius: 6px; text-align: center; font-size: 14px; transition: all 0.2s ease; border: 2px solid transparent; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tab-item.playing { font-weight: bold; color: #fff; background-color: #3a8fb7; border-color: #4a9fc7; box-shadow: 0 2px 8px rgba(58, 143, 183, 0.3); }
        .tab-item:not(.playing):hover { background-color: #6a6a6a; transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); }
        .tab-item > .indicator { display: inline-block; height: 14px; width: 14px; margin-right: 6px; vertical-align: middle; }
        /* 新增布局修改样式 */
        .post-box {width: 23% !important;margin-right: 1% !important;margin-bottom: 3% !important;}
        .post-box:nth-child(4n) {margin-right: 0 !important;}
        .single #header {position: relative !important;}
        .post-image {padding-bottom: 0% !important;}
        .post-content {padding: 1rem 7% !important;}
    `)

    // 工具函数
    const parseResUrl = (track, index) => ({
        ...track,
        key: String(index + 1),
        label: track.caption,
        url: `https://${SRC_DOMAIN}${track[`src${track.srctype - 1}`]}`
    })

    const getStoredData = () => {
        try {
            return JSON.parse(localStorage[STORAGE_KEY] || '{}')
        } catch {
            return {}
        }
    }

    const saveProgress = (currentTime, episode) => {
        localStorage[STORAGE_KEY] = JSON.stringify({ seek: currentTime, ep: episode })
    }

    // 选集标签管理
    class EpisodeTabs {
        constructor(container, episodes, onSelect) {
            this.container = container
            this.episodes = episodes
            this.onSelect = onSelect
            this.selectedKey = episodes[0]?.key
        }

        render(selectedKey = this.selectedKey) {
            this.selectedKey = selectedKey
            this.container.innerHTML = this.episodes.map(ep => {
                const isActive = ep.key === selectedKey
                return `
                    <div class="tab-item ${isActive ? 'playing' : ''}" data-key="${ep.key}">
                        ${isActive ? '<img class="indicator" src="//s1.hdslb.com/bfs/static/jinkela/video/asserts/playing.gif">' : ''}
                        ${ep.label}
                    </div>
                `
            }).join('')

            // 绑定点击事件
            this.container.onclick = (e) => {
                const item = e.target.closest('.tab-item')
                if (!item) return
                
                const key = item.dataset.key
                const episode = this.episodes.find(ep => ep.key === key)
                this.render(key)
                this.onSelect(key, episode)
            }
        }
    }

    // 主函数
    function init() {
        const container = $('.wp-video-playlist')
        if (!container) return

        // 隐藏原始内容
        Array.from(container.children).forEach(child => child.style.display = 'none')

        // 创建新的播放器容器
        container.innerHTML += `
            <div id="artplayer"></div>
            <div class="player-episodes">
                <div class="episodes-title">选集列表</div>
                <div class="tabs-root"></div>
            </div>
        `

        // 解析视频资源
        const rawData = JSON.parse($('.wp-playlist-script').textContent)
        const episodes = rawData.tracks.map(parseResUrl)
        
        // 获取存储的观看记录
        const stored = getStoredData()
        const initEpisode = stored.ep || '1'
        const initUrl = episodes.find(ep => ep.key === initEpisode)?.url || episodes[0].url

        console.log(`初始播放: ${initUrl}`)

        // 初始化选集标签（需要在播放器之前初始化，供播放器使用）
        const tabs = new EpisodeTabs($('.tabs-root'), episodes, (key, episode) => {
            console.log(`切换到: 第${key}集 - ${episode.label}`)
            player.switchUrl(episode.url)
        })
        tabs.render(initEpisode)

        // 播放下一集函数
        const playNextEpisode = () => {
            const currentIndex = episodes.findIndex(ep => ep.key === tabs.selectedKey)
            const nextIndex = currentIndex + 1
            
            if (nextIndex < episodes.length) {
                const nextEpisode = episodes[nextIndex]
                tabs.render(nextEpisode.key)
                tabs.onSelect(nextEpisode.key, nextEpisode)
                console.log(`自动播放下一集: 第${nextEpisode.key}集 - ${nextEpisode.label}`)
            } else {
                console.log('已经是最后一集了')
            }
        }

        // 初始化播放器
        const player = new Artplayer({
            container: '#artplayer',
            url: initUrl,
            pip: true,
            setting: true,
            playbackRate: true,
            hotkey: true,
            fullscreen: true,
            miniProgressBar: true,
            autoOrientation: true,
            fastForward: true,
            theme: '#3a8fb7',
            controls: [
              {
                position: 'left',
                index: 13,
                html: '<i class="art-icon flex"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" fill="currentColor"/></svg></i>',
                tooltip: '播放下一集',
                click: playNextEpisode,
              },
            ],
            plugins: stored.seek ? [
                function restoreProgress(art) {
                    art.on('ready', () => art.currentTime = stored.seek)
                    return { name: 'restoreProgress' }
                }
            ] : []
        })

        // 监听播放进度
        player.on('video:timeupdate', () => {
            saveProgress(player.currentTime, tabs.selectedKey)
        })
    }

    // 启动
    init()
})()
