// ==UserScript==
// @name         [视频]2022年普通高中三科统编教材国家级示范培训
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autoplay
// @author       hui
// @match        http://bjpep.gensee.com/webcast/site/vod/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449044/%5B%E8%A7%86%E9%A2%91%5D2022%E5%B9%B4%E6%99%AE%E9%80%9A%E9%AB%98%E4%B8%AD%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9B%BD%E5%AE%B6%E7%BA%A7%E7%A4%BA%E8%8C%83%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/449044/%5B%E8%A7%86%E9%A2%91%5D2022%E5%B9%B4%E6%99%AE%E9%80%9A%E9%AB%98%E4%B8%AD%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9B%BD%E5%AE%B6%E7%BA%A7%E7%A4%BA%E8%8C%83%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var WaitTime=0
    var SeeTime=0
    var id=setInterval(function(){
        //点击播放
        if(document.getElementById('videoStartBtn')!=null & document.getElementById('videoStartBtn').style.display=="block"){
            document.getElementById('videoStartBtn').click()
            SeeTime++
        }
        //静音
        if(document.getElementsByClassName('volume volume_voice col_close col_close_stop')[0]==null & document.getElementsByClassName('volume volume_voice')[0]!=null ){
            document.getElementsByClassName('volume volume_voice')[0].click()
        }
        //最高16倍速
        if(document.querySelector("video").playbackRate!=null) {document.querySelector("video").playbackRate = 16};
        if(SeeTime>1){
            window.close()
        }
        WaitTime++
        if(WaitTime>10 & SeeTime==0){
            location.reload()
        }
    },6*1000)
    // Your code here...
    })();