// ==UserScript==
// @name         知乎自动关闭登录提醒
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一打开知乎就提示登录，写个自动关闭的
// @author       bestcondition
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhihu.com
// @grant        none
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/436928/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/436928/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //倒计时总时长
    let time_out = 20 * 1000
    //倒计时
    let remain = time_out
    //轮询间隔
    let interval_time = 100
    //轮询
    let interval = setInterval(interval_func,interval_time)
    //关闭函数
    function close(){
        let close_bt = document.getElementsByClassName('Modal-closeButton')[0]
        if(close_bt){
            close_bt.click()
            console.log('窗口关闭')
            remain -= time_out
        }
    }
    function interval_func(){
        close()
        remain -= interval_time
        if(remain<=0){
            clearInterval(interval)
            console.log('轮询结束')
        }
    }
    // Your code here...
})();