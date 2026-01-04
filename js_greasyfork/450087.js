// ==UserScript==
// @name         国家中小学智慧教育平台
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @license      CC BY-NC-SA
// @description  国家中小学平台自动16倍数,下一集，全程静音
// @author       moxiaoying
// @match        http*://www.zxx.edu.cn/teacherTraining/*
// @match        http*://basic.smartedu.cn/teacherTraining/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxx.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450087/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/450087/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function loadPage(){
        var video = document.querySelector("video");
        var resItems = document.querySelector(".resource-item");
        if (!!video && !!resItems) {
            return main()
        }
        else {
            console.log("等待视频加载")
            setTimeout(loadPage,5*100)
        }
    }
    function main(){
        console.log(`刷课脚本开始运行`)
        var vid = document.getElementsByTagName("video")[0];
        vid.muted = true;
        vid.play();
        console.log('开始播放')
        switchSource()
        setVideoHandler()
        setTimeout(()=>vid.playbackRate = 16,2*1000)
        vid.pause = function(){vid.play()}
        // vid.addEventListener("pause", () =>{}, false)
        vid.addEventListener('ended', function() {
            console.log('播放完毕l')
        }, false)
    }
    // 处理视频答题
    function setVideoHandler() {
        setInterval(() => {
            try {
                var popup = false;
                [".nqti-option", ".index-module_markerExercise_KM5bU .fish-btn", ".fish-modal-confirm-btns .fish-btn"].forEach(selector => {
                    let dom = document.querySelector(selector)
                    if (!!dom) {
                        popup = true
                        dom.click()
                    }
                })
                //增加填空题支持
                var inputForm = document.querySelector(".index-module_box_blt8G");
                if (!!inputForm) {
                    popup = true
                    changInputValue(inputForm.getElementsByTagName("input")[1], "&nbsp;");
                }
                if (!popup) {
                    console.log(`已经完成!`)
                }
                else {
                    console.log( "处理弹窗")
                }
            }
            catch (err) {
                console.log(`${err}`)
            }
        }, 1000)
    }

    //视频修改为标清
    function switchSource() {
        let sped = document.querySelector(
            "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > span"
        );
        if (sped && sped.innerText != "标清") {
            document.querySelector( "div.vjs-menu-button.vjs-menu-button-popup.vjs-control.vjs-button.vjs-resolution-button > div > ul > li:nth-child(2) > span.vjs-menu-item-text").click();
        }
    }
    loadPage()
})();