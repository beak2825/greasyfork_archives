// ==UserScript==
// @name         get超星听力进度条
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  把听力的进度条显示出来，通过操纵把dom替换为原生的audio
// @author       hanhan9449
// @match        *://*.chaoxing.com/work*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399041/get%E8%B6%85%E6%98%9F%E5%90%AC%E5%8A%9B%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/399041/get%E8%B6%85%E6%98%9F%E5%90%AC%E5%8A%9B%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==
'use strict'
function main () {
    var audioIFrames = document.getElementsByClassName('ans-insertaudio-module')
    for (var iframe of audioIFrames) {
        iframe.style.width = '100%'
        var iframeDoucment = iframe.contentDocument
        var audio = iframeDoucment.getElementsByTagName('audio')[0]
        var style = audio.style
        style.width = '100%'
        style.height = '30px'
        style.visibility = ''
        var body = iframeDoucment.getElementsByTagName('body')[0]
        var reader = body.getElementsByTagName('div')[0]
        body.replaceChild(audio, reader)
    }
}
window.onload = function() {
    setTimeout(main, 500)
}