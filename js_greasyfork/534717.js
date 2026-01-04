// ==UserScript==
// @name         Minglong fixer
// @namespace    http://senritsu.dev/
// @version      2025-05-02-fix-3
// @description  Fix http download links
// @author       senritsu
// @match        https://nipponsei.minglong.org/tracker/
// @match        https://nipponsei.minglong.org/index.php?section=Tracker&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534717/Minglong%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/534717/Minglong%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('a[href^="http://"]').forEach(node => {
        const href = node.href
        const filename = decodeURIComponent(href.replace('http://tracker.minglong.org/torrents/', ''))
        const handler = async (event) => {
            event.stopPropagation()
            event.preventDefault()
            const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(href)}`)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            a.remove()
        }

        node.onclick = handler
    })
})();