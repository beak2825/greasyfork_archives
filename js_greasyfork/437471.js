// ==UserScript==
// @name         公众号阅读恢复音视频播放、二维码等
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  可以恢复因地址错误无法播放的音频、可以恢复因地址错误无法播放的视频（目前仅限微信公众号源）
// @author       kbtx
// @match        https://kbtxwer.gitee.io/blog*.html
// @match        https://kbtxwer.github.io/blog*.html
// @icon         https://www.google.com/s2/favicons?domain=github.io
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437471/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%85%E8%AF%BB%E6%81%A2%E5%A4%8D%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E3%80%81%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/437471/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%85%E8%AF%BB%E6%81%A2%E5%A4%8D%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E3%80%81%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        //获取原文链接
        let og_url = document.head.querySelector("meta[property~='og:url']").content;
        //点击标题可以阅读原文
        document.querySelector("#activity-name").onclick = function(e){
            window.open(og_url)
        }
        //将所有音频替换为直接加载
        let audioTags = document.getElementsByTagName("mpvoice")||[]
        audioTags.length && [...audioTags].forEach((item,index)=>{
            let src = 'https://res.wx.qq.com/voice/getvoice?mediaid=' + item.getAttribute('voice_encode_fileid')
            let audioTag = document.createElement('audio')
            audioTag.setAttribute("controls","controls")
            audioTag.setAttribute("src",src)
            audioTag.setAttribute("title",item.getAttribute('name'))
            item.parentNode.append(audioTag)
        })

        //将所有的微信公众号上传视频替换为直接加载
        let videoFrames = document.getElementsByClassName('video_iframe')||[]
        videoFrames.length && [...videoFrames].forEach((item,index)=>{
            let data_cover = unescape(item.getAttribute("data-cover"))
            console.log(data_cover)
            let src = item.src
            let ahref = document.createElement('a')
            ahref.setAttribute("href",src)
            let imgTag = document.createElement('img')
            imgTag.setAttribute("src",data_cover)
            let promotTag = document.createElement('p')
            promotTag.innerText = '增强插件提示：点击下图可观看视频'
            ahref.append(promotTag)
            ahref.append(imgTag)
            ahref.setAttribute('target','_blank')//target="_blank"
            item.parentNode.append(ahref)
        })

        //将所有的腾讯视频上传视频替换为直接加载
        setTimeout(()=>{
            //移除原版加载错误的提示
            let audioTags = document.getElementsByClassName("js_audio_frame db pages_reset audio_area")||[]
            while(audioTags.length > 0){
                audioTags[0].remove()
                console.log('remove')
            }
            //移除原版视频加载错误的提示
            let videoTags = document.getElementsByClassName("js_img_loading db")||[]
            while(videoTags.length > 0){
                videoTags[0].remove()
                console.log('remove')
            }
            //重新显示出公众号二维码
            let js_pc_qr_code_img = document.querySelector("#js_pc_qr_code_img")
            js_pc_qr_code_img.setAttribute("src",'https://mp.weixin.qq.com' + js_pc_qr_code_img.getAttribute('src'))
        },2000)
    }
})();