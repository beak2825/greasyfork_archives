// ==UserScript==
// @name         Sankaku Bring back post sources
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring back the source link in beta.sankakucomplex.com
// @author       You
// @match        https://beta.sankakucomplex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankakucomplex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471012/Sankaku%20Bring%20back%20post%20sources.user.js
// @updateURL https://update.greasyfork.org/scripts/471012/Sankaku%20Bring%20back%20post%20sources.meta.js
// ==/UserScript==

'use strict';
(w => {
    const LOG_ENABLED = false

    const log = (...data) => {
        if (!LOG_ENABLED) return
        console.log(...data)
    }

    const matchPostId = () => w.location.pathname.match?.(/\/post\/show\/(\d+)$/)?.[1]
    const fetchPostInfo = (id) =>
        w.fetch(`https://capi-v2.sankakucomplex.com/posts?lang=en&page=1&limit=1&tags=id_range:${id}`)
         .then(res => res.json())
         .then(res => res?.[0])
    const selectorAll = sel => [...w.document.querySelectorAll(sel)]
    const findUploaderField = () =>
        selectorAll('.MuiGrid-item')
          .find(el => el.textContent === 'Uploader')
          ?.parentElement
          ?.lastElementChild
    const makeSourceLink = () => {
        const el = w.document.createElement('a')
        el.textContent = 'Source'
        el.style.textAlign = 'right'
        el.dataset.bring_back_src = '1'
        return el
    }

    let rememberLastId

    const run = async () => {
        const id = matchPostId()
        if (!id) {
            log('not in post page')
            return
        }

        const uploaderEl = findUploaderField()
        if (!uploaderEl) {
            log('not found uploader field to inject into')
            return
        }

        if (id === rememberLastId) {
            log('same as last one')
            return
        }
        rememberLastId = id

        let post
        try {
            post = await fetchPostInfo(id)
        } catch (e) {
            log('error fetching source for post using api', e)
            return
        }
        const src = post?.source

        const alreadyInjected = uploaderEl.lastElementChild?.dataset.bring_back_src
        let link
        if (alreadyInjected) {
            link = uploaderEl.lastElementChild
        } else {
            link = makeSourceLink()
            uploaderEl.appendChild(link)
        }

        log('updating source link')
        if (src) {
            link.href = src
            link.style.pointerEvents = null
            link.style.color = null
            link.style.textDecoration = null
        } else {
            link.href = '#'
            link.style.pointerEvents = 'none'
            link.style.color = 'inherit'
            link.style.textDecoration = 'none'
        }
        uploaderEl.style.display = 'flex'
        uploaderEl.style.flexFlow = 'column'
    }

    setInterval(run, 500)
})(window);