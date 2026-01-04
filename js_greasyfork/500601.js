// ==UserScript==
// @name         爱豆网
// @namespace    http://tampermonkey.net/
// @version      2024-07-14
// @description  爱豆网看视频
// @author       thirde

// @include      /^https:\/\/ww51.aidoo.pw/vod/play*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @require      https://update.greasyfork.org/scripts/484741/1311035/ajax-hook-thirde-V2.js
// @license      MIT
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/500601/%E7%88%B1%E8%B1%86%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/500601/%E7%88%B1%E8%B1%86%E7%BD%91.meta.js
// ==/UserScript==
(function() {
    function addScriptHTML(src) {
        let script = document.createElement('script');
        script.src = src;
        script.type ="text/html";
        script.id = "javascript_template";
        document.head.appendChild(script);
        console.log('执行了')
    }

    function addScriptJs(src) {
        let script = document.createElement('script');
        script.src = src;
        script.type ="text/javascript";
        document.head.appendChild(script);
        console.log('执行了')
    }

    function addScriptCss(){
        // 创建一个style元素
        var style = document.createElement('style');

        // 设置style内容
        style.innerHTML = `.iplayer {height: 0 !important;width: 100% !important;padding-bottom: 56.962025316456% !important;position: static !important; }`

        // 将style元素添加到head中
        document.head.appendChild(style);
    }


    //视频播放页面解析===============================================================================================================
    // 一个页面只会加载一次
    var oldhref = document.location.href;
    // 解析视频定时器
    var changeTime = null;
    changeTime = setInterval(startChangeTime , 1200);


    //addScriptCss();

    async function startChangeTime(){
        // 判断当前路径是否为播放路径
        console.log('执行中---')
        if(location.href.indexOf('vod/play') > 0){

            console.log('为播放页面，开始执行获取video')
            var iframe = document.querySelector("iframe")

            // 判断当前播放页面是否有播放vedio
            var have_video_pay = document.getElementById('video')
            if (iframe == null){
                // 获取需要播放的元素位置
                var videoBigBg = document.getElementById('videoBigBg')
                var videoId = document.location.href.split('/')[5].replace('.html','');
                videoBigBg.innerHTML = `
                <div id="formatVideo" style="width: 1200px; height: 550px;">
				    <style>.MacPlayer{background: #000000;font-size:14px;color:#F6F6F6;margin:0px;padding:0px;position:relative;overflow:hidden;width:100%;height:100%;min-height:300px;}</style>
				    <div class="MacPlayer">
					    <iframe border="0" src="/play/vod.html?id=${videoId}" width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" scrolling="no" vspale="0" noresize=""></iframe>
				    </div>
			    </div>
                `
            }else{
                // 存在表示可以播放，结束
                clearInterval(changeTime);
                console.log('执行结束')
            }
        }
    }
})();