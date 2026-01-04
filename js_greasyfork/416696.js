// ==UserScript==
// @name         我爱学习，学习使我快乐
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://px.class.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416696/%E6%88%91%E7%88%B1%E5%AD%A6%E4%B9%A0%EF%BC%8C%E5%AD%A6%E4%B9%A0%E4%BD%BF%E6%88%91%E5%BF%AB%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/416696/%E6%88%91%E7%88%B1%E5%AD%A6%E4%B9%A0%EF%BC%8C%E5%AD%A6%E4%B9%A0%E4%BD%BF%E6%88%91%E5%BF%AB%E4%B9%90.meta.js
// ==/UserScript==

(function () {

    // 视频页面
    if (location.href.includes('player/study/index')) {
        setInterval(() => {

            //学完了，返回班级
            if (document.querySelector('.btn-dark')) {
                document.querySelector('.btn-back a').click()
            }

            // 看看学没学完
            document.querySelector('#btn_submit').click()


            setTimeout(() => {
                document.querySelector('#d_sub_confirm_my').click()
            }, Math.random() * 5000)

        }, Math.random() * 6000 + 10000)
    }

    // 列表页面
    if (location.href.includes('/study/myclass/index')) {
            setInterval(() => {
                document.querySelectorAll('.toStudy')[document.querySelectorAll('.toStudy').length - 1].click()
            }, Math.random() * 5000 + 1000)
    }


})();
