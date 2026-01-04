// ==UserScript==
// @name         The AV PORN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  thirde 专用于解析视频
// @author       third_e
// @license      MIT
// @include      /^https:\/\/the.*\.(com|xyz)*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484828/The%20AV%20PORN.user.js
// @updateURL https://update.greasyfork.org/scripts/484828/The%20AV%20PORN.meta.js
// ==/UserScript==


(function() {


    function addScriptJs(src) {
        let script = document.createElement('script');
        script.src = src;
        script.type ="text/javascript";
        document.head.appendChild(script);
        console.log('执行饿')
    }

    function showVideoUrlAddress(videoUrl){
        // 显示视频链接
        let titleName = null;
        var address = document.getElementById("my_add_dizhi");
        if(document.getElementById("my_add_dizhi") != null){address.parentNode.removeChild(address);}
        address = document.createElement('div');
        address.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px"><p style="color:red;font-size:14px">视频地址：<a href="${videoUrl}" target="_blank">${videoUrl}</a></p>`;

        titleName = document.getElementsByClassName("inform_section")[0]?.getElementsByClassName("title")[0];
        if(titleName != null){titleName.after(address);}
    }


//视频播放页面解析===============================================================================================================
    // 一个页面只会加载一次
    var oldhref = document.location.href;
     // 解析视频定时器
    var changeTime = null;
    changeTime = setInterval(startChangeTime , 1200);
    var addEle = false
    async function startChangeTime(){
        if(location.href.indexOf('videos') > 0){
            console.log('执行中---')
            if ((document.body.innerHTML.indexOf('拒绝片段,成为VIP,即刻解锁全站影片') > 0
               || document.body.innerHTML.indexOf('您的观看次数已受限,请登录后继续') > 0)
               && !addEle){
                addScriptJs("/static/js/player.js?v7");
                addScriptJs("/player/m3key.php?VID=" + location.href.split('/')[4]);

                // 添加元素
                var newDiv = document.createElement("div");
                newDiv.innerHTML = `<div class="player-wrap" id="new" style="width: 100%; height: 0; padding-bottom: 88.905109489051%">
                                         <style>
                                         .layer {
                                             height: 0 !important;
                                             width: 100% !important;
                                             padding-bottom: 56.25% !important;
                                             position: static !important;
                                         }
                                         </style>
                                         <div class="layer" id="layer"></div>

                                    </div>`; // 设置div的内容
                document.getElementsByClassName('player-holder')[0].appendChild(newDiv);
                document.getElementsByClassName('no-player')[0].style.display = 'none';
                addEle = true;
            }
            if(typeof Playerjs == 'function') {
                var player = new Playerjs({
                    id:"layer",
                    file:m3is,
                    autoplay:true,
                    poster:"",
                });
                clearInterval(changeTime);

                showVideoUrlAddress(m3is)
                console.log('执行结束')
            }
        }
    }
})();