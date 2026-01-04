// ==UserScript==
// @name        好医生
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.0.3
// @description  好医生取消播放限制
// @author       Daniel
// @home-url	 https://greasyfork.org/zh-CN/scripts/448621-%E5%A5%BD%E5%8C%BB%E7%94%9F
// @match        *://www.cmechina.net/cme/polyv.jsp*
// @match        *://www.cmechina.net/*
// @match        *://cme.haoyisheng.com/*
// @match        *://www.cmechina.net/cme/study.jsp*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448621/%E5%A5%BD%E5%8C%BB%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448621/%E5%A5%BD%E5%8C%BB%E7%94%9F.meta.js
// ==/UserScript==

(function() {

    window.onload =()=>{
        $('video').prop('autoplay',true);//设置视频加载完成后自动播放
        $('video').on('play', function(e) {
            console.log('提示视频的元数据已加载')
            let duration = $('video').prop('duration');//获取视频时长
            if(window.cc_js_Player){
                window.cc_js_Player.jumpToTime(duration-5);//设置视频至结尾5秒处
            }else{
               $('video').prop('currentTime',duration-5); 
            }
            
        });    
    }
})();