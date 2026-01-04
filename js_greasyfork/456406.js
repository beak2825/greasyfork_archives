// ==UserScript==
// @name         新疆工程建设继续教育自动刷课
// @namespace 	 JR
// @version      1.0.2
// @description  破解鼠标限制、破解自动弹出、自动跳转视频
// @author       JR
// @match        https://ks.zhizhuyun.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456406/%E6%96%B0%E7%96%86%E5%B7%A5%E7%A8%8B%E5%BB%BA%E8%AE%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456406/%E6%96%B0%E7%96%86%E5%B7%A5%E7%A8%8B%E5%BB%BA%E8%AE%BE%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    
    $(document).ready(function(){

        //破解鼠标限制
        window.onblur=null;

        //破解自动弹出
        function closebox(){
            var submit = document.getElementsByClassName("ExiBoxConfirm")[0];
            if(submit != undefined){
                submit.click();
            }
        }
        var close = window.setInterval(closebox,1000);

        //自动跳转视频
        document.getElementsByClassName("xgplayer-start")[0].click();
        var video = document.getElementById("course_video").children[0];
        video.addEventListener('ended', NextVideo);
        function NextVideo(){
            var list = document.getElementsByClassName("list-box pt2 pb2 pl5 pr5")[0];
            for (let i = 0; i < list.children.length; i++) {
                let temp = list.children[i];
                if( temp.className === 'on '){
                    list.children[i+1].children[0].click();
                    return
                }
            }
        }

    })

})();