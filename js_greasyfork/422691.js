// ==UserScript==
// @name         百度云盘视频连续播放减少等待(已修复 2021.5)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通过预加载减少等待时间，自动连续播放，考研党的福音
// @author       kakasearch
// @match        https://pan.baidu.com/play/video
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.focus

// @downloadURL https://update.greasyfork.org/scripts/422691/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E8%A7%86%E9%A2%91%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E5%87%8F%E5%B0%91%E7%AD%89%E5%BE%85%28%E5%B7%B2%E4%BF%AE%E5%A4%8D%2020215%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422691/%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E8%A7%86%E9%A2%91%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE%E5%87%8F%E5%B0%91%E7%AD%89%E5%BE%85%28%E5%B7%B2%E4%BF%AE%E5%A4%8D%2020215%29.meta.js
// ==/UserScript==
//消除interval
(function() {
    'use strict';
    let window=unsafeWindow
    let getVideo = function(){
        //下次百度云更新，直接改這裏
        return window.videoPlayer.getPlayers().html5player
    }
    let main = ()=>{

        //abort open next url in background tab

        if(GM_getValue('next')== window.location.href){
            GM_setValue('next','')
            let play = setInterval(function(){
                try{
                    let werbung = document.querySelector("#video-root").shadowRoot.querySelector("#werbung-info-container > div.werbung-progress-bar-wrapper > div.werbung-progress-text")
                    if(getVideo()&&werbung&&Number(/\d+/.exec(werbung.innerText)[0])>=99){
                        //load done
                        clearInterval(play)
                        let canPlay = GM_getValue('pan_play')
                        if(! canPlay){
                            getVideo().on('play', getVideo().pause())
                            let pause =setInterval(()=>{
                                if(! getVideo().paused()){
                                    getVideo().el_.onload = ()=>{console.log('load')}
                                    console.log('pause')
                                    getVideo().pause()
                                    getVideo().on('play', getVideo().pause())
                                }
                            },1000)
                            setTimeout(()=>{clearInterval(pause)},10000)
                            window.addEventListener('keydown',clearInterval(pause))
                            window.addEventListener('click',clearInterval(pause))
                        }
                        //wait closed
                        let play_listener = setInterval(()=>{
                            canPlay = GM_getValue('pan_play')
                            if(canPlay){
                                if(GM_getValue('first') ==  window.location.href){
                                window.focus()}
                                if(getVideo().paused()){
                                    console.log('play')
                                    getVideo().play()
                                }else{
                                    GM_setValue('pan_play',false)
                                    clearInterval(play_listener)
                                    main()
                                }
                            }
                        },1000)

                        }
                }catch{
                    // click retry button
                    let retry = setInterval(function(){
                        if(document.querySelector("#video-wrap > div > span > a")){
                            document.querySelector("#video-wrap > div > span > a").click()
                        }
                    },1000)
                    setTimeout(()=>{clearInterval(retry)},10000)
                }

                // if('重试'in ''){}///////////////////////////////
            },1000)

            }else{
                // open nexturl in background
                let url =window.location.href.split('%2')
                let next_name = document.querySelector(".video-item.currentplay").nextElementSibling.children[0].children[1].innerText
                url =url.slice(0,url.length-1)
                url.push('F'+encodeURI(next_name) + '&t=-1')
                let next_url =url.join('%2')
                GM_setValue('pan_play',false)
                GM_setValue('next',next_url)
                GM_setValue('first',next_url)
                setTimeout(GM_openInTab(next_url,true),1000)

                //close tab when video end
                let tiao= 1
                let tmp = setInterval(function(){
                    if(getVideo()){

                        let player = getVideo()
                        let duration = player.el_.firstElementChild.duration
                        let currentTime=player.el_.firstElementChild.currentTime
                        if(currentTime >(duration-2) && tiao){
                            GM_setValue('pan_play',true)
                            if(getVideo()){
                                getVideo().pause()
                            }
                            clearInterval(tmp)
                            window.close()
                            tiao= 0
                        }
                    }else{tiao=1}
                },1000)
                }



    }

    setTimeout(function(){
        main()
    },3000)


    // Your code here...
})();