// ==UserScript==
// @name           turn off bilibili danmaku
// @description    默认关闭弹幕功能
// @namespace      wulawulawula
// @author         愛梨
// @license        GNU GPLv3
// @version        20180330
// @encoding       utf-8
// @grant          none
// @include        https://www.bilibili.com/video/av*
// @include        http://www.bilibili.com/video/av*
// @include        https://bangumi.bilibili.com/anime/*/play*
// @include        http://bangumi.bilibili.com/anime/*/play*
// @include        https://live.bilibili.com*
// @include        http://live.bilibili.com*
// @include        *://www.bilibili.com/bangumi/play/ep*
// @include        *://www.bilibili.com/bangumi/play/ss*
// @include        *://www.bilibili.com/watchlater/#/av*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/39880/turn%20off%20bilibili%20danmaku.user.js
// @updateURL https://update.greasyfork.org/scripts/39880/turn%20off%20bilibili%20danmaku.meta.js
// ==/UserScript==


var check;

function checkPlayerLoaded() {
    console.log('[SCRIPT-TurnOffDanmaku] check')

    let iframe, animeP, videoP, player

    iframe = document.querySelector('iframe')
    if (iframe) {
        animeP = iframe.contentWindow.document.body.querySelector(
            `#bilibiliPlayer`)
    }

    videoP = document.body.querySelector('#bilibiliPlayer')

    player = animeP || videoP

    let video = player.querySelector('video')
    if (video) {
        clearInterval(check)
        console.log('[SCRIPT-TurnOffDanmaku] bilibili player loaded')
        trigger()
    }
}




function trigger() {
    let iframe, animeP, videoP, player

    iframe = document.querySelector('iframe')
    if (iframe) {
        animeP = iframe.contentWindow.document.body.querySelector(
            `#bilibiliPlayer`)
    }

    videoP = document.body.querySelector('#bilibiliPlayer')

    player = animeP || videoP

    let btn = player.querySelector(`
            .bilibili-player-video-btn.bilibili-player-video-btn-danmaku`)
    let panel = player.querySelector(`
           .bilibili-player-danmaku-setting-lite-panel`)
    console.log('[SCRIPT-TurnOffDanmaku] Btn: \n', btn)
    btn.click();
    if (btn.getAttribute('name') === 'ctlbar_danmuku_on') {
        panel.style.display = 'none';
    }
}


function execOnVideosPage() {

    check = setInterval(checkPlayerLoaded, 1000)

    window.onhashchange = () => {
        console.log('hash changed')
        clearInterval(check)
        check = setInterval(checkPlayerLoaded, 1000)
    }

    document.addEventListener('keypress', (evt) => {
        if (evt.key === 'm' && evt.altKey) {
            console.log('[SCRIPT-TurnOffDanmaku] alt + m')
            trigger()
        }
    })

    // https://stackoverflow.com/questions/5129386
    window.addEventListener('pushState', function(e) {
        console.log('history pushState');
        clearInterval(check)
        console.log('check canceled');
        check = setInterval(checkPlayerLoaded, 1000)
    })


}


function checkLivePlayerLoaded() {
    // console.log('[SCRIPT-TurnOffDanmaku] check')
    try {
        let liveplayer = document.body.querySelector('#live-player')
        let livevideo = document.body.querySelector('#live-video')
        let player = liveplayer || livevideo
        let video = player.querySelector('video')
        if (video) {
            clearInterval(check)
            console.log('[SCRIPT-TurnOffDanmaku] bilibili live player loaded')
            livetrigger()
        }
    }
    catch(err){}
}


function livetrigger() {
    let btn = document.querySelector(`
                .bilibili-live-player-video-controller-hide-danmaku-btn`)
    btn = btn.querySelector('button')
    btn.click()
}


function execOnLivePage() {

    check = setInterval(checkLivePlayerLoaded, 1000)

    let aitem = document.querySelectorAll('.player-aside div.aside-item')

    Array.from(aitem).forEach(item => {
        item.addEventListener('click', function(evt) {
            clearInterval(check)
            check = setInterval(checkLivePlayerLoaded, 1000)
        })
    })

    document.addEventListener('keypress', (evt) => {
        if (evt.key === 'm' && evt.altKey) {
            console.log('[SCRIPT-TurnOffDanmaku] alt + m')
            livetrigger()
        }
    })
}


function historyPushState(evt) {
    let oevt = history[evt]
    return function() {
        let nevt = oevt.apply(this, arguments)
        let pushstate = new Event(evt)
        pushstate.arguments = arguments
        window.dispatchEvent(pushstate)
        return nevt
    }
}


history.pushState = historyPushState('pushState')


function main() {

    if (location.hostname === 'live.bilibili.com') {
        execOnLivePage()
    }
    else {
        execOnVideosPage()
    }

}

main()