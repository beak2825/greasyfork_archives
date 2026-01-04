// ==UserScript==
// @name ShareMods Downloader
// @version 1
// @description Just a bypasser
// @include /^https?:\/\/sharemods\.com\/[\w\d]{12}\/.+\.html$/
// @grant unsafeWindow
// @namespace https://greasyfork.org/users/870859
// @downloadURL https://update.greasyfork.org/scripts/439328/ShareMods%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/439328/ShareMods%20Downloader.meta.js
// ==/UserScript==

(function() {
    const [,id] = /^\/([\w\d]{12})\/.+\.html/.exec(location.pathname)
    location.replace(location.origin + '/?op=download2&id=' + id)

    // Para contar click.
    // $('#downloadbtn').click()
})()