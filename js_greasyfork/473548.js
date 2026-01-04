// ==UserScript==
// @name         小天鹅
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小天鹅VIP视频播放，去除游戏，广告，小天鹅直播为录播，挂羊头卖狗肉骗人下载APP的

// @author       third_e
// @license      MIT

// @include      /^https:\/\/xte.*\.(xyz)*/

// @icon         data:image/png;base64,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

// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://unpkg.com/ajax-hook@3.0.1/dist/ajaxhook.min.js
// @require      https://greasyfork.org/scripts/473545-ajax-hook-thirde/code/ajax-hook-thirde.js?version=1238372

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473548/%E5%B0%8F%E5%A4%A9%E9%B9%85.user.js
// @updateURL https://update.greasyfork.org/scripts/473548/%E5%B0%8F%E5%A4%A9%E9%B9%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addScriptJs(src) {
        let script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    // 油猴不兼容未定义则加载
    if("undefined" == typeof CryptoJS){
        console.log('加载crypto')
        addScriptJs("https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js")
    }
    // 油猴不兼容未定义则加载
    if("undefined" == typeof ah){
        console.log('加载ajaxhook')
        addScriptJs("https://unpkg.com/ajax-hook@3.0.1/dist/ajaxhook.min.js")
    }
    // unpkg.com 加载失败用自定义库加载
    if("undefined" == typeof ah){
        console.log('加载ajaxhook')
        addScriptJs("https://greasyfork.org/scripts/473545-ajax-hook-thirde/code/ajax-hook-thirde.js?version=1238372")
    }


    //小天鹅解密
    function jiemi (t) {
        // 加密解密参数
        var r = (CryptoJS.enc.Base64,CryptoJS.enc.Utf8.parse("2c4add8f849a7bea"))
        , o = CryptoJS.enc.Utf8.parse("dc4b73b33e69eaff")
        var e = (decodeURIComponent(t) + "").replace(/\n*$/g, "").replace(/\n/g, "");
        return CryptoJS.AES.decrypt(e, r, {
            iv: o,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8).toString()
    }

    // 小天鹅加密
    function jiami (t) {
        // 加密解密参数
        var r = (CryptoJS.enc.Base64,CryptoJS.enc.Utf8.parse("2c4add8f849a7bea"))
        , o = CryptoJS.enc.Utf8.parse("dc4b73b33e69eaff")
        var e = CryptoJS.enc.Utf8.parse(t);
        return CryptoJS.AES.encrypt(e, r, {
            iv: o,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    }

    // 请求监听
    const { unHook, originXhr } = ah.proxy({

        onResponse: (response, handler) => {
            if(response.headers["content-type"] != "video/mp2t"){
                console.log("====",response)
            }
            // 账号信息修改
            if (response.config.url.indexOf("user/getUserInfoByToken") != -1 ||
                response.config.url.indexOf("user/gustRegister") != -1 ||
                response.config.url.indexOf("user/phoneLogin") != -1) {
                // 转换成json对象
                let modifyResponse = JSON.parse(response.response)
                // 获取加密数据
                let data = modifyResponse.data

                //console.log(self)
                // 解密
                console.log(jiemi(data))
                data = JSON.parse(jiemi(data))
                // VIP
                data.vip_level = 1
                // 视频播放次数
                data.daily.video = 10

                data = JSON.stringify(data)
                data = jiami(data)
                modifyResponse.data = data
                response.response = JSON.stringify(modifyResponse)
            }
            // 可以播放信息修改
            if(response.config.url.indexOf("video/isCanPlay")!= -1){
                // 不可播放内容
                // "{\"status\":false,\"code\":0,\"msg\":\"vip已过期\"}"
                if(response.response == "{\"status\":false,\"code\":0,\"msg\":\"vip已过期\"}"){
                    response.response = "{\"status\":true,\"code\":1,\"msg\":\"操作成功\",\"data\":\"9%2BpXwVLXHV4c%2Bu41qdcHtw%3D%3D\"}"
                }
            }
            // 视频播放地址显示
            if(response.config.url.indexOf("index.m3u8")!= -1 || response.headers["content-type"]=="application/vnd.apple.mpegurl"){
                showVideoUrlAddress(response.config.url)
            }
            handler.next(response)
        }
    })

    // 显示视频地址
    function showVideoUrlAddress(videoUrl){
        // 显示视频链接
        let titleName = null;
        var address = document.getElementById("my_add_dizhi");
        if(document.getElementById("my_add_dizhi") != null){address.parentNode.removeChild(address);}
        address = document.createElement('div');
        address.innerHTML = `<div id="my_add_dizhi" style="color:red;font-size:14px;word-break:break-all"><p style="color:red;font-size:14px">视频地址：<a href="${videoUrl}" target="_blank">${videoUrl}</a></p>`;

        // 显示视频链接地址
        titleName = document.querySelector(".TitleYi")?.children[0];
        if(titleName != null){titleName.after(address);}
    }


    // 去除多余的广告
    var CheckAdverTime = setInterval(startCheckAdver , 1500);
    function startCheckAdver(){
        if(document.querySelector(".fixed-activity") != null){
            document.querySelector(".fixed-activity").remove()
        }
        if(document.querySelector(".mask") != null){
            document.querySelector(".mask").remove()
        }
        if(document.querySelector(".top-banner") != null){
            document.querySelector(".top-banner").remove()
        }
        if(document.getElementsByClassName("van-hairline--top-bottom van-tabbar van-tabbar--fixed")[0] != null &&
           document.getElementsByClassName("van-hairline--top-bottom van-tabbar van-tabbar--fixed")[0].children.length == 5){
            let elem = document.getElementsByClassName("van-hairline--top-bottom van-tabbar van-tabbar--fixed")[0];
            del(Array(elem.children[2], elem.children[3]))
        }
        if(document.querySelectorAll(".HomepageRecommendationBox").length != 0){
            del(document.querySelectorAll(".HomepageRecommendationBox"))
        }
        if(document.querySelectorAll(".video-a-d-v").length != 0){
            del(document.querySelectorAll(".video-a-d-v"))
        }
    }
    function del(ele){
        ele.forEach(e =>{ e.remove()})
    }
})();