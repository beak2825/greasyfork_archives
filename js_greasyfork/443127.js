// ==UserScript==
// @name         MDM 翻译
// @description  Master Duel Meta 卡片名称、效果翻译
// @version      0.3
// @author       Fwindy
// @match        https://www.masterduelmeta.com/*
// @icon         https://www.google.com/s2/favicons?domain=masterduelmeta.com
// @namespace    https://github.com/Fwindy
// @connect      ygocdb.com
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/443127/MDM%20%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/443127/MDM%20%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    "use strict"
    onload = () => {
        translate()
        const observer = new MutationObserver(tooltipTranslate)
        const config = {
            attributes: false,
            childList: true,
            characterData: false,
        }
        observer.observe(document.querySelector("#tooltip-root"), config)
    }
    if (window.onurlchange === null) {
        window.addEventListener("urlchange", translate)
    }

    function translate () {
        if (location.href.match(/masterduelmeta.com\/cards/)?.length > 0) {
            const hrefName = decodeURIComponent(
                decodeURI(/([^\/]*)$/.exec(location.href)[0])
            )
            const cardName = document.getElementsByClassName("h1")[0]
            const cardType =
                document.getElementsByClassName("monster-types")[0]
            const cardDescription =
                document.getElementsByClassName("card-desc")[0]

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ygocdb.com/api/v0/?search=" + hrefName,
                responseType: "json",
                onload: function (r) {
                    if (r.status === 200) {
                        const result = r.response.result.filter(
                            (x) => x.en_name === hrefName || x.wiki_en === hrefName
                        )[0] || r.response.result[0]
                        cardName.innerText = result.cn_name
                        if (cardType?.innerText)
                            cardType.innerText = /^[^\/]*/.exec(
                                result.text.types
                            )[0]
                        if (result.text.pdesc) {
                            [...cardDescription.children].forEach(x => x.remove())
                            const defaultClass = cardDescription.parentElement.className
                            appendNode(cardDescription, defaultClass+' pendulum-eff', '[灵摆效果]')
                            appendNode(cardDescription, defaultClass, result.text.pdesc)
                            appendNode(cardDescription, defaultClass+' monster-eff', '[怪兽效果]')
                            appendNode(cardDescription, defaultClass, result.text.desc)
                        } else {
                            cardDescription.innerText = result.text.desc
                        }
                    }
                },
            })
        }
    }

    function tooltipTranslate () {
        const cardName = document.querySelector(
            "#tooltip-root div.card-specs > div.spec-container > span > b"
        )
        const cardType = document.querySelector("#tooltip-root span.monster-types > b")
        const cardDescription = document.querySelector("#tooltip-root span.card-desc")
        if (cardName?.innerText) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ygocdb.com/api/v0/?search=" + cardName.innerText,
                responseType: "json",
                onload: function (r) {
                    if (r.status === 200) {
                        const result = r.response.result.filter(
                            (x) => x.en_name === cardName.innerText || x.wiki_en === cardName.innerText
                        )[0] || r.response.result[0]
                        if (result?.cn_name) {
                            cardName.innerText = result.cn_name
                            if (cardType)
                                cardType.innerText = /^[^\/]*/.exec(
                                    result.text.types
                                )[0]
                            if (result.text.pdesc) {
                                [...cardDescription.children].forEach(x => x.remove())
                                const defaultClass = cardDescription.parentElement.className
                                appendNode(cardDescription, defaultClass+' pendulum-eff', '[灵摆效果]')
                                appendNode(cardDescription, defaultClass, result.text.pdesc)
                                appendNode(cardDescription, defaultClass+' monster-eff', '[怪兽效果]')
                                appendNode(cardDescription, defaultClass, result.text.desc)
                            } else {
                                cardDescription.innerText = result.text.desc
                            }
                        }
                    }
                },
            })
        }
    }

    function appendNode (target, className, text) {
        const span = document.createElement('span')
        span.className = className
        span.innerText = text
        target.appendChild(span)
    }
})()
