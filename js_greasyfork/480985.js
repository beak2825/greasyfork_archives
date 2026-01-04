// ==UserScript==
// @name         硬核影视相关
// @namespace    http://tampermonkey.net/
// @version      0.6.3
// @description  反调试参考链接：https://zhuanlan.zhihu.com/p/624988530?utm_id=0
// @author       啦A多梦
// @license      MIT
// @match        *://dyxs31.com/*
// @match        *://waipian28.com/*
// @match        *://www.taozi007.com/*
// @match        *://www.oftens.top/*
// @match        *://video.m3u8.cloud/*
// @match        *://yinghe.app/*
// @match        *://jx.xmflv.cc/*
// @match        *://www.mp4us.com/*
// @match        *://www.dogsfun.fun/*
// @match        *://www.aucfox.fun/*
// @icon         *://www.google.com/s2/favicons?sz=64&domain=dyxs31.com
// @webRequest   [{"selector": "*://pc.stgowan.com/pc/beitou-tf.js", "action": "cancel"},{"selector": "*://pc.stgowan.com/pc/rich-tf.js", "action": "cancel"}]
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480985/%E7%A1%AC%E6%A0%B8%E5%BD%B1%E8%A7%86%E7%9B%B8%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/480985/%E7%A1%AC%E6%A0%B8%E5%BD%B1%E8%A7%86%E7%9B%B8%E5%85%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //去除页面多余广告
//=============for safari=====================
    if((/iphone|ipad|apple|ios/i).test(navigator.userAgent)){
        var style = document.createElement("style");
        style.innerHTML = ".hengfu, .ads_w, #progress-ball, #rm-float, .ads_w, #player_pic,.rm-two,#dy_card_dy, .pause-ad, div.player-rm.rm-one.rm-list, .player-rm.rm-one.rm-list, .player-logo, .pause-ad, .hl-player-notice, #rm-float, .ads_w, #player_pic,.rm-two,#dy_card_dy, .pause-ad {display: none !important}";
        document.head.appendChild(style);
    }

//============for other=======================
    GM_addStyle(".player-rm.rm-one.rm-list, .player-logo, .pause-ad, .hl-player-notice, #rm-float, .ads_w, #player_pic,.rm-two,#dy_card_dy {display: none !important}");

    //反调试处理
    let Function_backup = unsafeWindow.Function;
    unsafeWindow.Function = function(a){
        if (a.indexOf('bugger') != -1){
//            console.log("拦截了debugger，中断不会发生1");
            return 0;
        }else{
            return Function_backup(a)
        }
    }

    var _setInterval = unsafeWindow.setInterval;
    unsafeWindow.setInterval = function(a,b){
        if(a.toString().indexOf("debug")!=-1){
            console.log("成功拦截setInterval(debugger)函数");
            return
        }else{
            _setInterval(a,b);
        }
    }

    var eval_bak = unsafeWindow.eval;
    unsafeWindow.eval = function(a){
        if(a.toString().indexOf("debug")!=-1){
            console.log("成功拦截eval(debugger)函数");
            return
        }else{
            eval_bak(a);
        }
    }

    //获取m3u8地址去广告
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        if (url.indexOf(".m3u8") != -1) {
            console.log("捕获m3u8地址->",url);
            // console.log(this.readyState);
            this.addEventListener("readystatechange", function () {
                if(this.readyState == 4){
                    var _responsetext = this.responseText;
                    // console.log(_responsetext);
                    Object.defineProperty(this, "responseText",{
                        writable: true,
                    });
                    // _responsetext = _responsetext.replace(/#EXTINF:5,\n\/20231124([\s\S]*?)#EXT-X-DISCONTINUITY\n/, "").replace(/#EXT-X-DISCONTINUITY\n#EXT-X-KEY([\s\S]*?)#EXT-X-DISCONTINUITY\n/, "");
                    try{
                        let sta,st1,st2,st3;
                        st1 = _responsetext.match(/#EXTINF.*?,\n(.*?)\n/g)[Math.round(Math.random()*_responsetext.match(/#EXTINF.*?,\n(.*?)\n/g).length)].match(/\n(.*?)\n/)[1];
                        st2 = _responsetext.match(/#EXTINF.*?,\n(.*?)\n/g)[Math.round(Math.random()*_responsetext.match(/#EXTINF.*?,\n(.*?)\n/g).length)].match(/\n(.*?)\n/)[1];
                        st3 = _responsetext.match(/#EXTINF.*?,\n(.*?)\n/g)[Math.round(Math.random()*_responsetext.match(/#EXTINF.*?,\n(.*?)\n/g).length)].match(/\n(.*?)\n/)[1];
                        console.log(st1);
                        console.log(st2);
                        console.log(st3);
                        if(st1.substr(0,Math.floor(st1.length-7)) == st2.substr(0,Math.floor(st2.length-7)) && st1.substr(0,Math.floor(st1.length-7)) == st3.substr(0,Math.floor(st3.length-7))){
                            sta = st1.substr(0,Math.floor(st1.length-7));
                        }else if(st1.substr(0,Math.floor(st1.length-7)) == st2.substr(0,Math.floor(st2.length-7)) && st1.substr(0,Math.floor(st1.length-7)) != st3.substr(0,Math.floor(st3.length-7))){
                            sta = st1.substr(0,Math.floor(st1.length-7));
                        }else if(st1.substr(0,Math.floor(st1.length-7)) != st2.substr(0,Math.floor(st2.length-7)) && st1.substr(0,Math.floor(st1.length-7)) == st3.substr(0,Math.floor(st3.length-7))){
                            sta = st1.substr(0,Math.floor(st1.length-7));
                        }else{
                            sta = st2.substr(0,Math.floor(st2.length-7));
                        }
                        if(sta.length > 20){sta = sta.substr(0,20)}
                        let rpst = _responsetext.match(/#EXTINF.*?,\n(.*?)\n/g);
                        let adstart;
                        for(let i = 0; i < rpst.length; i++){
                            if(rpst[i].match(/\n(.*?)\n/)[1].substr(0,sta.length) != sta){
                                adstart = rpst[i].match(/\n(.*?)\n/)[1].substr(0,Math.floor(rpst[i].match(/\n(.*?)\n/)[1].length-7));
                                break;
                            }
                        }
                        if (adstart != null && adstart.length - sta.length > 5) {
                            adstart = adstart.substr(0, sta.length);
                        }
                        console.log("adstart = ", adstart);
                        let res = new RegExp("#EXTINF.*?,\\n" + adstart + ".*?\\n", "g");
                        // console.log(_responsetext.match(res));
                        let resl = _responsetext.match(res).length;
                        for (let i = 0; i<resl; i++){
                            _responsetext = _responsetext.replace(res, "").replace("#EXT-X-DISCONTINUITY\n#EXT-X-DISCONTINUITY\n", "");
                        }
                    }catch{}
                    this.responseText = _responsetext;
                    console.log(this.responseText);
                }
            })
        }

        return open.apply(this, arguments);
    }

    // 全屏自动横屏显示
    document.addEventListener("fullscreenchange", function() {
        if(document.querySelector("video")){
            if (document.fullscreen) {
                console.log("进入全屏");
                window.screen.orientation.lock('landscape');
            } else {
                console.log("退出全屏");
                window.screen.orientation.unlock();
            }
        }
    });

    //去除顶部水印
    window.onload = function(){
        try {
            if(document.querySelector("track").src.indexOf("subtitle.vtt") != -1){
                document.querySelector("track").src = ""
            }
        }catch{}
        if(document.querySelector("form") && document.querySelector("form").action == 'https://soupian.plus/search?key=%s%'){
            document.querySelector("form").action = 'https://soupian.pro/search?key=%s%';
        }
        if(document.querySelector("video")){
            document.querySelector("video").setAttribute("x5-video-orientation", "landscape");
        }
    }
})();