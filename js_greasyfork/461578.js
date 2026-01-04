// ==UserScript==
// @name         雨课堂视频回放插件
// @namespace    http://bebr2.com/
// @version      0.1
// @description  提升雨课堂视频回放体验，例如按A或S快进快退，按空格暂停，快放速率自定义，下载视频。
// @author       BeBr2
// @match        https://pro.yuketang.cn/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461578/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E5%9B%9E%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/461578/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%A7%86%E9%A2%91%E5%9B%9E%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var video = null;
    function load_js() {
        var input = document.createElement("input");

        video.playbackRate = 1;
        var vrate = 1;
        document.onkeydown = function (e) {
            if (e.keyCode == 65) {

                if(video.currentTime >= 10){
                    video.currentTime -= 10;}
                else{
                    video.currentTime = 0;}

            } else if (e.keyCode == 68) {
                    video.currentTime += 10;
            } else if (e.keyCode == 32) {
                video.paused ? video.play() : video.pause();
            } else if (e.keyCode == 13) {
                if (input == document.activeElement) {
                    if(input.value > 0) {
                        video.playbackRate = input.value;
                        vrate = input.value;
                    }
                }
            }
        }

        function change_rate() {
            video.playbackRate = vrate;
        }
        setInterval(change_rate, 800);

        var video_src = video.src;


        var button = document.createElement("button");
        button.className = "downloadbutton";
        button.textContent = "下载视频";
        button.style.height = "80px";
        button.style.color = "white"
        button.style.background = "#1C223B"
        button.addEventListener("click", clickBotton);
        function clickBotton(){
            if(video_src.substr(0,4) != "blob") {
            window.location.href=video_src;
            }else{alert("blob文件较难下载，请将blob视频转.m3u8，再使用其他插件下载！")};
        }
        button.onmouseover=function () {
            this.style.background = "gray";
        }
        button.onmouseout=function () {
            this.style.background = "#1C223B";
        }
        var side_bar = document.getElementsByClassName('left__menu')[0].getElementsByClassName('top')[0];
        side_bar.appendChild(button);

        var speed_bar = document.getElementsByClassName('setting__wrap small')[0];
        if(speed_bar) {
            speed_bar.remove();
        }



        input.placeholder = "请输入倍速";
        input.style.height = "30px";
        input.className = "speedinput";
        input.id = "speedinput";
        input.type = "number"
        input.oninput = function () {
            if(this.value.length>5) this.value=this.value.slice(0,5)
        };
        side_bar.appendChild(input);
    }

    function delete_ele() {
        video = null;
        var my_button = document.getElementsByClassName('left__menu')[0].getElementsByClassName('top')[0].getElementsByClassName('downloadbutton')[0];
        var my_input = document.getElementsByClassName('left__menu')[0].getElementsByClassName('top')[0].getElementsByClassName('speedinput')[0];
        if(my_button){my_button.remove()}
        if(my_input){my_input.remove()}
    }

        console.log("提升雨课堂视频回放的观看体验! --by BeBr2");
        var ii = 0;
        var url = window.location.href;
        console.log(url);
        function get_video() {
            if(ii != -1) {
                video = document.querySelector("video");
            }
            if(ii < 20 && ii >= 0) {
                ii += 1;
            }

            if(ii == 20) {
                console.log("页面找不到视频！");
                ii += 1;
                return;
            }
            if (video && ii != -1) {
               load_js();
                url = window.location.href;
                ii = -1;
            }
            if(url != window.location.href) {
                delete_ele();
                video = document.querySelector("video");
                if(video) {
                  load_js();
                  ii = -1;
                } else {
                   ii = 0;
                }
                url = window.location.href;
            }
        }

        setInterval(get_video, 2000);


})();