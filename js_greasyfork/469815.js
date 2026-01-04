// ==UserScript==
// @name         spankbang video visited link
// @namespace    https://greasyfork.org/users/25356
// @version      0.2
// @description  Just make visited vidoes more visible
// @author       CoLdAsIcE
// @match        https://id.spankbang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spankbang.com
// @grant        GM_addStyle
// @grant        window
// @license GNU General Public
// @downloadURL https://update.greasyfork.org/scripts/469815/spankbang%20video%20visited%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/469815/spankbang%20video%20visited%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(".visited {text-decoration: underline} a:visited.visited {color:green !important}")
    const aTagsInVideoNodes = document.querySelectorAll('.video-item[data-group] a:nth-child(2)')
    if (aTagsInVideoNodes) {
        const aTagsInVideo = [...aTagsInVideoNodes]
        aTagsInVideo.forEach(aTag => {
            console.log(aTag.classList.add("visited"))
        })

    }
    const video = document.querySelector('#main_video_player_html5_api')

    let i = 0;
    const handleClick = () => {
        i++
        if(i === 1) {
            video.volume &&= 0.022727272727272728
            console.log(i)
        }
    }
    video.addEventListener("play", handleClick);

})();