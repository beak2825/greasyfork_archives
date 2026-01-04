// ==UserScript==
// @name         MeFi Navigator Redux
// @namespace    https://github.com/klipspringr/mefi-userscripts
// @version      2025-08-29-a
// @description  MetaFilter: navigate through users' comments, and highlight comments by OP and yourself
// @author       Klipspringer
// @supportURL   https://github.com/klipspringr/mefi-userscripts
// @license      MIT
// @match        *://*.metafilter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531257/MeFi%20Navigator%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/531257/MeFi%20Navigator%20Redux.meta.js
// ==/UserScript==

;(() => {
    "use strict"

    if (
        !/^\/(\d|comments\.mefi)/.test(window.location.pathname) ||
        /rss$/.test(window.location.pathname)
    ) {
        return
    }

    const SVG_UP = `<svg xmlns="http://www.w3.org/2000/svg" hidden style="display:none"><path id="mfnr-up" fill="currentColor" d="M 0 93.339 L 50 6.661 L 100 93.339 L 50 64.399 L 0 93.339 Z" /></svg>`
    const SVG_DOWN = `<svg xmlns="http://www.w3.org/2000/svg" hidden style="display:none"><path id="mfnr-down" fill="currentColor" d="M 100 6.69 L 50 93.31 L 0 6.69 L 50 35.607 L 100 6.69 Z" /></svg>`

    // CSS notes:
    // - mfnr-op needs to play nicely with .mod in threads where OP is a mod
    // - classic theme has different margins from modern, so we can't change margin-left without knowing what theme we're on
    // - relative positioning seems to work better
    const INJECTED_CSS = `<style>
        .mfnr-op {
            border-left: 5px solid #0004 !important;
            padding-left: 10px !important;
            position: relative !important;
            left: -15px !important;
        }
        @media (max-width: 550px) {
            .mfnr-op {
                left: -5px !important;
            }
        }
        .mfnr-me {
            background-color: #C8E0A1;
            border-radius: 2px;
            color: #223C23;
            font-size: 0.8em;
            margin-left: 4px;
            padding: 0 4px;
        }
        .mfnr-nav {
            white-space: nowrap;
        }
        .mfnr-nav svg {
            vertical-align: middle;
            top: -1px;
        }
        </style>`

    const getCookie = (key) => {
        const s = RegExp(key + "=([^;]+)").exec(document.cookie)
        if (!s || !s[1]) return null
        return decodeURIComponent(s[1])
    }

    const markCommentByMe = (targetNode) => {
        // check we haven't added a badge already
        if (targetNode.querySelector("span.mfnr-me")) return

        const span = document.createElement("span")
        span.classList.add("mfnr-me")
        span.textContent = "me"
        targetNode.appendChild(span)
    }

    const markCommentByPoster = (targetNode) =>
        targetNode.parentElement.parentElement.classList.add("mfnr-op")

    const createNavigateLink = (svgHref) => {
        const a = document.createElement("a")
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        )
        svg.setAttribute("width", "1em")
        svg.setAttribute("viewBox", "0 0 100 100")
        svg.setAttribute("class", "mfnr-nav")
        const use = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "use"
        )
        use.setAttribute("href", "#" + svgHref)
        svg.appendChild(use)
        a.appendChild(svg)
        return a
    }

    const run = (firstRun) => {
        const start = performance.now()

        // if not first run, remove any existing navigators (from both post and comments)
        if (!firstRun) {
            document
                .querySelectorAll("span.mfnr-nav")
                .forEach((n) => n.remove())
        }

        // get post node
        // query tested on all subsites, modern and classic, 2025-04-10
        const postNode = document.querySelector(
            "div.copy > span.smallcopy > a:first-child"
        )

        if (!postNode) throw Error("Failed to find postNode")

        const poster = postNode.firstChild.textContent.trim()

        // map users to their comments. initialise with the post
        const mapUsersBylines = new Map([
            [poster, [{ node: postNode, anchor: "#top" }]],
        ])

        // get comment nodes, excluding live preview
        // query tested on all subsites, modern and classic, 2025-04-10
        const commentNodes = document.querySelectorAll(
            "div.comments:not(#commentform *) > span.smallcopy > a:first-child"
        )

        commentNodes.forEach((node) => {
            const user = node.firstChild.textContent.trim() // get firstChild so we ignore any badges, e.g. "me"

            const anchorElement =
                node.parentElement.parentElement.previousElementSibling

            const anchor = "#" + anchorElement.getAttribute("name")

            const bylines = mapUsersBylines.get(user)
            if (bylines) {
                bylines.push({ node, anchor })
            } else {
                mapUsersBylines.set(user, [{ node, anchor }])
            }
        })

        mapUsersBylines.forEach((bylines, user) => {
            bylines.forEach(({ node }, i) => {
                if (i > 0 && me !== null && user === me) markCommentByMe(node)

                // highlight poster comments, unless subsite has this built in
                if (
                    i > 0 &&
                    subsite !== "ask" &&
                    subsite !== "projects" &&
                    user === poster
                )
                    markCommentByPoster(node)

                if (bylines.length <= 1) return

                const navigator = document.createElement("span")
                navigator.setAttribute("class", "mfnr-nav")

                const nodes = ["["]

                const previous = bylines[i - 1]?.anchor
                if (previous) {
                    const clone = navigatePrevious.cloneNode(true)
                    clone.setAttribute("href", previous)
                    nodes.push(clone)
                }

                nodes.push(bylines.length)

                const next = bylines[i + 1]?.anchor
                if (next) {
                    const clone = navigateNext.cloneNode(true)
                    clone.setAttribute("href", next)
                    nodes.push(clone)
                }

                nodes.push("]")

                navigator.append(...nodes)

                node.parentElement.appendChild(navigator)
            })
        })

        console.log(
            "mefi-navigator-redux",
            firstRun ? "first-run" : "new-comments",
            1 + commentNodes.length,
            Math.round(performance.now() - start) + "ms"
        )
    }

    document.body.insertAdjacentHTML("beforeend", SVG_UP + SVG_DOWN)
    document.body.insertAdjacentHTML("beforeend", INJECTED_CSS)

    const navigatePrevious = createNavigateLink("mfnr-up")
    const navigateNext = createNavigateLink("mfnr-down")

    const subsite = window.location.hostname.split(".", 1)[0]

    const me = getCookie("USER_NAME")

    const newCommentsElement = document.getElementById("newcomments")
    if (newCommentsElement) {
        const observer = new MutationObserver(() => run(false))
        observer.observe(newCommentsElement, { childList: true })
    }

    run(true)
})()
