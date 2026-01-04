// ==UserScript==
// @name          Auto All Page
// @version       2.5.3
// @author        reforget-id
// @namespace     autoallpage
// @description   Otomatis menampilkan semua halaman artikel berita dalam 1 halaman
// @homepage      https://github.com/reforget-id/AutoAllPage
// @supportURL    https://github.com/reforget-id/AutoAllPage/issues
// @icon          https://raw.githubusercontent.com/reforget-id/AutoAllPage/main/assets/icon.png
// @run-at        document-start
// @grant         GM_addStyle
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @noframes
// @exclude       https://*?single=1
// @exclude       https://*?showpage=all
// @exclude       https://*.idxchannel.com/*/all
// @exclude       https://*.inews.id/*/all
// @exclude       https://*?page=all
// @exclude       https://*?page=all#page*
// @exclude       https://*?page=all#sectionall
// @exclude       https://*/amp/*
// @exclude       https://amp.*
// @exclude       https://*/amp-*/*
// @exclude       https://*/?amp*
// @exclude       https://*?amp=1*
// @exclude       https://*/*&amp*
// @exclude       https://*/*&amp=1*
// @include       https://*.20jam.com/*/*/*
// @include       https://*.100kpj.com/*/*
// @include       https://*.aboutmalang.com/*/*/*
// @include       https://*.akurat.co/*/*/*
// @include       https://*.antaranews.com/berita/*/*
// @include       https://*.ayocirebon.com/*/*/*
// @include       https://*.ayoindonesia.com/*/*/*
// @include       https://*.bolanas.com/read/*
// @include       https://*.bolasport.com/read/*
// @include       https://*.cnbcindonesia.com/*/*/*
// @include       https://*.cnnindonesia.com/*/*/*
// @include       https://*.dagangberita.com/*/*/*
// @include       https://*.detik.com/*/d-*/*
// @include       https://*.genpi.co/*/*/*
// @include       https://*.grid.id/read/*
// @include       https://*.gridoto.com/read/*
// @include       https://herstory.co.id/read*
// @include       https://*.hops.id/*/*/*
// @include       https://*.hukumonline.com/berita/a/*
// @include       https://*.idxchannel.com/*/*
// @include       https://*.indozone.id/*/*/*
// @include       https://*.inews.id/*/*
// @include       https://*.intipseleb.com/*/*
// @include       https://*.jagodangdut.com/*/*
// @include       https://*.jatimnetwork.com/*/*/*
// @include       https://*.juara.net/read/*
// @include       https://*.jpnn.com/*/*
// @include       https://*.kilat.com/*/*/*
// @include       https://*.kompas.com/read/*
// @include       https://*.kompas.com/*/read/*
// @include       https://*.kompas.tv/*/*
// @include       https://*.kompasiana.com/*/*/*
// @include       https://*.kontan.co.id/news/*
// @include       https://*.motorplus-online.com/read/*
// @include       https://*.okezone.com/read/*
// @include       https://*.papanskor.com/*/*/*
// @include       https://*.parapuan.co/read/*
// @include       https://*.pikiran-rakyat.com/*/pr-*/*
// @include       https://*.pojoksatu.id/*/*/*
// @include       https://populis.id/read*
// @include       https://*.republika.co.id/berita/*
// @include       https://republika.co.id/berita/*
// @include       https://*.sahijab.com/*/*
// @include       https://*.sindonews.com/read/*
// @include       https://*.sonora.id/read/*
// @include       https://*.suara.com/*/*/*/*
// @include       https://*.tempo.co/read/*
// @include       https://*.tribunnews.com/*/*/*/*
// @include       https://*.tvonenews.com/*/*
// @include       https://*.unews.id/*/*/*
// @include       https://*.viva.co.id/*/*
// @include       https://wartaekonomi.co.id/read*
// @downloadURL https://update.greasyfork.org/scripts/415479/Auto%20All%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/415479/Auto%20All%20Page.meta.js
// ==/UserScript==

'use strict';

(() => {
    GM_addStyle(`
        .aap-divider {
            font-size: 18px !important;
            font-weight: 600 !important;
            margin: 30px 0 30px 0 !important;
            text-align: center !important;  
        }
    `)

    GM_registerMenuCommand('Donate me on Trakteer', () => {
        window.open('https://trakteer.id/reforget-id', '_blank')
    })

    class URLBuilder {
        constructor() {
            this._protocol = 'https'
            this._hostname = ''
            this._path = ''
            this._param = ''
        }

        hostname(hostname) {
            this._hostname = hostname
            return this
        }

        path(...pathname) {
            this._path = this._path + pathname.join('/')
            return this
        }

        param(query) {
            this._param = '?' + query
            return this
        }

        toString() {
            let url = `${this._protocol}://${this._hostname}/${this._path}`
            if (this._param !== '') url = url + this._param
            return url
        }
    }

    const url = {
        get url() {
            return window.location
        },
        href: () => url.url.href,
        hostname: () => url.url.hostname,
        path: () => url.url.pathname,
        param: () => url.url.search
    }

    function splitPath(pathname) {
        return pathname.split('/').filter(v => v)
    }

    function redirect(url) {
        window.location.replace(url)
    }

    function hostnameChecker(website) {
        return website.hostname.test(url.hostname())
    }

    function urlChecker(website) {
        return hostnameChecker(website) && website.path.test(url.path())
    }

    function log(message) {
        console.log('[AutoAllPage] ' + message)
    }

    function pageDivider(currentPage, totalPages) {
        const divider = new DOMParser().parseFromString(`
            <div class="aap-divider">
                === [AutoAllPage] Page ${currentPage}/${totalPages} ===
            </div>
        `, 'text/html')
        return divider.body.firstElementChild
    }

    // https://stackoverflow.com/a/52809105
    function watchURL(website) {
        let oldPushState = history.pushState
        history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments)
            window.dispatchEvent(new Event('pushstate'))
            window.dispatchEvent(new Event('locationchange'))
            return ret
        }

        let oldReplaceState = history.replaceState
        history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments)
            window.dispatchEvent(new Event('replacestate'))
            window.dispatchEvent(new Event('locationchange'))
            return ret
        }

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'))
        })

        window.addEventListener('locationchange', () => {
            if (urlChecker(website)) {
                log(url.href())
                redirect(url.href())
            }
        })
    }

    //******************************************************************************

    const websiteList = [
        {
            id: 'akurat',
            description: 'akurat.co',
            hostname: /(^|\.)akurat\.co$/,
            path: /^\/[a-z-]+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'antara',
            description: 'antaranews.com',
            hostname: /(^|\.)antaranews\.com$/,
            path: /\/berita\/\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'cnbc',
            description: 'cnbcindonesia.com',
            hostname: /(^|\.)cnbcindonesia\.com$/,
            path: /\/\d+-\d+-\d+\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'detik',
            description: 'detik.com',
            hostname: /(^|\.)detik\.com$/,
            path: /\/d-\d+\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'param',
            dynamic: false,
            fullpage: 'single=1'
        },
        {
            id: 'fajar',
            description: 'fajar.co.id',
            hostname: /(^|\.)fajar\.co\.id$/,
            path: /\/\d{4}\/\d{2}\/\d{2}\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'grid',
            description: 'bolanas.com, bolasport.com, grid.id, gridoto.com, juara.net, motorplus-online.com, parapuan.co, sonora.id',
            hostname: /(^|\.)(juara\.net|parapuan\.co|(grid|sonora)\.id|(bolanas|bolasport|gridoto|motorplus-online)\.com)$/,
            path: /^\/read\/\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'hukumonline',
            description: 'hukumonline.com',
            hostname: /(^|\.)hukumonline\.com$/,
            path: /^\/berita\/a\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'idx',
            description: 'idxchannel.com',
            hostname: /(^|\.)idxchannel\.com$/,
            path: /\/[a-z-]+\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'path',
            dynamic: false,
            fullpage: 'all'
        },
        {
            id: 'indozone',
            description: 'indozone.id',
            hostname: /(^|\.)indozone\.id$/,
            path: /^\/[a-z-]+\/\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'inews',
            description: 'inews.id',
            hostname: /(^|\.)inews\.id$/,
            path: /\/(berita|read\/\d+|[a-z-]+\/[a-z-]+)\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'path',
            dynamic: false,
            fullpage: 'all'
        },
        {
            id: 'jagodangdut',
            description: 'jagodangdut.com',
            hostname: /(^|\.)jagodangdut\.com$/,
            path: /\/artikel\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'kompascom',
            description: 'kompas.com',
            hostname: /(^|\.)kompas\.com$/,
            path: /\/read\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'kompasiana',
            description: 'kompasiana.com',
            hostname: /(^|\.)kompasiana\.com$/,
            path: /\/[a-z0-9_]+(?<!series)\/\w{24}\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'kompastv',
            description: 'kompas.tv',
            hostname: /(^|\.)kompas\.tv$/,
            path: /^\/[a-z-]+\/\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'kontan',
            description: 'kontan.co.id',
            hostname: /(^|\.)kontan\.co\.id$/,
            path: /^\/news\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'okezone',
            description: 'okezone.com',
            hostname: /(^|\.)okezone\.com$/,
            path: /^\/read\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'pr',
            description: 'pikiran-rakyat.com',
            hostname: /(^|\.)pikiran-rakyat\.com$/,
            path: /\/pr-\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'promedia',
            description: '20jam.com, aboutmalang.com, ayocirebon.com, jatimnetwork.com, hops.id, unews.id',
            hostname: /(^|\.)((20jam|aboutmalang|ayocirebon|ayoindonesia|dagangberita|kilat|jatimnetwork|papanskor)\.com|(hops|pojoksatu|unews)\.id)$/,
            path: /\/(pr-|)\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'sindo',
            description: 'sindonews.com',
            hostname: /(^|\.)sindonews\.com$/,
            path: /^\/read\/\d+\/\d+\/.+(\/\d+0|(?<!\/\w+))$/,
            method: 'param',
            dynamic: false,
            fullpage: 'showpage=all'
        },
        {
            id: 'suara',
            description: 'suara.com',
            hostname: /(^|\.)suara\.com$/,
            path: /\/\d{4}\/\d{2}\/\d{2}\/\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'tribun',
            description: 'tribunnews.com',
            hostname: /(^|\.)tribunnews\.com$/,
            path: /\/\d{4}\/\d{2}\/\d{2}\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'viva',
            description: 'viva.co.id, tvonenews.com, intipseleb.com, sahijab.com, 100kpj.com',
            hostname: /(^|\.)(viva\.co\.id|(tvonenews|intipseleb|sahijab|100kpj)\.com)$/,
            path: /\/.+\/\d+-.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'wartaekonomi',
            description: 'wartaekonomi.co.id, herstory.co.id',
            hostname: /(^|\.)((wartaekonomi|herstory)\.co|populis)\.id$/,
            path: /^\/read\d+\/.+(?<!\/\w+)$/,
            method: 'param',
            dynamic: false,
            fullpage: 'page=all'
        },
        {
            id: 'cnn',
            description: 'cnnindonesia.com',
            hostname: /(^|\.)cnnindonesia\.com$/,
            path: /\/\d+-\d+-\d+\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '/',
            urlHelper: 0,
            desktop: {
                pagination: '.mb-8 > .gap-2.text-base',
                totalPages: 'a:last-of-type',
                content: '.detail-text'
            },
            mobile: {
                pagination: '.mb-8 > .gap-2.text-base',
                totalPages: 'a:last-of-type',
                content: '.detail-text'
            }
        },
        {
            id: 'disway',
            description: 'disway.id',
            hostname: /(^|\.)disway\.id$/,
            path: /\/read\/\d+\/.+(\/\d+|(?<!\/\w+))$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '/',
            urlHelper: -13,
            desktop: {
                pagination: '.pagination',
                totalPages: 'li.active:nth-last-of-type(1), li:nth-last-of-type(2) a',
                content: '.post'
            },
            mobile: {
                pagination: '.pagination',
                totalPages: 'li.active:nth-last-of-type(1), li:nth-last-of-type(2) a',
                content: '.post'
            }
        },
        {
            id: 'genpi',
            description: 'genpi.co',
            hostname: /(^|\.)genpi\.co$/,
            path: /\/\d+\/.+(?<!\/\w+)$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '?page=',
            urlHelper: 0,
            desktop: {
                pagination: '.mnmd-pagination',
                totalPages: 'li:nth-last-of-type(3) a',
                content: 'div.entry-content div.col-md-10'
            },
            mobile: {
                pagination: '.mnmd-pagination',
                totalPages: 'li:nth-last-of-type(3) a',
                content: '.entry-content'
            }
        },
        {
            id: 'jpnn',
            description: 'jpnn.com',
            hostname: /(^|\.)jpnn\.com$/,
            path: /\/(news|[a-z-]+\/\d+)\/.+(?<!\/\w+)$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '?page=',
            urlHelper: 0,
            desktop: {
                pagination: '.pagination',
                totalPages: 'li:nth-last-of-type(3) a',
                content: 'div[itemprop=articleBody]'
            },
            mobile: {
                pagination: '.pagination',
                totalPages: 'li:nth-last-of-type(3) a',
                content: '.page-content'
            }
        },
        {
            id: 'republika',
            description: 'republika.co.id',
            hostname: /(^|\.)republika\.co\.id$/,
            path: /^\/berita\/.+(?<!\/\w+)$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '-part',
            urlHelper: 1,
            desktop: {
                pagination: '.pagination',
                totalPages: 'a:nth-last-of-type(2)',
                content: 'article'
            },
            mobile: {
                pagination: '.pagination',
                totalPages: 'li:nth-last-of-type(2) a',
                content: 'article'
            }
        },
        {
            id: 'tempo',
            description: 'tempo.co',
            hostname: /(^|\.)tempo\.co$/,
            path: /^\/read\/.+(?<!\/\w+)$/,
            method: 'xhr',
            dynamic: false,
            nextURL: '?page_num=',
            urlHelper: 0,
            desktop: {
                pagination: '.pagging',
                totalPages: 'li:nth-last-of-type(2) a',
                content: '#isi'
            },
            mobile: {
                pagination: '.pagging',
                totalPages: 'li:nth-last-of-type(2) a',
                content: '#isi'
            }
        }
    ]

    //******************************************************************************

    const isValidURL = websiteList.find(urlChecker)
    if (isValidURL !== undefined) urlRedirector(isValidURL)

    function urlRedirector(website) {
        const redirectURL = new URLBuilder().hostname(url.hostname())
        switch (website.method) {
            case 'param' :
                if (website.id === 'cnbc' || website.id === 'detik' || website.id === 'fajar') {
                    const newPath = url.path().replace(/\/\d+(|\/)$/, '')
                    redirectURL.path(...splitPath(newPath))
                }
                else {
                    redirectURL.path(...splitPath(url.path()))
                }
                redirectURL.param(website.fullpage)
                const newURL = redirectURL.toString()
                if (url.href() !== newURL) redirect(newURL)
                break
            case 'path' :
                const newPath = url.path().replace(/\/\d+$/, '')
                redirectURL.path(...splitPath(newPath), website.fullpage)
                redirect(redirectURL.toString())
                break
            case 'dom' :
            case 'xhr' :
                neutralizeURL(redirectURL, website.id)
        }
    }

    function neutralizeURL(redirectURL, id) {
        switch (id) {
            case 'genpi' :
            case 'jpnn' :
            case 'tempo' :
                clearParamRedirect(redirectURL)
                break
            case 'cnn' :
                cnnRedirect(redirectURL)
                break
            case 'republika' :
                republikaRedirect(redirectURL)
        }
    }

    function clearParamRedirect(redirectURL) {
        if (url.href().includes('?')) {
            redirectURL.path(...splitPath(url.path()))
            redirect(redirectURL.toString())
        }
    }

    function cnnRedirect(redirectURL) {
        if (/\/\d+$/.test(url.path())) {
            const newPath = url.path().replace(/\/\d+$/, '')
            redirectURL.path(...splitPath(newPath))
            redirect(redirectURL.toString())
        }
    }

    function republikaRedirect(redirectURL) {
        if (/-part\d+$/.test(url.path())) {
            const newPath = url.path().replace(/-part\d+$/, '')
            redirectURL.path(...splitPath(newPath))
            redirect(redirectURL)
        }
    }

    //******************************************************************************

    window.addEventListener('DOMContentLoaded', async () => {
        log('DOM telah selesai dimuat')
        const isValidHostname = websiteList.find(hostnameChecker)
        if (isValidHostname.dynamic === true) watchURL(isValidHostname)
        if (isValidURL !== undefined) {
            switch (isValidURL.method) {
                case 'dom':
                    generalDOM(isValidURL)
                    break
                case 'xhr':
                    await generalXHR(isValidURL)
                    break
            }
        }
    })

    const isMobile = /(^|\.)m\./.test(url.hostname()) || window.navigator.userAgent.includes('Mobi')
    const isDesktop = !isMobile

    function generalDOM(website) {
        if (website.id === 'idntimes') {}
    }

    // Deprecated for now
    function idntimesDOM() {
        const readMoreButton = document.querySelector('.read-more-btn-check')
        const splitPage = document.getElementsByClassName('split-page')

        if (readMoreButton !== null) {
            readMoreButton.remove()
            for (let i = 1; i < splitPage.length; i++) {
                splitPage[i].classList.add('open')
            }
        }
    }


    async function generalXHR(website) {
        const selector = isMobile ? website.mobile : website.desktop
        const totalPages = findTotalPages(selector.pagination, selector.totalPages)
        if (totalPages === 1) return
        const mainPageNode = document.querySelector(selector.content)
        cleaner(website.id, mainPageNode, 1, selector.pagination)

        for (let i = 2; i <= totalPages; i++) {
            let nextPageUrl = url.href() + website.nextURL + (i - website.urlHelper)
            let nextPageNode = await getNextPage(nextPageUrl, i, selector.content)
            if (nextPageNode === null) return
            cleaner(website.id, nextPageNode, i, selector.pagination)
            let divider = pageDivider(i, totalPages)
            mainPageNode.append(divider, ...nextPageNode.children)
            log('Menambahkan halaman ke ' + i)
        }
    }

    function findTotalPages(paginationSelector, totalPagesSelector) {
        let pagination, totalPages
        try {
            pagination = document.querySelector(paginationSelector)
            totalPages = pagination.querySelector(totalPagesSelector)
                .textContent
                .match(/\d+/)
        } catch (e) {
            totalPages = 1
            log(e)
        } finally {
            if (totalPages > 1) {
                //pagination.style.display = 'none'
                log('Pagination ditemukan, halaman berjumlah ' + totalPages)
            } else {
                totalPages = 1
                log('Pagination tidak ditemukan')
            }
        }
        return totalPages
    }

    function getNextPage(url, pageNumber, target) {
        log('Bersiap membuat XHR')
        return new Promise((resolve, reject) => {
            const xhrParameter = {
                method: 'GET',
                url: url,
                overrideMimeType: 'text/html; charset=UTF-8',
                responseType: 'document',
                binary: false,
                timeout: 5000, // quick fix untuk error NS_BINDING_ABORTED pada tampermonkey firefox private tab
                headers: {
                    'user-agent': window.navigator.userAgent
                },
                onerror: function () {
                    alert('[AutoAllPage] Tidak bisa membuka halaman ke ' + pageNumber)
                    log('Gagal membuat request XHR')
                    reject(null)
                },
                onload: function (res) {
                    if (res.status === 429) {
                        log('Retry page ' + pageNumber)
                        setTimeout(() => GM_xmlhttpRequest(xhrParameter), 2000)
                    } else {
                        const content = res.response.querySelector(target)
                        if (content != null) {
                            log('Berhasil mendapatkan halaman ke ' + pageNumber)
                            resolve(content)
                        } else {
                            alert('[AutoAllPage] Gagal mendapatkan halaman ke ' + pageNumber)
                            log('Gagal mendapatkan halaman ke ' + pageNumber)
                            reject(null)
                        }
                    }
                }
            }
            GM_xmlhttpRequest(xhrParameter)
        })
    }

    //******************************************************************************

    function cleaner(id, pageNode, pageNumber, pagination) {
        switch (id) {
            case 'cnn' :
                cnnCleaner(pageNode, pageNumber, pagination)
                break
            case 'genpi' :
                genpiCleaner(pageNode, pageNumber, pagination)
                break
            case 'republika' :
                republikaCleaner(pageNode, pageNumber, pagination)
                break
            case 'tempo' :
                tempoCleaner(pageNode, pageNumber, pagination)
        }
    }

    function cnnCleaner(pageNode, pageNumber, pagination) {
        if (pageNumber === 1) {
            document.querySelector('select[name="multipage"]')?.parentElement.remove()
            if (isDesktop) document.querySelector('.skybanner')?.remove()
            if (isMobile) {
                document.querySelector(pagination)?.parentElement.remove()
                document.querySelector('.inline-block > a')?.parentElement.remove()
            }
        }

        if (isDesktop) {
            pageNode.querySelector('.inline-block > a[dtr-evt="halaman"]')?.remove()
            pageNode.querySelector(pagination)?.parentElement.remove()
        }
        log('Membersihkan halaman ke ' + pageNumber)
    }

    function genpiCleaner(pageNode, pageNumber, pagination) {
        if (isDesktop && pageNumber > 1) pageNode.querySelector('.entry-thumb')?.remove()
        const footer = pageNode.querySelector(pagination)
        footer?.nextElementSibling.remove()
        footer?.remove()
        log('Membersihkan halaman ke ' + pageNumber)
    }

    function republikaCleaner(pageNode, pageNumber, pagination) {
        pageNode.querySelector('.baca-juga')?.remove()
        pageNode.querySelector(pagination)?.remove()
        log('Membersihkan halaman ke ' + pageNumber)
    }

    function tempoCleaner(pageNode, pageNumber, pagination) {
        pageNode.querySelector(pagination)?.remove()
        log('Membersihkan halaman ke ' + pageNumber)
    }
})()
