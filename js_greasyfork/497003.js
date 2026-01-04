// ==UserScript==
// @name        键盘翻页onejav.com
// @namespace   Violentmonkey Scripts
// @match       https://onejav.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 2024/6/4 10:24:10
// @downloadURL https://update.greasyfork.org/scripts/497003/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5onejavcom.user.js
// @updateURL https://update.greasyfork.org/scripts/497003/%E9%94%AE%E7%9B%98%E7%BF%BB%E9%A1%B5onejavcom.meta.js
// ==/UserScript==
// 移除弹出式广告
const origOpen = window.open
window.open=src=>{
    console.log('弹出广告拦截',src)
}
(function(){
    let prevColl = document.getElementsByClassName('pagination-previous button is-primary')
    let $prev = prevColl.length>0?prevColl[0]:false
    let nextColl = document.getElementsByClassName('pagination-next button is-primary')
    let $next = nextColl.length>0?nextColl[0]:false

    document.addEventListener('keydown', function(event) {
        if($prev&&event.code === 'ArrowLeft') $prev.click()
    })


})()