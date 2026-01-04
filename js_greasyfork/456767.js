// ==UserScript==
// @name         bilibili filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站视频过滤器
// @author       You
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/456767/bilibili%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/456767/bilibili%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var box = `
        <div id="warp" class="warp" style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    ">
            <div class="content">
                <div id="gbt_title" class="gbt_title" style="
                            padding-top:20px;
                            margin-bottom:0px;
                            font-weight: 800;
                            text-align: center">
                    B站过滤插件
                </div>

                <div id="warp_form" style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    ">
                    <div style="margin: 20px 0;">
                        <span>时长：</span>
                        <input type="number" id="time1" style="
                                    width: 20px;
                                    margin: 0 5px;
                                    border: none;
                                    border-bottom: 1px solid black;
                                    outline: none;
                                    text-align: center;
                            ">
                        <span>~</span>
                        <input type="number" id="time2" style="
                                    width: 20px;
                                    margin: 0 5px;
                                    border: none;
                                    border-bottom: 1px solid black;
                                    outline: none;
                                    text-align: center;
                            "><span>分钟</span>

                        <button id="warp_btn" style="margin-left:10px;">过滤</button>
                    </div>


                </div>


            </div>
        </div>
       `

    // Your code here...
    window.onload = function () {
        console.log("欢迎使用bilibili过滤功能")

        document.querySelector(".contribution-sidenav").insertAdjacentHTML('beforeend', box)
        document.getElementById("warp_btn").onclick = function () {
            console.log("filter")
            let minTime = document.getElementById("time1").value * 60 || 0
            let maxTime = document.getElementById("time2").value * 60 || Number.POSITIVE_INFINITY

            let children = document.getElementsByClassName("cube-list")[0].children
            // console.log(children)

            for (let i = 0; i < children.length; i++) {
                const element = children[i];
                let videoTime = NaN

                let timestr = (element.getElementsByTagName("span")[0].innerText).split(":")

                if (timestr.length === 3) {
                    videoTime = Number(timestr[0] * 60 * 60) + Number(timestr[1] * 60) + Number(timestr[2])
                }
                else {
                    videoTime = Number(timestr[0] * 60) + Number(timestr[1])
                }


                if (videoTime < minTime || videoTime > maxTime) {
                    children[i].style['display'] = "none"
                }
                else {
                    children[i].style['display'] = ""
                }
            }

            console.log(children)

            return false;
        }
    }



})();