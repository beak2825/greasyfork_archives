// ==UserScript==
// @name         Gdrive Source getter
// @namespace    https://*/*
// @version      2024-06-14.00
// @description  Nested gdrive embed source extractor
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496936/Gdrive%20Source%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/496936/Gdrive%20Source%20getter.meta.js
// ==/UserScript==

function onFirstEmbedLoad(ev) {
    const secondEmbedPattern = /<iframe.*?src="(\S*?)"/gm
    const text = ev.responseText

    const regResult = secondEmbedPattern.exec(text)
    if (!regResult[1]) {
        return
    }

    if (confirm("Found gdrive embed. Do you want to go to the source?")) {
        window.location = regResult[1]
    }
}

(async function() {

    const firstEmbedPattern = /src="(\S*?embed\.xplyr\.top\/v.*?)"[ ]*?title=/gm
    const bodyText = document.body.innerHTML

    const exprResult = firstEmbedPattern.exec(bodyText)
    if (!exprResult[1]) {
        return
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: exprResult[1],
        onload: onFirstEmbedLoad
    })



})()
