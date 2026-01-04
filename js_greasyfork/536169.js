// ==UserScript==
// @name         Hitomi.la Cleanser - because fuck the dev!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hitomi.la is very user unfriendly, this script aims to fix that.
// @match        *://hitomi.la/*
// @match        *://*.hitomi.la/*
// @match        *://gold-usergeneratedcontent.net/*
// @match        *://*.gold-usergeneratedcontent.net/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536169/Hitomila%20Cleanser%20-%20because%20fuck%20the%20dev%21.user.js
// @updateURL https://update.greasyfork.org/scripts/536169/Hitomila%20Cleanser%20-%20because%20fuck%20the%20dev%21.meta.js
// ==/UserScript==

const Win = unsafeWindow
const interval = 50
const panicAfter = 3e3 / interval

// This intercepts a variable, function, etc. that the dev has assigned
const Patcher = class {
    constructor(name, type, desired) {
        this.name = name
        this.type = type
        this.desired = desired
        this.panicCount = 0
        this.handle = setInterval(() => this.tick(), interval)
    }
    tick() {
        this.panicCount++
        // give up after a few seconds
        if (this.panicCount > panicAfter) {
            console.warn(`Patcher: never saw ${this.name} as a ${this.type}`)
            clearInterval(this.handle)
            return
        }

        // only patch when the page actually sets it
        if (typeof Win[this.name] === this.type) {
            // store the original in case we need it later or something
            this.original = Win[this.name]
            Win[this.name] = this.desired
            console.log(`Patcher: overridden ${this.name}`)
            clearInterval(this.handle)
        }
    }
}

const BSS = {}

// this is a STRICT whitelist for things that can come in and out of the page
// this gives ads the middle finger and tells them to go fuck themselves
const policy = [
    "default-src 'self' https://hitomi.la https://*.hitomi.la https://*.gold-usergeneratedcontent.net",
    "script-src  'self' https://hitomi.la https://*.hitomi.la https://*.gold-usergeneratedcontent.net 'unsafe-inline'",
    "style-src   'self' https://hitomi.la https://*.hitomi.la https://*.gold-usergeneratedcontent.net 'unsafe-inline'",
    "img-src     * data:",
    "connect-src 'self' https://hitomi.la https://*.hitomi.la https://*.gold-usergeneratedcontent.net",
    "frame-ancestors 'none'"
].join('; ')

// a whitelist for us to refer to when cleansing containers of otherwise reserved ad content
const classWhitelist = [
    'list-title',
    'lillie',
    'cover-column',
    'gallery-preview',
    'gallery',
    'acg-gallery',
    'posts',
]

const FuckOff = {
    // stops ads in their tracks
    ads() {
        const meta = document.createElement('meta')
        meta.setAttribute('http-equiv', 'Content-Security-Policy')
        meta.setAttribute('content', policy)

        // prepend before any other <head> content
        const root = document.head || document.documentElement
        root.insertBefore(meta, root.firstChild)

        // stub XHR & fetch to known ad hosts
        const adHostsRE = /(?:a\.magsrv\.com|s\.magsrv\.com|js\.wpadmngr\.com|chaseherbalpasty\.com|adsco\.re|displayvertising\.com|adsco\.re|qrivescript\.min\.js)/i

        // XMLHttpRequest.open
        const origOpen = XMLHttpRequest.prototype.open
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (adHostsRE.test(url)) {
                console.log('XHR.open blocked:', url)
                return
            }
            return origOpen.call(this, method, url, ...args)
        }

        // fetch() override
        const origFetch = window.fetch
        window.fetch = function(input, init) {
            let url = typeof input === 'string' ? input : (input && input.url) || ''
            if (adHostsRE.test(url)) {
                console.log('Fetch blocked:', url)
                return Promise.resolve(new Response('', {
                    status: 204 // leave us the fuck alone
                }))
            }
            return origFetch(input, init)
        }
    },
    adContainers(name) {
        setTimeout(() => {
            // remove space reserved for ads
            let el = document.getElementsByClassName(name)
            // snapshot the children into an array
            for (let child of Array.from(el[0].children)) {
                let ok = [...child.classList].some(c => classWhitelist.includes(c))
                if (!ok) {
                    child.remove()
                }
            }
        }, 2e3)
    },
    popunder() {
        // STOP REDIRECTING PEOPLE FOR TRYING TO NAVIGATE THE DAMN PAGE JFC
        let el = document.getElementById('popmagicldr')
        if (el) {
            el.remove()
        }
    },
    btcBegging() {
        // This mfer does not need any more money
        let container = document.getElementsByClassName('donate')
        container[0].parentNode.removeChild(container[0])
    },
    mutationObserver() {
        // NOP out of any MutationObserver so the page "webp shim" or other mutation-based tricks never fire
        Win.MutationObserver = class {
            observe() {}
            disconnect() {}
        }
    },
    contextMenuBlocking() {
        // listen in capture phase and stop propagation of any blocking handlers.
        document.addEventListener('contextmenu', e => {
            // re‑enable the normal right‑click menu on all images
            if (e.target && e.target.tagName === 'IMG') {
                e.stopImmediatePropagation()
            }
        }, true)
    }
}

const MainTweaks = () => {
    // dont really need to touch anything here yet
}

const ReaderTweaks = () => {
    // intercept createImageBitMap and show_original values so we dont get a FUCKING AVIF
    BSS.showOriginal = new Patcher('show_original', 'boolean', true)
    BSS.createImgBitmap = new Patcher('createImageBitmap', 'function', fileBlob => {
        document.querySelectorAll('.lillie').forEach(img => {
            img.src = URL.createObjectURL(fileBlob)
        })
    })

    // this fucking guy has the panel/scene jump buttons backwards
    BSS.prevPanel = new Patcher('prev_panel', 'function', () => BSS.nextPanel.original.apply(this))
    BSS.nextPanel = new Patcher('next_panel', 'function', () => BSS.prevPanel.original.apply(this))

    BSS.prevScene = new Patcher('prev_scene', 'function', () => BSS.nextScene.original.apply(this))
    BSS.nextScene = new Patcher('next_scene', 'function', () => BSS.prevScene.original.apply(this))
    BSS.atFirstScene = new Patcher('at_first_scene', 'function', () => BSS.atLastScene.original.apply(this))
    BSS.atLastScene = new Patcher('at_last_scene', 'function', () => BSS.atFirstScene.original.apply(this))

    FuckOff.mutationObserver()
    FuckOff.contextMenuBlocking()
}

;(() => {
    // are we on the frontpage, or a reader?
    const isReader = location.pathname.startsWith('/reader/')
    const isMain = location.pathname === '/' || location.pathname.startsWith('/hitomi.la/')
    console.log('Script injected on ', location.href)

    // clear these fucking ads
    FuckOff.ads()
    FuckOff.adContainers('top-content')
    FuckOff.adContainers('content')
    setTimeout(() => {
        FuckOff.popunder()
        FuckOff.btcBegging()
    }, 2e3)

    // page wide overrides
    if (isMain) {
        MainTweaks()
    }

    // reader only image overrides
    if (isReader) {
        ReaderTweaks()

        // inject a download button into the reader nav bar
        let addDownloadButton = () => {
            let nav = document.querySelector('ul.nav.navbar-nav')
            if (!nav || nav.querySelector('#downloadButton')) {
                return
            }

            let li = document.createElement('li')
            let a = document.createElement('a')
            a.id = 'downloadButton'
            a.href = '#'
            a.title = 'Download'

            let icon = document.createElement('i')
            icon.className = 'icon-download icon-white'
            a.appendChild(icon)
            a.appendChild(document.createTextNode(' Download'))

            a.addEventListener('click', async (e) => {
                e.preventDefault()
                let img = document.querySelector('.lillie')
                if (!img || !img.src) {
                    return alert('No image to download!')
                }

                try {
                    let resp = await fetch(img.src, {
                        mode: 'cors'
                    })
                    if (!resp.ok) {
                        throw new Error(`HTTP ${resp.status}`)
                    }
                    let blob = await resp.blob()
                    let blobUrl = URL.createObjectURL(blob)

                    let link = document.createElement('a')
                    link.href = blobUrl
                    const parts = img.src.split('/').pop().split('?')[0]
                    link.download = parts || 'image'

                    document.body.appendChild(link)
                    link.click()

                    document.body.removeChild(link)
                    URL.revokeObjectURL(blobUrl)
                } catch (err) {
                    console.error('Download failed:', err)
                    alert('Download failed: ' + err.message)
                }
            })

            li.appendChild(a)
            nav.appendChild(li)
        }

        // wait until nav is available
        let tries = 0
        let maxTries = panicAfter
        let iv = setInterval(() => {
            tries++;
            if (tries >= maxTries) {
                clearInterval(iv)
                return
            }
            addDownloadButton()
            if (document.querySelector('#downloadButton')) {
                clearInterval(iv)
            }
        }, interval)
    }
})()
