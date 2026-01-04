// ==UserScript==
// @author       Xwth
// @name         Original Twitter Image
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @version      1.2
// @match        https://pbs.twimg.com/media/*
// @exclude      /^https?:\/\/pbs\.twimg\.com\/media\/.*\.(jpg|gif|png|jpeg|bmp|webp)\?name=orig(\/*)$/
// @description redirects twitter images to the 'name=orig' keeping the format
// @downloadURL https://update.greasyfork.org/scripts/407821/Original%20Twitter%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/407821/Original%20Twitter%20Image.meta.js
// ==/UserScript==

;(function() {
    window.stop()
    let url = document.URL
    if(document.URL.match(/\?format=/)){
        let match = document.URL.match(/format=\w+/)
        let format = match[0].split("=")[1]
        url = document.URL.replace(/(&name=)(\w+)/,'?name=orig')
        url = url.replace(/(\?format=)(\w+)/,"."+format)
        location.href = url
        return
    } else {
        let re = /^https?:\/\/pbs\.twimg\.com\/media\/.*\.(jpg|gif|png|jpeg|bmp|webp)(?::thumb|:small|:large|:orig)(\/*)$/
        if (re.test(url)) {
            location.href = url.split(':')[1] + '?name=orig'
            return
        }
        location.href = url.split(':')[1] + '?name=orig'
        return
    }
})()