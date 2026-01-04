// ==UserScript==
// @name         Auto Scroll 自动滚屏
// @description  Auto Scroll Pages (double click / ctrl+arrow / alt+arrow)
// @include      *
// @version      0.17
// @author       Erimus
// @grant        none
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/393343/Auto%20Scroll%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393343/Auto%20Scroll%20%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%B1%8F.meta.js
// ==/UserScript==

(function(document) {

    // speed controlled by the following 2 variables
    let scroll_interval = 15, // every xx ms
        scroll_distance = 1 // move xx pixel

    let scrolling = false, // status
        auto_scroll, // scroll function
        last_click = Date.now()

    // main function
    let toggle_scroll = function(dire) {
        scrolling = !scrolling
        if (scrolling) {
            console.log('Start scroll', dire)
            dire = dire == 'up' ? -1 : 1
            auto_scroll = setInterval(function() {
                document.documentElement.scrollTop += (dire * scroll_distance)
            }, scroll_interval)
        } else {
            console.log('Stop scroll')
            clearInterval(auto_scroll)
        }
    }

    // double click near edge can trigger (Prevent accidental touch)
    // 双击靠近边缘的位置可以触发滚屏 (防止误触发)
    let dblclick_check = function(e) {
        if (Date.now() - last_click < 500) { return } //just stopped by click
        let range = 50 // effective range
        let w = window.innerWidth
        let h = window.innerHeight
        console.log('double click: x' + e.x + '/' + w + '| y' + e.y + '/' + h)
        // Except top edge, because of search bar is mostly at top.
        if (e.x < range || w - e.x < range || h - e.y < range) {
            toggle_scroll()
        }
    }

    // toogle scrolling by double click
    // if you want to trigger with double click , remove '//' before 'document'.
    // 你想用双击触发，删除下一行前的 '//'。
    document.body.addEventListener('dblclick', dblclick_check)

    // single click to stop scroll
    document.body.addEventListener('click', function() {
        if (scrolling) {
            scrolling = false
            console.log('Stop scroll')
            clearInterval(auto_scroll)
            last_click = Date.now()
        }
    })

    // toogle scrolling by hotkey
    // if you want set your own hotkey, find the key code on following site.
    // 如果你想要设置其它快捷键，查看以下网址以找到对应的按键码。
    // https://www.w3.org/2002/09/tests/keys.html
    document.onkeydown = function(e) {
        let keyCode = e.keyCode || e.which || e.charCode,
            fnKey = e.ctrlKey || e.metaKey || e.altKey
        if (fnKey && keyCode == 40) {
            console.log('Press Ctrl/Alt + Down arrow')
            toggle_scroll()
        } else if (fnKey && keyCode == 38) {
            console.log('Press Ctrl/Alt + Up arrow')
            toggle_scroll('up')
        }
    }

})(document)
