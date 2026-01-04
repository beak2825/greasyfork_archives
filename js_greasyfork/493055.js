// ==UserScript==
// @name         AVJB
// @namespace    http://tampermonkey.net/
// @version      2024-04-27
// @description  try to take over the world!
// @author       thirde

// @include      /^https:\/\/bbav.*\.com*/
// @include      /^https:\/\/bav.*\.(com|xyz)*/
// @include      /^https:\/\/avjb.*\.(com|xyz)*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @require      https://update.greasyfork.org/scripts/484741/1311035/ajax-hook-thirde-V2.js
// @license      MIT
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/493055/AVJB.user.js
// @updateURL https://update.greasyfork.org/scripts/493055/AVJB.meta.js
// ==/UserScript==

// accept: */*
// accept-language: zh-CN,zh;q=0.9
// cache-control: no-cache
// origin: https://bav132.xyz
// pragma: no-cache
// referer: https://bav132.xyz/
// sec-ch-ua: "Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"
// sec-ch-ua-mobile: ?0
// sec-ch-ua-platform: "Windows"
// sec-fetch-dest: empty
// sec-fetch-mode: cors
// sec-fetch-site: cross-site
// user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"


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

    function showVideoUrlAddress(videoUrl){
        // 显示视频链接
        let titleName = null;
        var address = document.getElementById("my_add_dizhi");
        if(document.getElementById("my_add_dizhi") != null){address.parentNode.removeChild(address);}
        address = document.createElement('div');
        address.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px"><p style="color:red;font-size:14px">视频地址：<a href="${videoUrl}" target="_blank">${videoUrl}</a></p><br>
        <a href="${document.location.origin + '/newembed/'+ location.href.split('/')[4]}" target="_blank">${document.location.origin + '/newembed/'+ location.href.split('/')[4]}</a>`;

        titleName = document.getElementsByClassName("inform_section")[0]?.getElementsByClassName("title")[0] || document.getElementsByClassName("info-content")[0];
        if(titleName != null){titleName.after(address);}
    }


    //视频播放页面解析===============================================================================================================
    // 一个页面只会加载一次
    var oldhref = document.location.href;
    // 解析视频定时器
    var changeTime = null;
    changeTime = setInterval(startChangeTime , 1200);
    var addEle = false

    var urlReq = false;
    var videoUrl = '';
    var videoImg ='';
    var canPlay = false;

    addScriptCss();

    async function startChangeTime(){
        if(location.href.indexOf('video') > 0){
            console.log('执行中---')

            if (!(typeof Playerjs == 'function')){
                console.log('加载 Playerjs---')
                addScriptJs("/player/playv6.js");
            }

            if (!(typeof HlsJsPlayer == 'function') && 1==2){
                console.log('加载js---')
                addScriptJs("https://unpkg.byted-static.com/xgplayer/2.31.6/browser/index.js");
                addScriptJs("https://unpkg.byted-static.com/xgplayer-hls.js/2.2.2/browser/index.js");
            }
            if ((document.body.innerHTML.indexOf('拒绝片段,成为VIP,即刻解锁全站影片') > 0
                 || document.body.innerHTML.indexOf('该视频为VIP视频，请登录后查看') > 0
                 || document.body.innerHTML.indexOf('，观看更多精彩视频') > 0
                 || document.body.innerHTML.indexOf('您的观看次数已受限,请登录后继续') > 0)
                && !addEle){

                //addScriptHTML("/newembed/" + location.href.split('/')[4]);

                var styleEle = document.getElementsByClassName('no-player')[0].style;
                videoImg =document.getElementsByClassName('no-player')[0].children[0].src

                document.getElementsByClassName('no-player')[0].id = 'mse';
                document.getElementsByClassName('no-player')[0].style.display = 'none';
                document.getElementsByClassName('no-player')[0].remove();


                document.getElementsByClassName('player-holder')[0].id = 'addPlayVideo';
                if(document.getElementById('new') != null){
                    document.getElementById('new').style.display='block';
                    //document.getElementById('player')?.remove();
                    document.getElementById('new').innerHTML = `<div class="iplayer" data-fullscreen-container="true" id="iplayer" style="padding: 0px; word-spacing: normal; position: relative; box-sizing: content-box !important; text-align: left; user-select: none; font-family: sans-serif; min-height: 15px; font-size: 14px; line-height: 1em; direction: ltr; color-scheme: none; height: 0 !important;width: 100% !important;padding-bottom: 56.962025316456% !important;position: static !important;"></div>`;
                }else{

                    var playerelement = document.getElementById('addPlayVideo');
                    var childElement = document.createElement("div");
                    childElement.id = 'new';
                    childElement.className += 'player-wrap';
                    childElement.style = 'display: block;width: 100%; position: relative;height: 0; overflow: hidden; padding-top: 56.962025316456%';

                    childElement.innerHTML = `<div class="iplayer" data-fullscreen-container="true" id="iplayer" style="padding: 0px; word-spacing: normal; position: relative; box-sizing: content-box !important; text-align: left; user-select: none; font-family: sans-serif; min-height: 15px; font-size: 14px; line-height: 1em; direction: ltr; color-scheme: none; height: 0 !important;width: 100% !important;padding-bottom: 56.962025316456% !important;position: static !important;"></div>`;
                    playerelement.appendChild(childElement);
                    //playerelement.classList.remove('xgplayer-skin-default');
                }
                addEle = true;
            }
            if(!urlReq){
                getReuqest();
                urlReq = true;
            }

            if(typeof Playerjs == 'function' && videoUrl.length != 0 && !canPlay) {
                console.log('加载视频...')
                playVideo()
                canPlay = true;
                showVideoUrlAddress(videoUrl);
                clearInterval(changeTime);
                console.log('执行结束')

            }
        }
    }
    function playVideo(){
        var player = new Playerjs({
            id: "iplayer",
            file: videoUrl,
            poster: videoImg,

        });
        function handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                player.api("pause");
            } else if (document.visibilityState === 'visible') {
                player.api("play");
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange, false);
    }

    function getReuqest(){
        var requireData = {'method':'GET', 'headers':'', 'data':'', 'url':document.location.origin + '/newembed/'+ location.href.split('/')[4]};
        GM_xmlhttpRequest({
            method: requireData.method, //请求方法 GET POST
            headers: requireData.headers ,
            data: JSON.stringify(requireData.data), //通过 POST 请求发送的字符串
            timeout: 10000, //超时（毫秒）
            responseType: "json", //响应的数据类型 text arraybuffer blob document json
            overrideMimeType: "text/xml", //请求的 MIME 类型
            url: requireData.url,
            onload: function (xhr,status) {
                //如果加载了请求，则要执行的回调
                console.log("请求返回结果",xhr);
                console.log("请求状态",xhr.status);
                console.log("请求返回值",xhr.response);
                // 试看视频链接
                let shikanVideoUrl = null;
                // 拼接sign
                let paramOne = "";
                //处理参数
                let videoParam = null;
                // 最终视频地址
                let videoBase =null;

                if (xhr.status == 404){
                    console.log("请求由于超时而失败，将重新请求");
                    return;
                }else{
                    shikanVideoUrl = 'https'+(xhr.responseText.split("url = '")[1].split('index.m3u8')[0]+'index.m3u8').split('https')[1];
                    videoBase = shikanVideoUrl.replaceAll('j9.avstatic.com', 'newa.yuk.jb-aiwei.cc');
                }
                console.log("播放地址：",videoBase);
                if (videoBase == null ||(videoBase.indexOf('m3u8') == -1 && videoBase.indexOf('mp4') == -1)){
                    throw new Error(errorDict.RequestVideoUrlError);
                }
                videoUrl = videoBase;
            }
        });
    }
})();