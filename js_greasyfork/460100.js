// ==UserScript==
// @name         百度默认显示我的关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度默认显示我的关注,谁爱看广告呀
// @license MIT
// @author       隐者浮云
// @match        https://www.baidu.com/
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460100/%E7%99%BE%E5%BA%A6%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/460100/%E7%99%BE%E5%BA%A6%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    function mine(){
        let s_menu_mine = document.getElementById("s_menu_mine")
        if(s_menu_mine != null){
            s_menu_mine.click()
            if(s_menu_mine.className.search("current") != -1){
                clearInterval(i)
            }
        }else{
            clearInterval(i)
        }
    }
    let i = setInterval(mine,100)
    })();