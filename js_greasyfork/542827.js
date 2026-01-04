// ==UserScript==
// @name         网页防沉迷（小红书、知乎）
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  小红书、知乎的网页端，用悬浮窗遮盖推荐内容，但保留搜索功能。悬浮窗上的警示文字可以自定义修改，修改方式见下方说明。
// @author       interest2
// @match        https://www.xiaohongshu.com/*
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/542827/%E7%BD%91%E9%A1%B5%E9%98%B2%E6%B2%89%E8%BF%B7%EF%BC%88%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542827/%E7%BD%91%E9%A1%B5%E9%98%B2%E6%B2%89%E8%BF%B7%EF%BC%88%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("my script start");

    const CUSTOM_CONTENT = "有志者事竟成";
    const TEXT_SIZE = "50px";
    const TEXT_COLOR = "#CC0000";


    let xhsItems = ["search_result", "pc_search"];
    let zhihuItems = ["hot"];

    let url = window.location.href;

    let site = 0;
    const keywords = {
        "xiaohongshu": 0,
        "zhihu": 1
    };
    // 根据当前网址关键词，设置site值
    for (const keyword in keywords) {
        if (url.indexOf(keyword) > -1) {
            site = keywords[keyword];
            break;
        }
    }


    setInterval(monitor, 500);

    function monitor(){
        if(site === 0){
            let targetElement = document.getElementById('exploreFeeds');
            let url = window.location.href;
            let blockFlag = true;
            for(let i=0; i<xhsItems.length; i++){
                if(url.indexOf(xhsItems[i]) > -1){
                    blockFlag = false;
                }
            }
            if(blockFlag){
                console.log("hello");
                if (!isEmpty(targetElement)) {
                    addOverlay(targetElement);
                }else{
                   removeOverlay();
                }
            }else{
                removeOverlay();
            }
        }else{
            let zhihuBlock = false;
            let hot = document.getElementsByClassName("Topstory-mainColumnCard");
            for(let i=0; i<zhihuItems.length; i++){
                if(url.indexOf(zhihuItems[i]) > -1){
                    zhihuBlock = true;
                }
            }
            if(zhihuBlock && !isEmpty(hot) && hot.length > 0){
                addOverlay(hot[0]);
            }else{
                removeOverlay();
            }
        }
    }

    function removeOverlay(){
        let overlay = document.getElementById('overlay');
        if(!isEmpty(overlay)){
            document.body.removeChild(overlay);
        }
    }

    function addOverlay(targetElement) {
        let overlay = document.getElementById('overlay');
        if(!isEmpty(overlay)){
            if(overlay.style.display === "none"){
                overlay.style.display === "block";
            }else{
                return;
            }
        }

        overlay = document.createElement('div');

        // 设置覆盖层的样式
        overlay.textContent = CUSTOM_CONTENT;
        overlay.style.fontSize = TEXT_SIZE;
        overlay.style.color = TEXT_COLOR;

        overlay.style.padding = '30px';
        overlay.style.position = 'absolute';
        overlay.style.top = '10px';
        overlay.style.left = '10px';
        overlay.style.width = '100%';
        overlay.style.height = '300%';
        overlay.style.backgroundColor = 'rgba(255, 255, 204, 1)'; // 浅黄色
        overlay.style.pointerEvents = 'none'; // 允许点击穿透覆盖层
        overlay.style.zIndex = '9999'; // 设置较高的z-index值，确保覆盖层在顶部

        overlay.id = "overlay";
        // overlay.style.display="none";

        // 获取目标元素的位置和尺寸
        const rect = targetElement.getBoundingClientRect();

        // 设置覆盖层的位置
        overlay.style.left = rect.left + "px";
        overlay.style.top = rect.top + "px";

        // 将覆盖层添加到文档中
        document.body.appendChild(overlay);
        return overlay;
    }


    function isEmpty(item){
        if(item===null || item===undefined || item.length===0){
            return true;
        }else{
            return false;
        }
    }


})();