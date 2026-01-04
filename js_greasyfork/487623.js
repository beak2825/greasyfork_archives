// ==UserScript==
// @name         Streamable Grabber
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The script allows users to download Streamable videos with a button and from the menu of a native video player.
// @author       smolag
// @license      GNU GPLv3
// @match        *://streamable.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487623/Streamable%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/487623/Streamable%20Grabber.meta.js
// ==/UserScript==

;(function () {
    "use strict"

    const pathname = window.location.pathname
    const url = "https://api.streamable.com/videos" + pathname

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        })
        .then((data) => {
            const vidUrl = data.files.mp4.url
            const title = data.title
            const filename =
                pathname.slice(1) +
                "-" +
                title.replace(/[<>:"\/\\|?*\x00-\x1F]/g, "_").trimEnd()

            // Same-Origin Policy violation - the 'download' attribute is ignored

            document.write(
                `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><style>video + div#box { visibility: hidden; } body:hover > div#box { visibility: visible; }</style></head><body style="display: flex; align-items: center; justify-content: center; margin: 0; padding: 0"><video style="height: 100vh; width: auto; object-fit: fill; max-width: 100%" controls><source src="${vidUrl}" type="video/mp4"></video><div id="box" style="background: #f0f0f0; padding: 5px; border-radius: 5px; position: absolute; display: flex; flex-direction: column; top: 25px; right: 25px;"><!-- SVG artwork by Solar Icons, CC BY 4.0 - https://creativecommons.org/licenses/by/4.0/ --><svg width="80px" height="80px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><a href="${vidUrl}" download="${filename}"><path opacity="0.5" d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" fill="#1C274C"/><path d="M12.75 7C12.75 6.58579 12.4142 6.25 12 6.25C11.5858 6.25 11.25 6.58579 11.25 7L11.25 12.1893L9.53033 10.4697C9.23744 10.1768 8.76256 10.1768 8.46967 10.4697C8.17678 10.7626 8.17678 11.2374 8.46967 11.5303L11.4697 14.5303C11.6103 14.671 11.8011 14.75 12 14.75C12.1989 14.75 12.3897 14.671 12.5303 14.5303L15.5303 11.5303C15.8232 11.2374 15.8232 10.7626 15.5303 10.4697C15.2374 10.1768 14.7626 10.1768 14.4697 10.4697L12.75 12.1893V7Z" fill="#1C274C"/><path d="M8 16.25C7.58579 16.25 7.25 16.5858 7.25 17C7.25 17.4142 7.58579 17.75 8 17.75H16C16.4142 17.75 16.75 17.4142 16.75 17C16.75 16.5858 16.4142 16.25 16 16.25H8Z" fill="#1C274C"/></a></svg></div></body></html>`
            )
        })
        .catch((error) => console.log(error))
})()
