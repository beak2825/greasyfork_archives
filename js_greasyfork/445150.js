// ==UserScript==
// @name         微博显示时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微博显示实际时间，而非几秒钟前、几分钟前...
// @author       You
// @match        *.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445150/%E5%BE%AE%E5%8D%9A%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/445150/%E5%BE%AE%E5%8D%9A%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showRealTime(){
        let elements = document.querySelectorAll('a[class^=head-info_time_]')
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.innerText = element.title;
        }
    }
    function expand() {
        let elements = document.querySelectorAll('div[class^=detail_wbtext_] .expand')
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.click();
        }
    }
    function showRankWeiboRealTime(){
        let elements = document.querySelectorAll('div[action-type=feed_list_item] .from a:nth-of-type(1)')
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.innerText = parseDate(element.innerText);
        }
    }

    function parseDate(str) {
        let date = new Date();
        if (str.includes('秒前')) {
            date.setSeconds(date.getSeconds() - +str.substring(0, str.indexOf('秒前')))
        } else if (str.includes('分钟前')) {
            date.setMinutes(date.getMinutes() - +str.substring(0, str.indexOf('分钟前')))
        } else if (str.includes('小时前')) {
            date.setHours(date.getHours() - +str.substring(0, str.indexOf('小时前')))
        } else if (str.includes('今天')) {
            let time = str.replace('今天', '').trim();
            date.setHours(+time.substr(0, 2) - 1)
            date.setMinutes(+time.substr(3, 2))
        } else if (str.includes('月') && str.includes('日')) {
            date.setMonth(+str.substr(0, 2) - 1);
            date.setDate(+str.substr(3, 2))
            date.setHours(+str.substr(7, 2))
            date.setMinutes(+str.substr(10, 2))
        }

        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0')
        let day = date.getDate().toString().padStart(2, '0')
        let hour = date.getHours().toString().padStart(2, '0')
        let minute = date.getMinutes().toString().padStart(2, '0')
        let second = date.getSeconds().toString().padStart(2, '0');
        let ret = `${year}-${month}-${day} ${hour}:${minute}`
        return ret
    }
    function expandRankWeibo() {

        let elements = document.querySelectorAll('div[action-type=feed_list_item] a[action-type=fl_unfold]')
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.click();
        }
    }
    function interval() {
        showRealTime();
        expand();
    }
    function timeout() {
        expandRankWeibo();
        showRankWeiboRealTime();
    }
    setInterval(interval, 1000);
    setTimeout(timeout, 300);
})();