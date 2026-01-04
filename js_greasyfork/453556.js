// ==UserScript==
// @name         Prevent Paramount Autoplay
// @namespace    prevent-paramount-autoplay
// @description  Automatically pauses the video when the autoplay screen appears.
// @version      0.1
// @match        https://www.paramountplus.com/shows/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paramountplus.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453556/Prevent%20Paramount%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/453556/Prevent%20Paramount%20Autoplay.meta.js
// ==/UserScript==

setInterval(function(){
    const autoplayPanel = document.querySelector('.continuous-play-panel-content')
    if(autoplayPanel){
        document.querySelector('video').pause()
    }
}, 1000)
