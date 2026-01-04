// ==UserScript==
// @name         余漂亮的SYB脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @author       thankCode
// @include      https://jiangxi.zhipeizaixian.com/lessonStudy/*
// @description  针对江西省补贴性线上职业技能培训官网、syb，速度快，对村网不友好，努力更新中
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416197/%E4%BD%99%E6%BC%82%E4%BA%AE%E7%9A%84SYB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/416197/%E4%BD%99%E6%BC%82%E4%BA%AE%E7%9A%84SYB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

    const realTimeClData = setInterval(() => {
        let currentVideo = document.querySelector('#studymovie');
        if (currentVideo.readyState === 4) {
            maxTime = 100000
            oldTime = 100000
            faceSign = 100000
                // 视频总长度duration
            let aggregateLen = currentVideo.duration

            // 设置进度条 currentTime
            currentVideo.currentTime = aggregateLen - 1
            currentVideo.play()

            let on1 = document.querySelector('.on').parentElement.nextElementSibling;
            //let a = on1.querySelector('a')

            if (!on1) {
                clearInterval(realTimeClData)
                alert('傻逼,刷完了')
            }

            setTimeout(() => {
                on1.querySelector('.course_study_menubox').click();
                console.log('%c执行中....', 'color:red')
            }, 2000)

            // // 解锁
            // a.setAttribute('data-lock', '0')
            // a.setAttribute('data-isface', '0')
            // a.setAttribute('data-facetime', '[]')
        }
    }, 3000);