// ==UserScript==
// @name         aihui线上培训
// @namespace    http://tampermonkey.net/
// @version      1.13.0
// @description  用于进行培训课程的播放及进度条控制
// @author       You
// @match        https://www.zpton.com/*
// @match        https://www.zpton.com/*
// @match        https://www.zpton.com/Layoutstudy/studyVideo
// @icon         https://google.com/s2/favicons?sz=64&domain=website.zpton.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442345/aihui%E7%BA%BF%E4%B8%8A%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/442345/aihui%E7%BA%BF%E4%B8%8A%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(() => {
        console.log('引入完成');
        let Timeout = false //整个视频是否看完
        let play = false //当前是否正在播放
        let playDuration = 0
        const dayMapCurrent = [0,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,0,1,2,3] //根据日期决定看哪个视频
        const userInfo = JSON.parse(localStorage.zhipeitong).userInfo
        if(userInfo&&userInfo.phone){
            localStorage.setItem('phone',userInfo.phone)
        }
        setInterval(() => {
            if(window.location.href.includes('https://website.zpton/')){
                window.location.href = "https://www.zpton.com/";
                const popupClose = $('.pooup .btn_1')[0]
                    console.log('popupClose:'+popupClose)
                    if(popupClose)popupClose.click()
            }else if(window.location.href.includes('website.zpton.com/login')){
                console.log('login')
                const phone = $('.phone input')[0]
                const password = $('.password input')[0]
                if(password&&phone){
                    const login = $('.rigth .btn')[0]
                    $('.mask')[0].click()
                    document.getElementsByTagName('input')[0].focus()
                    console.log(document.getElementsByTagName('input')[0])
                    console.log(document.getElementsByTagName('input')[0].value)
                    console.log($('.password img')[1])
                    $('.password img')[1].click()
                    login.click()

                    // if(document.getElementsByTagName('input')[0].value){
                    //     login.click()
                    // }else{
                    //     const StoragePhone = localStorage.getItem('phone')
                    //     if(phone&&StoragePhone){
                    //         phone.value = +StoragePhone
                    //         password.value = 'zpt123456'
                    //         login.click()
                    //     }
                    // }
                    const popupClose = $('.pooup .btn_1')[0]
                    console.log(popupClose)
                    if(popupClose)popupClose.click()

                }
            }else if (window.location.href != "https://www.zpton.com/Layoutstudy/studyVideo" && window.location.href != "https://www.zpton.com/Layoutstudy/writing" && window.location.href != "https://www.zpton.com/Layout/mynterpretation" && !window.location.href.includes('Layoutstudy')) {
                window.location.href = "https://www.zpton.com/Layout/mynterpretation";
            }else if (window.location.href.includes('mynterpretation')) {
                const popupClose = $('.pooup .btn_1')[0]
                    console.log(popupClose)
                    if(popupClose)popupClose.click()

                const buttonELE = $('.content .item .item_3')
                if(buttonELE.text() == '签到学习'){
                    buttonELE[0].click()
                }
            }else if (window.location.href.includes('Layoutstudy')
            && window.location.href != "https://www.zpton.com/Layoutstudy/studyVideo"
            && window.location.href != "https://www.zpton.com/Layoutstudy/writing"
            && window.location.href != "https://www.zpton.com/Layoutstudy/answer"
            && window.location.href != "https://www.zpton.com/Layoutstudy/quiz" ) {
                    const videoBtn =  $('.top .item')[2]
                    console.log(videoBtn)
                    videoBtn.click()
            } else if (window.location.href == "https://www.zpton.com/Layoutstudy/studyVideo") {
                if (Timeout) return
                let nowDay = 0
                const getDateNumber = new Date().getDate()
                console.log(getDateNumber)
                if(getDateNumber>=0&&getDateNumber<=27){
                    nowDay = dayMapCurrent[getDateNumber]
                }else if(getDateNumber>=27){
                    nowDay = dayMapCurrent[getDateNumber]
                }
                // console.log(nowDay)
                const popupClose = $('.pooup .btn_1')[0]
                console.log(popupClose)
                if(popupClose)popupClose.click()
                let loadmore = $('.loadmore')[0]
                if(loadmore && $('.loadmore').css('display')!=='none'){
                    console.log(loadmore)
                    loadmore.click()
                }
                let videoList = $('.list .item')
                console.log(videoList.length )
                if (videoList.length > 32) {
                    if (!play) {
                        // for (event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
                        //     console.log(event_name);
                        //     window.addEventListener(event_name, function(event) {
                        //         event.stopImmediatePropagation();
                        //     }, true);
                        // }
                        window.addEventListener("visibilitychange", function(event) {
                            event.stopImmediatePropagation();
                        }, true);
                        window.addEventListener("webkitvisibilitychange", function(event) {
                            event.stopImmediatePropagation();
                        }, true);
                        window.addEventListener("blur", function(event) {
                            event.stopImmediatePropagation();
                        }, true);
                        videoList.each(function (index, element) {
                            if (play) return
                            if(index == nowDay){
                                $(element).click()
                                // console.log($('.vjs-tech')[0])
                                // $('.vjs-tech').attr("muted",false);
                                setTimeout(() => {
                                    document.getElementsByClassName('vjs-tech')[0].muted = 'true'
                                    $('.vjs-big-play-button')[0].click()
                                }, 1000)
                                return play = true
                            }
                            // let options = $(element).find('span')
                            // console.log(options.length)
                            // if (options.length == 0) {

                            // }
                        });
                    }

                    if (play){
                        let current = $(".vjs-current-time-display")
                        let duration = $(".vjs-duration-display")
                        if (current.length > 0) {
                            let nowArr = current.text().split(":")
                            let endArr = duration.text().split(":")
                            let now, end
                            if (nowArr.length == 3) {
                                now = Number(nowArr[0]) * 3600 + Number(nowArr[1]) * 60
                                // console.log('时now', now);
                            } else if (nowArr.length == 2) {
                                now = Number(nowArr[0]) * 60 + Number(nowArr[1])
                                // console.log('分now', now);
                            }
                            console.log('原始now:'+now)
                            if (endArr.length == 3) {
                                end = Number(endArr[0]) * 3600 + Number(endArr[1]) * 60
                                // console.log('时end', end);
                            } else if (endArr.length == 2){
                                end = Number(endArr[0]) * 60 + Number(endArr[1])
                                // console.log('分end', end);
                            }
                            playDuration = playDuration + 3
                            now = now>playDuration?now:playDuration
                            console.log((now / end * 10).toFixed(2)+'--'+now+'--'+end)
                            if (now&&end&&(now / end * 10).toFixed(2) >= 9.9) {
                                Timeout = true
                                play = false
                                playDuration = 0
                                document.getElementsByClassName('vjs-tech')[0].pause()
                                window.location.href = "https://www.zpton.com/Layoutstudy/writing";
                            }
                        }
                    }

                }
            }
        }, 3000)
        setInterval(()=>{
            if(play){
                window.scrollTo(0,300)
                setTimeout(()=>{
                    // document.getElementsByClassName('vjs-tech')[0].pause()
                    // document.getElementsByClassName('vjs-tech')[0].play()
                    // console.log($('.advertising .rigth .item')[2])
                    $('.advertising .rigth .item')[2].click()
                },1000)
            }
        },20*60*1000)
    })
    // Your code here...
})();