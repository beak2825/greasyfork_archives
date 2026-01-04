// ==UserScript==
// @name        bilibili 自动网页全屏
// @author      en20
// @namespace   en20
// @description bilibili 视频/直播页面自动网页全屏. 直播页必须先把鼠标悬浮到播放器,把工具栏呼出才能全屏
// @version     1.4.0
// @match              *.bilibili.com/*
// @run-at             document-body
// @require            http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/433451/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/433451/bilibili%20%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function () {
    let url = GM_getValue('url')
    GM_deleteValue('url')
    if (location.hostname == 'bangumi.bilibili.com') {
        if (url === location.href) {
            return
        }
        GM_setValue('url', location.href)
        document.addEventListener('DOMContentLoaded', function () {
            window.stop()
            location.href = document.querySelector('.v-av-link').href
        })
    } else {
        try {
            localStorage.setItem('bilibililover', 'YESYESYES')
            localStorage.setItem('defaulth5', '1')
        } catch (e) {
        }
        window.addEventListener('load', function () {
            console.log("load wait success")
            this.$ = unsafeWindow.jQuery || jQuery

            waitElement(function () { //等待普通视频#btn_comment_submit元素的加载
                console.log("wait element, click element " + document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off").length)
                document.getElementsByClassName("bilibili-player-iconfont-web-fullscreen-off")[0].click()
                console.log("click succes")
            }, ".bilibili-player-iconfont-web-fullscreen-off")

             waitElement(function () { //等待直播的全屏元素的加载
                var element = document.querySelector(".bpx-player-ctrl-quality-menu-item");
                
                // 如果找到了元素，则进行点击操作
                if (element) {
                    element.click(); // 点击元素
                } else {
                    console.log("未找到指定元素"); // 如果未找到元素，则输出消息
                }
            }, ".bpx-player-ctrl-quality-menu")


        })
    }

    function waitElement(func, selector) {
        this.$ = jQuery || unsafeWindow.jQuery
        var _interval = 200, //20毫秒每次
            _self = document.querySelectorAll(selector), //选择器
            _iIntervalID //定时器id
        console.log('self: ', _self)
        if (_self.length != 0) { //如果已经获取到了，就直接执行函数
            func && func.call(this)
        } else {
            console.log("times", selector, _iIntervalID)

            _iIntervalID = setInterval(function () {

                _self = document.querySelectorAll(selector)
                if (_self.length != 0) { //判断是否取到
                    func && func.call(_self)
                    // 清不掉,很奇怪
                    clearInterval(_iIntervalID)

                }
            }, _interval)
        }
        return this
    }

})()

