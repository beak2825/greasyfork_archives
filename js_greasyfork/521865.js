// ==UserScript==
// @name         师训宝(秒刷版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手动进入视频播放页面，然后点点点就完事了。
// @author       moxiaoying
// @match        https://stu.shixunbao.cn/#/Online/viewcourse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1198733
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521865/%E5%B8%88%E8%AE%AD%E5%AE%9D%28%E7%A7%92%E5%88%B7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521865/%E5%B8%88%E8%AE%AD%E5%AE%9D%28%E7%A7%92%E5%88%B7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createMessage() {
        const span = document.createElement('span')
        let style = `position: fixed; right: 10px; top: 80px; width: 500px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`
        span.setAttribute('style', style)
        span.innerText = '脚本启动成功'
        document.body.appendChild(span)
        return span
    }
    const span = createMessage()

    ajaxHooker.hook(request => {
        if (request.url.includes('onlinecourse/course/resource/learntime/report') && request.method == 'POST') {
            const a = new URLSearchParams(request.data)
            a.set('finished', true)
            a.set('time', 60 * 60)
            request.data = a.toString()
            span.innerText = '成功秒掉60分钟，可以换下一章节试试了！！！'
        }
    });
})();