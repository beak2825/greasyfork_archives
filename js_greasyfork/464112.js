// ==UserScript==
// @name         Filter Videos
// @namespace    website.blue
// @version      0.2
// @description  show all video posts
// @author       You
// @match        https://lue.websight.blue/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=websight.blue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464112/Filter%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/464112/Filter%20Videos.meta.js
// ==/UserScript==

const userbar = document.querySelector(".userbar")
const link = document.createElement('a')

// if hash in url, remove all messages without videos
// if no hash property, show filter button in userbar

if (window.location.href.includes("#filterVideos")) {

    link.href = "javascript:history.back()"
    link.innerText = 'Back to Thread'
    userbar.insertAdjacentText('beforeend', " | ")
    userbar.insertAdjacentElement('beforeend', link)


    for (const video of document.querySelectorAll('video')) {
        video.pause()
    }

    const messages = document.querySelectorAll('.message-container')

    for (const message of messages) {

        if (!message.querySelector('video')) {
            message.remove()
        }

        //remove post if the post only contains quoted video
        const parentNodes = [...message.querySelectorAll('video')].map(el => {
            console.log(el.parentNode.parentNode.tagName)
            return el.parentNode.parentNode.tagName


        })

        if (!parentNodes.includes('DIV')) {
            message.remove()
        }

    }
} else {

    link.href = `${window.location.href.match(/https:\/\/.*\.websight\.blue\/thread\/\d+/)[0]}#filterVideos`
    link.innerText = 'Show Videos'
    userbar.insertAdjacentText('beforeend', " | ")
    userbar.insertAdjacentElement('beforeend', link)
}
