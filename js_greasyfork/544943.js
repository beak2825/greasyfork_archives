// ==UserScript==
// @name         建行学习刷课脚本1.1版本
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  一键静音，一键加速，一键评论
// @author       听说你很会玩
// @match        https://u.ccb.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccb.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //关闭debugger断点
    window.debugger = function(){};
    Function.prototype.constructor = function() {};
    function waitForVideo() {
        // 尝试穿透Shadow DOM
        const findVideoInShadow = (node) => {
            if (node instanceof ShadowRoot) {
                const video = node.querySelector('video');
                if (video) return video;
                for (const child of node.children) {
                    const result = findVideoInShadow(child);
                    if (result) return result;
                }
            }
            return null;
        };

        // 常规查找
        let video = document.querySelector('video');
        if (video) return video;

        // 查找iframe
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                // 尝试访问同源iframe
                if (iframe.contentDocument) {
                    video = iframe.contentDocument.querySelector('video');
                    if (video) return video;
                }
            } catch (e) {
                // 跨域iframe会抛出安全错误
                console.log('无法访问iframe内容:', e);
            }
        }

        // 查找Shadow DOM
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const video = findVideoInShadow(el.shadowRoot);
            if (video) return video;
        }

        return null;
    }

    // 模拟用户点击
    function simulateClick(element) {
        console.log("模拟用户点击...");
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(event);
        setTimeout(() => {
            if (element.paused) {
                console.log("模拟点击失败，尝试直接播放");
                element.play().catch(e => console.log(`直接播放失败: ${e}`));
            }
        }, 500);
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        const video = waitForVideo();
        if (video) {
            observer.disconnect();
            console.log('找到视频元素:', video);
            // 在这里处理视频元素
            console.log("当前视频的播放速度为："+video.playbackRate+"倍速");
            // 2.输入您的视频播放速度


            video.muted = true;//静音
            // 尝试播放
            const playPromise = video.play();

            console.log("视频自动播放成功了"+playPromise);

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("自动播放成功!");
                    video.muted = false; // 尝试取消静音
                }).catch(error => {
                    console.log("自动播放失败: {"+error+"}");
                    simulateClick(video);
                });
            }


            //获取留言板便签类
            let Message = document.getElementsByClassName("el-form")[0];

            if(Message == undefined){
                Message = document.getElementsByClassName("textarea-content")[0]
            }
            //创建第一个按钮
            const button1 = document.createElement('button');
            button1.id = 'dynamicBtn1';
            button1.className = 'btn btn-primary';
            button1.innerHTML = '取消静音';
            button1.onclick = function (){
                video.muted = !video.muted;//取消静音

                switch (video.muted){
                    case false:
                        button1.innerHTML = '静音';
                        break;
                    case true:
                        button1.innerHTML = '取消静音';
                        break;
                }
            }

            // 创建第二个按钮
            const button2 = document.createElement('button');
            button2.id = 'dynamicBtn2';
            button2.className = 'btn btn-secondary';
            button2.innerHTML = '视频加速';
            button2.onclick = function (){
                video.playbackRate++;
                console.log("当前视频播放速度为"+video.playbackRate+"倍速！！！");

                if(video.playbackRate >= 16){

                    alert("视频最大播放速度为16倍速！！！");
                    video.playbackRate = 16;
                }
            }
            //创建第三个按钮
            const button3 = document.createElement('button');
            button3.id = 'dynamicBtn3';
            button3.className = 'btn btn-third';
            button3.innerHTML = '一键留言评论';
            button3.onclick = function (){
                const messageArea = document.getElementsByTagName("textarea")[0];//获取留言文本内容框
                const push1 = document.getElementsByClassName("el-button fr el-button--primary el-button--mini is-round")[0];//获取发表按钮
                console.log("添加留言板！！")

                // 设置textarea的值
                messageArea.value = "视频讲解很详细！向优秀看齐！";

                push1.click();




            }

            // 添加到容器
            Message.appendChild(button1);
            Message.appendChild(button2);
            Message.appendChild(button3);


        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // 初始检查
    const video = waitForVideo();
    if (video) {
        console.log('立即找到视频元素:', video);
    }
})();