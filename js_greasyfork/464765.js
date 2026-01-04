// ==UserScript==
// @name         兵团住建教育自动刷课
// @namespace    JR
// @version      1.0.0
// @description  破解鼠标限制、破解自动弹出、自动跳转视频
// @author       JR
// @match        https://www.btzjfw.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/464765/%E5%85%B5%E5%9B%A2%E4%BD%8F%E5%BB%BA%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464765/%E5%85%B5%E5%9B%A2%E4%BD%8F%E5%BB%BA%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {

    $(document).ready(function(){

        //破解鼠标限制
        function MouseOut(){
            if(window.onblur!=null){
                window.onblur=null
                clearInterval(mouse)
            }
        }
        var mouse = window.setInterval(MouseOut,1000);

        //破解自动弹出
        function CloseBox(){
            var submit = document.getElementsByClassName("ant-btn ant-btn-primary")[0];
            if(submit!=undefined){
                submit.click();
            }
        }
        var close = window.setInterval(CloseBox,1000);

        //监听视频是否结束
        function VideoListener(){
            let video = document.getElementsByClassName("player")[0].children[0].children[0];
            video.addEventListener('ended', NextVideo);
        }
        window.setInterval(VideoListener,1000);

        //自动跳转视频
        function NextVideo(){
            var list = document.getElementsByClassName("ant-spin-container")[0];
            for (let i = 0; i < list.children.length; i++) {
                let temp = list.children[i].children[0];
                if( temp.className === 'item'){
                    list.children[i].children[0].click();
                    return;
                }
            }
        }

    })

})();