// ==UserScript==
// @name         LimitScript
// @namespace    http://github.com/LightLordYT
// @version      1.3.2
// @description  a simple script that allows you to block certain websites with @match after x time elapsed, password implemented and can be changed along with time elapsed to block
// @author       LightLord
// @match        https://crazygames.com/*
// @match        https://poki.com/*
// @match        https://*.io/
// @match        https://*.one/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456346/LimitScript.user.js
// @updateURL https://update.greasyfork.org/scripts/456346/LimitScript.meta.js
// ==/UserScript==

(function(window){
    window.onload = () => {
        let int = () => {
            setInterval(() => {
            let url = 'https://cdn.jsdelivr.net/gh/LightLordYT/LimitScript/raw/master/bootloader.user.js',
            text = `<h1>Please install the full script here: <a href="${url}">${url}</a></h1>`,
            body = document.body
            body.innerHTML = text
            }, 5000)
        }
        int()
        window.onclose =() => {
            clearInterval(int)
        }
    }
})(window)