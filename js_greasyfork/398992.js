// ==UserScript==
// @name         icourses Hotkey
// @namespace    http://shanqiaosong.com
// @version      0.1
// @description  try to take over the world!
// @author       Shanqiaosong
// @match        https://www.icourses.cn/web/sword/portal/shareDetails?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398992/icourses%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/398992/icourses%20Hotkey.meta.js
// ==/UserScript==

(function() {
    document.getElementsByTagName('html')[0].addEventListener('keydown',function(e){if(e.keyCode==190){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[3].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==190){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[4].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keydown',function(e){if(e.keyCode==191){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[2].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==191){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[4].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==97){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[4].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==98){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[3].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==99){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-menu-item')[2].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keyup',function(e){if(e.keyCode==13){
        document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-fullscreen-control')[0].click()
    }})
    document.getElementsByTagName('html')[0].addEventListener('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==32){
           document.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('vjs-play-control')[0].click()
        }
    })
})();