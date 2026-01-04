// ==UserScript==
// @name         刷刷刷
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license MIT
// @description  这是私人定制
// @author       You
// @match        https://sddy.zyk.yxlearning.com/learning/index?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/479005/%E5%88%B7%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/479005/%E5%88%B7%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==


(function () {
    'use strict';



    const addBox = () => {
        var parent = document.createElement("div");
        parent.innerHTML = `    <div

        style="position: fixed;left: 10%;
        z-index: 99999;
        top: 10%;">
                <button class="start">开始</button>

            </div>`
            // <button class="stop">暂停</button>
            //     <button class="end">结束</button>
        document.body.append(parent)
        document.querySelector(".start").setAttribute("style",`background-color: red;
        color: #fff;
        font-size: 22px;`)
        document.querySelector(".start").addEventListener("click", () => {
            play()
        })
    }

    const play = () => {
        document.querySelector(".course-list").click()
        var pvCover = document.querySelector(".pv-video")
        pvCover.play()
        setInterval(()=>{
        document.querySelector(".pv-ask-modal-wrap").remove()
            pvCover.play()
        },1000);
        addMonitor()
    }


    const loading = () => {
        addBox()
    }

    const addMonitor = () => {

        document.querySelector(".pv-video").addEventListener(
            'ended',
            () => {
                //结束
                console.log('播放结束');
                setTimeout(()=>{
                    play()

                },2000)
            },
            false
        );
    }



    // Your code here...

    // 等待网页完成加载
    window.addEventListener('load', function () {
        // 加载完成后执行的代码
        loading()

    }, false);



})();



