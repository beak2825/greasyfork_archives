// ==UserScript==
// @name         B站上单播放器 Mongolian Player
// @version      0.1.3
// @description  B站播放器优化。添加了一些 youtube 和 potplayer 的快捷键。修复了多P连播，增加了自动播放记忆位置等功能。
// @author       Erimus
// @include      http*.bilibili.com/video/*
// @include      http*.bilibili.com/bangumi/play/*
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/430162/B%E7%AB%99%E4%B8%8A%E5%8D%95%E6%92%AD%E6%94%BE%E5%99%A8%20Mongolian%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/430162/B%E7%AB%99%E4%B8%8A%E5%8D%95%E6%92%AD%E6%94%BE%E5%99%A8%20Mongolian%20Player.meta.js
// ==/UserScript==

/* 功能说明
====================
快捷键

a: 全屏（f 优先给 vim 用）
w: 网页全屏
t: 宽屏
i: 画中画
d: 弹幕开关
双击: 切换全屏

m: 静音

c: 播放加速 每次10%
v: 播放减速 每次10%（x 优先给 vim 用）
z: 播放恢复原速

0 ~ 9: 切换到相应的百分比进度（如按2等于跳到20%进度）

shift + right: 下一P

====================
其它功能

- 多 P 自动连播（不会自动播放推荐视频）
- 自动跳转到上次记录的播放位置
- 开播自动网页全屏
  * 这个是我个人使用习惯，有单独一个chrome窗口在副屏播放视频。
  * 如不需要的可以自行注释掉底部相关代码。

====================
B站本就支持的（也许有人不知道的）功能

f: 全屏
[: 上一P
]: 下一P
自动开播: 可以在播放器设置里开启（非自动切集）
*/

// 在播放器获得焦点时，B站默认有一个快解键F可以切换全屏。
(function() {
    'use strict';

    const SN = '[B站上单播放器]' // script name
    console.log(SN, '油猴脚本开始')

    // 监听页面跳转事件
    let _wr = (type) => {
        let orig = history[type + SN]
        return () => {
            let rv = orig.apply(this, arguments),
                e = new Event(type + SN)
            e.arguments = arguments
            window.dispatchEvent(e)
            return rv
        }
    }
    history.pushState = _wr('pushState')
    history.replaceState = _wr('replaceState')

    let videoObj // 播放器元素

    // 缩写
    let find = (selector) => { return document.querySelector(selector) }
    let find_n_click = (selector) => { find(selector).click() }

    // 按键快捷键
    let eleDict = {
        'fullscreen': '.bilibili-player-video-btn-fullscreen', //全屏
        'webFullscreen': '.bilibili-player-video-web-fullscreen', //网页全屏
        'theaterMode': '.bilibili-player-video-btn-widescreen', //宽屏
        'miniPlayer': '.bilibili-player-video-btn-pip', //画中画
        'mute': '.bilibili-player-iconfont-volume', //静音
        'danmaku': '.bilibili-player-video-danmaku-switch>input', //弹幕开关
        'playNext': '.bilibili-player-iconfont-next', //播放下一P
        'playerWrapper': '.bilibili-player-video-wrap', //播放器可双击区域
    }

    // 番剧模式下 播放器元素名称不同
    if (document.URL.indexOf('bangumi/play') != -1) {
        eleDict.fullscreen = '.squirtle-video-fullscreen' //全屏
        eleDict.webFullscreen = '.squirtle-pagefullscreen-inactive' //网页全屏
        eleDict.theaterMode = '.squirtle-video-widescreen' //宽屏
        eleDict.miniPlayer = '.squirtle-video-pip' //画中画
        eleDict.mute = '.squirtle-volume-mute' //静音
        eleDict.danmaku = '.bpx-player-dm-switch input' //弹幕开关
        eleDict.playNext = '.squirtle-video-next' //播放下一P
        eleDict.playerWrapper = '.bpx-player-video-wrap' //播放器可双击区域
    }

    const shortcutDict = {
        'a': eleDict.fullscreen, //全屏
        'w': eleDict.webFullscreen, //网页全屏
        't': eleDict.theaterMode, //宽屏
        'i': eleDict.miniPlayer, //画中画
        'm': eleDict.mute, //静音
        'd': eleDict.danmaku, //弹幕开关
    }

    let pressKeyborder = function(e) {
        if (e && e.key) {
            console.debug(SN, 'e:', e)
            if (e.key in shortcutDict) {
                find_n_click(shortcutDict[e.key])
            } else if (e.shiftKey && e.key == 'ArrowRight') { //shift+r 下一P
                find_n_click(eleDict.playNext)
            } else if (e.key === 'c') { //加速
                videoObj.playbackRate += 0.1
            } else if (e.key === 'v') { //减速
                videoObj.playbackRate -= 0.1
            } else if (e.key === 'z') { //重置速度
                videoObj.playbackRate = 1
            } else if ('1234567890'.indexOf(e.key) != -1) { //切进度条
                videoObj.currentTime = videoObj.duration / 10 * parseInt(e.key)
            }
        }
    }

    let init = function() {
        // 寻找视频播放器 添加功能
        let wait_for_video_player_init = setInterval(() => {
            console.debug(SN, 'Init:', document.URL)

            let click_area = find(eleDict.playerWrapper)
            videoObj = find('video:first-child')
            console.debug(SN, 'click_area:', click_area)
            console.debug(SN, 'videoObj:', videoObj)

            if (click_area && videoObj) {
                console.log(SN, '视频播放器加载完毕!')
                clearInterval(wait_for_video_player_init)

                // 双击切换全屏
                click_area.addEventListener('dblclick', function(e) {
                    e.stopPropagation()
                    console.log(SN, '双击切换全屏')
                    find_n_click(eleDict.fullscreen)
                })
            }
        }, 500)

        // 添加快捷键监听
        document.addEventListener('keydown', pressKeyborder);

        // 有些元素需要延迟载入 所以让它找一会儿
        let addAutoPlayNext = false //自动分P 是否含有多P
        let jumpToSavedTime = false //进度记录 是否存有进度

        let find_more = setInterval(() => {
            // 自动切P （自动播放关闭，当视频播放结束时自动按下一段按钮。）
            // B站自动切P现在会自动播放推荐视频，此处应有蒙古上单名言。
            if (!addAutoPlayNext) {
                let nextBtn = find(eleDict.playNext)
                if (nextBtn) {
                    setInterval(() => {
                        if (videoObj.duration - videoObj.currentTime <= 0) {
                            nextBtn.click()
                        }
                    }, 1000)
                    addAutoPlayNext = true
                }
            }

            // 自动跳到上次播放位置
            if (!jumpToSavedTime) {
                let continuedBtn = find('.bilibili-player-video-toast-item-jump')
                console.debug(SN, 'Continue Play Button:', continuedBtn)
                if (continuedBtn) {
                    jumpToSavedTime = true
                    // 不跳转到其它话(上次看到 xx章节) 只在当前视频中跳转进度
                    // 有时候没看片尾 会记录上一集的片尾位置之类的
                    let continuedText = find('.bilibili-player-video-toast-item-text').innerHTML
                    console.debug(SN, 'Continue Text:', continuedText)
                    if (continuedText.indexOf(' ') == -1) {
                        continuedBtn.click()
                    }
                }
            }
        }, 200)

        // 无论是否找到 10秒后都停止搜寻
        setTimeout(() => { clearInterval(find_more) }, 10000)

        // 持续尝试 直到成功
        let isFullScreen = false //自动网页全屏 当前是否全屏
        let try_until_success = setInterval(() => {

            // 自动网页全屏 开始
            if (!isFullScreen) {
                // check fullscreen status
                if (find(eleDict.playerWrapper).clientWidth ==
                    document.body.clientWidth) {
                    console.log(SN, 'fullscreen OK')
                    isFullScreen = true
                } else {
                    find_n_click(eleDict.webFullscreen)
                }
            }
            // 自动网页全屏 结束（不需要的删掉这段）

            if (isFullScreen) {
                clearInterval(try_until_success)
            }
        }, 500)

    }
    init()

})();
