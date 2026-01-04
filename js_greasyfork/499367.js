// ==UserScript==
// @name         B站屏蔽器
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  在页面加载完成后执行，并在DOM更新后再次执行代码
// @author       脚本总是失效啊
// @license      MIT
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499367/B%E7%AB%99%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499367/B%E7%AB%99%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var words = ["关键词写这里，下面英文不用动",
                 "bili-video-card__info--creative-ad","bili-video-card__info--ad"]

    //给B站侧边栏添加样式防止删除后自动进行AJAX请求
    // var smallcards = document.querySelectorAll(".video-page-card-small")
    // console.log("这里是smallcards",smallcards);
    // if(smallcards !== undefined){
    //     smallcards.forEach(element => {
    //         element.style.width = '350px';
    //         element.style.height = '32.86px';
    //     });
    // }

    //获取油管上传者名单及视频标题
    function getuploader()
    {
        // 获取所有的 <p> 标签
        const hTags = document.querySelectorAll("h3")
        const uploaders = document.querySelectorAll("a")
        //遍历p标签获取对应的uploader
        for(var p in hTags){
            //判断上传者名称是否为undefined
            if(hTags[p].innerHTML!== undefined){

                //console.log(hTags[p].innerHTML)
                //检测是否含有关键词
                if(Identificationwords(hTags[p].innerHTML))
                    {
                        console.log("检测成功")
                        //删除相应视频
                        deleteVideo(hTags[p])
                        console.log("删除成功")
                    }

            }
        }
        //遍历标题标签获取相应标题
        for(var t in uploaders){
            if(uploaders[t].innerHTML!==undefined){
                //console.log(uploaders[t].innerHTML)
                if(Identificationwords(uploaders[t].innerHTML))
                    {
                        console.log("标题含有关键词")
                        deleteVideo(uploaders[t])
                    }
            }
        }
            }
    //查找是否包含关键词
    function Identificationwords(mainString)
    {
        for (var i = 0;i<words.length;i++)
            {
                if(mainString.includes(words[i]))
                    {
                        console.log("找到了")
                        return true
                    }

            }
        return false
    }
    //向上查找并删除视频的父元素
    function deleteVideo(deleteword)
    {
        if (deleteword.closest(".bili-video-card") !== null){
            deleteword.closest(".bili-video-card").style.visibility="hidden"
        }
        if (deleteword.closest(".feed-card")!== null){
            deleteword.closest(".feed-card").style.visibility="hidden"
        }
        if (deleteword.closest(".card-box")!== null){
            deleteword.closest(".card-box").style.visibility="hidden"
        }
        if (deleteword.closest(".floor-card")!== null){
            deleteword.closest(".floor-card").style.visibility="hidden"
        }
        if (deleteword.closest(".bili-live-card")!== null){
            deleteword.closest(".bili-live-card").style.visibility="hidden"
        }
        if (deleteword.closest("#bannerAd")!== null){
            deleteword.closest("#bannerAd").style.visibility="hidden"
        }
        if (deleteword.closest(".ad-report")!== null){
            deleteword.closest(".ad-report").style.visibility="hidden"
        }
        if (deleteword.closest("#slide_ad")!== null){
            deleteword.closest("#slide_ad").style.visibility="hidden"
        }
        if (deleteword.closest(".pop-live-small-mode")!== null){
            deleteword.closest(".pop-live-small-mode").style.visibility="hidden"
        }
    }
    // 定义你的功能函数
    function yourFunction() {
        document.querySelectorAll(".floor-single-card").forEach(function(a){
            a.style.visibility="hidden"
        })
        document.querySelectorAll(".activity-m-v1").forEach(function(a){
            a.style.visibility="hidden"
        })
        document.querySelectorAll(".video-card-ad-small").forEach(function(a){
            a.style.visibility="hidden"
        })
        document.querySelectorAll(".ad-floor-cover").forEach(function(a){
            a.style.visibility="hidden"
        })
        document.querySelectorAll(".slide-ad-exp").forEach(function(a){
            a.style.visibility="hidden"
        })

        // console.log('Function executed!');
        // 在这里添加你的代码，例如：
        // document.querySelectorAll('h1').forEach(el => el.style.color = 'red');
       getuploader()





















    }

    // 页面加载完成后执行一次
    window.addEventListener('load', yourFunction);






    // 保存原始的 open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;

    // 重写 open 方法
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            clearTimeout(x)
            var x = setTimeout(yourFunction,1000)






        return originalOpen.apply(this, [method, url, async, user, password]);
    };














    let timeout = null;
    const DEBOUNCE_DELAY = 500; // 延迟时间，毫秒

    // Function to be executed when all new elements are added
    function onAllElementsAdded() {
        console.log('All new elements have been added!');
        // 在所有新元素添加完毕后执行的函数
        yourFunction()
    }

    // Function to debounce the execution
    function debounce(callback, delay) {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }

    // Create a MutationObserver to listen for changes
    const observer = new MutationObserver((mutations) => {
        let newNodesAdded = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                newNodesAdded = true;
            }
        });
        if (newNodesAdded) {
            debounce(onAllElementsAdded, DEBOUNCE_DELAY);
        }
    });

    // Specify the target node and observer options
    const targetNode = document.body; // 可以根据需要调整
    const observerOptions = {
        childList: true,
        subtree: true
    };

    // Start observing the target node
    observer.observe(targetNode, observerOptions);

    console.log('MutationObserver is set up.');














    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察目标节点
    observer.observe(document.body, config);
})();
