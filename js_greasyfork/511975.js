// ==UserScript==
// @name        UOOC和U校园ai版自动解除失去焦点暂停、检测确认按钮、自动重播刷时长（！！！自行更新配置，在代码配置里面！！！）
// @namespace   Violentmonkey Scripts
// @match       https://www.uooc.net.cn/*
// @match       http://www.uooc.net.cn/*
// @match       http://ucloud.unipus.cn/home*
// @match       https://ucloud.unipus.cn/home*
// @match       https://ucontent.unipus.cn/_explorationpc_default/pc.html*
// @match       http://ucontent.unipus.cn/_explorationpc_default/pc.html*
// @match       https://ucontent.unipus.cn/_explorationpc__default/pc.html*
// @match       http://ucontent.unipus.cn/_explorationpc__default/pc.html*
// @match       https://ucloud.unipus.cn/app/cmgt/*
// @match       http://ucloud.unipus.cn/*
// @match       https://ucloud.unipus.cn/*
// @match       *://ucontent.unipus.cn/_pc_default/pc.html?*
// @grant       none
// @version     2.1
// @author      -Bright J
// @description 2024/10/9 12:58:31
// @downloadURL https://update.greasyfork.org/scripts/511975/UOOC%E5%92%8CU%E6%A0%A1%E5%9B%ADai%E7%89%88%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%99%A4%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E6%9A%82%E5%81%9C%E3%80%81%E6%A3%80%E6%B5%8B%E7%A1%AE%E8%AE%A4%E6%8C%89%E9%92%AE%E3%80%81%E8%87%AA%E5%8A%A8%E9%87%8D%E6%92%AD%E5%88%B7%E6%97%B6%E9%95%BF%EF%BC%88%EF%BC%81%EF%BC%81%EF%BC%81%E8%87%AA%E8%A1%8C%E6%9B%B4%E6%96%B0%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%9C%A8%E4%BB%A3%E7%A0%81%E9%85%8D%E7%BD%AE%E9%87%8C%E9%9D%A2%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/511975/UOOC%E5%92%8CU%E6%A0%A1%E5%9B%ADai%E7%89%88%E8%87%AA%E5%8A%A8%E8%A7%A3%E9%99%A4%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E6%9A%82%E5%81%9C%E3%80%81%E6%A3%80%E6%B5%8B%E7%A1%AE%E8%AE%A4%E6%8C%89%E9%92%AE%E3%80%81%E8%87%AA%E5%8A%A8%E9%87%8D%E6%92%AD%E5%88%B7%E6%97%B6%E9%95%BF%EF%BC%88%EF%BC%81%EF%BC%81%EF%BC%81%E8%87%AA%E8%A1%8C%E6%9B%B4%E6%96%B0%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%9C%A8%E4%BB%A3%E7%A0%81%E9%85%8D%E7%BD%AE%E9%87%8C%E9%9D%A2%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==


const config = {
    releasePause: true, // 是否自动解除视频暂停
    repeated: true,    // 是否重复播放视频
    clickProp: true,    // 是否点击确定
    autoPlay: true,     // 是否自动播放视频
    volume: 0,        // 视频音量0~100
}


var currentvideo = document.getElementsByTagName('video')[0];

const autoPlayVideo = function () {
    /**
     * 自动播放视频
     */
    if (config.autoPlay) {
        console.log('自动播放视频')
        currentvideo.play();
    }
}


document.addEventListener('click', function (event) {

    console.log("点击事件，重新获取此时视频对象");
    currentvideo = document.getElementsByTagName('video')[0];

    autoPlayVideo();
});


var intervalId = setInterval(function () {
    if (currentvideo) {
        clearInterval(intervalId); // 关闭本循环
        currentvideo.currentTime = 0;
        autoPlayVideo();
        /**
         * 设置属性
         */
        currentvideo.volume = config.volume / 100;


        /**
         * 视频播放暂停立马自动解除
         */
        if (config.releasePause) {
            setInterval(function () {
                if (currentvideo.paused && currentvideo.duration != currentvideo.currentTime && (currentvideo.currentTime != 0 || config.autoPlay)) {
                    console.log('检测到视频暂停，重新播放')
                    currentvideo.play();
                }
            }, 1000);
        }


        /***
         * 自动重复播放视频
         */
        if (config.repeated) {
            setInterval(function () {
                // 监听视频播放结束事件
                currentvideo.addEventListener('ended', function () {
                    console.log('视频结束，重复播放')
                    // 当视频播放结束时，重置视频播放时间到开始
                    currentvideo.currentTime = 0;
                    // 再次播放视频
                    currentvideo.play();
                });
            }, 1000);
        }



        /**
         * 点击弹窗确认按钮
         */
        if (config.clickProp) {
            var checkInterval = setInterval(function () {
                // 检查是否存在包含“确定”文本的按钮
                setTimeout(function () {
                    console.log('检测确认按钮');
                    var confirmButton = document.evaluate('//button[text()="确定"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (confirmButton) {
                        // 模拟点击“确定”按钮
                        confirmButton.click();
                    }
                }, 3000);
            }, 3000);
        }
    } else {
        console.log('等待视频加载，确认加载完成依旧重复这句话则是没有识别到网页视频。。。')
        currentvideo = document.getElementsByTagName('video')[0];
    }
}, 1000)