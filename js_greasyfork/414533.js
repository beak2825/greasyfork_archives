// ==UserScript==
// @name         Antispoiler for UEFA.tv
// @description  hide spoilers on UEFA.tv
// @namespace    https://aoytsk.blog.jp/
// @version      0.3.0
// @author       aoytsk
// @license      MIT License
// @match        https://www.uefa.tv/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/414533/Antispoiler%20for%20UEFAtv.user.js
// @updateURL https://update.greasyfork.org/scripts/414533/Antispoiler%20for%20UEFAtv.meta.js
// ==/UserScript==

(function() {
    'use strict'

    function cssOverride() {
        const css = document.createElement("style")
        css.style.type = "text/css"
        document.head.appendChild(css)
        // seek bar
        css.sheet.insertRule(".video-js .vjs-utv-timeline-control {display: none !important}")
        // activity
        css.sheet.insertRule('main > ol[class|="Match__EventsSection"] {display: none !important}')
        // headline
        css.sheet.insertRule("h1.hero-slide__headline {display: none !important}")
        // video description
        // css.sheet.insertRule("p[class*='VideoDescription'] {display: none !important}")
    }

    class Router {
        constructor(routes, root) {
            this.routes = {}
            this.current = undefined
            this.root = root || document.body
            for (const [key, value] of Object.entries(routes)) {
                this.routes[key] = this.newObserver(value)
            }
        }
        newObserver(callback) {
            return new MutationObserver((mutations, observer) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (callback(node) === true) {
                            observer.disconnect()
                        }
                    });
                });
            });
        }
        on(path) {
            if (this.current instanceof MutationObserver) {
                this.current.disconnect()
            }
            const key = path.match(/[^\d]+/)[0]
            this.current = this.routes[key]
            if (this.current instanceof MutationObserver) {
                this.current.observe(this.root, { childList: true, subtree: true })
            }
        }
    }

    function replaceTitle(node, selector) {
        function replace(node) {
            node.textContent = node.textContent.replace(/\d+-\d+/gi, "-")
        }
        if(selector) {
            const titles = node.querySelectorAll(selector)
            titles.forEach(title => {
                replace(title)
            })
        } else {
            replace(node)
        }
    }
    function onindex(node) {
        function checkSection(node) {
            return node.classList.contains('titled-section')
        }
        function checkArticle(node) {
            return node.classList.contains('event-list-item--vertical')
        }
        const selector = 'h1.rail-slide__title > span'
        switch(node.tagName) {
            case 'MAIN':{
                if(node.querySelector('section.titled-section')) {
                    break
                }
                const id = setInterval(function(){
                    const section = node.querySelector('section.titled-section')
                    if(section) {
                        replaceTitle(section.parentElement, selector)
                        clearInterval(id)
                    }
                },200)
                break;}
            case 'DIV':
                if(node.firstElementChild && checkSection(node.firstElementChild)) {
                    replaceTitle(node, selector)
                }
                break;
            case 'SECTION':
                if(checkSection(node)) {
                    replaceTitle(node, selector)
                }
                break;
            case 'ARTICLE':
                if(checkArticle(node)) {
                    replaceTitle(node, selector)
                }
                break;
        }
    }
    function onvideo(node) {
        function addRateButtons(node) {
            const button = document.createElement('button')
            button.className = 'vjs-utv-watchlater vjs-control vjs-button'
            const bar = node.querySelector('div.vjs-control-bar')
            const watchlater = node.querySelector('button.vjs-utv-watchlater')
            const video = node.querySelector('video')
            const list = [0.1,1.0,1.5,2.0]
            list.forEach(n => {
                let clone = button.cloneNode(false)
                clone.value = n
                clone.textContent = `▶${n}`
                clone.addEventListener('click', e => {
                    video.playbackRate = e.target.value
                })
                bar.insertBefore(clone, watchlater)
            })
        }
        switch(node.tagName) {
            case 'DIV':
                if(node.id === 'uefa-tv-player') {
                    addRateButtons(node)
                    return true
                }
                break
            case 'SECTION':{
                const title = node.querySelector('h1[class*="VideoTitle"]')
                if(title) {
                    replaceTitle(title)
                }
                const toggle = node.querySelector('div[class*="Video__VideoDescriptionToggle"]')
                if(toggle) {
                    toggle.click()
                }
                break}
        }
    }

    const router = new Router({
        "/": onindex,
        "/match/vod/": onvideo,
        "/video/vod/": onvideo,
    }, document.getElementById("root"))

    const pushState = history.pushState;
    history.pushState = function (state, title, path) {
        router.on(path)
        pushState.apply(history, arguments)
    };

    cssOverride()
    router.on(location.pathname)

})();