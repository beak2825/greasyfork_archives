// ==UserScript==
// @name    freeTouchfish
// @icon    https://weread.qq.com/favicon.ico
// @version    1.0.0-alpha3
// @description    摸鱼专用，更多网址，可自行添加@match xxx
// @author    JadeQiu
// @match    https://weread.qq.com/*
//// @match *://*/*
// @license    MIT
// @namespace https://greasyfork.org/users/981895
// @downloadURL https://update.greasyfork.org/scripts/487589/freeTouchfish.user.js
// @updateURL https://update.greasyfork.org/scripts/487589/freeTouchfish.meta.js
// ==/UserScript==

window.onload = function () {
    let link = document.querySelectorAll("*[rel*='ico']")
    link.forEach(l => {
        l.setAttribute('href', 'https://xada.cdadafdafeawfwafwafewa.png')
    })
    document.title = '新  标  签    页 . . . . . . . . . . . . .  . . . . . . . ' + document.title
    console.log(link)
}