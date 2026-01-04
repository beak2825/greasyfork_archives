// ==UserScript==
// @name         isCF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测当前网站是否使用 cloudflare cdn
// @author       ayase
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/431349/isCF.user.js
// @updateURL https://update.greasyfork.org/scripts/431349/isCF.meta.js
// ==/UserScript==


(async () => {
    const dbName = 'isCFHadPopped'

    if (localStorage.getItem(dbName)){
        return
    }
    const resp = await fetch(location.origin)
    if (resp.headers.get('cf-ray')){
        localStorage.setItem(dbName, "true")
        alert(`this website is using cloudflare CDN!`)
    } else {
        localStorage.setItem(dbName, "false")
    }

})()
