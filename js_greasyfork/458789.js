// ==UserScript==
// @name Vector Layout for Wikipedia (Fast)
// @namespace -
// @version 1.2.1
// @description returns old Wikipedia layout. (layout before 2023 redesign of the website)
// @author NotYou
// @match *://wikipedia.org/*
// @match *://*.wikipedia.org/*

// @match *://wiktionary.org/*
// @match *://*.wiktionary.org/*

// @match *://wikinews.org/*
// @match *://*.wikinews.org/*

// @match *://wikivoyage.org/*
// @match *://*.wikivoyage.org/*

// @match *://wikiquote.org/*
// @match *://*.wikiquote.org/*

// @match *://wikiversity.org/*
// @match *://*.wikiversity.org/*

// @match *://wikibooks.org/*
// @match *://*.wikibooks.org/*

// @match *://wikifunctions.org/*
// @match *://*.wikifunctions.org/*

// @match *://wikidata.org/*
// @match *://*.wikidata.org/*

// @match *://wikisource.org/*
// @match *://*.wikisource.org/*

// @match *://mediawiki.org/*
// @match *://*.wikimedia.org/*

// @run-at document-start
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/458789/Vector%20Layout%20for%20Wikipedia%20%28Fast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458789/Vector%20Layout%20for%20Wikipedia%20%28Fast%29.meta.js
// ==/UserScript==

!function () {
    'use strict';

    const MAKE_CLEAN_URL = false // removes "useskin=vector" after loading

    const IS_DEBUG_MODE = false // instead of redirecting, logs information in console

    class Redirector {
        static canParseUrl(url) {
            try {
                new URL(url)

                return true
            } catch {
                return false
            }
        }

        static getNewUrl(inputUrl) {
            if (!this.canParseUrl(inputUrl)) return null

            const url = new URL(inputUrl)
            const { searchParams, pathname, origin, hash } = url
            const cleanUrl = origin + pathname

            if (searchParams.get('useskin') === 'vector' || url.pathname === '/') {
                return null
            }

            searchParams.set('useskin', 'vector')

            const params = '?' + searchParams.toString()
            const resultUrl = cleanUrl + params + hash

            return resultUrl
        }

        static tryToRedirect(options) {
            options = Object.assign({
                inputUrl: null, // mandatory
                saveHistory: false
            }, options)

            if (typeof options.inputUrl !== 'string') {
                throw new Error('"inputUrl" is not a string')
            }

            if (!this.canParseUrl(options.inputUrl)) {
                throw new Error('Cannot parse "inputUrl": ' + String(options.inputUrl))
            }

            if (typeof options.saveHistory !== 'boolean') {
                throw new Error('"saveHistory" is not a boolean')
            }

            const newUrl = this.getNewUrl(options.inputUrl)

            if (newUrl === null) {
                return false
            }

            if (IS_DEBUG_MODE) {
                console.log('VLW - Debug\n', newUrl)

                return false
            }

            if (options.saveHistory) {
                location.assign(newUrl)
            } else {
                location.replace(newUrl)
            }

            return true
        }
    }

    class Main {
        static isNullish(value) {
            return value === undefined || value === null
        }

        static getLinkNode(node) {
            if (node.tagName.toLowerCase() === 'a') {
                return node
            } else if (node.tagName.toLowerCase() === 'html' || this.isNullish(node.tagName)) {
                return null
            }

            return this.getLinkNode(node.parentNode)
        }

        static clearUrl() {
            const url = new URL(location.href)
            const { searchParams, pathname, hash } = url

            if (searchParams.get('useskin') !== 'vector') {
                return
            }

            searchParams.delete('useskin')

            const newSearchParams = searchParams.toString()
            const newPath = pathname + (newSearchParams ? '?' + newSearchParams : newSearchParams) + hash

            console.log(newPath)

            history.replaceState({}, '', newPath)
        }

        static onClick(ev) {
            const link = this.getLinkNode(ev.target)

            if (link !== null && !(ev.ctrlKey || ev.metaKey)) {
                const url = new URL(link.href)
                const isOrigin = url.hostname === location.hostname
                const isNotAnchor = !link.getAttribute('href').startsWith('#')
                const isOnlyLink = !link.getAttribute('role')

                if (isOrigin && isNotAnchor && isOnlyLink) {
                    ev.preventDefault()

                    Redirector.tryToRedirect({
                        inputUrl: link.href,
                        saveHistory: true
                    })
                }
            }
        }

        static init() {
            let didRedirect = Redirector.tryToRedirect({
                inputUrl: location.href,
                saveHistory: false
            })

            if (didRedirect) {
                return
            }

            window.addEventListener('click', ev => this.onClick(ev))
            window.addEventListener('auxclick', ev => this.onClick(ev))

            if (MAKE_CLEAN_URL) {
                this.clearUrl()
            }
        }
    }

    Main.init()
}()