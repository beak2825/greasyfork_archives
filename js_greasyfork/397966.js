// ==UserScript==
// @name         hi mooc
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  dddd，在切换下一视频的时候请确保当前页签可见，不然会被拦截，需要重启脚本
// @author       ruanruofan
// @match        *.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397966/hi%20mooc.user.js
// @updateURL https://update.greasyfork.org/scripts/397966/hi%20mooc.meta.js
// ==/UserScript==

function hijackOpen(win, callback) {
    if (win.XMLHttpRequest.prototype.ea_realOpen) return
    let xhr
    win.XMLHttpRequest.prototype.ea_realOpen = win.XMLHttpRequest.prototype.open;
    var newOpen = function(method, url) {
        if (/multimedia\/log/.test(url)) {
            xhr = this
            xhr.addEventListener('load', (e)=>{
                const response = JSON.parse(e.target.response)
                callback(response.isPassed)
                // 还原
                win.XMLHttpRequest.prototype.open = win.XMLHttpRequest.prototype.ea_realOpen
                win.XMLHttpRequest.prototype.ea_realOpen = null
                setTimeout(()=>{hijackOpen(win, callback)}, 500)
            });
        }
        this.ea_realOpen(...arguments);
    };
    win.XMLHttpRequest.prototype.open = newOpen;
}

function fkListener () {
    window.addEventListener = null
    var old_element = document.body;
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    console.log(old_element)
}

function jumpQuiz(list, obj) {
    if (list[obj.i].innerText.includes('Quiz')) {
        obj.i++
        jumpQuiz(list, obj)
        return
    }
    list[obj.i].click()
}

(function() {
    let _ = Math.random() // 这就很有意思
    function main() {
        let obj = {}
        obj.i = 0
        const list = Array.from(document.querySelectorAll('.ncells .orange01')).map(item => item.parentNode.querySelector('a'))
        if (!list.length) return
        clearInterval(timer)
        jumpQuiz(list, obj)
        fkListener()
        setTimeout(() => {
            console.log('如果这时候视频没有开始播放，可能需要关掉脚本刷新页面，再重新启用脚本', _)
            const iframe = document.querySelector('iframe').contentWindow.document.querySelector('html iframe').contentWindow.document
            hijackOpen(document.querySelector('iframe').contentWindow.document.querySelector('html iframe').contentWindow, isPassed => {
                if (isPassed) {
                    window.location.reload()
                    //obj.i++
                    //setTimeout(() => {
                    //    jumpQuiz(list, obj)
                    //}, 2000)
                }
            })
            iframe.querySelector('.vjs-poster').click()
            iframe.querySelector('.vjs-menu-item').click()
            iframe.querySelector('.vjs-mute-control').click()
        }, 2000)
    }

    let timer = setInterval(main, 100)
})();