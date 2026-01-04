// ==UserScript==
// @name         极空间Evolved
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  极空间的增强脚本
// @author       Jeff1125
// @match        *://*/home/player*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @require      https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// @icon         https://zconnect.cn/home/static/img/video@2x.c5cbce85.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496033/%E6%9E%81%E7%A9%BA%E9%97%B4Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/496033/%E6%9E%81%E7%A9%BA%E9%97%B4Evolved.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setConditionInterval(callback, condition, ms){
        if(condition()){
            callback();
            return;
        }
        let stop = 0;
        stop = setInterval(()=>{
            if(condition()){
                clearInterval(stop);
                callback();
            }
        },ms)
    }

    console.log("极空间Evolved ---> 启动")
    console.log("极空间Evolved ---> document状态：" + document.readyState)
    document.addEventListener('readystatechange', () => console.log("极空间Evolved ---> document状态变化为：" + document.readyState));
    // 字幕内容修正
    console.log("极空间Evolved ---> 字幕内容修正初始化")
    ajaxHooker.hook(request => {
        if (request.url.includes(".srt")) {
            console.log("极空间Evolved ---> 字幕内容修正中")
            request.response = res => {
                console.log(res)
                res.responseText = res.responseText.replaceAll(/{.*?}/g,"");
            };
        }
    });
    // 样式设置
    let isSetSubStyle = false;
    let rules = [];
    const setSubtitleStyle = () => {
        const video = document.querySelector("video");
        const subtitleArea = document.querySelector(".subtitleArea");
        const videoWidth = video?.clientWidth;
        const videoHeight = video?.clientHeight;
        if (!isSetSubStyle && subtitleArea && videoWidth && videoHeight) {
            isSetSubStyle = true;

            const sheet = document.styleSheets[0];

            for (const rule of rules) {
                if(rule instanceof CSSRule){
                    sheet.deleteRule([...sheet.cssRules].indexOf(rule))
                }
            }

            const cssList = [
                `
                .subtitleArea.subtitleArea.subtitleArea {
                    color:#ffffff!important;
                    font-family:'黑体'!important;
                    font-size:${videoHeight / 20}px!important;
                    bottom:${videoHeight / 40}px!important;
                    line-height: 1em;
                }
                `,
                `
                .subtitleArea b {
                    color:#ffffff!important;
                    font-family:'黑体'!important;
                    font-size:${videoHeight / 20}px!important;
                }
                `,
                `
                .subtitleArea b b {
                    color:yellow!important;
                    font-family:'黑体'!important;
                    font-size:${videoHeight / 30}px!important;
                }
                `,
                `
                .subtitleArea span {
                    color:#ffffff!important;
                    font-family:'黑体'!important;
                    font-size:${videoHeight / 20}px!important;
                }
                `,
                `
                .subtitleArea span span {
                    color:yellow!important;
                    font-family:'黑体'!important;
                    font-size:${videoHeight / 30}px!important;
                }
                `,
            ];
            rules = cssList;



            for (let i = 0; i < cssList.length; i++) {
                sheet.insertRule(cssList[i], i);
                rules[i] = sheet.cssRules[i];
            }

            console.log("极空间Evolved ---> 设置样式完成")
        }
    };
    function setSubtitleSyleInit(){
        console.log("极空间Evolved ---> 样式设置初始化")
        setSubtitleStyle()
        let subStyleObserver = new MutationObserver(setSubtitleStyle);
        subStyleObserver.observe(document, {
            childList: true, // 观察直接子节点
            subtree: true, // 及其更低的后代节点
        });
    }
    setSubtitleSyleInit()
    window.addEventListener("resize", ()=>{
        console.log("极空间Evolved ---> 样式resize")
        isSetSubStyle = false
        setSubtitleStyle()
    });
    // 优先选择外挂字幕或者简体中文字幕
    function setChineseSubInit(){
        console.log("极空间Evolved ---> 自动选择中文字幕初始化")
        let setChinese = false;
        function setChineseSub(){
            const app = document.querySelector("#app")?.__vue__;
            if(app && app._isMounted){
                const player = app.$children[7]
                if(player&&player._isMounted){
                    setChinese = true;
                    let index = null;
                    let url = null;
                    let stopWatch = player.$watch("subtitleList",()=>{
                        const subtitleList = player.$data.subtitleList;
                        for(let i =0;i<subtitleList.length;i++){
                            let label = subtitleList[i].label
                            let curIndex = subtitleList[i].index;
                            let curUrl = subtitleList[i].url;
                            if(label.toLowerCase().includes("srt")){
                                index = curIndex;
                                url = curUrl;
                            }else if(label.includes("简体")){
                                index = curIndex;
                                url = curUrl;
                            }else if(label.includes("中文")){
                                index = curIndex;
                                url = curUrl;
                            }
                        }
                        if(index!=null&&url!=null){
                            player.$data.subtitleIndex = index;
                            player.getSrt(url,index);
                            stopWatch();
                        }
                    },{
                        immediate: true
                    })
                }
            }
        }

        setConditionInterval(setChineseSub,()=>{
            const app = document.querySelector("#app")?.__vue__;
            if(app && app._isMounted){
                const player = app.$children[7]
                if(player&&player._isMounted){
                    return true;
                }
            }
            return false;
        },100)
    }
    setChineseSubInit()
})();