// ==UserScript==
// @name XVideos+
// @namespace -
// @version 2.3.3
// @description ad block, download ability without signing in, remember player settings and fast search
// @author NotYou
// @match *://xvideos.com/*
// @match *://xvideos2.com/*
// @match *://xvideos3.com/*
// @match *://xvideos4.com/*
// @match *://xvideos5.com/*
// @match *://xvideos53.com/*
// @match *://www.xvideos.com/*
// @match *://www.xvideos2.com/*
// @match *://www.xvideos3.com/*
// @match *://www.xvideos4.com/*
// @match *://www.xvideos5.com/*
// @match *://www.xvideos53.com/*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/459863/XVideos%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/459863/XVideos%2B.meta.js
// ==/UserScript==

(function() {
    const TITLE = 'XVideos+'
    const LOCAL_VIDEO_SETTINGS = 'video_settings_xp'

    const DEFAULT_SETTINGS = JSON.stringify({
        volume: 1,
        muted: false,
        quality: 'Auto',
        speed: 1,
        loop: false
    })

    class CSS {
        static init() {
            const _CSS = `
            #site-logo-link {
              text-decoration: none;
            }

            #plus-xp {
              float: right;
              position: relative;
              margin-top: -10px;
              left: -6px;
              font-size: 36px;
              color: rgb(255, 255, 255);
              user-select: none;
              height: 0;
            }

            .no-text-dec, .no-text-dec:hover {
              text-decoration: none !important;
            }

            #fs-xp {
              background-color: rgba(213, 213, 213, .7);
              position: fixed;
              z-index: 2147483647;
              top: 50px;
              left: calc(60% / 2); /* 100% - 40% = 60% */
              width: 40%;
              border-radius: 5px;
            }

            #fs-input-parent-xp {
              display: flex;
              padding: .5rem;
            }

            #fs-input-parent-xp i {
              margin-top: 5px;
              margin-right: 5px;
              color: rgb(222, 38, 0);
            }

            #fs-input-parent-xp i::before {
              font-size: 20px;
            }

            #fs-input-xp {
              width: 100%;
              border-radius: 4px;
              height: 40px;
            }

            .tab-xp {
              background-color: rgb(247, 247, 247);
              margin: 0 0 10px 0;
              padding: 15px 10px;
            }

            #tabDownloadXp {
              text-align: center;
              font-size: 15px;
            }

            /* DARK-THEME */

            .dark-theme-xp #fs-xp {
              background-color: rgba(0, 0, 0, .7);
            }

            .dark-theme-xp .tab-xp {
              background-color: rgb(46, 46, 46);
            }`

            addStyle(_CSS)
        }
    }

    class DarkThemeChecker {
        static init() {
            let isDarkTheme

            setupDarkThemeClass()

            const DARK_THEME_OBS = new MutationObserver(setupDarkThemeClass)

            DARK_THEME_OBS.observe(document.body, {
                childList: true,
                subtree: true,
            })

            function setupDarkThemeClass() {
                setTheme()
                setDarkThemeClass()
            }

            function setTheme() {
                isDarkTheme = getTheme() === 'black'
            }

            function getTheme() {
                const USER_FAVORITE_THEME = localStorage.user_theme_fav
                const THEME = JSON.parse(USER_FAVORITE_THEME).i

                return THEME
            }

            function setDarkThemeClass() {
                document.documentElement.classList[isDarkTheme ? 'add' : 'remove']('dark-theme-xp')
            }
        }
    }

    class AntiAntiAdBlock {
        static init() {
            Object.defineProperty(window, 'fuckAdBlock', {
                get() {
                    return fakeFuckAdBlockObj()
                }
            })

            function fakeFuckAdBlockObj() {
                return {
                    _creatBait: blank('undef'),
                    _destroyBait: blank('undef'),
                    _checkBait: blank('undef'),
                    _log: blank('undef'),
                    _stopLoop: blank('undef'),

                    onDetected: blank(),
                    onNotDetected: blank(),
                    on: blank(),
                    setOptions: blank(),
                    setOption: blank(),
                    check: blank('false'),
                    emitEvent: blank(),
                    clearEvent: blank('undef'),
                }
            }

            function blank(type) {
                let returnValue

                switch (type) {
                    case 'undef': break
                    case 'false': returnValue = false; break
                    default: returnValue = this; break
                }

                return function() {
                    return returnValue
                }
            }
        }
    }

    class AdBlock {
        static init() {
            let css = ''
            const SELECTORS = [
                '#video-ad',
                '#video-ad + div[class]',
                '#ad-footer',
                '#ad-footer + .remove-ads',
                '#ad-footer2',
                '#video-sponsor-links',
                '.videoad-title',
                '.ad-footermobile',
                '.ad-support-tablet',
                '#ad-header-mobile-contener',
                '#v-actions .tabs .dl',
                '#content > :first-child > .clearfix',
                '.thumb-block-profile > .thumb-inside > .prof-thumb-title',
                '.thumb-ad'
            ]

            for (let i = 0; i < SELECTORS.length; i++) {
                const SELECTOR = SELECTORS[i]

                css += SELECTOR + '{ display: none !important; }'
            }

            addStyle(css)
        }
    }

    class PlusSymbol {
        static init() {
            let plus = document.createElement('span')
            plus.id = 'plus-xp'
            plus.className = 'noselect'
            plus.textContent = '+'

            let svgLogo = document.querySelector('#site-logo')

            if(svgLogo) {
                svgLogo.insertAdjacentElement('afterend', plus)
            }
        }
    }

    class FastSearch {
        static init() {
            let fastSearch = document.createElement('div')
            let fastSearchInputParent = document.createElement('div')
            let fastSearchIcon = document.createElement('i')
            let fastSearchInput = document.createElement('input')

            fastSearch.id = 'fs-xp'
            fastSearchInput.id = 'fp-input-xp'
            fastSearchInputParent.id = 'fs-input-parent-xp'

            fastSearchInput.placeholder = 'Fast Search XVideos'
            fastSearchInput.className = 'form-control'

            fastSearchIcon.className = 'icon-f icf-search'

            fastSearchIcon.addEventListener('click', fastSearchEventHandler)
            fastSearchInput.addEventListener('keydown', fastSearchEventHandler)

            fastSearchInputParent.appendChild(fastSearchIcon)
            fastSearchInputParent.appendChild(fastSearchInput)
            fastSearch.appendChild(fastSearchInputParent)

            toggleVisibility(fastSearch)

            document.body.appendChild(fastSearch)

            window.addEventListener('keydown', e => {
                if(e.code === 'KeyK' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    toggleVisibility(fastSearch)
                    fastSearchInput.focus()
                }
            })

            function fastSearchEventHandler(e) {
                if(e.type === 'click' || e.code === 'Enter') {
                    search(fastSearchInput.value)
                }
            }
        }
    }

    class CopyableTitle {
        static init() {
            const VIDEO_TITLE_NODE = document.querySelector('#title-auto-tr') || document.querySelector('.page-title')

            VIDEO_TITLE_NODE.addEventListener('click', () => {
                let videoTitleText = VIDEO_TITLE_NODE.firstChild.textContent.trim()

                if(!videoTitleText) {
                    videoTitleText = window.html5player.video_title
                }

                navigator.clipboard.writeText(videoTitleText)
            })
        }
    }

    class FastButtons {
        static init() {
            const VIDEO_TITLE = window.html5player.video_title

            let actionsTabs = document.querySelector('#v-actions .tabs')
            let videoTabs = document.querySelector('#video-tabs > .tabs')
            let dlBtnOrigin = actionsTabs.querySelector('.dl')

            let embedBtn = document.createElement('button')
            let embedLink = document.createElement('a')

            let dlBtn = document.createElement('button')
            let dlTab = document.createElement('div')
            let dlOptions = createDownloadOptions()

            embedLink.className = 'no-text-dec'
            embedLink.target = '_blank'
            embedLink.href = '/embedframe/' + window.html5player.id_video
            embedLink.innerHTML = '<span class="icon-f icf-embed"></span><span>Embed</span>'

            dlBtn.className = 'dl-xp'
            dlBtn.innerHTML = '<span class="icon-f icf-download"></span><span>Download (XVideos+)</span>'
            dlBtn.addEventListener('click', onDlClick)

            toggleVisibility(dlTab)
            dlTab.className = 'tab-xp'
            dlTab.id = 'tabDownloadXp'
            dlTab.innerHTML = 'Download ' + dlOptions
                .createOption('HIGH', window.html5player.url_high, 'High quality')
                .createOption('LOW', window.html5player.url_low, 'Low quality')
                .create()
            + ' quality video.'

            embedBtn.appendChild(embedLink)
            actionsTabs.appendChild(embedBtn)

            dlBtnOrigin.insertAdjacentElement('beforebegin', dlBtn)
            videoTabs.appendChild(dlTab)

            function onDlClick() {
                return toggleVisibility(dlTab)
            }

            function createDownloadOptions() {
                let options = ''

                return {
                    createOption(label, url, desc) {
                        options += `<strong><a href="${url}" title="${desc}" target="_blank">${label}</a></strong> / `

                        return this
                    },

                    create() {
                        return options.slice(0, -3)
                    }
                }
            }
        }
    }

    class SaveVideoSettings {
        static init() {
            let video = window.html5player.video || document.querySelector('#html5video video')

            class Settings {
                static getSettings() {
                    return JSON.parse(localStorage.getItem(LOCAL_VIDEO_SETTINGS))
                }

                static getItem(key) {
                    let settings = this.getSettings()

                    return settings[key]
                }

                static setItem(key, value) {
                    let settings = this.getSettings()

                    settings[key] = value

                    localStorage.setItem(LOCAL_VIDEO_SETTINGS, JSON.stringify(settings))
                }
            }

            class Player {
                static get volume() {
                    return video.volume
                }

                static set volume(volume) {
                    window.html5player.setVolume(volume)
                }

                static get isMuted() {
                    return video.muted
                }

                static mute() {
                    return window.html5player.mute()
                }

                static get quality() {
                    return window.html5player.qualitiesmenubuttonlabel
                }

                static set quality(quality) {
                    let qualityMenu = window.html5player.qualitymenu

                    if(qualityMenu) {
                        setQuality()
                    } else {
                        let obs = new MutationObserver(() => {
                            if(window.html5player.qualitymenu) {
                                qualityMenu = window.html5player.qualitymenu

                                if(qualityMenu) {
                                    setQuality()
                                    obs.disconnect()
                                }
                            }
                        })

                        obs.observe(document.body, {
                            childList: true,
                            subtree: true,
                        })
                    }

                    function setQuality() {
                        let qualityEls = qualityMenu.querySelectorAll('span')

                        for (let i = 0; i < qualityEls.length; i++) {
                            let qualityEl = qualityEls[i]

                            if(qualityEl.textContent.trim().toLowerCase() === quality.toLowerCase()) {
                                return qualityEl.parentNode.click()
                            }
                        }

                        log('Cannot find quality "' + quality + '"')
                    }
                }

                static get speed() {
                    return window.html5player.speed
                }

                static set speed(speed) {
                    window.html5player.speed = speed
                }

                static get isLooped() {
                    return window.html5player.loopbtn.querySelector('img[src*="1.svg"]') !== null
                }

                static loop() {
                    let isLooped = this.isLooped

                    if(!isLooped) {
                        window.html5player.loopbtn.click()
                    }
                }
            }

            restoreVideoSettings()

            const TARGET_NODE = document.querySelector('#hlsplayer') || document.body

            let obs = new MutationObserver((mutationList) => {
                for (let i = 0; i < mutationList.length; i++) {
                    const MUTATION_RECORD = mutationList[i]
                    const TARGET = MUTATION_RECORD.target

                    if(TARGET.matches('.buttons-bar *, .settings-menu *')) {
                        return setVideoSettings()
                    }
                }
            })

            obs.observe(TARGET_NODE, {
                childList: true,
                subtree: true,
            })

            function setVideoSettings() {
                const VOLUME = Player.volume
                const MUTED = Player.isMuted
                const QUALITY = Player.quality
                const SPEED = Player.speed
                const LOOPED = Player.isLooped

                Settings.setItem('volume', VOLUME)
                Settings.setItem('muted', MUTED)
                Settings.setItem('quality', QUALITY)
                Settings.setItem('speed', SPEED)
                Settings.setItem('loop', LOOPED)
            }

            function restoreVideoSettings() {
                Player.volume = Settings.getItem('volume')

                const WAS_MUTED = Settings.getItem('muted')

                if(WAS_MUTED) {
                    Player.mute()
                }

                Player.quality = Settings.getItem('quality')
                Player.speed = Settings.getItem('speed')

                const WAS_LOOPED = Settings.getItem('loop')

                if(WAS_LOOPED) {
                    Player.loop()
                }
            }
        }
    }

    class BetterVideoPage {
        static init() {
            const IS_VIDEO = isVideoPage()

            if(IS_VIDEO) {
                const MODULES = [
                    CopyableTitle,
                    FastButtons,
                    SaveVideoSettings
                ]

                initModules(MODULES)
            }
        }
    }

    class Main {
        static init() {
            if(!localStorage.getItem(LOCAL_VIDEO_SETTINGS)) {
                localStorage.setItem(LOCAL_VIDEO_SETTINGS, DEFAULT_SETTINGS)
            }

            const MODULES = [
                CSS,
                DarkThemeChecker,
                AntiAntiAdBlock,
                AdBlock,
                PlusSymbol,
                FastSearch,
                BetterVideoPage
            ]

            initModules(MODULES)

            log('Loaded')
        }
    }

    Main.init()

    function initModules(modules) {
        for (let i = 0; i < modules.length; i++) {
            const MODULE = modules[i]

            initModule(MODULE)
        }
    }

    function initModule(module) {
        try {
            module.init()
        } catch(e) {
            console.error(TITLE, module.name + ' module, has error:', e)
        }
    }

    function addStyle(css) {
        let styleNode = document.createElement('style')
        styleNode.appendChild(document.createTextNode(css))
        document.head.appendChild(styleNode)
    }

    function toggleVisibility(el) {
        if(el.style.display === 'none') {
            el.style.display = 'block'

            return void 0
        }

        el.style.display = 'none'
    }

    function log(msg) {
        const CSS_LOG_DEFAULT = 'background: rgb(0, 0, 0);font-weight: 800;padding: 1px;'

        console.log('%cX%cVIDEOS+',
            CSS_LOG_DEFAULT + 'color: rgb(222, 38, 0);',
            CSS_LOG_DEFAULT + 'color: rgb(255, 255, 255);margin-right: -5px;',
            ' -',
            msg
        )
    }

    function isVideoPage() {
        return location.pathname.match(/video\d/)
    }

    function search(q) {
        return replaceLocation(location.origin + '/?k=' + toSearchFormat(q))
    }

    function toSearchFormat(str) {
        return encodeURIComponent(str.trim()).replace(/%20+/g, '+')
    }

    function replaceLocation(newUrl) {
        if(location.replace) {
            return location.replace(newUrl)
        }

        location.href = newUrl
    }
})();












