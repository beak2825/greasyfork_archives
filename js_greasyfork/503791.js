// ==UserScript==
// @name         妖火网回顶部
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  解放双手！点击直接返回页面顶部，再也不用一点一点往上滑啦！
// @license MIT
// @author       妖火id24670
// @match        *://yaohuo.me/bbs*
// @match        *://www.yaohuo.me/bbs*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yaohuo.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503791/%E5%A6%96%E7%81%AB%E7%BD%91%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/503791/%E5%A6%96%E7%81%AB%E7%BD%91%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    var svg = '<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0083 14.1006V42.0001" stroke="#eee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 26L24 14L36 26" stroke="#eee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6H36" stroke="#eee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    var dom = document.createElement('div')
    dom.innerHTML = svg
    dom.style.position = 'fixed'
    dom.style.right = '20px'
    dom.style.bottom = '20px'
    dom.style.width = '40px'
    dom.style.height = '40px'
    dom.style.backgroundColor = '#4595d5'
    dom.style.borderRadius = '4px'
    dom.style.fontSize = '15px'
    dom.style.textAlign = 'center'
    dom.style.lineHeight = '40px'
    dom.style.cursor = 'pointer'
    dom.style.display = 'flex'
    dom.style.alignItems = 'center'
    dom.style.justifyContent = 'center'
    dom.style.visibility = 'hidden'
    document.body.appendChild(dom)

    /**
     * @param el 返回顶部元素按钮
     * @param speed 过度速度
     * @param top 自定义顶部位置
     * @param distance 距离顶部距离显示按钮
    */
    function scrollToTop({ el, speed = 5, top = 0, distance = 300 }) {
        window.onscroll = function () {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > distance) {
                el.style.visibility = "visible";
            } else {
                el.style.visibility = "hidden";
            }
        };

        el.addEventListener('click', function () {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > top) {
                transition()
            }
        });

        function transition() {
            let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > top) {
                window.requestAnimationFrame(transition);
                window.scrollTo(0, currentScroll - (currentScroll / speed));
            }
        }
    }
    scrollToTop({ el: dom });
})();