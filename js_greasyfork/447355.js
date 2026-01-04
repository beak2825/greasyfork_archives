// ==UserScript==
// @name PornHub+
// @namespace -
// @version 1.6.1
// @description Ad blocker, filters, no autoplay, fast search etc.
// @author NotYou
// @match *://pornhub.com/*
// @match *://pornhubpremium.com/*
// @match *://*.pornhub.com/*
// @match *://*.pornhubpremium.com/*
// @compatible Firefox Version 78
// @compatible Chrome Version 88
// @compatible Edge Version 88
// @compatible Opera Version 74
// @compatible Safari Version 14
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/447355/PornHub%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/447355/PornHub%2B.meta.js
// ==/UserScript==

(function() {
    const TITLE = 'PornHub+'
    const LOCAL_SETTINGS = 'settings_pp'

    const DEFAULT_SETTINGS = JSON.stringify({
        stepLike: 0,
        incest: 0,
        nonHetero: 0,
        bdsm: 0
    })

    const LABELS = {
        stepLike: 'Step-like',
        incest: 'Incest',
        nonHetero: 'Non-Hetero',
        bdsm: 'BDSM or Hardcore'
    }

    class Settings {
        static getSettings() {
            return JSON.parse(localStorage.getItem(LOCAL_SETTINGS))
        }

        static getItem(key) {
            const settings = this.getSettings()

            return settings[key]
        }

        static setItem(key, value) {
            const settings = this.getSettings()

            settings[key] = value

            localStorage.setItem(LOCAL_SETTINGS, JSON.stringify(settings))
        }
    }

    class CSS {
        static init() {
            const _CSS = `
            #header.hasAdAlert {
              grid-template-rows: unset !important;
            }

            #headerContainer {
              padding-bottom: 10px;
            }

            #fast-search-pp {
              position: fixed;
              z-index: 2147483646;
              width: 400px;
              height: 40px;
              padding: 16px 28px 28px 16px;
              background-color: rgba(21, 21, 21, 0.57);
              border-radius: 3px;
              left: 32vw;
              top: 20vh;
            }

            #fast-search-input-parent-pp {
              padding: 5px;
              display: flex;
              border: 0;
              height: 40px;
              width: 100%;
              background-color: rgb(61, 54, 49);
              border-radius: 3px;
            }

            #fast-search-input-parent-pp .ph-icon-search {
              margin-top: 10px;
              margin-right: 10px;
              font-size: 20px;
            }

            #fast-search-input-pp {
              background-color: unset;
              width: 100%;
              height: 100%;
              font-size: 20px;
              border: 0;
            }

            #fast-search-input-pp::placeholder {
              font-style: italic;
              color: rgb(164, 164, 164);
            }

            .active-category-pp a {
              color: rgb(255, 153, 0) !important;
            }`

            addStyle(_CSS)
        }
    }

    class ClearBtn {
        static init() {
            const NETWORK_LIST = document.querySelector('.networkListContent')

            if(NETWORK_LIST) {
                const CLEAR_BTN = document.createElement('li')
                const CLEAR_PP = document.createElement('a')
                const ID = NETWORK_LIST.children.length

                CLEAR_PP.className = 'networkTab'
                CLEAR_PP.href = 'javascript:;'
                CLEAR_PP.title = 'Clear watched videos, search requests from browser\'s local storage'
                CLEAR_PP.textContent = 'Clear'
                CLEAR_BTN.dataset.id = ID

                CLEAR_BTN.addEventListener('click', clearStorage)

                CLEAR_BTN.appendChild(CLEAR_PP)
                NETWORK_LIST.appendChild(CLEAR_BTN)

                function clearStorage() {
                    const STORAGE_KEYS = ['watchedVideoStorage', 'watchedVideoIds', 'currentTimeStamp', 'recentSearch']

                    for (let i = 0; i < STORAGE_KEYS.length; i++) {
                        const STORAGE_KEY = STORAGE_KEYS[i]

                        localStorage.removeItem(STORAGE_KEY)
                    }
                }
            }
        }
    }

    class AdBlock {
        static init() {
            let css = ''
            const bodies = []

            for (let i = 0; i < 10; i++) {
                bodies.push(`body > [class*=${i}]`)
            }

            const SELECTORS = [
                '.cookiesBanner',
                '#pb_template',
                '.adsbytrafficjunky',
                '.adLinks',
                '.adLink',
                '#hd-rightColVideoPage > .clearfix:first-child',
                '#popsByTrafficJunky',
                bodies.join(','),
                '#videoSearchResult > :first-child:not(.userCardLi)',
                '#welcome',
                '#vpContentContainer > div:nth-child(2) > :first-child',
                '.video-wrapper > .hd.clear',
                '#js-abContainterMain',
                '.t8fer',
                '.t8fer k0g8',
                '#footerMenu_advertising',
                '.ad-link',
                'body > *:not(:where(div, template, script, style, link, ins, noscript, iframe, img, pre))',
                '.carouselOverlay',
                '.cookiesBanner + * + *',
                `:where(#popularPornstars,
                .gifsWrapper > ul > :first-child,
                #hottestVideosSection,
                #photosAlbumsSection.withAd,
                #hotVideosSection,
                #videoCategory, .container > div[class=""],
                #videoSearchResult,
                #singleFeedSection) > :where(:first-child:not(:where(li, div)), .sniperModeEngaged)`,
                '#channelsBody .leftSide.floatLeft .rankWrapper + :not(.clearfix)',
                '.alpha ~ .emptyBlockSpace[style="display: block;"]',
                '.sponsor-text'
            ]

            for (let i = 0; i < SELECTORS.length; i++) {
                const SELECTOR = SELECTORS[i]

                css += SELECTOR + '{ display: none !important; }'
            }

            addStyle(css)
        }
    }

    class AdBlockAdvanced {
        static init() {
            removeAds()

            const obs = new MutationObserver(removeAds)
            obs.observe(document.body, {
                childList: true,
                subtree: true,
            })

            function removeAds() {
                const ADS_ELEMENTS = document.querySelectorAll('[data-embeddedads="true"]:not([style="all: unset !important; display: none !important;"])')

                for (let i = 0; i < ADS_ELEMENTS.length; i++) {
                    const ADS_ELEMENT = ADS_ELEMENTS[i]
                    const ADS_PARENT_ELEMENT = ADS_ELEMENT.parentNode
                    const IS_ADS_ELEMENT = ADS_PARENT_ELEMENT.children.length === 1 && ADS_PARENT_ELEMENT.className

                    if(IS_ADS_ELEMENT) {
                        ADS_PARENT_ELEMENT.setAttribute('style', 'all: unset !important; display: none !important;')
                    }
                }
            }
        }
    }

    class PlusSymbol {
        static init() {
            const LOGO_WRAPPER = document.querySelector('.logo .logoWrapper')
            const PLUS = document.createElement('i')
            PLUS.style.marginTop = '10px'
            PLUS.style.fontSize = '20px'
            PLUS.className = 'ph-icon-add'

            if(LOGO_WRAPPER) {
                LOGO_WRAPPER.style.display = 'flex'
                LOGO_WRAPPER.appendChild(PLUS)
            }
        }
    }

    class NoAutoplay {
        static init() {
            const LOCAL_PLAYER_NAME = 'mgp_player'
            const LOCAL_PLAYER_SETTINGS = localStorage.getItem(LOCAL_PLAYER_NAME)

            let playerSettings = JSON.parse(LOCAL_PLAYER_SETTINGS)

            if(playerSettings) {
                playerSettings.autoplay = false

                const PLAYER_SETTINGS = JSON.stringify(playerSettings)

                localStorage.setItem(LOCAL_PLAYER_NAME, PLAYER_SETTINGS)
            }
        }
    }

    class FastSearch {
        static init() {
            const FAST_SEARCH_EL = document.createElement('div')
            FAST_SEARCH_EL.id = 'fast-search-pp'

            toggleVisibility(FAST_SEARCH_EL)

            const FAST_SEARCH_PARENT_EL = document.createElement('span')
            FAST_SEARCH_PARENT_EL.id = 'fast-search-input-parent-pp'

            const ICON = document.createElement('i')
            ICON.className = 'ph-icon-search'

            const INPUT = document.createElement('input')
            INPUT.id = 'fast-search-input-pp'
            INPUT.placeholder = 'Fast Search Pornhub'

            FAST_SEARCH_PARENT_EL.appendChild(ICON)
            FAST_SEARCH_PARENT_EL.appendChild(INPUT)
            FAST_SEARCH_EL.appendChild(FAST_SEARCH_PARENT_EL)

            INPUT.addEventListener('keydown', fastSearchHandler)
            ICON.addEventListener('click', fastSearchHandler)

            document.body.appendChild(FAST_SEARCH_EL)

            window.addEventListener('keydown', e => {
                if((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
                    e.preventDefault()
                    toggleVisibility(FAST_SEARCH_EL)
                    INPUT.focus()
                }
            })

            function fastSearchHandler(e) {
                if((e.type === 'keydown' && e.code === 'Enter') || e.type === 'click') {
                    const QUERY = getQuery()

                    search(QUERY)
                }

                function search(query) {
                    replaceLocation(location.origin + '/video/search?search=' + query)
                }

                function getQuery() {
                    const VALUE = INPUT.value
                    const RE_UNUSED = /[^0-9a-zA-Z\\s-]+/g
                    const VALUE_CLEAN = VALUE.replaceAll(RE_UNUSED, '').replaceAll(/\s/g, '+')

                    return VALUE_CLEAN
                }
            }
        }
    }

    class FastButtons {
        static init() {
            const SEARCH_PARAMS = getSearchParams()
            const VIEWKEY = SEARCH_PARAMS.get('viewkey')
            const MENU_ROW = document.querySelector('#js-shareData > .tab-menu-wrapper-row')
            const MENU_CELL = document.createElement('div')
            MENU_CELL.className = 'tab-menu-wrapper-cell'

            const MENU_CELL_LINK = document.createElement('a')
            MENU_CELL_LINK.href = location.origin + '/embed/' + VIEWKEY
            MENU_CELL_LINK.target = '_self'

            const EMBED_BTN = document.createElement('div')
            EMBED_BTN.id = 'embed_mode-btn'
            EMBED_BTN.className = 'flag-btn tab-menu-item tooltipTrig'
            EMBED_BTN.dataset.title = 'Open video in embed mode'
            EMBED_BTN.setAttribute('role', 'button')
            EMBED_BTN.tabindex = 0

            const EMBED_ICON = document.createElement('i')
            EMBED_ICON.className = 'ph-icon-channel'

            const EMBED_TEXT = document.createElement('span')
            EMBED_TEXT.textContent = 'Embed'

            EMBED_BTN.appendChild(EMBED_ICON)
            EMBED_BTN.appendChild(EMBED_TEXT)
            MENU_CELL_LINK.appendChild(EMBED_BTN)
            MENU_CELL.appendChild(MENU_CELL_LINK)
            MENU_ROW.appendChild(MENU_CELL)
        }
    }

    class CopyableTitle {
        static init() {
            const TITLE_EL = document.querySelector('.title-container > .title > span')
            TITLE_EL.title = 'Click to copy'
            TITLE_EL.addEventListener('click', () => {
                navigator.clipboard.writeText(TITLE_EL.innerText)
            })
        }
    }

    class BetterVideoPage {
        static init() {
            const IS_VIDEO = isVideoPage()

            if(IS_VIDEO) {
                const MODULES = [
                    FastButtons,
                    CopyableTitle
                ]

                initModules(MODULES)
            }
        }
    }

    class Filters {
        static init() {
            const SEARCH_PARAMS = getSearchParams()
            const IS_VALID_PAGE = SEARCH_PARAMS.has('search') ||
                  SEARCH_PARAMS.has('page') ||
                  SEARCH_PARAMS.has('o') ||
                  (location.pathname === '/video' && SEARCH_PARAMS.toString() === '') ||
                  location.pathname.indexOf('categories/') !== -1

            if(IS_VALID_PAGE) {
                const FILTERS = {
                    stepLike: [
                        'stepmom', 'stepmother', 'stepmommy', 'stepmum', 'step-mom', 'step-mother', 'step-mum', 'step-mommy', 'step mom', 'step mother', 'step mum', 'step mommy',
                        'stepdad', 'step-dad', 'step dad',
                        'stepson', 'step-son', 'step son',
                        'stepsis', 'stepsister', 'step-sister', 'step-sis', 'step sister', 'step sis',
                        'stepdaughter', 'step-daughter', 'step daughter'
                    ],
                    incest: [
                        'mom', 'mother', 'mommy', 'milf',
                        'dad', 'father', 'daddy',
                        'bro', 'brother',
                        'sis', 'sister',
                        'daughter',
                        'son',

                        // Series

                        'mylf', 'gotmylf', 'mylfdom', 'badmilfs', 'bad milfs', 'analmom', 'anal mom', 'pervmom', 'perv mom', 'milfbody', 'pervnana', 'perv nana', 'momswap', 'momshoot', 'momsteachsex', 'mommy\'s girl',
                        'sis loves me', 'brattysis', 'sisswap', 'tinysis',
                        'dad crush',
                        'not my grandpa', 'notmygrandpa',
                        'spyfam', 'spy fam', 'family sinners', 'myfamilypies', 'familystrokes', 'family strokes'
                    ],
                    nonHetero: [
                        'lesbian',
                        'gay', 'homo', 'homosexual',
                        'bi', 'bisexual',
                        'trans', 'transgender',

                        // Series

                        'helloladyboy', 'mommy\'s girl', 'girlsway', 'the lesbian experience', 'all girl massage',
                    ],
                    bdsm: [
                        'hardcore',
                        'bdsm',
                        'biting',
                        'scratching',
                        'dom', 'femdom', 'maledom', 'domination',
                        'wax', 'waxing',
                        'gag', 'gagging',
                        'whip', 'whiping',
                        'tied', 'tying',
                        'bondage'
                    ]
                }

                let appliedFilters = {}

                const HEADER = createSidebarHeader('Filter', 'filter')
                const CATEGORIES = createCategories()

                const FILTERS_KEYS = Object.keys(FILTERS)

                for (let i = 0; i < FILTERS_KEYS.length; i++) {
                    const FILTER_KEY = FILTERS_KEYS[i]
                    const LABEL = LABELS[FILTER_KEY]

                    CATEGORIES.createCategory(LABEL, FILTER_KEY, 'filter')
                }

                const FILTER_CATEGORIES = CATEGORIES.create()

                const TO_INSERT_ELS = [
                    HEADER,
                    FILTER_CATEGORIES
                ]
                const DURATION_WRAPPER = document.querySelector('#duration-wrapper')
                const DURATION_HEADER = DURATION_WRAPPER.previousElementSibling

                for (let i = 0; i < TO_INSERT_ELS.length; i++) {
                    const TO_INSERT_EL = TO_INSERT_ELS[i]

                    DURATION_HEADER.insertAdjacentElement('beforebegin', TO_INSERT_EL)
                }

                function createCategories() {
                    const WRAPPER = document.createElement('div')
                    WRAPPER.className = 'sidebar_wrapper'

                    const CATEGORIES = document.createElement('ul')
                    CATEGORIES.className = 'nf-categories'

                    WRAPPER.appendChild(CATEGORIES)

                    return {
                        createCategory,
                        create
                    }

                    function createCategory(label, category, type) {
                        const CATEGORY = document.createElement('li')
                        CATEGORY.className = 'sidebarIndent'

                        const IS_ENABLED_BY_DEFAULT = Boolean(Settings.getItem(category))

                        appliedFilters[category] = IS_ENABLED_BY_DEFAULT

                        if(IS_ENABLED_BY_DEFAULT) {
                            CATEGORY.classList.add('active-category-pp')
                            changeVideosVisibility(FILTERS[category], appliedFilters[category])
                        }


                        CATEGORY.addEventListener('click', () => {
                            const IS_ENABLED = !Settings.getItem(category)

                            Settings.setItem(category, IS_ENABLED ? 1 : 0)

                            appliedFilters[category] = IS_ENABLED

                            CATEGORY.classList[IS_ENABLED ? 'add' : 'remove']('active-category-pp')

                            changeVideosVisibility(FILTERS[category], appliedFilters[category])
                        })

                        const CATEGORY_LINK = document.createElement('a')
                        CATEGORY_LINK.className = 'sidebarIndent'
                        CATEGORY_LINK.href = 'javascript:;'

                        const CATEGORY_TEXT = document.createTextNode(label)

                        CATEGORY_LINK.appendChild(CATEGORY_TEXT)
                        CATEGORY.appendChild(CATEGORY_LINK)
                        CATEGORIES.appendChild(CATEGORY)

                        return this
                    }

                    function create() {
                        return WRAPPER
                    }
                }

                function createSidebarHeader(text, icon) {
                    const SECTION_HEADER = document.createElement('div')
                    SECTION_HEADER.className = 'section_bar_sidebar'

                    const SECTION_TITLE = document.createElement('div')
                    SECTION_TITLE.className = 'section_title'

                    const ICON = document.createElement('i')
                    ICON.className = 'ph-icon-' + icon

                    const TEXT = document.createTextNode(' ' + text + ' ')

                    const SUBTITLE = document.createElement('span')
                    SUBTITLE.className = 'subtitle'
                    SUBTITLE.textContent = '( PornHub+ )'

                    SECTION_TITLE.appendChild(ICON)
                    SECTION_TITLE.appendChild(TEXT)
                    SECTION_TITLE.appendChild(SUBTITLE)
                    SECTION_HEADER.appendChild(SECTION_TITLE)

                    return SECTION_HEADER
                }

                function changeVideosVisibility(filter, isHiding) {
                    const VIDEO_BOXES = document.querySelectorAll('.videoBox')

                    for (let i = 0; i < VIDEO_BOXES.length; i++) {
                        const VIDEO_BOX = VIDEO_BOXES[i]
                        const TITLE = VIDEO_BOX.querySelector('.thumbnail-info-wrapper > .title a').title.toLowerCase().trim()

                        for (let j = 0; j < filter.length; j++) {
                            const CURRENT_WORD = filter[j]
                            const WORD_RE = createRegExp(CURRENT_WORD)
                            const IS_VALID = WORD_RE.test(TITLE)

                            if(isHiding && IS_VALID) {
                                VIDEO_BOX.style.display = 'none'
                            } else if(!isHiding && !IS_VALID) {
                                VIDEO_BOX.style.display = ''
                            }
                        }
                    }
                }

                function createRegExp(word) {
                    return new RegExp(`^${word}$|^${word}|${word}$|\\s${word}\\s`)
                }
            }
        }
    }

    class ChangeStars {
        static init() {
            const IS_VALID_PAGE = location.pathname.includes('/pornstar/') || location.pathname.includes('/model/')

            if(IS_VALID_PAGE) {
                window.addEventListener('keydown', e => {
                    if(e.shiftKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
                        e.preventDefault()

                        const TYPE_OF_ARROW = e.key === 'ArrowRight' ? '.pornstarPrev' : '.pornstarNext'
                        const ARROW = document.querySelector('.pornstarsNavButtons > ' + TYPE_OF_ARROW)

                        ARROW.click()
                    }
                })
            }
        }
    }

    class Main {
        static init() {
            if(!localStorage.getItem(LOCAL_SETTINGS)) {
                localStorage.setItem(LOCAL_SETTINGS, DEFAULT_SETTINGS)
            }

            const MODULES = [
                CSS,
                ClearBtn,
                AdBlock,
                AdBlockAdvanced,
                PlusSymbol,
                NoAutoplay,
                FastSearch,
                BetterVideoPage,
                Filters,
                ChangeStars
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

    function toggleVisibility(el) {
        if(el.style.display === 'none') {
            el.style.display = 'block'

            return void 0
        }

        el.style.display = 'none'
    }

    function log(msg) {
        console.log(
            'Porn%cHub%c+',
            'background: #f90;color: #000;border-radius: 3px;padding: 1px;',
            '-',
            msg
        )
    }

    function getSearchParams() {
        return new URLSearchParams(location.search)
    }

    function isVideoPage() {
        const SEARCH_PARAMS = getSearchParams()

        return SEARCH_PARAMS.has('viewkey')
    }

    function addStyle(css) {
        const styleNode = document.createElement('style')
        styleNode.appendChild(document.createTextNode(css))
        document.head.appendChild(styleNode)
    }

    function replaceLocation(newUrl) {
        if(location.replace) {
            return location.replace(newUrl)
        }

        location.href = newUrl
    }
})()