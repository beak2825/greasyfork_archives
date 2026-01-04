// ==UserScript==
// @name         91pu免費移調(簡約版)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  實現移調、級數功能，且去除惱人的廣告
// @author       YC白白
// @match        https://www.91pu.com.tw/song/*
// @match        https://www.91pu.com.tw/index.html
// @match        https://www.91pu.com.tw/m/index.shtml/*
// @match        https://www.91pu.com.tw/m/*
// @icon         https://www.google.com/s2/favicons?domain=91pu.com.tw
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/445189/91pu%E5%85%8D%E8%B2%BB%E7%A7%BB%E8%AA%BF%28%E7%B0%A1%E7%B4%84%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445189/91pu%E5%85%8D%E8%B2%BB%E7%A7%BB%E8%AA%BF%28%E7%B0%A1%E7%B4%84%E7%89%88%29.meta.js
// ==/UserScript==

/*
91pu免費移調(簡約版)
適用裝置：電腦、手機通用版本
腳本作者：YC白白
更新日期：2022.11.24
版本：v1.4
v1.0：去廣告、實現移調功能
v1.1：去除直播中廣告
v1.2：顯示吉他和弦
v1.3：更改腳本名稱為「91pu免費移調(簡約版)」
v1.4：去除譜面浮水印(網頁版&手機版) 修正去廣告寫法
*/

// 完美破解vip
// 方法1:
// unsafeWindow.ẵ = function (t) {
//     if (t === 1 || t === 2 || t === 4 || t === 6 || t === 7 || t === 8 || t === 9 || t === 11 || t === 12 || t === 13 || t === 14) {
//         return 1
//     }
//     return 0
// }
// 方法2:
ẵ = function (t) {
    if (t === 1 || t === 2 || t === 4 || t === 6 || t === 7 || t === 8 || t === 9 || t === 11 || t === 12 || t === 13 || t === 14) {
        return 1
    }
    return 0
}

// step.1 先執行去除廣告
let url = window.location.href
console.log(url)
if (url.indexOf('https://www.91pu.com.tw/m/tone.shtml?id=') != -1) {
    console.log("手機版網頁的 song頁面！")
    // alert('手機版網頁的 song頁面！')

    // 關掉 等三秒的開頭廣告
    closeAdvertise()  // 手機裝置可能無法執行這行

    // 移除 一進去要等三秒的畫面
    let viptoneWindow_timer = setInterval(function() {
        let viptoneWindow = document.querySelector('#viptoneWindow')
        if (viptoneWindow) {
            viptoneWindow.remove()
            console.log('viptoneWindow已移除, viptoneWindow_timer停止');
            clearInterval(viptoneWindow_timer)
        }
    }, 1000)

    // 移除 所有adGeek開頭的廣告
    let adGeek_timer = setInterval(function() {
        let adGeek = document.querySelectorAll('div[id^="adGeek-slot-div-gpt-ad"]')
        if (adGeek.length) {
            console.log(`找到 ${adGeek.length} 個adGeek廣告`);
            for (let i = 0; i < adGeek.length; i++) {
                console.log(adGeek[i].getAttribute('id'));
                adGeek[i].remove()
            }
            console.log('adGeek已移除, adGeek_timer停止');
            clearInterval(adGeek_timer)
        }
    }, 1000)

    // 移除 升級vip的bar條
    let update_vip_bar_timer = setInterval(function() {
        let update_vip_bar = document.querySelector('div.update_vip_bar')
        if (update_vip_bar) {
            update_vip_bar.remove()
            console.log('update_vip_bar已移除, update_vip_bar_timer停止');
            clearInterval(update_vip_bar_timer)
        }
    }, 1000)

    // 移除 譜下方的影片廣告
    let bottomad_timer = setInterval(function() {
        let bottomad = document.querySelector('#bottomad')
        if (bottomad) {
            bottomad.remove()
            console.log('bottomad已移除, bottomad_timer停止');
            clearInterval(bottomad_timer)
        }
    }, 1000)

    // 移除 所有adsbygoogle的廣告
    let adsbygoogle_timer = setInterval(function() {
        let adsbygoogle = document.querySelectorAll('.adsbygoogle')
        if (adsbygoogle.length) {
            console.log(`找到 ${adsbygoogle.length} 個adsbygoogle廣告`);
            for (let i = 0; i < adsbygoogle.length; i++) {
                // console.log(adsbygoogle[i])
                adsbygoogle[i].remove()
            }
            console.log('adsbygoogle已移除, adsbygoogle_timer停止');
            clearInterval(adsbygoogle_timer)
        }
    }, 1000)

    // // 移除 預設顯示吉他和弦
    // let tone_chord_timer = setInterval(function() {
    //     let tone_chord = document.querySelector('#tone_chord')
    //     if (tone_chord) {
    //         tone_chord.remove()
    //         console.log('tone_chord已移除, tone_chord_timer停止');
    //         clearInterval(tone_chord_timer)
    //     }
    // }, 1000)

    // 移除 mobile song頁直播中提示
    let live_show_mobile_timer = setInterval(function() {
        let live_show_mobile = document.querySelector('#live-show-mobile')
        if (live_show_mobile) {
            live_show_mobile.remove()
            console.log('live_show_mobile已移除, live_show_mobile_timer停止');
            clearInterval(live_show_mobile_timer)
        }
    }, 1000)

    // 移除 樂譜的浮水印
    let wmask_timer = setInterval(function() {
        let wmask = document.querySelector('.wmask')
        if (wmask) {
            wmask.remove()
            console.log('wmask已移除, wmask_timer停止');
            clearInterval(wmask_timer)
        } else {
            console.log('沒找到wmask');
        }
    }, 1000)

    // ===手機窄螢幕才有的廣告===不知道是否width<600才有此廣告
    // 移除 手機螢幕最下方的廣告
    let vpon_timer = setInterval(function() {
        let vpon = document.querySelectorAll('vpon')
        if (vpon.length) {
            console.log(`找到 ${vpon.length} 個vpon廣告`);
            for (let i = 0; i < vpon.length; i++) {
                // console.log(vpon[i])
                vpon[i].remove()
            }
            console.log('vpon已移除, vpon_timer停止');
            clearInterval(vpon_timer)
        } else {
            console.log('沒找到vpon');
        }
    }, 1000)

    // GM_addStyle隱藏(手機裝置可能無法執行GM_addStyle語法 突發奇想把GM_addStyle放最後就可以了)
    GM_addStyle('#viptoneWindow{display:none !important}')  // 隱藏 等三秒的開頭廣告
    GM_addStyle('.update_vip_bar{display:none !important}')  // 隱藏 升級vip的bar條
    GM_addStyle('#bottomad{display:none !important}')  // 隱藏 譜下方的影片廣告
    GM_addStyle('.adsbygoogle{display:none !important}')
    GM_addStyle('.wmask{display:none !important}')  // 隱藏 譜面浮水印
    // GM_addStyle('#tone_chord{display:none !important}')  // 隱藏 預設顯示吉他和弦
    GM_addStyle('#live-show-mobile{display:none !important}')  // mobile song頁直播中提示
}
else if (url.indexOf('https://www.91pu.com.tw/m/') != -1) {
    console.log("手機版網頁的 首頁！")
    // alert('手機版網頁的 首頁！')

    // 移除 所有adGeek開頭的廣告
    let adGeek_timer = setInterval(function() {
        let adGeek = document.querySelectorAll('div[id^="adGeek-slot-div-gpt-ad"]')
        if (adGeek.length) {
            console.log(`找到 ${adGeek.length} 個adGeek廣告`);
            for (let i = 0; i < adGeek.length; i++) {
                console.log(adGeek[i].getAttribute('id'));
                adGeek[i].remove()
            }
            console.log('adGeek已移除, adGeek_timer停止');
            clearInterval(adGeek_timer)
        }
    }, 1000)

    // 移除 所有adsbygoogle的廣告
    let adsbygoogle_timer = setInterval(function() {
        let adsbygoogle = document.querySelectorAll('.adsbygoogle')
        if (adsbygoogle.length) {
            console.log(`找到 ${adsbygoogle.length} 個adsbygoogle廣告`);
            for (let i = 0; i < adsbygoogle.length; i++) {
                // console.log(adsbygoogle[i])
                adsbygoogle[i].remove()
            }
            console.log('adsbygoogle已移除, adsbygoogle_timer停止');
            clearInterval(adsbygoogle_timer)
        }
    }, 1000)

    // 移除 mobile首頁直播中提示
    let live_show_mobile_timer = setInterval(function() {
        let live_show_mobile = document.querySelectorAll('.live-show-mobile')
        if (live_show_mobile.length) {
            console.log(`找到 ${live_show_mobile.length} 個live_show_mobile廣告`);
            for (let i = 0; i < live_show_mobile.length; i++) {
                // console.log(live_show_mobile[i])
                live_show_mobile[i].remove()
            }
            console.log('live_show_mobile已移除, live_show_mobile_timer停止');
            clearInterval(live_show_mobile_timer)
        }
    }, 1000)

    // 更動版面 height: 100px才不會浮起來
    let footer_timer = setInterval(function() {
        let footer = document.querySelector("body > footer")
        if (footer) {
            footer.style.cssText = 'height: 100px;'
            console.log('footer更動版面完成, footer_timer停止');
            clearInterval(footer_timer)
        }
    }, 1000)

    // 更動版面 最上面才不會留白
    let body_style_padding_timer = setInterval(function() {
        let body_style_padding = document.querySelector("body")
        if (body_style_padding) {
            body_style_padding.style.padding = "0px 0px 0px"
            console.log('body_style_padding更動版面完成, body_style_padding_timer停止');
            clearInterval(body_style_padding_timer)
        } else {
            console.log('無body_style_padding');
        }
    }, 1000)

    // GM_addStyle隱藏(手機裝置可能無法執行GM_addStyle語法 突發奇想把GM_addStyle放最後就可以了)
    // GM_addStyle('.promote_app_mobile{display:none !important}')  // 原始碼是註解狀態
    GM_addStyle('.adsbygoogle{display:none !important}')
    GM_addStyle('.live-show-mobile{display:none !important}')  // 隱藏 mobile首頁直播中提示
}
else if (url.indexOf('https://www.91pu.com.tw/index.html') != -1) {
    console.log("電腦版網頁的 首頁！")
    // alert('電腦版網頁的 首頁！')

    // 移除 所有adGeek開頭的廣告
    let adGeek_timer = setInterval(function() {
        let adGeek = document.querySelectorAll('div[id^="adGeek-slot-div-gpt-ad"]')
        if (adGeek.length) {
            console.log(`找到 ${adGeek.length} 個adGeek廣告`);
            for (let i = 0; i < adGeek.length; i++) {
                console.log(adGeek[i].getAttribute('id'));
                adGeek[i].remove()
            }
            console.log('adGeek已移除, adGeek_timer停止');
            clearInterval(adGeek_timer)
        }
    }, 1000)

    // 移除 電腦版首頁&song頁直播中提示
    let liveVideoHeader_timer = setInterval(function() {
        let liveVideoHeader = document.querySelector('.liveVideoHeader')
        if (liveVideoHeader) {
            liveVideoHeader.remove()
            console.log('liveVideoHeader已移除, liveVideoHeader_timer停止');
            clearInterval(liveVideoHeader_timer)
        }
    }, 1000)

    // GM_addStyle隱藏(手機裝置可能無法執行GM_addStyle語法 突發奇想把GM_addStyle放最後就可以了)
    GM_addStyle('.liveVideoHeader{display:none !important}')  // 隱藏 電腦版首頁&song頁直播中提示
}
else if (url.indexOf('https://www.91pu.com.tw/song') != -1) {
    console.log("電腦版網頁的 song頁面！")
    // alert('電腦版網頁的 song頁面！')

    // 關掉等三秒的開頭廣告
    closeAdvertise()

    // 移除 一進去要等三秒的畫面
    let viptoneWindow_timer = setInterval(function() {
        let viptoneWindow = document.querySelector('#viptoneWindow')
        if (viptoneWindow) {
            viptoneWindow.remove()
            console.log('viptoneWindow已移除, viptoneWindow_timer停止');
            clearInterval(viptoneWindow_timer)
        }
    }, 1000)

    // 移除 所有adGeek開頭的廣告
    let adGeek_timer = setInterval(function() {
        let adGeek = document.querySelectorAll('div[id^="adGeek-slot-div-gpt-ad"]')
        if (adGeek.length) {
            console.log(`找到 ${adGeek.length} 個adGeek廣告`);
            for (let i = 0; i < adGeek.length; i++) {
                console.log(adGeek[i].getAttribute('id'));
                adGeek[i].remove()
            }
            console.log('adGeek已移除, adGeek_timer停止');
            clearInterval(adGeek_timer)
        }
    }, 1000)

    // 移除 key上面的長方形廣告 & 下面也有一塊
    let a_post_show_timer = setInterval(function() {
        let a_post_show = document.querySelectorAll('div.a-post-show')
        if (a_post_show.length) {
            console.log(`找到 ${a_post_show.length} 個a_post_show廣告`);
            for (let i = 0; i < a_post_show.length; i++) {
                // console.log(a_post_show[i])
                a_post_show[i].remove()
            }
            console.log('a_post_show已移除, a_post_show_timer停止');
            clearInterval(a_post_show_timer)
        }
    }, 1000)

    // 移除 升級vip的bar條
    let update_vip_bar_timer = setInterval(function() {
        let update_vip_bar = document.querySelector('div.update_vip_bar')
        if (update_vip_bar) {
            update_vip_bar.remove()
            console.log('update_vip_bar已移除, update_vip_bar_timer停止');
            clearInterval(update_vip_bar_timer)
        }
    }, 1000)

    // // 移除 預設顯示吉他和弦
    // let tone_chord_timer = setInterval(function() {
    //     let tone_chord = document.querySelector('#tone_chord')
    //     if (tone_chord) {
    //         tone_chord.remove()
    //         console.log('tone_chord已移除, tone_chord_timer停止');
    //         clearInterval(tone_chord_timer)
    //     }
    // }, 1000)

    // 移除 電腦版首頁&song頁直播中提示
    let liveVideoHeader_timer = setInterval(function() {
        let liveVideoHeader = document.querySelector('.liveVideoHeader')
        if (liveVideoHeader) {
            liveVideoHeader.remove()
            console.log('liveVideoHeader已移除, liveVideoHeader_timer停止');
            clearInterval(liveVideoHeader_timer)
        }
    }, 1000)

    // 移除 樂譜的浮水印
    let wmask_timer = setInterval(function() {
        let wmask = document.querySelector('.wmask')
        if (wmask) {
            wmask.remove()
            console.log('wmask已移除, wmask_timer停止');
            clearInterval(wmask_timer)
        } else {
            console.log('沒找到wmask');
        }
    }, 1000)

    // GM_addStyle隱藏(手機裝置可能無法執行GM_addStyle語法 突發奇想把GM_addStyle放最後就可以了)
    GM_addStyle('#viptoneWindow{display:none !important}')  // 隱藏 一進去要等三秒的畫面
    GM_addStyle('.a-post-show{display:none !important}')  // 隱藏 key上面的長方形廣告 & 下面也有一塊
    GM_addStyle('.update_vip_bar{display:none !important}')  // 隱藏 升級vip的bar條
    // GM_addStyle('#tone_chord{display:none !important}')  // 隱藏 預設顯示吉他和弦
    GM_addStyle('.fix_menus{display:none !important}')  // 隱藏 懸浮的首頁列
    GM_addStyle('.wmask{display:none !important}')  // 隱藏 譜面浮水印
    GM_addStyle('.liveVideoHeader{display:none !important}')  // 隱藏 電腦版首頁&song頁直播中提示
}