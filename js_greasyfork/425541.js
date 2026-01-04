// ==UserScript==
// @name         安静看手机B站bilibili
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  我可以用APP但你不能强制我用APP打开
// @author       soundEgg
// @match        *://m.bilibili.com/video/*
// @match        *://m.bilibili.com/space/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/425541/%E5%AE%89%E9%9D%99%E7%9C%8B%E6%89%8B%E6%9C%BAB%E7%AB%99bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/425541/%E5%AE%89%E9%9D%99%E7%9C%8B%E6%89%8B%E6%9C%BAB%E7%AB%99bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function(){
        setTimeout(function() {
            var root = window.location.href;
            if(root.indexOf('/video/')>-1){
                //第二种粗暴方式~
                //清除APP
                console.log('清除APP打开')
                var arr=document.querySelectorAll('.open-app');arr.forEach(function (item) {
                    if(item){
                        item.remove();
                    }
                });
                setTimeout(function() {
                    console.log('替换网页点击链接')
                    var arr3=document.querySelectorAll('.open-app-btn.v-card-toapp');
                    arr3.forEach(function (item) {
                        if(item){
                            var aid=item.dataset.aid;
                            item.addEventListener('click', function(){
                                window.location.href="https://m.bilibili.com/video/av"+aid;
                            })
                        }
                    });
                },300);
                //移除APP打开高清又流畅标题
                document.getElementsByClassName("open-app-btn m-video-main-openapp visible-open-app-btn")[0].remove()
            }
            else if(root.indexOf('/space/')>-1){

                document.getElementsByClassName("open-app-btn m-space-float-openapp")[0].remove()

            }

        },200);
    })


})();


                /*
                //部分手机该段代码无效~~~其实本人的手机
                //清除APP打开
                var arr=document.querySelectorAll('.open-app');arr.forEach(function (item) {
                    if(item){
                        item.remove();
                    }
                });
                //***
                //清除class属性
                var arr2=document.querySelectorAll('.open-app-btn.v-card-toapp');
                arr2.forEach(function (item) {
                    if(item){
                        item.setAttribute("class", "v-card-toapp")
                    }
                });
                //清除原有点击，重新插入
                var t = document.querySelector('.video-list').innerHTML;
                var obj = document.getElementsByClassName("video-list")[0];
                document.getElementsByClassName("card-box")[0].remove()
                obj.insertAdjacentHTML("afterBegin",t);
                //增加点击事件*转换
                setTimeout(function() {
                    var arr3=document.querySelectorAll('.v-card-toapp');
                    arr3.forEach(function (item) {
                        if(item){
                            var aid=item.dataset.aid;
                            item.addEventListener('click', function(){
                                window.location.href="https://m.bilibili.com/video/av"+aid;
                            })
                        }
                    });
                },300);
                */