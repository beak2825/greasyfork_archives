// ==UserScript==
// @name         MeFi Domain Labels
// @namespace    https://github.com/klipspringr/mefi-userscripts
// @version      2025-09-19-a
// @description  MetaFilter: label domains in post links. No mystery meat here!
// @author       Klipspringer
// @supportURL   https://github.com/klipspringr/mefi-userscripts
// @license      MIT
// @match        *://*.metafilter.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/545798/MeFi%20Domain%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/545798/MeFi%20Domain%20Labels.meta.js
// ==/UserScript==

;(async () => {
    "use strict"

    const HOSTNAME_EXCLUDE = /^(?:bestof|chat|faq|labs|stuff)\./

    const PATHNAME_INCLUDE =
        /^\/(?:$|\d+\/|activity\/\d+\/?$|activity\/\d+\/posts\/$|archived.mefi|comments\.mefi|home\/|popular\.mefi|tags\/)/

    const PATHNAME_EXCLUDE = /rss$/

    if (
        HOSTNAME_EXCLUDE.test(window.location.hostname) ||
        !PATHNAME_INCLUDE.test(window.location.pathname) ||
        PATHNAME_EXCLUDE.test(window.location.pathname)
    )
        return

    const KEY_DOMAINS_HIGHLIGHT = "domains-highlight"

    const INTERNAL_LABEL_TEXT = "MeFi"

    const LABEL_CLASS = "mfdl-label"
    const HIGHLIGHT_CLASS = "mfdl-highlight"

    const LABEL_CSS = `
        a > span.${LABEL_CLASS} {
            background-color: rgba(0, 0, 0, 0.15);
            border-radius: 5px;
            color:rgba(255, 255, 255, 0.8);
            font-size: 80%;
            font-style: normal;
            font-weight: normal;
            margin-left: 4px;
            padding: 1px 5px 2px 5px;
            user-select: none;
            transition: color 100ms;
            white-space: nowrap;
        }
        a > span.${LABEL_CLASS}.${HIGHLIGHT_CLASS} {
            background-color: rgba(255, 0, 0, 0.4);
            color:rgb(255, 255, 255);
        }
        a:hover > span.${LABEL_CLASS} {
            color: rgb(255, 255, 255);
        }`

    // common patterns for multi-level TLDs like .co.uk, .com.au, etc.
    const COMPLEX_TLDS = /\.(co|com|net|org|gov|edu|ac|mil)\.[a-z]{2}$/i

    const getDomain = (href) => {
        if (!href) return

        let hostname
        try {
            hostname = new URL(href).hostname
        } catch {
            return
        }

        const parts = hostname.split(".")

        if (COMPLEX_TLDS.test(hostname)) {
            return parts.slice(-3).join(".")
        } else {
            return parts.slice(-2).join(".")
        }
    }

    const getHighlightDomains = async () => {
        const value = await GM_getValue(KEY_DOMAINS_HIGHLIGHT, "")
        if (typeof value !== "string") return []
        return value.split(",").map((d) => d.trim().toLowerCase())
    }

    const handleEditHighlightDomains = async () => {
        const existing = await GM_getValue(KEY_DOMAINS_HIGHLIGHT, "")
        const edited = prompt(
            "Domains to highlight in red (comma-separated list):",
            String(existing)
        )
        await GM_setValue(KEY_DOMAINS_HIGHLIGHT, edited || "")
        addDomainLabels()
    }

    const addDomainLabels = async () => {
        // remove any existing labels
        document
            .querySelectorAll(`a > span.${LABEL_CLASS}`)
            .forEach((e) => e.remove())

        const highlightDomains = await getHighlightDomains()

        document
            .querySelectorAll(
                "#posts div.copy:not(.recently) a:not(.smallcopy *), " +
                    "#popposts div.copy:not(#morepostsmsg) a:not(.smallcopy *)"
            )
            .forEach((a) => {
                const domain = getDomain(a.getAttribute("href"))
                if (!domain) return

                const tag = document.createElement("span")

                tag.classList.add(LABEL_CLASS)
                if (highlightDomains.includes(domain))
                    tag.classList.add(HIGHLIGHT_CLASS)

                tag.textContent =
                    domain === "metafilter.com" ? INTERNAL_LABEL_TEXT : domain

                a.insertAdjacentElement("beforeend", tag)

                // remove any stray period after the domain label
                const nextSibling = a.nextSibling
                if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                    const text = nextSibling.textContent
                    if (/^\s*\./.test(text)) {
                        nextSibling.textContent = text.replace(/^\s*\./, "")
                    }
                }
            })
    }

    GM_registerMenuCommand(
        "Edit highlighted domains",
        handleEditHighlightDomains
    )

    const styleElement = document.createElement("style")
    styleElement.textContent = LABEL_CSS
    document.body.insertAdjacentElement("beforeend", styleElement)

    const start = performance.now()
    addDomainLabels()
    console.log(
        "mefi-domain-labels",
        Math.round(performance.now() - start) + "ms"
    )
})()
