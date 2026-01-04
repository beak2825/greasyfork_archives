// ==UserScript==
// @name         泛雅网络教学刷课倍速播放自动播放下一节
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  泛雅网络教学刷课倍速播放自动播放下一节，点开某一节课后点击上方16倍速播放视频按钮进入连续16倍速播放视频。
// @icon         https://www.zcloud.cool/favicon.ico
// @author       zjw
// @match        *://*.mooc1.chaoxing.com/mycourse/studentstudy*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403494/%E6%B3%9B%E9%9B%85%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%88%B7%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/403494/%E6%B3%9B%E9%9B%85%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%88%B7%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //初始化变量
    var Catalog = [], //目录树
        currentIndex //当前播放的视频索引

    //生成目录树方法
    var initCatalog = function () {
        var aNodeList = document.querySelectorAll('.cells .ncells h4 a')
        Array.prototype.forEach.call(aNodeList, function (item, index) {
            Catalog.push(item)
        })
        console.log(Catalog)
    }

    //获取当前播放视频索引
    var initCurrentIndex = function () {
        var h4NodeList = document.querySelectorAll('.cells .ncells h4')
        Array.prototype.forEach.call(h4NodeList, function (item, index) {
            if (item.className == 'currents') {
                currentIndex = index
                console.log('当前视频播放索引', currentIndex, item)
            }
        })
    }

    //查找视频并设置为16倍速播放
    var playVideo = function () {
        console.log('查找视频并设置为16倍速播放')
        var parentIframe = document.querySelector('#iframe')
        var parentIframeConent = parentIframe.contentWindow.document
        var videoIframe = parentIframeConent.querySelector('iframe')
        var videoIframeConent = videoIframe.contentWindow.document
        // var playBtn = videoIframeConent.querySelector('.vjs-big-play-button'),
        var videoObj = videoIframeConent.querySelector('#video_html5_api')
        videoObj.play()
        videoObj.playbackRate = 16
        videoObj.addEventListener('ended', function () { //结束
            var logConsole = Catalog[currentIndex].title
            console.log(logConsole+"播放结束,继续播放下一节");
            playNextVideo()
        }, false);
    }
    var playNextVideo = function(){
        //视频索引增长
        currentIndex++
        //播放下一节
        Catalog[currentIndex].click()
        setTimeout(playVideo,3000)
    }

    //生成16倍速视频播放按钮
    var addButton = function () {
        var mybtn = document.createElement('div')
        mybtn.innerText = '16倍播放视频'
        mybtn.style.position = 'fixed'
        mybtn.style.top = '6px'
        mybtn.style.left = '40%'
        // mybtn.style.transform = 'translateX(-50%)'
        mybtn.style.width = '80px'
        mybtn.style.padding = '8px'
        mybtn.style.background = '#479296'
        mybtn.style.color = '#fff'
        mybtn.style.cursor = 'pointer'
        mybtn.style.boxShadow = '0 0 4px #808080'
        mybtn.style.borderRadius = '5px'
        document.querySelector('body').appendChild(mybtn);
        mybtn.addEventListener('click', playVideo)
    }
    window.onload = function () {
        addButton()
        initCatalog()
        initCurrentIndex()
    }
})();