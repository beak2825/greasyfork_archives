// ==UserScript==
// @name         中国大学mooc_倍速播放_跳过片头_画中画播放
// @namespace    http://tampermonkey.net/
// @version      1.43
// @description  加了视频倍速播放的控制,便于复习，可连续倍速播放、画中画播放
// @author       kakasearch
// @match        http*://www.icourse163.org/learn/*
// @match        http*://www.icourse163.org/spoc/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/411079/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc_%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE_%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4_%E7%94%BB%E4%B8%AD%E7%94%BB%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/411079/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6mooc_%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE_%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4_%E7%94%BB%E4%B8%AD%E7%94%BB%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let mode = '刷课'//'review'
    let speed = 2 //播放倍率
    let start_time = 0
    function auto_jump(){
        let video = document.getElementsByTagName('video')[0]
        video.onpause= function(){
            let jump = setInterval(function(){
                let con = document.querySelector(".u-btn.u-btn-default.cont.j-continue")
                if(con){con.click();clearInterval(jump)}
            },100)

            }
    }
    function FullScreen() {
        //全屏播放
        var ele = document.getElementsByTagName('video')[0]
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        } else if (ele.webkitRequestFullScreen) {
            ele.webkitRequestFullScreen();
        }
    }
    function show(i){
         document.querySelector("#speedText").value = ''
        document.querySelector("#speedText").placeholder= String(i.toFixed(1))
        GM_setValue('speed',i)
    }

    let main = ()=>{
        console.log('runmian')
        if (/content/.test(window.location.href)) {
            console.log('kaka_mooc_loaded');
            document.body.onkeydown = function(event) {//恢复按键屏蔽
                if (window.event) {
                    return event;
                }

            }
            //取消自动播放
            if(mode=='review'){
                let check = setInterval(function() {
                    let checkbox = document.querySelector("#courseLearn-inner-box > div > div > div.j-lscontent.lscontent > div.j-unitct.unitct > div.m-learnunitUI.f-pr.learn-plan-container > div.j-unitctBar.unitctBar.f-cb > div.f-fl > input")
                    if (checkbox) {
                        clearInterval(check)
                        checkbox.checked = false
                    }
                },
                                        100)
                }

            let pass = setInterval(function() {
                let video = document.getElementsByTagName('video')

                if (video.length > 0) {
                    clearInterval(pass)
                    auto_jump()
                    let has_value = GM_getValue('speed')
                    if(has_value && has_value !="undefined"){
                        speed = has_value
                    }
                    //if(GM_getValue('fullscreen')){//无效！！！！！！！！！！！！！！！！
                    //FullScreen()
                    // }
                    video[0].playbackRate = speed
                    video[0].currentTime = Number(GM_getValue('start_time')) ||0
                    video[0].play()
                    let start_time = GM_getValue('start_time') ||0
                    if(! document.querySelector("#startTime")){
                        let otest = document.querySelector("div.j-unitctBar.unitctBar.f-cb")
                        let nodestr = '</br><div><div><a id="PinP" class = "u-btn u-btn-default" align="left"><b>画中画播放</b></a></div>'+'<div><b>播放速度：</b><input type="text" id="speedText" style="border:black;outline: auto;padding-left: 3px;"></div><div>	<b>起始秒数：</b>	<input type="text" id="startTime" placeholder="'+start_time+'" style="border:black;outline: auto;padding-left: 3px;"></div>'
                        let newnode=document.createRange().createContextualFragment(nodestr);
                        otest.insertBefore(newnode,document.querySelector(".j-report-bug"))
                        document.querySelector("#PinP").onclick= function(){
                          //  video[0].requestPictureInPicture()
                            if (!document.pictureInPictureElement) {
                               video[0].requestPictureInPicture()
                                this.innerText = "恢复"
                            } else {
                                document.exitPictureInPicture()
                                this.innerText = "画中画播放"
                            }
                        }
                        document.querySelector("#speedText").onblur= function(){
                            video = document.getElementsByTagName('video')
                            video[0].playbackRate = parseFloat(document.querySelector("#speedText").value)
                            GM_setValue('speed',video[0].playbackRate)
                            GM_setValue('is_focus',0)
                            show(video[0].playbackRate)
                        }
                        document.querySelector("#speedText").onfocus= function(){
                            GM_setValue('is_focus',1)

                        }
                        document.querySelector("#startTime").onblur= function(){
                            GM_setValue('start_time',Number(document.querySelector("#startTime").value))
                            GM_setValue('is_focus',0)
                        }
                        document.querySelector("#startTime").onfocus= function(){
                            GM_setValue('is_focus',1)

                        }
                    }
                    show(document.getElementsByTagName('video')[0].playbackRate)
                    if(mode=='review'){
                        video[0].onended = function() { //自动播放下一p
                            if (document.querySelector(".f-fl.current").nextElementSibling == null) {
                                // 没了
                                let yid = /&id=(\d+)/.exec(window.location.href)[1]
                                let nid = parseInt(yid) + 1
                                window.location.href = window.location.href.replace(yid, String(nid))
                            } else {
                                //下1p
                                let ycid = /cid=(\d+)/.exec(window.location.href)[1]
                                let ncid = parseInt(ycid) + 1
                                window.location.href = window.location.href.replace(ycid, String(ncid))
                            }
                        }
                    }
                    document.body.onkeydown = function(ev) {

                        if( GM_getValue('is_focus')){
                            return ev
                        }else{
                            var e = ev || event;
                            let video =  document.getElementsByTagName('video')[0]
                            switch(e.keyCode){
                                case 67:
                                    video.playbackRate += 0.1
                                    break
                                case 88:
                                    video.playbackRate -= 0.1
                                    break
                                case 13:
                                    FullScreen()
                                    GM_setValue('fullscreen',1)
                                    //全屏状态下的连续播放
                                    if(mode=='review'){
                                        document.querySelector("#courseLearn-inner-box > div > div > div.j-lscontent.lscontent > div.j-unitct.unitct > div.m-learnunitUI.f-pr.learn-plan-container > div.j-unitctBar.unitctBar.f-cb > div.f-fl > input").checked = false
                                        if (document.getElementsByTagName('video')[0].ended) {
                                            let ycid = /cid=(\d+)/.exec(window.location.href)[1]
                                            let ncid = parseInt(ycid) + 1
                                            window.location.href = window.location.href.replace(ycid, String(ncid))
                                        }}
                                    break
                                case 39:
                                    video.currentTime += 5
                                    break
                                case 37:
                                    video.currentTime -= 5
                                    break
                                case 49:
                                    video.playbackRate = 1
                                    break
                                case 90:
                                    video.playbackRate = 1
                                    break
                                case 50:
                                    video.playbackRate = 2
                                    break
                                case 51:
                                    video.playbackRate = 3
                                    break
                                case 52:
                                    video.playbackRate = 4
                                    break
                                case 27:
                                    GM_setValue('fullscreen',0)
                                    break
                                default:
                                    return e
                            }
                            GM_setValue('speed',video.playbackRate)
                            show(video.playbackRate)

                        }


                    }
                }
            },
                                   100)


            }

        // Your code here...
    }//main
    let obser = setInterval(
        function(){
            let video= document.querySelector(".j-unitct.unitct")
            if(video){

                clearInterval(obser)
                main()
                let observer = new MutationObserver(main)
                observer.observe(video, { attributes: true,childList: true });//检测video变化,防止中途切p失效
            }

        },200
    )





    }



)();