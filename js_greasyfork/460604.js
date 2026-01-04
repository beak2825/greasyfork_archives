// ==UserScript==
// @name         平板网页全屏
// @namespace    自用
// @version      0.3
// @description  平板可用，按F11全屏
// @author       me
// @match        https://**/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460604/%E5%B9%B3%E6%9D%BF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460604/%E5%B9%B3%E6%9D%BF%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function toggleFullScreen() {
                const O = document.querySelector('html')
                if (document.fullscreen !== void 0)
                    if (document.fullscreen)
                        try {
                            return await document.exitFullscreen()
                        } catch {
                            console.log("toggleFullScreen(): exitFullscreen failed")
                        }
                    else
                        try {
                            return await O.requestFullscreen()
                        } catch {
                            console.log("toggleFullScreen(): requestFullscreen failed")
                        }
                if (document.webkitIsFullScreen !== void 0)
                    try {
                        document.webkitIsFullScreen ? document.webkitExitFullscreen() : O.webkitRequestFullscreen()
                    } catch {
                        console.log("toggleFullScreen(): requestFullscreen/exitFullscreen failed")
                    }
            }
    window.addEventListener('keyup', function(event) {
        if(event.key == "F11") {
            console.log(event)
            toggleFullScreen()
        }
    });
    /*
    var div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.zIndex = '999999'
    div.style.left = '50px'
    div.style.top = '50px'

    div.innerText = '123123'
    document.body.prepend(div)
    div.onclick = toggleFullScreen
    */
    // Your code here...
})();